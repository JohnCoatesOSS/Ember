import { MeasurementLabel, EaseAndWeight } from "../Models/Sites/Everlane"

export interface Collection {
    label: string
    items: EaseAndWeight[]
}

/*
Fitting key regex
^(.*?):\s+\(W:([0-9\.]+) \| CE\+?(\-?[0-9\.]+)\)
{label: "$1", weighting: $2, ease: $3},
*/
export class Collections {
    static collectionNamed(name: string): Collection | null {
        let collections: Record<string, Collection> = {
            "mens-tees": Collections.tees()
        }

        return collections[name]
    }
    
    static tees(): Collection {0
        return {
            label: "mens-tees",
            items: [
                {label: MeasurementLabel.neckWidth, weighting: 0.01, ease: 1.5},
                {label: MeasurementLabel.length, weighting: 0.10, ease: 7.5},
                {label: MeasurementLabel.acrossShoulder, weighting: 0.10, ease: 1.5},
                {label: MeasurementLabel.chest, weighting: 1.00, ease: 3.0},
                {label: MeasurementLabel.bottomOpening, weighting: 0.01, ease: 12.0},
                {label: MeasurementLabel.bicep, weighting: 0.01, ease: 4.0},
                {label: MeasurementLabel.sleeveLength_short, weighting: 0.00, ease: 0.0},
                {label: MeasurementLabel.sleeveLength_long, weighting: 1.00, ease: 0.0},
                {label: MeasurementLabel.sleeveOpening, weighting: 0.01, ease: 3.0},
            ]
        }
    }
}