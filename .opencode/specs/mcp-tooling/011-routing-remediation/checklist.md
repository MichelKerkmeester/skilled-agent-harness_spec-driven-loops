---
title: "Verification Checklist: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability"
description: "Per-workstream verification: ADR ruling gate, route-gold enforcement proof, regression protection for existing gates, fix-completeness protocol, and the terminal same-scope re-review. All items unchecked; nothing is implemented yet."
trigger_phrases:
  - "routing remediation checklist"
  - "route-gold enforcement proof"
  - "adr ruling gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T18:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist per workstream"
    next_safe_action: "Verify items during /speckit:implement, starting with CHK-201"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-routing-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Planning-packet state: every item below is intentionally unchecked. Items are verified during implementation, not during planning.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-004 with exhaustive F001-F015 mapping)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (six phases, FIX ADDENDUM per finding)
- [ ] CHK-003 [P1] Dependencies identified and available (ADR-001 ruling, shared-harness consumers, frozen baseline)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:adjudication -->
## Phase 0: Adjudication Gate

- [ ] CHK-201 [P0] ADR-001 ruling recorded: operator confirmed defaultResource semantics (fallback-only recommended) BEFORE any hub-router.json data change; ADR-001 status flipped to Accepted with the ruling text
- [ ] CHK-202 [P0] ADR-002 scope confirmed or amended by the operator (route-gold flag, hub-type default)
- [ ] CHK-203 [P0] Regression fixtures frozen: replay outputs for 13 hub and 49 packet scenarios captured pre-change
- [ ] CHK-204 [P1] Pre-change baselines captured: package/hub gate outputs, advisor ratchet counts, advisor probe results
<!-- /ANCHOR:adjudication -->

---

<!-- ANCHOR:ws1 -->
## WS1: Deterministic Hub Routing (F001-F005)

- [ ] CHK-210 [P0] F001: committed Figma positive scenario replays to mcp-figma with Figma-only resources
- [ ] CHK-211 [P0] F002: no non-Chrome route's assembled resource set contains mcp-chrome-devtools/SKILL.md; zero-signal behavior matches the ADR-001 ruling in runtime, replay, and gold
- [ ] CHK-212 [P1] F003: MT-004 produces an executable defer, not a six-mode bundle; hub-identity evidence separated from per-mode scoring
- [ ] CHK-213 [P1] F004: each retained holdout MT-H02 to MT-H06 replays to its intended mode; removals recorded with adjudication rationale
- [ ] CHK-214 [P1] F005: unqualified screen-examples prompt no longer selects both Refero and Mobbin
- [ ] CHK-215 [P0] Certified-clean boundaries preserved: MT-H01 Chrome-vs-Aside and registry-alias alignment unchanged vs frozen fixtures
<!-- /ANCHOR:ws1 -->

---

<!-- ANCHOR:ws2 -->
## WS2: Route-Gold Enforcement and Runtime Parity (F008, F012-F015)

- [ ] CHK-220 [P0] F008 enforcement proof: a previously-passing route-violating scenario now FAILS the benchmark (control run evidence attached)
- [ ] CHK-221 [P0] New run-label report shows route-gold rows above 0 and consumes every expected_intent/expected_resources/negative assertion as hard gold
- [ ] CHK-222 [P0] Frozen baseline/ untouched; re-run stored under a NEW run-label folder
- [ ] CHK-223 [P1] F012: all 12 packet holdouts recall declared intent or are re-adjudicated out of gold with recorded rationale
- [ ] CHK-224 [P1] F013: one negative semantics chosen; all six negative fixtures pass against runtime zero-score behavior
- [ ] CHK-225 [P1] F014: parity assertions cover every documented fallback branch including ClickUp's hardcoded fallback resource
- [ ] CHK-226 [P2] F015: adjudicated base resources recorded; 11 positive gold rows aligned without blessing unrelated eager loads
- [ ] CHK-227 [P0] Gold parse failures fail loudly (unparseable expected block fails the run, never silently skips)
<!-- /ANCHOR:ws2 -->

---

<!-- ANCHOR:ws3 -->
## WS3: Design-Transport Trust (F006, F007)

- [ ] CHK-230 [P1] F006: mode-registry.json mutation classes distinguish external-document mutation, local export writes, and direct editing; Figma declaration no longer contradicts allowed local export writes
- [ ] CHK-231 [P1] F007: every design-affecting Figma authoring path (author/modify, tokens) states the mandatory sk-design pairing precondition, consistent with hub ADR-002 cross-hub license
<!-- /ANCHOR:ws3 -->

---

<!-- ANCHOR:ws4 -->
## WS4: Six-Mode Traceability (F009-F011)

