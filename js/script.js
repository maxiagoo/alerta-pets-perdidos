// ===============================
// USUÁRIO LOGADO
// ===============================
function getUserLogado() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function protegerPagina() {
    const user = getUserLogado();

    if (!user) {
        alert("Você precisa criar uma conta ou fazer login!");
        window.location.href = "login.html";
    }
}


// ===============================
// CLASSE PET
// ===============================
class Pet {

    constructor(nome, raca, telefone, descricao, foto, cidade, bairro, dataPerda){

        this.nome = nome;
        this.raca = raca;
        this.telefone = telefone;
        this.descricao = descricao;
        this.foto = foto;

        this.cidade = cidade;
        this.bairro = bairro;

        this.dataPerda = dataPerda;

        this.usuario = getUserLogado()?.email || "anonimo";
    }
}


// ===============================
// CADASTRO
// ===============================
const formulario = document.querySelector("#formPet");

if(formulario){

    formulario.addEventListener("submit", function(event){

        event.preventDefault();

        if(!getUserLogado()){
            alert("Você precisa estar logado para cadastrar um pet!");
            window.location.href = "login.html";
            return;
        }

        const nome = document.querySelector("#nome").value;
        const raca = document.querySelector("#raca").value;
        const telefone = document.querySelector("#telefone").value;
        const descricao = document.querySelector("#descricao").value;

        const cidade = document.querySelector("#cidade").value;
        const bairro = document.querySelector("#bairro").value;

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
// LISTA
// ===============================
const lista = document.querySelector(".cards");

if(lista){
    mostrarPets();
}

function mostrarPets(){

    const container = document.querySelector(".cards");

    const pets = JSON.parse(localStorage.getItem("pets")) || [];

    const user = getUserLogado();

    const meusPets = pets.filter(pet => pet.usuario === user?.email);

    container.innerHTML = "";

    meusPets.forEach(function(pet, index){
        container.innerHTML += renderCard(pet, index);
    });
}


// ===============================
// BUSCA
// ===============================
const inputBusca = document.querySelector("#buscaCidade");

if(inputBusca){

    inputBusca.addEventListener("input", function(){

        const user = getUserLogado();

        const pets = (JSON.parse(localStorage.getItem("pets")) || [])
            .filter(pet => pet.usuario === user?.email);

        const filtrados = pets.filter(pet =>
            (pet.cidade || "")
            .toLowerCase()
            .includes(this.value.toLowerCase())
        );

        const container = document.querySelector(".cards");

        container.innerHTML = filtrados.length
            ? filtrados.map(renderCard).join("")
            : `<div style="text-align:center;padding:40px;color:#666;">
                Nenhum resultado encontrado 🐾
              </div>`;
    });
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

            <button onclick="gerarPDF(${index})">Gerar Cartaz PDF</button>

            <br><br>

            <button onclick="removerPet(${index})">Remover Pet</button>

        </div>
    `;
}


// ===============================
// PDF (CORRIGIDO DE VERDADE)
// ===============================
function gerarPDF(index){

    const jsPDFClass = window.jspdf?.jsPDF;

    if (!jsPDFClass) {
        alert("PDF não carregou corretamente");
        return;
    }

    const user = getUserLogado();

    const pets = (JSON.parse(localStorage.getItem("pets")) || [])
        .filter(pet => pet.usuario === user?.email);

    const pet = pets[index];

    const pdf = new jsPDFClass("p", "mm", "a4");

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
    pdf.line(45,205,165,205);

    pdf.setTextColor(80,80,80);
    pdf.setFontSize(18);

    pdf.text(`Raça: ${pet.raca}`,20,222);
    pdf.text(`Local: ${pet.cidade} - ${pet.bairro}`,20,230);
    pdf.text(`Perdido em: ${pet.dataPerda}`,20,238);

    pdf.save(`${pet.nome}-cartaz.pdf`);
}


// ===============================
// REMOVER
// ===============================
function removerPet(index){

    let pets = JSON.parse(localStorage.getItem("pets")) || [];

    const user = getUserLogado();

    const meusPets = pets.filter(pet => pet.usuario === user?.email);

    const petSelecionado = meusPets[index];

    const confirmar = confirm("Deseja remover este pet?");

    if(confirmar){

        const novosPets = pets.filter(p =>
            !(p.nome === petSelecionado.nome &&
              p.telefone === petSelecionado.telefone &&
              p.dataPerda === petSelecionado.dataPerda)
        );

        localStorage.setItem("pets", JSON.stringify(novosPets));

        mostrarPets();
    }
}