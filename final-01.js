
// ==========================================
// DESAFIO FINAL 01
// Tema: Mini-sistema de Loja + Caixa + Estoque
// ==========================================

// Objetivo
// Você vai construir um sistema completo (em memória, sem banco de dados) que:
// - mantém um catálogo de produtos e um estoque
// - cria carrinhos de compra, valida quantidades e calcula totais
// - aplica regras de preço (promoções/cupões) com prioridades e restrições
// - calcula impostos (IVA) por categoria
// - finaliza pedidos e imprime um cupom fiscal detalhado
// - gera relatórios simples de vendas

// Regras gerais
// - Não use bibliotecas externas.
// - Use apenas JavaScript (Node.js).
// - Não apague as assinaturas (nomes/params) dos métodos marcados como TODO.
// - Use estruturas de dados adequadas (Map/Array/Object).
// - Todas as validações devem lançar Error com mensagens claras.

// Como usar
// - Complete os TODOs.
// - Ao final, descomente a chamada de runDemo() no fim do arquivo.
// - O demo executa cenários que devem passar.

// ==========================================
// PARTE 0 - Dados e utilitários
// ==========================================

const CATEGORIAS = [
	"eletrodoméstico",
	"decoração",
	"materiais de construção",
	"vestuário",
	"alimentos"
];

const IVA_POR_CATEGORIA = {
	"eletrodoméstico": 0.23,
	"decoração": 0.23,
	"materiais de construção": 0.23,
	"vestuário": 0.23,
	"alimentos": 0.06
};

function round2(value) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatBRL(value) {
	// Evite Intl se quiser praticar manualmente.
	return `R$ ${round2(value).toFixed(2)}`.replace(".", ",");
}

function assertPositiveNumber(value, label) {
	if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value) || value <= 0) {
		throw new Error(`${label} deve ser um número positivo.`);
	}
}

function assertNonNegativeInt(value, label) {
	if (!Number.isInteger(value) || value < 0) {
		throw new Error(`${label} deve ser um inteiro >= 0.`);
	}
}

function assertCategoriaValida(categoria) {
	if (!CATEGORIAS.includes(categoria)) {
		throw new Error(`Categoria inválida: ${categoria}. Aceitas: ${CATEGORIAS.join(", ")}`);
	}
}

// ==========================================
// PARTE 1 - Modelos principais (classes)
// ==========================================

// 1) Crie a classe Produto
// Requisitos mínimos:
// - sku (string) único
// - nome (string)
// - preco (number > 0)
// - fabricante (string)
// - categoria (deve estar em CATEGORIAS)
// - numeroMaximoParcelas (int 1..24)
// Métodos:
// - getValorDeParcela(numeroDeParcelas) => number
//   - deve validar: numeroDeParcelas int >=1 e <= numeroMaximoParcelas
//   - retorna preco / numeroDeParcelas (2 casas)

class Produto {
	constructor({ sku, nome, preco, fabricante, categoria, numeroMaximoParcelas }) {
	
		if(!sku || typeof sku == "string"){
			throw new Error("SKU Obrigatorio")
		}
		if(preco <= 0){
			throw new Error("Preço tem que ser maior que 0")
		}
		if(!categoria.includes(categoria)){
			throw new Error("Categoria Invalida");
		}
		if(numeroMaximoParcelas <1 || numeroMaximoParcelas > 24){
			throw new Error("Numero maximo de parcelas tem de estar entre 1 e 24!")
		}

		this.sku = sku;
        this.nome =nome;
		this.preco =preco;
		this.fabricante =fabricante;
		this.categoria=categoria;
		this.numeroMaximoParcelas =numeroMaximoParcelas;

		
	}

	getValorDeParcela(numeroDeParcelas,valor) {
		if(numeroDeParcelas <1 || numeroDeParcelas > this.numeroMaximoParcelas){
			throw new Error("Numero de parcelas Invalido");
		}
		const valor = this.preco /numeroDeParcelas;

		return Number(valor.toFixed(2));
		
	}
	
}

