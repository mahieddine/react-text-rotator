import * as React from 'react'
import {render} from 'react-dom'
import {Showroom} from './Showroom'

document.getElementsByTagName('body')[0].innerHTML = '<div id="app"></div>'

render(<Showroom/>, document.getElementById('app'))