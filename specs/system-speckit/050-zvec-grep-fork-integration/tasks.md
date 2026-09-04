---
title: "Tasks: zvec-grep fork integration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "zvec-grep tasks"
  - "ollama backend task"
  - "direct stdio task"
  - "zvec lane verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: zvec-grep fork integration

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

- [x] T001 Fork zvec-grep on GitHub and clone with an upstream remote (`Code_Environment/zvec-grep`)
- [x] T002 Build the fork and run its unit suite as the baseline (103 passed)
- [x] T003 [P] Create fork branches `feat/ollama-backend` and `feat/direct-stdio-mcp`, the second in its own worktree
- [x] T004 [P] Allocate framework worktree `044-zvec-grep-integration` and scaffold this packet at Level 2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Ollama embedding backend: model class, catalog entries, factory case, help text, docs, unit and live smoke tests (fork `src/engine/models/`)
- [x] T006 [P] Direct-mode stdio MCP server with the daemon's tool contract, `zg install --mode direct`, tests, docs (fork `src/mcp/`, `src/cli/`)
- [x] T007 [P] `zvec-lane.mjs` with `index`, `status`, `search`, binary resolution, forced direct mode, rank-tuple JSON, exit mapping (`scripts/retrieval/zvec-lane.mjs`)
- [x] T008 Project config for the index root and ignore rules; `.zvec-grep/` in `.gitignore`
- [x] T009 Doctor `zvec` route (`.opencode/commands/doctor/**`)
- [x] T010 Third-lane section in the retrieval conventions (`references/retrieval/retrieval-conventions.md`)
- [x] T011 Baseline index and five concept queries (`scratch/baseline-queries.md`); post-fix latency row pending the fork perf branch
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Fork unit suites pass on both branches; live stdio JSON-RPC returns hits with no daemon on port 7999
- [x] T013 Wrapper vitest passes through `mcp-server/vitest.config.ts`; doctor routes validator passes
- [x] T014 Residue sweep live 0 and trigger index byte-identical after the packet
- [x] T015 `validate.sh --strict` on this packet, implementation summary and acceptance criteria reconciled, commit by owner, no push
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] (two defects fixed: wrapper index ceiling `instance-only`; fork query scan `algorithmic`) Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] (grep of `spawnSync` ceilings in the retrieval scripts: the two lane ceilings only) Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] (fork: `info()` callers and the e2e that asserted the stale hint; lane: no shared consumer) Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] (not a security or parser fix; the glob cache test covers case-variant isolation and eviction) Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] (axes: refresh mode x scenario; three rows measured before and after) Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] (lane tests run under a caller env of `ZVEC_GREP_MODE=server`) Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] (fork `e30aac7`, lane `47e360eee0`) Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, loopback Ollama only, no credentials
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable): commands README subsystem count and doctor presentation updated; no skill README change needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-04
<!-- /ANCHOR:summary -->

---
