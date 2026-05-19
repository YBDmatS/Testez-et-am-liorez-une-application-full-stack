import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';
import { Teacher } from 'src/app/core/models/teacher.interface';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { FormComponent } from './form.component';

const mockTeachers: Teacher[] = [
  { id: 1, firstName: 'John', lastName: 'Smith', createdAt: new Date(), updatedAt: new Date() },
];

const mockSession: Session = {
  id: 1,
  name: 'Morning Yoga',
  description: 'A relaxing morning session',
  date: new Date('2026-06-01'),
  teacher_id: 1,
  users: [],
};

const mockActivatedRoute = {
  snapshot: { paramMap: { get: jest.fn().mockReturnValue(null) } },
};

const buildFixture = async (): Promise<{
  fixture: ComponentFixture<FormComponent>;
  component: FormComponent;
  sessionApiMock: { create: jest.Mock };
  router: Router;
}> => {
  const sessionApiMock = { create: jest.fn().mockReturnValue(of({})) };
  const teacherServiceMock = { all: jest.fn().mockReturnValue(of(mockTeachers)) };
  const sessionServiceMock = {
    sessionInformation: {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      admin: true,
    },
  };
  const snackBarMock = { open: jest.fn() };

  TestBed.configureTestingModule({
    imports: [FormComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: SessionApiService, useValue: sessionApiMock },
      { provide: TeacherService, useValue: teacherServiceMock },
      { provide: SessionService, useValue: sessionServiceMock },
    ],
  });
  TestBed.overrideProvider(MatSnackBar, { useValue: snackBarMock });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(FormComponent);
  fixture.detectChanges();
  const router = TestBed.inject(Router);

  return { fixture, component: fixture.componentInstance, sessionApiMock, router };
};

const buildUpdateFixture = async (): Promise<{
  fixture: ComponentFixture<FormComponent>;
  component: FormComponent;
  sessionApiMock: { detail: jest.Mock; update: jest.Mock };
  routerMock: { navigate: jest.Mock; url: string };
  snackBarMock: { open: jest.Mock };
}> => {
  const routerMock = { navigate: jest.fn(), url: '/sessions/update/1' };
  const sessionApiMock = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    update: jest.fn().mockReturnValue(of({})),
  };
  const teacherServiceMock = { all: jest.fn().mockReturnValue(of(mockTeachers)) };
  const sessionServiceMock = {
    sessionInformation: {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      admin: true,
    },
  };
  const snackBarMock = { open: jest.fn() };
  const activatedRouteMock = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
  };

  TestBed.configureTestingModule({
    imports: [FormComponent, BrowserAnimationsModule],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRouteMock },
      { provide: SessionApiService, useValue: sessionApiMock },
      { provide: TeacherService, useValue: teacherServiceMock },
      { provide: SessionService, useValue: sessionServiceMock },
      { provide: Router, useValue: routerMock },
    ],
  });
  TestBed.overrideProvider(MatSnackBar, { useValue: snackBarMock });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(FormComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, sessionApiMock, routerMock, snackBarMock };
};

