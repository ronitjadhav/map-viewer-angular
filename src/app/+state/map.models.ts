import {MapContextLayer} from "@geospatial-sdk/core";

export type MapLayer = MapContextLayer & {
  title: string
}

export type MapLayerWithInfo = MapLayer & {
  error: string | null
  loading: boolean
}
