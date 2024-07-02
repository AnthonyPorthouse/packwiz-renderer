import { Command } from "@commander-js/extra-typings";
import { version } from "../../package.json";
import { buildAction } from "./actions/build.js";

const program = new Command();
program.name("packwiz-renderer");
program.version(version);

program
  .command("build")
  .description("Build the static assets for the given pack")
  .argument("<pack>", "The path to the pack to build")
  .option("-o, --output <dir>", "output directory", ".")
  .action(buildAction);

export default program;
