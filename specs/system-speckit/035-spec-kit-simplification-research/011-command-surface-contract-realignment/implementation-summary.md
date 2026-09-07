---
title: "Implementation Summary: Command surface contract realignment"
description: "The /speckit:* workflow assets scaffold and verify the closure document the contract names, template names are real paths, the help printer lists every rule under a test, and six documents plus one fixture state what the code carries."
trigger_phrases:
  - "command surface realignment summary"
  - "what shipped command surface"
  - "help printer fixed"
  - "workflow assets acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/011-command-surface-contract-realignment"
    last_updated_at: "2026-09-07T03:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; close the program"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/speckit-complete-auto.yaml"
      - ".opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:c9194eff0f482c30be263922a2509fb2adc1751bfe0d7fc9dfee4d33a4ec98b2"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Command surface contract realignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-command-surface-contract-realignment |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The overengineering lane ranked five findings P1 and put the validated core on a keep-list. The census confirmed the verdict and found the defect the lane had walked past: the eight `/speckit:*` workflow assets still told an agent to create and verify a `checklist.md` the level contract retired, named every template by a convention that resolves to no file, and called LOC thresholds soft guidance where the governance document says the scorer decides.

### Workflow assets that match the contract

Every level's required files now match the manifest. The completion workflow's fifth step authors `acceptance-criteria.md`, one row per requirement, and its eleventh step sets every row to Met, Waived or Superseded and checks the P0 and P1 items of the tasks.md verification checklist; the implementation workflow's fourth step does the same; the resume workflow reads the closure document instead of the retired one. The inline scaffold, the evidence sources, the enforcement notes and the presentation lines follow. Every `level_contract_*` name became the template's real path, and the level-selection note names `recommend-level.sh`. Eighteen comment lines lost their ticket ids and kept their reasons.

### A help printer that lists the whole registry

`validate.sh --help` iterated two hardcoded categories and never showed the six structural rules. It now derives its categories from the registry and prints all 39 rules, and `validate-help-lists-every-rule.vitest.ts` asserts every rule id and every category on each run.

### Documents that state what the code carries

The completion command's presentation boundary names the dashboard layout and the four checkpoints the asset holds instead of six dashboards. The skill README counts three strict-only rules. The validation reference says the continuity fingerprint is the SHA-256 of the implementation summary's own normalized text. The optimizer README states that no promotion has ever been recorded and which consumers still read its manifest. The resource-map README links the template by its real path. The readerless BM25 flag left the golden fixture and the drift-test comment.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/speckit/assets/speckit-{complete,implement,plan,resume}-{auto,confirm}.yaml` | Modified | Contract-true required files, acceptance-criteria steps, real template paths, scorer note, comment hygiene |
| `.opencode/commands/speckit/assets/speckit-{complete,plan,implement}-presentation.txt` | Modified | Artifact lines |
| `.opencode/commands/speckit/{complete,implement}.md`, `README.txt` | Modified | Presentation boundary, workflow summary, phase-child files |
| `runtime/cli/spec/validate.sh` | Modified | Categories from the registry |
| `runtime/cli/tests/validate-help-lists-every-rule.vitest.ts` | Created | Every rule and category in `--help` |
| `README.md`, `references/validation/validation-rules.md`, `runtime/cli/optimizer/README.md`, `runtime/cli/resource-map/README.md` | Modified | Count, definition, adoption, link |
| `runtime/tests/fixtures/golden-queries.json`, `runtime/tests/env-reference-drift.vitest.ts` | Modified | Readerless flag removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every synthesis row was re-measured in the main checkout first, because the lane ran in worktree 046 and two of its findings turned out to describe that worktree. The assets were rewritten by one literal-replacement script that asserts zero residue per file and across the command directory; its first run aborted when the probe matched the sk-code authoring checklist's name, the probe was narrowed, the partial edits were restored from the index, and the run was repeated. The printer changed after the help output was counted at 33 rules; the test was written against the registry so a new category needs no test change. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Acceptance criteria plus the tasks checklist replace the retired document in the workflows | That is what the contract scaffolds and what `AC_CLOSURE` and the completion sentinel enforce |
| Replace every symbolic template name, not only the four the lane cited | The core names used the same convention and resolved to nothing either |
| Keep the multiplexed registry rows | Each row is a distinct failure the report attributes; collapsing them trades legibility for wrong attribution |
| Keep the optimizer with its adoption stated | The manifest has readers in the deep-loop skill; deleting the producer of a live contract is not simplification |
| Do not mandate playbook provenance lines | A line claiming a shadowed suite where none exists fabricates provenance |
| Drop the ticket ids from the yaml comments | The hygiene rule binds what the commit carries, and the reasons stand without the ids |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| PyYAML parse of the eight assets | Eight mappings loaded |
| `bash -n` and `--help` on the printer | Exit 0; 39 rule lines and three category headings, where 33 lines printed before |
| Help test and template parity suite | PASS, 6 tests |
| Env-reference drift guard | PASS, 5 tests |
| `npm run check` in `runtime/cli` | Exit 0; the import-policy and handler-cycle checks passed |
| Full CLI vitest project | 137 files and 1,350 tests pass; the one failure is `recursive-child-manifest.vitest.ts`, which reads another session's packet and failed before this program |
| Residue search for the retired names, the symbolic names, the ticket ids and the flag | Only the sk-code authoring-checklist name matches |
| sk-doc validator on the six touched documents | exit 0 each |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The workflow step keys changed names** `step_5_quality_checklist`, `step_11_checklist_verify` and `step_4_quality_checklist` are now acceptance-criteria steps; nothing in the repository read the old keys, but an operator's notes might.
2. **The assets still describe levels by LOC bands** The bands stay as orientation beside the scorer note; the scorer decides.
<!-- /ANCHOR:limitations -->

---
