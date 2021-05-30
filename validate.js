
var output = document.getElementById("output_container");

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
		operatorsFlag++;
	if (str[0] == '*' || str[0] == '/')
		operatorsFlag++;
	if (regexChar.test(str) || regexSymb.test(str) || count != 1 || operatorsFlag != 0)
	{
		printError("Неправильный ввод");
		return 0;
	}
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
	step.classList.add('out_p');
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