---
title: "Feature Specification: External user guide"
description: "R4 and R9: the README adaptation block becomes the single external-user guide for removing the example sk-code surfaces and adding one's own, OpenCode is marked native and Webflow and Obsidian optional examples in the canonical sentence and inventories, and the next Skilled release note states the rule."
trigger_phrases:
  - "external user guide"
  - "phase 5 external user guide"
  - "what adapting sk-code looks like"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: External user guide

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-13 |
| **Branch** | A worktree from origin/main once 001 to 004 are on it, created as `goal.md` says |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-router-version-parity |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the external surface priority build. It builds research recommendations R4 and R9, phase P11 of `../../025-external-surface-priority-research/research/research.md` section 14.1. R9 absorbed R3's removal checklist, corrected by findings F84 to F86, F89, F90 and F93, and its acceptance run needs the behavior phases 001, 002 and 003 ship.

**Scope Boundary**: The README adaptation block (`README.md:1445-1452`), the R4 lines (`README.md:800`, `:1384`, `.skilled/skills/sk-code/SKILL.md:40`, `.skilled/skills/sk-code/README.md:23`, `:55-57`, `:90`) and one new Skilled release note.

**Dependencies**:
- Phases 001 to 004 finished and on origin/main; this phase starts from there.

**Deliverables**:
- The guide, the example markers and the release note.
- No skill release: prose only, and a `SKILL.md` edit without a release is allowed because the commit gate never raises `SKILL.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The first thing a user reads, `README.md:800`, presents three equal surfaces, and the adaptation block (`README.md:1384`, `:1447`) tells them to replace all three, the native OpenCode packet included, with paths that do not name where the packets nest (F28, F75, F77). Its steps stop short of a green doctor (F84): they omit the registry keys, the leaf manifest, the re-mint and its authored copies, the emptied ROUTER.md keys and the dead links. `SKILL.md:40`, the sentence every sk-code doc defers to, lists the three surfaces with no native or example role (F27).

### Purpose
A user who reads only the README adaptation block can remove the two examples, add a surface of their own ahead of OpenCode and reach a green doctor, guard, sync and drift battery, and every canonical inventory says which surface is native.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **R4.** `SKILL.md:40`, `README.md:800` and `:1384`, and the sk-code README rows `:23`, `:55-57` and `:90` mark OpenCode as the native surface and Webflow and Obsidian as optional examples, using the words `native` and `optional example`.
- **R9.** The block under the heading "What Adapting `sk-code` Looks Like", whose heading stays because phase 002's 3c line names it, becomes the guide. It carries the six parts of research section 14.1:
  1. OpenCode is native and stays; Webflow and Obsidian are optional examples at `.skilled/skills/sk-code/sk-code-webflow/` and `.skilled/skills/sk-code/sk-code-obsidian/`.
  2. Run `bash .skilled/scripts/install-git-hooks.sh` first; without hooks, run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` and copy the runtime manifest over its authored twin.
  3. When pruning, keep `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` and `.opencode/skills`.
  4. Removal: delete the packet; drop the mode from `mode-registry.json` (its `modes` entry and `extensions.surface-axis.surfaces`) and from `hub-router.json` (`tieBreak`, `routerSignals`, its two vocabulary classes); run `generate-leaf-manifest.cjs --write .skilled/skills/sk-code`; remove its paths from ROUTER.md section 11 `RESOURCE_MAP`, which is hand-maintained, drop any key left empty from both `RESOURCE_MAP` and `INTENT_SIGNALS`, and trim the matching prose map rows; update the `SKILL.md` table and `shared/references/stack-detection.md`; fix the dead links `verify-doc-claims.cjs` lists; delete or adjust the example-bound files (the cross-stack and surface-detection playbook scenarios, sk-code-quality's Obsidian and Webflow checklist pointers, the surface-hint test, canary cases that name the mode); run `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write`; commit.
  5. Add: run `/create:skill-parent update --surfaces <name>`, which places it ahead of OpenCode; link the three `shared/references/workflow-*.md` files into its `references/`; add its ROUTER.md map rows and stack-detection markers; add a canary case and copy the fixture to its authored twin; commit.
  6. Verify with parent-skill-check, `ci-skill-root-metadata.cjs`, the compiled-route guard, sync `--check`, `run-all-drift-guards.sh` and one route prompt.
- **Release note.** The next Skilled note under `.skilled/changelog/skilled/`: `v4.0.0.5.md`, unless a note newer than v4.0.0.4 already exists on origin/main, in which case that note. It states R4's rule and the user-visible changes 001 to 004 shipped. v4.0.0.4 is not edited.

### Out of Scope
- A standalone guide or manual (F82) and a removal command (X11).
- The playbook and sk-code-quality example-bound files themselves; the guide names them and the user changes them.
- Any change to the operator's shipped surfaces or order.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | `:800` and `:1384` markers; `:1445-1452` guide |
| `.skilled/skills/sk-code/SKILL.md` | Modify | `:40` canonical sentence |
| `.skilled/skills/sk-code/README.md` | Modify | `:23`, `:55-57`, `:90` |
| `.skilled/changelog/skilled/v4.0.0.5.md`, or the newer note that exists | Create or Modify | Release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each R4 line marks OpenCode native and the examples optional, and no line tells the user to replace OpenCode |
| REQ-002 | A fresh agent that reads only the adaptation block removes both examples and adds a stand-in surface in a fresh full-tree copy, after which the doctor, `ci-skill-root-metadata.cjs`, the guard, sync `--check` and `run-all-drift-guards.sh` exit 0 |
| REQ-003 | In that copy, the tie prompt routes `[sk-code-acme, sk-code-opencode]` |
| REQ-004 | The block names the nested path, the hooks, the keep-rule with `.opencode/skills`, the add command, `RESOURCE_MAP` and `INTENT_SIGNALS`, and the drift wrapper |
| REQ-005 | The newest Skilled note is newer than v4.0.0.4, states the rule, names the `ROUTER.md` version change and passes `validate_document.py`; v4.0.0.4 is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The phase's base carries all four earlier phases and its live gates exit 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Acceptance Ledger (6 rows)

The builder records each row in `implementation-summary.md` as `| P11-<n> | Pass | <backticked command and what it printed> |`.

| ID | Check |
|----|-------|
| P11-1 | Copy, after the agent's removal: the doctor, CI metadata check, guard, sync `--check` and drift wrapper exit 0 |
| P11-2 | Copy, after the agent adds `sk-code-acme`: the same five exit 0 |
| P11-3 | Copy: the tie prompt routes `[sk-code-acme, sk-code-opencode]` |
| P11-4 | The agent's prompt held only the adaptation block, recorded with the dispatch command |
| P11-5 | Worktree: each R4 line read and quoted |
| P11-6 | Worktree: `run-all-drift-guards.sh` exits 0 and `validate_document.py` passes on every touched doc |

Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table in the same file.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guide alone takes a fresh agent from the shipped tree to a green battery with the examples removed and its own surface leading a tie.
- **SC-002**: No canonical inventory presents the examples as peers of the native surface.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The end-to-end agent reads more than the block | High | P11-4 records the exact prompt; the copy holds only the tree |
| Risk | The heading changes and the 3c pointer from 002 dangles | Med | The heading stays word for word |
| Risk | A merge conflict between the four branches | Med | Merge in number order and resolve with both sides' intent, recording each in the log |
| Dependency | 001 to 004 finished | High | This phase starts only when their goal criteria pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The operator's live tree stays green on every gate.
- **NFR-R02**: Every command the guide names exists at the path it gives.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A user who keeps one example: the removal steps apply per surface.
- A user without hooks: the guide's manual refresh and copy path.

### Error Scenarios
- A user who already pruned `specs/`: phase 002's sync and guard lines name the folder to restore, and the guide's keep-rule says the same.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three docs and a release note, about 150 lines |
| Risk | 8/25 | The first doc an external user reads |
| Research | 6/20 | The recipe was verified in research run V3 |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The release-note version is decided in `goal.md`; the operator may renumber it at release.
<!-- /ANCHOR:questions -->
