import React, {Children} from 'react'
import {TextSpinnerPropreties} from 'TextSpinnerPropreties.ts'

type AllProps = TextSpinnerPropreties

interface TextRotatorState {
    displayedItemIdx: number
}

class TextSpinner extends React.Component<AllProps, TextRotatorState> {

    readonly children: Array<React.ReactNode>
    readonly interval: number
    readonly childrenCount: number
    private timer: number

    constructor(props: AllProps) {
        super(props)
        this.children = props.children
        this.interval = props.interval
        this.childrenCount = this.children.length
        this.timer = 0
        this.state = {
            displayedItemIdx: 0
        }
    }

    componentDidMount(): void {
        // fireup timer
        this.timer = setInterval(this.tick, this.interval)
    }

    componentWillUnmount(): void {
        clearInterval(this.timer)
    }

    tick = () => {
        this.setState({
            ...this.state,
            displayedItemIdx: (this.state.displayedItemIdx + 1) % this.childrenCount
        })
    }

    render(): React.ReactNode {
        return <>
            {
                Children.map(this.children, (child, idx) => {
                    return <div style={
                        idx == this.state.displayedItemIdx ? {
                                display: 'block'
                            }
                            : {
                                display: 'none'
                            }
                    }>{child}</div>
                })
            }</>
    }
}

export {TextSpinner}