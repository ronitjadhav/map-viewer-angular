import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapContext } from '@geospatial-sdk/core';
import { Map as OlMap } from 'ol';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapContextSubject = new BehaviorSubject<MapContext | null>(null);
  private mapSubject = new BehaviorSubject<OlMap | null>(null);
  mapContext$ = this.mapContextSubject.asObservable();
  map$ = this.mapSubject.asObservable();

  setMapContext(context: MapContext): void {
    console.log('Setting map context:', context);
    this.mapContextSubject.next(context);
  }

  getMapContext(): MapContext | null {
    return this.mapContextSubject.value;
  }

  setMap(map: OlMap): void {
    console.log('Setting map:', map);
    this.mapSubject.next(map);
  }

  getMap(): OlMap | null {
    return this.mapSubject.value;
  }
}
