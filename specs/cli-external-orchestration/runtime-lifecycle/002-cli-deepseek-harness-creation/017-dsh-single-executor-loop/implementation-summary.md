---
title: "Implementation Summary"
description: "One cli-deepseek-harness lineage now runs in /deep:review and /deep:research :auto. The live keyed proof is still pending."
trigger_phrases:
  - "dsh single executor loop implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-single-executor-loop"
    last_updated_at: "2026-11-14T10:25:58Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Recorded the applied build and its verification"
    next_safe_action: "Record the live single-lineage run against AC-009"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-dsh-single-executor-loop"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-dsh-single-executor-loop |
| **Completed** | Pending. The build landed 2026-11-14 and the live proof is open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now run `/deep:review` or `/deep:research` in `:auto` with one `cli-deepseek-harness` executor. Before, both workflows refused that executor and exited 2, so dsh ran only as a fan-out lineage.

### Phase 17: dsh-single-executor-loop

The single dsh branch in each `:auto` YAML now builds its command through the shared `buildLineageCommand` builder. It starts dsh in the artifact directory with a fresh `DSH_HOME`, the spec folder marker and the gate switch. The prompt opens with a `REPOSITORY ROOT` line. The audited runner takes two new options. `dispatchEnv` adds named values after the env filter. `completionCheck` judges a clean exit, so a run that reports a plugin that did not activate records a `crash` dispatch failure.

The live keyed proof is still pending. A 5-iteration `/deep:review` with one dsh lineage started on 2026-11-14. AC-009 stays unmet until it reports.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Adds `dispatchEnv` and `completionCheck` to the audited runner |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modified | Replaces the refusal with a working single dsh branch |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Replaces the refusal with a working single dsh branch |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modified | Drops the fan-out only wording |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modified | Drops the fan-out only wording |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/fanout-executor.md` | Modified | Names the single `:auto` path and bumps the version to 1.1.3.0 |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modified | Adds the env and completion check cells |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Modified | Checks each dsh branch for the builder, env, prompt and check |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Matches the edited review sources |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerated | Matches the edited research sources |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash max worker ran through `cli-deepseek-harness`. It applied edits E1 to E19 from `plan.md` and ran `compile-command-contracts.cjs --write` for `deep/review` and `deep/research`. It exited 0 with a `completed` final event. The orchestrator then ran the touched tests, typecheck, the drift checks, the YAML loads, the refusal search and the full runtime suite. The stub dsh smoke ran for both YAMLs in both modes. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `buildLineageCommand` for the single branch | One builder keeps the fan-out and single shapes the same |
| Add `dispatchEnv` after the env filter | The filter drops every inherited `DSH_` key, so named values must come after it |
| Judge a clean exit with `completionCheck` | dsh can exit 0 while a plugin failed to start, so the exit code alone hides it |
| Leave the `:confirm` YAMLs alone | Their gap covers five executors, which is its own packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Touched tests, 3 files | PASS. `Test Files  3 passed (3)`, `Tests  13 passed (13)`. Before: 10 |
| `npm run typecheck` | PASS. Exit 0 |
| `check-contract-drift.cjs` for review and research | PASS. `[CONTRACT DRIFT] OK commands=1` each |
| Both `:auto` YAMLs load | PASS. yaml ok |
| Refusal search over assets, presentations and contracts | PASS. No match |
| Ephemeral labels in new comments | PASS. None |
| Full runtime suite | PASS. `Test Files  173 passed (173)`, `Tests  2894 passed, 8 skipped (2902)`, 220.57 s, exit 0. Before: 2891 passed, 8 skipped (2899) |
| Stub dsh smoke, both YAMLs, `ok` and `inactive` | PASS. `exit 0`, `cwd_is_artifact_dir True`, `home_removed_after_run True`, and the `inactive` runs record one `crash` failure |
| Live keyed single-lineage run (AC-009) | PENDING. The 5-iteration run started 2026-11-14 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live proof is open.** AC-009 needs the keyed run to write `iteration-001.md` and an iteration record. Record the result when the run ends.
2. **The `:confirm` YAMLs have no single-executor branch for codex, pi, cursor, devin or dsh.** Use `:auto` for these executors until a later packet adds them.
3. **The smoke needs a temp folder inside the worktree.** With a folder outside it, write containment exits 1 after the dispatch. Place the folder under the worktree and remove it after.
<!-- /ANCHOR:limitations -->


---


