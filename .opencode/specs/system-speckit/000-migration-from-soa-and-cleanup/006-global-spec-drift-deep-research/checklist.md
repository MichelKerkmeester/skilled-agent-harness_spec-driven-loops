---
title: "Verification Checklist: Global spec-drift and prior-context-optimization deep-research sweep"
description: "Verification checklist for the up-to-30-iteration normal-convergence 3-executor (GLM/SOL/LUNA) deep-research sweep across ALL of .opencode/specs/*, gating phase 007's teardown on a committed research/research.md and triaged findings."
trigger_phrases:
  - "global spec drift research checklist"
  - "deep research fan-out verification"
  - "006 checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Level 2 verification checklist"
    next_safe_action: "Do not mark items done without evidence"
    blockers:
      - "Ordering gate from parent spec.md: this phase MUST NOT begin until all five numbering/reconstruction phases (001-005) are complete; at scaffold time all five show Draft status in the parent's Phase Documentation Map"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Global spec-drift and prior-context-optimization deep-research sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`; evidence: `spec.md` sections 2-5 define problem, scope, requirements (REQ-001..007), and success criteria (SC-001..004).
- [x] CHK-002 [P0] Technical approach defined in `plan.md`; evidence: `plan.md` sections 3-4 define the command-driven fan-out architecture and 3-phase implementation plan, verified against real source (`.opencode/commands/deep/research.md`, `system-deep-loop/deep-research` feature catalog).
- [ ] CHK-003 [P1] Dependencies identified and available; evidence so far: `plan.md` §6 identifies all 5 dependencies, but "available" is NOT yet confirmed for phases 001-005 (all Draft at scaffold time) or the sk-git worktree/branch gate (not yet run).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `research/deep-research-config.json` parses as valid JSON and matches the assembled `--executors` payload; not yet launched.
- [ ] CHK-011 [P0] No executor spawn errors (e.g., SOL throwing on a stray `--service-tier`); not yet launched.
- [ ] CHK-012 [P1] Divergent-mode pivot handling — N/A for this run: divergent mode is unavailable on the research fan-out path and is not used (normal convergence), so there is no pivot behavior to verify.
- [ ] CHK-013 [P1] Comment hygiene: no spec-path or packet/phase IDs embedded in any generated code comments (only markdown prose); N/A until execution produces artifacts to check.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria in `spec.md` are met (REQ-001..005); not yet launched.
- [ ] CHK-021 [P0] Total iteration count across the 3 lineages is up to 30 (up to 10 GLM + 10 SOL + 10 LUNA); fewer under normal convergence is acceptable provided the actual per-lineage counts are recorded; not yet launched.
- [ ] CHK-022 [P1] `research/research.md` names the full `.opencode/specs/*` sweep scope explicitly, not a narrowed subset; not yet synthesized.
- [ ] CHK-023 [P1] Findings triage table exists with each item remediated (evidence) or explicitly deferred (reason); not yet triaged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class per changed surface; evidence: N/A — this is a read-only research sweep with no code fix; the template's fix-completeness classification does not apply to application code, only to the `--executors` translation documented in `plan.md` §3.
- [x] CHK-FIX-002 [P0] Same-class producer inventory; evidence: N/A — no application source files are modified by this packet.
- [x] CHK-FIX-003 [P0] Consumer inventory for changed symbols/policies/schema/docs/tests; evidence: N/A — the only "consumer" of this packet's output is phase 007, documented in `spec.md` REQ-004.
- [x] CHK-FIX-004 [P0] Adversarial table tests for security/path/parser/redaction fixes; evidence: N/A — no such logic is touched by this packet.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed; `plan.md` §3 lists 3 axes (executor kind, effort, `service_tier` presence) — applies at launch verification, not yet executed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant; evidence: N/A — no process-wide state is read or mutated by this packet's own docs.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range; will be pinned to the commit hash of `research/research.md` once produced (`spec.md` REQ-004) — not yet available.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; evidence: all four authored files in this scaffolding pass are planning markdown with no credentials.
- [ ] CHK-031 [P0] Input validation implemented; N/A for this packet's own docs — applies to the `--executors` JSON assembly step, not yet executed.
- [ ] CHK-032 [P1] Auth/authz working correctly; N/A — no new auth surface; executor CLI dispatch reuses existing verified `cli-opencode`/`cli-codex` authentication, not yet exercised for this launch.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized; evidence: `spec.md`, `plan.md`, and `tasks.md` all reference the same 3-phase structure, the same executor schema, and the same REQ/SC IDs.
- [ ] CHK-041 [P1] Code comments adequate; N/A until execution produces artifacts with comments to check.
- [ ] CHK-042 [P2] README updated (if applicable); N/A — this packet does not touch any README.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/`/tool-output locations only; applies at execution time, not yet run.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion; applies at execution time, not yet run.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 7/15 |
| P1 Items | 23 | 2/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Not yet run — this checklist was scaffolded 2026-07-16 for a Draft-status packet; no execution (launch, lineage completion, or synthesis) has occurred yet.
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision documented; evidence: `plan.md` L3 ADR-001 documents the decision to use `/deep:research :auto` rather than a hand-rolled loop — marked pending here because a decision-record.md is optional for this packet and was not authored in this scaffolding pass (per orchestrator instruction); the ADR content lives inline in `plan.md` instead.
- [ ] CHK-101 [P1] ADR has accepted status; evidence: `plan.md` L3 ADR-001 status is "Accepted".
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale; evidence: `plan.md` L3 ADR-001 lists 2 rejected alternatives with reasons.
- [ ] CHK-103 [P2] Migration path documented (if applicable); N/A — no migration, only a research sweep.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01); N/A — no response-time target; default 4h per-lineage timeout applies unless raised.
- [ ] CHK-111 [P1] Throughput targets met; N/A — no throughput target for a research sweep.
- [ ] CHK-112 [P2] Load testing completed; N/A — not applicable to a research packet.
- [ ] CHK-113 [P2] Performance benchmarks documented; N/A — not applicable to a research packet.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested; evidence: `plan.md` §7 and L2 ENHANCED ROLLBACK document the procedure; "tested" is pending until an actual rollback scenario is exercised or explicitly waived.
- [ ] CHK-121 [P0] Feature flag configured (if applicable); N/A — no runtime feature flag for a research sweep.
- [ ] CHK-122 [P1] Monitoring/alerting configured; N/A — no deployed service or alerting surface changes.
- [ ] CHK-123 [P1] Runbook created; evidence: `plan.md` §4 Phase 2 documents the exact launch command as the runbook step; monitoring steps for the 3 lineages are Tasks T006-T008.
- [ ] CHK-124 [P2] Deployment runbook reviewed; not yet reviewed by a second party.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed; N/A — no new auth/security surface introduced by this packet.
- [ ] CHK-131 [P1] Dependency licenses compatible; N/A — no new dependencies added.
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed; N/A — no web/API surface changes.
- [ ] CHK-133 [P2] Data handling compliant with requirements; N/A — no user data handled by this packet.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized after implementation; will re-verify once `implementation-summary.md` exists (Task T014).
- [ ] CHK-141 [P1] API documentation complete (if applicable); N/A — no public API changed.
- [ ] CHK-142 [P2] User-facing documentation updated; N/A — this is an internal research packet, not user-facing.
- [ ] CHK-143 [P2] Knowledge transfer documented; will be captured in `implementation-summary.md` once execution completes.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Scope owner | Pending — spec/plan/tasks/checklist scaffolded, not yet reviewed | |
| Executor (whoever runs the launch) | Implementer | Pending — launch not yet performed | |
<!-- /ANCHOR:sign-off -->
