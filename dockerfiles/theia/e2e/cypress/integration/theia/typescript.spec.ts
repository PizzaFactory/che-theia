/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

context('TypeScript', () => {
    before(() => {
        cy.visit('http://localhost:3100');

        // maybe it's possible to wait for an element being displayed/hidden
        cy.wait(3000);
    })

    afterEach(() => {
        cy.theiaCleanup();
    });

    // Create a typescript file and check we can use the editor
    it('Check Invalid Syntax', () => {

        const FOLDER_NAME = 'typescripttest' + makeid();
        const FILENAME = 'HelloWorld.ts';


        // close any workspace
        cy.theiaCommandPaletteClick('Close Workspace Roots').then(() => {
            const $el = Cypress.$('button.theia-button.main');
            if ($el.length) {
                cy.get('button.theia-button.main')
                  .should('exist')
                  .click({ force: true })
                  .end();
            }
        })

        // wait the refresh after workspace is opened
        cy.wait(6000);

        // "Open Workspace Roots" may be failed without clearing history
        cy.theiaCommandPaletteClick('Clear Command History');

        // open /tmp
        cy.get('#theia-top-panel').should('exist')
          .theiaCommandPaletteClick('Open Workspace Roots...', '{downarrow}')
          .wait(3000)
          .get('.theia-LocationList').should('exist').select('file:///')
          .wait(3000)
          .get('.dialogContent .theia-TreeNodeSegment').should('exist')
          .get('.dialogContent .theia-TreeNodeSegment').contains('tmp').click({ force: true })
          .get('.dialogContent  .theia-TreeNodeSegment').contains('tmp').click({ force: true })
          .get('button.theia-button.main').click({ force: true });

        // wait the refresh after workspace is opened
        cy.wait(10000)
          .get('#theia-top-panel').should('exist')
          .theiaCommandPaletteClick('New Folder')
          .get('.dialogContent input').type(FOLDER_NAME)
          .get('button.theia-button.main').click({ force: true })
          .end();

        // enable the explorer view
        cy.get('body')
          .type('{ctrl}{cmd}{shift}e')
          .end();

        // wait for explorer to be opened
        cy.wait(2000);
        // select new folder
        cy.get('.p-TabBar-content > #shell-tab-explorer-view-container > div.theia-tab-icon-label > div.p-TabBar-tabIcon.navigator-tab-icon')
          .click({ force: true })
          .get('#files')
          .contains(FOLDER_NAME)
          .click({ force: true })
          .end();

        // create file
        cy.get('#theia-top-panel').should('exist')
          .theiaCommandPaletteClick('New File')
          .get('.dialogContent input').type(FILENAME)
          .get('button.theia-button.main').click({ force: true })
          .end();

        cy.get('.p-Widget.p-TabBar.theia-app-centers.theia-app-main')
          .contains(FILENAME).click({ force: true })
          .end();

        cy.window().then((win: any) => {
            win.monaco.editor.getModels()[0].setValue('export class HelloWorld {\n  constructor() {}\n foo(): invalid {\n }\n}\n');
        })

        cy.visit('http://localhost:3100/')
          .end();
    })
});

export function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
