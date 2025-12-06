import admin from "firebase-admin";
import config from "./env.js";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebaseProjectId,
    privateKeyId: config.firebasePrivateKeyId,
    privateKey: config.firebasePrivateKey.replace(/\\n/g, "\n"),
    clientEmail: config.firebaseClientEmail,
  }),
});

export default admin;
