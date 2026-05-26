class Pet {

    constructor(nome, raca, telefone, descricao, foto, cidade, bairro, dataPerda){

        this.nome = nome;
        this.raca = raca;
        this.telefone = telefone;
        this.descricao = descricao;
        this.foto = foto;

        this.cidade = cidade;
        this.bairro = bairro;

        // NOVO
        this.dataPerda = dataPerda;
    }
}


// ===============================
// CADASTRO
// ===============================
const formulario = document.querySelector("#formPet");

if(formulario){

    formulario.addEventListener("submit", function(event){

        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const raca = document.querySelector("#raca").value;
        const telefone = document.querySelector("#telefone").value;
        const descricao = document.querySelector("#descricao").value;

        const cidade = document.querySelector("#cidade").value;
        const bairro = document.querySelector("#bairro").value;

        // NOVO CAMPO
        const dataPerda = document.querySelector("#dataPerda").value;

        const arquivoFoto = document.querySelector("#foto").files[0];

        if(
            nome === "" ||
            raca === "" ||
            telefone === "" ||
            descricao === "" ||
            cidade === "" ||
            dataPerda === "" ||
            !arquivoFoto
        ){
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function(){

            const novoPet = new Pet(
                nome,
                raca,
                telefone,
                descricao,
                leitor.result,
                cidade,
                bairro,
                dataPerda
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


// ===============================
// LISTA NORMAL
// ===============================
const lista = document.querySelector(".cards");

if(lista){
    mostrarPets();
}

function mostrarPets(){

    const container = document.querySelector(".cards");

    const pets = JSON.parse(localStorage.getItem("pets")) || [];

    container.innerHTML = "";

    pets.forEach(function(pet, index){
        container.innerHTML += renderCard(pet, index);
    });
}


// ===============================
// BUSCA POR CIDADE
// ===============================
const inputBusca = document.querySelector("#buscaCidade");

if(inputBusca){

    inputBusca.addEventListener("input", function(){

        const pets = JSON.parse(localStorage.getItem("pets")) || [];

        const filtrados = pets.filter(pet =>
            (pet.cidade || "")
            .toLowerCase()
            .includes(this.value.toLowerCase())
        );

        if(filtrados.length === 0){
            mostrarMensagemVazia();
        } else {
            mostrarFiltrados(filtrados);
        }
    });
}


// ===============================
// RENDER FILTRADO
// ===============================
function mostrarFiltrados(listaPets){

    const container = document.querySelector(".cards");

    container.innerHTML = "";

    listaPets.forEach(function(pet, index){
        container.innerHTML += renderCard(pet, index);
    });
}


// ===============================
// MENSAGEM VAZIA
// ===============================
function mostrarMensagemVazia(){

    const container = document.querySelector(".cards");

    container.innerHTML = `
        <div style="
            text-align:center;
            padding:40px;
            font-size:20px;
            color:#666;
        ">
            Nenhum resultado encontrado 🐾
        </div>
    `;
}


// ===============================
// CARD
// ===============================
function renderCard(pet, index){

    return `
        <div class="card">

            <img src="${pet.foto}" alt="${pet.nome}">

            <h3>${pet.nome}</h3>

            <p><strong>Raça:</strong> ${pet.raca}</p>

            <p>${pet.descricao}</p>

            <p><strong>Local:</strong> ${pet.cidade || "não informado"} - ${pet.bairro || ""}</p>

            <p><strong>Perdido em:</strong> ${pet.dataPerda || "não informado"}</p>

            <a href="https://wa.me/55${pet.telefone}" target="_blank">
                <button>Entrar em contato</button>
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
}


// ===============================
// PDF (COM DATA)
// ===============================
function gerarPDF(index){

    const pets = JSON.parse(localStorage.getItem("pets")) || [];

    const pet = pets[index];

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFillColor(245,245,245);
    pdf.rect(0,0,210,297,"F");

    pdf.setFillColor(220,53,69);
    pdf.rect(0,0,210,45,"F");

    pdf.setTextColor(255,255,255);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(38);

    pdf.text("PERDIDO",105,28,{ align: "center" });

    pdf.setFillColor(255,255,255);
    pdf.roundedRect(15,50,180,130,5,5,"F");

    pdf.addImage(pet.foto,"JPEG",20,55,170,120);

    pdf.setTextColor(71,61,204);
    pdf.setFont("times","bolditalic");
    pdf.setFontSize(34);

    pdf.text(pet.nome.toUpperCase(),105,198,{ align: "center" });

    pdf.setDrawColor(255,145,77);
    pdf.setLineWidth(2);
    pdf.line(45,205,165,205);

    pdf.setTextColor(80,80,80);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(18);

    pdf.text(`Raça: ${pet.raca}`,20,222);

    // LOCAL
    pdf.setFontSize(15);
    pdf.text(
        `Local: ${pet.cidade || "não informado"} - ${pet.bairro || ""}`,
        20,
        230
    );

    // DATA NOVA
    pdf.text(
        `Perdido em: ${pet.dataPerda || "não informado"}`,
        20,
        238
    );

    pdf.setFont("helvetica","normal");
    pdf.setFontSize(15);

    const descricaoLinhas = pdf.splitTextToSize(pet.descricao,170);

    pdf.text(descricaoLinhas,20,246);

    pdf.setFillColor(71,61,204);
    pdf.rect(0,255,210,42,"F");

    pdf.setTextColor(255,255,255);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(20);

    pdf.text("ENTRE EM CONTATO",105,270,{ align: "center" });

    pdf.setFontSize(26);
    pdf.text(pet.telefone,105,284,{ align: "center" });

    pdf.save(`${pet.nome}-cartaz.pdf`);
}


// ===============================
// REMOVER
// ===============================
function removerPet(index){

    let pets = JSON.parse(localStorage.getItem("pets")) || [];

    const confirmar = confirm("Deseja remover este pet?");

    if(confirmar){

        pets.splice(index, 1);

        localStorage.setItem("pets", JSON.stringify(pets));

        mostrarPets();
    }
}