---
title: "Implementation Summary: Citation-Drift Scan (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one offline sk-doc script that tests whether a Jev or Deem noul finds drifted skill-doc citations better than a zero-call check. It was released on 2026-09-29."
trigger_phrases:
  - "citation drift scan summary"
  - "citation drift scan status"
  - "cite-drift-scan planned"
  - "citation drift verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan"
    last_updated_at: "2026-09-29T15:30:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R24"
    next_safe_action: "Build to the label gate in number order, released 2026-09-29 (parent goal D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-032-citation-drift-scan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Who reads a drift report once a keep exists"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Citation-Drift Scan (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-citation-drift-scan |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no script, test, labels file or skill doc exists for it.

### Phase 32: citation-drift-scan

The plan builds `cite-drift-scan.mjs` (proposed) in `.skilled/skills/sk-doc/shared/scripts/`. Its default run counts `file:line` citations in skill docs and settles dead ones with no model. A draw writes 40 rows for labels, 20 live and 20 constructed. Once the operator labels the live rows, a Jev arm and a Deem arm, each behind its own switch and gate, ask one `noul` per row, and each column ends in `keep`, `kill (precision)` or `stop (<reason>)` under the keep rule in `spec.md`. See `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R24's record in `../007-classifier-deep-research/research/research.md:844-863`, the validators section at `:460-480` and swe-06's and mimo-08's lineage iterations. The cited neighbors were reopened at the worktree HEAD: `check-ac-coverage.sh:437`, `validate_catalog_package.py:494` and `validate_document.py:18-21`. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. Its verdict waits on the operator's 20 labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure drift, not dead lines | The dead check needs no model and the synthesis counted only 4 dead of 232 resolvable citations. Drift is the unmeasured part |
| Half the labels are constructed | R24's labels can be made by moving a citation's window on purpose, the property that makes it the cheapest later residue to measure (`research.md:480`) |
| Labels are read at a recorded commit | A later edit to a doc or a cited file would otherwise move the window under a label |
| Two switches, no failover | Research rows 80 and 81 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built yet.** The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
2. **The verdict waits on labels.** Until the operator labels 20 live rows, every run prints `stop: fewer than 40 labeled rows`.
3. **No reader is named.** A `keep` here does not serve anything. A served form needs a named reader and a later phase.
<!-- /ANCHOR:limitations -->

---
