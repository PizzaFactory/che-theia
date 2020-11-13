/**********************************************************************
 * Copyright (c) 2018-2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/

require("../../src/cdn/bootstrap");
import { CheCdnSupport } from "../../src/cdn/base";

describe("Test bootstrap", () => {
    
    test("test CheCdnSupport added in window object", async () => {
        expect((<any>window).CheCdnSupport).toBe(CheCdnSupport);
    });
});
