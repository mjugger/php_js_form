<?php
class model{
	public function __construct(){}

	public function mysqlConnect($data){
		$mysqli = mysqli_connect("localhost", "root", "", "users");
		if (mysqli_connect_errno($mysqli)) {
    		return "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$jsonResponce = $this->validateRecord($mysqli,$data);
		$mysqli -> close();
		return $jsonResponce;
	}

	private function validateRecord($db,$data){
		$json = array();
		if(isset($data['login_pass'])){
			if($stmt = $db->prepare('select username,passcode from register where username = ? and passcode = ?')){
				$stmt->bind_param('ss',$data['login_user'],$data['login_pass']);
				$stmt->execute();
				$stmt->store_result();
				if($stmt->num_rows > 0){
					$json['login_error'] = true;
				}
				$stmt->close();
			}
		}else{
			if($stmt2 = $db->prepare('select username from register where username = ?')){
			$stmt2->bind_param('s',$data['username']);
			$stmt2->execute();
			$stmt2->store_result();
			if($stmt2->num_rows > 0){
				$json['username_error'] = true;
			}
			$stmt2->close();
		}
		
			if($stmt3 = $db->prepare('select email from register where email = ?')){
			$stmt3->bind_param('s',$data['email']);
			$stmt3->execute();
			$stmt3->store_result();
			if($stmt3->num_rows > 0){
				$json['email_error'] = true;
			}
			$stmt3->close();
		}
		}
		if (count($json) == 0) {
			$this->enterRecord($db,$data);
			return false;
		}
		return json_encode($json);
	}

	private function enterRecord($db,$data){
		if($stmt = $db->prepare('insert into register (username,firstname,lastname,email) values (?,?,?,?)')){
			$stmt->bind_param('ssss',$data['username'],$data['firstname'],$data['lastname'],$data['email']);
			$stmt->execute();
			$stmt->close();
		}
	}
}
?>