# Iteration 005

## Focus

Q5 only: trace how an operator gets and updates the framework, the post-apply rebuild or reindex handoff, release documentation, and recovery after failed or interrupted apply.

## Actions Taken

- Read the Public release model, the .skilled/bin and .skilled/scripts inventories, /doctor:update and /doctor:rebuild routers, update presentation and apply workflow, relevant release-engine lock/rollback paths, and the Skilled release index.
- Searched the install/sync and release-note surfaces for an operator path.
- No tests or implementation commands were run; this iteration is a read-only audit.
- Ruled out a missing rebuild handoff: apply workflow phase 6 prompts for /doctor:rebuild and records rebuilt, skipped, or failed; skipped and failed outcomes warn that the index may be stale (doctor-update-apply.yaml:183-189, 191-195; doctor-update-presentation.txt:265-282).

## Findings

1. **P1 — Interrupted apply can strand a partial checkout behind an un-clearable documented lock.** The engine creates .skilled/release/.apply.lock exclusively and stores pid/start time (release-update.cjs:1775-1794), writes rollback.json before applying files one at a time (1889-1902), then releases the lock in finally (1903-1905). **Inference:** forced termination such as SIGKILL bypasses JavaScript finally. The workflow refuses an existing lock and says not to remove it (doctor-update-apply.yaml:98, 129-131), while engine rollback must acquire that same lock (release-update.cjs:2035-2059). The documented recovery path therefore cannot reach rollback after a forced interruption; a partial tree may remain, and the phase-based terminal state record is bypassed (doctor-update-apply.yaml:191-195). Add a verified stale-owner recovery path before resuming or rolling back, and cover interruption recovery.

2. **P2 — A copied .skilled tree has no clear documented acquisition/sync route.** Public release docs say consuming projects use an .opencode symlink and that the old sync step is eliminated (PUBLIC-RELEASE.md:3, 21-28, 74-76). The .skilled/bin inventory says git-sync.sh publishes committed work to the live branch for CI (README.md:27; git-sync.sh:3-9), while the scripts inventory says its install entrypoint installs Git hooks (scripts/README.md:16, 22-28; install-git-hooks.sh:2-16). In contrast, /doctor:update documents a first run after copying/installing .skilled and the required base recording, but not how a copied tree acquires the next release (update.md:68; doctor-update-presentation.txt:82-88). Clarify the supported deployment mode and the release source/update path for copied trees.

3. **P2 — The release-note index is stale.** It says current top-level entries stop at v4.0.0.2 and identifies .2 as upcoming (changelog/skilled/README.md:22-25), but v4.0.0.3.md is present and titled v4.0.0.3 (v4.0.0.3.md:2, 12). Refresh the index to keep installed-release identification and release-note lookup reliable.

## Questions Answered

- **Q5 answered:** the highest-severity operator recovery blocker is the stale-lock dead end after forced interruption. Two P2 documentation gaps remain: copied-tree acquisition/sync guidance and the stale release-note index. The post-apply /doctor:rebuild prompt and explicit skipped/failed outcomes are already documented.

## Questions Remaining

- Q1-Q4 remain for the other iterations; this pass answered Q5 only.

## Next Focus

- Iteration 6: independent pass over the full /doctor:update surface, following the run's stop condition.

