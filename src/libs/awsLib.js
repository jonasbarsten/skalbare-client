import { Storage } from "aws-amplify";

// Public: Accessible by all users of your app. Files are stored under the public/ path in your S3 bucket.
// Protected: Readable by all users, but writable only by the creating user. Files are stored under protected/{user_identity_id}/ where the user_identity_id corresponds to the unique Amazon Cognito Identity ID for that user.
// Private: Only accessible for the individual user. Files are stored under private/{user_identity_id}/ where the user_identity_id corresponds to the unique Amazon Cognito Identity ID for that user.

export async function s3UploadProtected (file) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.put(filename, file, {
  	level: 'protected',
    contentType: file.type,
  });

  return stored.key;
}

export async function s3UploadPrivate (file) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });

  return stored.key;
}
