---
title: "Feature Specification: Surface tie order warning"
description: "Make the parent-skill doctor report a sk-code surface that a user placed by hand after sk-code-skilled in routerPolicy.tieBreak, unless it is one of the two shipped example surfaces."
trigger_phrases:
  - "surface tie order warning"
  - "native surface last in tiebreak"
  - "doctor check 5l"
  - "hand-added surface after sk-code-skilled"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Surface tie order warning

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-13 |
| **Branch** | `worktrees/131-tieorder-warning`, from origin/main c62d7d1399 |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 026-external-surface-priority-build |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the sk-code Ponytail refinement epic. Phase 026 made `/create:skill-parent update --surfaces` place a new surface after the workflow modes and ahead of the existing surfaces in `routerPolicy.tieBreak`. A user who edits `.skilled/skills/sk-code/hub-router.json` by hand gets no such placement, and nothing tells them when their surface lands after `sk-code-skilled`. The operator's intent: `sk-code-skilled` is the native surface and has the lowest priority for an external user; `sk-code-obsidian` and `sk-code-webflow` are the operator's own examples, which external users delete; every other surface sits ahead of `sk-code-skilled`.

**Scope Boundary**: One new doctor check in `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, its tests, the section heading that names the check range, and one sentence in the root README's sk-code guide. No registry or router schema change, and no scaffold change.

**Dependencies**:
- Phase 026, on origin/main, for the scaffold placement rule and the README guide block.
- `devin` with model `deepseek-v4-1-flash-max` for every edit outside this folder.

**Deliverables**:
- Doctor check 5l, scoped to the sk-code hub.
- Three invariant tests: one that fails before the change, two edge cases that pass.
- A five-iteration `/deep:review :auto` run under `review/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`routerPolicy.tieBreak` decides a keyword tie: the mode listed first wins. Doctor check 5e only checks that `tieBreak` is a permutation of the registered modes, and 5i only checks that workflow modes come first. A surface added by hand after `sk-code-skilled` passes both, then loses every keyword tie to the native surface, and the user gets no signal that their own stack ranks below the framework's.

### Purpose
A run of the doctor on sk-code names any user-added surface placed after `sk-code-skilled` and says how to fix it, while the shipped order (quality, review, opencode, obsidian, webflow) stays green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check 5l in `parent-skill-check.cjs`: on the sk-code hub only, any `packetKind: "surface"` mode listed after `sk-code-skilled` in `tieBreak`, other than `sk-code-obsidian` and `sk-code-webflow`, is reported. The message names the fix: move it ahead of `sk-code-skilled`, or re-add it with `/create:skill-parent update --surfaces`.
- Three tests in `parent-skill-check-invariants.test.cjs`.
- The section heading `HUB-ROUTER CHECKS (5a-5j)` corrected to `(5a-5l)`.
- One sentence in the root README's "Add your own surface" step 1 for a hand edit of `tieBreak`.

### Out of Scope
- A native or example marker in `mode-registry.json` or `hub-router.json`; see ADR-001.
- Any other hub: no other hub ships a native surface.
- A missing `sk-code-skilled`: the README tells users to keep it, and 5e already reports a registry and `tieBreak` mismatch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Check 5l and the section heading |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Three 5l tests and one fixture helper |
| `README.md` | Modify | One sentence in the sk-code guide |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A user-added sk-code surface after `sk-code-skilled` in `tieBreak` is reported by check 5l with the two fixes named |
| REQ-002 | The shipped sk-code order, with `sk-code-obsidian` and `sk-code-webflow` after `sk-code-skilled`, passes 5l |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A tree with both examples removed and an added surface ahead of `sk-code-skilled` passes 5l |
| REQ-004 | All seven parent hubs still pass the doctor |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Ledger

The builder records each test as `| T<n> | <test name> | before: <verdict> | after: pass |` and review findings as `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` in `implementation-summary.md`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A hand-edited sk-code `tieBreak` with a user surface after `sk-code-skilled` turns the doctor red with a line that names the surface and the fix.
- **SC-002**: The operator's own repository and a repository with the examples removed stay green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A user renames an example surface and keeps it after opencode | Low | It is then a user surface, and 5l reports it, which is the intent |
| Risk | The doctor runs red where it ran green | Med | Only a sk-code `tieBreak` that already breaks the operator's ordering intent goes red; `PARENT_HUB_CHECK_STRICT=0` downgrades it to WARN |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every other doctor line for the seven hubs is unchanged; sk-code gains one PASS line.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `sk-code-skilled` absent from `tieBreak`: 5l prints nothing; 5e covers a registry mismatch.
- A workflow mode after `sk-code-skilled`: 5i reports it, so 5l looks at surface modes only and never double-reports.
- A hub other than sk-code: 5l prints nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | Three files, about 70 lines |
| Risk | 5/25 | One new doctor check that can go red |
| Research | 2/20 | Phase 025 and 026 findings |
| **Total** | **10/70** | **Level 2, as the orchestrator set for this phase** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
