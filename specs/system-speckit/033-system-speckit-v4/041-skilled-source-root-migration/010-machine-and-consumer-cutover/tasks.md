---
title: "Tasks: Phase 10: machine-and-consumer-cutover"
description: "Ordered tasks for cutting this machine's global git hooks, home configs and consumer links over to .skilled: read-only census and readiness first, then backups, the landing bracket, one item at a time and the probes, each task with its executor."
trigger_phrases:
  - "skilled machine cutover tasks"
  - "hook bridge task order"
  - "home config cutover checklist"
  - "consumer link cutover tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: machine-and-consumer-cutover

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[Orchestrator]` | The Opus session running this phase executes it directly |
| `[DeepSeek]` | DeepSeek V4.1 Flash, thinking max, on cli-pi through the LLM Gateway, classifying census rows only |

**Task Format**: `T### [P?] [Executor] Description (file path)`

Shell variables (`MAIN`, `B`, `HOOKS`, `BRIDGE`, `A`, `PRE`) and evidence IDs (E1 to E25) are defined in `plan.md` section 1. Items H1, C1, C2, R1, P1, C3 and the consumer steps are specified in `plan.md`, with their exact commands.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Read only. Nothing on the machine changes before T010.

- [x] T001 [Orchestrator] Check upstream readiness and halt on any gap: phase 009 validates PASSED with a clean rescan, phase 004's record names the `.opencode/` shape, the consumer contract and the landing step, phase 005's hook bodies handle a checkout with only `.opencode/`, phase 006's `install-git-hooks.sh` sources `.skilled/scripts/git-hooks` and phase 008's `.codex/hooks.json` in worktree 055 names 18 `.skilled/` adapters (`grep -c '\.skilled/' .codex/hooks.json`). A phase 004 shape that breaks consumer paths is a LOGIC-SYNC against parent decision D5 (`plan.md` consumer section)
- [x] T002 [Orchestrator] Record in the parent goal log that both installers run from `MAIN`, since they refuse or mis-bind from a worktree (`install-codex-hooks.mjs:290-322`, `install-git-hooks.sh:24`), and that consumer roots on this machine fall under D2's machine pre-authorization. Without that record, T019 does not start and the gap goes to the operator as an amendment to D2 (`../goal.md`)
- [x] T003 [Orchestrator] Rerun the evidence ledger commands E1 to E17 and E22 to E24, writing one row per finding to `scratch/home-census-raw.tsv` with columns path, kind, key-or-line, link-target and count, values never printed
- [x] T004 [P] [DeepSeek] Unit `home-census-classify`: classify `scratch/home-census-raw.tsv` against `../002-per-runtime-reference-map/research/maps/map-b-home.tsv` into `scratch/home-census-classified.tsv` (`plan.md` delegation section)
- [x] T005 [Orchestrator] Rerun E18 to E21, writing one row per consumer link to `scratch/consumer-links-raw.tsv`: root, link target, tracked and ignored state, root files it links from `MAIN`, consumer-owned paths with their pre-landing `test -e` result, local `core.hooksPath` and its links
- [x] T006 [P] [DeepSeek] Unit `consumer-census-classify`: classify `scratch/consumer-links-raw.tsv` against phase 004's consumer contract into `scratch/consumer-links-classified.tsv`
- [x] T007 [Orchestrator] Verify both delegate returns: row counts equal their inputs, every row that drives an action is opened against the raw census and `git status --porcelain` in worktree 055 shows only the two output files as new. Record the verification in `goal.md`
- [x] T008 [Orchestrator] Settle from the installed Codex's own help or documentation whether codex-cli 0.154.0 loads `~/.codex/prompts/`, and record the answer with its source in `goal.md`
- [x] T009 [Orchestrator] Capture baselines into `scratch/cutover-baseline.txt`: `install-git-hooks.sh --status` and `install-codex-hooks.mjs --check` from `MAIN`, and `shasum -a 256` of every in-scope home file
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One item at a time. Each item's backup is refreshed immediately before its own change, and its check passes before the next task starts.

