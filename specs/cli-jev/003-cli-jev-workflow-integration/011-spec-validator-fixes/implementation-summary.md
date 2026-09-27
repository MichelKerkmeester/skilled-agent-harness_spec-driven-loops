---
title: "Implementation Summary: Spec Validator Fixes (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe a report-only unresolved-citation check for AC_COVERAGE, a goal.md path for check-goal.cjs and folder-number labels for phases create.sh appends, and no result exists."
trigger_phrases:
  - "spec validator fixes summary"
  - "ac coverage unresolved citation status"
  - "check-goal goal.md path status"
  - "spec validator fixes planned"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes"
    last_updated_at: "2026-09-27T11:57:42Z"
    last_updated_by: "opus-5.5-high-leaf"
    recent_action: "Authored the planning documents"
    next_safe_action: "Record the baseline, then build the two fixes"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-spec-validator-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the system-spec-kit owner want option A, B or C for counting unresolved citations"
      - "Does the system-spec-kit owner want option A, B or C for detecting a phase label that disagrees with its folder number"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Spec Validator Fixes (Planned)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-spec-validator-fixes |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no validator, test or document outside this folder has changed for it.

### Phase 11: spec-validator-fixes

The plan has three owner fixes. `AC_COVERAGE` in `system-spec-kit` will check that each cited `file:line` names a readable file and a line inside it, and will list the ones that do not in one detail line, while its covered count, floor, cutoff and advisory default stay as they are. `check-goal.cjs` in `sk-create-goal` will accept a path ending in `goal.md` and check that file's folder, with its exit codes unchanged. `create.sh --phase --parent` in `system-spec-kit` will label each child it adds with its folder's number instead of its position in the batch. See `spec.md` for the requirements and the owner decision on counting, and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not started | The eight files the build will change are listed in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Only the planning documents exist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Report unresolved citations and keep counting them | A read-only scan found that 56 of the 97 packets at or above the floor today would fall under it if unresolved citations stopped counting. That choice belongs to the `system-spec-kit` owner |
| Leave label detection to the owner | 14 of 27 `Phase N:` labels in 2,183 `description.json` files disagree with their folder. Whether `validate.sh` warns or `repair-derived.cjs` rewrites the scaffold default is the `system-spec-kit` owner's choice |
| Change `check-goal.cjs` only at its command line | The exported functions document a packet directory. The command line is where the `goal.md` path was refused |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build verification | Not run. The phase is Planned |
| Planning documents: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes --strict` | Run at authoring time by the authoring session. Its output is reported there, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** Every requirement in `spec.md` is open until the build runs.
<!-- /ANCHOR:limitations -->

---

