// var form = edocument.getElementById('equation_form');
// debugger;//.elements
var form = document.getElementById("equation_form");

var regex = '[\*,\+,\-\/]? ?\d{0,100}\.?\d{0,100} ?[\*,\+,\-\/]? ?[x,X]\^\d?';

form.addEventListener('submit', function (oEvent) {
	var sErrors = "";
	var sEquation = form.elements[0].value;

	oEvent.preventDefault();

	if(sErrors == "") {
		var eErrorList = document.getElementById("equation_errors");
		debugger;
		eErrorList.textContent = "Error";
		return false;
	}
	// debugger
	console.log(sEquation);
	return ;
})

function printError(sError) {
	var eErrorList = document.getElementById("equation_errors");
	eErrorList.textContent = sError;
}


function inputValid(sInput) {
	var sErrors = "";


	//if (sInput)

}