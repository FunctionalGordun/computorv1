function distributeToArray(sInput)
{
	const re = /[\*,\+,\-\/]?\d{0,100}\.?\d{0,100}?[\*]?[x,X]\^\d?/g;
	var reg = /[\*\+\-\/]?\d{0,100}\.?\d{0,100}/g;
	var result;
	var len = 0;
	var k = '';
	var degree = 0;
	var sign = '';
	var tmp;
	var i = 0;
	var elementArrayP = [];
	var elementArrayL = [];
	var outArray = [];
	var indArrL = 0;
	var indArrP = 0;
	var test = sInput;
	var element = {
		sign:null,
		k:null,
		degree:null,
		flag:null
	}


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
			degree:degree,
			flag:null
		}
		elementArrayP.push(element);
		test = test.replace(result, 'p');
	}
	result = "";
	while (result = reg.exec(test)) {
		if (result.index === reg.lastIndex)
			reg.lastIndex++;
		result = result[0];
		if (result)
		{
			if (/[\+\-\*\/]/.test(result))
			{
				sign = result[0];
				k = result.slice(1);
			}
			else
			{
				sign = null;
				k = result;
			}
			element = {
				sign:sign,
				k:k,
				degree:null,
				flag:null

			}

			elementArrayL.push(element);
			reg.lastIndex-=k.len;
			test = test.replace(result, 'l');
		}
	}
	var equalFlag = 0;
	while (i < test.length)
	{
		if (test[i] == 'l')
		{
			if (equalFlag)
			{
				elementArrayL[indArrL].flag = 1;
				equalFlag = 0;
			}
			outArray.push(elementArrayL[indArrL]);
			indArrL++;
		}
		else if (test[i] == 'p')
		{
			if (equalFlag)
			{
				elementArrayP[indArrP].flag = 1;
				equalFlag = 0;
			}
			outArray.push(elementArrayP[indArrP]);
			indArrP++;
		}
		if (test[i] == '=')
			equalFlag = 1;
		i++;
	}
	// console.log(sInput);
	// console.log(test);
	// console.log(elementArrayP);
	// console.log(elementArrayL);
	//console.log(outArray);
	return(outArray);

}
