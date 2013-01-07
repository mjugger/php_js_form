

var projectForm = {
	globals:{
		regFields: document.getElementsByClassName('regfields'),
		loginFields: null,
		submitBtnId:'', // The id of the clicked submit button.
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
				'The username and/or passcode you entered are incorrect.'
			]
	},
	
	initListeners:function(){
		$('#regSubmit').click(function(){
		if(!projectForm.errorCheck(projectForm.globals.regFields)){
				var postPackage = projectForm.postobjConstruct(projectForm.globals.regFields);
				projectForm.callHelper(postPackage);
			}
			return false;
		});
	},
	
	postobjConstruct:function(fields){
		var postObj = {};
		var fieldSize = fields.length;
		for(var i = 0; i < fieldSize; i++){
			postObj[fields[i].name] = fields[i].value;
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
	
	switchViews:function(){
	
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
	
	validateJson:function(json){ // validates the json returned from the server.
		var serverErrors = '';
		if (json) {
			if(json.login_error){
				serverErrors+= this.globals.errors[8];
				this.addHilight(projectForm.globals.loginFields[0]);
				this.addHilight(projectForm.globals.loginFields[1]);
			}else{
				
			}
			if(json.username_error){
				if(this.globals.errors[1].match('@username')){
					var name = this.globals.errors[1].replace('@username',projectForm.globals.regFields[3].value);
					this.addHilight(projectForm.globals.regFields[3]);
					name+='<br>';
				}
				serverErrors+= name;
			}else{
				this.removeHilight(projectForm.globals.regFields[3]);
			}
			if(json.email_error){
				serverErrors+= this.globals.errors[0]+'<br>';
				this.addHilight(projectForm.globals.regFields[2]);
			}else{
				this.removeHilight(projectForm.globals.regFields[2]);
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
    
    cache:{
    	id:{},
    	classes:{}//TODO: add support for caching classes.
    }
}

$(function(){
	projectForm.initListeners();
});