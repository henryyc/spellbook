const costRange = document.getElementById("cost").max - document.getElementById("cost").min + 1;
const avgSpellLength = 10.2; //src: https://arxiv.org/pdf/1208.6109.pdf, *2 b/c spells are multiple words

class App {
  constructor() {
    this.spells = []
    this.template = document.querySelector('.spell.template')
    this.list = document.querySelector('#spells')

    this.load()

    const form = document.querySelector('form')
    form.addEventListener('submit', ev => {
      // prevent page refresh
      ev.preventDefault()

      // prevent empty spell entries
      if (document.getElementsByName("spellName")[0].value != "") {
        console.log()
        this.handleSubmit(ev)
      }
    })
  }

  load() {
    // Read the JSON from localStorage
    const spellJSON = localStorage.getItem('spells')

    // Convert the JSON back into an array
    const spellArray = JSON.parse(spellJSON)

    // Load the spells back into the app
    if (spellArray) {
      spellArray.forEach(this.addSpell.bind(this))
    }
  }

  renderProperty(name, value) {
    const el = document.createElement('span')
    el.textContent = value
    el.classList.add(name)
    el.setAttribute('title', value)
    return el
  }

  renderItem(spell) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')

    // ['name', 'cost', etc.]
    const properties = Object.keys(spell)

    // Replace the appropriate values in each <span>
    properties.forEach(property => {
      const el = item.querySelector(`.${property}`)
      if (el) {
        // only make spell name editable
        if (property === "name") {
          el.setAttribute('contentEditable', true)
          el.style.color = "rgba(0, 0, 0, " + (spell[property].length/avgSpellLength) + ")"
        }
        else if (property === "cost") {
          // default spell cost is mana
          if (spell[property].indexOf("mana") === -1 && spell[property].indexOf("health") === -1) {
            spell[property] += " mana"
            el.style.color = "rgba(0, 0, 255, " + (this.extractCost(spell[property])/costRange)  + ")"
          }
        }

        el.textContent = spell[property]
        el.setAttribute('title', spell[property])
      }
    })

    // Mark it as a favorite, if applicable
    if (spell.favorite) {
      item.classList.add('fav')
    }

    // delete button
    item
      .querySelector('button.delete')
      .addEventListener(
        'click',
        this.removeSpell.bind(this, spell)
      )

    // button to convert spell cost from mana to health and vice versa
    item
      .querySelector('button.convert')
      .addEventListener(
        'click',
        this.convertCost.bind(this, spell)
      )

    // fav button
    item
      .querySelector('button.fav')
      .addEventListener(
        'click',
        this.toggleFavorite.bind(this, spell)
      )

    // move up
    item
      .querySelector('button.up')
      .addEventListener(
        'click',
        this.moveUp.bind(this, spell)
      )

    // move down
    item
      .querySelector('button.down')
      .addEventListener(
        'click',
        this.moveDown.bind(this, spell)
      )

    return item
  }

  moveDown(spell, ev) {
    // Find the <li>
    const button = ev.target
    const item = button.closest('.spell')

    // Find its index in the array
    const i = this.spells.indexOf(spell)

    // Only move it if it's not already last
    if (i < this.spells.length - 1) {
      // Move it in the array
      const nextSpell = this.spells[i + 1]
      this.spells[i + 1] = spell
      this.spells[i] = nextSpell

      // Move it on the page
      this.list.insertBefore(item.nextSibling, item)
    }

    this.save()
  }

  moveUp(spell, ev) {
    // Find the <li>
    const button = ev.target
    const item = button.closest('.spell')

    // Find its index in the array
    const i = this.spells.indexOf(spell)

    // Only move it if it's not already first
    if (i > 0) {
      // Move it in the array
      const previousSpell = this.spells[i - 1]
      this.spells[i - 1] = spell
      this.spells[i] = previousSpell

      // Move it on the page
      this.list.insertBefore(item, item.previousSibling)
    }

    this.save()
  }

  removeSpell(spell, ev) {
    // Remove from the DOM
    const button = ev.target
    const item = button.closest('.spell')
    item.parentNode.removeChild(item)

    // Remove from the array
    const i = this.spells.indexOf(spell)
    this.spells.splice(i, 1)

    this.save()
  }

  toggleFavorite(spell, ev) {
    const button = ev.target
    const item = button.closest('.spell')
    spell.favorite = item.classList.toggle('fav')
    this.save()
  }

  convertCost(spell, ev) {
    const button = ev.target
    const item = button.closest('.spell')

    //switch spell cost to health
    if (spell.cost.indexOf("mana") != -1) {
      spell.cost = spell.cost.substring(0, spell.cost.indexOf(" mana")) + " health"
      item.getElementsByClassName("cost")[0].style.color = "rgba(255, 0, 0," + (this.extractCost(spell.cost)/costRange) + ")"
    }
    //switch spell cost to mana
    else {
      spell.cost = spell.cost.substring(0, spell.cost.indexOf(" health")) + " mana"
      item.getElementsByClassName("cost")[0].style.color = "rgba(0, 0, 255," + (this.extractCost(spell.cost)/costRange) + ")"
    }

    this.save()
  }

  addSpell(spell) {
    this.spells.push(spell)

    const item = this.renderItem(spell)
    this.list.appendChild(item)
  }

  // get number out of a string with "# cost-type" format
  extractCost(str) {
    return str.substring(0, str.indexOf(" "))
  }

  handleSubmit(ev) {

    const f = ev.target

    const spell = {
      name: f.spellName.value,
      cost: f.cost.value,
      favorite: false,
    }

    this.addSpell(spell)

    this.save()
    f.reset()
    f.spellName.focus()
  }

  save() {
    localStorage.setItem(
      'spells',
      JSON.stringify(this.spells)
    )
  }
}

const app = new App()
