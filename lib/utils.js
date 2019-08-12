'use babel'

const fs = require('fs')
const path = require('path')

import Poem from './poem'

// map an input range to an output range
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  if (this < in_min) return out_min
  if (this > in_max) return out_max
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

export default class Utils {

  constructor() {}

  // returns a video element object and initializes a source with it
  create_video(hydra_src, vid_src_base='', options={}) {
    let vid = document.createElement('video')
    // ensure last slash
    if (vid_src_base.length > 0 && vid_src_base[vid_src_base.length-1] != '/') {
      vid_src_base = vid_src_base + "/"
    }
    vid.video_base_path = vid_src_base
    // NOTE: must set the base path in case load_video is called immediately
    // and for whatever reason we can't use the await keyword here to block
    // untl the path is checked
    fs.access(vid_src_base, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`create_video: ${vid_src_base} does not exist`, err)
      }
    })
    return vid
  }

  load_video(vid, hydra_src, src='', options={}) {
    vid.muted = true
    vid.playbackRate = 1.0
    vid.loop = true
    vid.autoplay = false

    // apply options
    for (const key in options) {
      vid[key] = options[key]
    }

    if (src != '') {
      const base_path = vid.video_base_path || ''
      const full_path = path.join(base_path, src)
      //console.log(base_path, full_path, src, vid)
      vid.src = full_path
      fs.access(full_path, fs.constants.F_OK, (err) => {
        console.log(`load_video: ${full_path} ${err ? 'does not exist' : 'exists'}`, err);
      })
    }

    vid.addEventListener('loadeddata', function() {
      if (vid.readyState >= 3) {
        hydra_src.init({src: vid})
        console.log("loaded", vid.src)
      }
    },
    {once: true})
  }

  // adds a playlist of videos to video element
  // adds playNext() function to go to next item in playlist
  queue_videos(vid, hydra_src, playlist, base='', loop=false) {
    vid.playlist = playlist
    vid.current = 0 // start at 0 using playNext()
    // ensure last slash
    if (base.length > 0 && base[base.length-1] != '/') {
      base = base + "/"
    }

    vid.loop = false // don't loop any videos in the playlist
    vid.autoplay = false
    vid.src = base + vid.playlist[vid.current]
    vid.currentTime = 0

    // only the first video needs to set the source
    vid.addEventListener('loadeddata', function() {
      if (vid.readyState >= 2) {
        hydra_src.init({src: vid})
        console.log("loaded", vid.src)
      }
    })

    vid.playNext = function(n) {
      vid.current = vid.current + 1
      if (vid.current >= vid.playlist.length) {
        if (loop) {
          vid.current = 0
        } else { // stop
          //vid.pause()
          return false
        }
      }
      console.log("playing video: ", base + vid.playlist[vid.current])
      vid.loop = false // don't loop any videos in the playlist
      vid.autoplay = false
      vid.src = base + vid.playlist[vid.current]
      vid.currentTime = 0
      vid.play()
      return true
    }

    vid.addEventListener('ended', function() {
      vid.playNext()
    })
  }

  /*
  // returns a canvas element object and initializes a source with it
  create_canvas(hydra_src, base_path='', options={}) {
    let canvas = document.createElement('canvas')
    // ensure last slash
    if (base_path.length > 0 && base_path[base_path.length-1] != '/') {
      base_path = base_path + "/"
    }
    canvas.base_path = base_path
    // NOTE: must set the base path in case load_video is called immediately
    // and for whatever reason we can't use the await keyword here to block
    // untl the path is checked
    fs.access(base_path, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`create_canvas: base_path: ${base_path} does not exist`, err)
      }
    })
    return canvas
  }
  */
  load_image(canvas, img, hydra_src, src='', options={}) {

    // apply options
    for (const key in options) {
      img[key] = options[key]
    }

    // img.addEventListener('loadend', function() {
    //   console.log("loaded", img.src)
    //   hydra_src.init({src: img})
    // },
    // {once: true})

    if (src != '') {
      const base_path = img.base_path || ''
      const full_path = path.join(base_path, src)
      //console.log(base_path, full_path, src, vid)
      fs.access(full_path, fs.constants.F_OK, (err) => {
        console.log(`load_image: ${full_path} ${err ? 'does not exist' : 'exists'}`, err);
      })

      // var downloadingImage = new Image();
      // downloadingImage.onload = function() {
      //     console.log("download onload")
      //     img.src = this.src
      //     cavnas
      // }
      // downloadingImage.loadend = function() {
      //     console.log("download loadend")
      // };
      // downloadingImage.src = full_path

      var ctx = canvas.getContext('2d');
      var new_img = new Image();
      new_img.onload = function() {
        canvas.width = new_img.width
        canvas.height = new_img.height
        //ctx.drawImage(new_img, 0, 0)
      }
      new_img.src = full_path
    }
  }

  // returns unique numbers from the set, until all have been used
  // then random
  makeRandomRange(x) {
    let range = new Array(x)
    let pointer = x
    return () => {
        pointer = (pointer-1+x) % x
        let random = Math.floor(Math.random() * pointer)
        let num = (random in range) ? range[random] : random
        range[random] = (pointer in range) ? range[pointer] : pointer
        return range[pointer] = num
    }
  }

  /**
   * Randomly shuffle an array
   * https://stackoverflow.com/a/2450976/1293256
   * @param  {Array} array The array to shuffle
   * @return {String}      The first item in the shuffled array
   */
  shuffle(array) {
  	let currentIndex = array.length
  	let temporaryValue, randomIndex

  	// While there remain elements to shuffle...
  	while (0 !== currentIndex) {
  		// Pick a remaining element...
  		randomIndex = Math.floor(Math.random() * currentIndex)
  		currentIndex -= 1

  		// And swap it with the current element.
  		temporaryValue = array[currentIndex]
  		array[currentIndex] = array[randomIndex]
  		array[randomIndex] = temporaryValue
  	}
  	return array
  }

  create_slideshow(p, hydra_src, dir, options={loop: true, limit: 10}) {
    // check dir exists
    fs.access(dir, fs.constants.F_OK, (err) => {
      console.log(`create_slideshow: ${dir} ${err ? 'does not exist' : 'exists'}`, err);
    })

    p.imageMode(p1.CENTER)
    p.colorMode(p1.RGB, 1.0)
    p.hide()

    hydra_src.init({src: p.canvas})

    let image = null

    p.slideshow_index = 0
    p.slideshow_options = {}

    // apply options
    p.rate = 0
    p.drift = 0
    p.zoom = 1
    for (const key in options) {
      p.slideshow_options[key] = options[key]
    }

    // get file list
    const imgFiles = dir => fs.readdirSync(dir)
      .filter((name) => path.extname(name).toLowerCase() === '.jpg')
      .map(name => path.join(dir, name))

    file_list = imgFiles(dir)
    if (options.limit) {
      this.shuffle(file_list)
      file_list = file_list.slice(0, options.limit)
    }
    console.log(file_list)

    // TODO: pass in time change
    const update = () => {
      image.scale += image.dt
      image.scale = Math.max(image.fullscreen_scale, image.scale)
      image.x += image.x_drift
      image.y += image.y_drift
      // make sure we don't drift out of range of screen
      over_w = (image.scale*image.width - window.innerWidth) / 2
      over_h = (image.scale*image.height - window.innerHeight) / 2
      min_x = window.innerWidth / 2 - over_w
      min_y = window.innerHeight / 2 - over_h
      max_x = window.innerWidth / 2 + over_w
      max_y = window.innerHeight / 2 + over_h
      image.x = Math.min( Math.max(min_x, image.x), max_x)
      image.y = Math.min( Math.max(min_y, image.y), max_y)
    }

    p.init_image = (rate, drift, zoom=1.0) => (pimage) => {
      image = pimage
      image.dt = rate
      image.fullscreen_scale = Math.min(
        1.0 - window.innerWidth / image.width,
        1.0 - window.innerHeight / image.height)
      image.scale = image.fullscreen_scale * zoom
      image.x = window.innerWidth / 2
      image.y = window.innerHeight / 2
      image.x_drift = drift * p1.randomGaussian()
      image.y_drift = drift * p1.randomGaussian()
      console.log("loaded", image)
      max_x = (image.width / 2) - window.innerWidth
      max_y = (image.height / 2) - window.innerHeight
    }

    p.draw = () => {
      if (!image || !image.width) return
      //p1.clear()
      if (image.width > 0) {
        update()
        p.image(image, image.x, image.y, image.width*image.scale, image.height*image.scale)
      }
    }

    p.nextImage = (rate, drift, zoom) => {
      p.slideshow_index += 1
      if (p.slideshow_index > file_list.length - 1) {
        if (p.loop) {
          p.slideshow_index = 0
        } else {
          p.slideshow_index = file_list.length -1
        }
      }
      // p.loadImage(file_list[p.slideshow_index],
      //   p.init_image(rate || p.rate, drift || p.drift),
      //   function(e) { console.log("slideshow error loading image", e)}
      // )
      p.init_image(rate || p.rate, drift || p.drift, zoom || p.zoom)(loaded_images[p.slideshow_index])
      console.log("next image", image)
    }

    // load images
    // note that loading too many at once just crashes the editor, so we do it serially
    loaded_images = []
    serial_load = () => {
      console.log("loading", file_list[loaded_images.length])
      p.loadImage(file_list[loaded_images.length],
        function(pImage) {
          loaded_images.push(pImage)
          if (loaded_images.length < file_list.length) {
            serial_load()
          }
        },
        function(e) { console.log("slideshow error loading image", e)}
      )
    }
    serial_load()
  }

  stanza(text, style="") {
    var div = document.getElementById('stanza')
    if (div == null) {
      if (typeof(text) == 'undefined') {
        console.log("removing stanza")
        // remove text
        div.remove()
        return
      }

      var div = this._create_stanza()

      var e = document.createElement('h1')
      var textNode = document.createTextNode("")
      e.appendChild(textNode)
      div.appendChild(e)
    }

    if (Array.isArray(text)) {
      text = text.join('\n')
    }
    console.log("Stanza:", text, style)
    var e = div.childNodes[0]
    e.style = "color: white; font-size: 30px; text-align: left; margin: auto; white-space: pre; line-height: 1.5em; " + style
    e.childNodes[0].nodeValue = text
  }

  _create_stanza() {
    // create a new stanza
    console.log("creating new stanza element")
    var div = document.createElement('div')
    div.id = 'stanza'
    div.style.display = 'flex'
    div.style.height = '100%'
    div.style.width = '100%'
    div.style.paddingTop = '25px'
    div.style.paddingBottom = '50px'
    div.style.position = 'absolute'
    div.style.pointerEvents = 'none' // allow mouse to click through since text is on top

    var parent = document.querySelector('.workspace')
    parent.appendChild(div)

    return div
  }

  // loads ordered svg files from a directory and returns an Poem object
  // rate is number of frames per path
  load_svg_stanza(dir, rate=5) {

    const svgFiles = dir => fs.readdirSync(dir)
      .filter((name) => path.extname(name).toLowerCase() === '.svg')
      .map(name => path.join(dir, name))


    console.log("Load svg: ", dir, svgFiles(dir))

    let div = document.getElementById('stanza')
    if (div == null) {
      div = this._create_stanza()
    }

    let poem = new Poem(svgFiles(dir).sort(), div, rate)

    return poem
  }

  reset_svg() {
    let div = document.getElementById('stanza')
    if (div != null) {
      div.remove()
    }
  }

  svg_stanza(file) {
    var div = document.getElementById('stanza')
    if (div == null) {
      div = this._create_stanza()
    }
    else {
      // remove stanze if no file specified
      if (typeof(file) == 'undefined') {
        console.log("removing stanza")
        // remove text
        div.remove()
        return
      }

      // remove existing svg
      if (div.firstChild != null) {
        div.removeChild(div.firstChild)
      }
    }
    fetch(file)
      .then(response => response.text())
      .then(svg => div.insertAdjacentHTML("afterbegin", svg))
  }
}
