import config from '../fixtures/config.json';

describe('Scenario 1: Validate Create Space functionality', () => {

    const spaceName = config.spaceName;        

    before(() => {
        // intercept all network requests and disable logging
        cy.intercept('**/*', { log: false }).as('allRequests');
        cy.getWorkspaceId(config.workspaceName).as('teamId'); // alias for team ID
    });

    it('Add new space to a workspace via API and confirm created workspace through UI', () => {
        cy.get('@teamId').then(teamId => { // retrieve the alias in the it block
            cy.createSpace(teamId, spaceName);
        });

        cy.visit('/');
        cy.login();

        cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // make sure the spaces section is visible
        const selector = `[data-test="project-list-bar-item__link__${spaceName}"]`; // dynamic selector for the space name
        cy.get(selector).should('be.visible').and('contain', spaceName);
    });
});