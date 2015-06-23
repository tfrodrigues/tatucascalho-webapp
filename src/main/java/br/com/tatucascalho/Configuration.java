package br.com.tatucascalho;

public class Configuration {

	private final int port;
	private final String contextPath;
	private String baseResource;

	public Configuration(int port, String contextPath, String baseResource) {
		this.port = port;
		this.contextPath = contextPath;
		this.baseResource = baseResource;
	}

	public int getPort() {
		return port;
	}

	public String getContextPath() {
		return contextPath;
	}

	public String getBaseResource() {
		return baseResource;
	}

}