import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth
});

const customBucketName = "scaleforce-app-vdr-storage";

backend.addOutput({
  version: "1.3",
  storage: {
    aws_region: "eu-west-1",
    bucket_name: customBucketName,
    buckets: [
      {
        name: customBucketName,
        bucket_name: customBucketName,
        aws_region: "eu-west-1",
        paths: {
          "*": {
            guest: [],
            // We'll handle more specific permissions with IAM policies
            authenticated: ["get", "list"],
          },
        },
      },
    ],
  },
});

// Define admin policy - admins get full access to the entire bucket
const adminPolicy = new Policy(backend.stack, "customBucketAdminPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject", 
        "s3:PutObject", 
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      resources: [
        `arn:aws:s3:::${customBucketName}`,
        `arn:aws:s3:::${customBucketName}/*`
      ],
    }),
  ],
});


// Function to create a policy for a specific group
function createGroupPolicy(groupName: string) {
  return new Policy(backend.stack, `${groupName}BucketPolicy`, {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:GetObject", 
          "s3:PutObject", 
          "s3:DeleteObject",
        ],
        resources: [
          `arn:aws:s3:::${customBucketName}/${groupName}`,
          `arn:aws:s3:::${customBucketName}/${groupName}/*`
        ],
      }),
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:ListBucket", 
        ],
        resources: [
          `arn:aws:s3:::${customBucketName}`,
        ],
      })
    ],
  });
}


// Add the policies to the admin user role
backend.auth.resources.groups["admin"].role.attachInlinePolicy(adminPolicy);

console.log('GROUPS', backend.auth.resources.groups)

const groupNames = Object.keys(backend.auth.resources.groups).filter(g => g !== "admin");
groupNames.forEach(groupName => {
  const groupPolicy = createGroupPolicy(groupName);
  console.log('group policy', groupPolicy);
  backend.auth.resources.groups[groupName].role.attachInlinePolicy(groupPolicy);
})