import {
  validID,
  validUniqueName,
  validName,
  validCategory,
  validDescription,
  validImage,
  validMasteryRank,
  validVersion,
  validWikiURL,
  validVaultedStatus,
} from "./validators"
import { Item } from "warframe-items"

/**
 * Database document data.
 */
export type DocumentData = {
  [field: string]: unknown
}

/**
 * An array of collectibles.
 */
export type CollectiblesList = Array<Collectible>

/**
 * An individual collectible.
 */
export interface Collectible {
  databaseID: string
  name: string
  uniqueName: string
  category: CollectibleCategory
  image?: string
  description?: string
  masteryRequirement?: number
  introduced?: number
  wikiURL?: string
  isVaulted?: boolean
}

/**
 * Types of Collectibles
 */
export type CollectibleCategory = "Warframe" | "Other"

/**
 * Convert a warframe-items Item object to a Collectible object
 * WFCD/warframe-items repo: {@link https://github.com/WFCD/warframe-items}
 *
 * @param data - The Item object from warframe-items
 * @returns - Returns a Collectible object
 */
export function convertItemToCollectible(data: Item): Collectible {
  const name = validName(data.name as string)
  const databaseID = validID(name)

  const newCollectible: Collectible = {
    databaseID: databaseID,
    name: name,
    uniqueName: validUniqueName(data.uniqueName as string),
    category: validCategory(data.category),
  }

  if (newCollectible.category === "Warframe") {
    newCollectible.description = validDescription(data.description)
    newCollectible.image = validImage(data.imageName)
    newCollectible.masteryRequirement = validMasteryRank(data.masteryReq)
    newCollectible.introduced = validVersion(data.introduced)
    newCollectible.wikiURL = validWikiURL(data.wikiaUrl)
    newCollectible.isVaulted = validVaultedStatus(data.vaulted)
  }

  return newCollectible
}
