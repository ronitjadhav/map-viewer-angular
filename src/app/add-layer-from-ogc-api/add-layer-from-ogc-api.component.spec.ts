import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLayerFromOgcApiComponent } from './add-layer-from-ogc-api.component';

describe('AddLayerFromOgcApiComponent', () => {
  let component: AddLayerFromOgcApiComponent;
  let fixture: ComponentFixture<AddLayerFromOgcApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLayerFromOgcApiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLayerFromOgcApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
