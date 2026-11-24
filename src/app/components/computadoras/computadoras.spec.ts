import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Computadoras } from './computadoras';

describe('Computadoras', () => {
  let component: Computadoras;
  let fixture: ComponentFixture<Computadoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Computadoras],
    }).compileComponents();

    fixture = TestBed.createComponent(Computadoras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
