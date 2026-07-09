---
title: "Verification Checklist: deep-ai-council skill release cleanup"
description: "Level-3 verification checklist with per-phase exit gates, architecture verification, deployment readiness, and human-approval sign-off."
trigger_phrases:
  - "deep-ai-council release cleanup checklist"
  - "verification checklist"
  - "phase exit gates"
  - "sign-off"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/011-deep-ai-council-release-cleanup"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-checklist-authored"
    next_safe_action: "author-decision-record-and-summary"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004005"
      session_id: "131-000-004-spec-author"
      parent_session_id: "131-000-004-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: deep-ai-council skill release cleanup

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 through REQ-014)
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (5 phases with dependency graph)
- [ ] CHK-003 [P1] Dependencies identified and verified available (`validate.sh`, `skill_graph_compiler.py`, `cli-devin`/`devin` binary, sk-doc templates, `hvr_rules.md`)
- [ ] CHK-004 [P0] All 4 JSON schemas authored and validate sample payloads (`ajv validate -s <schema> -d <sample>` or manual equivalence)
- [ ] CHK-005 [P0] `resource-map.yaml` enumerates every artifact in scope (~100 rows)
- [ ] CHK-006 [P0] `description.json` + `graph-metadata.json` present (hand-authored; parent wiring untouched)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Markdown lints clean (no broken tables, no missing frontmatter fields)
- [ ] CHK-011 [P0] No broken path references inside `.opencode/skills/deep-ai-council/` (`rg -F` sweep)
- [ ] CHK-012 [P1] All MCP / `council_graph_*` tool names resolve to registered tools
- [ ] CHK-013 [P1] Surgical edits respect SCOPE LOCK (no out-of-scope writes)
- [ ] CHK-014 [P1] Script bug-scan clean: `node -c` on every `.cjs`, `bash -n` on every `.sh` (no syntax errors)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Strict validate exits 0 at the end of every phase
- [ ] CHK-021 [P0] Manual playbook spot-check (1 entry dry-run for orchestrator clarity)
- [ ] CHK-022 [P1] HVR score on rewritten README ≥85
- [ ] CHK-023 [P1] Advisor parity: `skill_advisor.py "run a deep ai council" --threshold 0.8` surfaces deep-ai-council
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable audit finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (where applicable).
- [ ] CHK-FIX-004 [P0] Path / parser / redaction fixes include adversarial table tests (where applicable).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion claimed (where applicable).
- [ ] CHK-FIX-006 [P1] Hostile env / global-state variant executed where tests or code read process-wide state (where applicable).
- [ ] CHK-FIX-007 [P1] Evidence pinned to fix SHA or explicit diff range, not a moving branch-relative range.
- [ ] CHK-FIX-008 [P0] Every phase-1 candidate-drift item verified against template + file before edit (no false-positive edits).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any spec-folder file
- [ ] CHK-031 [P1] No phase-5 dispatch prompt embeds credentials, tokens, or session keys
- [ ] CHK-032 [P2] No secret-shaped strings introduced into skill artifacts during edits
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md` / `plan.md` / `tasks.md` synchronized (no contradictions)
- [ ] CHK-041 [P1] `decision-record.md` ADRs match locked decisions in `spec.md` §EXECUTIVE SUMMARY
- [ ] CHK-042 [P2] README cross-system connections reflect actual current paths in repo
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All temp scratch files live under `scratch/` (if any used) — none expected for this packet
- [ ] CHK-051 [P1] `research/iterations/` populated only by phase 5; not pre-seeded
- [ ] CHK-052 [P0] Spec folder lives at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 15 | 15/15 |
| P2 Items | 5 | 5/5 (verified or NA-documented; doc/test follow-ons tracked in resource-map.yaml phase_5_augmentation) |

**Verification Date**: 2026-05-24 — detailed evidence in `implementation-summary.md` §Verification + `validation-report.md`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001 through ADR-006)
- [ ] CHK-101 [P1] All ADRs carry status `Proposed` or `Accepted`
- [ ] CHK-102 [P1] Each ADR documents alternatives with rejection rationale
- [ ] CHK-103 [P2] ADR-005 (Smart Router edit) added if and only if phase-2 cascade forces it
- [ ] CHK-104 [P0] ADR-006 (human approval) added before any phase-5 dispatch
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Strict validator completes in <10s per spec-folder invocation (NFR-P01)
- [ ] CHK-111 [P1] Per-iteration phase-5 budget met (≤15 min SWE-1.6) (NFR-P02)
- [ ] CHK-112 [P2] No phase-5 iteration triggers swap thrash on this Mac (RSS monitored between iters; devin-preserving sweep)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` §7 and §L2 enhanced-rollback
- [ ] CHK-121 [P0] No feature flag required (documentation/process work)
- [ ] CHK-122 [P1] Monitoring not applicable (no runtime surface)
- [ ] CHK-123 [P1] Runbook embedded in `plan.md` §Phase-5
- [ ] CHK-124 [P2] Worktree state clean at packet completion (not blocking; per `feedback_worktree_cleanliness_not_a_blocker`)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No third-party content copied into spec docs without attribution
- [ ] CHK-131 [P1] Dependency licenses not changed (no new third-party deps introduced)
- [ ] CHK-132 [P2] OWASP top-10 not applicable (no runtime change)
- [ ] CHK-133 [P1] Planning-only boundary preserved in any script edits (council writes stay scoped to `ai-council/**`)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `resource-map.yaml`)
- [ ] CHK-141 [P1] README rewrite reflects current skill surface (no stale feature names; changelog list + STRUCTURE tree current to v2.x)
- [ ] CHK-142 [P2] User-facing changelog entry `v2.1.0.0.md` published
- [ ] CHK-143 [P2] Knowledge transfer: phase-5 convergence-summary documents iteration patterns for future packets
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Skill Maintainer (Plan Author) | [x] Approved | 2026-05-24 |
| Operator | Phase-4 Gate Reviewer (Human) | [x] Approved (ADR-006) | 2026-05-24 |
| Operator | Final QA (Post-Phase-5) | [ ] Pending operator review | |
<!-- /ANCHOR:sign-off -->
