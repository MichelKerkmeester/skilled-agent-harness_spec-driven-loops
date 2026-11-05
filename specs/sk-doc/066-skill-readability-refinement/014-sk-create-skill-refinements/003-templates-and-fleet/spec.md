---
title: "Feature Specification: Phase 3: templates-and-fleet"
description: "The sk-create-skill templates break the skeletons phase 001 now checks, skill READMEs open with AT A GLANCE against the OVERVIEW rule, SKILL.md has two REFERENCES sections and three size rules. This phase fixes the templates, turns on README render checks and clears every new finding across the fleet, form only."
trigger_phrases:
  - "templates and fleet"
  - "phase 3 templates and fleet"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 3: templates-and-fleet

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The templates authors copy from contradict the checks phase 001 adds, so every new skill starts with findings. This phase restructures the reference and asset OVERVIEW, fixes the intro wording, makes skill READMEs open with OVERVIEW and turns on README render checks, keeps one REFERENCES section and one SKILL.md size table, then clears every finding the new checks raise across `.skilled/skills` with every claim kept. It closes when both staged sets from phase 001 are empty, so every render code is enforced, the ledger's `debt` is still `{}`, and all 13 skills pass `package_skill.py --check --strict`.

**Key Decisions**: Skill READMEs open with OVERVIEW (operator decision, 2026-11-05), every fleet commit passes the phase 002 rewrite guard (ADR-001)

**Critical Dependencies**: Phase 001 checks and staged sets, phase 002 rewrite guard and pinned list.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-exempt-and-rewrite-guard |
| **Successor** | None |
| **Handoff Criteria** | Both staged sets are empty, the ledger `debt` is `{}`, all 13 skills pass strict and every fleet commit passed the rewrite guard |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates specification.

**Scope Boundary**: sk-create-skill and sk-create-readme templates, the README rules and inventory check, the SKILL.md size table, and form-only fixes to fleet docs the phase 001 checks flag. No claim in any doc changes.

**Dependencies**:
- Phase 001: the new checks, `RENDER_STAGED_CODES`, `RENDER_STAGED_SCOPES` and the `RENDER_STAGED_OFF=1` switch in `package_skill.py`.
- Phase 002: `doc-rewrite-guard.py` and the `pinned` list.

**Deliverables**:
- Reference and asset templates whose OVERVIEW and intro guidance pass the new checks.
- Skill and parent-skill README templates and the fleet's skill and mode READMEs opening with OVERVIEW, with README render checks on.
- One REFERENCES section and one SKILL.md size table.
- Empty `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES`, so every render code is enforced, with the ledger `debt` still `{}`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`skill-reference-template.md:20-36` and `skill-asset-template.md:18-20` break their own OVERVIEW skeleton, and their intro guidance says `description: [One-line description - same as intro]` and calls the intro a summary. `template-rules.json` wants README OVERVIEW first, but `skill-readme-template.md:183` and `parent-skill-readme-template.md:148` open with AT A GLANCE, which gave 52 `render_section_order` hits on 54 READMEs in a dry run. `skill-md-template.md` carries `\## 5. REFERENCES` at line 314 and `\## 8. REFERENCES AND RELATED RESOURCES` at line 400, and four places state different SKILL.md size limits. Phase 001 keeps every finding of the new checks and the newly scanned scopes advisory through its staged sets, and nothing clears them yet.

### Purpose
Templates pass their own checks, README render checks are on, and every finding the new checks raise across `.skilled/skills` is fixed in form only, so the staged sets empty and every render code is enforced.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "^## 1\. AT A GLANCE" .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md
.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:21:## 1. AT A GLANCE
.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md:148:## 1. AT A GLANCE
.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md:183:## 1. AT A GLANCE

$ grep -n '^\\## [0-9]*\. REFERENCES' .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md
314:\## 5. REFERENCES
400:\## 8. REFERENCES AND RELATED RESOURCES

$ grep -n "^## [0-9]*\. " .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md
14:## 1. WHEN TO USE
33:## 2. SMART ROUTING
53:## 3. HOW IT WORKS
72:## 4. RULES
94:## 5. REFERENCES
110:## 6. SUCCESS CRITERIA
120:## 7. INTEGRATION POINTS

$ sed -n 103p .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py
MAX_SKILL_MD_LINES = 3000
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure the reference and asset template OVERVIEW to Purpose then When to Use, and Purpose then Usage (item 1, template part).
- Fix the intro wording in both templates: description and intro differ, no "summary", a list of bad pointer phrases (item 8, template part).
- Make skill and parent-skill README templates and the fleet's skill and mode READMEs open with OVERVIEW, then turn on README render checks and extend the inventory check (item 9).
- Keep one REFERENCES section, last, with one name in the template, the scaffold and the rules (item 10).
- Keep one SKILL.md size table that matches the script constants (item 12).
- Clear every finding the phase 001 checks raise across `.skilled/skills`, form only, with each commit passing the rewrite guard.

