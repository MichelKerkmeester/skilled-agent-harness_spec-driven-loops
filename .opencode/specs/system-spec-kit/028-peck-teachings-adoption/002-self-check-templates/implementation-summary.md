---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: planned. This phase is specified but not yet implemented."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-peck-teachings-adoption/002-self-check-templates"
    last_updated_at: "2026-06-02T10:04:52Z"
    last_updated_by: "planning-author"
    recent_action: "Authored phase docs"
    next_safe_action: "Implement this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-self-check-templates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-self-check-templates |
| **Completed** | Pending (planned) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: Planned - not yet implemented.** This phase is specified and ready to pick up; nothing has
shipped yet. This summary will be rewritten in past tense once the work is done.

### Planned outcome
A short self-check + failure-modes guidance block will be added to the spec, plan, and checklist
manifest templates, shipped as HTML-comment guidance so header validation stays green. The intent is
that every newly scaffolded spec folder carries the "audit your own output" reminder where the author
fills the form.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/manifest/spec.md.tmpl` | Planned | Add self-check + failure-modes block |
| `templates/manifest/plan.md.tmpl` | Planned | Add self-check + failure-modes block |
| `templates/manifest/checklist.md.tmpl` | Planned | Add self-check + failure-modes block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending implementation. Planned verification: scaffold a throwaway folder and run `validate.sh --strict`
to confirm the blocks render and introduce no header or section errors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship as HTML-comment guidance, not a tracked section | TEMPLATE_HEADERS enforces exact header order; a comment block adds the guidance with zero header-validation risk and matches the existing voice-guide pattern. |
| Scope to spec/plan/checklist only | These are the templates an author fills during a task; implementation-summary is a possible follow-up. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on a scaffold | Pending - phase not implemented |
| Blocks render in spec/plan/checklist | Pending - phase not implemented |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This is a planning artifact; see `spec.md`, `plan.md`, and `tasks.md` for the intended work.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
