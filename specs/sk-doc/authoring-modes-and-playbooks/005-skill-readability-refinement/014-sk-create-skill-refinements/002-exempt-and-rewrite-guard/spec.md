---
title: "Feature Specification: Phase 2: exempt-and-rewrite-guard"
description: "The exempt rule has three copies that disagree, nothing checks its doc keys, and code-pinned docs are unprotected. The 066 rewrite guards live only in a spec scratch folder. This phase ships one exempt loader with a pinned list and a doc rewrite guard wired into the update workflows."
trigger_phrases:
  - "exempt and rewrite guard"
  - "phase 2 exempt and rewrite guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 2: exempt-and-rewrite-guard

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Three code paths decide which docs skip validation, and none checks that a doc key exists or that its consumer names it. Docs whose strings code pins have no protection, and the guards that caught 237 rewrite findings in 066 sit in a spec scratch folder. This phase ships one exempt loader with a separate pinned list, and `shared/scripts/doc-rewrite-guard.py`, which flags the replayed 066 FIX diff and runs as a step in the Update Workflow and creation-workflow.

**Key Decisions**: Pinned docs keep their render checks and are only protected from rewrites (operator decision, 2026-11-05), the guard is one script with hard and advisory checks (ADR-001)

**Critical Dependencies**: Phase 001 must land first, since the loader and guard read its ledger shape and check names.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-render-checks-and-gate |
| **Successor** | 003-templates-and-fleet |
| **Handoff Criteria** | One loader serves every caller, the pinned list is filled and the guard flags the replayed 066 FIX diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates specification.

**Scope Boundary**: The exempt loader, the pinned list, the rewrite guard, their tests and the two workflow docs that gain a guard step. No fleet doc is rewritten here.

**Dependencies**:
- Phase 001 checks and ledger shape.
- The seven 066 scratch tools in `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/`.

**Deliverables**:
- One exempt loader in `.skilled/skills/sk-doc/shared/scripts/` used by the validator, packaging and the 066 scope gate.
- A `pinned` list in the ledger, filled from `check-rule-copies.js`, and an advisory pinned scan.
- `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` with tests and a replay fixture.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The exempt rule has three copies: `validate_document.py:186-195` and `:253-258` skip all validation with no consumer, `package_skill.py:886-921` skips render only, and the 066 `scope-gate.py` re-implements it. The validator CLI ignores the map, so `deep-research-dashboard.md` still reports `render_h2_numbering` while `rubric.md:3` tells reviewers to drive render warnings to zero. Doc keys are never checked, and `sk-code/sk-code-review/scripts/check-rule-copies.js:55-118` pins strings in two unlisted docs. The 066 review found 237 rewrite findings, and the guards that catch them exist only in a spec scratch folder.

