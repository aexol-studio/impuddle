import { add } from "./commands/main";

const [, , url, subPath, dest] = process.argv;

add({ url, subPath, dest });
