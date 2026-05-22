Cypress.Commands.add('loginAsAdmin', (sessions: unknown[] = []) => {
  cy.intercept('POST', '/api/auth/login', { fixture: 'session-admin-info.json' });
  cy.intercept('GET', '/api/session', sessions);
  cy.visit('/login');
  cy.get('[data-cy="login-email"]').type('yoga@studio.com');
  cy.get('[data-cy="login-password"]').type('test!1234');
  cy.get('[data-cy="login-submit"]').click();
  cy.url().should('include', '/sessions');
});

Cypress.Commands.add('loginAsUser', (sessions: unknown[] = []) => {
  cy.intercept('POST', '/api/auth/login', { fixture: 'session-user-info.json' });
  cy.intercept('GET', '/api/session', sessions);
  cy.visit('/login');
  cy.get('[data-cy="login-email"]').type('user@studio.com');
  cy.get('[data-cy="login-password"]').type('test!1234');
  cy.get('[data-cy="login-submit"]').click();
  cy.url().should('include', '/sessions');
});
