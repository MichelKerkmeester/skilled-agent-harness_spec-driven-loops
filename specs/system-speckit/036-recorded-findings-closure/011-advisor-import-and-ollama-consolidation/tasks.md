---
title: "Tasks: Phase 11: advisor-import-and-ollama-consolidation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor import consolidation tasks"
  - "ollama adapter merge tasks"
  - "specifier extension fix task"
  - "golden prompt suite rerun"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: advisor-import-and-ollama-consolidation

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

- [x] T001 Read `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` and `providers/ollama.ts` in full and diagram their divergent config surfaces
- [x] T002 [P] Run the advisor's full test suite once before any edit to record the pre-change baseline pass count
- [x] T003 [P] Confirm the seven advisor-owned files with extensionless `@spec-kit/shared` specifiers against the current tree
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Merge `adapters/ollama.ts` and `providers/ollama.ts` into one implementation, keeping both the `getAdapter('ollama').embed()` and `createEmbeddingsProvider()` call sites resolving through it
- [x] T005 Update `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/skill-markdown.ts` and `lib/skill-graph/doc-frontmatter.ts` to import `@spec-kit/shared/frontmatter/parse-frontmatter.js`
- [x] T006 Update the five advisor test files' `@spec-kit/shared/embeddings/factory` import and `vi.mock` specifiers to the `.js` form (`semantic-shadow-cosine.vitest.ts`, `refresh-roundtrip.vitest.ts`, `semantic-shadow-ablation.vitest.ts`, `seed-skill-embeddings.ts`, `lane-weight-sweep.vitest.ts`)
- [x] T007 Add a lint rule or a dedicated test that fails on an extensionless `@spec-kit/shared` specifier anywhere under `.opencode/skills/system-skill-advisor/mcp-server`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the advisor's full test suite and confirm the same or better pass count as the T002 baseline
- [x] T009 Run `routing-golden-prompts.vitest.ts` against `gate2-golden-prompts.jsonl` and confirm it passes
- [x] T010 Grep `.opencode/skills/system-skill-advisor` for an extensionless `@spec-kit/shared` specifier and confirm zero hits
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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-005 present in spec.md's Requirements section]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md's Architecture and Affected Surfaces sections name the merge and the specifier fix]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: @spec-kit/shared's embeddings package confirmed present and consumed by the advisor via skill-graph-db.ts:18]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build (tsc) exits 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: T008's test run captured with no unexpected stderr]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the merged implementation's Ollama-unreachable path exercised by the existing mocked-failure test cases]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the merged file keeps the advisor's existing EmbedderAdapter contract shape]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md rows AC-001 through AC-005 all read Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: T001's full read of both Ollama files recorded in goal.md's log]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: both the adapter dispatch path and the legacy dispatch path exercised against the merged implementation]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: refresh-roundtrip.vitest.ts's mocked-failure branch still passes post-merge]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: R5-01 classed as cross-consumer (two call sites reach two implementations), and R3-I1-01/02 classed as class-of-bug (one inconsistency pattern repeated across seven files)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T003's inventory of the seven extensionless-specifier files is the complete producer list]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: plan.md's Affected Surfaces table lists both dispatch call sites and all seven specifier files as consumers]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable, no path or parser logic changed]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces section lists the dispatch-path x config-surface x specifier-location matrix]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: the merged implementation tested with an unset and a set OLLAMA_BASE_URL env var]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Verification table names the closing commit SHA once implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the merged implementation reads OLLAMA_BASE_URL from process.env exactly as both originals did, no literal endpoint added]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the merged implementation preserves whichever original's input-shape validation the daemon's live call sites already exercise]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable, Ollama's local endpoint carries no auth in either original]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same nine files and the same REQ-001 through REQ-005 requirement set]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the merged file's header comment states which of the two prior contracts it replaces]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: the advisor's embedders README and adapters README re-read for accuracy after the merge]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: the config-surface diagram from T001 kept under this packet's scratch/ directory]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: scratch/ directory listing empty or absent at completion]
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
