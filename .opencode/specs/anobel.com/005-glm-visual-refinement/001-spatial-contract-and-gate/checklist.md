---
title: "Verification Checklist: spatial-contract-and-gate"
description: "Verification items for the SAFE_LINEAR_560 contract, preflight rubric, deterministic gate, and failure-only repair. Unchecked - verification happens after the later code phase."
trigger_phrases:
  - "spatial contract and gate"
  - "verification"
  - "checklist"
  - "deterministic gate"
  - "SAFE_LINEAR_560"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/001-spatial-contract-and-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 verification checklist for phase 001 (all unchecked)"
    next_safe_action: "Verify items with evidence after implementation"
    blockers: []
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: spatial-contract-and-gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> All items are unchecked - verification happens after the later code phase. Mark `[x]` with evidence then.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-009, each citing an RC-id)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (contract -> generate -> render -> gate -> repair)
- [ ] CHK-003 [P1] Dependencies identified and available (headless engine, Z.AI endpoint, contrast helper)
- [ ] CHK-004 [P0] Failure-JSON schema FROZEN in spec.md (REQ-009), not plan.md - phases 002-006 read it
- [ ] CHK-005 [P0] Geometry single source of truth verified: only 560-derived literals in `a1Block()`; no 480x480 research block copy-pasted (REQ-010)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `gen-tile.mjs` runs clean under each arm (`control`/`a1_prompt`/`a1_gate_repair`)
- [ ] CHK-011 [P0] No console errors during headless render in `a1-gate.mjs`
- [ ] CHK-012 [P1] Error handling on render/browser failure (surfaces as gate error, never a silent pass - NFR-R01)
- [ ] CHK-013 [P1] New scripts follow the existing ESM `.mjs` harness style

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria met (REQ-001..REQ-007, REQ-009..REQ-011)
- [ ] CHK-021 [P0] Gate self-test: known-bad tiles FAIL (accountbeheer-4, oci-4, goedkeuringssysteem-4)
- [ ] CHK-022 [P0] Gate self-test: known-good tiles PASS (accountbeheer-5, kwartaalcijfers-2)
- [ ] CHK-024 [P0] Falsification probe (REQ-011) clears BEFORE the full run: gate-on-baseline confusion matrix + 5-tile repair probe (measured repair-success-rate)
- [ ] CHK-025 [P0] Gate determinism: `+/-2px` bbox tolerance + `document.fonts.ready` awaited before measuring; same HTML -> same failure JSON (NFR-C01)
- [ ] CHK-023 [P1] 45-tile pilot run across the C0 / T1 / T2 arms (control / a1_prompt / a1_gate_repair) - only after the probe clears
- [ ] CHK-026 [P1] Repair-success-rate sub-gate met (>=50%) or T2 deferred + escalated to phase 004 (SC-007)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each RC target has a finding class: RC-1/RC-2 = algorithmic (geometry/overlap), RC-3 = algorithmic (title-band), RC-4 = class-of-bug (casing/glyph), RC-5 = algorithmic (contrast)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: confirmed `gen-tile.mjs` is the only generation entrypoint (`rg -n "fetch\(EP" research/inputs/`)
- [ ] CHK-FIX-003 [P0] Consumer inventory for the failure-JSON schema completed (phases 002-006 read it; schema FROZEN in spec.md REQ-009)
- [ ] CHK-FIX-004 [P0] Contrast gate includes adversarial cases: token-as-text on dark (fail), token-as-fill/stroke (pass), opacity-reduced gray (fail)
- [ ] CHK-FIX-005 [P1] Gate axes listed: 6 checks x 45 tiles x 3 arms before completion is claimed
- [ ] CHK-FIX-006 [P1] `control` arm is byte-reproducible against the existing single-shot harness (NFR-R02)
- [ ] CHK-FIX-007 [P1] Measured deltas pinned to a specific run id (`A1_RUN_ID`), not a moving comparison

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (Z.AI key continues to load from `auth.json`, not committed)
- [ ] CHK-031 [P1] Generated HTML rendered in a sandboxed headless context (no network side effects beyond fonts)
- [ ] CHK-032 [P2] No new external network calls beyond the existing Z.AI endpoint + Google Fonts

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final implementation
- [ ] CHK-041 [P1] Failure-JSON schema documented for downstream phases
- [ ] CHK-042 [P2] `implementation-summary.md` records measured deltas vs the 60% / ~41-pt baseline

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] New scripts live under `004-bento-visuals/research/inputs/` (the existing harness dir)
- [ ] CHK-051 [P1] Per-arm `dist-<arm>-<run>/` outputs kept separate from the baseline `dist/`

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: TBD (after implementation)
**Verified By**: TBD

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
All unchecked: planning artifact; verified in a later code phase
-->
