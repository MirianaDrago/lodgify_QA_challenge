
/* 
  Description: Get the workspace ID 
  Parameters: Workspace name
*/
Cypress.Commands.add('getWorkspaceId', (workspaceName) => {
  const apiToken = Cypress.env('api_token');
  cy.request({
    method: 'GET',
    url: 'https://api.clickup.com/api/v2/team',
    headers: {
        'Authorization': apiToken
    }
  }).then(response => {
    expect(response.status).to.eq(200);
    const teams = response.body.teams;
    const matchedTeam = teams.find(team => team.name === workspaceName);
    if (matchedTeam) {
        return matchedTeam.id;  
    } else {
        throw new Error('Workspace not found');
    }
  });
});


/* 
  Description: Create a space 
  Parameters: Team/workspace id to create the space under
*/ 
Cypress.Commands.add('createSpace', (teamId, spaceName) => {
  const apiToken = Cypress.env('api_token');

  cy.request({
    method: 'POST',
    url: `https://api.clickup.com/api/v2/team/${teamId}/space`,
    headers: {
      'Authorization': apiToken,
      'Content-Type': 'application/json'
    },
    body: {
      name: spaceName
    },
    failOnStatusCode: false  
  }).then(response => {
    expect(response.status).to.eq(200);
    expect(response.body.name).to.eq(spaceName);
    if (response.status === 200) {
      cy.log('Space created successfully with ID:', response.body.id);
      cy.wrap(response.body.id).as('createdSpaceId');  
    } else {
      cy.log(`Failed to create space. Status code: ${response.status}`);
      cy.log('Response body:', JSON.stringify(response.body));

      // set alias to null in case of failure - because of the after 
      cy.wrap(null).as('createdSpaceId');

      cy.then(() => {
        throw new Error;
      });
    }
  });
});

/*
  Description: Delete space 
  Parameters: Space ID
*/
Cypress.Commands.add('deleteSpace', (spaceId) => {
  const apiToken = Cypress.env('api_token'); 

  cy.request({
      method: 'DELETE',
      url: `https://api.clickup.com/api/v2/space/${spaceId}`,
      headers: {
          'Authorization': apiToken
      },
      failOnStatusCode: false 
  }).then(response => {
      if (response.status === 200) {
          cy.log('Space deleted successfully');
      } else {
          cy.log('Failed to delete space:', response);
      }
  });
});

/* 
  Description: Login to click up
*/
Cypress.Commands.add('login', () => {
  cy.get('[data-test="login-email-input"]').click().type(Cypress.env('login_email'));
  cy.get('[data-test="login-password-input"]').click().type(Cypress.env('login_password'));
  cy.get('[data-test="login-submit"]').click();
  cy.log('Successfully logged in!');
})