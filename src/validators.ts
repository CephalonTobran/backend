import { CollectibleCategory } from "./collectibles"
import createDOMPurify from "dompurify"
import { JSDOM } from "jsdom"
import kebabCase from "lodash/kebabCase"
import semverCoerce from "semver/functions/coerce"
import isURL from "validator/lib/isURL"
import stripLow from "validator/lib/stripLow"
import trim from "validator/lib/trim"
import matches from "validator/lib/matches"

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)
DOMPurify.setConfig({
  USE_PROFILES: { html: false, svg: false, svgFilters: false, mathMl: false },
  ALLOWED_TAGS: [],
  KEEP_CONTENT: true,
})

/**
 * Check if an input string is devoid of content
 */
export function devoidOfContent(input: string): boolean {
  if (!input) return true
  return false
}

/**
 * Sanitizes and trims a string
 *
 * @param field - If an error is thrown, the field name is used in the error message.
 */
export function cleanString(input: string, field: string = "unknown"): string {
  input = DOMPurify.sanitize(input)
  input = stripLow(input)
  input = trim(input)
  if (devoidOfContent(input))
    throw new Error(
      `The required field "${field}" was not provided or cleaned up to an empty state.`
    )
  return input
}

/**
 * Validates the collectible's id for the database
 */
export function validID(id: string): string {
  id = cleanString(id, "id")
  id = kebabCase(id)
  return id
}

/**
 * Validates the collectible's unique name
 */
export function validUniqueName(uniqueName: string): string {
  uniqueName = cleanString(uniqueName, "uniqueName")
  return uniqueName
}

/**
 * Validates the collectible's name
 */
export function validName(name: string): string {
  name = cleanString(name, "name")
  return name
}

/**
 * Validates the collectible's category
 */
export function validCategory(category: string): CollectibleCategory {
  category = cleanString(category, "category")

  if (category === "Warframes") category = "Warframe"
  else category = "other"

  return category as CollectibleCategory
}

/**
 * Validates the collectible's description
 */
export function validDescription(description: string): string {
  description = cleanString(description, "description")
  return description
}

/**
 * Validates the collectible's description
 */
export function validImage(image: string): string {
  image = cleanString(image, "image")
  // eslint-disable-next-line no-control-regex
  if (matches(image, /[<>:"/\\|?*\x00-\x1F]/g)) return ""

  const fileExt = image.slice(((image.lastIndexOf(".") - 1) >>> 0) + 2)
  if (
    !(
      fileExt === "png" ||
      fileExt === "jpg" ||
      fileExt === "jpeg" ||
      fileExt === "gif"
    )
  )
    return ""

  return image
}

/**
 * Validates the collectible's mastery rank requirement
 */
export function validMasteryRank(MR: number): number {
  MR = Math.floor(Number(MR))
  if (MR < 0) return 0
  else if (MR > 30) return 30
  else return MR
}

/**
 * Validates and converts the collectible's version string to a sort-friendly number
 * @param version - A SemVer version string. E.g.: "12" or "12.2" or "12.2.5"
 * @returns Returns a sort-friendly number. E.g.: 12000000 or 12002000 or 12002005
 */
export function validVersion(version: string): number {
  version = cleanString(version, "introduced")
  const semVer = semverCoerce(version, {
    loose: false,
    includePrerelease: false,
  })
  if (!semVer) return 0

  const major = semVer.major * 1000000
  const minor = semVer.minor * 1000
  const patch = semVer.patch

  return major + minor + patch
}

/**
 * Validates the collectible's wiki URL
 */
export function validWikiURL(url: string): string {
  url = cleanString(url, "wikiURL")
  url = url.replace("http://", "https://")
  if (
    !isURL(url, {
      /* eslint-disable @typescript-eslint/camelcase */
      require_protocol: true,
      require_valid_protocol: true,
      protocols: ["https"],
      require_tld: true,
      require_host: true,
      host_whitelist: ["warframe.fandom.com"],
      allow_protocol_relative_urls: false,
      allow_trailing_dot: false,
      allow_underscores: true,
      disallow_auth: true,
      /* eslint-enable @typescript-eslint/camelcase */
    })
  )
    return ""

  return url
}

/**
 * Validates the collectible's vaulted state
 */
export function validVaultedStatus(status: boolean | string | number): boolean {
  return Boolean(status)
}
