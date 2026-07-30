---
title: "Verification Checklist: Header, Directive and Structure Sweep"
description: "Verification Date: TBD"
trigger_phrases:
  - "header sweep checklist"
  - "codemod verification"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/003-header-directive-and-structure-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist for the header and directive sweep"
    next_safe_action: "Leave unchecked until the phase executes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Header, Directive and Structure Sweep

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Child 001 landed with a captured per-root baseline
- [ ] CHK-005 [P0] T001 complete: census re-derived per root, tracked-versus-walked gap reconciled, unnamed-by-finding files listed
- [ ] CHK-006 [P0] Transform library proven idempotent, mode-preserving and shebang-safe before any lane runs
- [ ] CHK-007 [P0] Below-the-line and exemption assertions each demonstrated failing on a deliberate violation
- [ ] CHK-008 [P1] Operator decisions Q2 and Q4 resolved
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — per touched file: `node --check`, ESM parse, `tsc --noEmit`, `python3 -m py_compile`, `bash -n` + ShellCheck
- [ ] CHK-011 [P0] No console errors or warnings introduced on any live surface
- [ ] CHK-012 [P1] Error handling implemented — N/A; no control flow touched. Recorded as not applicable, not skipped
- [ ] CHK-013 [P1] Code follows project patterns — every transformed file now satisfies the file-opening contract it was drifting from
- [ ] CHK-014 [P0] No hunk falls below the first executable line, except reviewed import-order hunks on an enumerated allow-list
- [ ] CHK-015 [P0] No `.mjs` file received a `'use strict'` directive
- [ ] CHK-016 [P0] Every executable retained its file mode
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-012 each cite an executed command and its result
- [ ] CHK-021 [P0] Manual testing complete — every lane A live surface executed: post-edit hook, pre-commit on a scratch commit, each `.opencode/bin` front door, doctor routes, statusline
- [ ] CHK-022 [P1] Edge cases tested — every matrix cell {language} × {shebang} × {preamble} has a verified file
- [ ] CHK-023 [P1] Error scenarios validated — a deliberate parse-breaking transform is caught and quarantines the file rather than continuing the lane
- [ ] CHK-024 [P0] Per root: header census at zero, measured with the same command that produced the baseline
- [ ] CHK-025 [P0] Per root: verifier delta reported as "N closed, zero new" against child 001's baseline — never a bare PASS
- [ ] CHK-026 [P0] `.opencode/bin` still reports its 3 `SH-STRICT-MODE` errors; those belong to child 004 and closing them here is a scope violation
- [ ] CHK-027 [P0] Compiled-routing regenerated outputs byte-identical to their pre-lane state
- [ ] CHK-028 [P1] Every touched package's typecheck, build and suite green against a captured baseline
- [ ] CHK-029 [P1] Codemod re-run over the transformed tree yields an empty diff
- [ ] CHK-030 [P1] One representative benchmark rig executed end to end after lane C
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The two pattern anchors are `class-of-bug` and their work list is the census.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed — the per-root census is the inventory; findings name examples only.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed — proven empty: no symbol, export or import specifier changed. The specifier-multiset equality check is the proof.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests — applied here to the below-the-line invariant: shebang-first files, pre-existing bare `'use strict'`, runtime-visible docstrings, build-tool pragmas, zero-import files.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — lane A hooks read environment state; verified after transform.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — one commit per root gives each lane a pinned range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets — no header body contains a credential, absolute developer path, or internal URL
- [ ] CHK-041 [P0] Input validation implemented — N/A; no input path touched
- [ ] CHK-042 [P1] Auth/authz working correctly — N/A
- [ ] CHK-043 [P0] Zero files matching an exemption glob appear in the diff
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec/plan/tasks synchronized
- [ ] CHK-051 [P1] Code comments adequate — header bodies preserve every line of prior preamble prose and embed no ephemeral-artifact pointer
- [ ] CHK-052 [P2] README updated (if applicable) — no README is touched by this child
- [ ] CHK-053 [P1] The permanent fixture exemption is documented where a future author will find it before "fixing" the corpus
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Temp files in scratch/ only
- [ ] CHK-061 [P1] scratch/ cleaned before completion
- [ ] CHK-062 [P1] Pre-lane compiled-routing output copies removed after byte parity is confirmed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 18 | 0/18 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable) — N/A, no migration
- [ ] CHK-104 [P0] The two-gate design is recorded, including why a verifier PASS alone is insufficient
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) — post-edit hook latency re-measured on lane A and within its prior budget
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) — the codemod is deterministic and offline; a lane re-run reproduces its diff exactly
- [ ] CHK-112 [P2] Load testing completed — N/A
- [ ] CHK-113 [P2] Performance benchmarks documented — one representative rig's runtime recorded before and after lane C
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested — a root-level revert exercised at least once, with the live-surface smoke re-run afterwards
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — the exact-header check ships opt-in per Q4
- [ ] CHK-122 [P1] Monitoring/alerting configured — N/A; the live-surface smoke is the signal
- [ ] CHK-123 [P1] Runbook created — the per-root gate commands are recorded so any root can be re-verified independently
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed — limited to the file-mode and exemption boundaries
- [ ] CHK-131 [P1] Dependency licenses compatible — no new dependency introduced by the codemod
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A
- [ ] CHK-133 [P2] Data handling compliant with requirements — N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable) — N/A; no public surface changed
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented — the census commands and per-root gate table recorded for reuse
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
