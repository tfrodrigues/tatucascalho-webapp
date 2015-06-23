package br.com.tatucascalho.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Component
@RequestMapping(HomeController.BASE_URL)
public class HomeController {

	public static final String BASE_URL = "/";

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView home(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
		modelAndView.setViewName("home");
		return modelAndView;
	}

}
