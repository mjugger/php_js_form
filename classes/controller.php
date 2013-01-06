<?php
	include "model.php";

	class controller {

		public function __construct(){
			//return $this->sendToDatabase($fieldData);
		}

		public function sendToDatabase($fieldData){
			$model = new model();
			$db_responce = $model->mysqlConnect($fieldData);
			return $db_responce;
		}
	}

?>