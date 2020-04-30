import WarframeItems from "warframe-items"
import { displayConsoleMessage } from "../lib/console_messages"
import { connectToDatabase } from "../lib/database"
import { categories, Categories } from "../lib/categories"
import { Collectible, convertItemToCollectible } from "../lib/collectibles"

interface UpdateHandlerArguments {
  categories: Categories
  dryRun: boolean
  firebaseKey: string
  verbose: boolean
  _: string[]
  $0: string
}

function updateHandler(args: UpdateHandlerArguments) {
  const dryRun = args.dryRun
  const verbose = args.verbose

  /* Connect to database */
  let database: FirebaseFirestore.Firestore

  try {
    if (!dryRun) database = connectToDatabase(args.firebaseKey)

    if (database) displayConsoleMessage("Database connection established", "success")
    else displayConsoleMessage("Skipping connection to database.", "warning")
  } catch (error) {
    displayConsoleMessage(`Database Connection Error: ${error.message}`, "error")
    return
  }

  /* Prepare categories */
  let categories = []

  // convert a string to a single item array
  if (typeof args.categories === "string") categories.push(args.categories)
  else categories = args.categories

  // if categories include "all", just use "all"
  if (categories.length > 1 && categories.indexOf("all") !== -1) categories = ["all"]

  for (const category of categories) {
    if (category === "warframes" || category === "all") {
      displayConsoleMessage(`Beginning update of warframes...`, "info")

      const warframeItemList = new WarframeItems({ category: ["Warframes"] })

      if (verbose)
        displayConsoleMessage(`Found ${warframeItemList.length} warframes to update`, "info")

      let warframeUpdateSuccesses = 0
      let warframeUpdateFailures = 0

      let databaseBatch: FirebaseFirestore.WriteBatch
      if (database) {
        databaseBatch = database.batch()
      }

      for (const warframeItem of warframeItemList) {
        let warframeCollectible: Collectible

        try {
          warframeCollectible = convertItemToCollectible(warframeItem)
        } catch (error) {
          warframeUpdateFailures++
          displayConsoleMessage(
            `Failed to update warframe "${warframeItem.name}": ${error.message}`,
            "error"
          )
        }

        if (database) {
          const collectibleDBRef = database
            .collection("warframes")
            .doc(warframeCollectible.databaseID)

          databaseBatch.set(collectibleDBRef, warframeCollectible, { merge: true })
        }

        warframeUpdateSuccesses++
        if (verbose)
          displayConsoleMessage(`Found warframe "${warframeCollectible.name}" to update`, "info")
      }

      if (database) {
        databaseBatch
          .commit()
          .then(() => {
            if (warframeUpdateSuccesses > 0) {
              displayConsoleMessage(
                `Successfully updated ${warframeUpdateSuccesses} warframes.`,
                "success"
              )
            }

            if (warframeUpdateFailures > 0) {
              displayConsoleMessage(
                `Failed to update ${warframeUpdateSuccesses} warframes.`,
                "error"
              )
            }
          })
          .catch((error) => {
            displayConsoleMessage(
              `Failed to save any warframes to the database. Firestore returned: ${error.message}`,
              "error"
            )
          })
      } else {
        if (warframeUpdateSuccesses > 0) {
          displayConsoleMessage(
            `Successfully updated ${warframeUpdateSuccesses} warframes.`,
            "success"
          )
        }

        if (warframeUpdateFailures > 0) {
          displayConsoleMessage(`Failed to update ${warframeUpdateSuccesses} warframes.`, "error")
        }

        displayConsoleMessage(
          'However, none of this was saved to the database because this was a "dry run."',
          "warning"
        )
      }
    }
  }
}

/**
 * Builder sets the options specific to this command.
 */
function builder(yargs) {
  return yargs.options({
    "categories": {
      alias: ["C", "category"],
      choices: categories,
      default: "all",
      describe: "The category or categories to update",
    },
    "firebase-key": {
      alias: ["K", "key"],
      type: "string",
      demandOption: true,
      describe: "JSON service credential key, encoded in base64",
    },
    "dry-run": {
      alias: ["D", "dry"],
      type: "boolean",
      describe: "Skip database interactions",
      default: false,
    },
    "verbose": {
      alias: "V",
      type: "boolean",
      describe: "Output a lot more information",
      default: false,
    },
  })
}

export = {
  command: "update",
  alias: "import",
  describe: "Update the database of collectibles",
  builder: builder,
  handler: updateHandler,
}
