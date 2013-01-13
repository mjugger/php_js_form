<?php
	class email_model {
		private $to;
		private $subject = 'Here\'s your login info ya bum....';
		public $headers = "From: mukhtar.jugger@gmail.com \r\n Reply-To: mukhtar.jugger@gmail.com \r\n X-Mailer: PHP/";
   							
		public function __construct($email){
			$this->to = $email;
		}
		
		private function emailBody($username,$rawPass){
			return $message = "your username is: ".$username."\r\n".
						"and your passcode is: ";
			
		}
		
		public function sendEmail($username){
			$emailbody = $this->emailBody($username,'wakawaka');
			if(mail($this->to,$this->subject,$emailbody,$this->headers)){
				return 'sent email';
			}else{
				return 'email failed';
			}
		}
	}
?>