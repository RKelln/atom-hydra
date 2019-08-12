'use babel'

import { Disposable } from 'atom'

const noop = () => ({})

class Key {

  /**
   * Represents a key on the keyboard.  You'll never actually call this method
   * directly; Key Objects for every key that Keydrown supports are created for
   * you when the library is initialized (as in, when the file is loaded).  You
   * will, however, use the `prototype` methods below to bind functions to key
   * states.
   *
   * @param {number} keyCode The keyCode of the key.
   * @constructor
   * @class kd.Key
   */
  constructor(keyCode) {
    this.keyCode = keyCode;
    this.cachedKeypressEvent = null;
  }

  /*!
   * The function to be invoked on every tick that the key is held down for.
   *
   * @type {function}
   */
  _downHandler = noop;

  /*!
   * The function to be invoked when the key is released.
   *
   * @type {function}
   */
  _upHandler = noop;

  /*!
   * The function to be invoked when the key is pressed.
   *
   * @type {function}
   */
  _pressHandler = noop;

  /*!
   * Private helper function that binds or invokes a hander for `down`, `up',
   * or `press` for a `Key`.
   *
   * @param {Key} key
   * @param {string} handlerName
   * @param {function=} opt_handler If omitted, the handler is invoked.
   * @param {KeyboardEvent=} opt_evt If this function is being called by a
   * keyboard event handler, this is the raw KeyboardEvent Object provided from
   * the browser.
   */
  bindOrFire (key, handlerName, opt_handler, opt_evt, dt) {
    if (opt_handler) {
      key[handlerName] = opt_handler;
    } else {
      key[handlerName](opt_evt, dt);
    }
  }


  /**
   * Returns whether the key is currently pressed or not.
   *
   * @method isDown
   * @return {boolean} True if the key is down, otherwise false.
   */
  isDown() {
    return keysDown.indexOf(this.keyCode) !== -1;
  }


  /**
   * Bind a function to be called when the key is held down.
   *
   * @method down
   * @param {function=} opt_handler The function to be called when the key is
   * held down.  If omitted, this function invokes whatever handler was
   * previously bound.
   */
  down(opt_handler, dt) {
    this.bindOrFire(this, '_downHandler', opt_handler, this.cachedKeypressEvent, dt)
  }


  /**
   * Bind a function to be called when the key is released.
   *
   * @method up
   * @param {function=} opt_handler The function to be called when the key is
   * released.  If omitted, this function invokes whatever handler was
   * previously bound.
   * @param {KeyboardEvent=} opt_evt If this function is being called by the
   * keyup event handler, this is the raw KeyboardEvent Object provided from
   * the browser.  This should generally not be provided by client code.
   */
  up(opt_handler, opt_evt, dt) {
    this.bindOrFire(this, '_upHandler', opt_handler, opt_evt, dt)
  }


  /**
   * Bind a function to be called when the key is pressed.  This handler will
   * not fire again until the key is released — it does not repeat.
   *
   * @method press
   * @param {function=} opt_handler The function to be called once when the key
   * is pressed.  If omitted, this function invokes whatever handler was
   * previously bound.
   * @param {KeyboardEvent=} opt_evt If this function is being called by the
   * keydown event handler, this is the raw KeyboardEvent Object provided from
   * the browser.  This should generally not be provided by client code.
   */
  press(opt_handler, opt_evt, dt) {
    this.cachedKeypressEvent = opt_evt;
    this.bindOrFire(this, '_pressHandler', opt_handler, opt_evt, dt);
  };


  /**
   * Remove the handler that was bound with `{{#crossLink
   * "kd.Key/down:method"}}{{/crossLink}}`.
   * @method unbindDown
   */
  unbindDown() {
    this._downHandler = noop;
  };


  /**
   * Remove the handler that was bound with `{{#crossLink
   * "kd.Key/up:method"}}{{/crossLink}}`.
   * @method unbindUp
   */
  unbindUp() {
    this._upHandler = noop;
  };


  /**
   * Remove the handler that was bound with `{{#crossLink
   * "kd.Key/press:method"}}{{/crossLink}}`.
   * @method unbindPress
   */
  unbindPress() {
    this._pressHandler = noop;
  };

}

export default class KeyBinds {

  //noop = () => ({})

  keyBinds = {
    '1': noop,
    '2': noop,
    '3': noop,
    '4': noop,
    '5': noop,
    '6': noop,
    '7': noop,
    '8': noop,
    '9': noop,
    '0': noop,
  }
  /**
   * Lookup table of keys to keyCodes.
   *
   * @type {Object.<number>}
   */
  KEY_MAP = {
    'NUMPAD0': 96,
    'NUMPAD1': 97,
    'NUMPAD2': 98,
    'NUMPAD3': 99,
    'NUMPAD4': 100,
    'NUMPAD5': 101,
    'NUMPAD6': 102,
    'NUMPAD7': 103,
    'NUMPAD8': 104,
    'NUMPAD9': 105
  }

