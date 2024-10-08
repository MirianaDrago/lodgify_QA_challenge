import config from '../fixtures/config.json';

describe('Scenario 3: Validate Create Task via API', () => {

    const workspaceName = config.workspaceName;
    const spaceName = config.spaceName;     
    const folderName = config.folderName;
    const taskNameToCreate = 'New API Task';
    const taskDescriptionToCreate = 'New API Task Description';
    const listName = 'List';

    before(() => {
        // intercept all network requests and disable logging
        cy.intercept('**/*', { log: false }).as('allRequests');
    });

    it('Add new task via API and confirm task through UI', () => {

        // using the previous workspace & folder created in scenario 2
        cy.createAndVerifyTaskInFolderAPI(workspaceName, spaceName, folderName, taskNameToCreate, taskDescriptionToCreate);

        cy.visit('/');
        cy.login();

        cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // makes sure the spaces section is visible
        cy.selectListInsideFolderUI(spaceName, folderName, listName); // select list to go into under specific folder
        cy.get(`[data-test="task-row-main__${taskNameToCreate}"]`).should('contain.text', taskNameToCreate).should('be.visible');
    });

    after(() => {
        // deleting the whole space as clean up...
        cy.getWorkspaceIdAPI(workspaceName).then((workspaceId) => {
            cy.getSpaceIdByNameAPI(workspaceId, spaceName).then((spaceId) => {
                cy.deleteSpaceAPI(spaceId);
            });
        });
    });
});