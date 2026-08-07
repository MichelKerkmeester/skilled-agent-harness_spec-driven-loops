---
title: "Verification Checklist: deep-loop-runtime skill release cleanup"
description: "Level-3 verification checklist with per-phase exit gates, architecture verification, deployment readiness, and human-approval sign-off."
trigger_phrases:
  - "deep-loop-runtime release cleanup checklist"
  - "verification checklist"
  - "phase exit gates"
  - "sign-off"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/001-deep-loop-runtime-release-cleanup"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-checklist-authored"
    next_safe_action: "author-decision-record-and-summary"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001005"
      session_id: "131-000-001-spec-author"
      parent_session_id: "131-000-001-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: deep-loop-runtime skill release cleanup

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 through REQ-015)
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (5 phases with dependency graph)
- [ ] CHK-003 [P1] Dependencies identified and verified available (`validate.sh`, `generate-context.js`, `skill_graph_compiler.py`, `cli-devin`, `cli-opencode` for phase-2 auxiliary)
- [ ] CHK-004 [P0] All 4 JSON schemas present and parse-valid (copied from sibling 002; `node` parse pass)
- [ ] CHK-005 [P0] `resource-map.md` enumerates every artifact in scope (~88 rows including ADR-004 LOG_ONLY code rows + ADR-003 ABSENT_BY_DESIGN row)
- [ ] CHK-006 [P0] `description.json` + `graph-metadata.json` present (manual fields populated)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Markdown lints clean (no broken tables, no missing frontmatter fields)
- [ ] CHK-011 [P0] No broken path references inside `.opencode/skills/deep-loop-runtime/` audited docs (`rg -F` sweep)
- [ ] CHK-012 [P1] All MCP tool names resolve to registered tools in `opencode.json`
- [ ] CHK-013 [P1] Surgical edits respect SCOPE LOCK (no out-of-scope writes; no code edits per ADR-004)
- [ ] CHK-014 [P0] SC-007 invariant: `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/**' '.opencode/skills/deep-loop-runtime/scripts/**' '.opencode/skills/deep-loop-runtime/tests/**' '.opencode/skills/deep-loop-runtime/storage/**'` returns empty at packet close
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Strict validate exits 0 at the end of every phase
- [ ] CHK-021 [P0] Manual playbook spot-check (1 entry dry-run for orchestrator clarity)
- [ ] CHK-022 [P1] HVR score on rewritten README ≥85
- [ ] CHK-023 [P1] Advisor parity: `skill_advisor.py "deep-loop-runtime" --threshold 0.8` surfaces deep-loop-runtime
- [ ] CHK-024 [P1] `validate_document.py --type readme` exits 0 on rewritten README
- [ ] CHK-025 [P1] `extract_structure.py --json` produces valid structure on every Phase 4 artifact
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable audit finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (where applicable).
- [ ] CHK-FIX-004 [P0] Path / parser / redaction fixes include adversarial table tests (where applicable; doc-only packet — n/a for most cases).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion claimed (where applicable).
- [ ] CHK-FIX-006 [P1] Hostile env / global-state variant executed where tests or code read process-wide state (n/a for this doc-only packet).
- [ ] CHK-FIX-007 [P1] Evidence pinned to fix SHA or explicit diff range, not a moving branch-relative range.
- [ ] CHK-FIX-008 [P0] Code-class findings (lib/scripts/tests/storage) ALL marked `status: defer:follow-on-packet` per ADR-004; zero in-packet code edits.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any spec-folder file
- [ ] CHK-031 [P0] `DEEPSEEK_API_KEY` (if used in phase-2 auxiliary dispatch) stays in `.env` (gitignored); verify via `git check-ignore .env`
- [ ] CHK-032 [P1] No phase-5 prompt embeds credentials, tokens, or session keys
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
- [ ] CHK-052 [P0] Spec folder lives at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/`
- [ ] CHK-053 [P0] `findings/` populated only by phase 2; `validation/` populated only by phase 4
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [ ]/16 |
| P1 Items | 16 | [ ]/16 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: [YYYY-MM-DD — filled at completion]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001 through ADR-006)
- [ ] CHK-101 [P1] All ADRs carry status `Proposed`, `Accepted`, or `Reserved`
- [ ] CHK-102 [P1] Each ADR documents alternatives with rejection rationale
- [ ] CHK-103 [P2] ADR-007 (Smart Router edit) added if and only if phase-2 cascade forces it
- [ ] CHK-104 [P0] ADR-006 (human approval) added before any phase-5 dispatch
- [ ] CHK-105 [P0] ADR-002 toolchain compliance: all phase-5 iterations use cli-devin SWE-1.6 (no executor mix)
- [ ] CHK-106 [P0] ADR-004 boundary enforced: code-class findings ALL `defer:follow-on-packet`
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Strict validator completes in <10s per spec-folder invocation (NFR-P01)
- [ ] CHK-111 [P1] Per-iteration phase-5 budget met (≤15 min cli-devin SWE-1.6) (NFR-P02)
- [ ] CHK-112 [P2] No phase-5 iteration triggers swap thrash on this Mac (RSS monitored between iters)
- [ ] CHK-113 [P1] Phase-2 audit dispatch budget met (≤10 min per artifact class when delegated to cli-opencode + deepseek-v4-pro) (NFR-P03)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` §7 and §L2 enhanced-rollback
- [ ] CHK-121 [P0] No feature flag required (documentation/process work)
- [ ] CHK-122 [P1] Monitoring not applicable (no runtime surface change)
- [ ] CHK-123 [P1] Runbook embedded in `plan.md` §Phase-5
- [ ] CHK-124 [P2] Worktree state clean at packet completion (not blocking; per `feedback_worktree_cleanliness_not_a_blocker`)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No third-party content copied into spec docs without attribution
- [ ] CHK-131 [P1] Dependency licenses not changed (no new third-party deps introduced)
- [ ] CHK-132 [P2] OWASP top-10 not applicable (no runtime change)
- [ ] CHK-133 [P2] Data handling not applicable (no user data processed)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `resource-map.md`)
- [ ] CHK-141 [P1] README rewrite reflects current skill surface (no stale feature names; every domain from feature_catalog/ covered)
- [ ] CHK-142 [P2] User-facing changelog entry `v1.1.0.0.md` published
- [ ] CHK-143 [P2] Knowledge transfer: phase-5 convergence-summary documents iteration patterns for future packets
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Operator] | Skill Maintainer (Plan Author) | [ ] Approved | |
| [Operator] | Phase-4 Gate Reviewer (Human) | [ ] Approved | |
| [Operator] | Final QA (Post-Phase-5) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
