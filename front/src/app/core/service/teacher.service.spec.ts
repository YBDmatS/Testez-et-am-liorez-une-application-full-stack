import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Teacher } from 'src/app/core/models/teacher.interface';
import { TeacherService } from './teacher.service';

const mockTeachers: Teacher[] = [
  { id: 1, firstName: 'John', lastName: 'Smith', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 2, firstName: 'Jane', lastName: 'Doe', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
];

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should send a GET to api/teacher and return the list of teachers', () => {
    let result: Teacher[] | undefined;
    service.all().subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
    expect(result).toEqual(mockTeachers);
  });

  it('should send a GET to api/teacher/:id and return the teacher', () => {
    let result: Teacher | undefined;
    service.detail('1').subscribe((res) => (result = res));
    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers[0]);
    expect(result).toEqual(mockTeachers[0]);
  });
});
