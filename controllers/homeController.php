<?php

class HomeController extends Controller
{
	private $args;

	function __construct($args)
	{
		parent::__construct();
		$this->args = $args;
	}


	function index()
	{
		$this->view->render('home/index', $this->args);
	}
}
