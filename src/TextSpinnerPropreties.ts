import React from 'react'

export interface TextSpinnerPropreties {
    children: Array<React.ReactNode>,
    /**
     * interval in ms between each transition
     */
    interval: number
}