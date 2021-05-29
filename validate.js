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

function arrangeMultiplyDivisionArray(elements) {
	var i = 0;
	var value;

	while (i < elements.length)
	{
		if (i > 0 && elements[i].degree === null && elements[i-1].degree === null && elements[i].flag != 1)
		{
			var tmp = elements[i].sign;
			if (tmp)
			{
				if (tmp == "*")
				{
					value = +elements[i-1].k * +elements[i].k;
					elements[i-1].k = value.toString();
					elements = elements.filter(item => item !== elements[i]);
					if (i > 0)
						i--;
					continue ;
				}
				if (tmp == "/")
				{
					value = +elements[i-1].k / +elements[i].k;
					elements[i-1].k = value.toString();
					elements = elements.filter(item => item !== elements[i]);
					if (i > 0)
						i--;
					continue ;
				}
			}
		}
		i++;
	}
	i = 0;
	var str = "";
	while (i < elements.length)
	{
		if (elements[i].flag == 1)
			str+= '=';
		if (elements[i].degree)
		{
			if (elements[i].sign)
				str += elements[i].sign + elements[i].k + '*x^' + elements[i].degree;
			else
				str += elements[i].k + '*x^' + elements[i].degree;
		}
		else
		{
			if (elements[i].sign)
				str += elements[i].sign + elements[i].k;
			else
				str += elements[i].k;
		}
		i++;
	}
	printStep("Упрощение выражения: вычисление произведения или разности", 0);
	printStep(str, 1);
	return (elements);
}

function arrangeAddSubtractArray(elements) {
	var i = 0;
	var value;

	while (i < elements.length)
	{
		if (i > 0 && elements[i].degree === null && elements[i-1].degree === null && elements[i].flag != 1)
		{
			var tmp = elements[i].sign;
			if (tmp && elements[i-1])
			{
				if (tmp == "+")
				{
					if (elements[i-1].sign == '-')
					{
						value = -parseInt(elements[i-1].k) + +elements[i].k;
						if (value > 0)
							elements[i-1].sign = '+';
					}
					else
						value = +elements[i-1].k + +elements[i].k;
					if (value < 0)
						value*=-1;
					elements[i-1].k = value.toString();
					elements = elements.filter(item => item !== elements[i]);
					i--;
					continue ;
				}
				if (tmp == "-")
				{
					if (elements[i-1].sign == '-')
						value = +elements[i-1].k + +elements[i].k;
					else
					{
						value = +elements[i-1].k - +elements[i].k;
						if (value < 0)
							elements[i-1].sign = '-';
					}
					if (value < 0)
						value*=-1;
					elements[i-1].k = value.toString();
					elements = elements.filter(item => item !== elements[i]);
					i--;
					continue ;
				}
			}
		}
		i++;
	}
	i = 0;
	var str = "";
	while (i < elements.length)
	{
		if (elements[i].flag == 1)
			str+= '=';
		if (elements[i].degree)
		{
			if (elements[i].sign)
				str += elements[i].sign + elements[i].k + '*x^' + elements[i].degree;
			else
				str += elements[i].k + '*x^' + elements[i].degree;
		}
		else
		{
			if (elements[i].sign)
				str += elements[i].sign + elements[i].k;
			else
				str += elements[i].k;
		}
		i++;
	}
	printStep("Упрощение выражения: вычисление слагаемых", 0);
	printStep(str, 1);
	return (elements);
}
function computeDiscriminant(elements)
{
	var d = -1;
	if (elements.length == 3)
		d = elements[1].k ** 2 - 4 * elements[0].k * elements[2].k
	else if (elements[1].degree == 1)
		d = elements[1].k ** 2
	return d
}
function printDiscriminant(d) {
	if (d > 0)
	printStep("Дискриминант положительный , два решения: ", 0)
	else if (d == 0)
		printStep("Дискриминант равен нулю, одно решение: ", 0)
	else
		printStep("Дискриминант отрицательный , Выражение не определено на множестве действительных чисел", 0)

}

