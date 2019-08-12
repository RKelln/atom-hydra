'use babel'

import Vivus from './vivus'

export default class Poem {
  constructor(files, container, rate=40, style='') {
    this.index = -1
    this.files = files
    this.visible = false
    this.container = container
    this.rate = rate
    this.vivus = null
    this.speed = 1.0
    this.poemStyleId = 'poemStyle'

    // clean up container
    this.clear()

    // set up poem styles
    if (el = document.getElementById(this.poemStyleId)) {
      el.remove()
    }

    var styleElem = document.createElement('style')
    styleElem.id = this.poemStyleId
    styleElem.type = 'text/css'
    styleElem.innerHTML = `

    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }

    .fade-in {
    	opacity:0;
    	animation:fadeIn ease-in 1;
      /* this makes sure that after animation is done we remain at the last keyframe value (opacity: 1)*/
    	animation-fill-mode:forwards;
    	animation-duration:0.3s;
    }
    .fade-out {
      opacity:1;
      animation:fadeOut ease-in 1;
      /* this makes sure that after animation is done we remain at the last keyframe value (opacity: 1)*/
      animation-fill-mode:forwards;
      animation-duration:0.5s;
    }

    #stanza {
      padding-top: 5px !important;
    }

    #stanza svg {
      max-width: 70%;
      filter: drop-shadow(0px 0px 3px rgba(0,0,0,1));
      margin-right: auto;
      padding-bottom: 200px;
    }
    #stanza path {
      filter: drop-shadow(0px 0px 1px rgba(0,0,0,1));
      ${style}
    }`;
    this.container.appendChild(styleElem)
  }

  show() {
    if (!this.visible) {
      console.log("Show poem")
      this.visible = true
      this.container.classList.remove("fade-out")
      this.container.classList.add("fade-in")
    }
    if (this.index == -1) {
      // assume we want to display the first one if show() after load
      this.next()
    }
  }

  hide() {
    if (this.visible) {
      console.log("Hide poem")
      this.visible = false
      this.container.classList.remove("fade-in")
      this.container.classList.add("fade-out")
    }
  }

  next() {
    if (this.index < this.files.length - 1) {
      this.index += 1
    }
    this.show()
    this._render(this.index)
  }

  prev() {
    if (this.index > 0) {
      this.index -= 1
    }
    this.show()
    this._render(this.index)
  }

  loop() {
    if (this.index < 0) return
    this._render(this.index)
  }

  clear() {
    if (this.container) {
      // delete all but style element
      while (this.container.lastChild && this.container.lastChild.id !== this.poemStyleId) {
          this.container.removeChild(this.container.lastChild);
      }
    }
  }

  play(speed, callback) {
    if (this.vivus) {
      this.vivus.play(speed, callback)
    }
  }

  adjustSpeed(adjustment) {
    if (this.vivus) {
      this.speed = Math.max(0.0001, this.speed + adjustment)
      console.log("poem speed", this.speed)
      this.vivus.speed = this.speed
    }
  }

  stop() {
    if (this.vivus) {
      this.vivus.stop()
    }
  }

  stopped() {
    if (this.vivus) {
      return this.vivus.stopped()
    }
    return true // non-animated svgs are always stopped
  }

  reset() {
    if (this.vivus) {
      this.vivus.reset()
    }
  }

  _render(index) {
    console.log("Display stanza", this.files[this.index])

    // remove existing svg
    this.clear()

    if (!this.visible) return

    if (this.rate > 0) {
      this.vivus = new Vivus('stanza', {
        file: this.files[this.index],
        type: 'scenario-sync',
        duration: this.rate,
        speed: this.speed });

    } else {
      this.vivus = null

      fetch(this.files[this.index])
        .then(response => response.text())
        .then(svg => this.container.insertAdjacentHTML("beforeend", svg))
    }
  }

}
