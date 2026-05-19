import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { User } from 'src/app/core/models/user.interface';
import { UserService } from './user.service';

const mockUser: User = {
  id: 1,
  email: 'john.doe@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
  password: 'password',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-06-01'),
};

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET to api/user/:id and return the user', () => {
    let result: User | undefined;
    service.getById('1').subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should send a DELETE to api/user/:id', () => {
    service.delete('1').subscribe();
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