- [x] T010 [Orchestrator] Create `B` with mode 700 and back up every item: `~/.config/git/hooks/` with `B/git-hooks-links.tsv`, `B/core-hooks-path.txt`, `~/.gitconfig`, `~/.codex/hooks.json`, `~/.codex/config.toml`, `~/.hermes/config.yaml`, `~/.pi/agent/SYNC.md`, `~/.codex/prompts/` and `$A/.git/hooks/`. Write one row per item to `B/manifest.tsv` with five columns (item, path, kind, checksum-or-target, restore-command), and check each copy with `cmp` or `diff -r` (`plan.md` item H1 rollback)
- [x] T011 [Orchestrator] Run checkpoint 1 on `$HOOKS`, then build `$BRIDGE` from the files the global links resolve to, with `cmp` and `test -x` on each copy (`plan.md` item H1)
- [x] T012 [Orchestrator] Gate the landing: `git -C "$MAIN" status --porcelain -- .opencode` prints nothing (E23 shows one modified file today), and record `PRE` as `git -C "$MAIN" rev-parse HEAD` in `goal.md`
- [x] T013 [Orchestrator] Point `core.hooksPath` at `$BRIDGE`, record the timestamp and run checkpoint 2 on `$BRIDGE`
- [x] T014 [Orchestrator] Run the landing exactly as phase 004's frozen sequence writes it, then run checkpoint 3 on `$BRIDGE` and `test -d "$MAIN/.skilled/scripts/git-hooks"`
- [x] T015 [Orchestrator] Relink `$HOOKS` while it is inactive: require `main checkout confirmed`, move the old links to `B/replaced-links/`, run the installer from `MAIN` with `GIT_CONFIG_COUNT` pointing at `$HOOKS`, require one `installed:` line per hook naming `$HOOKS` and `$MAIN/.skilled/scripts/git-hooks/`, then run checkpoint 4
- [x] T016 [Orchestrator] Point `core.hooksPath` back at `$HOOKS`, record the timestamp and run checkpoint 5
- [x] T017 [Orchestrator] Item C1: dry-run `install-codex-hooks.mjs` from `MAIN` and install only on added 18, removed plus orphaned 18 and kept 15, then require `--check` to print OK (`~/.codex/hooks.json`)
- [x] T018 [Orchestrator] Item C2: confirm no `.skilled` table exists yet, rewrite the line 21 header and `diff` against `B/codex-config.toml` (`~/.codex/config.toml`)
- [x] T019 [Orchestrator] Consumer links: for each `add` row in `scratch/consumer-links-classified.tsv`, create the absolute `.skilled` link and the local exclude line, skipping existing entries and the 30 temporary `AI Systems` worktrees, and append each link to `B/consumer-links-created.tsv`. Starts only after T002's record exists
- [x] T020 [Orchestrator] `anobel.com` hooks: `test -e` each link in `$A/.git/hooks/`, and reinstall from `$A` only if one fails (`plan.md` consumer section)
- [x] T021 [Orchestrator] Item R1: rewrite or keep line 17 per goal decision D4, and `diff` against `B/hermes-config.yaml` (`~/.hermes/config.yaml`)
- [x] T022 [Orchestrator] Item P1: rewrite the two `.opencode` paths and `diff` against `B/pi-sync.md` (`~/.pi/agent/SYNC.md`)
- [x] T023 [Orchestrator] Item C3 per T008's answer: rewrite only the stubs whose target exists or record the directory as a record, then `diff -r` against `B/codex-prompts` (`~/.codex/prompts/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 [Orchestrator] V1: every link in `$HOOKS` names `$MAIN/.skilled/scripts/git-hooks/<hook>`, `core.hooksPath` prints `/Users/michelkerkmeester/.config/git/hooks` and `--status` shows no `SHADOWED` line
- [x] T025 [Orchestrator] V2 in a scratch repository: the non-conforming subject exits 1 with the `BLOCKED` line, the trace pattern is confirmed on `pre-commit` first and the trace names all seven hooks. Delete the repository afterwards (`plan.md` section 5)
- [x] T026 [Orchestrator] V3 in a shared clone of `MAIN` at `PRE`: one conforming commit with `SPECKIT_SKIP_PREPARE_COMMIT_MSG=1` exits 0 and traces `pre-commit`, `prepare-commit-msg`, `commit-msg` and `post-commit`. Delete the clone afterwards
- [x] T027 [Orchestrator] V4 for consumers: the root sentinel through every `.opencode` and created `.skilled` link, every root file from E20, the 4 pre-landing live paths from E21, an empty `git status --porcelain -- .skilled` per root and a consumer-shaped scratch repository commit
- [x] T028 [Orchestrator] V5 to V9: the E6 census shows 33 entries with 0 `.opencode/` and 18 `.skilled/` identities, and the three config diffs and the prompt stubs match their items in `plan.md`
- [x] T029 [Orchestrator] Delete `$BRIDGE` once T024 to T028 pass, and confirm `git config --global --get core.hooksPath` still prints `/Users/michelkerkmeester/.config/git/hooks`
- [x] T030 [Orchestrator] Rerun the T003 commands into `scratch/residue-census-raw.tsv`, and compare the checksums of `~/.pi/agent/trust.json` and `~/.zshrc` with `scratch/cutover-baseline.txt`
- [x] T031 [P] [DeepSeek] Unit `residue-census-classify`: classify `scratch/residue-census-raw.tsv` into `scratch/residue-census-classified.tsv`
- [x] T032 [Orchestrator] Verify T031's return the way T007 did, and require zero `must-fix` rows
- [x] T033 [Orchestrator] Restorability check without touching a live file: each copy's checksum matches `B/manifest.tsv`, each restore command's source exists and the link set rebuilt from `B/git-hooks-links.tsv` in a temporary directory matches it by `readlink`
- [x] T034 [Orchestrator] Record in the parent goal log the other-machine checklist as the operator's item, the map B corrections, the checkpoint timestamps and every deviation, and update this phase's `goal.md` log
- [x] T035 [Orchestrator] Run `validate.sh --strict` on this phase and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 to T035 are marked `[x]`, each with its evidence in `goal.md` or `B/manifest.tsv`
- [x] No `[B]` task remains
- [x] Every P0 and P1 item in the Verification Checklist is checked, or a P1 deferral carries the operator's approval
- [x] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` for the evidence ledger, the landing bracket, per-item commands, the consumer and other-machine sections and delegation
- **Acceptance**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Research**: `../001-deep-research/research/research.md` sections 5 and 8, and `../002-per-runtime-reference-map/research/maps/map-b-home.tsv`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] REQ-001 to REQ-012 are documented in `spec.md`
- [x] CHK-002 [P0] Every item in `plan.md` states its current state with evidence, its change, timing, rollback and verification
- [x] CHK-003 [P0] T001's readiness checks pass for phases 004, 005, 006, 008 and 009
- [x] CHK-004 [P1] T002's record about main-checkout work and consumer roots is in the parent goal log
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every home-config edit changed only its planned line, shown by `diff` against its backup
- [x] CHK-011 [P0] No generated state was edited by hand: `~/.codex/hooks.json` changed only through `install-codex-hooks.mjs`, and `~/.config/git/hooks/` only through `install-git-hooks.sh`
- [x] CHK-012 [P1] Every installer ran from `MAIN` or a temporary directory, never from worktree 055 or another linked worktree
- [x] CHK-013 [P1] Apart from phase 004's landing, no tracked file changed in `MAIN` or in any consumer repository (`git status --porcelain` in each)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Checkpoints 1 to 5 each printed no `FAIL` line and the expected entry count
- [x] CHK-021 [P0] V2 blocked the non-conforming subject and traced all seven hooks
- [x] CHK-022 [P0] V4 passed for every consumer link, linked root file and pre-landing live path
- [x] CHK-023 [P1] V3 passed in the shared clone at `PRE`
- [x] CHK-024 [P1] V5 to V9 passed, and the residue census holds zero `must-fix` rows
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every census row carries a class: `config`, `record`, `backup`, `link` or `none`
- [x] CHK-FIX-002 [P0] The same-class inventory is complete: the evidence ledger ran before and after the change, and every home-level place that names an `.opencode` path appears in it
- [x] CHK-FIX-003 [P0] The consumer inventory is complete: every repository on the global hooks, every runtime config and every consumer link from E18 to E22
- [x] CHK-FIX-004 [P0] The adversarial cases were exercised: the T015 main-checkout assertion with worktree 055's path in place of `MAIN` prints nothing, legacy links were moved aside before the installer ran, the Codex dry-run would have caught 33 kept entries and a session self-heal during the bracket found only regular files
- [x] CHK-FIX-005 [P1] The matrix of phase 004 shape against item is recorded, with the chosen row marked
- [x] CHK-FIX-006 [P1] Hostile environment checked: `SYSTEM_HOOKS_DISABLED` and `MK_HOOKS_DISABLED` unset for every installer run, and `SPECKIT_AUTOSYNC` and `SPECKIT_LIVE_BRANCH` unset for every probe commit
- [x] CHK-FIX-007 [P1] Evidence is pinned to `PRE` and to the landed commit SHA, not to a branch name
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret value appears in any brief, log, census file or spec document, and every delegate brief names only files under `scratch/` or `research/maps/`
- [x] CHK-031 [P0] `B` is mode 700 and sits outside every repository and outside `~/MEGA`
- [x] CHK-032 [P1] No hook link names a linked worktree, checked against `git -C "$MAIN" worktree list`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` agree on counts, task IDs and item names
- [x] CHK-041 [P1] The parent goal log records the other-machine checklist, the map B corrections and every deviation
- [x] CHK-042 [P2] `implementation-summary.md` records the checkpoint timestamps and the path of `B/manifest.tsv`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Census and classification files sit in `scratch/` under kebab-case names
- [x] CHK-051 [P1] Probe repositories, the shared clone and the bridge directory are deleted, and scratch files are cleaned or summarized in `implementation-summary.md` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-17. The machine and its four consumer roots resolve the new source root, and the backup root holds a restore command per item.
<!-- /ANCHOR:summary -->

---