### Purpose
One loader decides exemptions and fails on a bad entry, pinned docs are protected from rewrites, and every doc refinement runs one shipped guard that blocks dropped code, frontmatter, citations and cited sections.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 186,195p .skilled/skills/sk-doc/shared/scripts/validate_document.py
# The DESIGN.md format spec and its sample outputs. Their section numbers are the
# format's own section ids, which the generator and its references cite, so
# renumbering them to this validator's conventions would break the format.
# Matched by path suffix, so a sibling such as writing-notes.md is still validated.
FORMAT_SPEC_FILES = [
    'sk-design-md-generator/references/design-md-format.md',
    'sk-design-md-generator/references/examples/linear/DESIGN.md',
    ...

$ grep -n "def load_render_exempt" .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py
886:def load_render_exempt() -> Dict[str, str]:

$ python3 -c "import json;d=json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'));print(list(d.keys()), len(d['exempt']))"
['description', 'debt', 'exempt'] 6

$ ls .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py
ls: .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py: No such file or directory

$ head -1 specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/013-system-spec-kit/scratch/review-1.md
VERDICT: FIX
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write one exempt loader in `shared/scripts/` and move the validator, packaging and the 066 scope gate onto it (item 5).
- Label exempt findings with their consumer in the validator CLI (item 5).
- Fail on a missing doc key or a consumer that does not contain the doc's name (item 5).
- Add a `pinned` list, separate from the exempt map, and an advisory pinned scan (item 5, operator decision).
- Ship `doc-rewrite-guard.py` from the 066 scratch tools and add its step to the Update Workflow and creation-workflow (item 6).

### Out of Scope
- Running the guard over the fleet - phase 003 uses it for every fleet commit.
- New render checks - phase 001 owns them.
- Deleting the 066 scratch tools - they are the spec folder's history, and the shipped guard stands apart from them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/render_exempt.py` | Create | One exempt and pinned loader. Final name must pass `check_no_new_snake_case.py` |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Use the loader, label exempt findings with their consumer |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | Replace `load_render_exempt` with the shared loader |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` | Modify | Add the `pinned` list |
| `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` | Create | Rewrite guard with hard and advisory checks |
| `.skilled/skills/sk-doc/scripts/tests/test_*.py` | Create | Loader and guard tests, replay fixture |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` | Modify | Guard step in the Update Workflow |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | Guard step for refining existing docs |
| `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py` | Modify | Call the shared loader in place of its copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Item 5. One loader in `shared/scripts/` reads the exempt map, and `validate_document.py`, `package_skill.py` and `scope-gate.py` all call it. Evidence: three copies at `validate_document.py:186-195` and `:253-258`, `package_skill.py:886-921` and the 066 `scope-gate.py` |
| REQ-002 | Item 5. The loader fails when an exempt doc key names no file, or when the consumer file does not contain the doc's name. Evidence: doc keys are never checked, and a consumer only has to exist |
| REQ-003 | Item 5, operator decision. A `pinned` list, separate from the exempt map, lists docs whose strings code pins. Render checks still run on them, and the rewrite guard refuses to touch them. It starts with `sk-code/shared/references/universal/code-quality-standards.md` and `sk-code/sk-code-review/references/review-core.md`, pinned by `check-rule-copies.js:55-118` |
| REQ-004 | Item 6. `shared/scripts/doc-rewrite-guard.py --base <ref> <paths>` hard-fails when frontmatter changes beyond `version`, a fenced block is not byte-identical, a citation is dropped, a cited H2 number or anchor is gone, or an exempt or pinned doc is touched. Lost lines and intro diffs are advisory. Evidence: 237 review findings, dropped content about 87, changed code blocks 47, cited section numbers 37, intros 29, frontmatter 18 |
| REQ-005 | Item 6. Replaying one 066 FIX diff makes the guard report it. The fixture is `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/013-system-spec-kit/scratch/diff-1.patch`, whose `review-1.md` opens with `VERDICT: FIX` and names a rewritten line in `system-spec-kit/shared/parsing/README.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Item 5. The validator CLI labels an exempt doc's findings with the consumer that exempts it, so `deep-research-dashboard.md` shows why `render_h2_numbering` is excused. Evidence: `rubric.md:3` asks reviewers to drive render warnings to zero while the CLI ignores the map |
| REQ-007 | Item 5. An advisory pinned scan lists `.md` paths that code reads through `readFileSync`, `open` or `read_text` with a literal path, and reports any not on the pinned list. Evidence: a naive path-mention scan gave 75 hits, mostly pointers. Whether read calls suffice is inferred |
| REQ-008 | Item 6. The Update Workflow in `examples-and-maintenance.md:166-174` and creation-workflow gain a "refine existing docs" step that runs the guard before commit |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "FORMAT_SPEC_FILES|def load_render_exempt" .skilled/skills/sk-doc` prints no live copy of the exempt rule outside the shared loader.
- **SC-002**: A ledger copy with a bad doc key makes the loader exit non-zero and name the key.
- **SC-003**: The guard on the replayed 066 FIX diff reports the `shared/parsing/README.md` change, and on an unchanged tree it prints no finding and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 ledger shape and check names | The loader and guard read them | Start only after phase 001 commits, per the parent handoff table |
| Risk | Moving the DESIGN.md and style-reference skips into the map changes which docs validate | High | Run the 13-skill strict loop and the sk-design tests before and after, and compare outputs |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The guard on one skill's diff finishes in under 30 seconds.

### Security
- **NFR-S01**: The guard reads git objects and working-tree files only. It never writes outside its temp dir.

### Reliability
- **NFR-R01**: The guard on an unchanged tree reports 0 hard findings.

---

## 8. EDGE CASES

- Empty input: no paths given makes the guard check every changed `.md` path since `--base`.
- Maximum input: a whole-skill diff such as the 56-file `diff-1.patch` runs in one call.
- Failure path: a hard finding exits 1 and names the file, the rule and the line, and a bad `--base` exits 2 with usage.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: about 9, LOC: about 700, Systems: validator, packager, guard |
| Risk | 13/25 | Auth: N, API: N, Breaking: Y for which docs validate |
| Research | 8/20 | Port seven scratch tools and confirm the read-call scan |
| Multi-Agent | 5/15 | Workstreams: 2, loader and guard |
| Coordination | 9/15 | Dependencies: phase 001 before, phase 003 after |
| **Total** | **51/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The read-call scan misses a pinned doc read through a variable path | M | M | Keep it advisory and fill the list by hand from the known consumers |
| R-002 | The guard's citation check flags renumbered sections that were updated everywhere | M | M | Treat a citation as kept when every inbound reference moved with the section |
| R-003 | `scope-gate.py` behaves differently once it uses the shared loader | L | M | Rerun it on one finished 066 leaf and compare the `render_warnings` line |

---

## 11. USER STORIES

### US-001: Safe doc refinement (Priority: P0)

**As a** maintainer refining existing docs, **I want** one guard to block dropped code, frontmatter, citations and pinned docs, **so that** a readability pass never changes a claim.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Trustworthy exemptions (Priority: P1)

**As a** reviewer, **I want** every exempt finding labeled with the consumer that excuses it, **so that** I know which warnings to leave.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does keying the pinned scan on read calls catch every pinned doc? The review marks this as inferred. T002 measures it against `check-rule-copies.js`.
- Does `diff-1.patch` apply cleanly to the parent of commit `f4a7b163a8`? T001 checks with `git apply --check` before the fixture is frozen.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Review report**: See `../scratch/review-report.md`

---
