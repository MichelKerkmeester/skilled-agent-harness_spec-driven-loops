---
title: "Verification Checklist: Code README Standard And Enforcement"
description: "Verification Date: not yet verified"
trigger_phrases:
  - "code readme standard checklist"
  - "readme enforcement checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist across all gates"
    next_safe_action: "Verify CHK-001 through CHK-005 once findings are re-confirmed against HEAD"
    blockers:
      - "Operator rulings Q1, Q2, Q3 required before most items can be verified"
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-001-code-readme-standard-and-enforcement"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Code README Standard And Enforcement

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Planned phase — all items open. Mark `[x]` only with evidence (command output, file:line, or artifact path).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 10 findings re-verified against HEAD with confirmed/drifted/refuted recorded per ID
- [ ] CHK-002 [P0] Operator rulings Q1, Q2, Q3 received and recorded as ADRs
- [ ] CHK-003 [P0] Durable-directory manifest re-frozen at current HEAD, or confirmed unchanged from the 501 baseline
- [ ] CHK-004 [P1] CI and script call sites of `validate_document.py` enumerated
- [ ] CHK-005 [P1] Baseline verdict dump over existing READMEs captured and stored
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The code-folder branch is opt-in; the existing README code path is unmodified
- [ ] CHK-011 [P0] Every new rule emits a named rule id a caller can act on
- [ ] CHK-012 [P1] Link resolution is relative to the README's own location, not the CWD
- [ ] CHK-013 [P1] Exclusion classifier accepts named path classes only — no ad-hoc path strings
- [ ] CHK-014 [P1] No spec paths, packet ids or task ids appear in any code comment added by this phase
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Each of the 9 negative fixtures flags with its expected rule id
- [ ] CHK-021 [P0] The conformant control fixture passes with zero findings
- [ ] CHK-022 [P0] Verdict dump over existing READMEs is byte-identical pre/post
- [ ] CHK-023 [P0] Existing `sk-doc/scripts/tests/` suite green
- [ ] CHK-024 [P0] Auditor reproduces the raw candidate set against the frozen manifest
- [ ] CHK-025 [P0] Codified exclusions reduce the candidate set to the agreed actionable set
- [ ] CHK-026 [P1] `.pi/extensions/README.md` and `.github/workflows/README.md` appear in the audited set
- [ ] CHK-027 [P1] All 21 disposition path classes report as exclusions, none as gaps
- [ ] CHK-028 [P1] The durability grep does not fire on the control fixture's legitimate example command
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class recorded: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`
- [ ] CHK-FIX-002 [P0] The three analysis-only findings (`RA-003-06`, `RA-005-41`, `RA-009-01`) resolved via ADR, with no per-file task created
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed validator, rule data, and auditor — CI, scripts, and the create-readme workflow
- [ ] CHK-FIX-004 [P0] Link and durability checks carry adversarial cases: link inside a fenced block, path with a trailing punctuation mark, example command containing a spec-like path
- [ ] CHK-FIX-005 [P1] Fixture matrix axes and row count listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Validator run from a non-repo-root CWD produces the same verdicts
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials in fixtures or authored text
- [ ] CHK-031 [P1] The manifest walk does not follow symlinks outside the repository root
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `SKILL.md` §6 states the tree rule and the format-rule scope explicitly — no requirement is left to inference
- [ ] CHK-041 [P0] `rg -n "with anchors|TOC entries match" hvr-rules.md` returns zero, or only lines explicitly scoped away from code-folder READMEs
- [ ] CHK-042 [P1] Code template scaffold and `SKILL.md:231` agree on frontmatter and tagline
- [ ] CHK-043 [P1] `quality-and-checklist.md` reconciled with the ruling
- [ ] CHK-044 [P1] `audit_readmes.py` docstring scope statement matches its real behavior
- [ ] CHK-045 [P1] spec / plan / tasks / decision-record synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Fixtures live under the existing `sk-doc/scripts/tests/` harness, not a new parallel tree
- [ ] CHK-051 [P1] Temp files in `scratch/` only; `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 19 | 0/19 |
| P2 Items | 0 | 0/0 |

**Verification Date**: not yet verified
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 to ADR-004 recorded in `decision-record.md`
- [ ] CHK-101 [P0] Every ADR has status Accepted before completion is claimed
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale, including the "fenced tree always mandatory" option
- [ ] CHK-103 [P1] Second reader confirmed each ADR against the surface it rules on
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] Validator run time over the full existing-README corpus does not materially regress against the T040 baseline dump
- [ ] CHK-111 [P2] The manifest-walk auditor completes a full-repo pass without excessive runtime versus the pre-change `find_readmes()` walk
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure exercised: reverting the validator commits restores the baseline verdict dump exactly
- [ ] CHK-121 [P0] The code-folder mode ships off by default
- [ ] CHK-122 [P1] Handoff note published for `002` (c), `003` and `036/019` with the ruling, the mode invocation, and the manifest path
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Fixture corpus contains no real secrets, real spec paths or real commit hashes outside the deliberate adversarial test cases (CHK-FIX-004)
- [ ] CHK-131 [P2] N/A — no license or third-party attribution surface in this phase (Python 3 stdlib + existing repo tooling only)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) cross-reference the same ADR numbers with no contradiction
- [ ] CHK-141 [P2] N/A — no public API documentation surface (see `spec.md` §3 SCOPE)
- [ ] CHK-142 [P1] Handoff note (CHK-122) gives `002`, `003` and `036/019` enough to consume the ruling and the mode without re-deriving it
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Ruling authority (Q1/Q2/Q3) | [ ] Approved | |
| Second reader | ADR-vs-source confirmation | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
