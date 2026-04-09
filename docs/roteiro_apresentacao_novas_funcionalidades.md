# Roteiro curto de apresentação

## Visão geral

Nas novas funcionalidades do projeto, o foco foi tirar o sistema de uma base mais mockada e começar a trabalhar com persistência real usando Firebase. Com isso, o sistema passou a ter autenticação com Google, armazenamento real de usuários e produtos, upload de imagem e preparação do POS para leitura por código de barras.

## O que foi entregue

### 1. Autenticação real com Firebase

O login agora usa **Firebase Authentication com Google**.  
Na prática, isso significa que o usuário entra com a conta Google e o sistema identifica o perfil dele com base no e-mail configurado.

Hoje temos dois perfis:

- `ADMINISTRADOR`
- `OPERADOR`

### 2. Persistência de usuários no Firestore

Depois do login, o sistema salva ou atualiza o usuário na coleção `users` do **Cloud Firestore**.  
Isso permite controlar dados como:

- nome
- e-mail
- perfil
- status de ativação

### 3. Produtos salvos no Firestore

Os produtos deixaram de depender apenas de dados mockados e passaram a ser lidos do **Firestore**.  
Com isso, admin e operador já consomem dados reais do banco.

### 4. Cadastro de produto na área administrativa

Foi criada uma área própria no admin para **cadastrar produtos**.  
Nesse cadastro, hoje já é possível informar:

- nome
- descrição
- categoria
- preço base
- estoque
- código de barras
- imagem
- adicionais permitidos
- disponibilidade
- variação de tamanho

### 5. Upload de imagem com Firebase Storage

A imagem do produto agora pode ser enviada para o **Firebase Storage**.  
Depois do upload, a URL da imagem é salva no Firestore no campo `imageUrl`, e o produto já aparece com a foto no sistema.

### 6. Busca por código de barras no POS

No POS, já foi implementado o fluxo de busca por **código de barras digitado ou lido por leitor físico que funciona como teclado**.  
Se o produto for simples, ele já entra direto no carrinho.  
Se tiver configuração, como adicionais ou tamanho, o sistema abre o fluxo de seleção.

## Exemplo de demonstração em tempo real

Durante a apresentação, posso mostrar o fluxo acontecendo na prática:

1. Fazer login com Google.
2. Mostrar que o sistema diferencia `ADMINISTRADOR` e `OPERADOR`.
3. Entrar na área administrativa.
4. Abrir a tela de `Cadastrar produto`.
5. Preencher nome, descrição, categoria, preço, estoque e código de barras.
6. Selecionar uma imagem do produto.
7. Marcar adicionais permitidos.
8. Cadastrar o produto.
9. Mostrar no Firebase que:
   - a imagem foi para o `Storage`
   - o produto foi salvo no `Firestore`
10. Voltar para o sistema e mostrar o produto aparecendo no catálogo.
11. Entrar no POS.
12. Buscar o produto pelo código de barras digitado.
13. Mostrar o item sendo encontrado e indo para o carrinho.

Esse exemplo ajuda a provar que o fluxo já está integrado de ponta a ponta entre interface, autenticação, banco de dados e armazenamento de arquivos.

## O que ainda está pendente

### Leitura do código de barras por câmera

Essa parte ainda **não foi concluída**.

A lógica principal já foi preparada:

- os produtos já possuem campo `barcode`
- o POS já sabe buscar o produto por esse valor

Ou seja, a leitura por câmera será a etapa final de captura do código, reaproveitando o fluxo que já existe.

## Explicação técnica sobre o Firebase

### Firebase Authentication

Foi usado para resolver a **autenticação**, ou seja, identificar quem está entrando no sistema.  
Nesse projeto, o provedor escolhido foi o **Google**.

### Cloud Firestore

Foi usado como **banco de dados principal** do sistema.  
Hoje ele armazena, por exemplo:

- usuários em `users`
- produtos em `products`

O Firestore foi escolhido porque funciona bem com aplicações web em tempo real, tem integração simples com frontend e permite regras de segurança por coleção e por usuário autenticado.

### Firebase Storage

Foi usado para armazenar os **arquivos do sistema**, principalmente as imagens dos produtos.  
Em vez de salvar a imagem dentro do banco, o sistema salva o arquivo no Storage e guarda apenas a URL no Firestore.

### Segurança

As regras do Firebase foram configuradas para proteger os dados:

- cada usuário acessa o próprio documento em `users`
- leitura de produtos exige autenticação
- escrita em produtos e upload de imagem ficam restritos ao perfil `ADMINISTRADOR`

## Fechamento

O resultado dessa etapa foi a evolução do sistema para uma base mais próxima de produção, com autenticação real, banco real, upload de imagens e fluxo administrativo de cadastro já integrado ao POS.  
O próximo passo é finalizar a leitura de código de barras por câmera, concluindo a experiência completa no ponto de venda.

## Roteiro de fala natural

Agora eu vou apresentar as novas funcionalidades que foram desenvolvidas no projeto.

O principal objetivo dessa etapa foi começar a tirar o sistema de uma base mais mockada e aproximar a aplicação de um fluxo real, usando Firebase para autenticação, banco de dados e armazenamento de arquivos.

Primeiro, eu posso mostrar o login.  
Hoje o sistema já está usando Firebase Authentication com login via Google. Então, em vez de um acesso simulado, agora o usuário entra com uma conta real.

Depois do login, o sistema já diferencia os perfis de acesso. No projeto atual, eu tenho dois perfis principais: administrador e operador. Essa separação acontece com base no e-mail autenticado, e isso permite controlar o que cada tipo de usuário pode acessar dentro da aplicação.

