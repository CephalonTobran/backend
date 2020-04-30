import * as admin from "firebase-admin"

export function connectToDatabase(key: string): FirebaseFirestore.Firestore {
  if (!key) {
    throw new Error("Firebase Admin credential key was not provided")
  }

  try {
    key = JSON.parse(Buffer.from(key, "base64").toString("ascii"))
  } catch (error) {
    throw new Error("Firebase Admin credential key could not be decoded from base64 to JSON")
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(key),
    })
  } catch (error) {
    throw new Error(`Firebase initialization failed. ${error.message}`)
  }

  return admin.firestore()
}
