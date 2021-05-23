var form = document.getElementById("equation_form");
var output = document.getElementById("output_container");

form.addEventListener('submit', function (oEvent) {
	var sErrors = "";
	var sEquation = form.elements[0].value;

	oEvent.preventDefault();


	if (!inputValid(sEquation))
	{
		console.log("last");
		return 0;
	}
	return 1;
})

function printError(sError) {
	var eErrorList = document.getElementById("equation_errors");
	eErrorList.textContent = sError;
}

function containsSpecialCharactersAndNumbers(str){
	var regexChar = /[a-w, y-z, A-W, Y-Z]/i;
	var regexSymb = /[/!,/@,/#,/$,/%,/&,/(,/),/{,/},/[,/,\],\\,/_,/~,/`]/i;
	var re = /=/g;
	var count = 0;


	while (re.test(str))
		count++;
	if (regexChar.test(str) || regexSymb.test(str) || count != 1)
	{
		console.log("e1");
	//	console.log(regexChar.test(str));
	//	console.log(regexSymb.test(str))
		printError("Incorrect Input");
		return 0;
	}
	return 1;
}

function inputValid(sInput) {
	//const regexp = new RegExp(['\*,\+,\-\/]? ?\d{0,100}\.?\d{0,100} ?[\*,\+,\-\/]? ?[x,X]\^\d?', '');
	sInput = sInput.replaceAll(' ', '');
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d\d?/g;

	let result = "";
	var count = 0;

	if (!containsSpecialCharactersAndNumbers(sInput))
		return 0;
	
	if (!testy(sInput))
		return 0;
	while (result = re.exec(sInput)) {
		var tmp = result[0].match(/[x,X]\^\d/);
		var degree = tmp[0].split('^')[1];
		if (degree == 0)
			var test = result[0].replace(/[x,X]\^\d/, '1');
		//console.log(test);
		//console.log(result);
		//console.log(degree);
		//var
		// var container = {
		// 	k = 
		// }
		//console.log(result);
		count++;
	}
	//debugger;
	if (count == 0)
	{
		console.log("e2");
		printError("Incorrect Input");
		return 0;
	}
	return 1;
}

function printStep(str)
{
	const fragment = document.createDocumentFragment();

	const step = document.createElement('p');
	// step.classList.add('b_card-text');
	step.textContent = str;

	fragment.appendChild(step);

	output.appendChild(fragment);
}

function testy(str) {
	var splits = str.split(/['\+,\-,\=]/);
	var operators = str.split(/\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d/);
	//console.log(operators);
	var step = "";
	var n = 0;
	var i = 0;
	var elements = [];


	if (splits.length != operators.length - 1)
	{
		console.log("e3");
		console.log(splits);
		printError("Incorrect Input");
		return 0;
	}
//	while (n < operators.length)
//	{
//		if (operators[n] == '=')
//			operators.splice(n, 1);
//		n++;
//	}
	while (i < splits.length)
	{
		var len = 0;
		var k = 0;
		var degree = 0;
		var sign = '';
		var element = {
			sign:null,
			k:null,
			degree:null
		}

		if (/[x,X]\^\d/.test(splits[i]))
		{
			len = splits[i].length;
			k = splits[i].split('*')[0];
			degree = splits[i][len - 1];
			sign = splits[i][0];
			if (degree == 0)
				splits[i] = k;
			element = {
				sign:operators[n],
				k:k,
				degree:degree
			}
			elements.push(element);
		}
		else
		{
			if (operators[n + 1] == '=')
			{
				element = {
					sign:operators[n + 1],
					k:splits[i],
					degree:null
				}
			}
			else
			{
				element = {
					sign:operators[n],
					k:splits[i],
					degree:null
				}
			}
			elements.push(element);
		}
		
		// console.log(operators[i]);
		// console.log(splits[i]);
		if (operators[n + 1] == '=')
		{
			step += operators[n] + splits[i] + operators[n + 1];
			n++;
		}
		else
			step += operators[n] + splits[i];
		i++;
		n++;
	}
	console.log(elements)
	printStep("Преобразование:");
	printStep(step);
	return 1;
}