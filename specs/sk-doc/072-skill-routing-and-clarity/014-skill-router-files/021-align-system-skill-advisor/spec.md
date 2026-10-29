---
title: "Feature Specification: Phase 21: align-system-skill-advisor"
description: "After the machine router moved from SKILL.md to ROUTER.md, nothing yet showed that the system-skill-advisor docs, playbooks, READMEs and changelogs still matched where routing lives. This phase records one operator-local alignment check over system-skill-advisor, the fixes it upheld and a full recheck."
trigger_phrases:
  - "align system skill advisor"
  - "phase 21 align system skill advisor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: align-system-skill-advisor

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
| **Phase** | 21 of 22 |
| **Predecessor** | 020-align-system-deep-loop |
| **Successor** | 022-align-system-spec-kit |
| **Handoff Criteria** | The system-skill-advisor recheck reads pass 51, not applicable 8 and fail 2 with both failures derived, the 9 fixes and the A-6 prose fix are in place, all 54 routers parse identically to HEAD, and D-01 and the five probe misses are carried to the routing follow-up |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The system-skill-advisor files changed since base `6a9946a800`. The phase changes no routing data. No `INTENT_SIGNALS`, `RESOURCE_MAP`, advisor vocabulary or hub class moves. Run output stays in the run folder outside the checkout.

**Dependencies**:
- The router move in phases 004 to 006, which put the system-skill-advisor machine router in `ROUTER.md`.
- The router-file resolver, which proves each router still parses the same.
- DeepSeek V4.1 Flash workers for the four review lanes and the fix lane.

**Deliverables**:
- The upheld findings that do not change routing, fixed in the system-skill-advisor files listed below.
- A recheck of the full battery against the worktree, with each failure classified.
- Each routing item named with its disposition and carried to the routing follow-up in the parent spec.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router move changed where the system-skill-advisor machine router lives, but the docs around it were written for the old place. A playbook, README, changelog or reference that still points at a router inside SKILL.md sends a reader to the wrong file. No check had yet read system-skill-advisor as a whole after the move.

### Purpose
Every upheld finding in system-skill-advisor that does not change routing is fixed, every routing item is carried forward, and the recheck shows only failures with a known cause.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Copied from the evidence file in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Kind: skill, file set first-parent
Commits: 6a9946a80064c9971385d4c9cfba6bf9809fd1a5 to 4f741f6b48ac5825a3ce18dbe19575d76043885f, 27 first-parent commits
Files: 10, of which 0 uncommitted or untracked
Findings: 19 (P0 0, P1 8, P2 11), 5 literal, 5 inferred, 9 outside the scope; 10 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":48,"not_applicable":8}
Probes: STATUS=FINDINGS run-probes: pass=3 fail=5 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":51,"not_applicable":8,"fail":2}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the system-skill-advisor files changed since base `6a9946a800` and run the existing check battery over them.
- Send four read-only review lanes over those files: code, skill docs, READMEs with changelogs and env, and routing.
- Score routing probe prompts against the advisor, and let a critic overturn weak findings.
- Apply the upheld findings that do not change routing, through a DeepSeek fix lane and a follow-up router prose pass.
- Rerun the full battery against the worktree and classify each failure.

### Out of Scope
- Routing data changes - the packet decision is that no skill routes differently, so each one is carried to the routing follow-up.
- Regenerating derived files by hand - the activation manifests and Hermes copies regenerate at commit.
- Git commits - this phase writes no git state.

### Files to Change

Paths are relative to the repository root.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Reindex promotes `SKILL.md`, `ROUTER.md` and `graph-metadata.json` into durable targets (A-5) |
| `.skilled/skills/system-skill-advisor/ROUTER.md` | Modify | The duplicate sentence under the MACHINE ROUTER heading is removed (A-6) |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | The daemon watches every `SKILL.md`, `ROUTER.md` and `graph-metadata.json` (A-4) |
| `.skilled/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | Lines 112 and 130 name ROUTER.md; the ADR-002 row stays as written, since ADRs stay historical (B-S2-05) |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.25.0.md` | Modify | The claim now says no playbook, catalog or reference pointed at the router, so none needed repointing (C-3) |
| `.skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md` | Modify | ROUTER.md is in the live row, the live to stale trigger and the daemon watch list (A-1) |
| `.skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md` | Modify | Hash drift includes `.skilled/skills/*/ROUTER.md` where a skill carries one (B-S2-03) |
| `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/watcher.md` | Modify | Frontmatter, section 1 and section 2 list a skill's ROUTER.md, and the three closed lists are corrected (A-2) |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md` | Modify | ROUTER.md is named throughout, with a router touch step, signal and failure row (A-3) |
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` | Modify | The fixture writes a ROUTER.md, and the test asserts 3 counts and the exact reason set including `router-md` (CC-1) |
| This phase's `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Record the run, the fixes and the recheck |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Routing does not change. | All 54 skill routers parse identically to HEAD with the router-file resolver. |
| REQ-002 | Each upheld finding that does not change routing is fixed. | The evidence file lists 9 FIXED lines, and each LEFT or OUTSIDE line carries a disposition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each recheck failure has a known cause. | The recheck lists 2 failures, and each one is classified as derived or fixed after the recheck. |
| REQ-004 | Each routing item is carried forward. | Each OUTSIDE line held by the no-routing-change decision names the routing follow-up. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery reads `{"pass":51,"not_applicable":8,"fail":2}`, and every failure in it is classified.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` prints `Result: PASS`, `validate_document.py` reports 0 issues on seven changed files, and `check-markdown-links.cjs` reports 0 broken links.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash workers | No lane findings and no fix lane | Rerun the lane; the battery and probes still run without them |
| Risk | A fix edits routing data under the cover of a prose fix | High | The fix lane is barred from routing data, and the router-file resolver shows all 54 routers parse identically to HEAD |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `graph-metadata.json` gain freshness and router `intent_signals` (D-01), and should the advisor learn the vocabulary the five failed probes need? Decision: not in this phase. Both change routing, so both are carried to the routing follow-up.
- Is a watcher bug behind the probe misses? Decision: no. The daemon watcher already watches each skill's ROUTER.md (`runtime/lib/daemon/watcher.ts`, committed earlier), so the misses are advisor vocabulary gaps.
<!-- /ANCHOR:questions -->

---

