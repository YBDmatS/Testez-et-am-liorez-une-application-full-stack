import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { SessionService } from 'src/app/core/service/session.service';
import { AuthService } from '../../core/service/auth.service';
import { LoginComponent } from './login.component';

const mockSessionInfo: SessionInformation = {
  token: 'mock-token',
  type: 'Bearer',
  id: 1,
  username: 'user@test.com',
  firstName: 'First',
  lastName: 'Last',
  admin: false,
};

describe('LoginComponent', () => {
  describe('Unit tests', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: { login: jest.Mock };
    let sessionServiceMock: { logIn: jest.Mock };
    let routerMock: { navigate: jest.Mock };

    beforeEach(async () => {
      authServiceMock = { login: jest.fn() };
      sessionServiceMock = { logIn: jest.fn() };
      routerMock = { navigate: jest.fn() };

      await TestBed.configureTestingModule({
        imports: [LoginComponent, BrowserAnimationsModule],
        providers: [
          { provide: AuthService, useValue: authServiceMock },
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: Router, useValue: routerMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be invalid when email is empty', () => {
      component.form.setValue({ email: '', password: 'test123' });
      expect(component.form.invalid).toBeTruthy();
    });

    it('should be invalid when password is empty', () => {
      component.form.setValue({ email: 'test@test.com', password: '' });
      expect(component.form.invalid).toBeTruthy();
    });

    it('should be invalid when email format is incorrect', () => {
      component.form.setValue({ email: 'not-an-email', password: 'test123' });
      expect(component.form.get('email')?.errors?.['email']).toBeTruthy();
    });

    it('should be valid when both fields are correctly filled', () => {
      component.form.setValue({ email: 'test@test.com', password: 'test123' });
      expect(component.form.valid).toBeTruthy();
    });

    it('should call authService.login with form values on submit', () => {
      authServiceMock.login.mockReturnValue(of(mockSessionInfo));
      component.form.setValue({ email: 'test@test.com', password: 'test123' });
      component.submit();
      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'test123',
      });
    });

    it('should call sessionService.logIn and navigate to /sessions on login success', () => {
      authServiceMock.login.mockReturnValue(of(mockSessionInfo));
      component.form.setValue({ email: 'test@test.com', password: 'test123' });
      component.submit();
      expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSessionInfo);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true on login failure', () => {
      authServiceMock.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
      component.form.setValue({ email: 'test@test.com', password: 'test123' });
      component.submit();
      expect(component.onError).toBeTruthy();
    });

    it('should have hide set to true by default', () => {
      expect(component.hide).toBeTruthy();
    });
  });

  describe('Integration tests', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: { login: jest.Mock };
    let sessionServiceMock: { logIn: jest.Mock };
    let router: Router;

    beforeEach(async () => {
      authServiceMock = { login: jest.fn() };
      sessionServiceMock = { logIn: jest.fn() };

      await TestBed.configureTestingModule({
        imports: [LoginComponent, BrowserAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: AuthService, useValue: authServiceMock },
          { provide: SessionService, useValue: sessionServiceMock },
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement;
      expect(button.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.form.setValue({ email: 'test@test.com', password: 'test123' });
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement;
      expect(button.disabled).toBeFalsy();
    });

    it('should display error message when onError is true', () => {
      component.onError = true;
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('.error') as HTMLElement;
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain('An error occurred');
    });

    it('should not display error message when onError is false', () => {
      component.onError = false;
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('.error');
      expect(errorEl).toBeNull();
    });

    it('should display password as text when hide is false', () => {
      component.hide = false;
      fixture.detectChanges();
      const passwordInput = fixture.nativeElement.querySelector(
        'input[formControlName="password"]',
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe('text');
    });

    it('should call login service and navigate to /sessions on valid form submission', () => {
      authServiceMock.login.mockReturnValue(of(mockSessionInfo));
      jest.spyOn(router, 'navigate').mockResolvedValue(true);

      component.form.setValue({ email: 'yoga@studio.com', password: 'test!1234' });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button[type="submit"]').click();

      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'yoga@studio.com',
        password: 'test!1234',
      });
      expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSessionInfo);
      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    });
  });
});
