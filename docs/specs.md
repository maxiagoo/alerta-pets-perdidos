# Especificação Funcional e Técnica

## Projeto: Alerta de Pets Perdidos

## 1. Visão Geral

Aplicação web em Java para cadastro e consulta de pets perdidos, com geração de cartazes digitais e prontos para divulgação.

## 2. Arquitetura

O sistema seguirá o padrão MVC:

* Model: entidades e dados
* Controller: controle das requisições
* View: interface com o usuário

## 3. Tecnologias

* Java
* HTML/CSS
* Banco de dados relacional (MySQL ou H2)
* Git/GitHub

## 4. Módulos

### 4.1 Pets Perdidos

* Cadastro
* Edição
* Exclusão
* Listagem
  
### 4.2 Pets Encontrados

* Cadastro
* Listagem
  
### 4.3 Busca

* Filtro por cidade
* Filtro por bairro
  
### 4.4 Cartaz

* Geração automática
* Inclusão de foto e dados
* Exportação em imagem ou PDF
  
## 5. Modelo de Dados

### PetPerdido

* id
* nome
* tipo
* descricao
* dataDesaparecimento
* localizacao
* contato
* foto
  
### PetEncontrado

* id
* descricao
* localizacao
* data
* foto
  
## 6. Fluxo do Sistema

1. Usuário cadastra pet perdido
2. Sistema armazena os dados
3. Pet é exibido na listagem
4. Usuário pode gerar cartaz
5. Busca pode ser realizada por região

## 7. Persistência

Dados armazenados em banco relacional com operações CRUD.



## 8. Interface

Interface web simples com telas de cadastro, listagem, busca e geração de cartaz.



## 9. Restrições

* Sem autenticação de usuários
* Sem integração externa
* Execução local
* Projeto individual
  
## 10. Evoluções Futuras

* Login de usuário
* Geolocalização
* Notificações

