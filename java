class Pet {

    constructor(nome, raca, telefone, descricao, foto){

        this.nome = nome;
        this.raca = raca;
        this.telefone = telefone;
        this.descricao = descricao;
        this.foto = foto;
    }
}

const formulario = document.querySelector("#formPet");

if(formulario){

    formulario.addEventListener("submit", function(event){

        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const raca = document.querySelector("#raca").value;
        const telefone = document.querySelector("#telefone").value;
        const descricao = document.querySelector("#descricao").value;

        const arquivoFoto = document.querySelector("#foto").files[0];

        if(
            nome === "" ||
            raca === "" ||
            telefone === "" ||
            descricao === "" ||
            !arquivoFoto
        ){
            alert("Preencha todos os campos!");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function(){

            const novoPet = new Pet(
                nome,
                raca,
                telefone,
                descricao,
                leitor.result
            );

            let pets = JSON.parse(localStorage.getItem("pets")) || [];

            pets.push(novoPet);

            localStorage.setItem("pets", JSON.stringify(pets));

            alert("Pet cadastrado com sucesso!");

            formulario.reset();

            window.location.href = "pets.html";
        };

        leitor.readAsDataURL(arquivoFoto);
    });
}

const listaPets = document.querySelector(".cards");

if(listaPets){

    mostrarPets();
}

function mostrarPets(){

    const listaPets = document.querySelector(".cards");

    const pets = JSON.parse(localStorage.getItem("pets")) || [];

    listaPets.innerHTML = "";

    pets.forEach(function(pet, index){

        listaPets.innerHTML += `

        <div class="card">

            <img src="${pet.foto}" alt="${pet.nome}">

            <h3>${pet.nome}</h3>

            <p><strong>Raça:</strong> ${pet.raca}</p>

            <p>${pet.descricao}</p>

            <a href="https://wa.me/55${pet.telefone}" target="_blank">

                <button>
                    Entrar em contato
                </button>

            </a>

            <br><br>

            <button onclick="gerarPDF(${index})">
                Gerar Cartaz PDF
            </button>

            <br><br>

            <button onclick="removerPet(${index})">
                Remover Pet
            </button>

        </div>

        `;
    });
}

function gerarPDF(index){

    const pets = JSON.parse(localStorage.getItem("pets")) || [];

    const pet = pets[index];

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    // FUNDO
    pdf.setFillColor(245,245,245);
    pdf.rect(0,0,210,297,"F");

    // FAIXA SUPERIOR
    pdf.setFillColor(220,53,69);
    pdf.rect(0,0,210,45,"F");

    // TÍTULO
    pdf.setTextColor(255,255,255);

    pdf.setFont("helvetica","bold");

    pdf.setFontSize(38);

    pdf.text(
        "PERDIDO",
        105,
        28,
        { align: "center" }
    );

    // BORDA FOTO
    pdf.setFillColor(255,255,255);
    pdf.roundedRect(15,50,180,130,5,5,"F");

    // FOTO
    pdf.addImage(
        pet.foto,
        "JPEG",
        20,
        55,
        170,
        120
    );

    // NOME DO PET
    pdf.setTextColor(71,61,204);

    pdf.setFont("times","bolditalic");

    pdf.setFontSize(34);

    pdf.text(
        pet.nome.toUpperCase(),
        105,
        198,
        { align: "center" }
    );

    // LINHA DECORATIVA
    pdf.setDrawColor(255,145,77);

    pdf.setLineWidth(2);

    pdf.line(45,205,165,205);

    // SUBTÍTULO
    pdf.setTextColor(80,80,80);

    pdf.setFont("helvetica","bold");

    pdf.setFontSize(18);

    pdf.text(
        `Raça: ${pet.raca}`,
        20,
        222
    );

    // DESCRIÇÃO
    pdf.setFont("helvetica","normal");

    pdf.setFontSize(15);

    const descricaoLinhas = pdf.splitTextToSize(
        pet.descricao,
        170
    );

    pdf.text(
        descricaoLinhas,
        20,
        236
    );

    // FAIXA INFERIOR
    pdf.setFillColor(71,61,204);

    pdf.rect(0,255,210,42,"F");

    // TEXTO CONTATO
    pdf.setTextColor(255,255,255);

    pdf.setFont("helvetica","bold");

    pdf.setFontSize(20);

    pdf.text(
        "ENTRE EM CONTATO",
        105,
        270,
        { align: "center" }
    );

    pdf.setFontSize(26);

    pdf.text(
        pet.telefone,
        105,
        284,
        { align: "center" }
    );

    pdf.save(`${pet.nome}-cartaz.pdf`);
}

function removerPet(index){

    let pets = JSON.parse(localStorage.getItem("pets")) || [];

    const confirmar = confirm("Deseja remover este pet?");

    if(confirmar){

        pets.splice(index, 1);

        localStorage.setItem("pets", JSON.stringify(pets));

        mostrarPets();
    }
}