function computeAndPrintRoots(elements, d)
{
	if (d > 0)
	{
		//debugger ;
		printStep(String((-1.0 * elements[1].k + d ** 0.5) / (2.0 * elements[0].k)), 3);
		printStep(String((-1.0 * elements[1].k - d ** 0.5) / (2.0 * elements[0].k)), 3);
	}
	else if (d == 0)
		printStep(String((-1 * elements[1].k) / (2 * elements[0].k)), 3);
}

function printIncompleteQuadratic(elements)
{
	printStep("Два решения: ", 3);
	var roots = (-1 * elements[1].k / elements[0].k) ** 0.5;
	printStep(String(roots), 3);
	printStep(String(-1 * roots), 3);
}

function degreeAndMath(elements) {
	var degree = elements[0].degree;
	printStep("Степень полинома:", 0);
	printStep(degree, 1);
	var i = 0;
	while (i < elements.length)
	{
		elements[i].k = +elements[i].k;
		if (elements[i].sign == '-')
			elements[i].k *= -1;
		i++;
	}
	if (degree == '2')
	{
		console.log("degree 2", elements);
		if (elements.length == 1)
		{
			printStep("Решение:", 0);
			printStep("0", 3);
		}
		else if (elements.length == 3 || elements[1].degree == '1')
		{
			var d = computeDiscriminant(elements);
			console.log("discriminant", d);
			printDiscriminant(d);
			computeAndPrintRoots(elements, d);
		}
		else if (elements.length == 2)
			printIncompleteQuadratic(elements)

	}
	else if (degree == '1')
	{
		printStep("Решение: ", 3);
		printStep(String(-1 * elements[1].k / elements[0].k), 3);
	}
	else if (degree == 0 && elements.length == 1)
	{
		if (elements[0].k == 0)
			printStep("Любое решение", 3);
		else
			printStep("Нет решений", 3);
	}
	else
		printStep("Степень полинома больше 2, не могу решить.")

}

function main(sInput) {
	sInput = sInput.replaceAll(' ', '');
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*,\+,\-\/]?[x,X]\^\d?/g;
	var elements = [];

	if (!containsSpecialCharactersAndNumbers(sInput))
		return 0;
	
	sInput = stepeny(sInput);
	if (sInput == 0)
	{
		printError("Incorrect Input");
		return (0);
	}
	elements = distributeToArray(sInput);
	elements = arrangeMultiplyDivisionArray(elements);
	elements = arrangeAddSubtractArray(elements);
	elements = moveLeftBehindEqual(elements);
	elements = normalize(elements);
	degreeAndMath(elements);

	return 1;
}

