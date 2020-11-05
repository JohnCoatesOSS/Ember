import * as Internal from  "../../Models/Measurements"

export interface ProductGroupsResponse {
    products: [Product]
}

export interface Product {
    id: number
    display_name: string
    permalink: string
    product_group_id: number
    product_sku: string

    primary_collection: Collection
    size_chart: SizeChartWrapper
    color: Color
}

export interface Collection {
    permalink: string
}

export interface SizeChartWrapper {
    content: string 
}

export interface Color {
    name: string
}

export interface Measurement {
  label: MeasurementLabel
  inches: number
}

export interface EaseAndWeight {
    label: MeasurementLabel
    weighting: number
    ease: number
}

export namespace Measurement {
    export function convert(value: Internal.Measurement): Measurement[] {
        let labels = MeasurementLabel.convert(value.label)
        var measurements: Measurement[] = []
        labels.forEach(label => {
            let mapped = value as unknown as Measurement;
            mapped.label = label
            measurements.push(mapped)
        })
        return measurements
    }
}

export type SizedMeasurements = Record<string, Measurement[]>

export enum MeasurementLabel {
  neckWidth = "Neck Width",
  length = "Length",
  acrossShoulder = "Across Shoulder",
  chest = "Chest",
  bottomOpening = "Bottom Opening",
  bicep = "Bicep",
  sleeveLength_short = "Sleeve Length (short)",
  sleeveLength_long = "Sleeve Length (long)",
  sleeveOpening = "Sleeve Opening",
  unknown = "(unknown)"
}

export enum MeasurementLabel_Change_To_Variant {
    sleeveLength = "Sleeve Length",
}

export namespace MeasurementLabel {
  export function isMember(value: string): boolean {
      let result = Object.values(MeasurementLabel).includes(value as MeasurementLabel)
      let resultVariant = Object.values(MeasurementLabel_Change_To_Variant).includes(value as MeasurementLabel_Change_To_Variant)
      if (!result && !resultVariant) {
          console.log("Invalid Everlane measurement", value)
      }
      return result || resultVariant
  }

  export function fromLabel(label: string, inches: number): MeasurementLabel {
      if (!isMember(label)) {
          console.log("Invalid Everlane measurement", label)
          throw new Error('Invalid Everlane measurement');
      }
      let resultVariant = Object.values(MeasurementLabel_Change_To_Variant).includes(label as MeasurementLabel_Change_To_Variant)
      if (resultVariant) {
          let preVariant = label as MeasurementLabel_Change_To_Variant
          switch(preVariant) {
              case MeasurementLabel_Change_To_Variant.sleeveLength:
                  if (inches < 12) {
                      return MeasurementLabel.sleeveLength_short
                  } else {
                      return MeasurementLabel.sleeveLength_long
                  }
          }
      }
      return label as MeasurementLabel
  }

  export function convert(label: Internal.MeasurementLabel) : MeasurementLabel[] {
      const map: Record<Internal.MeasurementLabel, MeasurementLabel[]> = {
          "hip": [MeasurementLabel.unknown],
          "inseam": [MeasurementLabel.unknown],
          "leg_opening": [MeasurementLabel.unknown],
          "thigh": [MeasurementLabel.unknown],
          "waist": [MeasurementLabel.bottomOpening],
          "chest": [MeasurementLabel.chest],
          "across_shoulder": [MeasurementLabel.acrossShoulder],
          "bicep": [MeasurementLabel.bicep],
          "neck_width": [MeasurementLabel.neckWidth],
          "sleeve_length": [MeasurementLabel.sleeveLength_long, MeasurementLabel.sleeveLength_short],
          "torso_length": [MeasurementLabel.length]
      }
      return map[label]
  }
}