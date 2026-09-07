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

- [ ] T001 Re-run the discovery grep (`fingerprint:\s*"sha256:[^"]*"` filtered to non-64-hex values) over `specs/` and confirm the count is still 27 before starting (`specs/`)
- [ ] T002 Read `stampCompletionFingerprintIfNeeded` and `SESSION_DEDUP_FINGERPRINT_LINE_RE` fully to confirm the exact gating condition (`.opencode/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts`)
- [ ] T003 [P] Read `continuity-freshness.ts`'s `malformed_fingerprint` branch to confirm the post-regeneration classification target (`.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Widen `SESSION_DEDUP_FINGERPRINT_LINE_RE` to accept a malformed `sha256:<label>` value while keeping the line-anchored structure unchanged (`.opencode/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts`)
- [ ] T005 Rebuild the compiled `dist/core/memory-metadata.js` from the widened source (`.opencode/skills/system-spec-kit/runtime/cli/dist/core/memory-metadata.js`)

Regenerate each of the 27 packets below with the same three-step sequence: stamp the fingerprint, run `generate-description.js`, run `backfill-graph-metadata.js`, then validate `--strict` before moving to the next packet.

- [ ] T006 [P] `specs/cli-external-orchestration/z_archive/006-cli-skill-improved-prompting`
- [ ] T007 [P] `specs/sk-doc/z_archive/005-sk-doc-changelog-template`
- [ ] T008 [P] `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/008-sk-deep-research-review-split`
- [ ] T009 [P] `specs/system-deep-loop/z_archive/029-deep-loop-runtime/013-deep-loop-workflow-integrity-audit`
- [ ] T010 [P] `specs/system-skill-advisor/z_archive/007-skill-advisor-production-hardening/005-fail-open-fallback`
- [ ] T011 [P] `specs/system-skill-advisor/z_archive/007-skill-advisor-production-hardening/007-skill-advisor-freshness-audit`
- [ ] T012 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/001-workflow-correctness-audit`
- [ ] T013 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/002-memory-data-integrity-audit`
- [ ] T014 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/005-mcp-tool-schema-governance-audit`
- [ ] T015 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/007-validator-spec-document-integrity-audit`
- [ ] T016 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/008-documentation-truth-audit`
- [ ] T017 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/009-upgrade-safety-operability-audit`
- [ ] T018 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit`
- [ ] T019 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization`
- [ ] T020 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation`
- [ ] T021 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/006-stale-documentation-readme-fixes`
- [ ] T022 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/007-vitest-broad-suite-honesty`
- [ ] T023 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/021-sk-doc-conformance-template-sweep`
- [ ] T024 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/022-cli-skills-baseline-overlay-contract`
- [ ] T025 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup`
- [ ] T026 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/019-search-query-rag-optimization-research`
- [ ] T027 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion`
- [ ] T028 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test`
- [ ] T029 [P] `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design`
- [ ] T030 [P] `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/004-memory-save-rewrite`
- [ ] T031 [P] `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime`
- [ ] T032 [P] `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T033 Run the fleet grep once more over the whole `specs/` tree and confirm zero non-hex `sha256:` values remain
- [ ] T034 Run both `continuity-freshness.vitest.ts` copies and confirm none of the 27 packets classifies as `malformed_fingerprint` anymore (`.opencode/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts`, `.opencode/skills/system-spec-kit/runtime/cli/tests/continuity-freshness.vitest.ts`)
- [ ] T035 Confirm all 27 packets printed `RESULT: PASSED` during their per-packet strict validation in Phase 2
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

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md sections 3-5 name the regex widen, the 3-step per-packet sequence and the 2 regression suites]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `ls runtime/cli/dist/spec-folder/generate-description.js runtime/cli/dist/graph/backfill-graph-metadata.js` both resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: the runtime's existing lint command exits 0 on the modified `memory-metadata.ts`]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: `node --check` on the rebuilt `dist/core/memory-metadata.js`]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: the widened regex still leaves `stampCompletionFingerprintIfNeeded`'s no-match early return in place for genuinely unrecognizable content]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: the widen touches only the value-shape half of the existing regex, matching the file's own "widen the value-shape, keep the structure" comment convention]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every AC row Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: a manual `node -e` check of the widened regex against 3 of the 27 real label shapes]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: the digits-only and no-separator label shapes named in plan.md's affected-surfaces invariant are exercised]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: a packet with no `session_dedup.fingerprint` field at all still no-ops under the widened writer]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: this is a `matrix/evidence` finding (27 packets x 3 files each) plus one `class-of-bug` fix (the writer's regex gate), both recorded in plan.md]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the REQ-004 grep is the producer inventory. It names all 27 and excludes every other packet]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: plan.md's affected-surfaces table names `continuity-freshness.ts` as a reader (unchanged) and the two generators as downstream consumers (re-run per packet)]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: plan.md's affected-surfaces invariant names the digits-only, no-separator and already-well-formed-hex adversarial cases for the regex widen]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md states the 27 packets x 3 files = 81 files plus 1 code file matrix]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable: the writer reads only the target file's own content, no process-wide env state]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table pins the commit SHA once implementation lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: `rg -n "sk-|api[_-]?key|secret" core/memory-metadata.ts` returns nothing new]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: the widened regex still requires the `sha256:` literal prefix and the exact `      fingerprint:` line shape before matching anything]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: no auth surface in a file-content writer]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same 27-packet list and the same regex-widen fix]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: the widened regex's comment explains why the value-shape half changed, matching the file's existing comment density]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: not applicable: no README documents this internal writer function]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray files outside `scratch/` for this packet]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` shows only `.gitkeep` at closure]
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
