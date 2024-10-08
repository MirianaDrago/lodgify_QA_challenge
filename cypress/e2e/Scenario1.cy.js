import config from '../fixtures/config.json';

describe('Scenario 1: Validate Create Space functionality', () => {

    const spaceName = config.spaceName;        

    before(() => {
        // intercept all network requests and disable logging
        cy.intercept('**/*', { log: false }).as('allRequests');
        cy.getWorkspaceIdAPI(config.workspaceName).as('teamId'); // alias for team ID
    });

    it('Add new space to a workspace via API and confirm created workspace through UI', () => {
        cy.get('@teamId').then(teamId => { // retrieve the alias in the it block
            cy.createSpaceAPI(teamId, spaceName);
        });

        cy.visit('/');
        cy.login();

        cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // make sure the spaces section is visible
        cy.selectSpaceUI(spaceName);
    });
});