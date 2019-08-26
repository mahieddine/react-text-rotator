import React from 'react'

export interface TextRotatorPropreties {
    children: Array<React.ReactNode>,
    /**
     * interval in ms between each transition
     */
    interval: number
}