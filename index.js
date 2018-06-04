console.log("testing");

function changeText() {
	document.getElementById("title-two").textContent = "Finite Incantatum";
}

const button = document.querySelector("button");
document.querySelector("button").addEventListener("click", changeText);

const form = document.querySelector("form");
function dostuff(e){
  e.preventDefault();
  document.getElementById("title-three").textContent = form.querySelector("input").value;
  return false;
}

form.addEventListener("submit", dostuff);