describe('FormComponent', () => {
  describe('Unit tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should set onUpdate to false when URL does not contain "update"', async () => {
      const { component } = await buildFixture();
      expect(component.onUpdate).toBe(false);
    });

    it('should be invalid when name is empty', async () => {
      const { component } = await buildFixture();
      component.sessionForm!.setValue({ name: '', date: '2026-06-01', teacher_id: 1, description: 'desc' });
      expect(component.sessionForm!.invalid).toBeTruthy();
    });

    it('should be invalid when date is empty', async () => {
      const { component } = await buildFixture();
      component.sessionForm!.setValue({ name: 'Yoga', date: '', teacher_id: 1, description: 'desc' });
      expect(component.sessionForm!.invalid).toBeTruthy();
    });

    it('should be invalid when teacher_id is empty', async () => {
      const { component } = await buildFixture();
      component.sessionForm!.setValue({ name: 'Yoga', date: '2026-06-01', teacher_id: '', description: 'desc' });
      expect(component.sessionForm!.invalid).toBeTruthy();
    });

    it('should be invalid when description is empty', async () => {
      const { component } = await buildFixture();
      component.sessionForm!.setValue({ name: 'Yoga', date: '2026-06-01', teacher_id: 1, description: '' });
      expect(component.sessionForm!.invalid).toBeTruthy();
    });

    it('should be valid when all fields are correctly filled', async () => {
      const { component } = await buildFixture();
      component.sessionForm!.setValue({ name: 'Yoga', date: '2026-06-01', teacher_id: 1, description: 'A session' });
      expect(component.sessionForm!.valid).toBeTruthy();
    });

    it('should set onUpdate to true when URL contains "update"', async () => {
      const { component } = await buildUpdateFixture();
      expect(component.onUpdate).toBe(true);
    });

    it('should pre-fill the form with session data in update mode', async () => {
      const { component } = await buildUpdateFixture();
      expect(component.sessionForm!.value).toEqual({
        name: mockSession.name,
        date: '2026-06-01',
        teacher_id: mockSession.teacher_id,
        description: mockSession.description,
      });
    });

    it('should call sessionApiService.update() with sessionId and form values on submit', async () => {
      const { component, sessionApiMock } = await buildUpdateFixture();
      component.submit();
      expect(sessionApiMock.update).toHaveBeenCalledWith('1', {
        name: mockSession.name,
        date: '2026-06-01',
        teacher_id: mockSession.teacher_id,
        description: mockSession.description,
      });
    });

    it('should open snack bar with "Session updated !" after update', async () => {
      const { component, snackBarMock } = await buildUpdateFixture();
      component.submit();
      expect(snackBarMock.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    });

    it('should navigate to sessions after update', async () => {
      const { component, routerMock } = await buildUpdateFixture();
      component.submit();
      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should be invalid when a required field is cleared in update mode', async () => {
      const { component } = await buildUpdateFixture();
      component.sessionForm!.patchValue({ name: '' });
      expect(component.sessionForm!.invalid).toBeTruthy();
    });
  });

  describe('Integration tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should create', async () => {
      const { fixture } = await buildFixture();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should display "Create session" title', async () => {
      const { fixture } = await buildFixture();
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain('Create session');
    });

    it('should disable Save button when form is invalid', async () => {
      const { fixture } = await buildFixture();
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeTruthy();
    });

    it('should enable Save button when all fields are valid', async () => {
      const { fixture, component } = await buildFixture();
      component.sessionForm!.setValue({ name: 'Yoga', date: '2026-06-01', teacher_id: 1, description: 'A session' });
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeFalsy();
    });

    it('should call sessionApiService.create() and navigate to sessions on valid form submission', async () => {
      const { fixture, component, sessionApiMock, router } = await buildFixture();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);

      component.sessionForm!.setValue({
        name: 'Morning Yoga',
        date: '2026-06-01',
        teacher_id: 1,
        description: 'A relaxing session',
      });
      fixture.detectChanges();
      component.submit();

      expect(sessionApiMock.create).toHaveBeenCalledWith({
        name: 'Morning Yoga',
        date: '2026-06-01',
        teacher_id: 1,
        description: 'A relaxing session',
      });
      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should display "Update session" title in update mode', async () => {
      const { fixture } = await buildUpdateFixture();
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain('Update session');
    });

    it('should enable Save button when form is pre-filled with valid data', async () => {
      const { fixture } = await buildUpdateFixture();
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeFalsy();
    });

    it('should disable Save button when a required field is cleared in update mode', async () => {
      const { fixture, component } = await buildUpdateFixture();
      component.sessionForm!.patchValue({ name: '' });
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeTruthy();
    });

    it('should call sessionApiService.update() and navigate to sessions on valid form submission in update mode', async () => {
      const { component, sessionApiMock, routerMock } = await buildUpdateFixture();
      component.submit();

      expect(sessionApiMock.update).toHaveBeenCalledWith('1', {
        name: mockSession.name,
        date: '2026-06-01',
        teacher_id: mockSession.teacher_id,
        description: mockSession.description,
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });
});
