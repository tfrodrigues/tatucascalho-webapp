<%@page import="br.com.tatucascalho.controller.PesquisaPalavrasController"%>
<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<!-- start: Main Menu --> 
<div id="sidebar-left" class="span1">
	<div class="nav-collapse sidebar-nav">
		<ul class="nav nav-tabs nav-stacked main-menu">
			<li>
			<a id="menu_procura_palavras" class="dropmenu" href="<s:url value="<%=PesquisaPalavrasController.BASE_URL%>"/>">
					<i class="fa-icon-font"></i>
					<span class="menu-text"><s:message  text="Pesquisar Palavras" /></span>
				</a>
			</li>
		</ul>
	</div>
</div>
<!-- end: Main Menu -->