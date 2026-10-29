---
title: "Feature Specification: Phase 19: align-sk-prompt"
description: "After the machine router moved from SKILL.md to ROUTER.md, nothing yet showed that the sk-prompt docs, playbooks, READMEs and changelogs still matched where routing lives. This phase records one operator-local alignment check over sk-prompt, the fixes it upheld and a full recheck."
trigger_phrases:
  - "align sk prompt"
  - "phase 19 align sk prompt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: align-sk-prompt

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
| **Phase** | 19 of 22 |
| **Predecessor** | 018-align-sk-git |
| **Successor** | 020-align-system-deep-loop |
| **Handoff Criteria** | The sk-prompt recheck reads pass 51, not applicable 7 and fail 2 with both failures derived, the 20 fixes and the C-2 prose fix are in place, all 54 routers parse identically to HEAD, and F-2 and D-03 are carried to the routing follow-up |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The sk-prompt files changed since base `6a9946a800`. The phase changes no routing data. No `INTENT_SIGNALS`, `RESOURCE_MAP`, advisor vocabulary or hub class moves. Run output stays in the run folder outside the checkout.

**Dependencies**:
- The router move in phases 004 to 006, which put the sk-prompt machine router in `ROUTER.md`.
- The router-file resolver, which proves each router still parses the same.
- DeepSeek V4.1 Flash workers for the four review lanes and the fix lane.

**Deliverables**:
- The upheld findings that do not change routing, fixed in the sk-prompt files listed below.
- A recheck of the full battery against the worktree, with each failure classified.
- Each routing item named with its disposition and carried to the routing follow-up in the parent spec.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router move changed where the sk-prompt machine router lives, but the docs around it were written for the old place. A playbook, README, changelog or reference that still points at a router inside SKILL.md sends a reader to the wrong file. No check had yet read sk-prompt as a whole after the move.

### Purpose
Every upheld finding in sk-prompt that does not change routing is fixed, every routing item is carried forward, and the recheck shows only failures with a known cause.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Copied from the evidence file in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Kind: skill, file set first-parent
Commits: 6a9946a80064c9971385d4c9cfba6bf9809fd1a5 to 4f741f6b48ac5825a3ce18dbe19575d76043885f, 27 first-parent commits
Files: 13, of which 0 uncommitted or untracked
Findings: 27 (P0 0, P1 7, P2 20), 13 literal, 0 inferred, 1 outside the scope; 6 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":52,"not_applicable":7}
Probes: STATUS=FINDINGS run-probes: pass=10 fail=4 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":51,"not_applicable":7,"fail":2}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the sk-prompt files changed since base `6a9946a800` and run the existing check battery over them.
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
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | The design-gen promise names `patterns-evaluation.md`; FRAMEWORK replaces the DEPTH default; the CLI card is in section 5 and the discovery line; scores are ignored, not absent (F-1, A-1, B-05, F-6) |
| `.skilled/skills/sk-prompt/ROUTER.md` | Modify | Section 2 says every intent except FRAMEWORK also loads the DEPTH default, and the Resource Domains list names the CLI prompt-quality card (B-03, C-2) |
| `.skilled/skills/sk-prompt/README.md` | Modify | The design-gen line drops unshipped techniques, and the related-documents table lists `assets/cli-prompt-quality-card.md` (F-1, C-6) |
| `.skilled/skills/sk-prompt/changelog/v3.0.11.0.md` | Modify | The opening matches its bullets, and the false feature-catalog claim is gone (C-3, C-4) |
| `.skilled/skills/sk-prompt/leaf-manifest.config.json` | Modify | The `_note` names `INTENT_MODEL`, the constant the router declares (A-4) |
| `.skilled/skills/sk-prompt/manual-testing-playbook/manual-testing-playbook.md` | Modify | Expected framework CRAFT, SP-028 guide loading, the category path shape, the CLI card coverage gap and the SP-019, SP-024 and SP-027 counts (B-02, F-3, B-06, F-5, F-7) |
| `.skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/ambiguity-delta-tiebreaker.md` | Modify | The request is retied to 7 against 7 so the top-2 path fires (A-2) |
| `.skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md` | Modify | The input scores zero so the fallback runs, and the grep is anchored to the list declaration (A-3, B-04) |
| `.skilled/skills/sk-prompt/manual-testing-playbook/format-modes/format-guide-on-demand.md` | Modify | The dead underscore token is replaced, and the check expects the YAML guide on the prefix alone (B-07, F-4) |
| `.skilled/skills/sk-prompt/manual-testing-playbook/format-modes/format-mode-delivery.md` | Modify | The same dead underscore token is replaced (B-07) |
| `.skilled/skills/sk-prompt/manual-testing-playbook/mode-detection/mode-prefix-keyword-collision.md` | Modify | The scenario says scores are ignored, not absent (F-6) |
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
| REQ-002 | Each upheld finding that does not change routing is fixed. | The evidence file lists 20 FIXED lines, and each LEFT or OUTSIDE line carries a disposition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each recheck failure has a known cause. | The recheck lists 2 failures, and each one is classified as derived or fixed after the recheck. |
| REQ-004 | Each routing item is carried forward. | Each OUTSIDE line held by the no-routing-change decision names the routing follow-up. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery reads `{"pass":51,"not_applicable":7,"fail":2}`, and every failure in it is classified.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` prints `Result: PASS`, `validate_document.py` reports 0 issues on all 10 changed markdown files, and `check-markdown-links.cjs` reports 0 broken links.
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

- Should `NO_LOAD_INTENTS` be wired into the MACHINE ROUTER pseudocode (F-2), and should the advisor learn the DESIGN_GEN and FORMAT_YAML vocabulary (D-03)? Decision: not in this phase. Both change routing, so both are carried to the routing follow-up.
- None else blocks.
<!-- /ANCHOR:questions -->

---

