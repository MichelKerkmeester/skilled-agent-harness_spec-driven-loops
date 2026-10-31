---
title: "Feature Specification: Phase 17: align-sk-doc"
description: "After the machine router moved from SKILL.md to ROUTER.md, sk-doc playbooks, catalogs, templates and READMEs still pointed at SKILL.md for routing, and validate_document.py had no type for a ROUTER.md file. This phase ran an operator-local alignment check over the skill, fixed the upheld findings that did not change routing, and added a skill_router document type."
trigger_phrases:
  - "align sk doc"
  - "phase 17 align sk doc"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: align-sk-doc

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
| **Phase** | 17 of 22 |
| **Predecessor** | 016-align-sk-design |
| **Successor** | 018-align-sk-git |
| **Handoff Criteria** | Every upheld sk-doc finding that does not change routing is fixed, each other item carries a written disposition, every recheck failure is classified, and validate_document.py checks a ROUTER.md as a skill_router document. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files under `.skilled/skills/sk-doc/` that changed since base `6a9946a800`, the repository `.env.example`, and this spec folder. Routing data stays unchanged.

**Dependencies**:
- The router move from phases 004 and 005, which put each sk-doc router in a `ROUTER.md`.
- An operator-local alignment check, whose evidence sits in the run folder outside the checkout.
- The router-file resolver, used to prove that no skill routes differently.

**Deliverables**:
- The fix-lane and router-prose edits to the sk-doc docs listed in section 3.
- A `skill_router` document type in `validate_document.py`, with rules in `template-rules.json` and two tests.
- `.env.example` rows for `ROUTING_SHAPE_DEBT_FILE` and `ROUTING_SHAPE_SKILLS_ROOT`.
- A disposition for each OUTSIDE item and a classification for each recheck failure.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of the sk-doc hub and its packets moved from `SKILL.md` to `ROUTER.md`. Playbook scenarios, catalog entries, skill templates and READMEs still credited `SKILL.md` with the router, and the lockstep surfaces file pointed hub entries at the old place. `validate_document.py` had no document type for a `ROUTER.md`, and `.env.example` did not list two routing-shape overrides the code reads.

### Purpose
Every sk-doc doc points at the file that now holds the router, and a `ROUTER.md` validates as its own document type, with no change to what the skill routes to.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Captured by the operator-local alignment check, plus one local test run. Full check output in the run folder outside the checkout.
```text
$ first run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 100, of which 0 uncommitted or untracked
Findings: 24 (P0 0, P1 3, P2 21), 5 literal, 0 inferred, 13 outside the scope; 11 more overturned by the critic and not counted
Battery: {"pass":156,"not_applicable":4,"fail":1}
Probes: STATUS=FINDINGS run-probes: pass=17 fail=1 cannot_run=0

$ recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":190,"not_applicable":4,"fail":6}

$ /usr/bin/python3 .skilled/skills/sk-doc/scripts/tests/test_validator.py
SUMMARY: 15/15 tests passed
ALL TESTS PASSED
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the sk-doc files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes (code; skill docs; READMEs, changelogs and env; routing) and score the routing probes against the advisor.
- Fix each upheld finding that does not change routing, then fix the router prose the fix lane was barred from.
- Add a `skill_router` document type for a file named `ROUTER.md`, and list two routing-shape overrides in `.env.example`.
- Recheck the full battery against the worktree and classify each failure.

### Out of Scope
- The changelog sentence behind S2-2 - the fix lane was barred from editing it, so only the anchor table changed.
- Routing-data changes - the packet decision is that no skill routes differently; such items go to the routing follow-up recorded in the parent spec.

### Files to Change

All paths are under `.skilled/skills/sk-doc/` unless they start with `.env`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/validate_document.py`, `shared/assets/template-rules.json`, `scripts/tests/test_validator.py` | Modify | New `skill_router` type, its rules and two tests |
| `sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json` | Modify | Five hub entries point at each hub's ROUTER.md |
| `ROUTER.md`, `sk-create-command/ROUTER.md`, `sk-create-goal/ROUTER.md` | Modify | Overview lists all 15 registry modes; flowchart and chart sent to sk-design; descriptions name what each file holds |
| `manual-testing-playbook/**`, `sk-create-benchmark/manual-testing-playbook/**`, `sk-create-frontmatter/manual-testing-playbook/**` | Modify | Triage lines, intent lists and anchors cite ROUTER.md |
| `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` and the root catalog | Modify | Gold row counts and the contract validator description |
| `README.md`, `sk-create-*/README.md`, `sk-create-skill/scripts/README.md`, `sk-create-skill/assets/skill/*.md`, `sk-create-agent/SKILL.md` | Modify | ROUTER.md rows, the router canon, the script inventory, templates |
| `.env.example` | Modify | Lists `ROUTING_SHAPE_DEBT_FILE` and `ROUTING_SHAPE_SKILLS_ROOT` |
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
| REQ-002 | Each upheld finding is fixed or carries a written disposition, and each recheck failure is classified. | The evidence lists 23 FIXED lines, and the 2 OUTSIDE items and 6 recheck failures each have a disposition or classification. |
| REQ-003 | `validate_document.py` checks a file named `ROUTER.md` as a `skill_router` document. | `test_validator.py` prints `SUMMARY: 15/15 tests passed`, with two tests for the new type. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` passes on the hub and nine packets, `validate_document.py` reports 0 issues on the 54 changed files with 5 keeping a pre-existing `document_type_fallback` warning, and the link check reports 0 broken markdown links.
- **SC-002**: The recheck battery reads `{"pass":190,"not_applicable":4,"fail":6}`, and each failure is derived, by design, fixed after the recheck or a tool artifact.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash review and fix workers | A weak finding could land as a wrong edit | A critic overturned 11 findings before the fix lane ran |
| Risk | The new `skill_router` type fails ROUTER.md files that passed before | Med | Two tests cover it, including a negative fixture the recheck reports as a by-design fail; `test_validator.py` passes 15/15 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the S13-env-tokens recheck failure real? Decision: no; the check reads the main checkout template, and against the worktree template it reports `unlisted=0`.
- None else blocks.
<!-- /ANCHOR:questions -->

---

