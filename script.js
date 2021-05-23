var input = document.getElementById("equation");

document.onclick = function(event) {
	if (event.srcElement.className == "number")
	{
		// debugger;
		if (event.shiftKey)
			input.value += event.srcElement.text;
		else
			input.value += ' ' + event.srcElement.text;
		console.log(event.shiftKey);
		console.log(event.srcElement.text);
	}
};

document.addEventListener('click',function (oEvent) {
	var eErrorList = document.getElementById("equation_errors");
	eErrorList.textContent = '';
}) 

addEventListener("keydown", getKeyboardKey);
// addEventListener("keydup", up);

function getKeyboardKey(e) {
	var iFlag = isFinite(e.key);
	if (iFlag && document.activeElement.className != "form_input")
		input.value += e.key;
		// console.log(e.key)
	// if (e.key == "Backspace")
	// 	console.log("del");
	// debugger;
}

// function up(e) {
// 	console.log("up");
// }
