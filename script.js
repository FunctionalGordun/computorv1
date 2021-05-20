// var buttons = document.getElementsByClassName("number");
// buttons[0].addEventListener('click', event => {
// 	console.log(event);
// 	debugger;
// });
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

addEventListener("keydown", getKeyboardKey);
addEventListener("keydup", up);

function getKeyboardKey(e) {
	var iFlag = isFinite(e.key);
	if (iFlag)
		input.value += e.key;
		// console.log(e.key)
	if (e.key == "Backspace")
		console.log("del");
	debugger;
}

function up(e) {
	console.log("up");
}