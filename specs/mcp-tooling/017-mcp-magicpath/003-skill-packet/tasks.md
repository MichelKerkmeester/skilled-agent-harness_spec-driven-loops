---
title: "Tasks: The mcp-magicpath mode packet"
description: "Ordered work for authoring the MagicPath mode packet in the hub-member shape."
trigger_phrases:
  - "mcp-magicpath packet tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: The mcp-magicpath mode packet

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

- [x] T001 Enumerate a sibling packet's real file set — evidence: `mcp-refero` carries SKILL.md, README.md, references/, assets/, feature-catalog/, changelog/, examples/, manual-testing-playbook/ and no root metadata
- [x] T002 Name the forbidden root-level metadata files — evidence: `description.json`, `graph-metadata.json`, `mode-registry.json`, `hub-router.json`; all four confirmed absent from `mcp-refero` and from the new packet
- [x] T003 [P] Capture the registered tool list — evidence: `node .opencode/bin/magicpath-utcp-manual.cjs` emits the 14 tools that became the catalog's only source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the entry contract — evidence: `SKILL.md` states positive and negative routing, the mutation boundary, and the synchronous calling convention
- [x] T005 Author the packet readme — evidence: `README.md` written
- [x] T006 Author the references — evidence: `references/tool-surface.md`, `references/credential-setup.md`, `references/mutation-boundary.md`
- [x] T007 [P] Document the registered manual as an asset — evidence: `assets/utcp-magicpath-manual.md`, mirroring the sibling's asset shape
- [x] T008 Author one catalog entry per registered tool — evidence: `.opencode/skills/mcp-tooling/mcp-magicpath/feature-catalog/` holds 14 tool leaves plus 6 domain overviews and `feature-catalog.md`, one leaf per registered tool with no leaf lacking a tool
- [x] T009 [P] Write the first changelog entry — evidence: `changelog/v1.0.0.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the packaging gate — evidence: the fleet metadata audit reported `checked=14 passed=14 failed=0 fixed=0`
- [x] T011 Reconcile every catalog entry against the registration — evidence: `grep -rhoE "magicpath\.[a-z_]+\("` over `.opencode/skills/mcp-tooling/mcp-magicpath/` produced a callable set whose difference against the live namespace from `Object.keys(magicpath)` is empty, 14 of 14 matching
- [x] T012 [P] Confirm no root-level metadata file — evidence: `description.json`, `graph-metadata.json`, `mode-registry.json` and `hub-router.json` are each absent from `.opencode/skills/mcp-tooling/mcp-magicpath/`, matching the sibling `mcp-refero`
- [x] T013 Confirm no invented capability — evidence: the withheld write commands appear only in `references/mutation-boundary.md` as the boundary, never as a reachable tool
- [x] T014 Confirm nothing outside the packet changed — evidence: `git status` for `.opencode/skills/mcp-tooling` shows no non-magicpath entry attributable to this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The packet passes its gate and documents only what phase 002 registered
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
- [x] CHK-003 [P0] The hub-member shape is confirmed against a sibling, not assumed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The packet carries no metadata file reserved for a hub root
- [x] CHK-011 [P0] Every documented tool exists in the registration
- [x] CHK-012 [P1] The entry contract names the cases this route does not serve
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] The packaging gate reports the packet clean
- [x] CHK-022 [P1] The catalog is reconciled entry by entry against the registration
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Nothing outside the packet directory changed
- [x] CHK-FIX-002 [P1] No document quotes the vendor readme in place of the registration
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No credential value appears in any document or example
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] The credential path is documented where an operator will meet it
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
| P0 Items | 9 | 9/9 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---
