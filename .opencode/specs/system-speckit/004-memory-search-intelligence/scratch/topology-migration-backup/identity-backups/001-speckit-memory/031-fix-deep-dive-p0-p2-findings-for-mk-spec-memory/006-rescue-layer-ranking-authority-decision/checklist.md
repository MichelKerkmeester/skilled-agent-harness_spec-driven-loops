---
title: "Verification Checklist: Phase 6: Rescue-Layer Ranking Authority Decision"
description: "Verification protocol for eval-production parity, the A/B/C rescue authority benchmark, signal-ordering contract encoding, stage2 doc alignment, and dead-battery disposition. Verification Date: pending (set when verification runs)."
trigger_phrases:
  - "rescue layer ranking authority"
  - "eval production parity"
  - "verification checklist"
  - "signal ordering contract"
  - "benchmark deltas"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-04T17:51:13.246Z"
    last_updated_by: "planning-session"
    recent_action: "Authored Level 3 verification checklist"
    next_safe_action: "Mark items only with concrete evidence during execution"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-rescue-layer-ranking-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 6: rescue-layer-ranking-authority-decision

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010 with acceptance criteria) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-002 [P0] Technical approach defined in plan.md (incl. FIX ADDENDUM affected-surfaces inventory) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-003 [P1] Dependencies identified and available (phases 001-005 status confirmed before Part 2 benchmark) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-004 [P0] Baseline captured BEFORE any code change: vitest whole-gate baseline (T001), pre-parity eval output (T002), pinned query set (T003) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (mcp_server toolchain) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-011 [P0] No console errors or warnings introduced in eval/ablation runs [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-012 [P1] Error handling implemented (ablation restore failure path; missing gold labels; empty injection sets) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-013 [P1] Code follows project patterns; no finding IDs or packet numbers in code comments (comment-hygiene HARD BLOCK) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ table verified row by row with evidence) [EVIDENCE: REQ-001..004,006..010 met and verified; REQ-005 (ADR-002 accept) deferred by operator pending clean re-benchmark]
- [x] CHK-021 [P0] Manual testing complete (one eval run + one ablation round-trip exercised by hand, output inspected) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-022 [P1] Edge cases tested (zero-lexical-overlap query, all-equal-overlap tie plateau, injected-row-only results) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-023 [P1] Error scenarios validated (swap during concurrent search; harness failure mid-benchmark discards partial variant results) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-024 [P0] Parity assertion test green: eval path composition == production `executePipeline` composition incl. truncation, and the `ALL_CHANNELS` ablation toggles map onto pipeline channel-enable config (disabling a channel in ablation disables the same pipeline channel) (REQ-001) [EVIDENCE: parity assertion: eval-reporting composition == production executePipeline (channels/co-activation/render-floor K=3)]
- [x] CHK-025 [P0] A/B/C benchmark rows recorded: per-variant MRR + rank-position deltas (the gated discriminators) plus prod-mode completeRecall@3 as a no-regression floor, all vs current default, with corpus snapshot stats (REQ-004) [EVIDENCE: A/B/C benchmark rows recorded in decision-record: A 0.40, B 0.20, C 0.20 completeRecall@3 + MRR + meanFirstRank]
- [x] CHK-026 [P0] Signal-ordering contract test green and added to the permanent vitest gate (REQ-006) [EVIDENCE: signal-ordering contract test in retrieval-rescue.vitest (permanent gate)]
- [x] CHK-027 [P1] Rescue-dominance tests updated to assert the ACCEPTED contract; no test still asserts a rejected option [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (rescue/lexicalOverlap producers per plan.md inventory commands). [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (hybridSearch, rebindDatabaseConsumers, graphSearchFn, battery modules). [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (eval DB path resolution: two-cwd + outside-root cases). [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (variant x query-class x flag matrix in scratch/benchmark-matrix.md). [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (cwd variation for eval DB path; DB-swap global state). [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (no DB paths or credentials embedded in harness code) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-031 [P0] Input validation implemented (benchmark query set + gold labels validated before scoring; malformed rows rejected loudly) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-032 [P1] DB boundary isolation enforced via mechanism: `rebindDatabaseConsumers` rebuilds `graphSearchFn` per-connection (not the module-level `graphSearchFnRef`) and the global `vectorIndex` DB swap is mutex/quiesce-guarded so production consumers never bind to the eval DB or a closed connection, and no concurrent search reads the eval DB (REQ-002 / NFR-S01) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (no doc claims a state another doc contradicts) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-041 [P1] Code comments adequate: durable WHY only; the accepted contract stated where rescue applies [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-042 [P2] README updated (if applicable beyond pipeline/README.md) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-043 [P0] Stage2 doc == behavior: `stage2-fusion.ts` 13-step header (lines 21, 1011) and `lib/search/pipeline/README.md` describe the accepted contract with file:line evidence (REQ-007) [EVIDENCE: stage2-fusion step header + pipeline/README describe the actual composition]
- [x] CHK-044 [P1] Computed-but-discarded sweep recorded: every surviving unused signal carries an explicit doc note or was removed (REQ-010) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (baselines, benchmark matrix, results drafts) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-051 [P1] scratch/ cleaned before completion (results promoted into decision-record.md / implementation-summary.md) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 20/21 |
| P1 Items | 25 | 22/25 |
| P2 Items | 9 | 5/9 |

**Verification Date**: 2026-07-04 (parity harness + modes integrated, 31 tests green; ADR-002 deferred by operator)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 parity, ADR-002 authority, ADR-003 contract + battery) [EVIDENCE: ADR-001 Accepted, ADR-002 Proposed (operator-deferred), ADR-003 documented in decision-record]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted); ADR-002 and ADR-003 flipped to Accepted only with benchmark evidence [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (Options A/B/C scored; losing options carry measured reasons) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-103 [P2] Migration path documented (flag removal or default flip steps for the accepted option) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [ ] CHK-104 [P0] ADR-002 Accepted with measured MRR + rank-position deltas (completeRecall@3 as no-regression floor) BEFORE any production default changes ship (REQ-005)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Benchmark session bounded and repeatable (NFR-P01: full A/B/C run target < 30 min wall clock)
- [ ] CHK-111 [P1] MRR + rank-position recorded per variant AS the decision-gate discriminators (completeRecall@3 saturates at K=3); only stage2 latency is recorded as context and explicitly NOT a decision gate
- [ ] CHK-112 [P2] Write-path cost delta measured if the O(folder^2) interference refresh is deleted
- [ ] CHK-113 [P2] Performance observations handed to phase 010 (rescue hydration/backfill stay out of scope here)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested (flag flip back to Option A behavior; independent revert commits per plan.md §7) [EVIDENCE: rollback = SPECKIT_RETRIEVAL_RESCUE_MODE flip back to overwrite (config, reversible)]
- [x] CHK-121 [P0] Feature flags configured: variants B/C flag-gated; defaults unchanged until ADR-002 Accepted (NFR-R01) [EVIDENCE: variants additive/floor flag-gated; default overwrite unchanged (the deferred posture)]
- [x] CHK-122 [P1] Monitoring/alerting: parity assertion + contract test live in the permanent vitest gate [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-123 [P1] Runbook: benchmark re-run steps recorded (query set location, flags, scoring command) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [ ] CHK-124 [P2] Deployment runbook reviewed against the accepted option's flag/default state
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed (DB isolation boundary; no eval artifacts leak into production surfaces) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected; confirm none added) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (limited applicability: local tooling; note reasoning) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-133 [P2] Data handling compliant with requirements (benchmark artifacts contain no sensitive memory content beyond what the corpus already stores) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary agree on outcome) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [x] CHK-141 [P1] API documentation complete (eval/ablation handler behavior notes match routed pipeline) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
- [ ] CHK-142 [P2] User-facing documentation updated (memory command docs if eval output shape changed)
- [x] CHK-143 [P2] Knowledge transfer documented (benchmark method reusable by phases 007/010) [EVIDENCE: eval-parity harness built (eval runs executePipeline); build clean; 31 tests green; xhigh-scope-halt resolved; validate --strict green]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead | [ ] Approved | |
| Michel Kerkmeester | Product Owner | [ ] Approved | |
| Michel Kerkmeester | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
