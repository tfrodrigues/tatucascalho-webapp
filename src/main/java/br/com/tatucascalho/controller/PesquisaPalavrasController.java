package br.com.tatucascalho.controller;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import br.com.tatucascalho.entity.ColunaTabelaLetra;
import br.com.tatucascalho.entity.Palavra;
import br.com.tatucascalho.entity.TabelaLetra;
import br.com.tatucascalho.filter.PesquisaPalavrasFilter;
import br.com.tatucascalho.util.DicionarioUtils;

@Component
@RequestMapping(PesquisaPalavrasController.BASE_URL)
public class PesquisaPalavrasController {

	public static final String BASE_URL = "/pesquisaPalavras";

	List<TabelaLetra> tabelaLetraList = new ArrayList<TabelaLetra>();

	List<String> palavraDicionarioList = new ArrayList<String>();

	public PesquisaPalavrasController() {
		try {
			palavraDicionarioList = DicionarioUtils.getPalavrasDicionario();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView home(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
		modelAndView.setViewName("pesquisaPalavrasView");
		return modelAndView;
	}

	@ResponseBody
	@RequestMapping(value = "/preencherListagem", method = RequestMethod.POST)
	public List<TabelaLetra> preencherListagem(@RequestBody PesquisaPalavrasFilter filter) {
		List<TabelaLetra> list = new ArrayList<TabelaLetra>();
		String[] letras = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"};
		for (int l = 0; l < filter.getQtdeLinhas(); l++) {
			TabelaLetra linha = new TabelaLetra();
			for (int c = 0; c < filter.getQtdeColunas(); c++) {
				ColunaTabelaLetra colunaTabelaLetra = new ColunaTabelaLetra();
				int posicao = (int) (Math.random() * 26);
				colunaTabelaLetra.setLetra(letras[posicao]);
				linha.getColunaList().add(colunaTabelaLetra);
			}
			list.add(linha);
		}
		return list;
	}

	@ResponseBody
	@RequestMapping(value = "/pesquisarPalavrasPorSequencia", method = RequestMethod.POST)
	public List<Palavra> pesquisarPalavrasPorSequencia(@RequestBody List<TabelaLetra> tabelaLetraList) {
		return getPalavrasNaGrid(tabelaLetraList, true);
	}
	
	@ResponseBody
	@RequestMapping(value = "/pesquisarPalavrasPorLinha", method = RequestMethod.POST)
	public List<Palavra> pesquisarPalavrasPorLinha(@RequestBody List<TabelaLetra> tabelaLetraList) {
		return getPalavrasNaGrid(tabelaLetraList, false);
	}
	
	
	private List<Palavra> getPalavrasNaGrid(List<TabelaLetra> tabelaLetraList, boolean pesquisarPalavrasPorSequencia) {
		List<Palavra> palavras = new ArrayList<Palavra>();
		this.tabelaLetraList.clear();
		this.tabelaLetraList.addAll(tabelaLetraList);
		int posicao = 1;
		List<Integer> posicaoList = new ArrayList<Integer>();
		boolean encontrouLetra = false;
		int posicaoLetraProcurada = 0;
		for (String palavra : palavraDicionarioList) {
			posicao = 1;
			posicaoLetraProcurada = -1;
			int linhaAtual = 0;
			int colunaAtual = 0;
			while (posicaoLetraProcurada < palavra.length() - 1) {
				if (!encontrouLetra && posicaoLetraProcurada > -1) {					
					break;
				}
				encontrouLetra = false;
				posicaoLetraProcurada++;
				String letra = palavra.substring(posicaoLetraProcurada, posicaoLetraProcurada + 1);
				for (int l = linhaAtual; l < tabelaLetraList.size(); l++) {
					TabelaLetra tabelaLetra = tabelaLetraList.get(l);
					List<ColunaTabelaLetra> colunaTabelaLetraList = tabelaLetra.getColunaList();
					for (int c = colunaAtual; c < colunaTabelaLetraList.size(); c++) {
						ColunaTabelaLetra colunaTabelaLetra = colunaTabelaLetraList.get(c);
						if (letra.equalsIgnoreCase(colunaTabelaLetra.getLetra())) {
							posicaoList.add(posicao);
							if (pesquisarPalavrasPorSequencia) {
								posicao = 1;	
								colunaAtual++;								
							} else {
								//passa a procurar na próxima linha
								posicao = colunaTabelaLetraList.size() - colunaAtual;
								colunaAtual = 0;
								linhaAtual++;
							}
							encontrouLetra = true;
							break;
						}
						colunaAtual++;
						posicao++;
					}
					if (posicaoList.size() == palavra.length()) {
						palavras.add(new Palavra(palavra, posicaoList));
						encontrouLetra = false;
						linhaAtual = 0;
						colunaAtual = 0;
						break;
					} else {
						if (colunaAtual == colunaTabelaLetraList.size()) {
							colunaAtual = 0;
							linhaAtual++;
							//chegou no final e não encontrou palavra completa
							if (linhaAtual == tabelaLetraList.size()) {
								linhaAtual = 0;
								colunaAtual = 0;
								encontrouLetra = false;
								break;
							}
						}
						if (encontrouLetra) {
							break;
						}
					}
				}
			}
			posicaoList = new ArrayList<Integer>();
		}
		return palavras;
	}
	
	@ResponseBody
	@RequestMapping(value = "/selecionarPalavra", method = RequestMethod.POST)
	public List<TabelaLetra> selecionarPalavras(@RequestBody Palavra palavra) {
		List<ColunaTabelaLetra> letraList = new ArrayList<ColunaTabelaLetra>();
		limparFormatacaoTabela(letraList);
		int contador = 1;
		int ultimocontador = 0;
		for (int i = 0; i < palavra.getPalavra().length(); i++) {
			for (ColunaTabelaLetra colunaTabelaLetra : letraList) {
				int result = palavra.getPosicaoList().get(i) + ultimocontador;
				if (result == contador) {
					letraList.get(contador - 1).setBackgroundcolor("red");
					ultimocontador = contador;
					break;
				}
				contador++;
			}
		}
		return tabelaLetraList;
	}

	@ResponseBody
	@RequestMapping(value = "/limparFormatacaoTabelaPesquisar", method = RequestMethod.POST)
	private List<TabelaLetra> limparFormatacaoTabelaPesquisar(@RequestBody List<TabelaLetra> tabelaLetraList) {
		this.tabelaLetraList.clear();
		this.tabelaLetraList.addAll(tabelaLetraList);
		limparFormatacaoTabela(null);
		return tabelaLetraList;
	}

	private void limparFormatacaoTabela(List<ColunaTabelaLetra> letraList) {
		for (TabelaLetra tabelaLetra : tabelaLetraList) {
			for (ColunaTabelaLetra colunaLetra : tabelaLetra.getColunaList()) {
				colunaLetra.setBackgroundcolor("#EBF1EB");
				if (letraList != null) {
					letraList.add(colunaLetra);
				}
			}
		}
	}
}
