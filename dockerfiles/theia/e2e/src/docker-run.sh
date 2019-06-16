#!/bin/sh
# Copyright (c) 2018 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0

echo "Starting Theia..."
rm -rf /root/logs/*
HOME=/home/theia /entrypoint.sh > /root/logs/theia.log 2>/root/logs/theia-error.log&

echo "Cleaning videos folder..."
# Cleanup previous videos
rm -rf /root/cypress/videos/*

# Wait TCP local_address:port 0.0.0.0:3001 (3001 is 0x0BB9 in hex.)
# It'll be opened by Theia.
until `grep -iFq ' 00000000:0BB9 ' /proc/net/tcp`; do
    echo "Waiting for booting up Theia..."
    sleep 10s
done

# Run tests
echo "Run the tests"
cd /root && unset LD_LIBRARY_PATH && /root/node_modules/.bin/cypress run -c trashAssetsBeforeRuns=false  --browser chrome
