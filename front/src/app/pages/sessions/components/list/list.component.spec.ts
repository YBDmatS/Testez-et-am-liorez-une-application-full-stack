import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import { ListComponent } from './list.component';

const mockSessions: Session[] = [
  {
    id: 1,
    name: 'Morning Yoga',
    description: 'A relaxing morning session',
    date: new Date('2026-06-01'),
    teacher_id: 1,
    users: [],
  },
  {
    id: 2,
    name: 'Evening Flow',
    description: 'Wind down with yoga',
    date: new Date('2026-06-02'),
    teacher_id: 2,
    users: [],
  },
];

const adminUser: SessionInformation = {
  token: 'token',
  type: 'Bearer',
  id: 1,
  username: 'admin@test.com',
  firstName: 'Admin',
  lastName: 'User',
  admin: true,
};

const regularUser: SessionInformation = {
  token: 'token',
  type: 'Bearer',
  id: 2,
  username: 'user@test.com',
  firstName: 'Regular',
  lastName: 'User',
  admin: false,
};

describe('ListComponent', () => {
  describe('Unit tests', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let sessionApiServiceMock: { all: jest.Mock };
    let sessionServiceMock: { sessionInformation: SessionInformation | undefined };

    beforeEach(async () => {
      sessionApiServiceMock = { all: jest.fn().mockReturnValue(of([])) };
      sessionServiceMock = { sessionInformation: adminUser };

      await TestBed.configureTestingModule({
        imports: [ListComponent, BrowserAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SessionApiService, useValue: sessionApiServiceMock },
          { provide: SessionService, useValue: sessionServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return sessionService.sessionInformation via user getter', () => {
      expect(component.user).toBe(adminUser);
    });

    it('should return undefined via user getter when sessionInformation is not set', () => {
      sessionServiceMock.sessionInformation = undefined;
      expect(component.user).toBeUndefined();
    });

    it('should initialize sessions$ by calling sessionApiService.all()', () => {
      expect(sessionApiServiceMock.all).toHaveBeenCalled();
      expect(component.sessions$).toBeDefined();
    });
  });

  describe('Integration tests', () => {
    let fixture: ComponentFixture<ListComponent>;
    let sessionApiServiceMock: { all: jest.Mock };

    const createComponent = async (user: SessionInformation, sessions: Session[] = mockSessions): Promise<void> => {
      sessionApiServiceMock = { all: jest.fn().mockReturnValue(of(sessions)) };

      await TestBed.configureTestingModule({
        imports: [ListComponent, BrowserAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SessionApiService, useValue: sessionApiServiceMock },
          { provide: SessionService, useValue: { sessionInformation: user } },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ListComponent);
      fixture.detectChanges();
    };

    afterEach(() => TestBed.resetTestingModule());

    it('should create', async () => {
      await createComponent(adminUser);
      expect(fixture.componentInstance).not.toBeNull();
    });

    it('should display one card per session in the list', async () => {
      await createComponent(adminUser);
      const cards = fixture.nativeElement.querySelectorAll('mat-card.item');
      expect(cards.length).toBe(mockSessions.length);
    });

    it('should show Create button when user is admin', async () => {
      await createComponent(adminUser);
      const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
      expect(createButton).not.toBeNull();
    });

    it('should hide Create button when user is not admin', async () => {
      await createComponent(regularUser);
      const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
      expect(createButton).toBeNull();
    });

    it('should show a Detail button for each session regardless of role', async () => {
      await createComponent(regularUser);
      const detailButtons = fixture.nativeElement.querySelectorAll('button mat-icon');
      const searchIcons = Array.from(detailButtons).filter(
        (el) => (el as HTMLElement).textContent?.trim() === 'search',
      );
      expect(searchIcons.length).toBe(mockSessions.length);
    });

    it('should show Edit buttons for admin and hide them for non-admin', async () => {
      await createComponent(adminUser);
      const editIconsAdmin = fixture.nativeElement.querySelectorAll('mat-icon');
      const editAdmin = Array.from(editIconsAdmin).filter(
        (el) => (el as HTMLElement).textContent?.trim() === 'edit',
      );
      expect(editAdmin.length).toBe(mockSessions.length);

      TestBed.resetTestingModule();
      await createComponent(regularUser);
      const editIconsUser = fixture.nativeElement.querySelectorAll('mat-icon');
      const editUser = Array.from(editIconsUser).filter(
        (el) => (el as HTMLElement).textContent?.trim() === 'edit',
      );
      expect(editUser.length).toBe(0);
    });
  });
});
