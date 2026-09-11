// R4.1: reproduce fanout write-containment attributing another process's write to the lineage.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MODULE = "/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts";
const { snapshotOutOfScopeDirtyPaths, enforceWriteContainment } = await import(MODULE);

const repo = process.argv[2];
const artifactDir = path.join(repo, "specs/x/001-p/research/lineages/deepseek");
const orchestratorStatus = path.join(repo, "specs/x/001-p/research/orchestration-status.log");
const planDoc = path.join(repo, "specs/x/001-p/plan.md");

// What fanout-run.cjs passes today (fanout-run.cjs:2594-2598): only its own ledgers.
const orchestratorOwnedPaths = [orchestratorStatus];
const opts = {
  repoRoot: repo,
  artifactDir,
  unattributableDirs: [],
  unattributablePaths: orchestratorOwnedPaths,
};

const baseline = snapshotOutOfScopeDirtyPaths(opts);
console.log("baseline out-of-scope dirty paths:", JSON.stringify(baseline));

// 1. The leaf writes its own artifact INSIDE the lineage dir (legal).
fs.writeFileSync(path.join(artifactDir, "iterations", "iteration-001.md"), "# iteration 1\n");

// 2. ANOTHER process edits a tracked packet planning doc during the dispatch window.
spawnSync("bash", ["-c", "printf 'orchestrator planning edit\\n' >> \"$1\"", "_", planDoc]);
console.log("other-process write applied to plan.md");

// 3. The orchestrator appends to its own ledger (exempted whole path).
fs.appendFileSync(orchestratorStatus, "heartbeat\n");

// 4. An unrelated untracked out-of-scope file (should be preserved, advisory only).
fs.writeFileSync(path.join(repo, "specs/x/001-p/stray-untracked.txt"), "stray\n");

const result = enforceWriteContainment({
  ...opts,
  preDispatchDirtyPaths: baseline,
  iteration: 1,
  label: "deepseek",
  stateLogPath: path.join(artifactDir, "deep-research-state.jsonl"),
});

console.log("\n--- enforce result ---");
console.log("fatal violations:", JSON.stringify(result.violations, null, 2));
console.log("advisories:", JSON.stringify(result.advisories, null, 2));
console.log("revert actions:", JSON.stringify(result.revertResult.reverted, null, 2));
console.log("recoveryHint:", result.recoveryHint);
console.log("dataLossPossible:", JSON.stringify(result.event?.dataLossPossible ?? null, null, 2));
console.log("patch path:", result.event?.revertedPatchPath ?? null);

console.log("\n--- post-revert state ---");
console.log("plan.md now:", JSON.stringify(fs.readFileSync(planDoc, "utf8")));
console.log("ledger line count:", fs.readFileSync(orchestratorStatus, "utf8").trim().split("\n").length);
console.log("stray-untracked.txt exists:", fs.existsSync(path.join(repo, "specs/x/001-p/stray-untracked.txt")));
const patchPath = result.event?.revertedPatchPath;
if (patchPath) {
  const patchBody = fs.readFileSync(path.join(repo, "specs/x/001-p/research/lineages/deepseek/containment-reverted", path.basename(patchPath)), "utf8");
  console.log("patch contains orchestrator edit:", patchBody.includes("orchestrator planning edit"));
}
console.log("state log event type:", JSON.parse(fs.readFileSync(path.join(artifactDir, "deep-research-state.jsonl"), "utf8").trim().split("\n").pop()).event);
