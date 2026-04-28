# Especificação Funcional e Técnica

## Projeto: Alerta de Pets Perdidos

## 1. Visão Geral

Aplicação web desenvolvida em Java para cadastro e consulta de pets perdidos e encontrados, com geração de cartazes digitais para divulgação.

## 2. Arquitetura

O sistema seguirá o padrão MVC:

* Model: entidades e estrutura de dados
* Controller: controle das requisições e fluxo da aplicação
* View: interface com o usuário
  
## 3. Tecnologias

* Java
* HTML/CSS
* Banco de dados relacional (MySQL ou H2)
* Git/GitHub
  
## 4. Módulos do Sistema

### 4.1 Pets Perdidos

* Cadastro de pet
* Edição de dados
* Exclusão de registro
* Listagem de pets
* Visualização detalhada

### 4.2 Pets Encontrados

* Cadastro de pet encontrado
* Listagem de registros

### 4.3 Busca

* Filtro por cidade
* Filtro por bairro
* Filtro por tipo de animal
* Ordenação por data

### 4.4 Geração de Cartaz

* Geração automática de cartaz
* Inclusão de foto e dados do pet
* Exportação em imagem ou PDF

## 5. Modelo de Dados

### Entidade: PetPerdido

* id
* nome
* tipo
* descricao
* dataDesaparecimento
* localizacao
* contato
* foto

### Entidade: PetEncontrado

* id
* descricao
* localizacao
* data
* foto

## 6. Fluxo do Sistema

1. Usuário acessa a aplicação
2. Realiza cadastro de pet perdido
3. Sistema armazena os dados no banco
4. Pet é exibido na listagem
5. Usuário pode visualizar detalhes
6. Usuário pode gerar cartaz
7. Busca pode ser realizada por região ou tipo

## 7. Persistência de Dados

Os dados serão armazenados em banco relacional, com operações de criação, leitura, atualização e exclusão (CRUD).

## 8. Interface do Usuário

Interface web simples, com foco em usabilidade.

Principais telas:

* Cadastro de pet perdido
* Listagem de pets
* Detalhes do pet
* Busca
* Geração de cartaz

## 9. Restrições

* Não haverá autenticação de usuários
* Não haverá integração com APIs externas
* O sistema será executado localmente
* Projeto desenvolvido individualmente

## 10. Evoluções Futuras

* Sistema de login
* Geolocalização com mapa
* Notificações
* Compartilhamento direto em redes sociais

