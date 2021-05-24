include("./distribute.js");

function include(url) {
	var script = document.createElement('script');
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
}

var form = document.getElementById("equation_form");
var output = document.getElementById("output_container");

form.addEventListener('submit', function (oEvent) {
	var sErrors = "";
	var sEquation = form.elements[0].value;

	oEvent.preventDefault();


	if (!main(sEquation))
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
	var regexSymb = /[,!@#\$%&(){}[\]_~`'"\?<>|\\]/i;
	var re = /=/g;
	var count = 0;
	var operatorsFlag = 0;


	while (re.test(str))
		count++;
	if (str.includes('++') || str.includes('--') || str.includes('**') || str.includes('//') || str.includes('^^'))
	{
		console.log("operators!!!");
		operatorsFlag++;
	}
	if (str[0] == '*' || str[0] == '/')
		operatorsFlag++;
	if (regexChar.test(str) || regexSymb.test(str) || count != 1 || operatorsFlag != 0)
	{
		console.log("e1");
		console.log(regexChar.test(str));
		console.log(regexSymb.test(str))
		printError("Incorrect Input");
		return 0;
	}
	return 1;
}

function arrangeArray(elements) {
	var i = 0;


	var value;

	console.log("start", elements);
	while (i < elements.length)
	{
		if (elements[i].degree === null)
		{
			var tmp = elements[i].sign;
			if (tmp)
			{
				if (tmp == "*")
				{
					value = +elements[i-1].k * +elements[i].k;
					elements[i-1].k = value;
					elements = elements.filter(item => item !== elements[i]);
					if (i > 0)
						i--;
					continue ;
				}
				if (tmp == "/")
				{
					value = +elements[i-1].k / +elements[i].k;
					elements[i-1].k = value;
					elements = elements.filter(item => item !== elements[i]);
					if (i > 0)
						i--;
					continue ;
				}
			}
			console.log(elements);
		}
		i++;
	}
	return (elements);
	// console.log("============");
	//return elements;
	
	// elements = elements.filter(item => item !== value);

	// console.log(elements);
}

function main(sInput) {
	//const regexp = new RegExp(['\*,\+,\-\/]? ?\d{0,100}\.?\d{0,100} ?[\*,\+,\-\/]? ?[x,X]\^\d?', '');
	sInput = sInput.replaceAll(' ', '');
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d?/g;
	var elements = [];

	let result = "";
	var count = 0;

	if (!containsSpecialCharactersAndNumbers(sInput))
		return 0;
	
	sInput = stepeny(sInput);
	elements = distributeToArray(sInput);
	var test = elements;
	elements = arrangeArray(elements);
	console.log("last ", elements);
	sInput = moveLeftBehindEqual(sInput);
	//console.log(sInput);
	// if (!testy(sInput))
	// 	return 0;

	//debugger;
	
	return 1;
}

function moveLeftBehindEqual(sInput){
	
}

function printStep(str, flag)
{
	const fragment = document.createDocumentFragment();

	const step = document.createElement('p');
	if (flag == 1)
		step.classList.add('symbols');
	step.textContent = str;

	fragment.appendChild(step);
	output.appendChild(fragment);
}

function stepeny(sInput) {
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*]?[x,X]\^\d?/g;
	var result = "";
	var degree='';

	var len;
	var tmp = "";
	while (result = re.exec(sInput)) {
		//console.log(result);
		result = result[0];
		len = result.length - 1;
		degree = result[len];
		tmp = result.split('*')[0];
		if (degree == 0)
		{
			if (/[\*]/.test(result))
				sInput = sInput.replace(result, tmp);
			else
				sInput = sInput.replace(sInput, '1');
		}
	}
	printStep("Преобразование: значений выражения, содержащего степени", 0); //упростить выражение
	printStep(sInput, 1);
	return(sInput);
}

// function testy(str) {
// 	var splits = str.split(/['\+,\-,\=]/);
// 	//var operators = str.split(/\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d/);
// 	var operators = str.split(/[\+,\-]?\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d/);
// 	//console.log(operators);
// 	var step = "";
// 	var n = 0;
// 	var i = 0;
// 	var elements = [];


// 	if (splits.length != operators.length - 1)
// 	{
// 		console.log("e3");
// 		console.log(splits);
// 		console.log(operators);
// 		printError("Incorrect Input");
// 		return 0;
// 	}
// //	while (n < operators.length)
// //	{
// //		if (operators[n] == '=')
// //			operators.splice(n, 1);
// //		n++;
// //	}
// 	while (i < splits.length)
// 	{
// 		var len = 0;
// 		var k = 0;
// 		var degree = 0;
// 		var sign = '';
// 		var element = {
// 			sign:null,
// 			k:null,
// 			degree:null
// 		}

// 		if (/[x,X]\^\d/.test(splits[i]))
// 		{
// 			len = splits[i].length;
// 			k = splits[i].split('*')[0];
// 			degree = splits[i][len - 1];
// 			sign = splits[i][0];
// 			if (degree == 0)
// 				splits[i] = k;
// 			element = {
// 				sign:operators[n],
// 				k:k,
// 				degree:degree
// 			}
// 			elements.push(element);
// 		}
// 		else
// 		{
// 			if (operators[n + 1] == '=')
// 			{
// 				element = {
// 					sign:operators[n + 1],
// 					k:splits[i],
// 					degree:null
// 				}
// 			}
// 			else
// 			{
// 				element = {
// 					sign:operators[n],
// 					k:splits[i],
// 					degree:null
// 				}
// 			}
// 			elements.push(element);
// 		}
		
// 		// console.log(operators[i]);
// 		// console.log(splits[i]);
// 		if (operators[n + 1] == '=')
// 		{
// 			step += operators[n] + splits[i] + operators[n + 1];
// 			n++;
// 		}
// 		else
// 			step += operators[n] + splits[i];
// 		i++;
// 		n++;
// 	}
// 	console.log(elements)
// 	printStep("Преобразование: значений выражения, содержащего степени"); //упростить выражение classify 
// 	printStep(step);
// 	return 1;
// }