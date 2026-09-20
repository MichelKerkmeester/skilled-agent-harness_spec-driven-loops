---
title: "Tasks: Node engine resolution contract"
description: "Ordered work for building and proving the interpreter resolver."
trigger_phrases:
  - "node engine resolver tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Node engine resolution contract

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

- [x] T001 Record the declared range and the interpreter the host configs name today, as the values the resolver must reproduce — evidence: `engines.node` is `>=24.0.0 <25.0.0` in `.opencode/skills/mcp-code-mode/mcp-server/package.json`; the six configs name `/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`
- [x] T002 Enumerate the version-manager directories present on this machine and note which are absent — evidence: `ls ~/.nvm/versions/node` lists v20.19.5, v22.23.1, v24.9.0 and v25.6.1, while `~/.fnm/node-versions`, `~/.volta/tools/image/node` and `/opt/homebrew/opt/node@24/bin` are all absent
- [x] T003 [P] Confirm `node --test` picks up a new test file under `.opencode/bin/lib/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read `engines.node` from a manifest path and parse it into a lower and exclusive upper bound (`.opencode/bin/lib/node-engine-resolver.cjs`)
- [x] T005 Reject any range syntax not explicitly implemented, rather than approximating it (`.opencode/bin/lib/node-engine-resolver.cjs`)
- [x] T006 Enumerate candidates from the running interpreter, the search path, and the nvm, fnm and volta directories, tolerating absent ones (`.opencode/bin/lib/node-engine-resolver.cjs`)
- [x] T007 Select among satisfying candidates deterministically and return null when the set is empty (`.opencode/bin/lib/node-engine-resolver.cjs`)
- [x] T008 Return the unsatisfied range alongside the null so a caller can say what was needed (`.opencode/bin/lib/node-engine-resolver.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Assert a fixture host with only out-of-range interpreters returns null (`.opencode/bin/lib/node-engine-resolver.test.cjs`)
- [x] T010 Assert changing the fixture manifest range changes the selection with no resolver edit (`.opencode/bin/lib/node-engine-resolver.test.cjs`)
- [x] T011 Assert the real host resolves to the interpreter the six configs hardcode today (`.opencode/bin/lib/node-engine-resolver.test.cjs`)
- [x] T012 Run the workspace node gate and confirm the new file is collected and green — evidence: `node .opencode/scripts/run-node-tests.mjs` reports 74 files, 757 pass, 1 fail, the file count rising by one and the pass count by the suite's eight
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The resolver reproduces today's pinned interpreter and refuses to substitute when the range cannot be met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

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
- [x] CHK-003 [P1] The declared range and today's pinned interpreter are recorded as the values to reproduce
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The resolver carries no hardcoded version or interpreter path
- [x] CHK-011 [P0] Unimplemented range syntax is rejected rather than approximated
- [x] CHK-012 [P1] Absent version-manager directories are tolerated without throwing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] A fixture host with only out-of-range interpreters returns nothing
- [x] CHK-022 [P1] Changing a fixture manifest range changes the selection with no resolver edit
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The resolver's answer on this machine equals the interpreter the six configs name today
- [x] CHK-FIX-002 [P0] Every candidate location claimed in the spec is actually enumerated, verified by test rather than by reading
- [x] CHK-FIX-003 [P1] Evidence is pinned to the commit that shipped this phase, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Candidate interpreters are not executed during the search
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] The supported range syntax is stated where the resolver is read
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
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-28
<!-- /ANCHOR:summary -->

---
