---
title: "Feature Specification: Example-tolerant drift guards"
description: "R2: the sk-code drift guards tolerate a removed example surface. Router-sync filters its hard-coded surface lists to packets on disk, skips archived gold destinations for undeclared modes and anchors its prose scan on the first map heading, and doc-claims derives the surface count from the registry."
trigger_phrases:
  - "example tolerant drift guards"
  - "phase 3 example tolerant drift guards"
  - "verify router sync existence filter"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Example-tolerant drift guards

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
| **Branch** | Its own worktree from origin/main, created as `goal.md` says |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-doctor-guard-sync-messages |
| **Successor** | 004-router-version-parity |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the external surface priority build. It builds research recommendation R2, phase P10 of `../../025-external-surface-priority-research/research/research.md` section 14.1, as the verification pass narrowed it: an existence filter replaces the minted discriminator (X20), leg 3 and the leg 1a anchor join it (F83, F95), the doc-claims surface count joins it (F94), and the surface-hint test moved to the guide (X24).

**Scope Boundary**: `verify-router-sync.cjs` and `verify-doc-claims.cjs` under `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/` and their tests under `sk-code-opencode/scripts/tests/`, plus one sk-code-opencode release.

**Dependencies**:
- None. Builds in parallel with 001 and 002.

**Deliverables**:
- Four guard changes, each with a test that fails before and passes after.
- One sk-code-opencode release.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`run-all-drift-guards.sh` is the completion gate for system-code changes (`sk-code-opencode/SKILL.md:175`). After the documented removal of the examples it can never pass (F85, run V3): check 2 throws ENOENT on the hard-coded `sk-code-webflow/SKILL.md` because `SURFACES` and `SURFACE_PACKETS` are fixed lists (`verify-router-sync.cjs:31-32`); check 3 reports `compiled destination resolves to no leaf-owning mode` for archived route-gold cases of the deleted modes (`:244-251`, F83); leg 1a reports `ROUTER.md section anchors not found` once the Webflow prose map is removed, because it starts at the literal `## 4. WEBFLOW MAP` (`:124-131`, F95); and doc-claims fails any "two surfaces" wording because it assumes three (`verify-doc-claims.cjs:42-44`, `:319`, F94).

### Purpose
The guards describe whatever surfaces the tree ships, so an adopter who removed an example can pass the completion gate, and the operator's tree gives the same results as today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Existence filter.** `SURFACES` and `SURFACE_PACKETS` keep their names and become filtered to packet directories present on disk (verified in run V6: 1a, 1b, 2 and 4 pass after removal, and the pristine tree is identical by construction).
- **Archived gold.** Leg 3 skips a route-gold destination whose mode the leaf manifest no longer declares, and still fails a destination whose declared mode resolves to no leaf.
- **Leg 1a anchor.** The prose scan starts at the first `## N. <NAME> MAP` heading instead of the literal `## 4. WEBFLOW MAP`, and keeps its end anchor.
- **Doc-claims count.** The `surfaces` rule derives the surface count from `mode-registry.json` (modes with `packetKind` `surface`) and flags wording that states a different count, instead of assuming three.
- One test per change in the existing test files: T1 to T4.
- One release of the sk-code-opencode mode packet: its `SKILL.md` version and one changelog entry.

### Out of Scope
- A minted union-child discriminator such as `surfaceRole` or `surfaceChildren` (X20).
- Rebuilding the surface-hint test on a fixture hub (X24); the guide lists it as an example-bound file.
- Deriving the sets from `packetKind === "surface"` alone, which fails the pristine control with 35 false problems (X15).
- The doc-claims `paths` check: its dead links after a removal are fixed by the user, as the guide says.
- The `webflow|opencode|animation` prefix list in the prose regex, unless a test shows it blocks a removal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` | Modify | Existence filter, archived gold skip, leg 1a anchor |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs` | Modify | Registry-derived surface count |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs` | Modify | T1 to T3 |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs` | Modify | T4 |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`, `.skilled/skills/sk-code/sk-code-opencode/changelog/` | Modify, Create | One release, and the surfaces sentence |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`, `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modify | The surfaces rule described by the registry |
| `.hermes/skills/sk-code-opencode/SKILL.md` | Regenerate | Hermes copy of the released SKILL.md, written by `sync-skills-hermes.cjs` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The live wrapper exits 0 with the same per-check results as before |
| REQ-002 | After the removal recipe in a copy, router-sync checks 1a, 1b, 2, 3 and 4 pass |
| REQ-003 | They still pass with ROUTER.md's Webflow prose section removed |
| REQ-004 | Doc-claims `surfaces` accepts "two surfaces" when the registry has two surface modes |
| REQ-005 | On the pristine tree, check 2 reports no new problem |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | T1 to T4 each fail before their change and pass after; one sk-code-opencode release is added and the sk-code doctor's 13d passes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Acceptance Ledger (5 rows plus 4 tests)

The builder records each row in `implementation-summary.md` as `| P10-<n> | Pass | <backticked command and what it printed> |`, and each test as `| T<n> | <test name> | before: exit <n> | after: exit 0 |`.

| ID | Check |
|----|-------|
| P10-1 | Worktree: `run-all-drift-guards.sh` exit 0, per-check results equal to the baseline |
| P10-2 | Copy after the removal recipe (research F84): router-sync checks 1a, 1b, 2, 3 and 4 pass |
| P10-3 | The same copy with ROUTER.md's Webflow prose map section removed: the same checks pass |
| P10-4 | Copy whose registry has two surface modes: a doc stating "two surfaces" passes doc-claims `surfaces` |
| P10-5 | Pristine copy: check 2's output equals the live tree's |
| T1 | Existence filter |
| T2 | Archived gold skip |
| T3 | Leg 1a anchor |
| T4 | Registry-derived surface count |

Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table in the same file.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An adopter who removed both examples by the guide passes router-sync.
- **SC-002**: The operator's tree passes exactly as before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gold skip hides a real routing regression | High | Skip only modes the leaf manifest no longer declares; a declared mode with no leaf still fails, covered by T2 |
| Risk | The first-map anchor picks up a non-map section | Med | Match the `## N. <NAME> MAP` shape only; T3 covers a ROUTER.md without the Webflow map |
| Risk | The registry count counts a workflow mode | Med | Count only `packetKind` `surface`; T4 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The pristine tree's guard output is unchanged.
- **NFR-R02**: No new data field, schema or fixture; the guards read what exists.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A user surface outside the hard-coded list: passes check 2 through the owned-leaf branch, as research F96 notes, with union equality unchecked for it.
- No ROUTER.md map heading at all: leg 1a reports the missing anchor, as today.

### Error Scenarios
- `specs/` pruned, so route-gold is absent: check 3 keeps its existing `route-gold not found` line; the guide's keep-rule covers it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two scripts, two tests, a release, about 120 lines |
| Risk | 9/25 | A completion gate; pristine output must not move |
| Research | 4/20 | Verified in research runs V3 and V6 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