Na sequência, eu posso abrir o Firebase para mostrar que, depois da autenticação, o usuário também fica registrado no Firestore. Ou seja, além de autenticar, o sistema já persiste os dados principais do usuário no banco.

Entrando na área administrativa, uma das principais entregas foi a criação da área de cadastro de produto.  
Aqui eu consigo cadastrar nome, descrição, categoria, preço base, estoque, código de barras, imagem, adicionais permitidos, disponibilidade e variação de tamanho.

Se eu quiser demonstrar em tempo real, eu posso preencher um produto agora, selecionar uma imagem e concluir o cadastro.

Quando eu salvo, esse fluxo conversa com dois serviços do Firebase.  
A imagem vai para o Firebase Storage, e os dados estruturados do produto vão para o Cloud Firestore.

Então eu posso mostrar isso no console do Firebase.  
No Storage, a imagem fica armazenada na pasta de produtos.  
No Firestore, o documento do produto é criado com os dados do formulário, incluindo a URL da imagem e também o código de barras.

Depois disso, eu volto para o sistema e mostro que esse produto já aparece no catálogo.

No POS, eu também já consigo demonstrar a busca por código de barras.  
Neste momento, essa leitura já funciona por digitação manual ou por leitor físico que se comporta como teclado.

Então, se eu digitar o código de barras do produto no POS, o sistema já faz a busca e encontra o item.  
Se o produto for simples, ele já entra no carrinho.  
Se o produto tiver configurações, como adicionais ou tamanho, o sistema abre a etapa de seleção antes de concluir.

Sobre o Firebase, tecnicamente ele foi dividido em três responsabilidades principais no projeto.

O Firebase Authentication foi usado para autenticação com Google.

O Cloud Firestore foi usado como banco de dados principal, armazenando usuários e produtos.

E o Firebase Storage foi usado para armazenar as imagens dos produtos, evitando guardar arquivo binário dentro do banco.

Também foi importante configurar regras de segurança.  
Hoje, por exemplo, o usuário autenticado acessa apenas o próprio documento em `users`, e as operações de escrita em produtos e upload de imagem ficam restritas ao perfil administrador.

Por fim, a funcionalidade que ainda está pendente é a leitura do código de barras por câmera.  
Ela ainda não foi concluída porque eu estou aguardando a chegada da câmera que foi encomendada para testar o comportamento real no navegador.

Mas a base já está preparada para isso.  
Os produtos já possuem `barcode`, o POS já consegue buscar por esse valor, e a próxima etapa será fazer a câmera capturar esse código automaticamente e reaproveitar o mesmo fluxo que já está funcionando hoje.

Então, resumindo, essa etapa entregou autenticação real, persistência com Firestore, upload de imagem com Storage, cadastro de produto no admin e busca por código de barras no POS, deixando a aplicação muito mais próxima de um cenário real de uso.

## Roteiro de fala com pausas e frases-chave

### Abertura

"Agora eu vou apresentar as novas funcionalidades que foram desenvolvidas no projeto."

[pausa]

"O foco dessa etapa foi aproximar o sistema de um fluxo real, usando Firebase para autenticação, banco de dados e armazenamento de arquivos."

### Login e perfis

"Primeiro, eu vou mostrar o login."

[mostrar tela de login]

"Hoje o sistema já usa Firebase Authentication com login via Google."

[pausa]

"Depois do login, o sistema diferencia dois perfis: administrador e operador."

Frase-chave:
`Autenticação identifica quem entrou. O perfil define o que esse usuário pode acessar.`

### Firestore e usuários

"Além de autenticar, o sistema também salva o usuário no Firestore."

[mostrar Firebase se quiser]

"Então, o usuário não só entra no sistema, como também passa a existir no banco com dados como nome, e-mail e perfil."

Frase-chave:
`O Authentication valida o acesso. O Firestore persiste os dados do sistema.`

### Cadastro de produto

"Na área administrativa, uma das principais entregas foi o cadastro de produto."

[abrir tela de cadastro]

"Aqui eu consigo informar nome, descrição, categoria, preço, estoque, código de barras, imagem e adicionais permitidos."

[pausa]

"Agora eu posso demonstrar isso em tempo real."

### Demonstração prática

"Vou preencher um produto, selecionar uma imagem e concluir o cadastro."

[preencher com calma]

"Quando eu salvo, esse fluxo usa dois serviços do Firebase."

[pausa]

"A imagem vai para o Storage, e os dados estruturados do produto vão para o Firestore."

Frase-chave:
`Arquivo no Storage. Dados no Firestore.`

### Prova no Firebase

"Agora eu consigo provar isso no console do Firebase."

[mostrar Storage]

"Aqui está a imagem do produto armazenada."

[mostrar Firestore]

"E aqui está o documento do produto salvo no banco, inclusive com a URL da imagem e o código de barras."

### POS e código de barras

"No POS, eu já consigo buscar produto por código de barras."

[abrir POS]

"Neste momento, a leitura já funciona por digitação manual ou por leitor físico que se comporta como teclado."

[digitar o código]

"Se eu informar o código, o sistema encontra o produto."

[pausa]

"Se o item for simples, ele já entra no carrinho. Se tiver configuração, o sistema abre a seleção."

Frase-chave:
`O POS já está preparado para trabalhar com barcode.`

### O que falta

"A parte que ainda está pendente é a leitura por câmera."

[pausa]

"Ela ainda não foi concluída, mas a base já está pronta."

Frase-chave:
`O barcode já existe no produto, e o POS já sabe buscar por ele. A câmera será só a próxima forma de captura.`

### Encerramento

"Então, resumindo, essa etapa entregou login real com Google, persistência com Firestore, upload de imagem com Storage, cadastro de produto no admin e busca por código de barras no POS."

[pausa]

"Com isso, o sistema ficou muito mais próximo de um cenário real de uso."
