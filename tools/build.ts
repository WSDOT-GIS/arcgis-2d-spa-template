#!/usr/bin/env bun

import { $ } from "bun";

await Promise.all([$`tsc`, $`vite build`]);
