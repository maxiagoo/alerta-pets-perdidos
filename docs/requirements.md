# Requisitos do Sistema

## Projeto: Alerta de Pets Perdidos

---

## Requisitos Funcionais

| ID   | Descrição                                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| RF01 | O sistema deve permitir o cadastro de pets perdidos com nome, tipo, descrição, data, localização, contato e foto |
| RF02 | O sistema deve exibir uma lista de pets perdidos cadastrados                                                     |
| RF03 | O sistema deve permitir a busca de pets por região (cidade ou bairro)                                            |
| RF04 | O sistema deve gerar um cartaz digital contendo as informações do pet                                            |
| RF05 | O sistema deve permitir o cadastro de pets encontrados com descrição, localização, data e foto opcional          |

## Requisitos Não Funcionais

| ID    | Descrição                                                       |
| ----- | --------------------------------------------------------------------|
| RNF01 | A interface deve ser simples e intuitiva                            |
| RNF02 | O sistema deve responder rapidamente para baixo volume de dados     |
| RNF03 | A aplicação deve ser acessível via navegador                        |
| RNF04 | Os dados devem ser armazenados em banco de dados relacional         |
| RNF05 | O sistema deve ser executável localmente                            |
| RNF06 | O sistema deve validar entradas para evitar dados inválidos         |
| RNF07 | O sistema deve tratar erros de forma amigável ao usuário            |

## Regras de Negócio

| ID   | Regra                                                                |
| ---- | -------------------------------------------------------------------- |
| RN01 | Nome, descrição e localização são obrigatórios para cadastro         |
| RN02 | Contato é obrigatório para geração do cartaz                         |
| RN03 | Foto é obrigatória para geração do cartaz                            |
| RN04 | Pets encontrados podem ser cadastrados sem vínculo com pets perdidos |
| RN05 | A busca deve permitir correspondência parcial de texto               |
| RN06 | Um pet perdido não pode ser cadastrado sem data                      |
| RN07 | A localização deve conter ao menos cidade                            |

