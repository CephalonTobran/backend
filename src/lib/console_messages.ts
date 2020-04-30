import chalk from "chalk"

const info = chalk.blue
const success = chalk.green
const warning = chalk.keyword("orange")
const error = chalk.red

/**
 * Types of console messages
 */
export type ConsoleMessageTypes = "default" | "info" | "success" | "warning" | "error"

/**
 * Format a string for console output
 * @param message - The message to format
 * @param type - The type of message. Determines the color of the output.
 */
export function formatConsoleMessage(
  message: string,
  type: ConsoleMessageTypes = "default"
): string {
  if (type === "info") return info(message)
  else if (type === "success") return success(message)
  else if (type === "warning") return warning(message)
  else if (type === "error") return error(message)
  else return message
}

/**
 * Output a message in the console
 * @param message - The message to display
 * @param type - The type of message. Determines text color
 * @param dump - A variable to dump to the console along with the message
 * @param fatal - Whether or not to terminate the script after displaying the message
 */
export function displayConsoleMessage(
  message: string,
  type: ConsoleMessageTypes = "default",
  dump: unknown = undefined
) {
  if (type === "error") console.error(formatConsoleMessage(message, "error"))
  else console.log(formatConsoleMessage(message, type))

  if (dump) console.dir(dump)
}
