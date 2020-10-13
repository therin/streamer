#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StreamerStack } from '../lib/streamer-stack';

const app = new cdk.App();
new StreamerStack(app, 'StreamerStack');
