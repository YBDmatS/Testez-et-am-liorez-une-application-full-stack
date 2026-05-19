import { expect } from '@jest/globals';
import { firstValueFrom } from 'rxjs';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { SessionService } from './session.service';

const mockSessionInfo: SessionInformation = {
  token: 'mock-token',
  type: 'Bearer',
  id: 1,
  username: 'user@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
  });

  it('should have isLogged set to false by default', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should have sessionInformation undefined by default', () => {
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit false via $isLogged() by default', async () => {
    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(false);
  });

  it('should set sessionInformation on logIn()', () => {
    service.logIn(mockSessionInfo);
    expect(service.sessionInformation).toEqual(mockSessionInfo);
  });

  it('should set isLogged to true on logIn()', () => {
    service.logIn(mockSessionInfo);
    expect(service.isLogged).toBe(true);
  });

  it('should emit true via $isLogged() after logIn()', async () => {
    service.logIn(mockSessionInfo);
    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(true);
  });

  it('should clear sessionInformation on logOut()', () => {
    service.logIn(mockSessionInfo);
    service.logOut();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should set isLogged to false on logOut()', () => {
    service.logIn(mockSessionInfo);
    service.logOut();
    expect(service.isLogged).toBe(false);
  });

  it('should emit false via $isLogged() after logOut()', async () => {
    service.logIn(mockSessionInfo);
    service.logOut();
    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(false);
  });
});
