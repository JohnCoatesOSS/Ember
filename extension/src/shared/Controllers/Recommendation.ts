import { Measurements, Measurement, MeasurementLabel, SizedMeasurements, EaseAndWeight } from "../Models/Measurements"
import * as Everlane from "../Models/Sites/Everlane"
import * as EverlaneSizing from "../Data/EverlaneSizingData"
export { Measurements, Measurement }

export class Recommendation {
    // static recommendGarmentForMeasurements(measurements: Measurements) {
    //     let garments = GarmentMock.straightLegCrop()
    //     var bestTotalScore: number = Number.MAX_SAFE_INTEGER
    //     let ease = GarmentMock.straightLegCrop_ease()
    //     let weighting = GarmentMock.straightLegCrop_weighting()
    //     let bestGarment: Garment = garments[0]

    //     let body = measurements
    //     garments.forEach(garment => {
    //         let totalScore = 0
    //         let keys = ["waist", "hip", "thigh", "leg_opening", "inseam"] as Array<keyof Measurements>
    //         keys.forEach(key => {
    //           let garment_value = garment[key]
    //             let body_value = body[key]
    //             let ease_value = ease[key]
    //             let weighting_value = weighting[key]
    //             if (!garment_value || !body_value || !ease_value || !weighting_value) {
    //                 return
    //             }

    //             let score = ((garment_value - (body_value + ease_value)) / (body_value + ease_value)) * weighting_value
    //             totalScore += Math.abs(score)
    //         })

    //         if (totalScore < bestTotalScore) {
    //             bestTotalScore = totalScore
    //             bestGarment = garment
    //         }
    //     })

    //     console.log("best garment", bestGarment)
    // }

    static sizeForCollection(collectionName: string, userMeasurements: Everlane.Measurement[], sizeChart: Everlane.SizedMeasurements): string | undefined {
      console.log("sizeForCollection", collectionName, userMeasurements, sizeChart)

      let collection = EverlaneSizing.Collections.collectionNamed(collectionName)
      if (!collection) {
        console.log("Couldn't find collection", collectionName)
        return undefined
      }

      let easeAndWeights = collection.items
      let result = this.sizeForMeasurements(userMeasurements, sizeChart, easeAndWeights)
      console.log("recommended size", result)
      return result
    }

    static sizeForMeasurements(userMeasurements: Everlane.Measurement[], sizes: Everlane.SizedMeasurements, easeAndWeights: EaseAndWeight[]): string {
      var userBody: Record<string, number> = {}

      userMeasurements.forEach(measurement => {
        userBody[measurement.label] = measurement.inches
      })

      var easeAndWeightsRecord: Record<string, EaseAndWeight> = {}
      easeAndWeights.forEach(easeAndWeight =>  {
        easeAndWeightsRecord[easeAndWeight.label] = easeAndWeight
      })

      var bestTotalScore: number = Number.MAX_SAFE_INTEGER
      var bestSize: string = "none"

      Object.entries(sizes).forEach(([size, measurements]) => {
        var totalScore = 0
          measurements.forEach(measurement => {
            let label = measurement.label
            let easeAndWeight = easeAndWeightsRecord[label]
            if (!easeAndWeight) {
              console.log("missing ease/weight for", label)
              return
            }
            let ease = easeAndWeight.ease
            let weight = easeAndWeight.weighting

            let body = userBody[label]
            if (!body) {
              console.log("missing user measurement for", label)
              return
            }

            let garment = measurement.inches
            let score = ((garment - (body + ease)) / (body + ease)) * weight
            console.log(`${size} ${label}: ((${garment} - (${body} + ${ease})) / ${body} + ${ease})) * ${weight} = ${score}`)
            totalScore += Math.abs(score)
          })

          console.log(`score for ${size}: ${totalScore}\n`)
          if (totalScore < bestTotalScore) {
              bestTotalScore = totalScore
              bestSize = size
          }
      })

      console.log("recommended size", bestSize)
      return bestSize
    }

    private static measurementsToEverlaneFormat(measurements: Measurement[]): Everlane.Measurement[] {
      return measurements.flatMap(value => {
        return Everlane.Measurement.convert(value)
      })
    }
}