import cdk = require("@aws-cdk/core");
import iam = require("@aws-cdk/aws-iam");


export class CameraRole extends cdk.Construct {
  arn: string;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    
    const cameraAccessPolicy = new iam.ManagedPolicy(
      this,
      "MediaLiveAccessRolePolicy",
      {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "s3:ListBucket",
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
            ],
            resources: ["*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "mediastore:ListContainers",
              "mediastore:PutObject",
              "mediastore:GetObject",
              "mediastore:DeleteObject",
              "mediastore:DescribeObject",
            ],
            resources: ["*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
              "logs:DescribeLogStreams",
              "logs:DescribeLogGroups",
            ],
            resources: ["arn:aws:logs:*:*:*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "mediaconnect:ManagedDescribeFlow",
              "mediaconnect:ManagedAddOutput",
              "mediaconnect:ManagedRemoveOutput",
            ],
            resources: ["*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "ec2:describeSubnets",
              "ec2:describeNetworkInterfaces",
              "ec2:createNetworkInterface",
              "ec2:createNetworkInterfacePermission",
              "ec2:deleteNetworkInterface",
              "ec2:deleteNetworkInterfacePermission",
              "ec2:describeSecurityGroups",
            ],
            resources: ["*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["mediapackage:DescribeChannel"],
            resources: ["*"],
          }),
        ],
      }
    );

    const role = new iam.Role(this, "MediaLiveAccessRole", {
      assumedBy: new iam.ServicePrincipal("medialive.amazonaws.com"),
      roleName: "MediaLiveAccessRole",
      managedPolicies: [
        cameraAccessPolicy,
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
      ],
    });

    this.arn = role.roleArn;
    

  }
  }