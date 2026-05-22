import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { UnauthGuard } from './unauth.guard';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;
  let routerMock: { navigate: jest.Mock };
  let sessionServiceMock: { isLogged: boolean };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    sessionServiceMock = { isLogged: false };

    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });
    guard = TestBed.inject(UnauthGuard);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should return true when user is not logged in', () => {
    sessionServiceMock.isLogged = false;
    expect(guard.canActivate()).toBe(true);
  });

  it('should navigate to rentals and return false when user is logged in', () => {
    sessionServiceMock.isLogged = true;
    expect(guard.canActivate()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rentals']);
  });
});