// 2) Crie a classe Cliente
// Requisitos:
// - id (string)
// - nome (string)
// - tipo: "REGULAR" | "VIP"
// - saldoPontos (int >= 0)
// Métodos:
// - adicionarPontos(pontos)
// - resgatarPontos(pontos) => diminui saldo, valida

class Cliente {
	constructor({ id, nome, tipo = "REGULAR", saldoPontos = 0 }) {
		if(!id){
			throw new Error("Id Obrigatorio!")
		}
		if(!nome){
			throw new Error("Nome invalido")
		}
		if(tipo !== "Regular" && tipo !== "Vip"){
			throw new Error("Tipo Invalido!")	
		}
		if(saldoPontos < 0 || !Number.isInteger(saldoPontos)){
			throw new Error("Pontos Invalidos")
		}
		this.id =id;
		this.nome = nome;
		this.tipo = tipo;
		this.saldoPontos = saldoPontos;
		
	}

	adicionarPontos(pontos) {
		if(Number.isInteger(pontos)|| pontos <= 0){
			throw new Error("TODO: implementar adicionarPontos");
		}
		this.saldoPontos += pontos;
	}

	resgatarPontos(pontos) {
		if(!Number.isInteger(pontos) || pontos <=0){
			throw new Error("TODO: implementar resgatarPontos");
		}
		if(pontos > this.saldoPontos){
			throw new Error("Saldo Insuficiente")
		}
		this.saldoPontos-=pontos
	}
}

// 3) Crie a classe ItemCarrinho
// Requisitos:
// - sku (string)
// - quantidade (int >= 1)
// - precoUnitario (number > 0) *congelado no momento de adicionar*
// Observação: o carrinho usa precoUnitario do momento (para simular mudança de preço no catálogo).

class ItemCarrinho {
	constructor({ sku, quantidade, precoUnitario }) {
		
		if (!sku || typeof sku !== "string") {
			throw new Error("SKU inválido");
		}
		
		if(quantidade<1 || Number.isInteger(quantidade) ){
			throw new Error("Quantidade Invalida")
		}
		if(precoUnitario<=0 || typeof precoUnitario !== "number"){
			throw new Error("Preço Invalido")
		}
		this.sku = sku;
		this.quantidade = quantidade;
		this.precoUnitario = precoUnitario;

	}

	getTotal() {
		return this.precoUnitario * this.quantidade;
		
	}
}
	

// 4) Crie a classe Estoque
// Use Map para guardar { sku -> quantidade }
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
// Métodos:
// - definirQuantidade(sku, quantidade)
// - adicionar(sku, quantidade)
// - remover(sku, quantidade)
// - getQuantidade(sku)
// - garantirDisponibilidade(sku, quantidade)

class Estoque extends ItemCarrinho {
	constructor() {
		let estoqueMap = new Map()
		super()
		if(!(estoqueMap instanceof Map)){
			throw new Error("Estoque deve ser um Map");
		}
		 super({ sku: "", quantidade: 0, precoUnitario: 0 });
		 this.estoqueMap = Estoque;
	}

	definirQuantidade(sku, quantidade) {
		if(quantidade < 0 || !Number.isInteger(quantidade)){
			throw new Error("Quantidade invalida");
		}
		estoqueMap.set(sku, quantidade);
	}

	adicionar(sku, quantidade) {
		if(quantidade < 1 || !Number.isInteger(quantidade)){
			throw new Error("TODO: implementar adicionar");
		}
		let estoqueAtual = estoqueMap.get(sku) || 0;
		estoqueMap.set(sku,estoqueAtual+quantidade);

	}

	remover(sku, quantidade){
		let estoqueAtual = this.estoqueMap.get(sku);
		if(estoqueAtual === undefined || estoqueAtual < quantidade){

			throw new Error("TODO: implementar remover");
		}
		this.estoqueMap.set(sku,estoqueAtual-quantidade);
	}

	getQuantidade(sku) {
		return this.estoqueMap.get(sku ||0)
		}

	garantirDisponibilidade(sku, quantidade) {
		let estoqueAtual = this.estoqueMap.get(sku)
		if(estoqueAtual === undefined || estoqueAtual<quantidade){
			throw new Error("TODO: implementar garantirDisponibilidade");
		}
	return true;
	}
}

