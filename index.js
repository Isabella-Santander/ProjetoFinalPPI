import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const porta = 3000;
const host =  '0.0.0.0';

var listaUsuarios = [];
var listaBatePapo = [];

function processarCadastroUsuario(requisicao, resposta){
   
    const dados = requisicao.body;
    let conteudoResposta = '';
    
    if(!(dados.nome && dados.apelido && dados.data && dados.email && dados.senha)){
        conteudoResposta = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro Usuário</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

        </head>
        <body>
            <div class="container col-4">
                <form  action='/cadastrarUsuario' method="POST"  class="row g-3 needs-validation" novalidate>
                <fieldset class="border p-2 mt-2">

                    <div class="title text-center">
                        <legend class="mb-3" style="color: green;"><b>Cadastro de Alunos</b></legend>
                    </div>

                    <div class="col-md-6">
                    <label for="nome" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="nome" name="nome" value="${dados.nome}" required>
                    </div>
        `;
        if(!dados.nome){
        conteudoResposta+=`
                        <div>
                            <p class="text-danger">Por favor, informe seu nome!</p>
                        </div>`;
        }
        conteudoResposta+=`
                        <div class="col-md-6">
                            <label for="apelido" class="form-label">Apelido</label>
                            <input type="text" class="form-control" id="apelido" name="apelido" value="${dados.apelido}" required>
                        </div>`;
        if(!dados.apelido){
        conteudoResposta+=`
                        <div>
                            <p class="text-danger">Por favor, informe seu apelido</p>
                        </div>`;
        }
        conteudoResposta+=`
                        <div class="col-md-6">
                            <label for="data" class="form-label">Data de Nascimento</label>
                            <input type="date" class="form-control" id="data" name="data" value="${dados.data}" required>
                        </div>`;
        if(!dados.data){
        conteudoResposta+=`
                        <div>
                            <p class="text-danger">Por favor, informe a sua data de nascimento</p>
                        </div>`;
        }
        conteudoResposta+=`
                        <div>
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="${dados.email}" required">
                        <div>`;
        if(!dados.email){
        conteudoResposta+=`
                        <div>
                            <p class="text-danger">Por favor, informe um email</p>
                        </div>`;
        }
        conteudoResposta+=`
                            <div>
                            <label for="senha" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="senha" name="senha" value="${dados.senha}" required">
                            <div>`;
        if(!dados.senha){
        conteudoResposta+=`
                        <div>
                            <p class="text-danger">Por favor, informe uma senha</p>
                        </div>`;
        }
                        `<br>
                        <div class="col-12 mt-2">
                            <button class="btn btn-success" type="submit">Cadastrar</button>
                        </div>
                    </fieldset>
                </form>
             </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
        </html>`;
        resposta.end(conteudoResposta);
    }
    else{
        const usuario = {
            nome: dados.nome,
            apelida: dados.apelido,
            data: dados.data,
            email: dados.email,
            senha: dados.senha,
        }
        
        listaUsuarios.push(usuario);

        conteudoResposta =`
        <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Alunos Cadastrados</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                <style>
                    body{
                        background-color: #d6e9eb;
                    }
                    h1{
                        font-size: 48px;
                        color: #066a75;
                        padding: 2px 0 10px 0;
                        font-family: Arial,sans-serif;
                        font-weight: bold;
                        text-align: center;
                        padding-bottom: 30px;
                      }
                    h1:after{
                          content: ' ';
                          display: block;
                          width: 100%;
                          height: 2px;
                          margin-top: 10px;
                          background: -webkit-linear-gradient(left, rgba(147,184,189,0) 0%,rgba(147,184,189,0.8) 20%,rgba(147,184,189,1) 53%,rgba(147,184,189,0.8) 79%,rgba(147,184,189,0) 100%); 
                          background: linear-gradient(left, rgba(147,184,189,0) 0%,rgba(147,184,189,0.8) 20%,rgba(147,184,189,1) 53%,rgba(147,184,189,0.8) 79%,rgba(147,184,189,0) 100%); 
                        }
                </style>
            
            </head>
            <body>
                <h1 style="text-align: center;">Lista de Usuários Cadastrados</h1>
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Apelido</th>
                            <th>Data de Nascimento/UF</th>
                            <th>Email</th>
                            <th>Senha</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody> `;

                    for (const usuario of listaUsuarios){
                        conteudoResposta += `
                            <tr>
                                <td>${usuario.nome}</td>
                                <td>${usuario.apelido}</td>
                                <td>${usuario.data}</td>
                                <td>${usuario.email}</td>
                                <td>${usuario.senha}</td>
                            <tr>
                        `;
                    }

                    conteudoResposta += `
                                </tbody>
                            </table>
                            <a class="btn btn-danger" href="/" role"button"> Voltar ao menu </a>
                            <a class="btn btn-success" href="/cadastroUsuario.html" role"button"> Continuar cadastrando </a>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script
                        </html>
                    `;
                    resposta.end(conteudoResposta);
        }
}

function processarMensagem(requisicao, resposta){
    const dados = requisicao.body;
    let conteudoResposta = '';

    if(!(dados.usuario && dados.mensagem && dados.tel)){
        conteudoResposta = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Bate-Papo Web com a Isa</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                            <style>
                                body{
                                background-color: #d6e9eb;
                                }
                                .content{
                                    width: 500px;
                                    min-height: 560px;    
                                    margin: 0px auto;
                                    position: relative;  
                                }
                                
                                h1{
                                    font-size: 48px;
                                    color: #066a75;
                                    padding: 2px 0 10px 0;
                                    font-family: Arial,sans-serif;
                                    font-weight: bold;
                                    text-align: center;
                                    padding-bottom: 30px;
                                    }
                                    h1:after{
                                        content: ' ';
                                        display: block;
                                        width: 100%;
                                        height: 2px;
                                        margin-top: 10px;
                                        background: -webkit-linear-gradient(left, rgba(147,184,189,0) 0%,rgba(147,184,189,0.8) 20%,rgba(147,184,189,1) 53%,rgba(147,184,189,0.8) 79%,rgba(147,184,189,0) 100%); 
                                        background: linear-gradient(left, rgba(147,184,189,0) 0%,rgba(147,184,189,0.8) 20%,rgba(147,184,189,1) 53%,rgba(147,184,189,0.8) 79%,rgba(147,184,189,0) 100%); 
                                    }
                                    label{
                                        color: #405c60;
                                        position: relative;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 30px;
                                    }
                                    input {
                                        outline: none;
                                        width: 500px;
                                        margin-top: 4px;
                                        padding: 10px;    
                                        border: 1px solid #b2b2b2;
                                        size: 100;
                                        -webkit-border-radius: 3px;
                                        border-radius: 3px;
                                        -webkit-box-shadow: 0px 1px 4px 0px rgba(168, 168, 168, 0.6) inset;
                                        box-shadow: 0px 1px 4px 0px rgba(168, 168, 168, 0.6) inset;
                                        -webkit-transition: all 0.2s linear;
                                        transition: all 0.2s linear;
                                    }
                                    select{
                                        outline: none;
                                        width: 95%;
                                        margin-top: 4px;
                                        padding: 10px;    
                                        border: 1px solid #b2b2b2;
                                        -webkit-border-radius: 3px;
                                        border-radius: 3px;
                                        -webkit-box-shadow: 0px 1px 4px 0px rgba(168, 168, 168, 0.6) inset;
                                        box-shadow: 0px 1px 4px 0px rgba(168, 168, 168, 0.6) inset;
                                        -webkit-transition: all 0.2s linear;
                                        transition: all 0.2s linear;
                                    }
                                    button{
                                        width: 100%!important;
                                        cursor: pointer;  
                                        padding: 8px 5px;
                                        font-size: 20px;  
                                        border: 1px solid #fff;   
                                        margin-bottom: 10px;  
                                        text-shadow: 0 1px 1px #333;
                                        -webkit-border-radius: 5px;
                                        border-radius: 5px;
                                        transition: all 0.2s linear;
                                    }
                            
                            </style>
                        </head>
                        <body>
                        <div class="content">
                            <div class="chat"> 
                                <form action='\batepapo' method="POST" class="row g-3 needs-validation mx-auto my-auto" novalidate>
                                <fieldset class="border p-2 mt-2">
                                <h1>Bate-Papo Web</h1>
                                
                                <div class="col-md-6">
                                <div class="mb-3">
                                <label for="usuario" class="form-label">Usuário</label><br/>
                                <select class="form-select" id="usuario" name="usuario" style="width: 450px;" required><br/>
                                <option selected disabled value="">Selecionar usuario pelo  nome cadastrado</option>`;
                                

                        for(const usuario of listaUsuarios){
                            conteudoResposta += `<option value="${usuario.nome}">${usuario.nome}</option>`;
                        }
                        conteudoResposta+=`
                            </select>
                            ${!users.name ? `<p class="text-danger">Por favor, informe um usuário válido!</p>` : ''}
                            </div></div><br/>`;

                        conteudoResposta+=`
                            <div class="col-md-6">
                            <div class="mb-3">
                                <label for="mensagem" class="form-label">Mensagem</label><br/>
                                <textarea class="form-control" id="mensagem" name="mensagem" style="width: 450px;" cols="20" placeholder="Escreva aqui sua mensagem ao usuário selecionado" required></textarea>
                                ${!users.mensagem ? `<p class="text-danger">Por favor, informe uma mensagem ao usuário</p>` : ''}
                                </div> 
                                <div>`;

                        conteudoResposta+=`
                            <div class="col-md-6">
                            <div class="mb-3">
                                <label for="tel" class="form-label">Telefone para contato</label><br/>
                                <input type="tel" class="form-control" id="tel" name="tel" style="width: 450px;" placeholder="(DDD)XXXX-XXXX" required>
                                ${!users.tel ? `<p class="text-danger">Por favor, digite um telefone</p>` : ''}
                                </div>
                            </div>

                        <div class="col-12 mt-4">
                        <button class="btn btn-success" id="autoSubmit">Enviar</button>
                        </div>
                        </fieldset>
                    </form>
                    </div>
                    </div>
                <!--<script>
            window.onload = function() {
            document.getElementById('autoSubmit').click();
            };
        </script>-->

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
        </html>`;

        resposta.end(conteudoResposta);
    }
    else{
            const usuario = {
                usuario: users.usuario,
                mensagem: users.mensagem,
                tel: users.tel,
            };
            listaBatePapo.push(usuario);

            conteudoResposta = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Bate-Papo Web com a Isa</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                    <style>
                        body{
                            background-color: #d6e9eb;
                        }
                        h1{
                            font-size: 48px;
                            color: #066a75;
                            padding: 2px 0 10px 0;
                            font-family: Arial,sans-serif;
                            font-weight: bold;
                            text-align: center;
                            padding-bottom: 30px;
                        }
                        h1:after{
                            content: ' ';
                            display: block;
                            width: 100%;
                            height: 2px;
                            margin-top: 10px;
                            background: -webkit-linear-gradient(left, rgba(147,184,189,0) 0%,rgba(147,184,189,0.8) 20%,rgba(147,184,189,1) 53%,rgba(147,184,189,0.8) 79%,rgba(147,184,189,0) 100%); 
                            background: linear-gradient(left, rgba(147,184,189,0) 0%,rgba(147,184,189,0.8) 20%,rgba(147,184,189,1) 53%,rgba(147,184,189,0.8) 79%,rgba(147,184,189,0) 100%); 
                            }
                    </style>
            
                </head>
                <body>
                <h1 style="text-align: center;">Lista de Mensagens aos Usuários</h1>
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Mensagem</th>
                            <th>Telefone</th>
                        </tr>
                    </thead>
                    <tbody> `;
        
                    for (const usuario of listaBatePapo){
                        conteudoResposta += `
                            <tr>
                                <td>${usuario.usuario}</td>
                                <td>${usuario.mensagem}</td>
                                <td>${usuario.tel}</td>
                            <tr>
                        `;
                    }

                    conteudoResposta += `
                                </tbody>
                            </table>
                            <a class="btn btn-danger" href="/" role"button"> Voltar ao menu </a>
                            <a class="btn btn-success" href="/paginabatepapo.html" role"button"> Continuar mandando mensagens </a>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script
                        </html>
                    `;
                    resposta.end(conteudoResposta);
        }           
    }

function autenticar(requisicao, resposta, next){
    if(requisicao.session.usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect("/login.html");
    }
}

const app = express();

app.use(cookieParser());

app.use(session({
    secret:"M1nH4Ch4v3S3cR3t4",
    resave: false, 
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));


app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(),'paginas')));

app.get('/', autenticar, (requisicao, resposta) =>{
    const dataUltimoAcesso = requisicao.cookies.DataUltimoAcesso;
    const data = new Date();
    resposta.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });

    resposta.end (`
    <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Menu do Sistema</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <style>
            body{
                background-color: #d6e9eb;
            }
            h1{
                font-size: 48px;
                color: #066a75;
                font-family: Arial,sans-serif;
                font-weight: bold;
                text-align: center;
            }
            a{
              color: #405c60;
              position: relative;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 25px;
              text-align: center;
            }
            </style>
        </head>
        <body>
        <div class="col-4">
            <h1>Menu</h1>
            <nav class="nav flex-column">
                <a style="font-size: 30px;" class="nav-link" href="/cadastroUsuario.html">Cadastrar Usuário</a> <br/>
                <a style="font-size: 30px;" class="nav-link" href="/paginabatepapo.html">Bate Papo</a>
            </nav>
        </div>    
        </body>
        <footer>
            <p>Seu ultimo acesso foi em ${dataUltimoAcesso}</p>
        </footer>
        </html>
        `);
})

app.post('/login', (requisicao, resposta)=>{
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario && senha && (usuario === 'isabella') && (senha === '123')){
        requisicao.session.usuarioAutenticado = true;
        resposta.redirect('/');
    }
    else{
        resposta.end(`
            <!DOCTYPE html>
                <head>
                    <meta charset="UTF-8">
                    <title>Falha na autenticação</title>
                </head>
                <body style="background-color: #d6e9eb;">
                    <h3 style="color: red; text-align: center;">Usuário ou senha inválidos!</h3>
                    <a href="/login.html" style="text-align: center; color: #405c60;">Voltar ao Login</a>
                </body>
            </html>
            `);
    }
});

app.post('/cadastrarUsuario' , autenticar, processarCadastroUsuario);

app.listen(porta, host, () => {
    console.log(`Servidor executando na url https://${host}:${porta}`)
});