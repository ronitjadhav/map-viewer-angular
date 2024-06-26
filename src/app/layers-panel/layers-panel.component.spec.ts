import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersPanelComponent } from './layers-panel.component';

describe('LayersPanelComponent', () => {
  let component: LayersPanelComponent;
  let fixture: ComponentFixture<LayersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
