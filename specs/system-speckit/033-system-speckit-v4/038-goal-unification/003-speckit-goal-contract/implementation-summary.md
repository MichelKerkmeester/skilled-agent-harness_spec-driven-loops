---
title: "Implementation Summary"
description: "The goal template, the set-string playbook, the contract JSON and the validator now agree: frontmatter never leaves the file, a parent durable slice warns past 3000 and fails past 4000, and a binding row must point at a child goal that exists."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/038-goal-unification/003-speckit-goal-contract"
    last_updated_at: "2026-09-11T07:11:49Z"
    last_updated_by: "claude-code"
    recent_action: "Aligned template, playbook, contract and validator on the goal budget"
    next_safe_action: "Build 004-goal-core-packet-backed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-speckit-goal-contract |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A parent goal that would truncate in the runtime now warns its author before it does. The template and playbook stopped telling agents to resend the full file, the budget moved into `spec-kit-docs.json` so three documents read one pair of numbers, and the two checks lost when the old shell rule was deleted came back as native validator diagnostics.

### Phase 3: speckit-goal-contract

When you scaffold a goal document the template now says what the durable slice is, that the frontmatter never leaves the file, and where the budget bites. When a phase parent grows past 3,000 durable characters `validate.sh` warns, past 4,000 it fails, and a binding row naming a child goal that was never authored fails too. Children stay unbounded because they bind through the parent and are never set directly.

The numbers live once, under `goalDurableBudget` in the contract JSON. The template quotes them, the playbook quotes them, and the validator reads them through `resolveGoalDurableBudget`, so the drift that let the playbook say 3,000 while the runtime capped at 4,000 cannot recur.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modified | Durable-slice definition, frontmatter-strip statement, budget, resend and reminder wording |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | v3.10.0.0: budget tiers, frontmatter first in the cut order, stripped resend, reminder rule, fixed link |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Modified | `goalDurableBudget` block |
| `.opencode/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts` | Modified | `resolveGoalDurableBudget()` |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modified | `extractGoalDurableSlice()`, diagnostics SPECDOC_SUFFICIENCY_005 and 006 |
| `.opencode/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts` | Modified | Five goal cases, frozen code list extended |
| `.opencode/skills/system-spec-kit/references/validation/validation-rules.md` | Modified | Summary row and section 12 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Typecheck, eslint and vitest on the runtime, then `npm run build` and a strict validation of the 036 parent, which now reports the warning tier at 3,864 characters and still passes. The first test run failed three cases with `validate.sh` exiting 3; that was the stale-dist refusal while the build was still running, and the same cases pass on the fresh dist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend SPEC_DOC_SUFFICIENCY instead of adding a rule name | A new rule would touch the orchestrator, the registry and the help-alignment test for no behavior the diagnostics do not already give |
| Numbers in the contract JSON, not in code | The failure criterion 1 names is three documents disagreeing; one source removes it |
| Budget skips phase children | A child binds through its parent and is never set as an objective |
| Template version stays v2.2 | The parity test pins every template to the manifest version; a prose edit is not a contract change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` | PASS, exit 0 |
| eslint on the three changed TS files | PASS, no output |
| vitest tests/spec-doc-structure.vitest.ts | PASS 25/25 |
| vitest template-version-parity + workflow-invariance | PASS 7/7 |
| `npm run build`, dist-freshness check | fresh |
| validate.sh --strict on 036 parent | PASS with SPECDOC_SUFFICIENCY_005 warning at 3864 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Legacy parents over 3,000 characters warn** until trimmed. A warning does not fail a run.
2. **The playbook link is fixed but the trigger index was not regenerated**; no trigger phrase changed, so the committed index is still accurate.
<!-- /ANCHOR:limitations -->

---


