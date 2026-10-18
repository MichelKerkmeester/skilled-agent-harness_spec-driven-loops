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

- [ ] T001 [P] Save the operator snapshot to `scratch/snapshot-before.txt`. Record the names and link targets in `~/.local/bin` and `~/.local/opencode-v2/bin`, the `--version` output of each name, the process list, and the modification times of the top-level entries in `~/.config/opencode` and `~/.local/share/opencode`. (Orchestrator)
- [ ] T002 [P] Create `scratch/home` and `scratch/npm-cache`. Confirm that `command -v opencode` under the proof PATH resolves nowhere, before any proof. (Orchestrator)
- [ ] T003 Confirm the registry answers for both pinned packages: `npm view opencode-ai@1.19.3 version` prints `1.19.3`, and `npm view @opencode/cli@2.0.32 version` prints `2.0.32`. (Orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the helper. It has four modes, the constants from plan.md section 3, a step printer that prints each rollback line, the refusals for `v1` and `v2`, and a launcher written last. It derives every path from HOME. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (Luna)
- [ ] T005 Run `bash -n` on the helper. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (Orchestrator)
- [ ] T006 [P] Review the helper against iteration-015 lines 143 to 197 and `sk-code/sk-code-opencode`. Report findings first, with the line for each. Make no edits. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (DeepSeek)
- [ ] T007 Fix each finding that the orchestrator confirms. Copy the helper to `scratch/backup/fix-<n>/` before each fix. (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`) (Luna)
- [ ] T008 [P] Write the install reference in the sk-doc skill mode. Cover the layouts, the launcher, `OPENCODE_DB`, the shared config, Homebrew, the `--major` warning, the method and log-level divergences, and the gaps. Label each claim confirmed, documented or unknown. (`.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md`) (DeepSeek)
- [ ] T009 Check each claim in the reference against iteration-015 and research sections 7 and 8. Report each mismatch with its source line. Make no edits. (`.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md`) (Luna)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run `both` in the throwaway environment from plan.md section 4.3. Record the exit status, the output of `opencode --version` and `opencode2 --version`, and the `sh -x` trace of the launcher that shows `OPENCODE_DB`. (Orchestrator)
- [ ] T011 Run `both` a second time. Compare the hashes of the launcher and of each link target before and after. Expect no change. Record the rollback lines printed. (Orchestrator)
- [ ] T012 Run `check` on the throwaway layout. Record the output. Compare the file hashes again. (Orchestrator)
- [ ] T013 Put a fake `opencode` that prints `1.19.3` on the throwaway PATH, under `scratch/fakes/`, and run `v2`. Then put a fake that prints `opencode v2.0.32`, and run `v1`. Expect exit 1 and the `both` hint both times. (Orchestrator)
- [ ] T014 Validate the reference: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md --type install_guide`. Record the output. (Orchestrator)
- [ ] T015 Repeat T001 and compare it with `scratch/snapshot-before.txt`. Record every difference. Expect none. (Orchestrator)
- [ ] T016 Run the final-state checks in CHK-012 and CHK-030 and CHK-031. Check `git status` for the scoped files. Confirm the only new files are the helper and the reference. Delete the scratch content after the implementation summary records the output. (Orchestrator)
- [ ] T017 Fill the evidence cells in acceptance-criteria.md and the implementation summary with the recorded outputs. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion is Met or Waived with an ADR
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

- [ ] CHK-001 [P0] spec.md REQ-001 to REQ-008 each map to an acceptance criterion in acceptance-criteria.md, or to a CHK row here.
- [ ] CHK-002 [P0] The operator snapshot exists before the first proof (T001).
- [ ] CHK-003 [P0] Before each proof, `command -v opencode` under the proof PATH resolves only inside `scratch/home`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` exits 0 with no output.
- [ ] CHK-011 [P1] The helper quotes every path and sets strict mode, or states why it does not. Read the head of the script.
- [ ] CHK-012 [P0] The helper runs no `uninstall`, `upgrade` or `service` command. Command: `rg -n 'uninstall|upgrade|service' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`. Each hit must sit inside a printed rollback line or a usage string.
- [ ] CHK-013 [P1] Each step in the proof output prints its rollback line (T010 and T011).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 proof is recorded: T010 and T011.
- [ ] CHK-021 [P0] AC-002 check is recorded: T012.
- [ ] CHK-022 [P0] AC-003 validation is recorded: T014.
- [ ] CHK-023 [P1] The refusal cases are recorded: T013.
- [ ] CHK-024 [P0] The operator snapshot after the proof equals the snapshot before it: T015.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Not applicable. This phase adds a helper and a reference, and it changes no existing behaviour.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Command: `rg -n -i 'token|secret|password' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` returns nothing.
- [ ] CHK-031 [P0] No `sudo` and no pipe from a download into a shell. Command: `rg -n 'sudo|curl[^|]*\|' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` returns nothing.
- [ ] CHK-032 [P1] The helper writes only under the resolved prefixes and the launcher path. Reviewed in T006 and T009.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the modes, the constants and the open questions.
- [ ] CHK-041 [P1] Each comment in the helper states the durable reason. No comment carries a phase, task or packet label.
- [ ] CHK-042 [P2] Deferred to 010. The `SKILL.md` link to the reference is added in the doc sweep.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds no proof output when the phase closes, except `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
