---
title: "Implementation Summary: sk-doc Validator Notices and Dead Playbook Citations"
description: "Planned. Nothing is built yet. This phase will make validate_document.py say when it falls back to README rules, give quick_validate.py one MCP-token severity and fix four dead playbook citations."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes"
    last_updated_at: "2026-09-27T13:30:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Authored the planning documents. Nothing is built"
    next_safe_action: "Run T001 to recheck owner history on every file to change"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-phase-012"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should system-deep-loop fix the other drifted playbook citations by hand (spec.md section 10)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: sk-doc Validator Notices and Dead Playbook Citations

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-sk-doc-validator-and-reference-fixes |
| **Status** | Planned |
| **Completed** | Not completed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The phase is Planned, and no file outside this folder has changed.

### sk-doc Validator Notices and Dead Playbook Citations

When built, a document `validate_document.py` cannot type will still be checked against README rules, but the output will say so in a `document_type_fallback` warning, with every exit code as it is today. A skill that declares a non-qualified MCP tool token will fail `quick_validate.py` the way a command already does. Two deep-research playbook rows will cite the presentation file that now holds their text, and two rows in a recorded spec-kit capture will be removed with a note saying why.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | `spec.md` section 3 lists the files the build will change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. `tasks.md` holds the ordered steps, and `acceptance-criteria.md` holds the command that proves each requirement.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A notice, not a failure, for the README fallback | The owner's contract makes exit 1 the delivery block for a document defect, and `/create:*` workflows validate root index files without `--type`. The plan-time reasoning is in `spec.md` REQ-001 |
| Remove, not repoint, the two memory-pipeline rows | The cited import no longer exists anywhere in the 63-line test file. The rows sit in a recorded capture, so the capture's note records the removal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning validation | `validate.sh --strict` on this folder is run at authoring time. The result is recorded in `goal.md`'s log |
| Build verification | Not run. Nothing is built, so no row of `acceptance-criteria.md` is met |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planned only.** No requirement is met yet.
2. **The owner suite is already red.** Four sk-doc test files failed before this phase on 2026-09-27. The build can show only that it adds no failure.
<!-- /ANCHOR:limitations -->

---
