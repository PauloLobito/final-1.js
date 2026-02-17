# Mini Sistema de Loja - Node.js

## Descrição

Este projeto é um mini-sistema de loja que simula, em memória, funcionalidades essenciais de um comércio, incluindo:

- Catálogo de produtos e gerenciamento de estoque
- Carrinho de compras com validação de quantidade e cálculo de totais
- Aplicação de regras de preços, promoções e cupons com prioridades e restrições
- Cálculo de impostos (IVA) por categoria de produto
- Finalização de pedidos com geração de cupom fiscal detalhado
- Geração de relatórios simples de vendas

O sistema foi desenvolvido sem uso de bibliotecas externas, utilizando apenas JavaScript (Node.js).

---

## Funcionalidades

- **Produtos:** SKU único, nome, preço, fabricante, categoria válida e parcelamento.
- **Clientes:** Tipos "REGULAR" e "VIP" com sistema de pontos.
- **Carrinho:** Adição, remoção e alteração de itens, com controle de estoque.
- **Estoque:** Gerenciamento com garantias de disponibilidade.
- **Promoções e Regras de Preço:**
  - Desconto VIP (5%)
  - Cupons (10% de desconto, frete grátis, bloqueio de desconto VIP)
  - Promoção "Leve 3 Pague 2" para vestuário
  - Desconto fixo para compras acima de R$500
- **Checkout e Pedidos:** Validação, pagamento, cancelamento e geração de cupom fiscal.
- **Relatórios:** Total arrecadado, impostos, descontos, ranking de produtos e arrecadação por categoria.

---

## Como Executar

1. **Pré-requisitos:**
   - Node.js instalado (versão 12 ou superior recomendada)

2. **Instalação:**
   - Clone este repositório
   - Navegue até a pasta do projeto

3. **Executar Demo:**

O arquivo principal já possui um demo (`runDemo()`) que executa cenários básicos para testar funcionalidades.

Para rodar, use o comando:

```bash
node final-01.js
