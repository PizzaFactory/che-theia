# Copyright (c) 2018 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0

# Use upstream image
FROM ${BUILD_ORGANIZATION}/${BUILD_PREFIX}-theia-dev:${BUILD_TAG}

# define in env variable GITHUB_TOKEN
ARG GITHUB_TOKEN

# Electron requires Chromium an dGlibc...
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
    apk add glibc-2.29-r0.apk && \
    apk --no-cache add chromium && \
    rm /etc/apk/keys/sgerrand.rsa.pub glibc-2.29-r0.apk

# Just try to build the latest theia with current image
RUN git clone -b 'master' --single-branch --depth 1 https://github.com/theia-ide/theia theia
RUN cd theia && yarn

