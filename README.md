## This is a fork

This is a fork of the original, wonderful project. See [Coding Chaos Concert](https://github.com/RKelln/CodingChaosConcert) for more details.


### Atom-hydra fork modifications:

Currently all changes only reside on the `coding_chaos_concert_2019` branch.

* Work added on top of SHA [a5aaa8ca0cb92bc63e4396735db6b63b0331526c](https://github.com/ojack/atom-hydra/tree/a5aaa8ca0cb92bc63e4396735db6b63b0331526c)

* Add additional keybinding for eval all code and toggle messages
* Add customizable keybinding for numpad
  * Update key down on `tick()`
    * Code inspired/copied from [keydrown by Jeremy Kahn](http://jeremyckahn.github.io/keydrown/)
* Allow for display of code to be toggled and add keybind for it
* Allow initScreen() to be sent name partials for matching 
* Improved clean-up, including unbinding keys, etc
* Improved display of sound 

* Add many helpers to `util.js`:
  * `create_video`, `load_video`, `queue_videos`: helps manage playback of video files
  * `load_image`: helps load an image onto canvas
  * `shuffle`: randomly shuffle an array
  * `create_slideshow`: intelligently loads a directory of images into memory for load free access
  * `load_svg_stanza`, `reset_svg`, `svg_stanza`: for loading animated poem stanzas made from svgs


### Experimental package for running hydra in atom.
Also includes p5.js, support for OSC channels, and for live coding with javascript in general.

For example usage, see: https://github.com/ojack/hydra-examples

For browser version, see: https://github.com/ojack/hydra


### Running Atom-Hydra
1. restart atom
2. packages > atom-hydra > toggle
3. create a file ending with .js in atom
4. type `osc().out()`
5. ctrl-enter to run block of code
6. shift-enter to run a line of code

### Error: webgl not supported
Try running atom from the command line as follows:
`atom --ignore-gpu-blacklist `

### Error: node not found
Install nodejs

Code for editor styling and osc channels lovingly derived from some other wonderful live coding packages:
* https://atom.io/packages/veda
* https://github.com/tidalcycles/atom-tidalcycles
