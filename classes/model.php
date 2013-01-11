<?php
require '../externalClasses/PasswordHash.php';
require 'email_model.php';

class model{

	private $hasher; //Used for Passcode incoding via the external class "Passcode Hash" (Blowfish-based bcrypt).

	public function __construct(){
		$this->hasher  = new PasswordHash(8,false);
	}

	public function mysqlConnect($data){
		$mysqli = mysqli_connect("localhost", "root", "", "users");
		if (mysqli_connect_errno($mysqli)) {
    		return "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$jsonResponce = $this->validateRecord($mysqli,$data);
		$mysqli->close();
		return $jsonResponce;
	}

	private function validateRecord($db,$data){
		$json = array();
		if(isset($data['login_pass'])){
			if($stmt = $db->prepare('select passcode from register where username = ?')){
				$stmt->bind_param('s',$data['login_user']);
				$stmt->execute();
				$stmt->store_result();
				$stmt->bind_result($pass);
				if($stmt->num_rows == 0){
					$json['login_error'] = 1;
				}else if($stmt->num_rows > 0){
					while($stmt->fetch()){
						if($this->comparePasscode($data['login_pass'],$pass)){
							$json['url'] = "http://www.google.com";
						}else{
							$json['login_error'] = 1;
						}
						
					}
				}
				$stmt->free_result();
				$stmt->close();
			}
		}else if(isset($data['lostLogin'])){
			if($stmt2 = $db->prepare('select username,passcode from register where email = ?')){
				$stmt2->bind_param('s',$data['lostLogin']);
				$stmt2->execute();
				$stmt2->store_result();
				$stmt2->bind_result($username,$rawPass);
				$em = new email_model($data['lostLogin']);
				if($stmt2->num_rows == 0){
					$json['retrieval_error'] = true;
				}else{
					$json['retrieval_success'] = true;
					while($stmt2->fetch()){
						$json['retrieval_success'] = $em->sendEmail($username,$rawPass);
					}
					
				}
				$stmt2->free_result();
				$stmt2->close();
			}
		}else{
			if($stmt3 = $db->prepare('select username from register where username = ?')){
				$stmt3->bind_param('s',$data['username']);
				$stmt3->execute();
				$stmt3->store_result();
				if($stmt3->num_rows > 0){
					$json['username_error'] = true;
				}
				$stmt3->free_result();
				$stmt3->close();
			}
		
			if($stmt4 = $db->prepare('select email from register where email = ?')){
				$stmt4->bind_param('s',$data['email']);
				$stmt4->execute();
				$stmt4->store_result();
				if($stmt4->num_rows > 0){
					$json['email_error'] = true;
				}
				$stmt4->free_result();
				$stmt4->close();
			
			}
		}
		if (count($json) == 0) {
			$this->enterRecord($db,$data);
			return false;
		}
		return json_encode($json);
	}
	
	private function incodePasscode($passcode){
		
		return $this->hasher->HashPassword($passcode);
	}

	private function comparePasscode($userPass,$storedPass){
		$compare = $this->hasher->CheckPassword($userPass,$storedPass);
		if($compare){
			return true;
		}else{
			return false;
		}
	}
	
	private function enterRecord($db,$data){
		if($stmt = $db->prepare('insert into register (username,firstname,lastname,email,passcode) values (?,?,?,?,?)')){
			$secure_pass = $this->incodePasscode($data['passcode']);
			$stmt->bind_param('sssss',$data['username'],$data['firstname'],$data['lastname'],$data['email'],$secure_pass);
			$stmt->execute();
			$stmt->close();
		}
	}
}
?>