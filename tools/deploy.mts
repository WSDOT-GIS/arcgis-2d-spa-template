
// import ghPages from "gh-pages";

import { getGitRepo } from "./github-utils.mjs";

const repoTuples = await getGitRepo();
console.log(repoTuples);
