<?php

class ErrorController extends Controller
{
	private $args;

	function __construct($args)
	{
		parent::__construct();
		$this->args = $args;

		try {
			if (isset($_SESSION['id'])) header("Location: /home");
			else 	header("Location: /");
		} catch (Exception $e) {
			$this->view->render('error/index', $this->args);
		}
	}
}
