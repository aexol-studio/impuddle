// import { clone, commit, add as addGit, push } from "isomorphic-git";
import path from "path";
// import fs from "fs";
import fsExtra from "fs-extra";
// import http from "isomorphic-git/http/node";
import { readConfig, updateConfig } from "../config";
import ora from "ora";
import { exec } from "child_process";

const IMPUDDLE_DIR = path.join(process.cwd(), ".impuddle");

interface Props {
  url: string;
  subPath?: string;
  dest?: string;
  branch?: string;
}

export const add = async ({ url, subPath, dest, branch = "main" }: Props) => {
  if (!subPath || !dest) {
    throw new Error("Remote repository subpath and destination not included");
  }
  const spinner = ora("Cloning from repository").start();
  exec(`git clone ${url} ${IMPUDDLE_DIR}`, (error) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    const dir = path.join(process.cwd(), dest);
    spinner.text = "Update config";
    fsExtra.copySync(path.join(IMPUDDLE_DIR, subPath), dir);
    fsExtra.removeSync(IMPUDDLE_DIR);
    updateConfig((cfg) => {
      if (!cfg.repos[url]) cfg.repos[url] = {};
      if (!cfg.repos[url][branch]) cfg.repos[url][branch] = {};
      if (cfg.repos[url][branch][subPath] !== dest) {
        cfg.repos[url][branch][subPath] = dest;
      }
      return {
        ...cfg,
      };
    });
  });

  spinner.stop();
  // cp -r .impuddle subPath
};

export const invert = async ({ url }: Props) => {
  // command to push back to the repository
  const config = readConfig();
  // const spinner = ora("Reading config").start();
  if (!config.repos[url]) {
    // spinner.stop();
    throw new Error("Invalid invert. Repository does not exist in config");
  }
  // spinner.text = "Pushing files";
  Object.keys(config.repos[url]).forEach((branch) => {
    exec(`git clone ${url} ${IMPUDDLE_DIR} --branch ${branch}`, (error) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      Object.entries(config.repos[url][branch]).forEach(async (remotePath) => {
        const dir = path.join(process.cwd(), remotePath[1]);
        const dir2 = path.join(IMPUDDLE_DIR, remotePath[0]);
        await fsExtra.copy(dir, dir2);
      });
      exec(
        `cd ${IMPUDDLE_DIR} && ls -lh && git add . && git commit -m "Inverted commit from impuddle" && git push origin ${branch}`,
        (error, stderr) => {
          if (stderr) {
            console.log("Dawdaw", stderr);
          }
          fsExtra.removeSync(IMPUDDLE_DIR);
          if (error) {
            console.error(`error: ${error.message}`);
            return;
          }
        }
      );
    });
  });
};

export const sync = () => {
  // fetch all entries from git from config
  const config = readConfig();
  Object.entries(config.repos).forEach(async ([url, value]) => {
    Object.entries(value).forEach(async ([branch, value]) => {});
  });
};
