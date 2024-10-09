import config from '../fixtures/config.json';

describe('Scenario 1: Validate Create Space functionality', () => {

    const spaceName = config.spaceName;  
    const workspaceName = config.workspaceName;   
    const longSpaceName = 'a'.repeat(100);  // 100 characters long 
    const extremelyLongSpaceName = 'a'.repeat(1000); // 1000 characters long
    const invalidSpaceName = ''; // empty name 

    const testCases = [
        { spaceName: spaceName, description: 'normal length' },
        { spaceName: longSpaceName, description: 'boundary length of 100 characters' },
        { spaceName: extremelyLongSpaceName, description: 'extreme boundary length of 1000 characters' }
    ];

    beforeEach(() => {
        // intercept all network requests and disable logging
        cy.intercept('**/*', { log: false }).as('allRequests');
        cy.getWorkspaceIdAPI(workspaceName).then(teamId => {
            cy.wrap(teamId).as('teamId'); // ensure the alias is properly set
        });    
    });

    testCases.forEach(({ spaceName, description }) => {
        it(`Add new space to a workspace via API with ${description} and confirm through UI`, () => {
            cy.get('@teamId').then(teamId => { // retrieve the alias in the it block
                cy.createSpaceAPI(teamId, spaceName).then((response) => {
                    expect(response.body.name).to.eq(spaceName);
                    expect(response.status).to.eq(200);
                });
            });

            cy.visit('/');
            cy.login();
    
            cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // make sure the spaces section is visible
            cy.selectSpaceUI(spaceName); // select the space
            cy.get(`[data-test="breadcrumb-item__name-${spaceName}"]`).should('be.visible').should('contain.text', spaceName);

            cy.screenshot(`SpaceCreation_${description}`);  // capture screenshot after validation
        });
    });

    it('Attempt to create a space with an empty name', () => {
        cy.get('@teamId').then(teamId => {
            cy.createSpaceAPI(teamId, invalidSpaceName).then((response) => {
                expect(response.status).to.eq(400);  // assert that the status code is 400
                expect(response.body.err).to.eq('Space name invalid');  // assert the error message
                cy.screenshot('EmptyNameError');  // capture screenshot of the error
            });
        });
    });
    
    it('Attempt to create a space with a duplicate name', () => {    
        cy.get('@teamId').then(teamId => {
            // attempt to create the space with the same name again
            cy.createSpaceAPI(teamId, spaceName).then((response) => {
                // assert that the status code is 400 
                expect(response.status).to.eq(400);  
                expect(response.body.err).to.eq('Space with this name already exists');  
                cy.screenshot('DuplicateNameError');  // capture screenshot of the duplicate error
            });
        });
    });    
});