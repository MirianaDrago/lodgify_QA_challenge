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
        cy.visit('/');
        cy.login();
    });

    it('Add new task via API and confirm task through UI', () => {
        // using the previous workspace & folder created in scenario 2
        cy.createTaskInFolderAPI(workspaceName, spaceName, folderName, taskNameToCreate, taskDescriptionToCreate).then((response) => {
            expect(response.body.name).to.equal(taskNameToCreate);
            expect(response.body.description).to.equal(taskDescriptionToCreate);
        });

        cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // makes sure the spaces section is visible
        cy.selectListInsideFolderUI(spaceName, folderName, listName); // select list to go into under specific folder
        cy.get(`[data-test="task-row-main__${taskNameToCreate}"]`).should('contain.text', taskNameToCreate).should('be.visible');
    });

    it('Attempt to create a task with an empty name via API', () => {
        cy.createTaskInFolderAPI(workspaceName, spaceName, folderName, '', taskDescriptionToCreate).then((response) => {
            expect(response.status).to.eq(400); // expect failure due to invalid task name
            expect(response.body.err).to.eq('Task name invalid');
        });
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