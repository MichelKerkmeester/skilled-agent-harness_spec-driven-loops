---
title: "Tasks: Phase 4: fingerprint-stamp-regeneration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fingerprint regeneration task breakdown"
  - "twenty seven packet task list"
  - "writer regex widen task"
  - "fingerprint verification checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: fingerprint-stamp-regeneration

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Re-run the discovery grep (`fingerprint:\s*"sha256:[^"]*"` filtered to non-64-hex values) over `specs/` and confirm the count is still 27 before starting (`specs/`)
- [x] T002 Read `stampCompletionFingerprintIfNeeded` and `SESSION_DEDUP_FINGERPRINT_LINE_RE` fully to confirm the exact gating condition (`.opencode/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts`)
- [x] T003 [P] Read `continuity-freshness.ts`'s `malformed_fingerprint` branch to confirm the post-regeneration classification target (`.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Widen `SESSION_DEDUP_FINGERPRINT_LINE_RE` to accept a malformed `sha256:<label>` value while keeping the line-anchored structure unchanged (`.opencode/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts`)
- [x] T005 Rebuild the compiled `dist/core/memory-metadata.js` from the widened source (`.opencode/skills/system-spec-kit/runtime/cli/dist/core/memory-metadata.js`)

Regenerate each of the 27 packets below with the same three-step sequence: stamp the fingerprint, run `generate-description.js`, run `backfill-graph-metadata.js`, then validate `--strict` before moving to the next packet.

- [x] T006 [P] `specs/cli-external-orchestration/z_archive/006-cli-skill-improved-prompting`
- [x] T007 [P] `specs/sk-doc/z_archive/005-sk-doc-changelog-template`
- [x] T008 [P] `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/008-sk-deep-research-review-split`
- [x] T009 [P] `specs/system-deep-loop/z_archive/029-deep-loop-runtime/013-deep-loop-workflow-integrity-audit`
- [x] T010 [P] `specs/system-skill-advisor/z_archive/007-skill-advisor-production-hardening/005-fail-open-fallback`
- [x] T011 [P] `specs/system-skill-advisor/z_archive/007-skill-advisor-production-hardening/007-skill-advisor-freshness-audit`
- [x] T012 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/001-workflow-correctness-audit`
- [x] T013 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/002-memory-data-integrity-audit`
- [x] T014 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/005-mcp-tool-schema-governance-audit`
- [x] T015 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/007-validator-spec-document-integrity-audit`
- [x] T016 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/008-documentation-truth-audit`
- [x] T017 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/009-upgrade-safety-operability-audit`
- [x] T018 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit`
- [x] T019 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization`
- [x] T020 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation`
- [x] T021 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/006-stale-documentation-readme-fixes`
- [x] T022 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/007-vitest-broad-suite-honesty`
- [x] T023 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/021-sk-doc-conformance-template-sweep`
- [x] T024 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/022-cli-skills-baseline-overlay-contract`
- [x] T025 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup`
- [x] T026 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/019-search-query-rag-optimization-research`
- [x] T027 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion`
- [x] T028 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test`
- [x] T029 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design`
- [x] T030 [P] `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/004-memory-save-rewrite`
- [x] T031 [P] `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime`
- [x] T032 [P] `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T033 Run the fleet grep once more over the whole `specs/` tree and confirm zero non-hex `sha256:` values remain
- [x] T034 Run both `continuity-freshness.vitest.ts` copies and confirm none of the 27 packets classifies as `malformed_fingerprint` anymore (`.opencode/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts`, `.opencode/skills/system-spec-kit/runtime/cli/tests/continuity-freshness.vitest.ts`)
- [x] T035 Confirm all 27 packets printed `RESULT: PASSED` during their per-packet strict validation in Phase 2
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: see implementation-summary.md Verification; CHK-001 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: see implementation-summary.md Verification; CHK-002 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: see implementation-summary.md Verification; CHK-003 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: see implementation-summary.md Verification; CHK-010 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: see implementation-summary.md Verification; CHK-011 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: see implementation-summary.md Verification; CHK-012 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: see implementation-summary.md Verification; CHK-013 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: see implementation-summary.md Verification; CHK-020 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: see implementation-summary.md Verification; CHK-021 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: see implementation-summary.md Verification; CHK-022 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: see implementation-summary.md Verification; CHK-023 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-001 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-002 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-003 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-004 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-005 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-006 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-007 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: see implementation-summary.md Verification; CHK-030 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]?key|secret" core/memory-metadata.ts` returns nothing new]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: see implementation-summary.md Verification; CHK-031 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: see implementation-summary.md Verification; CHK-032 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: see implementation-summary.md Verification; CHK-040 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: see implementation-summary.md Verification; CHK-041 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: see implementation-summary.md Verification; CHK-042 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: see implementation-summary.md Verification; CHK-050 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: see implementation-summary.md Verification; CHK-051 holds by the stamp count, the zero sweep, the two freshness suites and the per-packet strict runs recorded there]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