// 5) Crie a classe Catalogo
// Use Map para guardar { sku -> Produto }
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
// Métodos:
// - adicionarProduto(produto)
// - getProduto(sku)
// - listarPorCategoria(categoria)
// - atualizarPreco(sku, novoPreco)

class Catalogo {
	constructor() {
		let catalogoMap = new Map()
		super()
		if(!( catalogoMap instanceof Map)){
			throw new Error("Estoque deve ser um Map");
		}

		 super({ sku: "", quantidade: 0, precoUnitario: 0 });
		 this.catalogoMap = catalogoMap;
	}
		

	adicionarProduto(produto) {
		if(!(produto instanceof Produto)){
			throw new Error("Produto inválido");
		}
		if(this.catalogoMap.has(produto.sku)){
			throw new Error("SKU já existe no catálogo");
		}
		this.catalogoMap.set(produto.sku, produto);

	}

	getProduto(sku) {
		if(!this.catalogoMap.has(sku)){
			throw new Error("Produto não encontrado");
		}
		return this.catalogoMap.get(sku);

	}


	listarPorCategoria(categoria) {
		let produtos = [];
		for (let [sku, produto] of this.catalogoMap) {
			if (produto.categoria === categoria) {
				produtos.push(produto);
			}
		}
		return produtos;

	}

	atualizarPreco(sku, novoPreco) {
		if(!this.catalogoMap.has(sku)){
			throw new Error("Produto não encontrado");
		}
		let produto = this.catalogoMap.get(sku);
		if(novoPreco <= 0 || typeof novoPreco !== "number"){
			throw new Error("Preço inválido");
		}
		this.catalogoMap.set(sku, new Produto({
			sku: produto.sku,
			nome: produto.nome,
			categoria: produto.categoria,
			preco: novoPreco
		}));
	}
}

// 6) Crie a classe CarrinhoDeCompras
// Responsabilidades:
// - adicionar itens (validando estoque)
// - remover itens
// - alterar quantidade
// - calcular subtotal
// - consolidar itens por sku (sem duplicatas)
// Sugestão: use Map sku -> ItemCarrinho
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

class CarrinhoDeCompras {
	constructor({ catalogo, estoque }) {
		if(!(catalogo instanceof Catalogo)){
			throw new Error("Catalogo inválido");
		}
		if(!(estoque instanceof Estoque)){
			throw new Error("Estoque inválido");
		}
		this.catalogo = catalogo;
		this.estoque = estoque;
		this.itens = new Map();
	}

	adicionarItem(sku, quantidade) {
		if(quantidade < 1 || !Number.isInteger(quantidade)){
		throw new Error("Quantidade inválida");
	
	}
		let produto = this.catalogo.getProduto(sku);
		this.estoque.garantirDisponibilidade(sku, quantidade);
		if(this.itens.has(sku)){
			let item = this.itens.get(sku);
			this.itens.set(sku, {
				produto: item.produto,
				quantidade: item.quantidade + quantidade
			});
		} else {
			this.itens.set(sku, {
				produto: produto,
				quantidade: quantidade
			});
		}
	}

	removerItem(sku) {
		if(!this.itens.has(sku)){
			throw new Error("Item não encontrado no carrinho");
		}
		this.itens.delete(sku);
	}

	alterarQuantidade(sku, novaQuantidade) {
		if(novaQuantidade < 1 || !Number.isInteger(novaQuantidade)){
			throw new Error("Quantidade inválida");
	
	}		if(!this.itens.has(sku)){
			throw new Error("Item não encontrado no carrinho");
		}
		let item = this.itens.get(sku);
		this.itens.set(sku, {
			produto: item.produto,
			quantidade: novaQuantidade
		});
	}

	listarItens() {
		let itens = [];
		for(let [sku, item] of this.itens){
			itens.push({
				sku: sku,
				quantidade: item.quantidade,
				precoUnitario: item.produto.preco
			});
		}
		return itens;

	}

	getSubtotal() {
		let subtotal =0;
		for(let [sku, item] of this.itens){
			subtotal += item.produto.preco * item.quantidade;
		}
		return round2(subtotal);		
		
	}
}

// ==========================================
// PARTE 2 - Regras de preço (promoções)
// ==========================================

