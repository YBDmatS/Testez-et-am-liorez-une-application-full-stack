import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { Teacher } from 'src/app/core/models/teacher.interface';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { DetailComponent } from './detail.component';

const mockSession: Session = {
  id: 1,
  name: 'Morning Yoga',
  description: 'A relaxing morning session',
  date: new Date('2026-06-01'),
  teacher_id: 1,
  users: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-15'),
};

const mockTeacher: Teacher = {
  id: 1,
  firstName: 'John',
  lastName: 'Smith',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockActivatedRoute = {
  snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
};

const buildFixture = async (
  admin: boolean,
): Promise<{
  fixture: ComponentFixture<DetailComponent>;
  component: DetailComponent;
  sessionApiMock: { detail: jest.Mock; delete: jest.Mock };
  routerMock: { navigate: jest.Mock };
  snackBarMock: { open: jest.Mock };
}> => {
  const sessionApiMock = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of(undefined)),
    participate: jest.fn().mockReturnValue(of(undefined)),
    unParticipate: jest.fn().mockReturnValue(of(undefined)),
  };
  const teacherServiceMock = { detail: jest.fn().mockReturnValue(of(mockTeacher)) };
  const sessionServiceMock: { sessionInformation: SessionInformation } = {
    sessionInformation: {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: admin ? 'admin@test.com' : 'user@test.com',
      firstName: 'Test',
      lastName: 'User',
      admin,
    },
  };
  const snackBarMock = { open: jest.fn() };
  const routerMock = { navigate: jest.fn() };

  TestBed.configureTestingModule({
    imports: [DetailComponent, BrowserAnimationsModule],
    providers: [
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: SessionApiService, useValue: sessionApiMock },
      { provide: TeacherService, useValue: teacherServiceMock },
      { provide: SessionService, useValue: sessionServiceMock },
      { provide: Router, useValue: routerMock },
    ],
  });
  TestBed.overrideProvider(MatSnackBar, { useValue: snackBarMock });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(DetailComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, sessionApiMock, routerMock, snackBarMock };
};

describe('DetailComponent', () => {
  describe('Unit tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should set isAdmin to true when sessionInformation.admin is true', async () => {
      const { component } = await buildFixture(true);
      expect(component.isAdmin).toBe(true);
    });

    it('should set isAdmin to false when sessionInformation.admin is false', async () => {
      const { component } = await buildFixture(false);
      expect(component.isAdmin).toBe(false);
    });

    it('should initialize sessionId from route params', async () => {
      const { component } = await buildFixture(true);
      expect(component.sessionId).toBe('1');
    });

    it('should call sessionApiService.delete() with sessionId on delete()', async () => {
      const { component, sessionApiMock } = await buildFixture(true);
      component.delete();
      expect(sessionApiMock.delete).toHaveBeenCalledWith('1');
    });

    it('should open snack bar with "Session deleted !" after delete()', async () => {
      const { component, snackBarMock } = await buildFixture(true);
      component.delete();
      expect(snackBarMock.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    });

    it('should navigate to sessions after delete()', async () => {
      const { component, routerMock } = await buildFixture(true);
      component.delete();
      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('Integration tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should create', async () => {
      const { fixture } = await buildFixture(true);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should display session name and description', async () => {
      const { fixture } = await buildFixture(true);
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain('Morning Yoga');
      expect(content).toContain('A relaxing morning session');
    });

    it('should display teacher name', async () => {
      const { fixture } = await buildFixture(true);
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain(mockTeacher.firstName);
      expect(content).toContain(mockTeacher.lastName.toUpperCase());
    });

    it('should show Delete button when user is admin', async () => {
      const { fixture } = await buildFixture(true);
      const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]') as HTMLButtonElement;
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.textContent).toContain('Delete');
    });

    it('should hide Delete button and show Participate button when user is not admin', async () => {
      const { fixture } = await buildFixture(false);
      const content = fixture.nativeElement.textContent as string;
      expect(content).not.toContain('Delete');
      expect(content).toContain('Participate');
    });

    it('should navigate to sessions when Delete button is clicked', async () => {
      const { fixture, routerMock } = await buildFixture(true);
      const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]') as HTMLButtonElement;
      deleteButton.click();
      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should open snack bar with "Session deleted !" when Delete button is clicked', async () => {
      const { fixture, snackBarMock } = await buildFixture(true);
      const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]') as HTMLButtonElement;
      deleteButton.click();
      expect(snackBarMock.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    });
  });
});
