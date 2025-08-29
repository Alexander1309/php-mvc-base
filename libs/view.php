<?php

class View
{
	private $params = [];
	private $default = ['pageTitle' => 'Inicio', 'sectionName' => 'Inicio'];
	private $session;
	private $styles = '';
	private $scripts = '';


	public function render($view, $params = [], $assets = [])
	{
		$this->params = array_merge($this->default, $params);
		$this->session = $_SESSION ?? [];

		$this->processAssets($assets);

		require_once $this->getViewPath($view);
	}

	public function location($url)
	{
		if (!headers_sent()) {
			header('Location: ' . $url);
			exit();
		}
	}

	private function includeIfAuthenticated($file, $defaultFile)
	{
		$fileToInclude = isset($_SESSION["id"]) ? $file : $defaultFile;

		if (file_exists($fileToInclude)) {
			require_once $fileToInclude;
		}
	}

	private function processAssets($assets)
	{
		if (empty($assets)) {
			return;
		}

		foreach ($assets as $asset) {
			if (!is_string($asset) || empty($asset)) {
				continue;
			}

			$ext = strtolower(pathinfo($asset, PATHINFO_EXTENSION));
			$safeAsset = htmlspecialchars($asset, ENT_QUOTES);

			switch ($ext) {
				case 'css':
					$this->styles .= '<link rel="stylesheet" href="' . ASSETS_PATH . 'css/' . $safeAsset . '">';
					break;
				case 'js':
					$this->scripts .= '<script src="' . ASSETS_PATH . 'js/' . $safeAsset . '"></script>';
					break;
			}
		}
	}

	private function getViewPath($view)
	{
		$view = str_replace(['../', '..\\'], '', $view);
		return 'views/' . $view . '.php';
	}

	public function getParam($key, $default = null)
	{
		return $this->params[$key] ?? $default;
	}

	public function getStyles()
	{
		return $this->styles;
	}

	public function getScripts()
	{
		return $this->scripts;
	}

	public function getSession($key = null)
	{
		return $key ? ($this->session[$key] ?? null) : $this->session;
	}

	public function isAuthenticated()
	{
		return isset($_SESSION["id"]);
	}

	public function __get($name)
	{
		return $this->params[$name] ?? null;
	}

	public function __isset($name)
	{
		return isset($this->params[$name]);
	}
}
