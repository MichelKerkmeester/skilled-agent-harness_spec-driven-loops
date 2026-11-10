---
title: "Feature Specification: Phase 20: align-system-deep-loop"
description: "After the machine router moved from SKILL.md to ROUTER.md, nothing yet showed that the system-deep-loop docs, playbooks, READMEs and changelogs still matched where routing lives. This phase records one operator-local alignment check over system-deep-loop, the fixes it upheld and a full recheck."
trigger_phrases:
  - "align system deep loop"
  - "phase 20 align system deep loop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: align-system-deep-loop

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
| **Phase** | 20 of 22 |
| **Predecessor** | 019-align-sk-prompt |
| **Successor** | 021-align-system-skill-advisor |
| **Handoff Criteria** | The system-deep-loop recheck reads pass 107, not applicable 3 and fail 3 with each failure classified, `check-contract-drift.cjs` prints `OK commands=3`, all 54 routers parse identically to HEAD, and D-10 is carried to the routing follow-up |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The system-deep-loop files changed since base `6a9946a800`. The phase changes no routing data. No `INTENT_SIGNALS`, `RESOURCE_MAP`, advisor vocabulary or hub class moves. Run output stays in the run folder outside the checkout.

**Dependencies**:
- The router move in phases 004 to 006, which put the system-deep-loop machine router in `ROUTER.md`.
- The router-file resolver, which proves each router still parses the same.
- DeepSeek V4.1 Flash workers for the four review lanes and the fix lane.

**Deliverables**:
- The upheld findings that do not change routing, fixed in the system-deep-loop files listed below.
- A recheck of the full battery against the worktree, with each failure classified.
- Each routing item named with its disposition and carried to the routing follow-up in the parent spec.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router move changed where the system-deep-loop machine router lives, but the docs around it were written for the old place. A playbook, README, changelog or reference that still points at a router inside SKILL.md sends a reader to the wrong file. No check had yet read system-deep-loop as a whole after the move.

### Purpose
Every upheld finding in system-deep-loop that does not change routing is fixed, every routing item is carried forward, and the recheck shows only failures with a known cause.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Copied from the evidence file in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Kind: skill, file set first-parent
Commits: 6a9946a80064c9971385d4c9cfba6bf9809fd1a5 to 4f741f6b48ac5825a3ce18dbe19575d76043885f, 27 first-parent commits
Files: 47, of which 0 uncommitted or untracked
Findings: 29 (P0 0, P1 6, P2 23), 19 literal, 1 inferred, 17 outside the scope; 7 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":96,"not_applicable":3}
Probes: STATUS=FINDINGS run-probes: pass=12 fail=2 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":107,"not_applicable":3,"fail":3}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the system-deep-loop files changed since base `6a9946a800` and run the existing check battery over them.
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
| `.skilled/skills/system-deep-loop/ROUTER.md` | Modify | The prose says SKILL.md keeps a short routing summary and a pointer, matching the other hubs (D-07) |
| `.skilled/skills/system-deep-loop/README.md` | Modify | A ROUTER.md row and a ROUTER.md checklist step; the validator bullet says it checks the ROUTER contract (B-05, B-06) |
| `.skilled/skills/system-deep-loop/changelog/v1.6.20.0.md` | Modify | One bullet for this pass |
| `.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | Modify | "one of the five activated hubs" becomes "seven", the shipped cohort (C-1) |
| `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/deep-loop-mode-classification.md` | Modify | The SKILL.md row keeps the contract and the ROUTER.md row owns the discriminator (A-7) |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/runtime-and-backend/runtime-loop-council.md` | Modify | Precondition and source-files row point to ROUTER.md for the three-tier discriminator (A-2, A-4) |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/runtime-and-backend/runtime-loop-research.md` | Modify | Precondition and source-files row point to ROUTER.md for the backend routing rule (A-3, A-5) |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/runtime-and-backend/external-adapter.md` | Modify | Source-files row and triage step name the ROUTER.md backend-routing rule (A-6, F-1) |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/mode-routing/mode-hint-override.md` | Modify | Precondition and source-files row point to ROUTER.md for the override rule (B-02, F-2) |
| `.skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts` | Modify | Both duplicate `addRedaction` calls removed; the has-guard made each a no-op (A-9) |
| `.skilled/skills/system-deep-loop/runtime/references/integration-points.md` | Modify | Guard and anchor rows name the hub `../SKILL.md` and its MCP-tool rule (C-5) |
| `.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md` | Modify | The citation reads `README.md` section 3 for the direct `.cjs` consumer path (C-5) |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.14.0.md` | Modify | One bullet for this pass |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modify | The dangling "That pseudocode" now names the pseudocode in ROUTER.md (A-1) |
| `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.13.0.md` | Modify | One bullet for this pass |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md` | Modify | Range 90-95 becomes 242, where NEVER rule 1 now sits (F-3) |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/resource-map-coverage-gate.md` | Modify | Ranges become 98-105 and 306 (D-01) |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/synthesis-save-boundary.md` | Modify | Ranges become 298-322 and 330-338 (D-02) |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/three-artifact-iteration-contract.md` | Modify | Ranges become 220-222 and 309-319 (D-03) |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md` | Modify | The second range 253-346 becomes 123-125 (D-04) |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md` | Modify | The second range 411-438 becomes 240-251 (D-05) |
| `.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.11.0.md` | Modify | One bullet for this pass |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/intra-routing-recall/resource-map.md` | Modify | The numeric range becomes the MACHINE ROUTER heading anchor its siblings use (C-6) |
| `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md` | Modify | The forbidden-mix example names three distinct executors: OpenCode, Cursor and Claude Code (C-4) |
| `.skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.8.9.0.md` | Modify | One bullet for this pass |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md` | Modify | The second `cli-opencode` becomes `cli-codex` (C-3) |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown` | Modify | Recompiled with `compile-command-contracts.cjs --write` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled with `compile-command-contracts.cjs --write` |
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
| REQ-002 | Each upheld finding that does not change routing is fixed. | The evidence file lists 26 FIXED lines, and each LEFT or OUTSIDE line carries a disposition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each recheck failure has a known cause. | The recheck lists 3 failures, and each one is classified as derived or fixed after the recheck. |
| REQ-004 | Each routing item is carried forward. | Each OUTSIDE line held by the no-routing-change decision names the routing follow-up. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery reads `{"pass":107,"not_applicable":3,"fail":3}`, and every failure in it is classified.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` prints `Result: PASS` for the hub and its three modes, `validate-playbook-package.cjs --strict` passes all 5 packages, `tsc --noEmit` exits 0, and `check-markdown-links.cjs` reports 0 broken links.
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

- Should `hub-router.json` add "audit the diff", "seat diversity" and "investigate why" to `vocabularyClasses` (D-10)? Decision: not in this phase. It is routing data, held by the no-routing-change decision and carried to the routing follow-up.
- None else blocks.
<!-- /ANCHOR:questions -->

---

