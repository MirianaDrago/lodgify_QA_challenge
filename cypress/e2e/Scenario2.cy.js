import config from '../fixtures/config.json';

describe('Scenario 2: Validate task creation', () => {

    const spaceName = config.spaceName;
    const workspaceName = config.workspaceName;
    const folderName = config.folderName;
    const folderName2 = `${folderName}2`;
    const folderName3 = `${folderName}3`;
    const taskName = config.taskName;
    const emptyTaskName = '';  
    const longTaskName = 'a'.repeat(100); 

    const testCases = [
        { taskName: taskName, description: 'normal length', folderName: folderName },
        { taskName: longTaskName, description: 'boundary length of 100 characters', folderName: folderName2 },
    ];

    beforeEach(() => {
        cy.intercept('**/*', { log: false }).as('allRequests');
        cy.visit('/');
        cy.login();
    });

    testCases.forEach(({ taskName, description, folderName }) => {
        it(`Create task inside the space via UI with ${description} task name and verify via API`, () => {
            // create task inside the space
            cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // makes sure the spaces section is visible
            cy.selectSpaceUI(spaceName); // select space want to go into
            cy.createFolderUnderSpacePageUI(folderName); // create the folder under space selected previously...
            cy.screenshot('folder-page');
            cy.createTaskUnderFolderPageUI(taskName); // create task under folder created previously...
            cy.screenshot(`task-creation-${description}`); // screenshot to verify task creation
            cy.verifyTaskCreationAPI(workspaceName, spaceName, folderName, taskName); // verify through API that task was created
        });
    });

    it('Attempt to create a task with an empty name - confirm error message', () => {
        cy.get('.sidebar__spaces-text', {timeout: 30000}).should('be.visible'); // makes sure the spaces section is visible
        cy.selectSpaceUI(spaceName); // select space want to go into
        cy.createFolderUnderSpacePageUI(folderName3); 
        cy.createTaskUnderFolderPageUI(emptyTaskName);
        cy.get('[data-pendo="quick-create-task-enter-task-name-error"]')
        .should('be.visible')
        .and('contain.text', 'Enter Task Name');
        cy.screenshot('empty-task-name-error-message');
    });

    after(() => {
        cy.deleteFolderUnderSpaceAPI(workspaceName, spaceName, folderName2);
        cy.deleteFolderUnderSpaceAPI(workspaceName, spaceName, folderName3);
    });
});