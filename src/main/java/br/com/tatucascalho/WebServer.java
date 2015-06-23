package br.com.tatucascalho;

import org.eclipse.jetty.server.Server;

public class WebServer {
	public static void main(String[] args) throws Exception {
		ServerFactory factory = new ServerFactory(new ConfigurationBuilder().withContextPath("/tatucascalho-webapp").withPort(8080).withBaseResource(args != null && args.length > 0 ? args[0] : null)
				.build());

		Server server = factory.buildServer();
		server.start();
		server.join();

	}
}
