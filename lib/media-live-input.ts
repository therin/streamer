import cdk = require('@aws-cdk/core');
import ssm = require('@aws-cdk/aws-ssm')
import medialive = require('@aws-cdk/aws-medialive');

export interface CameraInputProps {
  resourceName: string;
  rtmpUrlParameter: string;
  rtmpUrlParameterVersion: number;
}

export class CameraInput extends cdk.Construct {
  input: medialive.CfnInput;

  constructor(scope: cdk.Construct, id: string, props: CameraInputProps) {
    super(scope, id);


    const cameraInput = new medialive.CfnInput(this, props.resourceName, {
      name: props.resourceName,
      type: 'RTMP_PULL',
      sources: [{
        url:
          ssm.StringParameter.fromStringParameterAttributes(this,
            props.rtmpUrlParameter,
            {
              parameterName: props.rtmpUrlParameter,
              version: props.rtmpUrlParameterVersion
            }).stringValue
      }]
    })

    this.input = cameraInput;

  }
}



