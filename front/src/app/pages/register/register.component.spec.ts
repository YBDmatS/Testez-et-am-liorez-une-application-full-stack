import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  describe('Unit tests', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceMock: { register: jest.Mock };
    let routerMock: { navigate: jest.Mock };

    beforeEach(async () => {
      authServiceMock = { register: jest.fn() };
      routerMock = { navigate: jest.fn() };

      await TestBed.configureTestingModule({
        imports: [RegisterComponent, BrowserAnimationsModule],
        providers: [
          { provide: AuthService, useValue: authServiceMock },
          { provide: Router, useValue: routerMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be invalid when email is empty', () => {
      component.form.setValue({ email: '', firstName: 'John', lastName: 'Doe', password: 'test123' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when firstName is empty', () => {
      component.form.setValue({ email: 'test@test.com', firstName: '', lastName: 'Doe', password: 'test123' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when lastName is empty', () => {
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: '', password: 'test123' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when password is empty', () => {
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: '' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when email format is incorrect', () => {
      component.form.setValue({ email: 'not-an-email', firstName: 'John', lastName: 'Doe', password: 'test123' });
      expect(component.form.get('email')?.errors?.['email']).toBe(true);
    });

    it('should be valid when all fields are correctly filled', () => {
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'test123' });
      expect(component.form.valid).toBe(true);
    });

    it('should call authService.register with form values on submit', () => {
      authServiceMock.register.mockReturnValue(of(undefined));
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'test123' });
      component.submit();
      expect(authServiceMock.register).toHaveBeenCalledWith({
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'test123',
      });
    });

    it('should navigate to /login on successful registration', () => {
      authServiceMock.register.mockReturnValue(of(undefined));
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'test123' });
      component.submit();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError to true on registration failure', () => {
      authServiceMock.register.mockReturnValue(throwError(() => new Error('Conflict')));
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'test123' });
      component.submit();
      expect(component.onError).toBe(true);
    });
  });

  describe('Integration tests', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceMock: { register: jest.Mock };
    let router: Router;

    beforeEach(async () => {
      authServiceMock = { register: jest.fn() };

      await TestBed.configureTestingModule({
        imports: [RegisterComponent, BrowserAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: AuthService, useValue: authServiceMock },
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(fixture.componentInstance).not.toBeNull();
    });

    it('should disable submit button when form is invalid', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should enable submit button when all fields are valid', () => {
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'test123' });
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });

    it('should display error message when onError is true', () => {
      component.onError = true;
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('.error') as HTMLElement;
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent).toContain('An error occurred');
    });

    it('should not display error message when onError is false', () => {
      component.onError = false;
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('.error');
      expect(errorEl).toBeNull();
    });

    it('should navigate to /login on valid form submission', () => {
      authServiceMock.register.mockReturnValue(of(undefined));
      jest.spyOn(router, 'navigate').mockResolvedValue(true);

      component.form.setValue({ email: 'yoga@studio.com', firstName: 'John', lastName: 'Doe', password: 'test!1234' });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button[type="submit"]').click();

      expect(authServiceMock.register).toHaveBeenCalledWith({
        email: 'yoga@studio.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'test!1234',
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should display error message in DOM after failed submission', () => {
      authServiceMock.register.mockReturnValue(throwError(() => new Error('Conflict')));

      component.form.setValue({ email: 'existing@test.com', firstName: 'John', lastName: 'Doe', password: 'test123' });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.error') as HTMLElement;
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent).toContain('An error occurred');
    });
  });
});
