---
title: "Verification Checklist: sk-design two real bugs"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design real bugs checklist"
  - "audit router loop checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the manifest, audit loop and pseudocode alignment fixes"
    next_safe_action: "Move to 018 routing wiring"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design two real bugs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The lockfile, backend README and audit router config read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The regenerated `package.json` is consistent with the lockfile (npm dry-run reports up to date, `npm ls` clean)
- [x] CHK-011 [P0] The audit scoring loop iterates the keyword list and applies each intent's configured weight, matching the foundations and motion template
- [x] CHK-012 [P1] The audit register loads via the 016 `DEFAULT_RESOURCE` slot, not a second path
- [x] CHK-013 [P1] Both fixes follow the existing backend and audit-router patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm install` succeeds against the regenerated manifest and the backend vitest suite passes 68 of 68
- [x] CHK-021 [P0] The audit router parses and runs, the gate scores 100 with 0 escapes, and the replay loads `../shared/register.md` with 0 missing
- [x] CHK-022 [P1] Four representative audit prompts route to the expected intents with positive weighted scores after the loop fix
- [x] CHK-023 [P1] The corrected loop iterates keyword strings directly, so an empty keyword list scores zero rather than crashing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The manifest bug is instance-only (md-generator backend) and the audit loop bug is algorithmic
- [x] CHK-FIX-002 [P0] No other sk-design backend ships a lockfile without a manifest, confirmed by grep (md-generator is the only backend)
- [x] CHK-FIX-003 [P0] Consumers of the audit scoring loop are checked: the machine router-replay scores correctly, the gate passes, and the manual playbook is unaffected
- [x] CHK-FIX-004 [P0] The register-load path is exercised for outside-root and sanctioned-shared paths, with three adversarial fixtures in 016 confirming a non-shared escape still fails
- [x] CHK-FIX-005 [P1] The audit replay axes (four prompts by intent) are listed in the implementation summary before completion
- [x] CHK-FIX-006 [P1] The empty-keyword and missing-register variants are reasoned through, not just the happy path
- [x] CHK-FIX-007 [P1] Evidence is pinned to the committed diff for this packet
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the manifest or router change
- [x] CHK-031 [P0] The manifest declares the same dependency ranges the lockfile records, and the lockfile pins the exact resolved versions, so the supply-chain surface is unchanged
- [x] CHK-032 [P1] The audit register-load is scoped to the sibling shared dir (the family cross-packet docs home); every other parent path still fails the gate
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md stay synchronized with the implemented fixes
- [x] CHK-041 [P1] The backend README setup steps (npm install, ts-node) are accurate now that the manifest is restored
- [x] CHK-042 [P2] The audit router prose was updated with the loop fix, and the foundations and motion prose was aligned with the register loading
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes are the md-generator backend manifest, the audit router fix, and the audit, foundations and motion pseudocode alignment (a 016 spillover closed here)
- [x] CHK-051 [P1] No stray temp files left in the packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-27
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
