#!/usr/bin/env node

const clipboard = require("copy-paste");
const shell = require("shelljs");
const chalk = require("chalk");

const copied = clipboard.paste();

if (!copied.includes("now.sh")) {
  throw new Error(chalk.red("fish! clipboard doesn't contain a now.sh link!"));
}

const command = `now alias ${copied} poetry-editor`;

shell.exec(command);
