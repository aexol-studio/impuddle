import * as yargs from "yargs";
import { CLI } from "./CLIClass";

const args = yargs
  .usage(
    `
Impuddle
Universal code manager for fetching whole repos, certain folders or certain files from repositories

Usage:
    imp --add <url> <remote folders> <local folders>
    imp --invert <url>
    imp --help
    imp --version
`
  )
  .option("add", {
    alias: "a",
    describe: "add files from remote repository to selected path",
    array: true,
    string: true,
  })
  .option("invert", {
    alias: "i",
    describe: "push back files to repository",
    string: true,
  })
  .demandCommand(0).argv;
CLI.execute(args);
