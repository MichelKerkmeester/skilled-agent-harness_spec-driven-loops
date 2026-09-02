---
title: "Tasks: Phase 1: trigger-index-replacement"
description: "Ordered tasks for building the trigger index, the ripgrep retrieval contract, and the parity harness."
trigger_phrases:
  - "trigger index tasks"
  - "parity harness tasks"
  - "retrieval replacement tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: trigger-index-replacement

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the parity prompt set at 18 stable cases (`scripts/retrieval/fixtures/prompt-set.json`), each carrying `id`, `class`, `query`, expected behavior and `allowedDivergence`. Record the prompt-set hash too. The classes are exact phrase, uppercase case fold, punctuation separator, three-character partial token, multi-word subset, short-token rule, nine-token truncation, no-hit, scope collision, archived path, expired row, malformed frontmatter, duplicate phrase or path, accented and CJK input, anchor marker, body-only match, generic phrase negative and nested path punctuation
- [ ] T002 Capture the live `exactTriggerSearch` output for that set into `fixtures/live-lane-baseline.json` while the daemon is reachable. Record the frozen corpus manifest with it: included relative paths, exclusions, corpus content hash, parser version, index schema version, prompt-set hash and daemon availability at capture time. The daemon is documented as flapping, so this is captured first. An unavailable live arm is recorded as blocked rather than passed
- [ ] T003 [P] Measure the emitted index size against a stated budget and decide single-file vs per-track sharding (settles R-001 and ADR-001's open half)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Frontmatter parser: extract `trigger_phrases`, then emit a diagnostic row of `path`, one-based `line`, `category` and `reason` for each of missing frontmatter, malformed or unclosed frontmatter, non-YAML frontmatter, wrong list type, non-string member, valid empty list, `triggerPhrases` alias spelling, generic fallback phrase, duplicate phrase and oversized phrase (`scripts/retrieval/generate-trigger-index.mjs`)
- [ ] T005 Corpus walker over `specs/**/*.md` and `.opencode/skills/**/*.md`, excluding `z_archive/` and `node_modules/`, reporting excluded-path variants and any file the manifest does not cover
- [ ] T006 Deterministic index emitter: sorted keys and sorted arrays, no generation timestamp, written to a same-directory temporary file and renamed only after validation, so a failed run leaves the last known-good artifact in place (`data/trigger-index.json`)
- [ ] T007 [P] Write `references/retrieval/retrieval-conventions.md`: the concrete ripgrep invocation replacing each of `memory_search`, `memory_context` and `memory_quick_search`, with track and packet scoping, `--no-config`, the `z_archive` and `node_modules` exclusions, the 0/1/2+ exit mapping and the caller-side rank tuple
- [ ] T008 Parity harness with three arms, legacy, index and `rg`, reporting `legacyOnly` and `indexOnly` separately plus any scope, archive or expiry leakage (`scripts/retrieval/parity-check.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Unit tests: well-formed, malformed, absent, valid empty list, alias spelling, generic phrase, duplicate-across-docs, oversized phrase (`node:test`)
- [ ] T010 Determinism check: run the generator twice over one manifest, require byte equality and matching SHA-256, then run `git diff --exit-code` on the artifact (AC-002)
- [ ] T011 Run the parity harness. Require zero unexplained rows in both directions and no lifecycle leakage across scope, archive and expiry, then commit the report as `fixtures/parity-baseline.json` (AC-001)
- [ ] T012 Time single-prompt lookup across at least 30 fresh Node processes. Record p50, p95, p99, max, corpus bytes, index bytes, runtime and platform, then hold p95 and max under 200ms (AC-007)
- [ ] T013 Stop the `system-spec-memory` daemon and confirm Gate 1 trigger matching still returns results with no network access, recording the commands run and their exit statuses (AC-008)
- [ ] T014 Record the decisions T003 and T012 produced, the measured artifact size, the sharding verdict and the latency numbers, then update `spec.md` open questions with those answers
- [ ] T015 Execute each documented ripgrep recipe once, read its exit status, then record the 0 match, 1 no match, 2+ error mapping alongside the observed output (AC-005)
- [ ] T016 Run the semantic paraphrase rows as boundary probes and report them separately from the lexical gate, so a paraphrase miss never counts as a parity failure and never counts as a pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 14 | 0/14 |
| P1 Items | 18 | 0/18 |
| P2 Items | 10 | 0/10 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Repository owner | Technical Lead | [ ] Approved | |
| Repository owner | Product Owner | [ ] Approved | |
| Repository owner | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


