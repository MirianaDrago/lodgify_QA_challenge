import config from '../fixtures/config.json';

describe('Scenario 2: Validate task creation', () => {

    const spaceName = config.spaceName;
    const workspaceName = config.workspaceName;
    const folderName = config.folderName;
    const taskName = config.taskName;

    before(() => {
        cy.intercept('**/*', { log: false }).as('allRequests');
        cy.visit('/');
        cy.login();
    });

    it('Create task inside the space via UI and verify via API', () => {
        // create task inside the space
        cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // makes sure the spaces section is visible
        cy.selectSpaceUI(spaceName); // select space want to go into
        cy.createFolderUnderSpacePageUI(folderName); // create the folder under space selected previously...
        cy.createTaskUnderFolderPageUI(taskName); // create task under folder created previously...
        cy.verifyTaskCreationAPI(workspaceName, spaceName, folderName, taskName); // verify through API that task was created
    });
});