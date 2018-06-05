const form = document.querySelector("form");
const avgSpellLength = 15.3; //src: https://arxiv.org/pdf/1208.6109.pdf, multiplied by 3
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
	spellInfo.style.color = "rgba(255, 0, 0, " + (spellName.length/avgSpellLength + 0.25) + ")";

	getManaInfo(info, spellInfo);
}

//create span to display mana cost
function getManaInfo(info, spellInfo) {
	const manaInfo = document.createElement("span");
	manaInfo.className = "manaCost";

	const manaCost = document.getElementById("mCost").value;
	manaInfo.appendChild(document.createTextNode(manaCost + " mana"));
	manaInfo.style.color = "rgba(0, 0, 255," + (manaCost/manaRange + 0.25) + ")";

	wrapUp(info, spellInfo, manaInfo);
}

function wrapUp(info, spellInfo, manaInfo) {
	//add all info to the list
	info.appendChild(spellInfo);
	info.appendChild(manaInfo);
	document.getElementById("spells").appendChild(info);

	//reset form
	form.reset();
}

form.addEventListener("submit", taskExecution);
