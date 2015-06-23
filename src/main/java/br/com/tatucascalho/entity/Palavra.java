package br.com.tatucascalho.entity;

import java.util.List;

public class Palavra {
	private String palavra;
	private List<Integer> posicaoList;

	public Palavra() {

	}

	public Palavra(String palavra, List<Integer> posicaoList) {
		this.palavra = palavra;
		this.posicaoList = posicaoList;
	}

	public String getStrPosicao() {
		StringBuffer posicao = new StringBuffer();
		posicao.append(this.palavra);
		posicao.append("-");
		for (Integer numero : posicaoList) {
			posicao.append(numero + "-");
		}
		return posicao.toString().substring(0, posicao.toString().length() - 3);
	}

	public String getPalavra() {
		return palavra;
	}

	public void setPalavra(String palavra) {
		this.palavra = palavra;
	}

	public List<Integer> getPosicaoList() {
		return posicaoList;
	}

	public void setPosicaoList(List<Integer> posicaoList) {
		this.posicaoList = posicaoList;
	}

}
