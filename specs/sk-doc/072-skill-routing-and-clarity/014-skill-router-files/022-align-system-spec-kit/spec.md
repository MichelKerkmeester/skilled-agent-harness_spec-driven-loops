---
title: "Feature Specification: Phase 22: align-system-spec-kit"
description: "After the machine router moved from SKILL.md to ROUTER.md, nothing yet showed that the system-spec-kit docs, playbooks, scripts and measurement code still matched where routing lives. This phase records one operator-local alignment check over system-spec-kit, the fixes it upheld and a full recheck."
trigger_phrases:
  - "align system spec kit"
  - "phase 22 align system spec kit"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: align-system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/274-packet-router-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-align-system-skill-advisor |
| **Successor** | None |
| **Handoff Criteria** | The system-spec-kit recheck reads pass 64, cannot run 1, not applicable 7 and fail 2 with each non-pass row classified, the 26 fixes and the A-08 prose fix are in place, the skill routers parse identically to HEAD, and D-04, D-05 and the four probe misses are carried to the routing follow-up |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The system-spec-kit files changed since base `6a9946a800`. The phase changes no routing data. No `INTENT_SIGNALS`, `RESOURCE_MAP`, advisor vocabulary or hub class moves. Run output stays in the run folder outside the checkout.

**Dependencies**:
- The router move in phases 004 to 006, which put the system-spec-kit machine router in `ROUTER.md`.
- The router-file resolver, which proves each router still parses the same.
- DeepSeek V4.1 Flash workers for the four review lanes and the fix lane.

**Deliverables**:
- The upheld findings that do not change routing, fixed in the system-spec-kit files listed below.
- A recheck of the full battery against the worktree, with each non-pass row classified.
- Each routing item named with its disposition and carried to the routing follow-up in the parent spec.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router move changed where the system-spec-kit machine router lives, but the docs and some scripts around it were written for the old place. A README, playbook or reference that still points at a router inside SKILL.md sends a reader to the wrong file, and measurement code that reads only SKILL.md finds no router. No check had yet read system-spec-kit as a whole after the move.

### Purpose
Every upheld finding in system-spec-kit that does not change routing is fixed, every routing item is carried forward, and the recheck shows only non-pass rows with a known cause.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Copied from the evidence file in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Kind: skill, file set first-parent
Commits: 6a9946a80064c9971385d4c9cfba6bf9809fd1a5 to 4f741f6b48ac5825a3ce18dbe19575d76043885f, 27 first-parent commits
Files: 29, of which 0 uncommitted or untracked
Findings: 33 (P0 0, P1 7, P2 26), 18 literal, 0 inferred, 19 outside the scope; 2 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":60,"not_applicable":7}
Probes: STATUS=FINDINGS run-probes: pass=6 fail=4 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":64,"cannot_run":1,"not_applicable":7,"fail":2}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the system-spec-kit files changed since base `6a9946a800` and run the existing check battery over them.
- Send four read-only review lanes over those files: code, skill docs, READMEs with changelogs and env, and routing.
- Score routing probe prompts against the advisor, and let a critic overturn weak findings.
- Apply the upheld findings that do not change routing, through a DeepSeek fix lane and a follow-up router prose pass.
- Rerun the full battery against the worktree, classify each non-pass row, and test the fix lane's code changes by hand.

### Out of Scope
- Routing data changes - the packet decision is that no skill routes differently, so each one is carried to the routing follow-up.
- Regenerating derived files by hand - the activation manifests and Hermes copies regenerate at commit.
- Git commits - this phase writes no git state.

### Files to Change

