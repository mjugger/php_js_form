<?php
class model{
	public function __construct(){
		
		//return $this->mysqlConnect();
	}

	public function mysqlConnect($data){
		$mysqli = mysqli_connect("localhost", "root", "", "users");
		if (mysqli_connect_errno($mysqli)) {
    		return "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		return $this->validateRecord($mysqli,$data);
	}

	private function validateRecord($db,$data){
		$json = array();
		if($stmt = $db->prepare('select username from register where username = ?')){
			$stmt->bind_param('s',$data['username']);
			$stmt->execute();
			$stmt->store_result();
			if($stmt->num_rows > 0){
				$json['username_error'] = true;
			}
			if($stmt2 = $db->prepare('select email from register where email = ?')){
				$stmt2->bind_param('s',$data['email']);
				$stmt2->execute();
				$stmt2->store_result();
				if($stmt2->num_rows > 0){
					$json['email_error'] = true;
				}
			}
		}

		return json_encode($json);
	}

	private function enterRecord($userRecord){}
}
?>