function normalize(elements)
{
	var i = 0;
	var sOut = "";
	var outArray= [];

	if (elements[0].sign == null)
		elements[0].sign = "+";
	elements.sort(function (a, b) {
		if (a.degree < b.degree) {
			return 1;
		}
		if (a.degree > b.degree) {
			return -1;
		}
		return 0;
	});
	while (i < elements.length)
	{
		outArray.push(elements[i]);
		if (elements[i].sign)
			sOut += elements[i].sign;
		sOut += elements[i].k;
		if (elements[i].degree != null)
			sOut += "*x^" + elements[i].degree;
		i++;
	}
	sOut += "=0";
	printStep("Поменяем порядок слагаемых или множителей", 0);
	printStep(sOut, 1);

	i = 0;
	var value;
	while (i < outArray.length)
	{
		if (outArray[i].k == '0' && outArray[i].degree == null)
		{
			outArray = outArray.filter(item => item !== outArray[i]);
			i--;
			continue ;
		}
		if (i > 0 && outArray[i].degree && outArray[i-1].degree && (outArray[i].degree == outArray[i-1].degree))
		{
			if (outArray[i].sign == "+")
			{
				if (outArray[i-1].sign == '-')
				{
					value = -parseInt(outArray[i-1].k) + +outArray[i].k;
					if (value > 0)
						outArray[i-1].sign = '+';
				}
				else
					value = +outArray[i-1].k + +outArray[i].k;
				if (value < 0)
					value *=-1;
				outArray[i-1].k = value.toString();
				outArray = outArray.filter(item => item !== outArray[i]);
				i--;
				continue ;
			}
			if (outArray[i].sign == "-")
			{
				if (outArray[i-1].sign == '-')
					value = +outArray[i-1].k + +outArray[i].k;
				else
				{
					value = +outArray[i-1].k - +outArray[i].k;
					if (value < 0)
						outArray[i-1].sign = '-';
				}
				if (value < 0)
					value*=-1;
				outArray[i-1].k = value.toString();
				outArray = outArray.filter(item => item !== outArray[i]);
				i--;
				continue ;
			}
		}
		if (i > 0 && outArray[i].degree === null && outArray[i-1].degree === null)
		{
			var tmp = outArray[i].sign;
			if (tmp && outArray[i-1])
			{
				if (tmp == "+")
				{
					if (outArray[i-1].sign == '-')
					{
						value = -parseInt(outArray[i-1].k) + +outArray[i].k;
						if (value > 0)
							outArray[i-1].sign = '+';
					}
					else
						value = +outArray[i-1].k + +outArray[i].k;
					if (value < 0)
						value*=-1;
					outArray[i-1].k = value.toString();
					outArray = outArray.filter(item => item !== outArray[i]);
					i--;
					continue ;
				}
				if (tmp == "-")
				{
					if (outArray[i-1].sign == '-')
						value = +outArray[i-1].k + +outArray[i].k;
					else
					{
						value = +outArray[i-1].k - +outArray[i].k;
						if (value < 0)
							outArray[i-1].sign = '-';
					}
					if (value < 0)
						value*=-1;
					outArray[i-1].k = value.toString();
					outArray = outArray.filter(item => item !== outArray[i]);
					i--;
					continue ;
				}
			}
		}
		i++;
	}
	i = 0;
	sOut = "";
	while (i < outArray.length)
	{
		//outArray.push(elements[i]);
		if (outArray[i].sign)
			sOut += outArray[i].sign;
		sOut += outArray[i].k;
		if (outArray[i].degree != null)
			sOut += "*x^" + outArray[i].degree;
		i++;
	}
	sOut += "=0";
	printStep("Упростим", 0);
	printStep(sOut, 1);
	return(outArray);
}

function moveLeftBehindEqual(elements){
	var i = 0;
	var flag = 0;
	var sOut = "";
	var outArray = [];
	while (i < elements.length)
	{
		if (elements[i].flag == 1)
			flag = 1;
		if (flag == 1)
		{
			if (elements[i].sign == '-')
				elements[i].sign = '+';
			else if (elements[i].sign == '+')
				elements[i].sign = '-';
			else if (elements[i].sign == null)
				elements[i].sign = '-';
			elements[i].flag = null;
		}
		outArray.push(elements[i]);
		if (elements[i].sign)
			sOut += elements[i].sign;
		sOut += elements[i].k;
		if (elements[i].degree != null)
			sOut += "*x^" + elements[i].degree;
		i++;
	}
	sOut += "=0";
	printStep("Перенесем константы в левую часть равенства", 0);
	printStep(sOut, 1);
	return (outArray);
}

function printStep(str, flag)
{
	const fragment = document.createDocumentFragment();

	const step = document.createElement('p');
	if (flag == 1)
		step.classList.add('symbols');
	else if (flag == 3)
		step.classList.add('solution');
	step.textContent = str;

	fragment.appendChild(step);
	output.appendChild(fragment);
}

function stepeny(sInput) {
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*]?[x,X]\^-?\d?/g;
	var result = "";
	var degree='';

	var len;
	var tmp = "";
	var count = 0;
	var zerof = 0;
	while (result = re.exec(sInput)) {
		count++;
		result = result[0];
		len = result.length - 1;
		degree = +result.split('^')[1];
		tmp = result.split('*')[0];
		if (degree == 0)
		{
			if (/[\*]/.test(result))
			{
				sInput = sInput.replace(result, tmp);
				re.lastIndex -= result.length - tmp.length;
			}
			else
			{
				sInput = sInput.replace(sInput, '1');
				re.lastIndex--;
			}
			zerof++;
		}
		if (degree < 0)
		{
			printStep("Выражение имеет отрицательную степень!", 0);
			return (0);
		}
	}
	if (count == 0)
		return (0);
	printStep("Преобразование: значений выражения, содержащего степени", 0); //упростить выражение
	printStep(sInput, 1);
	if (count - zerof == 0)
	{
		printStep("Нет решений", 3);
		return(0);
	}
	return(sInput);
}