'use babel'

import Main from './main'
import { Disposable, CompositeDisposable } from 'atom'

export default {
  isActive: false,
  subscriptions: null,
  main: null,

  activate(state) {
    this.main = new Main()

    // // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hydra:toggle': () => this.toggle(),
      'atom-hydra:evalLine': () => this.main.evalLine(),
      'atom-hydra:evalBlock': () => this.main.evalBlock(),
      'atom-hydra:evalAll': () => this.main.evalAll(),
      'atom-hydra:toggleMessages': () => this.main.toggleMessages(),
      'atom-hydra:toggleCode': () => this.main.toggleCode(),
      'atom-hydra:bind1': () => this.main.keyBinds.doAction('1'),
      'atom-hydra:bind2': () => this.main.keyBinds.doAction('2'),
      'atom-hydra:bind3': () => this.main.keyBinds.doAction('3'),
      'atom-hydra:bind4': () => this.main.keyBinds.doAction('4'),
      'atom-hydra:bind5': () => this.main.keyBinds.doAction('5'),
      'atom-hydra:bind6': () => this.main.keyBinds.doAction('6'),
      'atom-hydra:bind7': () => this.main.keyBinds.doAction('7'),
      'atom-hydra:bind8': () => this.main.keyBinds.doAction('8'),
      'atom-hydra:bind9': () => this.main.keyBinds.doAction('9'),
      'atom-hydra:bind0': () => this.main.keyBinds.doAction('0')
    }));

    // add keybind events
    if (editor = atom.workspace.getActiveTextEditor()) {
      let disposables = this.main.keyBinds.registerKeyEvents(editor)

      this.subscriptions.add(...disposables)
    }

    console.log("subscriptions", this.subscriptions)
  },

  deactivate() {
  //  this.modalPanel.destroy();
    this.subscriptions.dispose()
    this.main.stop()
  //  this.atomHydraView.destroy();
  },

  serialize() {
    return {
    //  atomHydraViewState: this.atomHydraView.serialize()
    };
  },

  toggle() {
    if(this.isActive) {
      this.isActive = false
      return this.main.stop()
    } else {
      this.isActive = true
      return this.main.start()
    }
  }

};
