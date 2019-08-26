import * as React from 'react'
import {render} from 'react-dom'
import {Showroom} from './examples/Showroom'

document.getElementsByTagName('body')[0].innerHTML = '<div id="app"></div>'

render(<Showroom/>, document.getElementById('app'))