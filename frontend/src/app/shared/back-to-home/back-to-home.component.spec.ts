import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackToHomeComponent } from './back-to-home.component';
import { Directive, Input } from '@angular/core';
import { By } from '@angular/platform-browser';


@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('BackToHomeComponent', () => {
  let component: BackToHomeComponent;
  let fixture: ComponentFixture<BackToHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackToHomeComponent, RouterLinkDirectiveStub ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackToHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct route for navigate back to home', () => {
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'))
    let routerLink = buttonElement.injector.get(RouterLinkDirectiveStub);
    buttonElement.triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe("''");
  })
});
