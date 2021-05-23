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
	var regexSymb = /[,!@#\$%&(){}[\]_~`'"\?<>|\\]/i;
	var re = /=/g;
	var count = 0;


	while (re.test(str))
		count++;
	if (regexChar.test(str) || regexSymb.test(str) || count != 1)
	{
		console.log("e1");
		console.log(regexChar.test(str));
		console.log(regexSymb.test(str))
		printError("Incorrect Input");
		return 0;
	}
	return 1;
}

function inputValid(sInput) {
	//const regexp = new RegExp(['\*,\+,\-\/]? ?\d{0,100}\.?\d{0,100} ?[\*,\+,\-\/]? ?[x,X]\^\d?', '');
	sInput = sInput.replaceAll(' ', '');
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d?/g;

	let result = "";
	var count = 0;

	if (!containsSpecialCharactersAndNumbers(sInput))
		return 0;
	
	sInput = stepeny(sInput);
	distributeToArray(sInput);
	sInput = moveLeftBehindEqual(sInput);
	console.log(sInput);
	// if (!testy(sInput))
	// 	return 0;

	//debugger;
	
	return 1;
}

function distributeToArray(sInput)
{
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*]?[x,X]\^\d?/g;
	var result;
	var splits = sInput.split(/[\+,\-\=]/);
	var elements = [];
	var elements2 = [];
	var len = 0;
	var k = 0;
	var degree = 0;
	var sign = '';
	var tmp;
	var i = 0;
	var element = {
		sign:null,
		k:null,
		degree:null
	}

	var test = sInput;
	while (result = re.exec(sInput)) {
		k = null;
		sign = null;
		result = result[0];
		len = result.length - 1;
		degree = result[len];
		if (/[\*]/.test(result))
		{
			tmp = result.split('*')[0];
			if (/[\*,\+,\-\/]/.test(tmp))
			{
				sign = tmp[0];
				k = tmp.slice(1);
			}
			else
				k = tmp;
		}
		element = {
			sign:sign,
			k:k,
			degree:degree
		}
		elements.push(element);
		test = test.replace(result, 'p');
	}
	console.log(test);
	//var reg = /[\*\+\-\/]?\d{0,100}\.?\d{0,100}/g;
	var reg = new RegExp(/[\*\+\-\/]?\d{0,100}\.?\d{0,100}?/g);
	var res = "";
	while (res = reg.exec(test)) {
		console.log("I1" + res.index);
		console.log("I2" + reg.lastIndex);
		if (res.index === reg.lastIndex)
			reg.lastIndex++;
		res = res[0];
		console.log(res);
		if (res)
		{
			if (/[\+\-\*\/]/.test(res))
			{
				//console.log("yes");
				sign = res[0];
				k = res.slice(1);
			}
			else
			{
				//console.log("no");
				sign = null;
				k = res;
			}
			element = {
				sign:sign,
				k:k,
				degree:null
			}
			elements2.push(element);
			test = test.replace(res, 'l');
		}
	}
	console.log(test);
	//console.log(test.split('p'));
	// while (i < splits.length)
	// {
	// 	console.log(splits[i]);
	// 	i++;
	// }
	
	console.log(elements2);
}

function moveLeftBehindEqual(sInput){

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
	printStep("Преобразование: значений выражения, содержащего степени"); //упростить выражение
	printStep(sInput);
	return(sInput);
}

function testy(str) {
	var splits = str.split(/['\+,\-,\=]/);
	//var operators = str.split(/\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d/);
	var operators = str.split(/[\+,\-]?\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d/);
	//console.log(operators);
	var step = "";
	var n = 0;
	var i = 0;
	var elements = [];


	if (splits.length != operators.length - 1)
	{
		console.log("e3");
		console.log(splits);
		console.log(operators);
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
	printStep("Преобразование: значений выражения, содержащего степени"); //упростить выражение
	printStep(step);
	return 1;
}