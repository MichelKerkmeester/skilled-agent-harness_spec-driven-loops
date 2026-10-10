---
title: "Feature Specification: Phase 5: opencode-and-guards"
description: "No sk-code guard reads the prose that cites the routers, so renames left dead paths, retired packet names and two-surface wording behind. This phase adds a documentation claim checker as a fourth drift guard, makes the router-sync guard read the declared shared controls, extends hub version parity, adds a canary collision case and cleans the OpenCode packet."
trigger_phrases:
  - "opencode and guards"
  - "phase 5 opencode and guards"
  - "documentation claim checker"
  - "verify doc claims"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: opencode-and-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/005-opencode-and-guards` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-webflow-and-obsidian |
| **Successor** | 006-deep-loop-follow-ups |
| **Handoff Criteria** | The checker's known-bad tests fail on their inputs, the OpenCode packet has no checker hit, router-sync stays 5/5, and the four-guard umbrella exits 0 once children 001 to 004 land |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Round-three remediation child specification.

**Scope Boundary**: Everything under `.skilled/skills/sk-code/sk-code-opencode/`, the sk-code canary fixture and its authored copy, the hub version-parity check in the doctor script and its test, and the regenerated `leaf-manifest.json`. Files other children own are handed off, never edited.

**Dependencies**:
- Findings f-iter020-003, f-iter016-002, f-iter018-002, f-iter001-003, f-iter004-004, f-iter014-002, f-iter004-001, f-iter005-001, f-iter004-005, f-iter005-002, f-iter004-002 and f-iter014-001 in `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/iterations/`
- Children 001 to 004 for the checker's pass over the whole tree (plan.md section "Handoffs")

**Deliverables**:
- `assets/scripts/verify_doc_claims.cjs` with four checks and an allowlist, its test, and a fourth guard in `scripts/run-all-drift-guards.sh`
- `verify_router_sync.cjs` check 2 reading the `ROUTER.md` `SHARED_CONTROL_RESOURCES` block
- Doctor checks 13c (hub README version) and 13d (packet changelog version) with tests
- An OBSIDIAN-versus-WEBFLOW canary case
- OpenCode prose fixes, version 1.2.0.0 and its changelog

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every round-three drift cluster sits in prose that no guard reads: the routers and manifests were updated after each rename and all pass, while the docs that cite them kept dead paths, pre-rename packet names and two-surface wording (f-iter020-003). The router-sync guard keeps its own copy of the hub-level shared controls instead of reading the `ROUTER.md` declaration (f-iter001-003), hub version parity skips the README and the packet changelogs (f-iter018-002), and no canary case covers a prompt that carries both Obsidian and Webflow markers (f-iter004-004). The OpenCode packet itself carries retired names (f-iter014-002), an unlabelled comment budget (f-iter004-001, f-iter005-001), stale link labels (f-iter004-005, f-iter005-002) and a packet-number pointer (f-iter004-002).

### Purpose
A fourth drift guard fails on the whole class of prose drift, and every guard reads its facts from the one declared source.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A documentation claim checker over Markdown and JSON under `.skilled/skills/sk-code/`, outside `changelog/` and `benchmark/reports/`, with four checks: paths, retired names, two-surface counts and load tiers, plus an allowlist data block with a reason per row
- A node test with one known-bad input per check, and the checker as the fourth guard of the umbrella
- The router-sync guard reading the `ROUTER.md` block for check 2, keeping the three shared workflow-doc allowlist entries and their comment
- Doctor checks 13c and 13d and their tests
- The canary collision case and its authored copy
- Every checker hit inside the OpenCode packet, the comment-budget labels and the f-iter004-002 pointer
- The OpenCode version bump to 1.2.0.0, its changelog and the regenerated leaf manifest
- f-iter003-003: the OpenCode workflow guardrails reference, which takes over the three "OpenCode Surface Only" subsections of the shared implement and verify workflow, routed through the OpenCode `DEFAULT_RESOURCE`

### Out of Scope
- Checker hits in files other children own - recorded per child in plan.md "Handoffs"
- Hermes copies - the orchestrator regenerates them once after every build
- A compiled-route manifest re-mint - only hub files move its hash, and child 001 owns those

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs` | Create | Documentation claim checker |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` | Create | Clean tree plus one known-bad input per check and the allowlist |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` | Modify | Check 2 reads the `ROUTER.md` block and the manifest leaves |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` | Modify | Two check 2 tests |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | Fourth guard |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Names, guard count, recipe path, version 1.2.0.0, guardrails reference in `DEFAULT_RESOURCE` and the shared-tier map |
| `.skilled/skills/sk-code/sk-code-opencode/README.md` | Modify | Names and guard count |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modify | Names, guard count, test rows |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` | Modify | Checker row, file count, name |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modify | Names and guard count |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` | Modify | Name |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md` | Modify | Budget label, link label, carry-over line |
| `.skilled/skills/sk-code/sk-code-opencode/references/{javascript,python,config}/style-guide.md`, `references/shell/style-guide/overview-structure-and-naming.md`, `references/typescript/style-guide/formatting-imports-and-coexistence.md` | Modify | Budget labels, one link label |
| `.skilled/skills/sk-code/sk-code-opencode/manual-testing-playbook/` (root and nine scenarios) | Modify | Names and guard count |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md` | Create | OpenCode implementation guardrails, verification reality and runtime build traps, moved from the shared workflow docs |
| `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.0.0.md` | Create | Changelog entry, including the guardrails move |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Collision case |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Authored copy, byte-identical |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Checks 13c and 13d |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Three tests |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify | Regenerated for the new asset script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The checker has four checks and each can fail | `verify_doc_claims.test.cjs` passes 6 of 6, including one known-bad case per check that asserts the FAIL line |
| REQ-002 | The umbrella runs the checker as a fourth guard | `run-all-drift-guards.sh` prints a `doc-claims` PASS or FAIL line and counts four guards |
| REQ-003 | Router-sync reads the declared shared controls | The guard has no `PARENT_TIER_ALLOWLIST`, reads the `ROUTER.md` list and `DEFAULT_RESOURCE` preamble, keeps the three workflow-doc entries, passes 5/5, and its test passes 5 of 5 with two new check 2 cases |
| REQ-004 | The OpenCode packet is clean | The checker reports no line under `sk-code-opencode/` |
| REQ-005 | The checker passes over the whole tree | After children 001 to 004 land, the checker exits 0 and the umbrella prints `all 4 guards PASSED`; until then each hit is recorded against its owner |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Hub version parity covers the README and packet changelogs | Doctor tests pass 98 of 98; the five other parent hubs still end `OK` |
| REQ-007 | The collision precedence has a canary case | The canary prints `cases 12 failures 0` with the new case OK, and both fixture copies are identical |
| REQ-008 | The comment budget, link labels and pointer are fixed | Six budget rows carry the surface-setting label, no `../../universal/code-style-guide.md` label and no `Carry-over from` line remain |
| REQ-009 | Version, changelog and generated files agree | `version: 1.2.0.0` in `SKILL.md` and `changelog/v1.2.0.0.md`, the changelog validates, the leaf manifest is fresh and compiled routing stays fresh |
| REQ-010 | The already-fixed finding is recorded | f-iter014-001 is recorded with the command that proves line 173 names legs 1a, 1b, 2, 3 and 4 |
| REQ-011 | Only owned files change | The scope diff lists only the Files to Change |
| REQ-012 | The OpenCode-only workflow rules live in the OpenCode tier | `references/shared/workflow-guardrails.md` validates with 0 issues, is listed in the OpenCode `DEFAULT_RESOURCE`, router-sync passes 5/5 and the leaf manifest is fresh; child 001 replaces the shared subsections with pointers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the four checks fails on its own known-bad input and passes on a clean tree
- **SC-002**: The drift gate runs four guards, and every guard reads its facts from the declared source
- **SC-003**: No other parent hub changes its doctor verdict
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Children 001 to 004 fix the hits in their files | REQ-005 stays open | Hits are attributed per owner in plan.md, and the builder records the live list |
| Dependency | Child 001 sets the hub README version to the hub SKILL.md version | Doctor 13c fails on sk-code until then | Handoff in plan.md |
| Risk | Unowned hub files (root playbook, `graph-metadata.json`) carry 21 hits | Med | Handed to the orchestrator to assign |
| Risk | Child 001 also changes `leaf-manifest.json` | Low | The orchestrator reruns the leaf check after all builds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for f-iter003-003: the orchestrator decided a real move, recorded in plan.md D12.
- Which child takes the 18 hits in the hub-root `manual-testing-playbook/` and the 3 in `graph-metadata.json`, which no child owns. The orchestrator decides.
<!-- /ANCHOR:questions -->

---
