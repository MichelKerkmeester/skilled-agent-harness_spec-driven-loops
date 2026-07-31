---
title: "Verification Checklist: Code README Structure And Durability Sweep"
description: "Verification Date: not yet verified"
trigger_phrases:
  - "code readme structure sweep checklist"
  - "readme durability sweep checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist across all gates"
    next_safe_action: "Verify pre-implementation items once findings are re-confirmed"
    blockers:
      - "Hard-blocked on child 001's ruling landing"
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-003-code-readme-structure-and-durability-sweep"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Code README Structure And Durability Sweep

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Planned phase — all items open. Lane sections are verified independently; a lane the operator did not authorize is marked deferred with its reason, never silently skipped.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 88 findings re-verified against HEAD with confirmed/drifted/refuted per ID
- [ ] CHK-002 [P0] The `RA-005-18` magnitude correction applied (24 non-README files, not 25)
- [ ] CHK-003 [P0] `001`'s ruling recorded and its validator mode runnable
- [ ] CHK-004 [P0] Re-triage complete; every ruling-exempted finding **deleted** from scope, not carried
- [ ] CHK-005 [P0] Surviving finding count published per lane before any lane task expansion
- [ ] CHK-006 [P1] Q4 disposition confirmed — lane B is in this phase, or moved to `019`
- [ ] CHK-007 [P1] Q6 disposition confirmed — which lanes are authorized at the published survivor count
- [ ] CHK-008 [P1] `002` landed, so the sweep is purely structural
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:lane-gates -->
## Per-Lane Gates

Each lane passes all four gates before the next lane starts.

| Lane | Findings | Conformance | Durability | Template authority | No truth drift | `validate.sh --strict` |
|------|----------|-------------|------------|--------------------|----------------|------------------------|
| D — spec-kit / skill-advisor / bin / .pi | 14 | [ ] | [ ] | [ ] | [ ] | [ ] |
| C — sk-doc / sk-git / mcp-* / sk-prompt | 19 | [ ] | [ ] | [ ] | [ ] | [ ] |
| A — sk-code / sk-design | 26 | [ ] | [ ] | [ ] | [ ] | [ ] |
| B — system-deep-loop outside runtime | 29 | [ ] | [ ] | [ ] | [ ] | [ ] |

Finding counts above are the pre-ruling set. Restate them from CHK-005 once the re-triage publishes survivors.
<!-- /ANCHOR:lane-gates -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No factual claim was rewritten during a structural sweep
- [ ] CHK-011 [P0] Every truth defect uncovered was escalated to `002` with source evidence
- [ ] CHK-012 [P1] Each lane is its own commit range and independently revertible
- [ ] CHK-013 [P1] No file appears in two lanes
- [ ] CHK-014 [P1] No spec paths, packet ids or task ids appear in any code comment added by this phase
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `001`'s code-folder validator mode: zero blocking per executed lane
- [ ] CHK-021 [P0] Durability grep: zero matches per executed lane
- [ ] CHK-022 [P0] Template-authority grep `rg -l "skill-readme-template"`: empty per executed lane
- [ ] CHK-023 [P0] `002`'s referenced-path resolution script: zero unresolved per executed lane
- [ ] CHK-024 [P0] CI durability job present and failing on a seeded violation
- [ ] CHK-025 [P1] Durability pattern does not trip on `001`'s conformant control fixture
- [ ] CHK-026 [P1] Second-reader 10% sample per lane (≈9 files) recorded with verdicts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class recorded: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`
- [ ] CHK-FIX-002 [P0] The four defect shapes are treated as classes: no file in an executed lane carries an unfixed instance of a shape the lane closed
- [ ] CHK-FIX-003 [P0] Consumer inventory done for the template-authority change — the nine files citing the skill template all repointed
- [ ] CHK-FIX-004 [P0] The durability pattern carries adversarial cases: a spec path inside a fenced example, a version string resembling a packet id, a legitimate `026` numeral
- [ ] CHK-FIX-005 [P1] Lane axes and per-lane row counts listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Gates re-run from a non-repo-root CWD produce the same verdicts
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range per lane
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets, credentials or machine-local absolute paths introduced by any sweep
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Zero code-folder READMEs cite `skill-readme-template.md` as their authority
- [ ] CHK-041 [P1] `RA-004-40` touched only the orientation framing; the governance contradiction remains with WS1
- [ ] CHK-042 [P1] `RA-008-09` sequenced after `002`; its facts not re-derived here
- [ ] CHK-043 [P1] The two refuted IDs were not revived; any residual defect was filed fresh
- [ ] CHK-044 [P1] spec / plan / tasks / decision-record synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only; `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 19 | 0/19 |
| P2 Items | 0 | 0/0 |
| Lane gate cells | 20 | 0/20 |

**Verification Date**: not yet verified
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 to ADR-003 recorded in `decision-record.md`
- [ ] CHK-101 [P0] Every ADR has status Accepted before completion is claimed
- [ ] CHK-102 [P1] Alternatives documented, including "ship only the durability gate and defer lanes A and B"
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] The four-gate sweep over the largest lane (B, 29 findings) completes without excessive runtime versus a single-file baseline
- [ ] CHK-111 [P2] The CI durability job's per-commit runtime stays proportionate to the changed-file count, not the full repository
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Per-lane rollback exercised at least once: reverting a lane leaves the other lanes green
- [ ] CHK-121 [P1] The CI durability gate survives a full lane revert
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] The durability pattern's adversarial cases (CHK-FIX-004) do not leak real spec paths or packet ids into any fixture or committed example
- [ ] CHK-131 [P2] N/A — no license or third-party attribution surface in this phase (documentation structure only)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) cross-reference the same ADR numbers and lane order with no contradiction
- [ ] CHK-141 [P2] N/A — no public API documentation surface (see `spec.md` §3 SCOPE)
- [ ] CHK-142 [P1] Escalation list handed to `002` (CHK-011) documents each truth defect with enough source evidence for `002` to act without re-deriving it
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Q4 and Q6 dispositions | [ ] Approved | |
| Second reader | 10% per-lane sample vs source | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
