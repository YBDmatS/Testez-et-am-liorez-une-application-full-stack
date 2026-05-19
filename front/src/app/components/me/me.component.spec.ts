import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { User } from 'src/app/core/models/user.interface';
import { SessionService } from 'src/app/core/service/session.service';
import { UserService } from 'src/app/core/service/user.service';
import { MeComponent } from './me.component';

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

const mockAdminUser: User = { ...mockUser, admin: true };

const buildFixture = async (
  admin: boolean,
): Promise<{
  fixture: ComponentFixture<MeComponent>;
  component: MeComponent;
  userServiceMock: { getById: jest.Mock; delete: jest.Mock };
  sessionServiceMock: { sessionInformation: { id: number; admin: boolean }; logOut: jest.Mock };
  routerMock: { navigate: jest.Mock };
  snackBarMock: { open: jest.Mock };
}> => {
  const user = admin ? mockAdminUser : mockUser;
  const userServiceMock = {
    getById: jest.fn().mockReturnValue(of(user)),
    delete: jest.fn().mockReturnValue(of(undefined)),
  };
  const sessionServiceMock = {
    sessionInformation: { id: 1, admin },
    logOut: jest.fn(),
  };
  const routerMock = { navigate: jest.fn() };
  const snackBarMock = { open: jest.fn() };

  TestBed.configureTestingModule({
    imports: [MeComponent, BrowserAnimationsModule],
    providers: [
      { provide: UserService, useValue: userServiceMock },
      { provide: SessionService, useValue: sessionServiceMock },
      { provide: Router, useValue: routerMock },
    ],
  });
  TestBed.overrideProvider(MatSnackBar, { useValue: snackBarMock });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(MeComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, userServiceMock, sessionServiceMock, routerMock, snackBarMock };
};

describe('MeComponent', () => {
  describe('Unit tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should initialize user$ by calling userService.getById with the session user id', async () => {
      const { userServiceMock } = await buildFixture(false);
      expect(userServiceMock.getById).toHaveBeenCalledWith('1');
    });

    it('should call userService.delete() with the user id on delete()', async () => {
      const { component, userServiceMock } = await buildFixture(false);
      component.delete();
      expect(userServiceMock.delete).toHaveBeenCalledWith('1');
    });

    it('should open snack bar with "Your account has been deleted !" after delete()', async () => {
      const { component, snackBarMock } = await buildFixture(false);
      component.delete();
      expect(snackBarMock.open).toHaveBeenCalledWith('Your account has been deleted !', 'Close', { duration: 3000 });
    });

    it('should call sessionService.logOut() after delete()', async () => {
      const { component, sessionServiceMock } = await buildFixture(false);
      component.delete();
      expect(sessionServiceMock.logOut).toHaveBeenCalled();
    });

    it('should navigate to "/" after delete()', async () => {
      const { component, routerMock } = await buildFixture(false);
      component.delete();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Integration tests', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('should create', async () => {
      const { fixture } = await buildFixture(false);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should display user name and email', async () => {
      const { fixture } = await buildFixture(false);
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain(mockUser.firstName);
      expect(content).toContain(mockUser.lastName.toUpperCase());
      expect(content).toContain(mockUser.email);
    });

    it('should display "You are admin" when user is admin', async () => {
      const { fixture } = await buildFixture(true);
      const content = fixture.nativeElement.textContent as string;
      expect(content).toContain('You are admin');
    });

    it('should show Delete button for non-admin and hide it for admin', async () => {
      const { fixture } = await buildFixture(false);
      const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]') as HTMLButtonElement;
      expect(deleteButton).toBeTruthy();

      TestBed.resetTestingModule();
      const { fixture: adminFixture } = await buildFixture(true);
      const deleteButtonAdmin = adminFixture.nativeElement.querySelector('button[color="warn"]');
      expect(deleteButtonAdmin).toBeNull();
    });

    it('should call userService.delete() and navigate to "/" when Delete button is clicked', async () => {
      const { fixture, userServiceMock, routerMock } = await buildFixture(false);
      const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]') as HTMLButtonElement;
      deleteButton.click();
      expect(userServiceMock.delete).toHaveBeenCalledWith('1');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});

describe('MeComponent – additional unit tests', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should call globalThis.history.back() on back()', async () => {
    const { component } = await buildFixture(false);
    const historySpy = jest.spyOn(globalThis.history, 'back').mockImplementation(() => {});
    component.back();
    expect(historySpy).toHaveBeenCalled();
    historySpy.mockRestore();
  });
});
