var input = document.getElementById("equation");
var form = document.getElementById("equation_form");

document.onclick = function(event) {
	if (event.srcElement.className == "number")
	{
		if (event.shiftKey)
			input.value += event.srcElement.text;
		else
			input.value += ' ' + event.srcElement.text;
	}
	if (event.srcElement.className == "equation_btn")
	{
		input.value = event.srcElement.text;
		document.querySelector(".result").click();
	}
};

document.addEventListener('click',function (oEvent) {
	var eErrorList = document.getElementById("equation_errors");
	eErrorList.textContent = '';
}) 

addEventListener("keydown", getKeyboardKey);

function getKeyboardKey(e) {
	var iFlag = isFinite(e.key);
	if (iFlag && document.activeElement.className != "form_input")
		input.value += e.key;
}

form.addEventListener('submit', function (oEvent) {
	var sEquation = form.elements[0].value;
	oEvent.preventDefault();
	document.getElementById("output_container").innerHTML = "";
	if (!main(sEquation))
		return 0;
	document.getElementById("output_container").scrollIntoView({behavior: "smooth"});
	return 1;
})

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