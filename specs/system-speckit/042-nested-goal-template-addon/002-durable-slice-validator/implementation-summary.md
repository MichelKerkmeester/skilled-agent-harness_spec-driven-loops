---
title: "Implementation Summary: Durable Slice Validator"
description: "A present-file rule that reports a goal document which has drifted out of shape, with budgets measured from the template rather than guessed."
trigger_phrases:
  - "goal shape rule"
  - "durable slice budget"
  - "binding child paths"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/002-durable-slice-validator"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the shape rule, its registration and its unit suite"
    next_safe_action: "Make the goal offer runtime-neutral in the next phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-goal-shape.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-002-durable-slice-validator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The whole durable slice is measured; naming boilerplate would drift with the template"
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-durable-slice-validator |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A goal document that has drifted out of shape now says so. Before this, a durable directive could quietly outgrow what a runtime goal surface will hold, and the truncation takes the tail, which is where the completion criteria live.

### The shape rule

It is present-file: a packet with no goal document produces no finding, so the rule never reaches a packet that did not opt in. Present, it checks that the durable directive, the completion criteria and the log are each separable by heading; that a phase parent carries a binding block; that every child path the binding lists actually exists in the packet; and that the durable slice fits a budget an operator can paste.

### Budgets measured, not guessed

The open question this phase inherited was whether the budget should measure the whole durable slice or only the author's own words. It measures the whole slice: deciding which prose counts as boilerplate would drift every time the template changes. The budgets instead account for the floor, measured directly: the template's instructional prose occupies 738 characters at a leaf level and 1,276 at a phase parent, which carries a binding block that grows with its children. Defaults are 2000 for a leaf and 3000 for a parent, both inside the smallest documented runtime cap with room for the wrapper an operator adds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/rules/check-goal-shape.sh` | Created | The present-file rule |
| `scripts/lib/validator-registry.json` | Modified | Registers it at warn with its three flags |
| `scripts/tests/check-goal-shape.sh` | Created | Eleven cases, one per way a document stops being usable |
| `references/validation/validation-rules.md` | Modified | The rule, its findings and the measured budgets |
| `mcp-server/ENV-REFERENCE.md` | Modified | The three flags |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The floors were measured before any budget was chosen, at both shapes, so the numbers came from the template rather than from a preference. The rule was then driven through eleven fixture cases covering each failure it exists to catch, and finally run against this packet's real documents.

That last run earned its keep. The parent's goal document bound four children whose goal documents did not exist, and the rule named all four. Authoring them was the fix, which also completed the nested arrangement end to end: a parent that binds children that exist, each child within its own budget.

One test was initially green for the wrong reason. The case meant to prove a parent's larger budget was passing because that fixture also lacked a binding block, so it warned for an unrelated cause. It was rebuilt so the shape is the only variable between the two budget cases.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure the whole durable slice | Naming boilerplate would drift every time the template changed |
| Different budgets per shape | A parent's binding block grows with its children; a leaf has none |
| Warn rather than error | The document is opt-in, and a drifted shape is a problem for the author, not a broken packet |
| Present-file | A packet that never opted in must never be touched |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Unit suite | PASS - 11 cases, 0 failed |
| Absence is silent | PASS - four child packets reported a no-op before their documents existed |
| Budget isolates on shape | PASS - one 2500-character slice warns at leaf and passes at parent |
| Missing child path | PASS - named all four during dogfooding |
| Live run on this packet | PASS - five folders, each with its measurement |
| Recursive strict validation | PASS - exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The budget is a character count, not a token count.** Runtime caps are documented in characters, so this matches them, but a model's context cost is not linear in characters.
2. **Child paths are checked for existence, not for shape.** A parent can bind a child whose own goal document is malformed; that child's own run reports it.
<!-- /ANCHOR:limitations -->

---
