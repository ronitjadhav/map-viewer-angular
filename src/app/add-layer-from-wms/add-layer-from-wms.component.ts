import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WmsEndpoint, WmsLayerSummary } from "@camptocamp/ogc-client";
import {debounceTime, Subject, take} from "rxjs";
import { MapContext, MapContextLayer, computeMapContextDiff } from "@geospatial-sdk/core";
import { MapService } from "../map-context/map-context.service";
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
  // context: MapContext | null = null;
  // map: any | null = null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mapService: MapService
  ) {}

  ngOnInit() {
    console.log('AddLayerFromWmsComponent initialized');
    this.urlChange.pipe(debounceTime(700)).subscribe(() => this.loadLayers());

    // this.mapService.mapContext$.subscribe(context => {
    //   if (context) {
    //     this.context = context;
    //   }
    // });

    // this.mapService.map$.subscribe(map => {
    //   if (map) {
    //     this.map = map;
    //   }
    // });
  }

  async loadLayers() {
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
    this.mapService.mapContext$.pipe(
      take(1)
    ).subscribe(context => {
      const newContext = { ...context, layers: [...context.layers, layerToAdd] };
      // newContext.layers.push(layerToAdd);
      // applyContextDiffToMap(this.map, computeMapContextDiff(newContext, this.context));
      this.mapService.setMapContext(newContext);
    })

    // could also do
    // const context = await firstValueFrom(this.mapService.mapContext$)

    // if (this.context && this.map) {  // Ensure context and map are not null
    //   const newContext = { ...this.context, layers: [...this.context.layers] };
    //   newContext.layers.push(layerToAdd);
    //   applyContextDiffToMap(this.map, computeMapContextDiff(newContext, this.context));
    //   this.mapService.setMapContext(newContext);
    // }
  }
}