### Out of Scope
- New checks - phase 001 owns them.
- Claim changes in any fleet doc - the 066 parent goal D2 keeps this program form only.
- Pinned docs - a pinned doc with a finding goes to the operator, since the rewrite guard refuses changes to it.
- Changelogs, playbooks, feature catalogs, benchmarks and tests as rewrite targets, per the 066 parent goal D2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | Modify | OVERVIEW subsections and intro wording |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` | Modify | OVERVIEW subsections and intro wording |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` | Modify | OVERVIEW first |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | Modify | OVERVIEW first |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modify | One REFERENCES section, one size table |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | Modify | REFERENCES last, same name |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | Size rule points at the one table |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modify | `renderChecks` true for readme, one REFERENCES name |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Inventory check covers WHAT IS IN THE PACKAGE and structure trees |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | Add `README.md` to `RENDER_SCAN_SCOPES` for item 9, then empty `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES` |
| Fleet docs under `.skilled/skills/` | Modify | Form-only fixes for each finding, count measured in T001 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Item 1, template part. The reference template OVERVIEW is Purpose then When to Use, the asset template OVERVIEW is Purpose then Usage, and both templates validate with 0 findings. Evidence: `skill-reference-template.md:20-36` and `skill-asset-template.md:18-20` break their own skeleton yet validate at 0 |
| REQ-002 | Item 9. `skill-readme-template.md` and `parent-skill-readme-template.md` open with OVERVIEW, and so do the fleet's skill and mode READMEs. Evidence: `template-rules.json` readme `firstSectionName` is `overview`, the two templates open with AT A GLANCE at lines 183 and 148, and a dry run with renderChecks on gave 52 `render_section_order` hits on 54 READMEs. Operator decision: OVERVIEW |
| REQ-003 | Every staged finding across `.skilled/skills`, listed per skill with `RENDER_STAGED_OFF=1`, is fixed in form only, and each skill commit passes `doc-rewrite-guard.py` with no hard finding. The last task empties `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES`, and the ledger `debt` stays `{}` throughout |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Item 8, template part. Both templates say description and intro differ, drop "summary", and list the bad pointer phrases. Evidence: `skill-reference-template.md:77` and `skill-asset-template.md:134` say `description: [One-line description - same as intro]`, the intro is called a hook or summary at `:89` and asset `:146`, about 23 findings flag an intro repeating its description |
| REQ-005 | Item 9. `renderChecks` is true for readme in `template-rules.json`, `README.md` joins `RENDER_SCAN_SCOPES` so packaging reads it (its scope is already in `RENDER_STAGED_SCOPES`), and `_code_folder_has_flat_inventory` (`validate_document.py:1648-1662`) also covers WHAT IS IN THE PACKAGE and structure trees. Evidence: r8 had 59 README findings, and `_render_findings` reads only `references/` and `assets/` |
| REQ-006 | Item 10. One REFERENCES section, last, with the same name in `skill-md-template.md`, `skill-scaffold-template.md` and the rules. Evidence: `skill-md-template.md:314` and `:400` carry two, the scaffold stops at `## 7. INTEGRATION POINTS`, and the fleet's last H2 splits 27, 10 and 9 |
| REQ-007 | Item 12. One SKILL.md size table matches the `package_skill.py` constants, and the other size statements point at it. Evidence: `skill-md-template.md:41` says under 1000 lines, `:425` says 800 to 1000, `:981` gives three bands, `creation-workflow.md:436` says 800 words, `package_skill.py:103` says 3000 lines, and the largest fleet SKILL.md has 529 lines |
| REQ-008 | Each of the 80 references without `### Purpose` is either fixed or recorded as frozen by an inbound reference, answering the review's open question |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -c "import sys;sys.path.insert(0,'.skilled/skills/sk-doc/sk-create-skill/scripts');import package_skill as p;print(p.RENDER_STAGED_CODES,p.RENDER_STAGED_SCOPES)"` prints `() ()`, and `python3 -c "import json;print(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['debt'])"` prints `{}`.
- **SC-002**: The 13-skill strict loop exits 0 for every skill with README render checks on.
- **SC-003**: `grep -cE '^\\?## [0-9]+\. REFERENCES' .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` prints `2`, one REFERENCES section in the template skeleton and the file's own closing section. Today it prints `3`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 rewrite guard | Fleet edits run unguarded | Start the fleet tasks only after phase 002 commits |
| Risk | Moving README sections breaks inbound section citations | High | The guard hard-fails on a cited H2 number or anchor that is gone, and every inbound reference moves with the section |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The phase changes docs and one check, and the CI sweep timing is phase 001's.

### Security
- **NFR-S01**: N/A. No code path reads credentials or user input.

### Reliability
- **NFR-R01**: The ratchet from phase 001 passes after every commit, so the staged sets only shrink and `debt` stays `{}`.

---

## 8. EDGE CASES

- Empty input: a skill with no finding gets no commit.
- Maximum input: the full fleet of 13 skills, about 8,175 docs scanned, one commit per skill.
- Failure path: a guard hard finding stops that skill's commit until the change is undone or the operator approves it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: templates plus fleet docs across 13 skills, Systems: templates, rules, fleet |
| Risk | 14/25 | Auth: N, API: N, Breaking: Y for cited section numbers |
| Research | 6/20 | Answer the 80 missing-Purpose question per doc |
| Multi-Agent | 10/15 | Workstreams: one per skill |
| Coordination | 10/15 | Dependencies: phases 001 and 002 |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An executor drops a claim while restructuring | H | M | The guard's advisory lost-lines output is read by the orchestrator for every skill, and the opus-medium review checks claims |
| R-002 | A pinned doc carries a finding the guard will not let anyone fix | M | M | Escalate to the operator with the doc, the finding and the consumer |
| R-003 | Renaming the last SKILL.md H2 breaks the router or advisor reading it | M | L | Run the compiled-route suite after each skill commit |

---

## 11. USER STORIES

### US-001: Templates that pass their own checks (Priority: P0)

**As a** skill author, **I want** a fresh copy of each template to validate clean, **so that** a new skill starts with no findings.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Every render code enforced (Priority: P1)

**As a** maintainer, **I want** the staged sets to reach empty, **so that** any finding from now on is new and blocks.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Are the 80 references without `### Purpose` deliberate, frozen by inbound references, or missed? REQ-008 answers it per doc.
- How is a pinned doc with a render finding fixed? It goes to the operator, since the guard refuses the change.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Review report**: See `../scratch/review-report.md`

---
