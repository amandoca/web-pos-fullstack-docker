# 📄 Regras de Negócio — WEB POS

---

## 📌 Visão Geral

Sistema de ponto de venda (POS) com dois perfis:

- **Operador**: responsável pela venda
- **Administrador**: responsável pela gestão de produtos

O cliente final não interage com o sistema.

---

# 👤 RN-OP — Operador (Vendas)

---

## RN-OP-01 — Autenticação

O operador deve realizar login com **Google via Firebase Authentication** para acessar o sistema.

---

## RN-OP-02 — Visualização de Produtos

O sistema deve exibir produtos contendo:

- título
- descrição
- preço base
- imagem do produto
- código de barras, quando cadastrado

Os produtos exibidos no sistema devem ser lidos da coleção `products` no **Cloud Firestore**.

---

## RN-OP-03 — Exibição de Disponibilidade

- Produtos indisponíveis devem ser exibidos
- Devem conter indicação visual: **“INDISPONÍVEL”**
- Não podem ser adicionados ao carrinho

---

## RN-OP-04 — Categorias

Categorias fixas:

- carnes
- hambúrgueres
- pizzas
- bebidas
- sobremesas
- lanches
- massas
- saladas

---

## RN-OP-05 — Seleção de Produto

Ao selecionar um produto, o sistema deve abrir um **modal de configuração** antes da adição ao carrinho quando o item possuir:

- tamanhos
- adicionais permitidos

Se o produto não possuir configuração adicional, ele pode ser adicionado diretamente ao carrinho.

---

## RN-OP-06 — Tamanho do Produto

- Se o produto possuir tamanhos:
  - a seleção de tamanho é **obrigatória**
  - opções: pequeno, médio, grande

- Se o produto não possuir tamanhos:
  - essa etapa não deve ser exibida

---

## RN-OP-07 — Adicionais

- Produtos podem possuir adicionais (ex: queijo, cebola)
- A seleção de adicionais é opcional
- **Não é permitido repetir adicionais**

---

## RN-OP-08 — Adição ao Carrinho

O produto só pode ser adicionado ao carrinho se:

- estiver disponível
- houver estoque
- (quando aplicável) tamanho estiver selecionado

---

## RN-OP-09 — Estrutura do Item no Carrinho

Cada item deve conter:

- título
- preço final (com tamanho e adicionais)
- tamanho (quando aplicável)
- adicionais selecionados
- quantidade

---

## RN-OP-10 — Alteração de Quantidade

- Quantidade mínima: 1
- Quantidade máxima: estoque disponível

---

## RN-OP-11 — Remoção de Item

A remoção só pode ocorrer via redução de quantidade:

- Ao tentar reduzir abaixo de 1:
  - exibir: **“Remover item?” (Sim / Não)**

Comportamento:

- **Sim** → remove item
- **Não** → mantém quantidade em 1

---

## RN-OP-12 — Cálculo do Carrinho

O sistema deve exibir:

- **Subtotal**
- **Taxa (6%)**
- **Total**

A taxa deve ser calculada e exibida antes da finalização.

---

## RN-OP-13 — Forma de Pagamento

- Deve ser selecionada a partir de uma lista cadastrada em `payment-methods`
- A lista deve ser lida do **Cloud Firestore**

---

## RN-OP-14 — Busca por Código de Barras

- O POS deve permitir localizar produto por **código de barras**
- A busca pode ocorrer por:
  - digitação manual
  - leitor físico que funcione como teclado
- Ao localizar um produto:
  - se não houver configuração adicional, o item pode entrar direto no carrinho
  - se houver tamanho ou adicionais, o modal de configuração deve ser aberto

---

## RN-OP-15 — Finalização do Pedido

O pedido só pode ser finalizado se:

- houver itens no carrinho
- todos os itens tiverem estoque disponível
- forma de pagamento selecionada

Ao finalizar:

- estoque é decrementado
- pedido é registrado na coleção `orders`
- carrinho é limpo
- os dados devem ser persistidos no **Cloud Firestore**

---

## RN-OP-16 — Restrições

Não é permitido:

- adicionar produto indisponível
- adicionar produto sem estoque
- finalizar pedido inválido

