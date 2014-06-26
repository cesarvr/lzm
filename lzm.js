(function(){

	var lazy = lazy || {};

 	lazy.foreach = function(array, callback){

		for (var i = 0; i < array.length; i++) {

			callback(array[i]);
		};

	}
	
		

	lazy.template = function(){
		this.strbuild = "";
		var fnParams =  [];
		var scope = ""; 
		this.tmpl = "";
		var brkt_open = '<%', brkt_close = '%>';
		

		var normalize = function(str){
			str = str.trim();
			return str.replace(/\"/g , " \\\" ");
		}
			
		var formatting = function(str){
			return "\""+ normalize(str) + "\"";	
		}
		
		var config_scope = function(code){
		
			var fnParams_pattern = /function\((\D+)\)/;
			var parse = fnParams_pattern.exec(code);
				
			if(parse !== null){
				this.fnParams = parse[1].split(',');			
			}
		}
		
		
	



		var _value = function(value){
			if(typeof value === 'object'){
				return JSON.stringify(value);
			}else return value;	
		}
		
		var _init_param = function(js_param){
		
			//check scope var's 
			for(var fncount in this.fnParams){
			
				var lvar = this.fnParams[fncount];
				var npos = 1;
				eval(lvar + "=" + _value( js_param[ npos + parseInt(fncount) ] ) );  	
			}

		}	
	

		var _out = function(){
					
			console.log(arguments);
			var line = arguments[0];
			var regx = /{{(.+)}}/;
			var js_prop = regx.exec(line);			
			
			if(js_prop){
				_init_param(arguments);
				this.tmpl += line.replace(regx, eval(js_prop[1]));			
			}else{
				this.tmpl+=line;
			}
		}
		
		/* add_code add the HTML + {{ TAGS }}  */
		var add_code = function(line){
			if(this.fnParams.length > 0)
				this.strbuild += "_out("+ formatting(line) + "," +this.fnParams.toString() + "); ";
			else
				this.strbuild += "_out("+ formatting(line) + ", null);";
		}
		
		/*add_exp add the javascript expression */
		var add_exp = function(code){
			code = code.replace('<%', ''); code = code.replace('%>', '');				
			config_scope(code);
			this.strbuild += normalize(code);  
		}

		

		var clean = function(){
			this.strbuild="";
			this.fnParams = [];
		}
		
		var execute = function(){
			this.tmpl = "";	
			eval(this.strbuild);
			return this.tmpl;
		
		}
		
		var brkt = function(type_brkt, line){

			if(line.search(type_brkt) !== -1){
				return true; 
			}					
			
			return false;
		}

		return {
		
			compile: function(template){
					
				var braket = false;   
				var lst_lines = "";
				var collect = false; 
			
				if( typeof template === 'string' ) {
    					lst_lines = template.match(/[^\r\n]+/g);
				}else 
					return "error: dont work with other data";

				for(var i = 0; i < template.length; i++){
					var line    = lst_lines[i];
			
					
					if(typeof line === "undefined") break;	
					if(line.trim() === "") continue;
				
				
		
					if( brkt(brkt_open, line) && brkt(brkt_close, line) ){
				
						add_exp(line);
						continue;	
					}
				
					if( brkt(brkt_open, line) ){
						add_exp(line);
						collect = true;
 						continue;
					}

					if( brkt(brkt_close, line) ){
						add_exp(line);	
						collect = false;
						continue; 
					}
				
					if(collect){
						add_exp(line);
					}else
						add_code(line);
				
				}			


			},

			execute: function(){
				tmpl = "";	
				eval(strbuild);
			
				return tmpl;
			}

		};


	}();	



	
	var btn    = document.querySelector('button'); 	
	var editor = document.querySelector('.editor');
	var resultado = document.querySelector('.console');
	function init(){
	
		btn.addEventListener("click", function(){
					
			var code = editor.value; 	
			lazy.template.compile(code);
			resultado.innerHTML = lazy.template.execute();
			console.log(lzm);			
		
		},false);	
	
	}


init();

})();
