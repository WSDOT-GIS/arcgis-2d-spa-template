import { promisify } from "node:util";
import { exec } from "node:child_process";

export type RemoteMatch = {
  remote: string;
  url: string;
  direction: string;
};

export interface RepoInfo {
    owner: string,
    repo: string
}

function parseGitUrl(url: string): RepoInfo {
  const parts = url
    .split(/[/]+/)
    .slice(-2)
    .map((s) => s.replace(/\.git/i, ""));
  const [owner, repo] = parts;
  return { owner, repo };
}

/**
 * Retrieves GitHub repo information by executing 
 * `git remote --verbose` and parsing the response.
 * @returns 
 */
export async function getGitRepo() {
  console.group(getGitRepo.name);
  // Execute `git remote --verbose`, then parse
  const re = /\b(?<remote>\S+)\s+(?<url>\S+)\s+\((?<direction>\S+)\)/gi;
  const result = await promisify(exec)("git remote --verbose", {
    encoding: "utf-8",
  });
  const matches = result.stdout.matchAll(re);

  const groups = [...matches].map((m) => m.groups as RemoteMatch);
  console.debug("matches", groups);
  // Remove duplicate URLs.
  const urls = [...new Set(groups.map((g) => g.url))].map(parseGitUrl);
  console.groupEnd();
  return urls.length === 1 ? urls[0] : urls;
}
