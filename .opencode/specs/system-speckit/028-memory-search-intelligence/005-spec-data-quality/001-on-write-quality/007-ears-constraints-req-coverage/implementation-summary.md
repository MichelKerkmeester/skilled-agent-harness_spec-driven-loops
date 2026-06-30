---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Scaffolded phase plan for the A7 EARS, constraint tier, and REQ_COVERAGE gate, status PLANNED, nothing built yet."
trigger_phrases:
  - "ears requirements status"
  - "constraint tier status"
  - "req coverage status"
  - "ac coverage clone status"
  - "ears linter status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/007-ears-constraints-req-coverage"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded the Level 2 doc set, no build yet"
    next_safe_action: "Build the REQ_COVERAGE clone from the AC rule"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-ears-constraints-req-coverage |
| **Completed** | PLANNED, scaffolded only, no build shipped |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is PLANNED and scaffolded. The doc set captures the approach so a later build stage can clone the shipped `AC_COVERAGE` rule into a `REQ_COVERAGE` gate without re-deriving the seams. The plan, tasks, and checklist hold the verified file references the build will act on.

### REQ_COVERAGE gate (planned)

The plan describes a clone of `check-ac-coverage.sh` retargeted from checklist AC rows to tasks REQ linkage. When you enable `SPECKIT_REQ_COVERAGE` the gate will warn on any authored requirement with no covering task, and stay a verified no-op when the flag is unset. This is design only at this stage.

### EARS grammar, constraint tier, and EARS linter (planned)

The plan also describes adding EARS patterns and an always / ask-first / never constraint tier to the spec template, a REQ-reference marker in the tasks template, and a soft `EARS_LINT` advisory rule. All of it lands default-off and warn so the legacy corpus stays untouched. None of it is implemented yet.

### Files Changed

No source files changed yet. The table below lists the planned targets for the build stage, not completed work.

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/system-spec-kit/scripts/rules/check-req-coverage.sh | Planned Create | Clone the AC rule and retarget to tasks REQ linkage |
| .opencode/skills/system-spec-kit/scripts/rules/check-ears-lint.sh | Planned Create | Advisory linter for non-EARS non-constraint rows |
| .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json | Planned Modify | Register REQ_COVERAGE and EARS_LINT behind their flags |
| .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl | Planned Modify | Add EARS patterns and the constraint tier |
| .opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl | Planned Modify | Add a REQ-reference linkage marker |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase is scaffolded from the spec.md seams and waits for a build stage. The verification path is set: run validate.sh strict with the flag on against a spec that has an unlinked requirement, confirm the warn line, then run flag-unset against a 005 sibling and confirm an unchanged exit code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Clone the shipped AC_COVERAGE rule rather than write a new gate | The exact gate shape already ships and proves the pattern, so the build risk stays low |
| Land everything default-off and warn | The legacy corpus predates EARS and the linkage marker, so a warn-only start protects every existing packet |
| Keep the EARS fix report-only, never an auto-rewrite | The research classifies an EARS auto-rewrite as risky and suggest-only, so a silent body mutation is out of scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build of the REQ_COVERAGE clone | NOT RUN, phase is PLANNED |
| validate.sh strict with the flag on against an unlinked REQ | NOT RUN, phase is PLANNED |
| validate.sh strict flag-unset no-op on a 005 sibling | NOT RUN, phase is PLANNED |
| Spec-doc set validate.sh strict on this folder | PASS, scaffold docs only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. The REQ_COVERAGE clone, the EARS linter, and the template edits are planned, not built.
2. **Linkage shape open.** The REQ-to-task linkage may be a tasks-table column or an inline REQ-NNN marker, the build stage decides per the first open question in spec.md.
3. **Warn only by design.** No warn-to-error flip lands here, the four-beat migration is a separate later phase.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
