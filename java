const formulario = document.querySelector("form");

formulario.addEventListener("submit", function(event){

    event.preventDefault();

    const inputs = document.querySelectorAll("input[type='text']");
    const descricao = document.querySelector("textarea");

    let camposPreenchidos = true;

    inputs.forEach(function(input){

        if(input.value.trim() === ""){

            camposPreenchidos = false;
        }

    });

    if(descricao.value.trim() === ""){

        camposPreenchidos = false;
    }

    if(camposPreenchidos){

        alert("Pet cadastrado com sucesso!");

    } else {

        alert("Preencha todos os campos!");
    }

});