// Você implementará um motor de preços com as regras abaixo.
// Você deve conseguir produzir um “breakdown” (quebra) do total:
// - subtotal
// - descontos (lista com nome + valor)
// - base de imposto
// - imposto total
// - frete
// - total final

// Estrutura sugerida do breakdown (objeto):
// {
//   subtotal,
//   descontos: [{ codigo, descricao, valor }],
//   totalDescontos,
//   impostoPorCategoria: { [categoria]: valor },
//   totalImpostos,
//   frete,
//   total
// }

// 7) Regras obrigatórias (todas devem existir e ser testáveis):
// R1 - Desconto VIP:
// - Se cliente.tipo === "VIP", aplica 5% no subtotal (apenas uma vez).
// - Não pode ser aplicado se existir cupom "SEM-VIP".
//
// R2 - Cupom:
// - Cupom "ETIC10" => 10% no subtotal
// - Cupom "FRETEGRATIS" => frete zerado
// - Cupom "SEM-VIP" => bloqueia R1
// - Cupom inválido deve lançar Error
//
// R3 - Leve 3 pague 2 (vestuário):
// - Para produtos da categoria "vestuário": a cada 3 unidades (somando SKUs diferentes),
//   a unidade mais barata dentre as 3 sai grátis.
// - Ex: 3 camisetas (10), 1 calça (50), 1 meia (5) => total unidades=5 => aplica 1 grátis
//   (a mais barata dentro do grupo de 3) e sobram 2 sem promo.
//
// R4 - Desconto por valor:
// - Se subtotal >= 500, aplica desconto fixo de 30.
//
// Observação de dificuldade:
// - Você precisa decidir ordem de aplicação e documentar.
// - Você precisa impedir descontos maiores que o subtotal.
// - Deve ser determinístico.

// 8) Crie uma classe MotorDePrecos
// Método principal:
// - calcular({ cliente, itens, cupomCodigo }) => breakdown
// Onde itens é o resultado de carrinho.listarItens()

class MotorDePrecos {
	constructor({ catalogo }) {
		// TODO
		throw new Error("TODO: implementar MotorDePrecos");
	}

	calcular({ cliente, itens, cupomCodigo }) {
		// TODO
		throw new Error("TODO: implementar calcular");
	}
}

// ==========================================
// PARTE 3 - Checkout / Pedido / Cupom
// ==========================================

// 9) Crie a classe Pedido
// Requisitos:
// - id (string)
// - clienteId
// - itens (array)
// - breakdown (objeto)
// - status: "ABERTO" | "PAGO" | "CANCELADO"
// - createdAt (Date)
// Métodos:
// - pagar()
// - cancelar()

class Pedido {
	constructor({ id, clienteId, itens, breakdown }) {
		// TODO
		throw new Error("TODO: implementar Pedido");
	}

	pagar() {
		// TODO
		throw new Error("TODO: implementar pagar");
	}

	cancelar() {
		// TODO
		throw new Error("TODO: implementar cancelar");
	}
}

// 10) Crie a classe CaixaRegistradora
// Responsabilidades:
// - receber (catalogo, estoque, motorDePrecos)
// - fecharCompra({ cliente, carrinho, cupomCodigo, numeroDeParcelas }) => Pedido
// Regras:
// - Ao fechar compra, deve remover do estoque as quantidades compradas
// - Se numeroDeParcelas for informado, deve validar com base no Produto (máximo permitido)
// - Deve somar parcelas por item e imprimir um resumo no cupom (opcional, mas recomendado)

class CaixaRegistradora {
	constructor({ catalogo, estoque, motorDePrecos }) {
		// TODO
		throw new Error("TODO: implementar CaixaRegistradora");
	}

	fecharCompra({ cliente, carrinho, cupomCodigo = null, numeroDeParcelas = 1 }) {
		// TODO
		throw new Error("TODO: implementar fecharCompra");
	}
}

// 11) Crie a classe CupomFiscal
// Deve gerar texto em linhas (array de strings) contendo:
// - cabeçalho
// - itens: sku, quantidade, preço unitário, total do item
// - subtotal, descontos (linha por desconto), impostos (por categoria), frete, total
// - status do pedido

