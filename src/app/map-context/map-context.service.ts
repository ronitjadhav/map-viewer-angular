import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapContext } from '@geospatial-sdk/core';

const INITIAL_CONTEXT: MapContext = {
  layers: [
    {
      type: 'xyz',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  ],
  view: {
    zoom: 5,
    center: [6, 48.5]
  }
}




@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapContextSubject = new BehaviorSubject<MapContext>(INITIAL_CONTEXT);
  // private mapSubject = new BehaviorSubject<any | null>(null);
  mapContext$ = this.mapContextSubject.asObservable();
  // map$ = this.mapSubject.asObservable();

  setMapContext(context: MapContext): void {
    this.mapContextSubject.next(context);
  }

  // setMap(map: any): void {
  //   this.mapSubject.next(map);
  // }
}
