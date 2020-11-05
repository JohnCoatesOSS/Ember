import { Measurements } from "../Measurements"

export interface EmberMessage {
    ember: Boolean ,
    type: EmberMessageType
}

export interface EmberMeasurements extends EmberMessage {
    type: EmberMessageType
    measurements: Measurements | undefined
}

export enum EmberMessageType {
    GetMeasurements = 0,
    FromBackground = 1
}