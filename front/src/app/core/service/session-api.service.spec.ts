import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Session } from 'src/app/core/models/session.interface';
import { SessionApiService } from './session-api.service';

const mockSession: Session = {
  id: 1,
  name: 'Morning Yoga',
  description: 'A relaxing morning session',
  date: new Date('2026-06-01'),
  teacher_id: 1,
  users: [],
};

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should send a GET to api/session and return the list of sessions', () => {
    let result: Session[] | undefined;
    service.all().subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush([mockSession]);
    expect(result).toEqual([mockSession]);
  });

  it('should send a GET to api/session/:id and return the session', () => {
    let result: Session | undefined;
    service.detail('1').subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
    expect(result).toEqual(mockSession);
  });

  it('should send a DELETE to api/session/:id', () => {
    service.delete('1').subscribe();
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should send a POST to api/session and return the created session', () => {
    let result: Session | undefined;
    service.create(mockSession).subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
    expect(result).toEqual(mockSession);
  });

  it('should send a PUT to api/session/:id and return the updated session', () => {
    let result: Session | undefined;
    service.update('1', mockSession).subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
    expect(result).toEqual(mockSession);
  });

  it('should send a POST to api/session/:id/participate/:userId', () => {
    service.participate('1', '2').subscribe();
    const req = httpMock.expectOne('api/session/1/participate/2');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should send a DELETE to api/session/:id/participate/:userId', () => {
    service.unParticipate('1', '2').subscribe();
    const req = httpMock.expectOne('api/session/1/participate/2');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
