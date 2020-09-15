/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
// Original code was contributed by PizzaFactory Project. 

import { inject, injectable } from 'inversify';
import {
    Command,
    CommandContribution,
    CommandRegistry,
    MenuContribution,
    MenuModelRegistry
} from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';
import { TheiaDashboardClient } from './theia-ide-page-loader-client';

const RELOAD: Command = {
    id: 'ide-page-loader:reload',
    label: 'Reload IDE'
};

@injectable()
export class CheTheiaIDEPageLoaderFrontendContribution implements CommandContribution, MenuContribution {

    @inject(TheiaDashboardClient)
    protected readonly dashboardClient: TheiaDashboardClient;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(RELOAD, {
            execute: () => window.location.reload(false);
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
    }
}
