import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapContext } from '@geospatial-sdk/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapContextSubject = new BehaviorSubject<MapContext | null>(null);
  private mapSubject = new BehaviorSubject<any | null>(null);
  mapContext$ = this.mapContextSubject.asObservable();
  map$ = this.mapSubject.asObservable();

  setMapContext(context: MapContext): void {
    this.mapContextSubject.next(context);
  }

  setMap(map: any): void {
    this.mapSubject.next(map);
  }
}
