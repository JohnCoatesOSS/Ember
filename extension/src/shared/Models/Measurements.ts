export type Measurements = Record<MeasurementLabel, number>

export interface Measurement {
    label: MeasurementLabel
    inches: number
}

export interface EaseAndWeight {
    label: string
    weighting: number
    ease: number
}

export enum MeasurementLabel {
    hip = "hip",
    inseam = "inseam",
    legOpening = "leg_opening",
    thigh = "thigh",
    waist = "waist",
    chest = "chest",
    acrossShoulder = "across_shoulder",
    bicep = "bicep",
    neckWidth = "neck_width",
    sleeveLength = "sleeve_length",
    torsoLength = "torso_length"
}

export namespace MeasurementLabel {
    export function isMember(value: string): boolean {
        return Object.values(MeasurementLabel).includes(value as MeasurementLabel)
    }
    export function fromValue(value: string): MeasurementLabel | undefined {
        if (!isMember(value)) {
            return undefined
        }
        return value as MeasurementLabel
    }
}

export type SizedMeasurements = Record<string, Measurement[]>

export function fractionToFloat(fraction: string): number {
    if (fraction.indexOf(" ") != -1) {
        let split = fraction.split(" ", 2)
        let main = parseInt(split[0])
        let decimal = eval(split[1]) as number
        let result = main + decimal
        return result
    }

    return parseInt(fraction)
}

export function cmToInches(cm: number): number {
    console.log("cmToInches not implemented yet!")
    return 0
}