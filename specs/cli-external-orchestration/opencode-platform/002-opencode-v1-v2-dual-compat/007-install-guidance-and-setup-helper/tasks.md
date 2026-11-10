---
title: "Tasks: Phase 7: install-guidance-and-setup-helper"
description: "Task Format: T### [P?] Description (file path). Each task names its executor at the end of the line."
trigger_phrases:
  - "install guidance and setup helper tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: install-guidance-and-setup-helper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed, with evidence in the log |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) (executor)`

Executors: **Luna** is GPT-6 Luna max fast through cli-codex. **DeepSeek** is DeepSeek V4.1 Flash max through cli-devin. **Orchestrator** is the operator session that runs every npm install and every proof.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Save the operator snapshot to `scratch/snapshot-before.txt`. Record the names and link targets in `~/.local/bin` and `~/.local/opencode-v2/bin`, the `--version` output of each name, the process list, and the modification times of the top-level entries in `~/.config/opencode` and `~/.local/share/opencode`. (Orchestrator) Evidence: scratch/snapshot-before.txt; the closing comparison uses scratch/bracket/before.txt, taken with the revised snapshot that launches no binary (decision 16).
- [x] T002 [P] Create `scratch/home` and `scratch/npm-cache`. Confirm that `command -v opencode` under the proof PATH resolves nowhere, before any proof. (Orchestrator) Evidence: scratch/preflight.txt, `opencode` and `opencode2` resolve nowhere under the proof PATH.
- [x] T003 Confirm the registry answers for both pinned packages: `npm view opencode-ai@1.19.3 version` prints `1.19.3`, and `npm view @opencode/cli@2.0.32 version` prints `2.0.32`. (Orchestrator) Evidence: scratch/preflight.txt, 1.19.3 and 2.0.32.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the helper. It has four modes, the constants from plan.md section 3, a step printer that prints each rollback line, the refusals for `v1` and `v2`, and a launcher written last. It derives every path from HOME. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (Luna) Evidence: scripts/opencode-setup.sh. Written by DeepSeek, not Luna, after the operator asked to use DeepSeek wherever possible; Luna moved to review (decision 0).
- [x] T005 Run `bash -n` on the helper. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (Orchestrator) Evidence: scratch/final/static-checks.txt, bash -n and shellcheck exit 0.
- [x] T006 [P] Review the helper against iteration-015 lines 143 to 197 and `sk-code/sk-code-opencode`. Report findings first, with the line for each. Make no edits. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (DeepSeek) Evidence: scratch/review-helper-luna.txt. Reviewed by Luna, the executors swapped with T004 (decision 0).
- [x] T007 Fix each finding that the orchestrator confirms. Copy the helper to `scratch/backup/fix-<n>/` before each fix. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (Luna) Evidence: decisions 9 to 28; a backup was taken before each fix and deleted at closeout (decision 24), and scratch/fix-6.diff, fix-7.diff and fix-8.diff keep the last three changes as text. Fixed by DeepSeek (decision 0).
- [x] T008 [P] Write the install reference in the sk-doc skill mode. Cover the layouts, the launcher, `OPENCODE_DB`, the shared config, Homebrew, the `--major` warning, the method and log-level divergences, and the gaps. Label each claim confirmed, documented or unknown. (`.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md`) (DeepSeek) Evidence: references/install-and-versions.md.
- [x] T009 Check each claim in the reference against iteration-015 and research sections 7 and 8. Report each mismatch with its source line. Make no edits. (`.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md`) (Luna) Evidence: scratch/review-reference-luna.txt, then review-verify-luna.txt to review-verify7-luna.txt.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `both` in the throwaway environment from plan.md section 4.3. Record the exit status, the output of `opencode --version` and `opencode2 --version`, and the `sh -x` trace of the launcher that shows `OPENCODE_DB`. (Orchestrator) Evidence: scratch/final/both-1.txt exit 0, `1.19.3 [v1]` and `opencode v2.0.32 [v2]`; scratch/final/launcher-trace.txt shows `: opencode-v2.db` and `export OPENCODE_DB`.
- [x] T011 Run `both` a second time. Compare the hashes of the launcher and of each link target before and after. Expect no change. Record the rollback lines printed. (Orchestrator) Evidence: scratch/final/both-2.txt, both installs skipped, launcher left unchanged, each rollback line printed; scratch/final/idempotence.txt, the tree hash is c3084e25dcecce17 after run 1 and after run 2 (decisions 19, 21, 23, 26 and 28).
- [x] T012 Run `check` on the throwaway layout. Record the output. Compare the file hashes again. (Orchestrator) Evidence: scratch/final/check.txt exit 0; the same tree hash after check, and scratch/final/files-changed-by-check.txt is empty.
- [x] T013 Put a fake `opencode` that prints `1.19.3` on the throwaway PATH, under `scratch/fakes/`, and run `v2`. Then put a fake that prints `opencode v2.0.32`, and run `v1`. Expect exit 1 and the `both` hint both times. (Orchestrator) Evidence: scratch/final/adversarial.txt, exit 1 and the `both` hint each way, no file written; plus the malformed, shape, npm-missing, spaces and symlink rows.
- [x] T014 Validate the reference: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md --type install_guide`. Record the output. (Orchestrator) Evidence: scratch/final/validator.txt, 0 issues, exit 0. The validator lives at `.skilled/skills/sk-doc/shared/scripts/validate_document.py`; the path in this task does not exist.
- [x] T015 Repeat T001 and compare it with `scratch/snapshot-before.txt`. Record every difference. Expect none. (Orchestrator) Evidence: scratch/bracket/before-after.diff names opencode.db-shm and opencode-next.db-shm only, which the live service moves with nothing else running (decision 16, old-proofs/fix3/bracket/noise-*.txt). No difference is caused by the proof; the two shm timestamps also move with nothing of the orchestrator's running, so the literal "none" is not observable on a machine with a live service.
- [x] T016 Run the final-state checks in CHK-012 and CHK-030 and CHK-031. Check `git status` for the scoped files. Confirm the only new files are the helper and the reference. Delete the scratch content after the implementation summary records the output. (Orchestrator) Evidence: scratch/final/static-checks.txt; scratch/final/scope-check.txt, where the only new tracked-path files are the helper and the reference, apart from the untracked sk-vision build output that is never committed. The throwaway installs, npm cache and fakes are deleted; the cited captures are kept, as phases 2 to 6 amended this cleanup.
- [x] T017 Fill the evidence cells in acceptance-criteria.md and the implementation summary with the recorded outputs. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator) Evidence: acceptance-criteria.md and implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion is Met or Waived with an ADR
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] spec.md REQ-001 to REQ-008 each map to an acceptance criterion in acceptance-criteria.md, or to a CHK row here. Evidence: REQ-001, 002 and 005 map to AC-001, REQ-003 to AC-002, REQ-004, 007 and 008 to AC-003, REQ-006 to CHK-023.
- [x] CHK-002 [P0] The operator snapshot exists before the first proof (T001). Evidence: scratch/snapshot-before.txt predates the first proof; scratch/bracket/before.txt predates the final one.
- [x] CHK-003 [P0] Before each proof, `command -v opencode` under the proof PATH resolves only inside `scratch/home`. Evidence: proof-all.sh stops with `STOP` when `opencode` resolves; no final output contains it.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` exits 0 with no output. Evidence: scratch/final/static-checks.txt, exit 0, no output.
- [x] CHK-011 [P1] The helper quotes every path and sets strict mode, or states why it does not. Read the head of the script. Evidence: `set -euo pipefail` at line 15; shellcheck clean.
- [x] CHK-012 [P0] The helper runs no `uninstall`, `upgrade` or `service` command. Command: `rg -n 'uninstall|upgrade|service' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`. Each hit must sit inside a printed rollback line or a usage string. Evidence: scratch/final/static-checks.txt, every hit is a `[rollback, never run]` line or its warning text.
- [x] CHK-013 [P1] Each step in the proof output prints its rollback line (T010 and T011). Evidence: scratch/final/both-1.txt and both-2.txt.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 proof is recorded: T010 and T011. Evidence: T010 and T011.
- [x] CHK-021 [P0] AC-002 check is recorded: T012. Evidence: T012.
- [x] CHK-022 [P0] AC-003 validation is recorded: T014. Evidence: T014.
- [x] CHK-023 [P1] The refusal cases are recorded: T013. Evidence: T013.
- [x] CHK-024 [P0] The operator snapshot after the proof equals the snapshot before it: T015. Evidence: T015. No difference caused by the proof; the two shm timestamps move with the live service alone (decision 16).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Not applicable. This phase adds a helper and a reference, and it changes no existing behaviour.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Command: `rg -n -i 'token|secret|password' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` returns nothing. Evidence: scratch/final/static-checks.txt, no hit, exit 1.
- [x] CHK-031 [P0] No `sudo` and no pipe from a download into a shell. Command: `rg -n 'sudo|curl[^|]*\|' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` returns nothing. Evidence: scratch/final/static-checks.txt, no hit, exit 1.
- [x] CHK-032 [P1] The helper writes only under the resolved prefixes and the launcher path. Reviewed in T006 and T009. Amended with NFR-S01: plus one temporary probe folder in the system temp area, removed on exit (decision 22). Evidence: review-helper-luna.txt and review-verify7-luna.txt; the launcher symlink refusal in adversarial.txt. Symlinked parent folders are followed by design (decision 15, accepted in review-verify2-luna.txt).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the modes, the constants and the open questions. Evidence: the four modes and the constants agree; the T004, T006 and T007 executor swap is decision 0.
- [x] CHK-041 [P1] Each comment in the helper states the durable reason. No comment carries a phase, task or packet label. Evidence: scratch/final/static-checks.txt, no comment names a phase, task or packet, exit 1.
- [x] CHK-042 [P2] Deferred to 010. The `SKILL.md` link to the reference is added in the doc sweep. Deferred to 010 as planned.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Amended with NFR-S01: the helper's own probe folder lives in the system temp area and is removed on exit (decision 22). Evidence: every proof wrote under scratch/; the interrupt proofs used the session scratchpad; scratch/interrupt-probe-dir.txt shows no probe folder left.
- [x] CHK-051 [P1] Amended, as phases 2 to 6 amended it: `scratch/` keeps every cited text capture, and removes the working files. Original wording: `scratch/` holds no proof output when the phase closes, except `.gitkeep`. Evidence: scratch/home, npm-cache, fakes and backup are deleted (decisions 24, 26 and 28). What remains is the text captures these docs cite, plus the three proof scripts that produced them (proof-all.sh, proof-env.sh, snapshot.sh), kept so the proof can be rerun.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 9 | 9/9 (CHK-051 amended) |
| P2 Items | 1 | 1/1 (deferred to 010) |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
