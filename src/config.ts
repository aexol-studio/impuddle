import fs from "fs-extra";
import path from "path";

export interface Config {
  repos: {
    [url: string]: {
      [branch: string]: {
        [subPath: string]: string[];
      };
    };
  };
}

const CONFIG_FILE_NAME = "impuddle.json";
const configPath = path.join(process.cwd(), CONFIG_FILE_NAME);

export const readConfig = () => {
  if (!fs.existsSync(configPath)) {
    const newConfig = <Config>{ repos: {} };
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4));
    return newConfig;
  }
  const fileContent = <Config>(
    JSON.parse(fs.readFileSync(configPath).toString("utf-8"))
  );
  return fileContent;
};

const writeConfig = (cfg: Config) => {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 4));
};

export const updateConfig = (fn: (currentConfig: Config) => Config) => {
  const config = fn(readConfig());
  writeConfig(config);
  return config;
};
