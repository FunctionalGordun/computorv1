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
		d = elements[1].k ** 2 - 4 * elements[0].k * elements[2].k;
	else if (elements[1].degree == 1)
		d = elements[1].k ** 2;
	return d;
}
function printDiscriminant(d) {
	if (d > 0)
		printStep("Дискриминант положительный , два решения: ", 3);
	else if (d == 0)
		printStep("Дискриминант равен нулю, одно решение: ", 3);
	else
		printStep("Дискриминант отрицательный , выражение не определено на множестве действительных чисел, решения:", 3);

}

function computeAndPrintRoots(elements, d)
{
	if (d > 0)
	{
		printStep(String((-1.0 * elements[1].k + d ** 0.5) / (2.0 * elements[0].k)), 3);
		printStep(String((-1.0 * elements[1].k - d ** 0.5) / (2.0 * elements[0].k)), 3);
	}
	else if (d == 0)
		printStep(String((-1 * elements[1].k) / (2 * elements[0].k)), 3);
	if (d < 0)
	{
		printStep(String((-1.0 * elements[1].k) / (2.0 * elements[0].k)) + '+' + String((d * -1) ** 0.5) + 'i', 3);
		printStep(String((-1.0 * elements[1].k) / (2.0 * elements[0].k)) + '-' + String((d * -1) ** 0.5) + 'i', 3);
	}
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
		if (elements.length == 1)
		{
			printStep("Решение:", 3);
			printStep("0", 3);
		}
		else if (elements.length == 3 || elements[1].degree == '1')
		{
			var d = computeDiscriminant(elements);
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
		printStep("Степень полинома больше 2, не могу решить.", 3)

}