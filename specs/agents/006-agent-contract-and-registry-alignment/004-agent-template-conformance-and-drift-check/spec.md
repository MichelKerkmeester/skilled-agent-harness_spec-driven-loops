---
title: "Feature Specification: Phase 4: agent-template-conformance-and-drift-check"
description: "The agent template has moved on and ten of eleven files have not followed it, and nothing compares the two, so the drift is invisible. This phase aligns the outlines and adds a check that fails on drift."
trigger_phrases:
  - "agent template conformance and drift check"
  - "phase 4 agent template conformance and drift check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: agent-template-conformance-and-drift-check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-skill-binding-through-routers |
| **Successor** | 005-trim-duplicated-and-dead-agent-text |
| **Handoff Criteria** | The drift check exits 0 in CI and every deviation from the template is a named exception with a reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the agent contract and registry alignment packet.

**Scope Boundary**: Section names, section presence and section order in the agent files, and one check against the template. The rules inside a section keep their wording.

**Dependencies**:
- Phase 3, because it edits the skill tables inside the section this phase renames, and two phases editing one section at once would conflict.

**Deliverables**:
- Eleven agent files whose required sections match the template's names and order
- An outline check that fails when a required section is missing, renamed or out of order
- A list of sanctioned exceptions in the registry, each with a reason
- A table showing every internal section reference still points at the section it meant
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-doc/sk-create-agent/assets/agent-template.md` names the skills section `CAPABILITY SCAN`, gives hook-injected advisor context its own section and defines an input and scope gate numbered `0b`. One agent uses the new section name, one has the hook section and two have the gate. No check compares an agent file with the template, so each template change leaves the existing agents behind without anyone seeing it.

### Purpose
Every agent file follows the template's current outline or carries a named exception, and CI fails the day one drifts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -l '^## [0-9]+\. CAPABILITY SCAN' .skilled/agents | wc -l
       1
$ rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents | wc -l
      10
$ rg -l '^## [0-9]+\. HOOK-INJECTED' .skilled/agents | wc -l
       1
$ rg -l '^## 0b' .skilled/agents | wc -l
       2
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the skills section to the template's name in the ten files that use the old one
- Move the hook-injected advisor paragraph into its own section, as the template places it, in the ten files that carry it in the preamble
- Add each section the template marks required to every agent that lacks it, and record an exception with a reason where an agent's role makes a section wrong for it
- Extend the `--check` mode of `sync-agent-roster.cjs` to compare each agent's outline with the template's required list and the registry's exceptions. Extending the existing check is enough, so no new script is added
- Correct every internal section reference that renumbering moves

### Out of Scope
- Rewording the rules inside any section - phase 1 owns contracts and phase 5 owns length
- Changing what the template requires - the template is the reference here, except where phase 5 amends its summary rule. Amended 2026-11-14 by operator decision: the template gains a required-sections list that the check reads, because it marked no section as required. See `scratch/required-sections.md`
- The frontmatter - the crosswalk and the mirror check already govern it

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/agents/*.md` | Modify | Section names, presence and order in up to eleven files |
| `.skilled/agents/agent-registry.json` | Modify | A `templateExceptions` list per agent, each entry with a reason |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | The required-sections list, added by the 2026-11-14 amendment |
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` and `.skilled/bin/README.md` | Modify | One line each naming the outline check, as the checklist asks |
| `.skilled/bin/sync-agent-roster.cjs` | Modify | Outline check in `--check` mode |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Modify | Cases for a missing, a renamed and an out-of-order section |
| Six runtime trees | Regenerate | Copies of the changed agent files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | The check fails when an agent file lacks a required section, names it differently or orders it differently from the template, unless the registry lists that as an exception. |
| REQ-002 | No rule is lost or reworded by the move: each moved block is byte-identical before and after, apart from its heading. |
| REQ-003 | The runtime copies of the changed agent files match the canonical files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-004 | Every agent file names its skills section as the template does. |
| REQ-005 | Every agent file carries the hook-injected context section the template defines. |
| REQ-006 | Every exception in the registry names the section and gives a reason of at least one sentence. |
| REQ-007 | Every reference inside an agent file to one of its own numbered sections points at the section it meant before the renumbering. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents` prints no path, down from 10.
- **SC-002**: `rg -l '^## [0-9]+\. HOOK-INJECTED CONTEXT ROUTING' .skilled/agents` prints 11 paths, up from 1.
- **SC-003**: Renaming one required section in a scratch copy makes the check exit 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | `agent-template.md` section 3, the required body structure | If it does not say which sections are required, the check has no reference | T002 reads it and writes the required list into `scratch/required-sections.md`. A section it leaves unclear becomes an open question, not a guess |
| Risk | Renumbering breaks a reference such as `§10` inside the same file or in `orchestrate.md` | Med | T003 lists every section reference before any heading moves, and T011 rechecks each one |
| Risk | `orchestrate.md` and `ai-council.md` have shapes the template was not written for | Med | Their deviations are recorded as exceptions with reasons, never forced into the outline |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The outline check adds under 1 second to the roster check, measured with `time` in T012.

### Security
- **NFR-S01**: The check reads the template and the agent files only and writes nothing.

### Reliability
- **NFR-R01**: A template change that adds a required section makes the check fail on every agent that lacks it, on the same commit.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: Empty input: an agent file with no numbered sections fails the check and is named.
- Maximum input: Maximum input: `ai-council.md` has nineteen numbered sections, and the extra ones pass because the check only requires the template's list.
- Failure path: Failure path: a template whose required list cannot be parsed makes the check exit 2 and print the reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 16/25 | Up to eleven agent files, one script, one registry, about 300 moved lines |
| Risk | 10/25 | Headings that other files and workflows may cite by number |
| Research | 8/20 | One template section to read |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the template require the `0b` input and scope gate for every agent or only for agents that write? Decision: T002 reads `agent-template.md` section 3 and records the answer. Until then the gate is treated as required for write-capable agents only. Answer, 2026-11-14: the template makes the gate conditional on how an agent is driven, so it is not in the required list.
- Which sections are required, when the template marks none? Operator answer, 2026-11-14: a narrow list written into the template, in place of about 20 registry exceptions.
- Should the check read the required list from the template or from the registry? Decision: from the template, so one edit to the template is enough to move every agent.
<!-- /ANCHOR:questions -->

---