---

## RN-OP-17 — Cancelamento de Pedido

- Pedidos podem ser cancelados **somente por um administrador**
- Operadores não possuem permissão para cancelar pedidos
- Cancelamento só pode ocorrer após a finalização do pedido

Ao cancelar um pedido:

- o pedido deve ser marcado como cancelado
- o estoque dos itens deve ser restaurado

---

# 🛠️ RN-ADM — Administrador (Gestão)

---

## RN-ADM-01 — Autenticação

O administrador deve realizar login com **Google via Firebase Authentication**.

---

## RN-ADM-02 — Visualização de Produtos

Cada produto deve exibir:

- imagem
- título
- descrição
- estoque (editável)
- disponibilidade (switch: sim/não)

Os produtos exibidos no painel administrativo devem ser lidos da coleção `products` no **Cloud Firestore**.

---

## RN-ADM-03 — Atualização de Estoque

- Valor mínimo: 0
- Não pode ser negativo

---

## RN-ADM-04 — Disponibilidade do Produto

Regras:

- Pode ser controlada manualmente via switch
- Porém:
  - se **estoque = 0 → produto obrigatoriamente indisponível**

---

## RN-ADM-05 — Cadastro de Produto

O administrador pode cadastrar produto com os seguintes campos:

- título
- descrição
- preço
- categoria
- estoque
- disponibilidade
- imagem
- código de barras
- tamanhos disponíveis
- adicionais permitidos

Regras:

- a imagem do produto deve ser enviada para o **Firebase Storage**
- a URL final da imagem deve ser salva em `products.imageUrl`
- o produto deve ser persistido no **Cloud Firestore**

---

## RN-ADM-06 — Permissões

Somente o administrador pode:

- cadastrar produto
- alterar disponibilidade manualmente
- cancelar pedidos

Observação:

- no fluxo atual, o operador também participa da escrita em `products` durante o checkout, pois a baixa de estoque ocorre no frontend ao concluir a venda

---

## RN-ADM-07 — Cancelamento de Pedido

O administrador pode cancelar pedidos já finalizados.

Regras:

- Deve existir uma ação de cancelamento no pedido
- Ao cancelar:
  - o status do pedido deve ser atualizado para "cancelado"
  - o estoque dos produtos deve ser reprocessado (incrementado)

---

# 🔐 RN-GER — Regras Gerais

---

## RN-GER-01 — Perfis

Perfis do sistema:

- ADMINISTRADOR
- OPERADOR

---

## RN-GER-02 — Sessão

- Login com Google
- Logout manual
- Sessão restaurável pelo Firebase Authentication

---

## RN-GER-03 — Logout

- Deve existir botão de logout visível para o usuário logado
- Ao realizar logout:
  - sessão é encerrada
  - sistema retorna para tela de login

---

## RN-GER-04 — Cliente Final

- Cliente não interage com o sistema
- Não possui login
- Não possui acesso à interface

---

## RN-GER-05 — Consistência de Estoque

- Estoque nunca pode ser negativo
- Não é permitido venda sem estoque
- Ao concluir pedido, o estoque deve ser decrementado
- Ao cancelar pedido, o estoque deve ser restaurado

---

## RN-GER-06 — Integridade do Pedido

- Pedido finalizado não pode ser alterado
- Pedido só pode ser cancelado por um administrador
- O pedido deve registrar data de criação, atualização e cancelamento quando aplicável

---

## RN-GER-07 — Persistência

- Usuários devem ser persistidos em `users`
- Produtos devem ser persistidos em `products`
- Pedidos devem ser persistidos em `orders`
- Categorias, formas de pagamento, adicionais e tamanhos devem ser lidos do **Cloud Firestore**
- Imagens dos produtos devem ser armazenadas no **Firebase Storage**

---

## RN-GER-08 — Taxa

- Taxa fixa de **6%**
- Aplicada sobre o subtotal
- Exibida antes da finalização

---

## RN-GER-09 — Datas

- Campos de data em `users`, `products` e `orders` devem usar `timestamp` no Firestore
- A aplicação deve aceitar leitura de `timestamp` e também manter compatibilidade com registros antigos em texto durante a transição

---
