---
title: "Feature Specification: Phase 13: mcp-tooling-routing-canon"
description: "The mcp-tooling hub was the one SKILL.md left without a final MACHINE ROUTER section, and the routing-shape check let it pass. This phase moves the hub to the canon and adds code RS-005 so a missing section fails --strict."
trigger_phrases:
  - "mcp tooling routing canon"
  - "phase 13 mcp tooling routing canon"
  - "routing shape rs-005"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: mcp-tooling-routing-canon

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/268-mcp-tooling-routing-canon` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-alignment-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every SKILL.md under `.skilled/skills` ends with a `## MACHINE ROUTER` section, and `--strict` fails one that does not |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the skill routing and clarity program. Phase 008 left the `mcp-tooling` hub in the older shape and recorded it as known limitation 3. The operator asked for every skill to carry the new router setup.

**Scope Boundary**: the `mcp-tooling` hub SKILL.md, the two routing-shape checks, their tests and the canon docs that list the codes.

**Dependencies**:
- Phase 003's routing-shape check and its empty known-debt ledger.

**Deliverables**:
- The hub SKILL.md in the canon shape.
- Code RS-005 in `package_skill.py` and `parent-skill-check.cjs`, with tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
53 of the 54 SKILL.md files end with a `## MACHINE ROUTER` section. The `mcp-tooling` hub keeps its compiled-routing directive inside SMART ROUTING and has no such section, yet `package_skill.py --strict` passes it, because the check measures length and block placement and never requires the section.

### Purpose
Every SKILL.md ends with a MACHINE ROUTER section, and the check fails one that does not.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on `origin/main` before this phase:
```text
$ grep -c "MACHINE ROUTER" .skilled/skills/mcp-tooling/SKILL.md
0
$ python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/mcp-tooling --check --strict | tail -1
Result: PASS
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the `mcp-tooling` hub SKILL.md to the canon: short SMART ROUTING prose and a final `## 6. MACHINE ROUTER` section.
- Add code RS-005 to both routing-shape checks, so a SKILL.md with no MACHINE ROUTER section fails `--strict`.
- Update the tests and fixtures that build a clean skill, and add one RS-005 case per suite.
- Update the canon docs and `/create:skill` workflow steps that list the codes.
- Bump versions and write changelogs for mcp-tooling, sk-create-skill and the sk-doc hub.

### Out of Scope
- Moving MACHINE ROUTER content out of SKILL.md into a separate file - a canon change the operator raised during this phase; it needs its own decision.
- Changing any routing behavior - the hub's mode selection and leaf sets stay as they are.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-tooling/SKILL.md` | Modify | Canon shape, sections renumbered |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | RS-005 |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | RS-005 in check 12b |
| `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py` | Modify | RS-005 case, fixtures keep the appendix |
| `.skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modify | Clean fixture ends with the section |
| `.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` | Modify | Clean fixture ends with the section |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` | Modify | RS-005 case, fixture hub ends with the section |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md` | Modify | Five codes |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | Five codes |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modify | Five codes |
| `.skilled/commands/create/assets/create-skill-auto.yaml`, `create-skill-confirm.yaml` | Modify | Five codes |
| Version carriers, changelogs, Hermes copy, route manifest and twin | Modify/Create | Derived and release files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every SKILL.md under `.skilled/skills` outside archives, fixtures and templates ends with a `## MACHINE ROUTER` section |
| REQ-002 | `package_skill.py --strict` and `parent-skill-check.cjs` check 12b fail a SKILL.md with no MACHINE ROUTER section, with code RS-005 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The canon docs and `/create:skill` steps list five codes |
| REQ-004 | Every touched unit has a changelog entry whose version matches its carriers |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The count of SKILL.md files without a MACHINE ROUTER section is 0 of 54.
- **SC-002**: The old hub SKILL.md fails the new check with RS-005, and all 38 gates pass on the final tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled route manifest records the hub SKILL.md bytes | A stale manifest fails the route guard | Refresh the manifest and copy it over its twin |
| Risk | A skill outside this repo has no MACHINE ROUTER section | It now fails `--strict` | The changelog Upgrade section says how to add one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The new rule is one presence test on an already parsed heading list.

### Security
- **NFR-S01**: N/A. No credential, input boundary or permission changes.

### Reliability
- **NFR-R01**: The Python and JS checks report the same code and message for the same file.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a SKILL.md with no H2 sections at all gets RS-005.
- Maximum input: a heading `## MACHINE ROUTER` inside a fenced block is template text, so it does not count as the section.
- Failure path: a known-debt entry that records RS-005 tolerates it; any other skill fails `--strict` with exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | About 15 files, under 150 changed lines |
| Risk | 8/25 | A new strict rule; every in-repo skill already meets it |
| Research | 4/20 | The canon and the phase 008 limitation already name the gap |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocks this phase. Whether MACHINE ROUTER content should move into a separate router file is a separate canon decision for the operator.
<!-- /ANCHOR:questions -->

---
