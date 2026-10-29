---
title: "Feature Specification: Phase 16: align-sk-design"
description: "After the machine router moved from SKILL.md to ROUTER.md, sk-design playbooks, catalogs, READMEs and changelogs still pointed at SKILL.md for routing or cited sections that moved. This phase ran an operator-local alignment check over the skill, fixed the upheld findings that did not change routing, and recorded the reference-format debt that predates the move."
trigger_phrases:
  - "align sk design"
  - "phase 16 align sk design"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: align-sk-design

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
| **Phase** | 16 of 22 |
| **Predecessor** | 015-align-sk-code |
| **Successor** | 017-align-sk-doc |
| **Handoff Criteria** | Every upheld sk-design finding that does not change routing is fixed, each other item carries a written disposition, every recheck failure is classified, and the pre-existing reference-format debt is recorded as open. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files under `.skilled/skills/sk-design/` that changed since base `6a9946a800`, plus this spec folder. Routing data, such as `hub-router.json` weights and new intents or resources, stays unchanged.

**Dependencies**:
- The router move from phases 004 and 005, which put each sk-design router in a `ROUTER.md`.
- An operator-local alignment check, whose evidence sits in the run folder outside the checkout.
- The router-file resolver, used to prove that no skill routes differently.

**Deliverables**:
- The fix-lane and router-prose edits to the sk-design docs listed in section 3.
- One shared description for the sk-design-diagram catalog leaf and the root catalog.
- A disposition for each OUTSIDE item, a classification for each recheck failure, and an open record of the reference-format debt.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of the sk-design hub and its five packets moved from `SKILL.md` to `ROUTER.md`. Playbook scenarios, catalog entries, READMEs and changelogs still sent readers to `SKILL.md` for the router, cited old section numbers, or named sk-doc where sk-design now owns the work. The router pseudocode reference also failed its document format.

### Purpose
Every sk-design doc points at the file that now holds the router, with no change to what the skill routes to.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Captured by the operator-local alignment check. Full output in the run folder outside the checkout.
```text
$ first run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 39, of which 0 uncommitted or untracked
Findings: 46 (P0 0, P1 9, P2 37), 35 literal, 4 inferred, 16 outside the scope; 12 more overturned by the critic and not counted
Battery: {"pass":87,"fail":1,"not_applicable":3}
Probes: STATUS=FINDINGS run-probes: pass=0 fail=0 cannot_run=11

$ recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"fail":7,"pass":111,"not_applicable":3}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the sk-design files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes (code; skill docs; READMEs, changelogs and env; routing) and score the routing probes against the advisor.
- Fix each upheld finding that does not change routing, then fix the router prose the fix lane was barred from.
- Give the sk-design-diagram catalog leaf and the root catalog one description.
- Recheck the full battery against the worktree and classify each failure.

### Out of Scope
- The reference-format failures of the 30 sk-design-diagram type and import-export references - they fail at the base too; the parent spec sends the debt to `specs/sk-doc/074-reference-template-debt/`.
- Routing-data changes, such as `hub-router.json` weights and a new intent or resource - the packet decision is that no skill routes differently; these go to the routing follow-up recorded in the parent spec.

### Files to Change

All paths are under `.skilled/skills/sk-design/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `manual-testing-playbook/**`, `sk-design-chart/manual-testing-playbook/**`, `sk-design-diagram/manual-testing-playbook/**`, `sk-design-fundamentals/manual-testing-playbook/**`, `sk-design-md-generator/manual-testing-playbook/**` | Modify | Triage and anchor rows cite `ROUTER.md`; intent lists and greps corrected |
| `sk-design-diagram/references/foundations/router-pseudocode.md`, `references/foundations/README.md`, `references/types/*.md`, `references/import-export/*.md` | Modify | Overview section, SKILL_ROOT, LOAD_LEVELS, section citations |
| `sk-design-diagram/feature-catalog/**` | Modify | Handler split, five intents, one shared description with the root catalog |
| `sk-design-*/README.md`, `sk-design-diagram/scripts/README.md`, `sk-design-*/changelog/*` | Modify | ROUTER.md rows, renamed hub, claims corrected to what shipped |
| `command-metadata.json`, `sk-design-chart/SKILL.md` | Modify | Choreography loads the hub routing table; sk-doc no longer named |
| `ROUTER.md`, `sk-design-diagram/ROUTER.md`, `sk-design-fundamentals/ROUTER.md`, `sk-design-md-generator/ROUTER.md` | Modify | Router prose: outcome list, section references, ALWAYS row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No skill routes differently after the edits. | All 54 skill routers parse identically to HEAD through the router-file resolver. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each upheld finding is fixed or carries a written disposition, and each recheck failure is classified. | The evidence lists 38 FIXED lines, and each of the 7 OUTSIDE items and 7 recheck failures has a disposition or classification. |
| REQ-003 | The sk-design-diagram catalog leaf and the root catalog share one description. | `validate_catalog_package.py` reports 0 fail. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` passes on all five packets, `validate_document.py` reads 45 VALID of the 49 changed `.md` files with the 4 INVALID unchanged from the HEAD baseline, and the link check reports 0 broken markdown links.
- **SC-002**: The recheck battery reads `{"fail":7,"pass":111,"not_applicable":3}`, and each failure is derived or pre-existing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash review and fix workers | A weak finding could land as a wrong edit | A critic overturned 12 findings before the fix lane ran |
| Risk | The routing probes could not run, so routing gives no probe signal | Med | All 11 probes report `cannot_run`; the router-file resolver shows all 54 routers parse identically to HEAD |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the 30 sk-design-diagram type and import-export references be brought to the reference format? Answered: yes, in `specs/sk-doc/074-reference-template-debt/`, which renumbers each file and its section references with one script after this packet closes.
- Do E-03 and D-01 belong here? Decision: no; each needs routing data and is carried to the routing follow-up recorded in the parent spec.
<!-- /ANCHOR:questions -->

---

