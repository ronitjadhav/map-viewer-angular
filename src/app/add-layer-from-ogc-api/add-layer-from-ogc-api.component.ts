import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OgcApiEndpoint, WmsLayerSummary} from "@camptocamp/ogc-client";
import {debounceTime, Subject, take} from "rxjs";
import {MapService} from "@geospatial-sdk/core";
import {MapContextLayer} from "@geospatial-sdk/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatTooltip} from "@angular/material/tooltip";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-layer-from-ogc-api',
  standalone: true,
  imports: [
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatTooltip,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet
  ],
  templateUrl: './add-layer-from-ogc-api.component.html',
  styleUrl: './add-layer-from-ogc-api.component.css'
})
export class AddLayerFromOgcApiComponent implements OnInit {
  ogcUrl = '';
  loading = false;
  layers: string[] = [];
  urlChange = new Subject<string>();
  errorMessage: string | null = null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mapService: MapService
  ) {}

  ngOnInit() {
    console.log('AddLayerFromWmsComponent initialized');
    this.urlChange.pipe(debounceTime(700)).subscribe(() => this.loadLayers());
  }

  async loadLayers() {
    this.errorMessage = null;
    try {
      this.loading = true;

      if (this.ogcUrl.trim() === '') {
        this.layers = [];
        return;
      }

      const ogcEndpoint = await new OgcApiEndpoint(this.ogcUrl)
      this.layers = await ogcEndpoint.featureCollections;
    } catch (error) {
      const err = error as Error;
      this.layers = [];
      this.errorMessage = 'Error loading layers: ' + err.message;
    } finally {
      this.loading = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  async addLayer(layer: any ) {
    const ogcEndpoint = await new OgcApiEndpoint(this.ogcUrl)
    let layerUrl: string
    layerUrl = await ogcEndpoint.getCollectionItemsUrl(layer, {
      outputFormat: 'json',
    })

    const layerToAdd: MapContextLayer = {
      name: layer.name || '',
      url: layerUrl,
      type: 'ogcapi',
      layerType: 'feature',
    };
    this.mapService.mapContext$.pipe(
      take(1)
    ).subscribe(context => {
      const newContext = {...context, layers: [...context.layers, layerToAdd]};

      this.mapService.setMapContext(newContext);
    })

  }
}
