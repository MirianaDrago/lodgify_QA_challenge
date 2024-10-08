
/* 
  Description: Get the workspace ID 
  Parameters: Workspace name
  Return: workspace ID
*/
Cypress.Commands.add('getWorkspaceIdAPI', (workspaceName) => {
  const apiToken = Cypress.env('api_token');
  
  return cy.request({
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
  Return: nothing, creates alias
*/ 
Cypress.Commands.add('createSpaceAPI', (teamId, spaceName) => {
  const apiToken = Cypress.env('api_token');

  return cy.request({
    method: 'POST',
    url: `https://api.clickup.com/api/v2/team/${teamId}/space`,
    headers: {
      'Authorization': apiToken,
      'Content-Type': 'application/json'
    },
    body: {
      name: spaceName
    },
    failOnStatusCode: false  // prevent Cypress from failing on non-2xx status codes
  }).then(response => {
    cy.log('Response body:', JSON.stringify(response.body));
    return cy.wrap(response);  // return the full response for further assertions
  });
});



/*
  Description: Delete space 
  Parameters: Space ID
  Return: nothing
*/
Cypress.Commands.add('deleteSpaceAPI', (spaceId) => {
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
  Parameters: nothing
  Return: nothing
*/
Cypress.Commands.add('login', () => {
  cy.get('[data-test="login-email-input"]').click().type((Cypress.env('login_email')), {log: false}); 
  cy.get('[data-test="login-password-input"]').click().type((Cypress.env('login_password')), {log: false}); 
  cy.get('[data-test="login-submit"]').click();
  cy.log('Successfully logged in!');
})

/* 
  Description: get all spaces under a workspace
  Parameters: workspace ID
  Return: all spaces
*/
Cypress.Commands.add('getSpacesAPI', (teamId) => {
  const apiToken = Cypress.env('api_token'); 

  return cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/team/${teamId}/space`,
    headers: {
      'Authorization': apiToken,
    }
  }).then(response => {
    if (response.status === 200) {
      return response.body;  
    } else {
      throw new Error(`Failed to fetch spaces. Status: ${response.status}`);
    }
  });
});

/* 
  Description: get space ID under a workspace using space name
  Parameters: workspace ID & space name
  Return: space ID
*/
Cypress.Commands.add('getSpaceIdByNameAPI', (teamId, spaceName) => {
  return cy.getSpacesAPI(teamId).then(response => {
    const spaces = response.spaces;
    const targetSpace = spaces.find(space => space.name === spaceName);
    if (targetSpace) {
      return targetSpace.id;  
    } else {
      throw new Error('Space not found');
    }
  });
});

/* 
  Description: get all folder under space
  Parameters: space ID
  Return: all folders
*/
Cypress.Commands.add('getFoldersAPI', (spaceId) => {
  const apiToken = Cypress.env('api_token');
  return cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/space/${spaceId}/folder`,
    headers: {
      'Authorization': apiToken
    }
  }).then(response => {
    if (response.status === 200) {
      return response.body;  
    } else {
      throw new Error(`Failed to fetch folders. Status: ${response.status}`);
    }
  });
});

/* 
  Description: get folder ID under space using folder name
  Parameters: space ID & folder name
  Return: folder ID
*/
Cypress.Commands.add('getFolderIdByNameAPI', (spaceId, folderName) => {
  return cy.getFoldersAPI(spaceId).then(folders => {
    const targetFolder = folders.folders.find(folder => folder.name === folderName);
    if (targetFolder) {
      return targetFolder.id;
    } else {
      throw new Error('Folder not found');
    }
  });
});

/* 
  Description: get all lists under a folder
  Parameters: folder ID
  Return: all lists
*/
Cypress.Commands.add('getListsAPI', (folderId) => {
  const apiToken = Cypress.env('api_token');
  return cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/folder/${folderId}/list`,
    headers: {
      'Authorization': apiToken
    }
  }).then(response => {
    if (response.status === 200) {
      return response.body;  
    } else {
      throw new Error(`Failed to fetch lists. Status: ${response.status}`);
    }
  });
});

/* 
  Description: get the first list ID under a folder
  Parameters: folder ID
  Return: list ID
*/
Cypress.Commands.add('getFirstListIdAPI', (folderId) => {
  return cy.getListsAPI(folderId).then(lists => {
    const firstList = lists.lists[0];  
    if (firstList) {
      return firstList.id;
    } else {
      throw new Error('No lists found in the folder');
    }
  });
});


/* 
  Description: get all tasks under a list
  Parameters: list ID
  Return: list of tasks
*/
Cypress.Commands.add('getTasksAPI', (listId) => {
  const apiToken = Cypress.env('api_token'); 

  return cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/list/${listId}/task`,
    headers: {
      'Authorization': apiToken
    }
  }).then(response => {
    if (response.status === 200) {
      return response.body.tasks; 
    } else {
      throw new Error('Failed to retrieve tasks');
    }
  });
});

/* 
  Description: get specific task under a list
  Parameters: list ID & task name
  Return: task object
*/
Cypress.Commands.add('getTaskByNameAPI', (listId, taskName) => {
  return cy.getTasksAPI(listId).then(tasks => {
    const targetTask = tasks.find(task => task.name === taskName);
    if (targetTask) {
      return targetTask; 
    } else {
      throw new Error('Task not found');
    }
  });
});

/* 
  Description: verify the creation of a task under specific parameters
  Parameters: workspace name, space name, folder name & task name 
  Return: nothing
*/
Cypress.Commands.add('verifyTaskCreationAPI', (workspaceName, spaceName, folderName, taskName) => {
  cy.getWorkspaceIdAPI(workspaceName).then(teamId => {
      cy.getSpaceIdByNameAPI(teamId, spaceName).then(spaceId => {
          cy.getFolderIdByNameAPI(spaceId, folderName).then(folderId => {
              cy.getFirstListIdAPI(folderId).then(listId => {
                  cy.getTaskByNameAPI(listId, taskName).then(task => {
                      expect(task).to.exist;
                      expect(task.name).to.equal(taskName);
                  });
              });
          });
      });
  });
  cy.log('Task was created successfully!');
});

/* 
  Description: selects a space from the landing page
  Parameters: space name
  Return: nothing
*/
Cypress.Commands.add('selectSpaceUI', (spaceName) => {
  const selector = `[data-test="project-list-bar-item__link__${spaceName}"]`;
  cy.get(selector).should('be.visible').and('contain', spaceName).click();
});

/* 
  Description: creates a folder under the space through the main landing page
  Parameters: folder name
  Return: nothing
*/
Cypress.Commands.add('createFolderUnderSpacePageUI', (folderName) => {
  cy.get('gridster-item[data-item-name="folders"]').then($el => {
    // changing overflow of elements parents to visible since it is hidden as default
    $el.parents().each((index, parent) => {
      cy.wrap(parent).invoke('css', 'overflow', 'visible');
    });
    
    // ensure the gridster-item is visible, as well as forcing a hover event in order for toolbar to become visible
    cy.wrap($el).invoke('css', 'display', 'block').scrollIntoView().should('be.visible')
      .trigger('mouseover', { force: true });

    // create folder button should be visible...
    cy.wrap($el)
      .find('cu-card-actions-portal .card-actions-button')
      .should('exist').invoke('show').should('be.visible').click({ force: true });

    // create folder name under the space youre into when you select space...
    cy.get('[data-test="create-category__form-input"]').click().type(folderName);
    cy.get('.cu-modal__footer > [buttontype="primary"]').should('be.visible').click();
    cy.get(`[data-test="breadcrumb-item__name-${folderName}"]`).should('be.visible');
  });
});

/* 
  Description: creates a task through the UI under folder page
  Parameters: task name
  Return: nothing
*/
Cypress.Commands.add('createTaskUnderFolderPageUI', (taskName) => {
  cy.get('.cu2-views-bar__create-cu-object-button > .ng-trigger > [data-test="cu2-views-bar__create-menu-view-bar-collapsed"] > .container > [data-test="create-task-menu__new-task-button"]').click();
  cy.get('[data-test="draft-view__title-task"]').click().clear().type(taskName);
  cy.get('[data-test="draft-view__quick-create-create"]').click();
});


/* 
  Description: creates a task through the API under a certain folder list
  Parameters: list ID, task name & task description
  Return: response body
*/
Cypress.Commands.add('createTaskAPI', (listId, taskName, taskDescription) => {
  const apiToken = Cypress.env('api_token');

  return cy.request({
    method: 'POST',
    url: `https://api.clickup.com/api/v2/list/${listId}/task`,  
    headers: {
      'Authorization': apiToken,
      'Content-Type': 'application/json'
    },
    body: {
      "name": taskName,
      "description": taskDescription
    }
  }).then(response => {
    expect(response.status).to.eq(200);  
    cy.log(`Task "${taskName}" created successfully with ID: ${response.body.id}`);
    return cy.wrap(response.body); // return the task object
  });
});

/* 
  Description: creates a task inside a folder under a certain space in a workspace
  Parameters: workspace name, space name, folder name, task name & task description
  Return: nothing
*/
Cypress.Commands.add('createAndVerifyTaskInFolderAPI', (workspaceName, spaceName, folderName, taskNameToCreate, taskDescriptionToCreate) => {
  cy.getWorkspaceIdAPI(workspaceName).then(teamId => {
      cy.getSpaceIdByNameAPI(teamId, spaceName).then(spaceId => {
          cy.getFolderIdByNameAPI(spaceId, folderName).then(folderId => {
              cy.getFirstListIdAPI(folderId).then(listId => {
                  cy.createTaskAPI(listId, taskNameToCreate, taskDescriptionToCreate).then(task => {
                      expect(task.name).to.equal(taskNameToCreate);
                      expect(task.description).to.equal(taskDescriptionToCreate);
                  });
              });
          });
      });
  });
});

/*
  Description: select a folder in the UI under a space
  Parameters: space name & folder name
  Return: nothing
*/
Cypress.Commands.add('selectFolderUI', (spaceName, folderName) => {
  // navigate to the space and click to expand if necessary
  cy.selectSpaceUI(spaceName);
  cy.wait(500); 
  // click the folder by building its data-test attribute dynamically
  cy.get(`[data-test="category-row__folder-name__${folderName}"]`).click();
});

Cypress.Commands.add('selectListInsideFolderUI', (spaceName, folderName, listName) => {
  cy.selectFolderUI(spaceName, folderName);
  cy.wait(500); 
  // click the list by building its data-test attribute dynamically
  cy.get(`[data-test="subcategory-row__${listName}"]`).click();
});