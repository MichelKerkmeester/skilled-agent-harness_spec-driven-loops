// R3.2: evaluate the real rule engine with the command's true cwd vs the session cwd.
import { GIT_CHECKS } from "/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs";
import { createGitContext } from "/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/skills/sk-git/scripts/lib/git-context.mjs";

const [command, cwd, label] = process.argv.slice(2);
const ctx = createGitContext(cwd);
const fired = [];
for (const [id, check] of Object.entries(GIT_CHECKS)) {
  let verdict = true;
  try { verdict = check(command, ctx); } catch { verdict = true; }
  if (verdict === false) fired.push(id);
}
console.log(`${label}`);
console.log(`  command: ${command}`);
console.log(`  context cwd: ${cwd}`);
console.log(`  advisories fired: ${fired.length ? fired.join(", ") : "(none)"}`);
