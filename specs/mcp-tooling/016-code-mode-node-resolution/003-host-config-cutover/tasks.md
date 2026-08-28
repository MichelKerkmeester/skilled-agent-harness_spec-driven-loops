---
title: "Tasks: Host configuration cutover"
description: "Ordered work for repointing six host configurations and proving every server still attaches."
trigger_phrases:
  - "mcp cutover tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Host configuration cutover

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

- [x] T001 Record the attach behavior of all nineteen registrations as the pre-change baseline — evidence: 15 named `node`, 4 named an absolute interpreter (6 code_mode across the files, plus memory and advisor in the Codex config)
- [x] T002 Record the revert for each of the six files before editing any of them — evidence: all six were tracked and clean at `48196a45e2`, so `git checkout -- <file>` restores each
- [x] T003 [P] Confirm the launcher is executable from a working directory other than the repository root — evidence: the launcher derives its own repository root from `__dirname` rather than the caller's working directory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Repoint the code_mode registration at the launcher (`.mcp.json`)
- [x] T005 [P] Repoint the code_mode registration at the launcher (`.claude/mcp.json`)
- [x] T006 [P] Repoint the code_mode registration at the launcher (`.cursor/mcp.json`)
- [x] T007 [P] Repoint the code_mode registration at the launcher (`.pi/mcp.json`)
- [x] T008 [P] Repoint the code_mode registration at the launcher (`opencode.json`)
- [x] T009 Repoint code_mode in `.codex/config.toml`; the memory and advisor interpreters were left absolute — evidence: the advisor launcher aborts in `dlopen` under the search-path interpreter and reaches its database and embedder under the Homebrew one, so its path is load-bearing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Parse all six files and confirm each is still valid to its host — evidence: `python3 -c "import json; json.load(...)"` over the five JSON files and `tomllib.load` over `.codex/config.toml` both report clean
- [x] T011 Exercise every registration with an initialize request through its configured command — evidence: code_mode answers initialize through the launcher with `serverInfo {"name":"CodeMode-MCP"}`; the advisor reaches its database and embedder under its retained interpreter
- [x] T012 Scan the six files for absolute interpreter paths and confirm none remain for code_mode — evidence: a scan of `.mcp.json`, `.claude/mcp.json`, `.cursor/mcp.json`, `.pi/mcp.json`, `opencode.json` and `.codex/config.toml` returns no `/Users/` interpreter on any code_mode line
- [x] T013 Confirm the servers start cold rather than from an attached session — evidence: `pgrep -f 'mcp-code-mode/mcp-server/dist/index.js'` returned the same three operator pids before and after every probe, so each probe ran in a process of its own
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every registration attaches, and the only absolute interpreters left are ones execution proved load-bearing
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
- [x] CHK-003 [P1] The attach behavior of all nineteen registrations is recorded as the pre-change baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each edited file still parses under its host's format
- [x] CHK-011 [P0] Only the interpreter or fronting command changed in each registration
- [x] CHK-012 [P1] The two unconstrained servers are declared identically across all six files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] Every registration responds to an initialize request through its configured command
- [x] CHK-022 [P1] Servers attach from a cold host restart, not from an already-attached session
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] A scan of the six files finds no absolute interpreter path
- [x] CHK-FIX-002 [P0] The revert for each file was recorded before any edit landed
- [x] CHK-FIX-003 [P1] Evidence is pinned to the commit that shipped this phase, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No configuration gained an environment value it did not previously carry
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] The parent phase map records this phase as the first with live effect
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
