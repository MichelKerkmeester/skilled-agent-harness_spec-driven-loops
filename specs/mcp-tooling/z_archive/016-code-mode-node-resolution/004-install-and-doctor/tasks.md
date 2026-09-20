---
title: "Tasks: Installers, guides and diagnosis"
description: "Ordered work for making the portable registration survive installation and surfacing an unsatisfiable host."
trigger_phrases:
  - "code mode install tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Installers, guides and diagnosis

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

- [x] T001 Record what the installer writes today — evidence: it emitted `"command": ["node", ".opencode/skills/mcp-code-mode/mcp-server/dist/index.js"]`, launching the server under whatever interpreter is on PATH
- [x] T002 Confirm the resolver reports the declared range alongside an absent answer — evidence: an unsatisfiable fixture returns `{path: null, range: '>=99.0.0 <100.0.0', reason: 'unsatisfied'}`
- [x] T003 [P] Locate where a per-server check belongs — evidence: `.opencode/commands/doctor/mcp.md` is a thin router; the per-server work lives in `diagnose_code_mode()` in `.opencode/commands/doctor/scripts/mcp-doctor.sh`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Emit the launcher-based registration (`.opencode/skills/mcp-code-mode/scripts/install.sh`) — evidence: the installer now writes `["node", ".opencode/bin/mcp-code-mode-launcher.cjs"]`
- [x] T005 [P] No second installer edit was needed — evidence: `.opencode/install-guides/install-scripts/install-code-mode.sh` is a symlink to the file changed in T004
- [x] T006 Add a check that asks the resolver whether this host satisfies the declared range (`.opencode/commands/doctor/scripts/mcp-doctor.sh`) — evidence: the diagnosis reports `[PASS] Node engine range satisfied by /Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`
- [x] T007 [P] No second guide edit was needed — evidence: `.opencode/install-guides/MCP - Code Mode.md` is a symlink to the file changed in T008
- [x] T008 [P] State the supported range and the refusal behavior (`.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md`) — evidence: the guide claimed "Node.js 18+" in six places and now states Node 24 with the segfault reason; zero stale mentions remain
- [x] T009 Replace the restated path with the constraint and its consequence (`.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md`) — evidence: the entry now describes the launcher-fronted pattern and why, with no absolute interpreter path
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm no absolute interpreter path is written — evidence: `bash -n` passes and the emitted registration names `node` plus the launcher
- [x] T011 Force the range unsatisfiable and confirm the diagnosis reports the gap — evidence: with the manifest range set to `>=99.0.0 <100.0.0` the diagnosis reported `[FAIL] No Node.js interpreter satisfies >=99.0.0 <100.0.0 (unsatisfied)`, and the manifest was restored byte-identical
- [x] T012 Scan the changed installer, guide and checklist for absolute interpreter paths — evidence: a scan of `.opencode/skills/mcp-code-mode/scripts/install.sh`, `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` and `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` returns no `/Users/` interpreter path in any of the three
- [x] T013 Validate the changed markdown against its document type — evidence: the guide validates as `install_guide` and the checklist as `asset`, both VALID
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] A fresh install is portable and an unsatisfiable host is reported before a tool call finds it
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
- [x] CHK-003 [P1] Each installer's current output is captured by running it against a scratch configuration
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The diagnosis reads the declared range through the resolver rather than restating a version
- [x] CHK-011 [P0] Installers emit the same registration shape the cutover established
- [x] CHK-012 [P1] No document names an absolute interpreter path for this server
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] Each installer, re-run against a scratch configuration, writes no absolute interpreter path
- [x] CHK-022 [P1] A forced-unsatisfiable range makes the diagnosis report the gap rather than health
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every installer was executed, not only edited
- [x] CHK-FIX-002 [P0] The changed markdown validates against its document type
- [x] CHK-FIX-003 [P1] Evidence is pinned to the commit that shipped this phase, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Scratch configurations used for installer runs are removed afterwards
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] Both guides state the supported range and the refusal behavior
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
