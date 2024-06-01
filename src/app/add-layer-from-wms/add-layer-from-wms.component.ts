import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WmsEndpoint, WmsLayerSummary } from "@camptocamp/ogc-client";
import { debounceTime, Subject } from "rxjs";
import { MapContext, MapContextLayer, computeMapContextDiff } from "@geospatial-sdk/core";
import { MapService } from "../map-context/map-context.service";
import { applyContextDiffToMap } from "@geospatial-sdk/openlayers";
import Map from 'ol/Map';
import { NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-add-layer-from-wms',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    NgIf,
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './add-layer-from-wms.component.html',
  styleUrls: ['./add-layer-from-wms.component.css']
})
export class AddLayerFromWmsComponent implements OnInit {
  wmsUrl = '';
  loading = false;
  layers: WmsLayerSummary[] = [];
  wmsEndpoint: WmsEndpoint | null = null;
  urlChange = new Subject<string>();
  errorMessage: string | null = null;
  context: MapContext | null = null;
  map: Map | null = null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mapService: MapService
  ) {}

  ngOnInit() {
    console.log('AddLayerFromWmsComponent initialized');
    this.urlChange.pipe(debounceTime(700)).subscribe(() => this.loadLayers());

    this.mapService.mapContext$.subscribe(context => {
      if (context) {
        console.log('AddLayerFromWmsComponent: mapContext$ event received');
        this.context = context;
        console.log('Context after initialization:', this.context);
      }
    });

    this.mapService.map$.subscribe(map => {
      if (map) {
        console.log('AddLayerFromWmsComponent: map$ event received');
        this.map = map;
        console.log('Map after initialization:', this.map);
      }
    });
  }

  async loadLayers() {
    console.log('Loading layers...');
    console.log('Current context:', this.context);
    console.log('Current map:', this.map);
    this.errorMessage = null;
    try {
      this.loading = true;

      if (this.wmsUrl.trim() === '') {
        this.layers = [];
        return;
      }

      this.wmsEndpoint = await new WmsEndpoint(this.wmsUrl).isReady();
      this.layers = this.wmsEndpoint.getLayers();
    } catch (error) {
      const err = error as Error;
      this.layers = [];
      this.errorMessage = 'Error loading layers: ' + err.message;
    } finally {
      this.loading = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  addLayer(layer: WmsLayerSummary) {
    console.log('Adding layer...');
    const layerToAdd: MapContextLayer = {
      name: layer.name || '',
      url: this.wmsUrl,
      type: 'wms'
    };
    if (this.context && this.map) {  // Ensure context and map are not null
      const newContext = { ...this.context, layers: [...this.context.layers] };
      newContext.layers.push(layerToAdd);
      console.log('New context with added layer:', newContext);
      applyContextDiffToMap(this.map, computeMapContextDiff(newContext, this.context));
    }
  }
}
