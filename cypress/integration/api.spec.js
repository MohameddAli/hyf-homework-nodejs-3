describe('REST API Tests', () => {
  beforeEach(() => {
    // Reset the server state before each test if needed
  });

  it('should return "Hello World" from the root endpoint', () => {
    cy.request('/')
      .its('body')
      .should('eq', 'Hello World');
  });

  it('should return a list of users from GET /users', () => {
    cy.request('/users')
      .its('body')
      .should('be.an', 'array')
      .and('have.length.at.least', 1);
  });

  it('should return a specific user from GET /user/:id', () => {
    cy.request('/user/1')
      .its('body')
      .should('have.property', 'id', 1);
  });

  it('should return 404 for non-existent user', () => {
    cy.request({
      url: '/user/999',
      failOnStatusCode: false
    })
      .its('status')
      .should('eq', 404);
  });

  it('should create a new user with POST /user/:id', () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    cy.request('POST', '/user/4', newUser)
      .its('body')
      .should('include', { id: 4, name: 'Test User', email: 'test@example.com' });

    // Verify the user was added
    cy.request('/users')
      .its('body')
      .should('have.length.at.least', 4);
  });

  it('should update an existing user with POST /user/:id', () => {
    const updatedUser = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    cy.request('POST', '/user/1', updatedUser)
      .its('body')
      .should('include', { id: 1, name: 'Updated User', email: 'updated@example.com' });
  });

  it('should delete a user with DELETE /user/:id', () => {
    // First, create a user to delete
    const userToDelete = {
      name: 'Delete Me',
      email: 'delete@example.com'
    };

    cy.request('POST', '/user/5', userToDelete);

    // Then delete the user
    cy.request('DELETE', '/user/5')
      .its('status')
      .should('eq', 204);

    // Verify the user was deleted
    cy.request({
      url: '/user/5',
      failOnStatusCode: false
    })
      .its('status')
      .should('eq', 404);
  });
});