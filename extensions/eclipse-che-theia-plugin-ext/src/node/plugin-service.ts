/**********************************************************************
 * Copyright (c) 2018-2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/

import * as express from 'express';
import * as path from 'path';

import { SERVER_TYPE_ATTR, SERVER_WEBVIEWS_ATTR_VALUE, getUrlDomain } from '../common/che-server-common';
import { inject, injectable } from 'inversify';

import { Deferred } from '@theia/core/lib/common/promise-util';
import { ILogger } from '@theia/core/lib/common/logger';
import { PluginApiContribution } from '@theia/plugin-ext/lib/main/node/plugin-service';
import { WebviewExternalEndpoint } from '@theia/plugin-ext/lib/main/common/webview-protocol';
import { WorkspaceService } from '@eclipse-che/theia-remote-api/lib/common/workspace-service';

import connect = require('connect');
import serveStatic = require('serve-static');
const vhost = require('vhost');

const pluginPath = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + './theia/plugins/';

@injectable()
export class PluginApiContributionIntercepted extends PluginApiContribution {
  @inject(WorkspaceService)
  private workspaceService: WorkspaceService;

  @inject(ILogger)
  protected readonly logger: ILogger;

  private waitWebviewEndpoint = new Deferred<void>();

  configure(app: express.Application): void {
    app.get('/plugin/:path(*)', (req, res) => {
      const filePath: string = req.params.path;
      res.sendFile(pluginPath + filePath);
    });

    const webviewApp = connect();
    const pluginExtModulePath = path.dirname(require.resolve('@theia/plugin-ext/package.json'));
    const webviewStaticResources = path.join(pluginExtModulePath, 'src/main/browser/webview/pre');

    this.workspaceService
      .findUniqueEndpointByAttribute(SERVER_TYPE_ATTR, SERVER_WEBVIEWS_ATTR_VALUE)
      .then(server => {
        let domain;
        if (server.url) {
          domain = getUrlDomain(server.url);
        }
        const hostName = this.handleAliases(
          process.env[WebviewExternalEndpoint.pattern] || domain || WebviewExternalEndpoint.pattern
        );
        webviewApp.use('/webview', serveStatic(webviewStaticResources));

        this.logger.info(`Configuring to accept webviews on '${hostName}' hostname.`);
        app.use(vhost(new RegExp(hostName, 'i'), webviewApp));

        this.waitWebviewEndpoint.resolve();
      })
      .catch(err => {
        this.logger.error('Security problem: Unable to configure separate webviews domain: ', err);
        this.waitWebviewEndpoint.resolve();
      });
  }

  async onStart(): Promise<void> {
    await this.waitWebviewEndpoint.promise;
  }

  protected handleAliases(hostName: string): string {
    return hostName.replace('{{uuid}}', '.+').replace('{{hostname}}', '.+');
  }
}
