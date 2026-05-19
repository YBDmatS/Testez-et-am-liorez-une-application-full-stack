import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { Teacher } from 'src/app/core/models/teacher.interface';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { FormComponent } from './form.component';

const mockTeachers: Teacher[] = [
  { id: 1, firstName: 'John', lastName: 'Smith', createdAt: new Date(), updatedAt: new Date() },
];

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
  });
});