class CupomFiscal {
	constructor({ pedido, catalogo }) {
		// TODO
		throw new Error("TODO: implementar CupomFiscal");
	}

	gerarLinhas() {
		// TODO
		throw new Error("TODO: implementar gerarLinhas");
	}
}

class Impressora {
	imprimirLinhas(linhas) {
		for (const linha of linhas) {
			console.log(linha);
		}
	}
}

// ==========================================
// PARTE 4 - Relatórios (estruturas de dados + loops)
// ==========================================

// 12) Crie a classe RelatorioVendas
// - Deve armazenar pedidos pagos
// - Deve gerar:
//   - totalArrecadado()
//   - totalImpostos()
//   - totalDescontos()
//   - rankingProdutosPorQuantidade(topN)
//   - arrecadadoPorCategoria()
// Sugestão: use Map para acumular por sku/categoria.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

class RelatorioVendas {
	constructor() {
		// TODO
		throw new Error("TODO: implementar RelatorioVendas");
	}

	registrarPedido(pedido) {
		// TODO
		throw new Error("TODO: implementar registrarPedido");
	}

	totalArrecadado() {
		// TODO
		throw new Error("TODO: implementar totalArrecadado");
	}

	totalImpostos() {
		// TODO
		throw new Error("TODO: implementar totalImpostos");
	}

	totalDescontos() {
		// TODO
		throw new Error("TODO: implementar totalDescontos");
	}

	rankingProdutosPorQuantidade(topN = 5) {
		// TODO
		throw new Error("TODO: implementar rankingProdutosPorQuantidade");
	}

	arrecadadoPorCategoria() {
		// TODO
		throw new Error("TODO: implementar arrecadadoPorCategoria");
	}
}

// ==========================================
// DADOS DE TESTE (para o demo)
// ==========================================

function seedCatalogoEEstoque() {
	const catalogo = new Catalogo();
	const estoque = new Estoque();

	const produtos = [
		// alimentos
		{ sku: "ARROZ", nome: "Arroz 1kg", preco: 6.0, fabricante: "Marca A", categoria: "alimentos", numeroMaximoParcelas: 1 },
		{ sku: "FEIJAO", nome: "Feijão 1kg", preco: 7.5, fabricante: "Marca B", categoria: "alimentos", numeroMaximoParcelas: 1 },
		{ sku: "OLEO", nome: "Óleo 900ml", preco: 8.0, fabricante: "Marca C", categoria: "alimentos", numeroMaximoParcelas: 1 },
		// vestuário
		{ sku: "CAMISETA", nome: "Camiseta", preco: 30.0, fabricante: "Hering", categoria: "vestuário", numeroMaximoParcelas: 6 },
		{ sku: "CALCA", nome: "Calça Jeans", preco: 120.0, fabricante: "Levis", categoria: "vestuário", numeroMaximoParcelas: 6 },
		{ sku: "MEIA", nome: "Meia", preco: 10.0, fabricante: "Puket", categoria: "vestuário", numeroMaximoParcelas: 6 },
		// eletrodoméstico
		{ sku: "MICRO", nome: "Micro-ondas", preco: 499.9, fabricante: "LG", categoria: "eletrodoméstico", numeroMaximoParcelas: 12 },
		{ sku: "LIQUID", nome: "Liquidificador", preco: 199.9, fabricante: "Philco", categoria: "eletrodoméstico", numeroMaximoParcelas: 10 },
		// decoração
		{ sku: "VASO", nome: "Vaso Decorativo", preco: 89.9, fabricante: "Tok&Stok", categoria: "decoração", numeroMaximoParcelas: 5 },
		// materiais de construção
		{ sku: "CIMENTO", nome: "Cimento 25kg", preco: 35.0, fabricante: "Holcim", categoria: "materiais de construção", numeroMaximoParcelas: 3 }
	];

	for (const p of produtos) {
		const produto = new Produto(p);
		catalogo.adicionarProduto(produto);
	}

	// Estoque inicial
	estoque.definirQuantidade("ARROZ", 50);
	estoque.definirQuantidade("FEIJAO", 50);
	estoque.definirQuantidade("OLEO", 50);
	estoque.definirQuantidade("CAMISETA", 20);
	estoque.definirQuantidade("CALCA", 10);
	estoque.definirQuantidade("MEIA", 30);
	estoque.definirQuantidade("MICRO", 5);
	estoque.definirQuantidade("LIQUID", 8);
	estoque.definirQuantidade("VASO", 10);
	estoque.definirQuantidade("CIMENTO", 100);

	return { catalogo, estoque };
}

