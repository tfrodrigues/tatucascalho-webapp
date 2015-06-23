var PESQUISARPALAVRAS = {};

PESQUISARPALAVRAS.Core = {
	view : function() {
		var self = this;
		self.grid = ko.observableArray([]);
		self.palavrasEncontradasGrid = ko.observableArray([]);

		self.filtros = {
			qtdeLinhas : ko.observable(),
			qtdeColunas : ko.observable(),
		};

		self.palavra = {
			palavra : ko.observable(),
			posicaoList : ko.observableArray()
		};

		self.getModel = function() {
			var model = ko.toJS(self.filtros);
			return model;
		};

		self.preencherListagem = function() {
			self.palavrasEncontradasGrid([]);
			return AJAX.Core.postJSON('/tatucascalho-webapp/pesquisaPalavras/preencherListagem', self.getModel()).done(function(data) {
				self.grid(data);
			});
		};

		self.pesquisarPalavrasTipo1 = function() {		
			self.limpar(self.grid());			
			return AJAX.Core.postJSON('/tatucascalho-webapp/pesquisaPalavras/pesquisarPalavrasPorSequencia', self.grid()).done(function(data) {
				self.palavrasEncontradasGrid(data);				
			});
		};
		
		self.pesquisarPalavrasTipo2 = function() {		
			self.limpar(self.grid());			
			return AJAX.Core.postJSON('/tatucascalho-webapp/pesquisaPalavras/pesquisarPalavrasPorLinha', self.grid()).done(function(data) {
				self.palavrasEncontradasGrid(data);				
			});
		};
		
		self.limpar = function() {
			return AJAX.Core.postJSON('/tatucascalho-webapp/pesquisaPalavras/limparFormatacaoTabelaPesquisar', self.grid()).done(function(data) {
				self.grid(data);
			});
		};

		self.selecionarPalavraNaGrid = function(pData) {
			self.palavra.palavra(pData.palavra);
			self.palavra.posicaoList(pData.posicaoList);
			return AJAX.Core.postJSON('/tatucascalho-webapp/pesquisaPalavras/selecionarPalavra', ko.toJS(self.palavra)).done(function(data) {
				self.grid(data);
			});
		};

		self.tableOptions = {
			"bPaginate" : false,
			"sScrollY": "200px",
			aoColumns : [ {
				mData : 'strPosicao',
				sTitle : 'Palavra',
				sWidth : '50%'
			} ]
		};

	}
};