
// import ghPages from "gh-pages";

import { getGithubRepoInfo } from "./github-utils.mjs";

let repoInfo = await getGithubRepoInfo();
if (Array.isArray(repoInfo)) {
    repoInfo = repoInfo[0];
}
console.log(repoInfo);
