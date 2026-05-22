import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/core/service/session.service';
import { customJwtInterceptorFn } from './customJwtInterceptorFn';

describe('customJwtInterceptorFn', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should add Authorization header when user is logged in', () => {
    const sessionServiceMock = {
      isLogged: true,
      sessionInformation: { token: 'mock-token' },
    };

    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: sessionServiceMock }],
    });

    TestBed.runInInjectionContext(() => {
      const request = new HttpRequest('GET', '/api/test');
      const next = jest.fn().mockReturnValue(of(new HttpResponse()));
      customJwtInterceptorFn(request, next as any);
      const intercepted = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(intercepted.headers.get('Authorization')).toBe('Bearer mock-token');
    });
  });

  it('should pass the request without Authorization header when user is not logged in', () => {
    const sessionServiceMock = { isLogged: false, sessionInformation: undefined };

    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: sessionServiceMock }],
    });

    TestBed.runInInjectionContext(() => {
      const request = new HttpRequest('GET', '/api/test');
      const next = jest.fn().mockReturnValue(of(new HttpResponse()));
      customJwtInterceptorFn(request, next as any);
      const intercepted = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(intercepted.headers.has('Authorization')).toBe(false);
    });
  });
});
