import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerMock: { navigate: jest.Mock };
  let sessionServiceMock: { isLogged: boolean };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    sessionServiceMock = { isLogged: false };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should return true when user is logged in', () => {
    sessionServiceMock.isLogged = true;
    expect(guard.canActivate()).toBe(true);
  });

  it('should navigate to login and return false when user is not logged in', () => {
    sessionServiceMock.isLogged = false;
    expect(guard.canActivate()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
  });
});
