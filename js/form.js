

var projectForm = {
	globals:{
		myRegExps:{
			email:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/,
			symbols:/[^0-9a-zA-Z]/,
			numbers:/[0-9]/
		},
		errors:['This Email is already registered.',
				'The username @username is already in use.',
				'Field cannot contain numbers.',
				'Username does not match our records.',
				'Passcode does not match our records.',
				'Not entered',
				'The email you entered has an incorrect format',
				'Field cannot use special characters (i.e. ~ ! # $ % ^ & * etc...)',
				'The username and/or passcode you entered are incorrect.',
				'The Passcodes don\'t match. Please try again',
				'Your Passcode is to short',
				'Your Passcode is to long',
				'Your Passcode should be between 5 and 9 characters.'
			]
	},
	
	initListeners:function(){
		$(this.Class('myButton')).click(function(){
			if(this.id === 'regSubmit'){
				if(!projectForm.errorCheck(projectForm.Class('regFields'))){
					var postPackage = projectForm.postobjConstruct(projectForm.Class('regFields'));
					projectForm.callHelper(postPackage);
				}
			}else if(this.id === 'logSubmit'){
				if(!projectForm.errorCheck(projectForm.Class('logFields'))){
					var postPackage = projectForm.postobjConstruct(projectForm.Class('logFields'));
					projectForm.callHelper(postPackage);
				}
			}
			return false;
		});
		$(this.Class('exBtn')).click(function(){
			projectForm.switchViews($(this).attr('id'));
		});
	},
	
	postobjConstruct:function(fields){
		var postObj = {};
		var fieldSize = fields.length;
		for(var i = 0; i < fieldSize; i++){
			postObj[fields[i].name] = String(fields[i].value);
		}
		return postObj;
	},
	
	callHelper:function(postPack){
		$.ajax({
     		 url: 'helpers/messenger.php', 
      		data: postPack,
      		type: 'POST',
      		dataType: 'json',

      		success: function(data) {
         		projectForm.validateJson(data);
      		}
   		});
	},
	
	switchViews:function(id){
	this.errorDisplay('');
		switch(id){
			case 'gotoLogin':
				this.animateGrid({y:'0px'});
				break;
			case 'gotoLogin2':
				this.animateGrid({x:'0px'});
				break;
			case 'gotoRegister':
				this.animateGrid({y:'-350px'});
				break;
			case 'gotoRetrieve':
				this.animateGrid({x:'-400px'});
				break;
			case 'successUp':
				this.animateGrid({y:'-350px'});
				break;
			case 'successLeft':
				this.animateGrid({x:'-400px'});
				break;
		}
	},
	
	animateGrid:function(gridXY){
		if(gridXY.x){
			$(this.id('formGrid')).animate({left:gridXY.x},500);
		}else if(gridXY.y){
			$(this.id('formGrid')).animate({bottom:gridXY.y},500);
		}
	},
	
	addHilight:function(field){
		if(!field.className.match('incorrectfield')){
			field.className+=' incorrectfield';
		}
	},
	
	removeHilight:function(field){
		
		if(field.className.match('incorrectfield')){
			field.className = field.className.replace('incorrectfield','');
		}
	},
	
	errorCheck:function(fields){
		this.id('regErrors').innerHTML = ''; // clears old error text.
		var errorTxt = '';
		var fieldsArray = fields.length;
		for(var i = 0; i < fieldsArray; i++){
			errorTxt += this.validateField(fields[i]);	
		}
		if(errorTxt !== ''){
			this.errorDisplay(errorTxt);
			return true;
		}else {
			return false;
		}
	},
	
	validateField:function(val){ // used to validate before going to the server.
		var errorCode = '';
		if(val.value !== ''){
			if(val.name == 'email'){
				if(!val.value.match(this.globals.myRegExps.email)){
					errorCode = this.globals.errors[6]+'<br>';
				}
			}else if(val.name == 'firstname' || val.name == 'lastname'){
				if(val.value.match(this.globals.myRegExps.numbers)){
					errorCode += val.name+' '+this.globals.errors[2]+'<br>';
				}
				if(val.value.match(this.globals.myRegExps.symbols)){
					errorCode += val.name+' '+this.globals.errors[7]+'<br>';
				}
			}else if(val.name == 'username'){
				if(val.value.match(this.globals.myRegExps.symbols)){
					errorCode += val.name+' '+this.globals.errors[7]+'<br>';
				}
			}else if(val.name == 'passcode' || val.name == 'passcode_check'){
				errorCode+=this.validatePasscode(val);
			}
		}else{
			errorCode = val.name+' '+this.globals.errors[5]+'<br>';
		}
		if(errorCode !== ''){
			this.addHilight(val);
		}else {
			this.removeHilight(val);
		}
			return errorCode;
	},
	
	validatePasscode:function(passField){
		var passErrors = '';
		if(this.Class('regFields')[5].value !== passField.value){
			passErrors+=this.globals.errors[9]+'<br>';
		}
		if(String(passField.value).length < 5){
			passErrors+=this.globals.errors[10]+' '+this.globals.errors[12]+'<br>';
		}else if(String(passField.value).length > 9){
			passErrors+=this.globals.errors[11]+' '+passErrors+=this.globals.errors[12]+'<br>';
		}
		return passErrors;
	},
	
	validateJson:function(json){ // validates the json returned from the server.
		var serverErrors = '';
		if (json) {
			if(json.login_error){
				serverErrors+= this.globals.errors[8];
				this.addHilight(projectForm.Class('logFields')[0]);
				this.addHilight(projectForm.Class('logFields')[1]);
			}else if(json.url){
				window.open(json.url,'_self');
			}
			if(json.username_error){
				if(this.globals.errors[1].match('@username')){
					var name = this.globals.errors[1].replace('@username',projectForm.Class('regFields')[3].value);
					this.addHilight(projectForm.Class('regFields')[3]);
					name+='<br>';
				}
				serverErrors+= name;
			}else{
				this.removeHilight(projectForm.Class('regFields')[3]);
			}
			if(json.email_error){
				serverErrors+= this.globals.errors[0]+'<br>';
				this.addHilight(projectForm.Class('regFields')[2]);
			}else{
				this.removeHilight(projectForm.Class('regFields')[2]);
			}
		}else{
			serverErrors+='registration was successful.'
		}
		this.errorDisplay(serverErrors);
	},
	
	errorDisplay:function(errorTxt){
		//var errorNode = this.createNode({el:'p',classes:'incorrectTxt'});
		//errorNode.innerHTML = errorTxt;
		this.id('regErrors').innerHTML = errorTxt;
	},
	
	createNode:function(nodePackage){
    	if(nodePackage['el']){
    		var el = document.createElement(nodePackage.el);
    	if(nodePackage['classes']){
    		el.className=nodePackage.classes;
    	}
    	if(nodePackage['id']){
    		el.id=nodePackage.id;
    	}
    	return el;
    	}
    },
	
	appendNode:function(child,parent){
    	parent.appendChild(child);
    },
	
	id:function(id) {//caches and returns an element matching the "id" argument.
  		if(this.cache.id[id] === undefined) {
    		this.cache.id[id] = document.getElementById(id) || false;
  		}
  		return this.cache.id[id];
	},
	
	Class:function(Class) {//caches and returns an array of elements matching the "Class" argument.
  		if(this.cache.classes[Class] === undefined) {
    		this.cache.classes[Class] = document.getElementsByClassName(Class) || false;
  		}
  		return this.cache.classes[Class];
	},
    
    cache:{
    	id:{},
    	classes:{}
    }
}

$(function(){
	projectForm.initListeners();
});