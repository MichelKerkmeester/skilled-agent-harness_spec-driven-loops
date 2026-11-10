---
title: "Feature Specification: README freshness fixes"
description: "Apply the README fixes F1 to F23 from the README freshness research, and retire doctor check 13c, which demands that a hub README carry the SKILL.md version against the per-doc version rule."
trigger_phrases:
  - "readme freshness fixes"
  - "phase 24 readme freshness fixes"
  - "retire check 13c"
  - "hub readme version check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: README freshness fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/122-readme-freshness-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 24 |
| **Predecessor** | 023-readme-freshness-research |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the sk-code Ponytail refinement epic. Phase 023 listed 28 README fixes after v4.0.0.4 in `../023-readme-freshness-research/research/research.md` Section 11. The operator approved fixing all of them. For F24 to F28, the hub README version lines, the operator ruled that every doc carries its own version (`.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:28-30`), so those lines stay and the doctor check that contradicts the rule is retired instead.

**Scope Boundary**: The README lines F1 to F23 name, the same stale claim where it repeats in the same README, and doctor check 13c with its tests. No README restructure and no skill release.

**Dependencies**:
- `../023-readme-freshness-research/research/research.md` Sections 9 to 11.
- `devin` with model `deepseek-v4-1-flash-max` for every edit outside this folder.

**Deliverables**:
- The README wording fixes, one ledger row each in `implementation-summary.md`.
- Check 13c removed from `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, with its tests updated.
- A five-iteration `/deep:review :auto` run under `review/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README and eleven related docs still carry counts and setup lines from before v4.0.0.4: 12 agents where 11 exist, 39 commands where 37 exist, a ClickUp key requirement that no longer applies, and more. Separately, doctor check 13c fails or warns on five hubs because their README version differs from SKILL.md, while the per-doc version rule says a README carries its own version.

### Purpose
Every README line the research flagged states what the repository does today, and the doctor no longer reports a README version that follows the per-doc rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F1 to F23, each re-verified against the repository before its edit.
- The same stale claim repeated elsewhere in a README a row already edits, folded into that row.
- Retiring check 13c and its tests.

### Out of Scope
- The README `version:` lines F24 to F28 name: per the operator ruling they stay as they are.
- `skill-advisor.cjs list-tools --bogus-flag` printing "Unknown command": recorded as Remaining, not fixed.
- `.skilled/changelog/skilled/v4.0.0.4.md`: the orchestrator writes release notes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | F1 to F11 |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | F12 |
| `.skilled/scripts/git-hooks/README.md` | Modify | F13 |
| `.skilled/skills/cli-external-orchestration/README.md` | Modify | F14 |
| `.skilled/bin/README.md`, `.skilled/bin/lib/README.md` | Modify | F15 to F17 |
| `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md` | Modify | F18, F19 |
| `.skilled/skills/sk-git/README.md` | Modify | F20 |
| `.skilled/skills/sk-doc/README.md` | Modify | F21 |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` | Modify | F22 |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modify | F23 |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Remove check 13c |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Replace the two 13c tests with one that README drift is not reported |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every row F1 to F23 ends Fixed with a backticked command proof, or Rejected with a reason, in the `implementation-summary.md` ledger |
| REQ-002 | `parent-skill-check.cjs` prints no `13c-readme-version` line for system-spec-kit, system-skill-advisor, sk-git, sk-doc and system-deep-loop |
| REQ-003 | The doctor test suite for parent-skill-check passes, and a test fails if check 13c returns |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No `version:` line is edited by hand and no skill changelog entry is added |
| REQ-005 | A five-iteration `/deep:review :auto` runs on cli-devin with `deepseek-v4-1-flash-max`, and every confirmed P0 to P2 is fixed or rejected with a reason |
| REQ-006 | Every out-of-scope item found is a Remaining row |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Ledger format

- `| F<n> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| F<n> | Rejected | <the reason> |`
- `| RM-<n> | <item> | <why it stays> |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 23 F rows in the ledger, each Fixed or Rejected.
- **SC-002**: The five hubs print no 13c line, and the doctor tests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A research row is wrong | Med | Each claim is re-checked with a command before its edit, and the recount is recorded |
| Risk | A builder edits more than the brief names | Med | Each dispatch is diffed against HEAD and only the named lines may change |
| Dependency | `devin` and the model quota | High | Stop and report; no fallback executor |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The other version checks, 13a, 13b and 13d, report exactly what they reported before.
- **NFR-R02**: Diagram lines keep their box width after a count changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A count whose source disagrees with itself, such as the sk-git playbook's scenario total: the number is dropped and the settled count is kept.
- A count inside an ASCII diagram: padded so the box edge stays in its column.

### Error Scenarios
- A proposed fix that is itself wrong: rewritten to what the repository shows, with the reason in Key Decisions.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 13 docs, one check and its tests |
| Risk | 5/25 | Wording edits and a check removal |
| Research | 6/20 | Every count rerun |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