  /**
   * The transposed version of KEY_MAP.
   *
   * @type {Object.<string>}
   */
  TRANSPOSED_KEY_MAP = Object.entries(this.KEY_MAP).reduce(
    (obj, [key, value]) => {
      obj[value] = key;
      return obj
  }, {})

  keysDown = new Set()
  keys = {}

  constructor() {
    Object.entries(this.KEY_MAP).forEach( ([keyName, keyCode]) => {
      //this.keys[keyName] = new Key(keyCode);
      this.keys[keyCode] = new Key(keyCode);
    })
  }

  doAction(keyName) {
    // if (!this.keyBinds.hasOwnProperty(keyName)) {
    //   console.log("No binding for: " + keyName)
    //   return false
    // }
    //console.log("do key bind: " + keyName, this.keyBinds[keyName])
    //this.keyBinds[keyName].call()
  }

  // NOTE: activation functions get passed (dt) the change in time this frame
  bindKey(keyName, press, up, down) {
    let keyCode = this.KEY_MAP[keyName]
    if (!keyCode) {
      console.log("Invalid key: ", keyName, " Can only bind: ", Object.getOwnPropertyNames(this.KEY_MAP))
      return false
    }

    if (typeof press === "function") {
      this.keys[keyCode].press(press)
      console.log("registered", keyName, press)
    }
    if (typeof down === "function") {
      this.keys[keyCode].down(down)
      console.log("registered", keyName, down)
    }
    if (typeof up === "function") {
      this.keys[keyCode].up(up)
      console.log("registered", keyName, up)
    }
  }

  unbindAll() {
    Object.entries(this.keys).forEach( ([keyName, key]) => {
      key.unbindPress()
      key.unbindUp()
      key.unbindDown()
    })
  }

  tick(dt) {
    if (this.keysDown.size == 0) return

    this.keysDown.forEach((keyCode)=>{
      this.keys[keyCode].down()
    })
  }

  _keyDownHandler(evt) {
    var keyCode = evt.keyCode;
    if (!this.keys[keyCode]) return

    var isNew = !this.keysDown.has(keyCode);
    this.keysDown.add(keyCode);

    var key = this.keys[keyCode];

    //console.log("_keyDownHandler", evt, keyCode, isNew, this.keysDown)

    if (key) {
      var cachedKeypressEvent = key.cachedKeypressEvent || {};

      // If a modifier key was held down the last time that this button was
      // pressed, and it is pressed again without the modifier key being
      // released, it is considered a newly-pressed key.  This is to work
      // around the fact that the "keyup" event does not fire for the modified
      // key until the modifier button is also released, which poses a problem
      // for repeated, modified key presses such as hitting ctrl/meta+Z for
      // rapid "undo" actions.
      if (cachedKeypressEvent.ctrlKey ||
        cachedKeypressEvent.shiftKey ||
        cachedKeypressEvent.metaKey) {
          isNew = true;
        }

        if (isNew) {
          key.press(null, evt);
        }
      }
  }

  _keyUpHandler(evt) {
    if (!this.keys[evt.keyCode]) return

    //console.log("_keyUpHandler", evt, evt.keyCode, this.keysDown)

    this.keysDown.delete(evt.keyCode)
    this.keys[evt.keyCode].up(null, evt)
  }

  // Stop firing the "down" handlers if the user loses focus of the browser
  // window.
  _blurHandler(evt) {
    //console.log("_blurHandler", evt, evt.keyCode, this.keysDown)

    // Fire the "up" handler for each key that is currently held down
    this.keysDown.forEach( (keyCode) => {
      this.keys[keyCode].up();
    });

    this.keysDown.clear();
  }

  handlers = {
    "keydown": this._keyDownHandler,
    "keyup": this._keyUpHandler,
    "blur": this._blurHandler
  }

  // returns a disposable that will remove the listener
  registerKeyEvents(editor) {
    // inspired by https://discuss.atom.io/t/detect-key-press-events-in-texteditor/16430
    disposables = []
    editorView = atom.views.getView(editor)

    for (const [eventName, handler] of Object.entries(this.handlers)) {
      editorView.addEventListener(eventName, handler.bind(this))
      disposables.push(new Disposable(
          () => editorView.removeEventListener(eventName, handler.bind(this))
        )
      )
    }

    return disposables
  }

}
