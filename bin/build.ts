#!/usr/bin/env node
import "dotenv/config";

import cli from "../src/cli/cli.js";

cli.parseAsync().then();