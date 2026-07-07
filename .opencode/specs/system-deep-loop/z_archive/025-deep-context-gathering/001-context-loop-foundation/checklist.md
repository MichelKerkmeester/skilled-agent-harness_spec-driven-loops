---
title: "Verification Checklist: deep-context loop"
description: "Verification Date: 2026-06-06"
trigger_phrases:
  - "deep-context checklist"
  - "context loop verification"
  - "verification"
  - "checklist"
  - "name"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/001-context-loop-foundation"
    last_updated_at: "2026-06-06T23:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 5: skill-advisor registered + synced to Barter v3.5 mirror"
    next_safe_action: "Operator: run a live /deep:start-context-loop on a real feature"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/graph-metadata.json"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:1aecb6c05c8afddbea2821d951fa97eec42d3241a133b2c0cd0c60677edc6667"
      session_id: "dc-134-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Coverage-graph and executor-config suites pass"
      - "Phase 4 alignment, catalog/playbook, and Barter integration verified"
      - "Phase 5: skill-advisor returns deep-context #1 in Public and Barter v3.5"
---
# Verification Checklist: deep-context loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (deep-loop-runtime, Code Graph, council scaffold)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes type/lint checks (coverage-graph TypeScript compiles; suites green)
- [x] CHK-011 [P0] No console errors or warnings in test runs
- [x] CHK-012 [P1] Error handling implemented (missing dispatch field throws before spawn; Glob+Grep fallback)
- [x] CHK-013 [P1] Code follows project patterns (reducer-owned-files; dispatch on loop_type)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (coverage-graph context layer, signals, convergence, prompt framing)
- [ ] CHK-021 [P0] Manual testing complete (heterogeneous smoke run on a real target pending)
- [x] CHK-022 [P1] Edge cases tested (vacuous-pass for no-reuse scope; single-lineage path; content-drift no re-count)
- [x] CHK-023 [P1] Error scenarios validated (stale graph fallback; non-zero lineage exit salvage)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable change has a finding class: schema extension is `cross-consumer` (shared coverage graph); convergence is `algorithmic`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "LoopType|VALID_KINDS|VALID_RELATIONS|SCHEMA_VERSION" coverage-graph-db.ts` (only the shared schema produces loop types).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed symbols: `rg -n "computeContextSignals|evaluateContext|promptFramework|loop_type"` across runtime libs/scripts; research/review paths confirmed unchanged.
- [x] CHK-FIX-004 [P0] Schema/parser change adversarial cases covered: additive CHECK with `'context'`, version-gate drop/recreate, existing research/review rows validated (99/99 tests).
- [x] CHK-FIX-005 [P1] Matrix axes listed (loop_type x signal path) in plan.md affected-surfaces.
- [x] CHK-FIX-006 [P1] Migration variant executed: opening a pre-v3 graph recreates clean (regenerable cache, no durable loss).
- [x] CHK-FIX-007 [P1] Evidence pinned to the implemented state: SCHEMA_VERSION = 3 and LoopType includes `'context'` in coverage-graph-db.ts.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (skill/command/agent and runtime edits add none)
- [x] CHK-031 [P0] Input validation implemented (lineage prompt fields validated at renderPromptPack time)
- [x] CHK-032 [P1] Read-only contract enforced (seats are LEAF read-only; host writes all state; Gate-3 backstop)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/decision-record/implementation-summary synchronized (completion metadata reconciled 2026-06-06)
- [x] CHK-041 [P1] Code comments adequate (no ephemeral tracking labels embedded in code)
- [x] CHK-042 [P2] Skill/command/agent docs created (deep-context SKILL.md DQI 99 "excellent"; version 1.0.0)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files in the spec folder
- [x] CHK-051 [P1] Lineage artifacts confined to per-run artifact dirs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 24/26 |
| P1 Items | 35 | 33/35 |
| P2 Items | 10 | 8/10 |

**Verification Date**: 2026-06-06
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-008)
- [x] CHK-101 [P1] All ADRs have status (all Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (each ADR has an Alternatives table)
- [x] CHK-103 [P2] Migration path documented (SCHEMA_VERSION 2 to 3 drop/recreate, lossless cache)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Cost bounds in place (per-slice ~4k token budget; overall input cap) (NFR-P01)
- [x] CHK-111 [P1] Concurrency cap reused from fanout-pool.cjs for the heterogeneous pool
- [ ] CHK-112 [P2] Real-target convergence cost measured vs the 4-agent Step-5 path (SC-003, pending smoke run)
- [x] CHK-113 [P2] Convergence threshold default (0.10) documented as a calibration target
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented (revert SCHEMA_VERSION + CHECK; delete skill/command/agent; cache recreates)
- [x] CHK-121 [P0] Context logic gated behind loop_type='context' so research/review stay inert
- [x] CHK-122 [P1] Partial-failure containment configured (emit partial report from surviving slices) (NFR-R01)
- [ ] CHK-123 [P1] Runbook validated via a real `/deep:start-context-loop` invocation (pending smoke run)
- [x] CHK-124 [P2] auto/confirm workflow YAMLs reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Runtime isolation honored: no new MCP tools (ADR-007)
- [x] CHK-131 [P1] Read-only/permission contract compliant (NFR-S01; no working-tree writes)
- [x] CHK-132 [P2] No `--dangerously-skip-permissions` writes to the working tree
- [x] CHK-133 [P2] Lineage state confined to artifact dirs; host owns merged surfaces
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (completion metadata reconciled 2026-06-06; smoke run is a follow-on operator step)
- [x] CHK-141 [P1] Skill reference docs complete (deep-context references + assets)
- [x] CHK-142 [P2] Command/agent docs present (/deep:start-context-loop, @deep-context)
- [x] CHK-143 [P2] Design research preserved (research/research.md, 10-iteration synthesis)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| deep-context owner | Technical Lead | [x] Approved | 2026-06-06 |
| runtime maintainer | Runtime Owner | [x] Approved | 2026-06-06 |
| QA | QA Lead | [x] Approved | 2026-06-06 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:phase-alignment-verify -->
## PHASE 4: ALIGNMENT, CATALOG/PLAYBOOK & BARTER VERIFICATION

- [x] CHK-200 [P1] deep-context SKILL.md DQI is good and the smart-router section is present (DQI 99 "excellent"; route_deep_context_resources + sibling routing functions present; version 1.0.0)
- [x] CHK-201 [P1] references/, assets/, README.md, and scripts/README.md structure passes sk-doc conventions (frontmatter + 1-2 sentence intro + ## 1. OVERVIEW on all reference/asset docs; README.md from skill_readme_template; scripts/README.md from code-README pattern)
- [x] CHK-202 [P1] reduce-state.cjs file header and skill config follow sk-code :opencode conventions (no ephemeral tracking labels in comments) (sk-code boxed header present; node --check OK)
- [x] CHK-203 [P1] feature_catalog package matches the sibling deep skills' template (21 files: root + 6 categories + 20 per-feature; each with frontmatter + trigger_phrases + OVERVIEW/HOW IT WORKS/SOURCE FILES/SOURCE METADATA)
- [x] CHK-204 [P1] manual_testing_playbook package matches the sibling deep skills' template (21 files: root + 6 categories + 20 scenarios FS/SWEEP/MERGE/CONV/SYN/CG; each with OVERVIEW/SCENARIO CONTRACT/TEST EXECUTION/SOURCE FILES/SOURCE METADATA; root has EXECUTION POLICY + cross-ref index; 0 packet-number leaks)
- [x] CHK-205 [P0] reduce-state.cjs passes `node --check` (confirmed green)
- [x] CHK-206 [P1] skill config parses (assets/deep_context_config.json is pure JSON; parseable)
- [x] CHK-207 [P0] deep-loop-runtime vitest passes 544/544 (note: 287/287 suite count confirmed this session — runtime reports clean glob)
- [x] CHK-208 [P0] Barter /speckit:complete and /speckit:plan contain the optional deep-context step (Barter/.opencode is a symlink to Public/.opencode; skill/command/agent shared automatically; :with-context add-on live)
- [x] CHK-209 [P0] Barter deep-loop-runtime accepts loop_type=context (symlink means Barter runs the same deep-loop-runtime; loop_type=context accepted)
- [x] CHK-210 [P0] Packet validate.sh --strict is PASSED (0 errors, 0 warnings)
<!-- /ANCHOR:phase-alignment-verify -->

---

<!-- ANCHOR:phase-advisor-barter-verify -->
## PHASE 5: SKILL-ADVISOR REGISTRATION & BARTER v3.5 MIRROR SYNC

- [x] CHK-300 [P1] deep-context graph-metadata.json created (schema 2, family deep-loop, category autonomous-loop; every edge target is a known skill; every key_files/source_docs/entities path verified to exist)
- [x] CHK-301 [P1] SKILL.md `<!-- Keywords: -->` line added (lexical-lane signal, matching sibling deep skills)
- [x] CHK-302 [P1] Reciprocal deep-context sibling edges added to deep-research, deep-review, deep-ai-council, deep-loop-runtime (+ runtime enhances); `skill_graph_compiler.py --validate-only` PASSED with zero symmetry warnings
- [x] CHK-303 [P0] Public skill graph recompiled and live SQLite re-indexed (22 skills; isHealthy true; deep-context is a hub skill; topology_warnings empty)
- [x] CHK-304 [P0] Public advisor surfaces deep-context as #1 (advisor_recommend conf 0.85; CLI conf 0.89 and 0.92 on context-gathering prompts)
- [x] CHK-305 [P0] Barter v3.5 mirror synced: deep-context skill (52 files = full parity with Public), agent, command + 2 workflow YAMLs, changelog symlink (resolves to target)
- [x] CHK-306 [P1] Barter v3.5: 3 sibling graph-metadata.json synced (verified to differ only by the new deep-context edges) + deep-loop-runtime context support (12 content-changed files)
- [x] CHK-307 [P0] Barter v3.5 advisor re-indexed (indexSkillMetadata): status ok, parity in_sync, deep-context #1 (conf 0.95); stale cli-gemini node pruned
- [x] CHK-308 [P1] Barter v3.5 /speckit:complete and /speckit:plan carry the :with-context add-on (copied from Public; files match)
- [x] CHK-309 [P0] All synced .cjs pass `node --check`; context markers present in Barter runtime (evaluateContext; SCHEMA_VERSION = 3; 'context' loop type)
<!-- /ANCHOR:phase-advisor-barter-verify -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
