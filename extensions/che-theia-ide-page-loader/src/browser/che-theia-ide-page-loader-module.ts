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

import { TheiaDashboardClient } from './theia-dashboard-client';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { CheTheiaIDEPageLoaderFrontendContribution } from './che-theia-dashboard-frontend-contribution';

import { ContainerModule } from 'inversify';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CheTheiaIDEPageLoaderFrontendContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(CheTheiaIDEPageLoaderFrontendContribution);
    bind(MenuContribution).toService(CheTheiaIDEPageLoaderFrontendContribution);
});