- [ ] CHK-240 [P1] F009: graph-metadata.json derived intent signals and narrative edges cover all six modes; consumer parity verified
- [ ] CHK-241 [P1] F010: phase-007 spec/plan/tasks amended to six-mode inventory and real evidence paths; that phase re-validates with validate.sh
- [ ] CHK-242 [P2] F011: hub playbook index regenerated; 13 scenario files and six modes listed; links resolve
<!-- /ANCHOR:ws4 -->

---

<!-- ANCHOR:regression -->
## Regression Protection

- [ ] CHK-250 [P0] All six packet package checks and hub parent-skill checks stay green (whole gate re-run, delta vs CHK-204 baseline reported)
- [ ] CHK-251 [P0] Advisor ratchet stays green; advisor probes show no routing regression vs baseline
- [ ] CHK-252 [P0] Harness vitest suite passes after WS2 changes
- [ ] CHK-253 [P0] Consumer-safety control: one non-mcp-tooling skill's Mode A benchmark with gate off matches its frozen baseline verdict
- [ ] CHK-254 [P0] Terminal re-review: SAME scope and dimensions re-run reaches PASS with zero active P0/P1; spec_code, checklist_evidence, and playbook_capability protocols clean
<!-- /ANCHOR:regression -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (harness .cjs edits)
- [ ] CHK-011 [P0] No console errors or warnings in harness runs
- [ ] CHK-012 [P1] Error handling implemented (loud gold parse failures, explicit fallback branches)
- [ ] CHK-013 [P1] Code follows project patterns (producer-consumer-gold alignment; no ephemeral artifact labels in comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 to REQ-004 per-finding criteria)
- [ ] CHK-021 [P0] Manual testing complete (replay runs over 13 hub and 49 packet scenarios)
- [ ] CHK-022 [P1] Edge cases tested (zero-signal, hub-identity-only, dual-provider, explicit multi-tool bundle prompts)
- [ ] CHK-023 [P1] Error scenarios validated (unparseable gold, missing scenario files)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` (assigned per finding in plan.md FIX ADDENDUM)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (defaultResource / DEFAULT_RESOURCE / fallback labels across hub and all six packet routers)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (defaultResource, expected_intent, expected_resources, route-gold report fields)
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (gold parser and zero-score branches)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (13 hub by outcome by resource; 49 packet by packet by kind; loader-enumerated)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (harness flag derivation under differing env)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (no OAuth/live-call material enters corpus or reports)
- [ ] CHK-031 [P0] Input validation implemented (scenario/gold parsing fails closed)
- [ ] CHK-032 [P1] Auth/authz working correctly (N/A for Mode A; mutation metadata fails closed per NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only)
- [ ] CHK-042 [P2] README updated (benchmark/README.md indexes the new run-label)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 20 | 0/20 |
| P2 Items | 4 | 0/4 |

**Verification Date**: pending (planning packet; nothing implemented)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001, ADR-002)
- [ ] CHK-101 [P1] All ADRs have status (both Proposed; ADR-001 must reach Accepted at Phase 0)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (three options each)
- [ ] CHK-103 [P2] Migration path documented (rollback per workstream commit; flag policy rollback)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01: benchmark runtime same order of magnitude)
- [ ] CHK-111 [P1] Throughput targets met (single loader pass; no added I/O passes)
- [ ] CHK-112 [P2] Load testing completed (N/A; deterministic file-based harness)
- [ ] CHK-113 [P2] Performance benchmarks documented (run durations recorded in the new run-label report)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (git revert per workstream; ADR-002 flag policy rollback)
- [ ] CHK-121 [P0] Feature flag configured (route-gold gate flag with hub-type default, if ADR-002 confirmed)
- [ ] CHK-122 [P1] Monitoring/alerting configured (report fields expose flag state and route-gold row count)
- [ ] CHK-123 [P1] Runbook created (benchmark re-run and control-run commands recorded in evidence)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (F006/F007 trust metadata verified truthful)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependencies planned)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (N/A; no network surface)
- [ ] CHK-133 [P2] Data handling compliant with requirements (no live captures per out-of-scope boundary)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (this packet plus amended phase-007 docs)
- [ ] CHK-141 [P1] API documentation complete (harness flag documented in skill-benchmark README)
- [ ] CHK-142 [P2] User-facing documentation updated (hub playbook index, benchmark README)
- [ ] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md at close)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | ADR-001 ruling (Phase 0 gate) | [ ] Approved | |
| Operator | ADR-002 scope | [ ] Approved | |
| Deep-review loop | Terminal same-scope re-review PASS | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
