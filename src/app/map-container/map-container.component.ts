import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {applyContextDiffToMap, createMapFromContext} from '@geospatial-sdk/openlayers';
import { MapService } from '../map-context/map-context.service';
import {computeMapContextDiff, MapContext} from "@geospatial-sdk/core";
import type Map from "ol/Map";

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  standalone: true,
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {
  @ViewChild('mapRoot', { static: true }) mapRoot!: ElementRef;
  mapContext: MapContext | null = null;
  map: Map | null = null

  constructor(private mapService: MapService) {
  }

  ngOnInit(): void {
    // this.initializeMap();
    this.mapService.mapContext$.subscribe((context) => {
      if (this.mapContext === null) {
        this.mapContext = context
        this.map = createMapFromContext(this.mapContext, this.mapRoot.nativeElement);
      }
      const diff =computeMapContextDiff(context, this.mapContext)
        applyContextDiffToMap(this.map as Map, diff);
    })
  }

  // initializeMap(): void {
  //   this.mapContext = {
  //     layers: [
  //       {
  //         type: 'xyz',
  //         url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  //       }
  //     ],
  //     view: {
  //       zoom: 5,
  //       center: [6, 48.5]
  //     }
  //   };
  //
  //   const map = createMapFromContext(this.mapContext, this.mapRoot.nativeElement);
  //   this.mapService.setMapContext(this.mapContext);
  //   this.mapService.setMap(map);
  // }
}
