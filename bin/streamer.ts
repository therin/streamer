#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { StreamerStack } from '../lib/streamer-stack';

const app = new cdk.App();

const defaultEnv = { region: "us-east-1" }

const streamerStack = new StreamerStack(app, 'StreamerStack', { env: defaultEnv });


cdk.Tags.of(streamerStack).add("auto-stop", "no");
cdk.Tags.of(streamerStack).add("auto-delete", "no");
cdk.Tags.of(streamerStack).add("Application", "Streamer");