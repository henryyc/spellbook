const form = document.querySelector("form");
const avgSpellLength = 10.2; //src: https://arxiv.org/pdf/1208.6109.pdf, multiplied by 2
const manaRange = document.getElementById("mCost").max - document.getElementById("mCost").min + 1;

function taskExecution(e) {
  e.preventDefault();

	if (document.getElementById("sName").value != "") {
		//div to display both spell and mana info as one item on the list
		const info = document.createElement("li");

		getSpellInfo(info);
	}
}

//create span to display spell name
function getSpellInfo(info) {
	const spellInfo = document.createElement("span");
	spellInfo.className = "spellName";

	const spellName = document.getElementById("sName").value;
	spellInfo.appendChild(document.createTextNode(spellName + ": \t"));
	spellInfo.style.color = "rgb(" + spellName.length/avgSpellLength*255 + ", 0, 0)";

	getManaInfo(info, spellInfo);
}

//create span to display mana cost
function getManaInfo(info, spellInfo) {
	const manaInfo = document.createElement("span");
	manaInfo.className = "manaCost";

	const manaCost = document.getElementById("mCost").value;
	manaInfo.appendChild(document.createTextNode(manaCost + " mana"));
	manaInfo.style.color = "rgb(0, 0, " + manaCost/manaRange*255 + ")";

	wrapUp(info, spellInfo, manaInfo);
}

function wrapUp(info, spellInfo, manaInfo) {
	//add all info to the list
	info.appendChild(spellInfo);
	info.appendChild(manaInfo);
	document.getElementById("spells").appendChild(info);

	//soft reset form
	//document.getElementById("sName").value = '';
}

form.addEventListener("submit", taskExecution);
