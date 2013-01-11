<?php
	class email_model {
		private $to;
		private $subject = 'Here\'s your login info ya bum....';
		public $headers = "From: webmaster@example.com \r\n Reply-To: webmaster@example.com \r\n X-Mailer: PHP/";
   							
		public function __construct($email){
			$this->to = $email;
		}
		
		private function emailBody($username,$rawPass){
			return $message = "your username is: ".$username."\r\n".
						"and your passcode is: ".$rawPass."";
			
		}
		
		public function sendEmail(){
			$emailBody = $this->sendEmail($message);
			if(mail($this->to,$this->subject,$emailBody,$this->headers)){
				return 'sent email';
			}else{
				return 'email failed';
			}
		}
	}
?>