// ==========================================
// DEMO (cenários obrigatórios)
// ==========================================

// Critérios de aceite (quando você terminar):
// - Cenário A: cliente VIP, sem cupom, compra vestuário com regra leve-3-pague-2
// - Cenário B: cliente REGULAR com cupom ETIC10
// - Cenário C: cupom inválido deve gerar erro
// - Cenário D: tentar comprar acima do estoque deve gerar erro
// - Cenário E: relatório deve refletir pedidos pagos

function runDemo() {
	const { catalogo, estoque } = seedCatalogoEEstoque();
	const motor = new MotorDePrecos({ catalogo });
	const caixa = new CaixaRegistradora({ catalogo, estoque, motorDePrecos: motor });
	const relatorio = new RelatorioVendas();
	const impressora = new Impressora();

	const clienteVip = new Cliente({ id: "C1", nome: "Ana", tipo: "VIP", saldoPontos: 0 });
	const clienteRegular = new Cliente({ id: "C2", nome: "Bruno", tipo: "REGULAR", saldoPontos: 0 });

	// Cenário A
	{
		const carrinho = new CarrinhoDeCompras({ catalogo, estoque });
		carrinho.adicionarItem("CAMISETA", 2);
		carrinho.adicionarItem("MEIA", 1);
		carrinho.adicionarItem("CALCA", 1);

		const pedido = caixa.fecharCompra({
			cliente: clienteVip,
			carrinho,
			cupomCodigo: null,
			numeroDeParcelas: 3
		});

		pedido.pagar();
		relatorio.registrarPedido(pedido);

		const cupom = new CupomFiscal({ pedido, catalogo });
		impressora.imprimirLinhas(cupom.gerarLinhas());
	}

	// Cenário B
	{
		const carrinho = new CarrinhoDeCompras({ catalogo, estoque });
		carrinho.adicionarItem("MICRO", 1);
		carrinho.adicionarItem("VASO", 1);

		const pedido = caixa.fecharCompra({
			cliente: clienteRegular,
			carrinho,
			cupomCodigo: "ETIC10",
			numeroDeParcelas: 10
		});

		pedido.pagar();
		relatorio.registrarPedido(pedido);

		const cupom = new CupomFiscal({ pedido, catalogo });
		impressora.imprimirLinhas(cupom.gerarLinhas());
	}

	// Cenário C (cupom inválido)
	{
		const carrinho = new CarrinhoDeCompras({ catalogo, estoque });
		carrinho.adicionarItem("ARROZ", 1);

		try {
			caixa.fecharCompra({ cliente: clienteRegular, carrinho, cupomCodigo: "INVALIDO" });
		} catch (err) {
			console.log("(OK) Cupom inválido gerou erro:");
			console.log(String(err.message || err));
		}
	}

	// Cenário D (estoque insuficiente)
	{
		const carrinho = new CarrinhoDeCompras({ catalogo, estoque });
		try {
			carrinho.adicionarItem("MICRO", 999);
		} catch (err) {
			console.log("(OK) Estoque insuficiente gerou erro:");
			console.log(String(err.message || err));
		}
	}

	// Cenário E (relatório)
	{
		console.log("==============================");
		console.log("Relatório");
		console.log("==============================");
		console.log("Total arrecadado:", formatBRL(relatorio.totalArrecadado()));
		console.log("Total impostos:", formatBRL(relatorio.totalImpostos()));
		console.log("Total descontos:", formatBRL(relatorio.totalDescontos()));
		console.log("Top produtos:", relatorio.rankingProdutosPorQuantidade(3));
		console.log("Por categoria:", relatorio.arrecadadoPorCategoria());
	}
}

// Quando terminar tudo, descomente:
// runDemo();