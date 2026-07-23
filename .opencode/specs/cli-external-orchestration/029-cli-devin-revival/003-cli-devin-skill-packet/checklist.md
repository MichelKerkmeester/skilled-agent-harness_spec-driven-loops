---
title: "Verification Checklist: cli-devin skill packet"
description: "Verification Date: Planned - not yet executed"
trigger_phrases: ["cli-devin skill checklist", "cli-devin mode verification"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/003-cli-devin-skill-packet"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for the planned cli-devin skill-packet phase"
    next_safe_action: "Author decision-record.md for this phase"
    blockers: ["Phase 002 (deep-loop-executor-support) must land and pass validate.sh --strict before this phase's implementation starts, per the parent packet's Phase Transition Rules"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-devin skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

All items below are unchecked — this phase is Planned, not yet implemented or verified.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P1] Baseline validator run (`parent-skill-check.cjs` + `validate_skill_package.py`) captured before any edit
- [ ] CHK-004 [P1] `create-skill` packet-level templates read fresh (`skill-md-template.md`, `skill-readme-template.md`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `SKILL.md` frontmatter `name` equals the folder name AND the registry `packetSkillName` (`cli-devin`)
- [ ] CHK-011 [P0] `SKILL.md` `version` is four-part (`"1.0.0.0"`)
- [ ] CHK-012 [P1] `hard_rules` frontmatter block mirrors the `codex-availability-required`/`self-invocation-prohibited`/`deep-loop-runtime-required` triad
- [ ] CHK-013 [P1] Self-invocation guard function present in Section 2, built from confirmed signals only (per ADR-002)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `parent-skill-check.cjs` against the hub returns 0 fails / 0 warnings
- [ ] CHK-021 [P0] `validate_skill_package.py` against the hub returns 0 fails
- [ ] CHK-022 [P1] `mode-registry.json`'s `cli-devin` entry matches the exact schema given in `spec.md` REQ-004
- [ ] CHK-023 [P1] `hub-router.json`'s `routerPolicy.tieBreak` is an exact 4-element permutation of all registry `workflowMode` values
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is new construction, not a bug fix — the finding-class taxonomy below does not apply to packet authoring. Items are retained for template conformance and marked N/A where inapplicable.

- [ ] CHK-FIX-001 [P0] N/A - no fix findings to classify (new packet construction)
- [ ] CHK-FIX-002 [P0] N/A - no producer/consumer regression risk beyond the 3 existing sibling modes (see CHK-FIX-003)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the 3 existing sibling mode entries in `mode-registry.json`/`hub-router.json` — confirm none of their fields change
- [ ] CHK-FIX-004 [P0] N/A - no path/parser/redaction logic touched
- [ ] CHK-FIX-005 [P1] N/A - no matrix-axis testing required for doc/config authoring
- [ ] CHK-FIX-006 [P1] N/A - no process-wide state read
- [ ] CHK-FIX-007 [P1] Evidence pinned to the phase's commit SHA once landed, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials in any authored file (`SKILL.md`/`README.md`/`references/`/`assets/` never embed a Devin auth token)
- [ ] CHK-031 [P0] N/A - no user-input validation surface (static packet authoring)
- [ ] CHK-032 [P1] N/A - no auth/authz code introduced in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md` cross-references synchronized
- [ ] CHK-041 [P1] Every authored reference/asset file cites this phase's grounded facts, not invented specifics
- [ ] CHK-042 [P2] Confirmed the hub-root `README.md`'s stale "`defaultMode` is `cli-opencode`" prose is a pre-existing, out-of-scope discrepancy and was not silently touched by this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 14 | [ ]/14 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001 packet-kind, ADR-002 self-invocation guard, ADR-003 prompt-quality-card)
- [ ] CHK-101 [P1] All 3 ADRs have a status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for each ADR
- [ ] CHK-103 [P2] N/A - no migration path applicable; this is new packet construction, not a migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] N/A - no response-time target applicable to static doc/config authoring
- [ ] CHK-111 [P1] N/A - no throughput target applicable
- [ ] CHK-112 [P2] N/A - no load testing applicable
- [ ] CHK-113 [P2] N/A - no performance benchmarks applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested in `plan.md` §7 (remove `cli-devin/`, revert 5 hub-root file edits, regenerate `leaf-manifest.json`, re-validate)
- [ ] CHK-121 [P0] N/A - no feature flag applicable; the hub has no defaultMode/flag gating this addition
- [ ] CHK-122 [P1] N/A - no runtime monitoring/alerting surface for a static skill packet
- [ ] CHK-123 [P1] N/A - no separate runbook needed beyond `tasks.md`'s Phase 3 verification steps
- [ ] CHK-124 [P2] N/A - no deployment runbook beyond the validators already cited in REQ-007
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (no secrets, no credentials, no auth code introduced — see CHK-030/031/032)
- [ ] CHK-131 [P1] N/A - no new third-party dependency or license introduced
- [ ] CHK-132 [P2] N/A - OWASP Top 10 not applicable to static Markdown/JSON authoring
- [ ] CHK-133 [P2] N/A - no data handling surface introduced
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All 5 spec documents (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md`) synchronized
- [ ] CHK-141 [P1] N/A - no external API documentation applicable
- [ ] CHK-142 [P2] `cli-devin/README.md` reviewed as the user-facing documentation for this packet
- [ ] CHK-143 [P2] Knowledge transfer documented via the 3 ADRs in `decision-record.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|---|---|---|---|
| Operator | Packet Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
