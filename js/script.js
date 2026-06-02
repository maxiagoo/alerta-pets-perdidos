// ===============================
// USUÁRIO LOGADO (permanece localStorage)
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
// CLASSE PET (modelo de dados enviado ao BACKEND)
// ===============================
class Pet {
    constructor(nome, raca, telefone, descricao, foto, cidade, bairro, dataPerda) {
        this.nome = nome;
        this.raca = raca;
        this.telefone = telefone;
        this.descricao = descricao;
        this.foto = foto;
        this.cidade = cidade;
        this.bairro = bairro;
        this.dataPerda = dataPerda;

        // usuário continua vindo do localStorage (login simples)
        this.usuario = getUserLogado()?.email || "anonimo";
    }
}

// ===============================
// CADASTRO DE PET
// ===============================
const formulario = document.querySelector("#formPet");

if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!getUserLogado()) {
            alert("Você precisa estar logado!");
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

        if (!nome || !raca || !telefone || !descricao || !cidade || !dataPerda || !arquivoFoto) {
            alert("Preencha todos os campos!");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function () {

            const pet = new Pet(
                nome,
                raca,
                telefone,
                descricao,
                leitor.result,
                cidade,
                bairro,
                dataPerda
            );

            // =====================================================
            // 🔥 MIGRAÇÃO LOCALSTORAGE → BACKEND (JAVALIN API)
            // =====================================================
            // Antes: localStorage.setItem("pets", ...)
            // Agora: enviamos para o backend Java (futuro banco de dados)

            fetch("http://localhost:7000/pets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pet)
            })
            .then(res => res.json())
            .then(() => {
                alert("Pet cadastrado com sucesso no backend!");
                formulario.reset();
                window.location.href = "pets.html";
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao cadastrar pet no servidor");
            });
        };

        leitor.readAsDataURL(arquivoFoto);
    });
}

// ===============================
// LISTAGEM DE PETS
// ===============================
const lista = document.querySelector(".cards");

if (lista) {
    mostrarPets();
}

function mostrarPets() {

    const container = document.querySelector(".cards");
    const user = getUserLogado();

    // =====================================================
    // 🔥 MIGRAÇÃO: localStorage → BACKEND (API Java)
    // =====================================================
    // Antes: JSON.parse(localStorage.getItem("pets"))
    // Agora: GET no backend Javalin (/pets)

    fetch("http://localhost:7000/pets")
        .then(res => res.json())
        .then(pets => {

            const meusPets = pets;
            //antigo: const meusPets = pets.filter(p => p.usuario === user?.email);
            container.innerHTML = "";

            meusPets.forEach((pet, index) => {
                container.innerHTML += renderCard(pet, index);
            });
        });
}

// ===============================
// BUSCA DE PETS
// ===============================
const inputBusca = document.querySelector("#buscaCidade");

if (inputBusca) {
    inputBusca.addEventListener("input", function () {

        const user = getUserLogado();

        // =====================================================
        // 🔥 MIGRAÇÃO: busca agora vem do BACKEND
        // =====================================================
        fetch("http://localhost:7000/pets")
            .then(res => res.json())
            .then(pets => {

                const meusPets = pets.filter(p => p.usuario === user?.email);

                const filtrados = meusPets.filter(pet =>
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
                            width:300px;
                        ">
                            Nenhum resultado encontrado 🐾
                        </div>
                    `;
            });
    });
}

// ===============================
// CARD (interface permanece igual)
// ===============================
function renderCard(pet, index) {

    return `
        <div class="card">

            <div class="card-image">
                <span class="badge">🔴 DESAPARECIDO</span>
                <img src="${pet.foto}" alt="${pet.nome}">
            </div>

            <div class="card-content">

                <h3>${pet.nome}</h3>

                <div class="info">🐶 <strong>Raça:</strong> ${pet.raca}</div>

                <div class="info">📍 ${pet.cidade || "Não informado"} ${pet.bairro ? "- " + pet.bairro : ""}</div>

                <div class="info">📅 ${pet.dataPerda || "Não informado"}</div>

                <p class="descricao">${pet.descricao}</p>

                <div class="buttons">

                    <a href="https://wa.me/55${pet.telefone}" target="_blank">
                        <button class="btn whats">Entrar em contato</button>
                    </a>

                    <button class="btn pdf" onclick="gerarPDF(${index})">
                        Gerar Cartaz PDF
                    </button>

                </div>

            </div>

        </div>
    `;
}

// ===============================
// PDF (continua usando dados do backend)
// ===============================
function gerarPDF(index) {

    const jsPDFClass = window.jspdf?.jsPDF;

    if (!jsPDFClass) {
        alert("PDF não carregou corretamente");
        return;
    }

    const user = getUserLogado();

    fetch("http://localhost:7000/pets")
        .then(res => res.json())
        .then(pets => {

            const pet = pets[index];
            //atualizado
            if (!pet) {
                alert("Pet não encontrado");
                return;
            }

            const pdf = new jsPDFClass("p", "mm", "a4");

            // Fundo
            pdf.setFillColor(245, 247, 251);
            pdf.rect(0, 0, 210, 297, "F");

            // Cabeçalho
            pdf.setFillColor(74, 144, 226);
            pdf.rect(0, 0, 210, 45, "F");

            pdf.setTextColor(255, 255, 255);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(32);
            pdf.text("PET DESAPARECIDO", 105, 28, { align: "center" });

            // FOTO
            if (pet.foto) {
                try {

                    const tipoImagem =
                        pet.foto.includes("png") ? "PNG" : "JPEG";

                    pdf.addImage(
                        pet.foto,
                        tipoImagem,
                        30,
                        55,
                        150,
                        110
                    );

                } catch (erro) {
                    console.error("Erro ao inserir imagem:", erro);
                }
            }

            // Nome
            pdf.setTextColor(74, 144, 226);
            pdf.setFontSize(26);
            pdf.text(
                pet.nome.toUpperCase(),
                105,
                180,
                { align: "center" }
            );

            // Informações
            pdf.setTextColor(70, 70, 70);
            pdf.setFontSize(14);

            pdf.text(`Raça: ${pet.raca}`, 20, 200);

            pdf.text(
                `Local: ${pet.cidade || ""} ${pet.bairro ? "- " + pet.bairro : ""}`,
                20,
                210
            );

            pdf.text(
                `Perdido em: ${pet.dataPerda || ""}`,
                20,
                220
            );

            const descricao = pdf.splitTextToSize(
                `Descrição: ${pet.descricao}`,
                170
            );

            pdf.text(descricao, 20, 235);

            pdf.setTextColor(74, 144, 226);
            pdf.setFont("helvetica", "bold");

            pdf.text(
                `Contato: ${pet.telefone}`,
                20,
                275
            );

            pdf.save(`${pet.nome}-cartaz.pdf`);
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao gerar PDF");
        });
    }
        // ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("currentUser");

    alert("Logout realizado com sucesso!");

    window.location.href = "/login.html";
}
//dificuldade para acertar o caminho, já que estava na raiz