import { Component, OnInit } from '@angular/core';
import { MapService } from "../map-context/map-context.service";
import { MapContext } from "@geospatial-sdk/core";
import { MapContextLayer } from "@geospatial-sdk/core";
import { MatIcon } from "@angular/material/icon";
import { NgForOf, NgIf } from "@angular/common";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { AddLayerFromWmsComponent } from "../add-layer-from-wms/add-layer-from-wms.component";
import { MatTooltip } from "@angular/material/tooltip";
import { MapContextLayerWms } from "@geospatial-sdk/core";

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
export class LayersPanelComponent {
  layers: MapContextLayer[] | undefined;
  context: MapContext | null = null;
  isAddLayersMinimized = true;
  isLayersListMinimized = true;

  constructor(private mapService: MapService) {}

  toggleAddLayers() {
    this.isAddLayersMinimized = !this.isAddLayersMinimized;
  }

  toggleLayersList() {
    this.isLayersListMinimized = !this.isLayersListMinimized;
  }

  hasNameProperty(layer: MapContextLayer): layer is MapContextLayerWms {
    return 'name' in layer;
  }
}
