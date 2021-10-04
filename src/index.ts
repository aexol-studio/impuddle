#!/usr/bin/env node
import { welcome } from "./welcome";
import * as yargs from "yargs";
import { AddConf, InvertConf } from "Configuration";
import { add, invert, sync } from "./commands/main";

welcome().then(() => {
  return yargs
    .usage("Usage: $0 <command> [options]")
    .help("h")
    .alias("help", "h")
    .command(
      "add <url> <subPath> <dest>",
      "Add files from remote repository to selected path.",
      async (yargs) => {
        yargs
          .positional("url", {
            describe: "url to remote repository",
            type: "string",
          })
          .positional("subPath", {
            describe: "path to remote folders or files",
            type: "string",
          })
          .positional("dest", {
            describe: "local destination path",
            type: "string",
          });
      },
      async (argv) => {
        add(
          argv as unknown as Pick<
            AddConf,
            "dest" | "subPath" | "url" | "branch"
          >
        );
      }
    )
    .option("branch", {
      alias: "b",
      describe: "Branch from which the files are downloaded",
      string: true,
      default: "master",
    })
    .command(
      "invert <url>",
      "Push back files to selected repository",
      async (yargs) => {
        yargs.positional("url", {
          describe: "URL to remote repository",
          type: "string",
        });
      },
      async (argv) => {
        invert(argv as unknown as Pick<InvertConf, "url">);
      }
    )
    .command("sync", "Fetch all entries from git from config", async () => {
      sync();
    })
    .showHelpOnFail(true)
    .demandCommand()
    .epilog("Bye!").argv;
});
