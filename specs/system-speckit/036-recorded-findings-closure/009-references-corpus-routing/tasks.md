---
title: "Tasks: Phase 9: references-corpus-routing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "references corpus routing tasks"
  - "browse only disposition sweep"
  - "leaf manifest check task"
  - "resource map intent task"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: references-corpus-routing

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

- [ ] T001 Confirm the 17-file browse-only list and the 26-routed-plus-2-linked baseline against `.opencode/skills/system-spec-kit/SKILL.md`'s `RESOURCE_MAP` and the corpus tree
- [ ] T002 [P] Read the body of each of the 17 files under `.opencode/skills/system-spec-kit/references/{workflows,templates,structure,validation,cli}/` and `assets/parallel-dispatch-config.md`
- [ ] T003 [P] Grep the repo for each of the 17 filenames to find any existing external citation (e.g. `CLAUDE.md`'s references to `agent-io-contract.md` and `folder-structure.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Record a route-or-remove disposition per file in `goal.md`'s log, grouped by directory (workflows, templates, structure, validation, cli, assets)
- [ ] T005 Add `RESOURCE_MAP` intent entries or `quick-reference.md` pointers for files dispositioned "route" (`.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/references/workflows/quick-reference.md`)
- [ ] T006 Delete files dispositioned "remove" and their rows in `.opencode/skills/system-spec-kit/leaf-manifest.json` and `.opencode/skills/system-spec-kit/leaf-manifest.config.json`
- [ ] T007 Regenerate the manifest with `generate-leaf-manifest.cjs --write` against `.opencode/skills/system-spec-kit`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `generate-leaf-manifest.cjs --check` and confirm no diff
- [ ] T009 Run the routing-registry-drift workflow's freshness gates locally: `ci-leaf-manifest-freshness.cjs`, `ci-skill-root-metadata.cjs`
- [ ] T010 Update `SKILL.md:95`'s routed-count language if the routed total changed, and confirm each deleted filename returns no hit outside git history
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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-004 present in spec.md's Requirements section]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md's Architecture and Affected Surfaces sections name the router edit and manifest regeneration steps]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: generate-leaf-manifest.cjs confirmed present at .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: not applicable, no code changed in this phase - documentation and JSON manifest only]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: generate-leaf-manifest.cjs --write and --check run clean with no stderr output]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: not applicable, no runtime code added]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: SKILL.md RESOURCE_MAP entries follow the existing intent-list shape at SKILL.md:166-243]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md rows AC-001 through AC-004 all read Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: per-file disposition record in goal.md's log covers all 17 files]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: repo-wide grep run for every deleted filename before and after deletion]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: generate-leaf-manifest.cjs --check output captured showing a clean exit after each removal]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: F3-14/F3-15 classed as instance-only, a fixed 17-file inventory, not a recurring code pattern]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the 45-file corpus census in spec.md's Problem Statement is the complete producer inventory]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T003's repo-wide grep per filename is the consumer inventory]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable, no path or parser logic changed]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces section lists the 17-file x 3-disposition matrix]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable, no process-wide state read]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Verification table names the closing commit SHA once implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: not applicable, documentation and JSON manifest only]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: not applicable, no input-handling code changed]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable, no auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same 17-file list and the same REQ-001 through REQ-004 requirement set]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: not applicable, no code changed]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: no README describes the routed-file count, and none needs updating unless T010 changes SKILL.md's stated count]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: per-file body-read notes kept in this packet's scratch/ directory, not the repository root]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: scratch/ directory listing empty or absent at completion]
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
