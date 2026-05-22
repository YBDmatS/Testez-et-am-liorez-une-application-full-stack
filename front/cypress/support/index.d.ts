declare namespace Cypress {
  interface Chainable {
    loginAsAdmin(sessions?: unknown[]): void;
    loginAsUser(sessions?: unknown[]): void;
  }
}
