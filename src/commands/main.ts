import path from "path";
import fsExtra from "fs-extra";
import { readConfig, updateConfig } from "../config";
import ora from "ora";
import { execSync } from "child_process";

const IMPUDDLE_DIR = path.join(process.cwd(), ".impuddle");

interface Props {
  url: string;
  subPath?: string;
  dest?: string;
  branch?: string;
}

export const add = async ({ url, subPath, dest, branch = "master" }: Props) => {
  if (!subPath || !dest) {
    throw new Error("Remote repository subpath and destination not included");
  }
  const spinner = ora("Adding files from repository\n").start();
  execSync(`git clone -b ${branch} ${url} ${IMPUDDLE_DIR}`, {
    encoding: "utf-8",
  });
  const dir = path.join(process.cwd(), dest);
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
  spinner.stop();
  // cp -r .impuddle subPath
};

export const invert = async ({ url }: Props) => {
  // command to push back to the repository
  const config = readConfig();
  const spinner = ora("Pushing files to repository\n").start();
  if (!config.repos[url]) {
    spinner.stop();
    throw new Error("Invalid invert. Repository does not exist in config");
  }
  Object.keys(config.repos[url]).forEach((branch) => {
    execSync(`git clone ${url} ${IMPUDDLE_DIR} --branch ${branch}`, {
      encoding: "utf-8",
    });
    Object.entries(config.repos[url][branch]).forEach(async (remotePath) => {
      const sourcePath = path.join(process.cwd(), remotePath[1]);
      const destinationPath = path.join(IMPUDDLE_DIR, remotePath[0]);
      fsExtra.copySync(sourcePath, destinationPath);
      execSync(
        `cd ${IMPUDDLE_DIR} && git add . && git commit -m "Inverted commit from impuddle" && git push origin ${branch}`,
        { encoding: "utf-8" }
      );
    });
    fsExtra.removeSync(IMPUDDLE_DIR);
  });
  spinner.stop();
};

export const sync = () => {
  // fetch all entries from git from config
  const spinner = ora("Synchronizing files\n").start();
  const config = readConfig();
  const localBranches = execSync("git branch", {
    encoding: "utf-8",
  })
    .split("\n")
    .map((branch) => branch.trim().replace("* ", ""));
  Object.entries(config.repos).forEach(async ([url, value]) => {
    Object.entries(value).forEach(async ([branch, value]) => {
      if (localBranches.includes(branch)) {
        execSync(`git checkout ${branch}`, {
          encoding: "utf-8",
        });
      } else {
        execSync(`git checkout -b ${branch}`, {
          encoding: "utf-8",
        });
      }
      execSync(`git clone ${url} ${IMPUDDLE_DIR} --branch ${branch}`, {
        encoding: "utf-8",
      });
      Object.entries(value).forEach(async (remotePath) => {
        const destinationPath = path.join(process.cwd(), remotePath[1]);
        const sourcePath = path.join(IMPUDDLE_DIR, remotePath[0]);
        fsExtra.copySync(sourcePath, destinationPath);
      });
      fsExtra.removeSync(IMPUDDLE_DIR);
    });
  });
  spinner.stop();
};
