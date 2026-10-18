---
title: "Tasks: Phase 10: documentation-sweep"
description: "Ordered inventory, write, review and gate tasks that bring every doc the OpenCode build touches up to its sk-doc mode."
trigger_phrases:
  - "documentation sweep tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: documentation-sweep

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

**Task Format**: `T### [P?] Description (file path)`

Each task names its executor in brackets at the end of its line when it is not the orchestrator. DeepSeek runs through cli-devin with the markdown persona inlined. Luna runs through cli-codex.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build `doc-inventory.md` from `git status --short` for phases 002 to 009, with one row per touched doc and its sk-doc mode and validator (`doc-inventory.md`) (orchestrator)
- [ ] T002 Run the v1-only search over `.skilled/skills/cli-external-orchestration` and add each hit's file to the inventory (orchestrator)
- [ ] T003 [P] Save a pre-write copy of each inventory doc under `scratch/pre-write/` (`scratch/pre-write/`) (orchestrator)
- [ ] T004 [P] List the playbook files with `find .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook -name '*.md'` and record the set in `doc-inventory.md` (orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Writes

- [ ] T005 Write `.opencode/plugins/README.md` through the readme mode (`.opencode/plugins/README.md`) (DeepSeek through cli-devin)
- [ ] T006 Write each changed script-folder README through the readme mode, code_folder type, one dispatch per folder (changed script folders) (DeepSeek through cli-devin)
- [ ] T007 Write the cli-opencode `SKILL.md` line sites that `research/iterations/iteration-013.md` F7 lists, through the skill mode (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`) (DeepSeek through cli-devin)
- [ ] T008 Write the cli-opencode `README.md` overview lines that describe dispatch, through the skill mode (`.skilled/skills/cli-external-orchestration/cli-opencode/README.md`) (DeepSeek through cli-devin)
- [ ] T009 Write `references/cli-reference.md` with a v2 column and a two-row version matrix, through the skill mode (`.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md`) (DeepSeek through cli-devin)
- [ ] T010 Write the `#variant` twin beside each `--variant` example in `providers-and-models.md`, through the skill mode (`.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md`) (DeepSeek through cli-devin)
- [ ] T011 Write the v2 rendering beside each of the six invocations in `prompt-templates.md`, through the skill mode (`.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md`) (DeepSeek through cli-devin)
- [ ] T012 Write a version banner and a v2 twin into each playbook scenario group that T004 lists, one dispatch per group, through the playbook mode (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/`) (DeepSeek through cli-devin)
- [ ] T013 Write the catalog entries for the plugin and dispatch changes, through the catalog mode (`.skilled/skills/cli-external-orchestration/feature-catalog/`) (DeepSeek through cli-devin)
- [ ] T014 Write the changelog entry for the build, through the changelog mode (`.skilled/skills/cli-external-orchestration/cli-opencode/changelog/`) (DeepSeek through cli-devin)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Review and Fix

- [ ] T015 Review each changed doc against its sk-doc mode and return findings only (changed docs) (Luna through cli-codex)
- [ ] T016 Fix the findings from T015, one dispatch per doc with findings, using the minimal edit that closes each one (docs with findings) (DeepSeek through cli-devin)
- [ ] T017 Record each finding and the change that closed it in `doc-inventory.md` (`doc-inventory.md`) (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T018 Run `validate_document.py <doc> --type <type>` on each touched doc, and record each exit status in `doc-inventory.md` (orchestrator)
- [ ] T019 Run `extract_structure.py <doc>` on each touched doc, and record its `dqi.total` (orchestrator)
- [ ] T020 Run `hvr_scan.py <doc>` on each touched doc, record its exit status and add a manual human-voice note (orchestrator)
- [ ] T021 Run the package checks on each changed skill, playbook package and catalog, and record each exit status (orchestrator)
- [ ] T022 Run `validate_document.py` with the skill reference type on `install-and-versions.md`, and with the command type on the `/doctor:opencode` route doc (orchestrator)
- [ ] T023 Rerun the v1-only search from T002, read every hit and record that each one names version 1 (orchestrator)
- [ ] T024 Confirm that no touched doc states the public claim, with `rg -n 'Verified against OpenCode' <touched docs>` returning no hit (orchestrator)
- [ ] T025 Run `validate.sh` on this folder with `--strict`, fill `implementation-summary.md`, and clear `scratch/` except `.gitkeep` (orchestrator)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every row in `doc-inventory.md` shows a passing validator, a DQI score of 75 or higher and a human-voice result
- [ ] Gate outputs from T018 to T024 recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Check: `grep -c 'REQ-00' spec.md` prints 7 or more.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Check: `grep -c 'Ordered Steps and Dispatch Plan' plan.md` prints 1.
- [ ] CHK-003 [P1] Phase 009 closed. Check: `grep -n 'Complete' ../009-sk-code-opencode-alignment/implementation-summary.md` prints the Status row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Doc Quality

- [ ] CHK-010 [P0] Every touched doc exits 0 from its validator. Check: every exit status in `doc-inventory.md` from T018 is 0.
- [ ] CHK-011 [P0] Every changed package exits 0 from its package check. Check: every exit status from T021 is 0.
- [ ] CHK-012 [P1] Every touched doc scores 75 or higher on DQI. Check: every `dqi.total` from T019 is 75 or more.
- [ ] CHK-013 [P1] Every touched doc passes the human-voice check. Check: every `hvr_scan.py` exit status from T020 is 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Check: `grep -c '| Unmet |' acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] No touched doc describes the v1-only dispatch shape as universal. Check: every hit from T023 names version 1.
- [ ] CHK-022 [P1] Edge cases tested. Check: every file that needed no change has an inventory row that says unchanged, and it still has a validator exit status.
- [ ] CHK-023 [P1] Error scenarios validated. Check: each failed dispatch was retried once, and its retry is recorded in `doc-inventory.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase changes docs and fixes no code finding, so the fix-completeness items do not apply.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret value in any touched doc. Check: the Luna review at T015 records no key or token value.
- [ ] CHK-031 [P1] `opencode.json` appears only in the v1 shape (D2). Check: `rg -n -e 'permissions' -e '"plugins"' -e '"disabled"' <touched docs>` shows no authored config key.
- [ ] CHK-032 [P1] Every v2 child dispatch in the docs uses `run --standalone` (D3). Check: `rg -n -- '--standalone' <cli-opencode docs>` shows each v2 child line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized. Check: each of the three files names `doc-inventory.md` as the inventory.
- [ ] CHK-041 [P1] No doc recommends `opencode upgrade --major` as a step (D4). Check: `rg -n 'upgrade --major' <touched docs>` shows only warning lines.
- [ ] CHK-042 [P2] Code-folder READMEs updated. Check: the T005 and T006 rows in `doc-inventory.md` show validator exit 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Check: `git status --short` lists only the touched docs and this folder.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Check: `ls -A scratch/` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
