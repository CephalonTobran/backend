import dotenv from "dotenv"
import chalk from "chalk"
import isBase64 from "validator/lib/isBase64"

/**
 * Load environment variables from .env file
 */
export function loadEnvironmentVariables() {
  const envResult = dotenv.config()

  if (envResult.error) throw envResult.error.message
  else return envResult.parsed
}

/**
 * Exit the script
 * @param code - The exit code to use.
 */
export function shutdown(code = 1) {
  process.exit(code)
}

/**
 * Display an information message in the console
 */
export function displayInfo(message: string) {
  console.log(chalk.green(message))
}

/**
 * Display an error message in the console
 */
export function displayError(message: string, error?: string, dump?: unknown) {
  console.error(chalk.red(`${message}: ${error}`))
  if (dump) console.dir(dump)
}

/**
 * Display an error message in the console, then quit
 */
export function displayFatalError(
  message: string,
  error?: string,
  dump?: unknown
) {
  displayError(message, error, dump)
  shutdown()
}

/**
 * Decode a base64 string into JSON for Firebase credentials
 */
export function FirebaseServiceAccount(
  key: string = process.env.FIREBASE_ADMINSDK_KEY
) {
  if (!key)
    throw new Error("Firebase Admin credential key is not available or empty.")

  if (!isBase64(key))
    throw new Error(
      "Firebase Admin credential key is not a base64 encoded string."
    )

  key = Buffer.from(key, "base64").toString("ascii")

  return JSON.parse(key)
}
