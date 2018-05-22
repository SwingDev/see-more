export const SPACESHIP_FILE_NAME = 'spaceship_decal_ver'

export const MARKER_MODELS = [{
  file: 'marker.patt',
  modelName: 'spaceship'
}]

export const ENV_MAP_TILES = [
  require('images/env-map/px.jpg'),
  require('images/env-map/nx.jpg'),
  require('images/env-map/py.jpg'),
  require('images/env-map/ny.jpg'),
  require('images/env-map/pz.jpg'),
  require('images/env-map/nz.jpg')
]

export const BREAKPOINTS = {
  xSmall: 480,
  small: 768,
  medium: 992,
  large: 1200,
  xLarge: 1920
}

export const message = {
  NO_CAMERA: 'Please reload page and allow access to camera',
  FIND_MAKER: 'Find marker with "See More" logo',
  NO_WEBGL_SUPPORT: `
    Sorry, but your device doesn't support WebGL
    and Augmented Reality
  `,
  ERROR: 'Sorry, there was an error during load!'
}
