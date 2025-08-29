<?php
class Logger
{
	private $errorLogFile;
	private $infoLogFile;

	public function __construct()
	{
		//$this->errorLogFile = $_SERVER['DOCUMENT_ROOT'] . '/logs/error.log';
		//$this->infoLogFile = $_SERVER['DOCUMENT_ROOT'] . '/logs/info.log';
		$this->errorLogFile = '/logs/error.log';
		$this->infoLogFile = '/logs/info.log';
		if (!file_exists($this->errorLogFile)) {
			file_put_contents($this->errorLogFile, '');
		}
		if (!file_exists($this->infoLogFile)) {
			file_put_contents($this->infoLogFile, '');
		}
	}

	public function logError($message, $file, $line)
	{
		$logMessage = sprintf(
			"[%s] ERROR: %s in %s on line %d\n",
			date('Y-m-d H:i:s'),
			$message,
			$file,
			$line
		);

		file_put_contents($this->errorLogFile, $logMessage, FILE_APPEND);
	}

	public function logInfo($message, $route = null, $process = null)
	{
		$logMessage = sprintf(
			"[%s] INFO: %s",
			date('Y-m-d H:i:s'),
			$message
		);

		if ($route) {
			$logMessage .= sprintf(" | Route: %s", $route);
		}
		if ($process) {
			$logMessage .= sprintf(" | Process: %s", $process);
		}

		$logMessage .= "\n";

		file_put_contents($this->infoLogFile, $logMessage, FILE_APPEND);
	}
}
