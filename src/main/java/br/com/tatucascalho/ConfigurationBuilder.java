package br.com.tatucascalho;

public class ConfigurationBuilder {
	private int port;
	private String contextPath;
	private String baseResource;

	public static ConfigurationBuilder newConfiguration() {
		return new ConfigurationBuilder();
	}

	public ConfigurationBuilder withPort(int port) {
		this.port = port;
		return this;
	}

	public ConfigurationBuilder withContextPath(String contextPath) {
		this.contextPath = contextPath;
		return this;
	}

	public ConfigurationBuilder withBaseResource(String baseResource) {
		this.baseResource = baseResource;
		return this;
	}

	public Configuration build() {
		return new Configuration(this.port, this.contextPath, this.baseResource);
	}
}
