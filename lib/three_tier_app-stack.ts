import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, InstanceType } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';


export class ThreeTierAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new Vpc(this, 'VPC');

    // Create an ECS cluster
    const cluster = new Cluster(this, 'Cluster', { vpc });

    // Define a task definition with a single container
    // The container image is a simple web app
    const taskDefinition = new FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('WebContainer', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    // Create a Fargate service
    new FargateService(this, 'Service', {
      cluster,
      taskDefinition,
    });

   // Create an RDS database
new DatabaseInstance(this, 'Database', {
  engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13 }),
  instanceType: new InstanceType('t3.micro'),
  vpc,
});

  }
}
