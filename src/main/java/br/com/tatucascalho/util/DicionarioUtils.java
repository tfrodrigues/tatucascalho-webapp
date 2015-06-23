package br.com.tatucascalho.util;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DicionarioUtils {
	
	public static List<String> getPalavrasDicionario() throws FileNotFoundException {
		List<String> palavraList = new ArrayList<String>();
		BufferedReader in = new BufferedReader(new FileReader("C:\\temp\\dicionario.txt"));
		String palavra;
		try {
			palavra = in.readLine();
			while (palavra != null) {
				palavraList.add(palavra);
				palavra = in.readLine();
			}
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return palavraList;
	}
}
