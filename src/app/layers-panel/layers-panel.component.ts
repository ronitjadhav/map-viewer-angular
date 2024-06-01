import { Component, OnInit } from '@angular/core';
import { MapService } from "../map-context/map-context.service";
import { MapContext } from "@geospatial-sdk/core";
import Map from 'ol/Map';
import { MapContextLayer } from "@geospatial-sdk/core";
import { MatIcon } from "@angular/material/icon";
import { NgForOf, NgIf } from "@angular/common";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { AddLayerFromWmsComponent } from "../add-layer-from-wms/add-layer-from-wms.component";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-layers-panel',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    MatTabGroup,
    MatTab,
    AddLayerFromWmsComponent,
    NgIf,
    MatTooltip
  ],
  templateUrl: './layers-panel.component.html',
  styleUrls: ['./layers-panel.component.css']
})
export class LayersPanelComponent implements OnInit {
  layers: MapContextLayer[] | undefined;
  context: MapContext | null = null;
  map: Map | null = null;
  isMinimized = true;

  constructor(private mapService: MapService) {}

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  ngOnInit() {
    console.log('LayersPanelComponent initialized');
    this.mapService.mapContext$.subscribe(context => {
      if (context) {
        console.log('LayersPanelComponent: mapContext$ event received');
        this.context = context;
        this.layers = this.context?.layers;
        console.log('Context after initialization:', this.context);
        console.log('Layers:', this.layers);
      }
    });

    this.mapService.map$.subscribe(map => {
      if (map) {
        console.log('LayersPanelComponent: map$ event received');
        this.map = map;
        console.log('Map after initialization:', this.map);
      }
    });
  }
}
