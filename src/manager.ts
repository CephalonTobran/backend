#!/usr/bin/env node

/**
 * Cephalon Tobran (https://github.com/CephalonTobran/backend)
 * Copyright (c) 2020 Ed Rands
 * Licensed under MIT (https://github.com/CephalonTobran/backend/blob/master/LICENSE)
 */

import dotenv from "dotenv"
import yargs from "yargs"
import updateCommand from "./commands/update"
import { formatConsoleMessage } from "./lib/console_messages"

dotenv.config()

const argv = yargs
  .scriptName("manager.ts")
  .env("MANAGER")
  .command(updateCommand)
  .demandCommand(1, formatConsoleMessage("I need at least one command to do anything.\n", "error"))
  .help().argv
