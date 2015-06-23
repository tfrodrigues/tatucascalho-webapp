<%@ page pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script
	src="<s:url value="/resources/javascript/app/pesquisaPalavras.js"/>"></script>
<div
	data-bind="ui-page: {title: '<s:message text="Pesquisa de Palavras"/>'}">
	<div class="row-fluid">
		<div
			data-bind="ui-box: {icon: 'fa-icon-filter', title: '<s:message text="Dados"/>'}"
			class="span4">
			<form id="searchForm">
				<div class="row-fluid">
					<label for="qtdeLinhas"><s:message
							text="Quantidade de Linhas" /></label> <input id="qtdeLinhas"
						type="text" class="span12" data-bind="value: filtros.qtdeLinhas">
					<label for="qtdeColunas"><s:message
							text="Quantidade de Colunas" /></label> <input id="qtdeColunas"
						type="text" class="span12" data-bind="value: filtros.qtdeColunas">
				</div>
				<div class="form-actions">
					<button id="preencherListagem" class="btn btn-success"
						data-bind="click: preencherListagem">
						<i class="icon icon-white icon-ok"></i>
						<s:message text="OK" />
					</button>
				</div>
				<div class="row-fluid" style="margin-top: 40px;">
					<div
						data-bind="ui-box: {icon: 'fa-icon-list', title: '<s:message  text="Palavras encontradas"/>'}"
						class="span12">
						<div class="row-fluid">
							<table
								data-bind="ui-table: {data: palavrasEncontradasGrid, click: selecionarPalavraNaGrid, dataTable: tableOptions }"></table>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="box-spacing visible-phone"></div>
		<div
			data-bind="ui-box: {icon: 'fa-icon-list', title: '<s:message  text="Listagem de letras"/>'}"
			class="span8">
			<form id="form">
				<div class="row-fluid">
					<table>
						<tbody data-bind="foreach: {data: grid, as: 'linha'} ">
							<tr>
								<td
									data-bind="foreach: {data: linha.colunaList, as: 'letraInformada'}">
									<input id="letra"
									style="width: 20px; text-align: center; font-weight: bold;"
									type="text" maxlength="1"
									data-bind="value: letraInformada.letra, style:{'background-color': letraInformada.backgroundcolor, 'color': letraInformada.backgroundcolor == 'red' ? 'white' : 'black'}" />
								</td>
							</tr>
						</tbody>
					</table>
					<div class="form-actions">
						<button id="Pesquisar_1" class="btn btn-success"
							data-bind="click: pesquisarPalavrasTipo1">
							<i class="icon icon-white icon-search"></i>
							<s:message text="Pesquisar" />
						</button>
						<button id="limpar" class="btn"
						data-bind="click: limpar">
						<i class="icon icon-file"></i>
						<s:message text="Limpar Formatação" />
					</button>
					
					</div>
				</div>
			</form>
		</div>

	</div>
</div>
<script type="text/javascript">
	var view = new PESQUISARPALAVRAS.Core.view();
	ko.applyBindings(view);
</script>
