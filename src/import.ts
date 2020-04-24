/**
 * Cephalon Tobran (https://github.com/CephalonTobran/backend)
 * Copyright (c) 2020 Ed Rands
 * Licensed under MIT (https://github.com/CephalonTobran/backend/blob/master/LICENSE)
 */

import {
  displayError,
  displayFatalError,
  displayInfo,
  loadEnvironmentVariables,
  FirebaseServiceAccount,
} from "./functions"
import * as admin from "firebase-admin"
import WarframeItems from "warframe-items"
import { convertItemToCollectible } from "./collectibles"

process.on("uncaughtException", (error) => {
  displayError("There was an uncaught error", error.message)
})

displayInfo("Establishing connection to database...")

/*** Initialize environment variables ***/
try {
  loadEnvironmentVariables()
} catch (error) {
  displayFatalError("Failed to load environment variables", error)
}

/*** Initialize Cloud Firestore database ***/
try {
  admin.initializeApp({
    credential: admin.credential.cert(FirebaseServiceAccount()),
  })
} catch (error) {
  displayFatalError("Failed to connect to Firebase", error)
}

const database = admin.firestore()
const databaseBatch = database.batch()

/*** Import warframes ***/
displayInfo("Beginning warframe import...")

const warframeItemList = new WarframeItems({ category: ["Warframes"] })

let warframeImportCount = 0

for (const warframeItem of warframeItemList) {
  const warframeCollectible = convertItemToCollectible(warframeItem)

  const collectibleDBRef = database
    .collection("warframes")
    .doc(warframeCollectible.databaseID)
  databaseBatch.set(collectibleDBRef, warframeCollectible, { merge: true })

  warframeImportCount++
}

databaseBatch
  .commit()
  .then(() => {
    displayInfo(`Successfully imported ${warframeImportCount} warframes.`)
  })
  .catch((error) => {
    displayFatalError("Failed to save any warframes.", error)
  })
