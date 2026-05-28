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
            : `
                <div style="
                    text-align:center;
                    padding:40px;
                    color:#666;
                    background:white;
                    border-radius:20px;
                    box-shadow:0 5px 15px rgba(0,0,0,0.08);
                    width:300px;
                ">
                    Nenhum resultado encontrado 🐾
                </div>
              `;
    });
}


// ===============================
// CARD
// ===============================
// ===============================
// CARD PREMIUM
// ===============================
function renderCard(pet, index){

    return `
    
        <div class="card">

            <div class="card-image">

                <span class="badge">
                    🔴 DESAPARECIDO
                </span>

                <img src="${pet.foto}" alt="${pet.nome}">

            </div>

            <div class="card-content">

                <h3>${pet.nome}</h3>

                <div class="info">
                    🐶 <strong>Raça:</strong> ${pet.raca}
                </div>

                <div class="info">
                    📍 ${pet.cidade || "Não informado"}
                    ${pet.bairro ? "- " + pet.bairro : ""}
                </div>

                <div class="info">
                    📅 ${pet.dataPerda || "Não informado"}
                </div>

                <p class="descricao">
                    ${pet.descricao}
                </p>

                <div class="buttons">

                    <a 
                        href="https://wa.me/55${pet.telefone}" 
                        target="_blank"
                    >

                        <button class="btn whats">
                            Entrar em contato
                        </button>

                    </a>

                    <button 
                        class="btn pdf"
                        onclick="gerarPDF(${index})"
                    >
                        Gerar Cartaz PDF
                    </button>

                    <button 
                        class="btn remove"
                        onclick="removerPet(${index})"
                    >
                        Remover Pet
                    </button>

                </div>

            </div>

        </div>

    `;
}


// ===============================
// PDF PROFISSIONAL
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

    // FUNDO
    pdf.setFillColor(245,247,251);
    pdf.rect(0,0,210,297,"F");

    // TOPO AZUL
    pdf.setFillColor(74,144,226);
    pdf.rect(0,0,210,45,"F");

    // TÍTULO
    pdf.setTextColor(255,255,255);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(36);

    pdf.text("PET DESAPARECIDO",105,28,{ align: "center" });

    // CARD BRANCO
    pdf.setFillColor(255,255,255);
    pdf.roundedRect(15,50,180,130,8,8,"F");

    // FOTO
    pdf.addImage(pet.foto,"JPEG",20,55,170,120);

    // NOME
    pdf.setTextColor(74,144,226);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(30);

    pdf.text(
        pet.nome.toUpperCase(),
        105,
        198,
        { align: "center" }
    );

    // LINHA
    pdf.setDrawColor(255,159,67);
    pdf.setLineWidth(1);

    pdf.line(45,205,165,205);

    // INFORMAÇÕES
    pdf.setTextColor(70,70,70);
    pdf.setFont("helvetica","normal");
    pdf.setFontSize(16);

    pdf.text(`Raça: ${pet.raca}`,20,222);

    pdf.text(
        `Local: ${pet.cidade} - ${pet.bairro}`,
        20,
        232
    );

    pdf.text(
        `Perdido em: ${pet.dataPerda}`,
        20,
        242
    );

    // DESCRIÇÃO
    pdf.setFontSize(14);

    const descricao = pdf.splitTextToSize(
        `Descrição: ${pet.descricao}`,
        170
    );

    pdf.text(descricao, 20, 252);

    // CONTATO
    pdf.setTextColor(74,144,226);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(16);

    pdf.text(
        `Contato: ${pet.telefone}`,
        20,
        275
    );

    // RODAPÉ
    pdf.setFontSize(12);
    pdf.setTextColor(120,120,120);

    pdf.text(
        "Ajude este pet a voltar para casa!",
        105,
        290,
        { align: "center" }
    );

    pdf.save(`${pet.nome}-cartaz.pdf`);
}

// ===============================
// REMOVER
// ===============================
function removerPet(index){

    let pets = JSON.parse(localStorage.getItem("pets")) || [];

    const user = getUserLogado();

    const meusPets = pets.filter(
        pet => pet.usuario === user?.email
    );

    const petSelecionado = meusPets[index];

    const confirmar = confirm(
        "Deseja remover este pet?"
    );

    if(confirmar){

        const novosPets = pets.filter(p =>
            !(p.nome === petSelecionado.nome &&
              p.telefone === petSelecionado.telefone &&
              p.dataPerda === petSelecionado.dataPerda)
        );

        localStorage.setItem(
            "pets",
            JSON.stringify(novosPets)
        );

        mostrarPets();
    }
}


// ===============================
// LOGOUT
// ===============================
function logout(){

    localStorage.removeItem("currentUser");

    alert("Logout realizado com sucesso!");

    if(window.location.pathname.includes("/pages/")){

        window.location.href = "../login.html";

    }else{

        window.location.href = "login.html";
    }
}