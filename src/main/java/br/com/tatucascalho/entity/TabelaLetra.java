package br.com.tatucascalho.entity;

import java.util.ArrayList;

public class TabelaLetra {
	private ArrayList<ColunaTabelaLetra> colunaList = new ArrayList<ColunaTabelaLetra>();
	private String teste;

	public ArrayList<ColunaTabelaLetra> getColunaList() {
		return colunaList;
	}

	public void setColunaList(ArrayList<ColunaTabelaLetra> colunaList) {
		this.colunaList = colunaList;
	}

	public String getTeste() {
		return teste;
	}

	public void setTeste(String teste) {
		this.teste = teste;
	}

}
