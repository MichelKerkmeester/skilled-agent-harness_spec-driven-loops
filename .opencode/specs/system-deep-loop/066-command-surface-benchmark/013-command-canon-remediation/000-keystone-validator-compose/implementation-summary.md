---
title: "Implementation Summary: keystone frontmatter-validation composition"
description: "Scaffold-only summary: the keystone phase — composing quick_validate.py frontmatter checks into the canonical --type command path — is planned with gates defined; no composition code has been written or run."
status: in_progress
trigger_phrases:
  - "keystone composition implementation"
  - "frontmatter validation compose status"
  - "type command frontmatter checks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/000-keystone-validator-compose"
    last_updated_at: "2026-07-16T08:00:35Z"
    last_updated_by: "claude"
    recent_action: "Authored keystone phase spec, plan, tasks, and scaffold docs"
    next_safe_action: "Read validate_document.py and quick_validate.py to plan composition"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/shared/assets/template_rules.json"
    completion_pct: 0
    open_questions:
      - "Compose via a shared module or call quick_validate's checks directly?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 000-keystone-validator-compose |
| **Status** | In Progress — scaffold only |
| **Completed** | 0 of 6 tasks; phase plan and gates defined, no composition code written |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is scaffolded but not yet implemented. What exists is the phase plan and its documentation set: the problem framing (frontmatter checks live only in `quick_validate.py` and never fire on the `--type command` path authors run), the in/out scope, the requirements, the success criteria, and the three-phase implementation and testing plan.

No composition code has been written. The `--type command` path in `validate_document.py` still runs section-presence checks only, and the frontmatter checks in `quick_validate.py` remain uncomposed onto that path. No files under `.opencode/skills/sk-doc/shared/` have been modified by this phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Problem, scope, requirements, success criteria, phase sequence |
| `plan.md` | Created | Architecture, three implementation phases, testing, rollback |
| `tasks.md` | Created | Six open tasks across setup, implementation, and verification |
| `implementation-summary.md` | Created | This scaffold-state summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Only the documentation scaffold was delivered. The composition itself is deferred to the implementation phase: read `validate_document.py` and `quick_validate.py`, decide between a shared module both entrypoints import versus a direct call from `--type command`, wire the frontmatter checks keyed by `template_rules.json` so a failing invariant fails the run, and verify against the success criteria. None of that has been executed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat this composition as the keystone | Every canon frontmatter rule is a dead letter on the `--type command` path until the checks are composed there; both research lineages named it first |
| Prefer a shared module over a direct call | A module both entrypoints import prevents the two paths from drifting apart again; the direct call is the fallback |
| Key the composed checks on `template_rules.json` | Reuses the existing rule source and contains regression risk to other `--type` classes |
| Keep scope to composition only | New semantic invariants belong to later phases; this phase only wires existing checks onto the canonical path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Composition implemented | NOT STARTED — no composition code written |
| Over-length description fails `--type command` | NOT RUN — gate defined, not yet exercised |
| Bare MCP tool token fails on canonical path | NOT RUN — gate defined, not yet exercised |
| Conformant commands still exit 0 | NOT RUN — baseline not yet captured |
| `quick_validate.py` and `--type command` agree | NOT RUN — gate defined, not yet exercised |
| Strict packet validation | Doc scaffold only; run `validate.sh --strict` on this folder to confirm the doc set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This phase currently carries only its planning and documentation scaffold. All acceptance gates are defined but unrun, and no source under `.opencode/skills/sk-doc/shared/` has been changed.
2. **Open design question.** Whether to compose via a shared module both entrypoints import or to call `quick_validate.py`'s checks directly from the `--type command` path is unresolved and will be settled during implementation.
<!-- /ANCHOR:limitations -->
