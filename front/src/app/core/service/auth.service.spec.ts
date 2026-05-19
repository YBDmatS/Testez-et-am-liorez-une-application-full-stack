import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { LoginRequest } from 'src/app/core/models/loginRequest.interface';
import { RegisterRequest } from 'src/app/core/models/registerRequest.interface';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { AuthService } from './auth.service';

const mockRegisterRequest: RegisterRequest = {
  email: 'john.doe@test.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123',
};

const mockLoginRequest: LoginRequest = {
  email: 'john.doe@test.com',
  password: 'password123',
};

const mockSessionInfo: SessionInformation = {
  token: 'mock-token',
  type: 'Bearer',
  id: 1,
  username: 'john.doe@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST to /api/auth/register with the register request body', () => {
    service.register(mockRegisterRequest).subscribe();
    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null);
  });

  it('should send a POST to /api/auth/login and return SessionInformation', () => {
    let result: SessionInformation | undefined;
    service.login(mockLoginRequest).subscribe((res) => (result = res));
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionInfo);
    expect(result).toEqual(mockSessionInfo);
  });
});
