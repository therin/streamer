import * as cdk from '@aws-cdk/core';
import * as constants from './constants';
import channelConfig = require('./channel-config-s3.json');
import medialive = require('@aws-cdk/aws-medialive')


export interface CameraChannelProps {
  role: string;
  s3Url: string;
  inputId: string;
  inputName: string,
  resourceName: string;
}



export class CameraChannel extends cdk.Construct {
  channelArn: string;

  constructor(scope: cdk.Construct, id: string, props: CameraChannelProps) {
    super(scope, id);
    const s3Url = props.s3Url;
    const roleArn = props.role;



    const destinations = [
      {
        id: "destination1",
        settings: [
          {
            url: s3Url,
          },
        ],
        mediaPackageSettings: [],
      },
    ]

    const inputAttachments = [
      {
        inputAttachmentName: props.inputName,
        inputId: props.inputId,
        inputSettings: {
          networkInputSettings: {},
        },
      },
    ]


    const inputSpecification = {
      codec: 'AVC',
      resolution: 'HD',
      maximumBitrate: 'MAX_10_MBPS',
    }



    const cameraChannel = new medialive.CfnChannel(this, `cameraChannel${props.resourceName}`,
      {
        channelClass: 'SINGLE_PIPELINE',
        destinations,
        inputAttachments,
        roleArn: roleArn,
        inputSpecification,
        name: `CameraChannel_${props.resourceName}`,
        logLevel: 'INFO'

      });

    // Override EncoderSettings due to CFN poor handling of nested empty objects
    channelConfig.OutputGroups[0].OutputGroupSettings.ArchiveGroupSettings.RolloverInterval = constants.video_rollover_seconds
    cameraChannel.addPropertyOverride('EncoderSettings', channelConfig)

  }
}