<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
%><%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"
%><%@ taglib uri="http://www.springframework.org/tags" prefix="s" 
%><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title><s:message code="app.title" text="SISTEMA TATUCASCALHO" /></title>

    <!-- start: CSS -->        
    <link href="<s:url value="/resources/css/chosen.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/uniform.default.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/glyphicons.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/halflings.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/bootstrap.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/bootstrap-responsive.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/style.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/style-responsive.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/font-awesome.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/fullcalendar.css"/>" rel="stylesheet"/>
    <link href="<s:url value="/resources/css/tatucascalho.css"/>" rel="stylesheet"/>
    <!-- end: CSS -->

    <!-- start: JavaScript -->
        <script src="<s:url value="/resources/javascript/jquery-1.9.1.min.js"/>"></script>
    <script src="<s:url value="/resources/javascript/lib/jquery.chosen.js"/>"></script>
    <script src="<s:url value="/resources/javascript/knockout-2.3.0.js"/>"></script>
    <script src="<s:url value="/resources/javascript/lib/jquery.pnotify.js"/>"></script>
    <script src="<s:url value="/resources/javascript/lib/spin.js"/>"></script>
    <script src="<s:url value="/resources/javascript/lib/jquery-ui.js"/>"></script>
    <script src="<s:url value="/resources/javascript/lib/jquery.inputmask.js"/>"></script>
    
    <script src="<s:url value="/resources/javascript/lib/bootstrap.js"/>"></script>        
    <script src="<s:url value="/resources/javascript/lib/jquery.dataTables.js"/>"></script>
    <script src="<s:url value="/resources/javascript/ui/box.js"/>"></script>
    <script src="<s:url value="/resources/javascript/nls/messages.js"/>"></script>        
    <script src="<s:url value="/resources/javascript/ajax.js"/>"></script>        
    <script src="<s:url value="/resources/javascript/ui/box.js"/>"></script>
    <script src="<s:url value="/resources/javascript/ui/ko.js"/>"></script>
    <script src="<s:url value="/resources/javascript/ui/utils.js"/>"></script>
    <script src="<s:url value="/resources/javascript/lib/iso8601.js"/>"></script>
    <script src="<s:url value="/resources/javascript/utils.js"/>"></script>
    <script src="<s:url value="/resources/javascript/ui-deprecated.js"/>"></script>
    <script src="<s:url value="/resources/javascript/ui.js"/>"></script>       
        

    <!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
            <script src="<s:url value="/static/js/lib/html5shim.js?v=${VERSION.number}"/>"></script>
            <![endif]-->
            <!-- end: JavaScript -->
        </head>
        <body>
            <tiles:insertAttribute name="header"  defaultValue="" />
            <div class="container-fluid">
                <div class="row-fluid">
                    <tiles:insertAttribute name="menu"  defaultValue="" />
                    <!-- start: Content -->
                    <div id="content" class="span11">
                        <div class="row-fluid">
                            <div id="titleWrapper" class="smooth-gradient-header"><div id="title-margin" class="hidden-phone"></div><div id="title"></div>
                            <a id="help" class="hide por enquanto" href="javascript:void(0)">
                                <i class="fa-icon-question-sign"></i>
                            </a>
                        </div>
                    </div>
                    <div>

                    </div>
                    <div id="innerContent">
                        <tiles:insertAttribute name="content" defaultValue="" />
                    </div>
                </div>
                <!-- end: Content -->
            </div>
        </div>
        <tiles:insertAttribute name="footer"  defaultValue="" />
    </body>
    <script>
        UI.init();
    </script>
    </html>
