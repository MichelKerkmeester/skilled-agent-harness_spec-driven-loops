---
title: "Tasks: Hub integration for mcp-magicpath"
description: "Ordered work for routing the MagicPath mode through the mcp-tooling hub."
trigger_phrases:
  - "hub integration tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hub integration for mcp-magicpath

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

- [x] T001 Re-read the mutating-family decision from the live registration — evidence: the emitter declares 14 tools, every one tagged `read-only`; `add`, `code`, `image`, `create-project` and `clone` appear nowhere in it
- [x] T002 Answer the axis question — evidence: transport, with no widening needed; because only read-only commands are registered, `mutatesWorkspace:false` is literally true of this surface, so the axis guarantee holds rather than being stretched
- [x] T003 [P] Identify the manifest generator — evidence: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` owns `leaf-manifest.json`; it was regenerated, not written
- [x] T004 [P] Record the fleet audit baseline — evidence: `checked=14 passed=14 failed=0 fixed=0` before any edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add exactly one mode entry — evidence: a structural diff of the registry reports added `['mcp-magicpath']`, removed `[]`, edited existing modes `[]`
- [x] T006 Declare a distinguishing backend value — evidence: `backendKind: "code-mode-cli"`, set beside the existing `code-mode-remote-mcp` and `figma-desktop-transport`, with the transport-axis description recording why this provider needs it
- [x] T007 Declare the tool surface and mutation posture — evidence: allowed `Read/Bash/Grep/Glob/call_tool_chain`, forbidden `Write/Edit/Task`, `mutatesWorkspace:false`, matching the read-only registration
- [x] T008 Bind the route — evidence: `routerSignals.mcp-magicpath` at weight 4 over the new `magicpath-aliases` vocabulary class, plus a `routerPolicy.tieBreak` entry
- [x] T009 Regenerate the leaf manifest — evidence: the audit reported `fixed=1` and the manifest now carries an `mcp-magicpath` entry listing its four leaf resources
- [x] T010 [P] Add the member to hub prose — evidence: a `README.md` member row, the transport-axis paragraph widened to four, both `ROUTER.md` mode enumerations, plus the advisor-facing `SKILL.md` description, `description.json` and the `graph-metadata.json` causal summary; zero `three design transports` strings remain
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the fleet audit and compare — evidence: `checked=14 passed=14 failed=0 fixed=0`, matching the baseline with the member present
- [x] T012 Observe a MagicPath request resolving to the mode — evidence: replaying `hub-router.json` over three MagicPath phrasings (component lookup, design-system tokens, canvas state) resolved each to `mcp-magicpath` at weight 8
- [x] T013 Exercise sibling routing — evidence: the same replay resolved refero, mobbin and chrome-devtools phrasings to `mcp-refero`, `mcp-mobbin` and `mcp-chrome-devtools`, unchanged
- [x] T014 Confirm the registry diff scope — evidence: a structural comparison of `.opencode/skills/mcp-tooling/mode-registry.json` against its pre-change backup reported added `['mcp-magicpath']`, removed `[]`, edited existing modes `[]`
- [x] T015 [P] Confirm the declared posture is true — evidence: all 14 emitted tools carry the `read-only` tag and none writes to the working tree, so `mutatesWorkspace:false` is a description rather than an aspiration
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The hub routes to the mode and the audit passes with the manifest regenerated
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
- [x] CHK-003 [P0] The axis question is answered before the entry is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The declared mutation posture is true of the registered surface
- [x] CHK-011 [P0] The leaf manifest is generated, not hand-edited
- [x] CHK-012 [P1] The backend value describes what actually runs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] The fleet metadata audit passes with the member present
- [x] CHK-022 [P0] A real request is observed resolving to the mode
- [x] CHK-023 [P1] Sibling routing still resolves after the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Exactly one registry entry was added and none edited
- [x] CHK-FIX-002 [P1] Any axis widening is stated, scoped to this mode, and not applied silently
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P1] The tool surface grants no capability the packet does not document
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] Hub prose names the member alongside its siblings
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
| P0 Items | 10 | 10/10 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---
