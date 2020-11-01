import s3 = require('@aws-cdk/aws-s3');
import * as cdk from '@aws-cdk/core';
import * as constants from './constants';
import { CameraChannel } from './media-live';
import { CameraInput } from './media-live-input';
import { CameraRole } from './media-live-role';


export class StreamerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cameraBucket = new s3.Bucket(this, 'jacana-video-bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: constants.video_bucket_name,
      lifecycleRules: [{
        enabled: true,
        expiration: cdk.Duration.days(constants.video_retention_days)
      }]
    })

    const cameraRole = new CameraRole(this, 'camera-role')


    const cameraInputBackyard = new CameraInput(this, 'backyard-input', {
      resourceName: 'jacana-backyard-pull',
      rtmpUrlParameter: constants.rtmp_url_parameter_backyard,
      rtmpUrlParameterVersion: constants.rtmp_url_parameter_backyard_version
    })
    const cameraInputFrontyard = new CameraInput(this, 'frontyard-input', {
      resourceName: 'jacana-frontyard-pull',
      rtmpUrlParameter: constants.rtmp_url_parameter_frontyard,
      rtmpUrlParameterVersion: constants.rtmp_url_parameter_frontyard_version
    })

    new CameraChannel(this, 'backyard-channel', {
      role: cameraRole.arn,
      s3Url: `s3ssl://${cameraBucket.bucketName}/backyard`,
      resourceName: "backyard_channel",
      inputName: "jacana-backyard-pull",
      inputId: cameraInputBackyard.input.ref
    })

    new CameraChannel(this, 'frontyard-channel', {
      role: cameraRole.arn,
      s3Url: `s3ssl://${cameraBucket.bucketName}/frontyard`,
      resourceName: "frontyard_channel",
      inputName: "jacana-frontyard-pull",
      inputId: cameraInputFrontyard.input.ref
    })

  }


}
