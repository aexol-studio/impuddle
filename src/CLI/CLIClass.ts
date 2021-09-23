import { add, invert } from "../commands/main";

/**
 * basic yargs interface
 */
interface Yargs {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

/**
 * Interface for yargs arguments
 */
interface CliArgs extends Yargs {
  add: string[] | undefined;
  invert: string | undefined;
}
/**
 * Main class for controlling CLI
 */
export class CLI {
  /**
   *  Execute yargs provided args
   */
  static execute = async <T extends CliArgs>(args: T): Promise<void> => {
    if (args.add) {
      if (args.add.length < 3) {
        throw new Error("All arguments needs to be included");
      }
      const remoteUrl = args.add[0];
      const remoteSubPath = args.add[1];
      const destination = args.add[2];
      add({ url: remoteUrl, subPath: remoteSubPath, dest: destination });
    }
    if (args.invert) {
      const remoteUrl = args.invert;
      invert({ url: remoteUrl });
    }
  };
}
