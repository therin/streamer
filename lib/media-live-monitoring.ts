import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as cdk from "@aws-cdk/core";

export class CameraMonitoring extends cdk.Construct {

  constructor(parent: cdk.App, id: string) {
    super(parent, id)

    // Not working, classic TODO

    const alertProxyErrorMetric = metric("Error", {
      period: cdk.Duration.minutes(1),
      label: "EMLAlertProxy-Error",
    });

    new cloudwatch.Alarm(this, "EMLAlertProxy-Errors", {
      metric: alertProxyErrorMetric,
      threshold: 2,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }).addAlarmAction();

  }
}

