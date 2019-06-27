const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "skalbare-api-dev-attachmentsbucket-1tsv3sa7oezub"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.skalbare.no/dev"
    // URL: "https://n4qiouubbc.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_nwwbtYMOe",
    APP_CLIENT_ID: "2r4q2vu41qbvk0c08hijlh4bti",
    IDENTITY_POOL_ID: "us-east-1:eb985139-73b8-43c1-9413-6da0fb75c67b"
  }
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "skalbare-api-prod-attachmentsbucket-pgvbnjm60fjr"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.skalbare.no/prod"
    // URL: "https://k6ovp0eg21.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_bAS3nUkKS",
    APP_CLIENT_ID: "73r83gomap46krfcqi5gbdvvv6",
    IDENTITY_POOL_ID: "us-east-1:c5e396b8-c9d6-48fd-848e-54d9d5014d64"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};