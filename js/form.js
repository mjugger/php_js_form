

var projectForm = {
	globals:{
		responceJson:null, // Holds the json from the server.
		regFields: document.getElementsByClassName('regfields'),
		loginFields: null,
		submitBtnId:'', // The id of the clicked submit button.
		myRegExps:{
			email:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/,
			symbols:/[^0-9a-z]/,
			numbers:/[0-9]/
		},
		errors:['This Email is already registered.',
				'The username @username is already in use.',
				'Field cannot contain numbers.',
				'Username does not match our records.',
				'Passcode does not match our records.',
				'Not entered',
				'The email you entered has an incorrect format',
				'Field cannot use special characters (i.e. ~ ! # $ % ^ & * etc...)']
	},
	
	initListeners:function(){
		$('#regSubmit').click(function(){
			if(projectForm.errorCheck(projectForm.globals.regFields)){
				return false;
			}else {
				projectForm.callHelper();
			}
		});
	},
	
	callHelper:function(){
		
	},
	
	switchViews:function(){
	
	},
	
	fieldHilight:function(field){
		if(!(' ' + field.className + ' ').indexOf(' incorrectfield ') > -1){
			field.className+=' incorrectfield';
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
	
	validateField:function(val){
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
		
		this.fieldHilight(val);
		return errorCode;
	},
	
	validateJson:function(){
		
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