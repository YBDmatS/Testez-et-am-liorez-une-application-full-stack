import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { AuthService } from './core/service/auth.service';
import { SessionService } from './core/service/session.service';
import { AppComponent } from './app.component';

const buildFixture = async (
  isLogged: boolean,
): Promise<{
  fixture: ComponentFixture<AppComponent>;
  component: AppComponent;
  sessionServiceMock: { $isLogged: jest.Mock; logOut: jest.Mock };
  router: Router;
}> => {
  const sessionServiceMock = {
    $isLogged: jest.fn().mockReturnValue(of(isLogged)),
    logOut: jest.fn(),
  };
  const authServiceMock = {};

  await TestBed.configureTestingModule({
    imports: [AppComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: SessionService, useValue: sessionServiceMock },
      { provide: AuthService, useValue: authServiceMock },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  const router = TestBed.inject(Router);

  return { fixture, component: fixture.componentInstance, sessionServiceMock, router };
};

describe('AppComponent', () => {
  describe('Unit tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should delegate $isLogged() to sessionService.$isLogged()', async () => {
      const { component, sessionServiceMock } = await buildFixture(true);
      component.$isLogged();
      expect(sessionServiceMock.$isLogged).toHaveBeenCalled();
    });

    it('should call sessionService.logOut() on logout()', async () => {
      const { component, sessionServiceMock } = await buildFixture(true);
      jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      component.logout();
      expect(sessionServiceMock.logOut).toHaveBeenCalled();
    });

    it('should navigate to [""] on logout()', async () => {
      const { component, router } = await buildFixture(true);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('Integration tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should create', async () => {
      const { fixture } = await buildFixture(false);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should show Logout button when user is logged in', async () => {
      const { fixture } = await buildFixture(true);
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain('Logout');
    });

    it('should show Login and Register links when user is not logged in', async () => {
      const { fixture } = await buildFixture(false);
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain('Login');
      expect(content).toContain('Register');
    });

    it('should call sessionService.logOut() and navigate to [""] when Logout button is clicked', async () => {
      const { fixture, sessionServiceMock, router } = await buildFixture(true);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      const logoutButton = fixture.nativeElement.querySelector('button.link') as HTMLButtonElement;
      logoutButton.click();
      expect(sessionServiceMock.logOut).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
});