Paths are relative to the repository root. `S` is `.skilled/skills/system-spec-kit/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `S/README.md` | Modify | The package tree, Key Files and Related Documents name ROUTER.md, the SKILL.md row is narrowed to gates and validation, and the routing-rules wording is gone (C1, A-05, A-06, B-03, D-03) |
| `S/ARCHITECTURE.md` | Modify | The SKILL.md line reads as the entry point, and ROUTER.md is added to section 8 (C6) |
| `S/ROUTER.md` | Modify | The spec-script exit-code note points at the taxonomy in `references/cli/daemon-cli-reference.md` section 5 (A-08), and the leaf-manifest command names the full generator path |
| `S/changelog/v2.12.25.0.md` | Modify | The sentence is narrowed to the catalog entry and playbook scenario that shipped (C3) |
| `S/references/cli/shared-smart-router.md` | Modify | The provider dictionary line names the cli-* packet's ROUTER.md, and the MACHINE ROUTER pointer finds the section in each skill's ROUTER.md (A-01, A-02, C2, D-01) |
| `S/references/templates/template-guide.md` | Modify | The pointer links `references/structure/sub-folder-versioning.md` section 3 (C4) |
| `S/references/workflows/rename-pattern.md` | Modify | The pseudocode pointer names ROUTER.md (C5) |
| `S/manual-testing-playbook/template-authoring/authoring-card-router-intents.md` | Modify | The precondition requires ROUTER.md, the file its three awk commands read (A-07, B-02, C7) |
| `S/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md` | Modify | The precondition lists ROUTER.md, the leaf files and the checklist, and the tree run expects eleven `PASS` lines (E-03) |
| `S/runtime/cli/hermes/README.md` | Modify | The sync row names the ROUTER.md copy, its link rewrite and its drop on source removal, and the mirror shape is SKILL.md plus ROUTER.md when the source has one (A-03, A-04) |
| `S/runtime/cli/hermes/sync-skills-hermes.cjs` | Modify | `frontmatterName` throws when the skill name is not one path segment, so a sync never writes outside the mirror (A-11) |
| `S/runtime/cli/observability/smart-router-analyze.ts` | Modify | A baseline read of ROUTER.md counts as compliant, like SKILL.md (E-01) |
| `S/runtime/cli/observability/smart-router-measurement.ts` | Modify | A new `baselineFileBytes` adds ROUTER.md to the tree and predicted-context byte totals, and `parseRouterModel` reads ROUTER.md with a SKILL.md fallback (E-02, C8, D-02) |
| `S/runtime/cli/spec/check-card-sync.sh` | Modify | A new `router-exists` check, and a missing router is read as `/dev/null` so every later check still runs (A-09) |
| `S/runtime/cli/tests/card-sync.vitest.ts` | Modify | A new test removes ROUTER.md and expects `FAIL router-exists`, the intent and guide failures and `CARD SYNC FAILED` |
| `S/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modify | The test deletes the source ROUTER.md and asserts the copy is removed and `--check` still passes (A-10) |
| `S/runtime/tests/smart-router-analyze.vitest.ts` | Modify | A new test treats a baseline run that reads SKILL.md and ROUTER.md as compliant (E-01) |
| `S/runtime/tests/smart-router-measurement.vitest.ts` | Modify | The fixture writes the machine router into its own ROUTER.md (C8, D-02) |
| This phase's `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Record the run, the fixes and the recheck |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Routing does not change. | The skill routers parse identically to HEAD with the router-file resolver. |
| REQ-002 | Each upheld finding that does not change routing is fixed. | The evidence file lists 26 FIXED lines, and each LEFT or OUTSIDE line carries a disposition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each recheck non-pass row has a known cause. | The recheck lists 1 cannot-run row and 2 failures, and each one is classified. |
| REQ-004 | Each routing item is carried forward. | Each OUTSIDE line held by the no-routing-change decision names the routing follow-up. |
| REQ-005 | The fix lane's code changes are tested. | The hand-run tests in the evidence file pass with 0 failures. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery reads `{"pass":64,"cannot_run":1,"not_applicable":7,"fail":2}`, and every non-pass row in it is classified.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` prints `Result: PASS`, `check-markdown-links.cjs` reports 0 broken links, vitest prints `Tests 23 passed (23)`, and `tsc --noEmit` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash workers | No lane findings and no fix lane | Rerun the lane; the battery and probes still run without them |
| Risk | A fix edits routing data under the cover of a prose or code fix | High | The fix lane is barred from routing data, and the router-file resolver shows the skill routers parse identically to HEAD |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `graph-metadata.json` gain the sweep, orphan and script-name `intent_signals` (D-04, D-05), and should the advisor learn the vocabulary the four failed probes need? Decision: not in this phase. Both change routing, so both are carried to the routing follow-up.
- Can the recheck run S1-package-check on the worktree runtime? Decision: no. The worktree runtime has no node_modules of its own, so `tsc --noEmit` and eslint on the changed files ran by hand instead, and both exited 0.
<!-- /ANCHOR:questions -->

---
