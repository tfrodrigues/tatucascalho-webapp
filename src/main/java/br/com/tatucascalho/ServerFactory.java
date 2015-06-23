package br.com.tatucascalho;

import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

public class ServerFactory {

	private Configuration config;

	public ServerFactory(Configuration configuration) {
		this.config = configuration;
	}

	public Server buildServer() {
		Server server = createServer();
		return server;
	}

	private Server createServer() {
		Server server = new Server(config.getPort());
		server.setHandler(createExternalHandler());
		return server;
	}

	private Handler createExternalHandler() {
		URL location = getSourceCodeURL();
		WebAppContext webapp = new WebAppContext(location.toExternalForm(), config.getContextPath());
		webapp.setParentLoaderPriority(true);
		if (!isAssembledWarFile(location) && config.getBaseResource() != null) {
			webapp.setResourceBase(config.getBaseResource());
		}
		return webapp;
	}

	private URL getSourceCodeURL() {
		ProtectionDomain protectionDomain = ServerFactory.class.getProtectionDomain();
		URL location = protectionDomain.getCodeSource().getLocation();
		return location;
	}

	private boolean isAssembledWarFile(URL location) {
		return location.toExternalForm().toLowerCase().endsWith(".war");
	}
}
