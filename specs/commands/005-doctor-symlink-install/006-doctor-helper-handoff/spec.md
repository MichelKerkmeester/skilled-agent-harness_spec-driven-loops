---
title: "Feature Specification: Phase 6: doctor-helper-handoff"
description: "A doctor problem worded unlike any bridge phrase reached no doctor command, because a doctor bridge passes only on its own wording. The advisor now asks /doctor:helper's own ranker and offers /doctor:helper when the prompt describes a doctor problem."
trigger_phrases:
  - "doctor helper handoff"
  - "phase 6 doctor helper handoff"
  - "advisor hands off to doctor helper"
  - "reworded doctor prompt routing"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: doctor-helper-handoff

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/307-doctor-helper-handoff` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-central-doctor-playbook |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met, and the advisor suite passes with its holdout and ratchet gates unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the doctor symlink and install packet. Phase 3 wired the new commands into the advisor. A probe after it showed that the advisor reaches a doctor command only through that command's declared phrases.

**Scope Boundary**: The advisor's TypeScript scorer and its tests, the advisor docs that describe doctor routing, and one central playbook scenario. The doctor commands, `/doctor:helper`'s ranker and the Python fallback scorer do not change.

**Dependencies**:
- `/doctor:helper`'s ranker, `.skilled/commands/doctor/scripts/doctor-helper-match.cjs`, which exports `loadEntries` and `rankProblem`.
- The `command-doctor-helper` bridge, already active in both scorer lists.

**Deliverables**:
- A scorer step that offers `/doctor:helper` for a doctor problem no bridge phrase matches.
- Unit tests, routing slice rows and a playbook scenario that pin it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`requireDoctorPhraseAnchor` in `lib/scorer/fusion.ts` lets a doctor bridge pass only when the prompt carries one of its manifest phrases or its slash command. A doctor problem in the operator's own words, such as "my AGENTS.md is out of date with the template", therefore reached no doctor command, and five of sixteen reworded prompts got no recommendation at all.

### Purpose
A doctor problem in other words reaches `/doctor:helper`, which names the right command, while ordinary requests that share doctor words gain no doctor line and the advisor's holdout accuracy holds.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on `main` at `41a3db3854` with the built scorer, semantic lane off. One reworded prompt per doctor command, each in words unlike its declared phrases:

```text
/doctor:agents-md        pass=[]
/doctor:ci               pass=[sk-code,sk-git]
/doctor:deep-loop        pass=[system-deep-loop,cli-external-orchestration,mcp-code-mode]
/doctor:env              pass=[system-spec-kit,mcp-tooling]
/doctor:git              pass=[sk-git]
/doctor:helper           pass=[sk-doc,mcp-code-mode,D:helper]
/doctor:install          pass=[D:install,D:setup]
/doctor:mcp              pass=[mcp-code-mode,sk-code,mcp-tooling]
/doctor:runtime-mirrors  pass=[]
/doctor:setup            pass=[]
/doctor:sk-code          pass=[sk-code,local-webflow,D:sk-code-quality]
/doctor:sk-skill         pass=[]
/doctor:skill-advisor    pass=[system-skill-advisor,D:skill-advisor-tune]
/doctor:speckit          pass=[system-spec-kit]
/doctor:symlink          pass=[D:symlink-check]
/doctor:update           pass=[system-spec-kit]
```

The same sixteen prompts through `doctor-helper-match.cjs --top=1` picked the intended command for 14 of 16.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a scorer step that asks `/doctor:helper`'s ranker about a prompt when no doctor bridge passes and none was typed, and passes `command-doctor-helper` when the ranker reads a doctor problem.
- Gate that step on a problem cue, so ordinary requests that share doctor vocabulary gain no doctor line.
- Pin the behavior with unit tests, routing slice rows and a central playbook scenario.
- Correct the three docs that said a doctor bridge surfaces only on its own wording.

### Out of Scope
- The Python fallback scorer. It matches a doctor bridge only on a typed slash command, and that contract stays.
- Naming the specific doctor command in the brief. The hand-off offers `/doctor:helper`, which ranks and explains, so the advisor never claims a pick it did not make on its own evidence.
- New trigger phrases for individual doctor commands. Phase 3's follow-up added the ones the probe needed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts` | Create | Loads the helper's ranker, ranks the prompt and reads its problem cue |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | `applyDoctorHelperHandoff`, called after the doctor ordering step |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-helper-handoff.vitest.ts` | Create | Cue tiers and the ranker bridge |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modify | Four `B-helper-handoff` rows |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md` | Modify | The doctor routing paragraph |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modify | The doctor routing paragraph |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md` | Create | Scenario DOC-406 |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md`, `doctor-commands/README.md`, `doctor-commands/doctor-routing-contested-second-line.md` | Modify | Index row, counts and one rationale sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A doctor problem that no skill and no bridge phrase matches, such as "my AGENTS.md is out of date with the template", makes `command-doctor-helper` the advisor's top pick. |
| REQ-002 | The advisor's holdout top-1 (49 of 66) and the scorer ratchet hold exactly, and no prompt in the holdout, labeled, doctor or ambiguity corpora gains a hand-off. |
| REQ-003 | An ordinary request that shares doctor words beside a passing skill, such as "Use the deep-research workflow, not a manual loop, to investigate routing drift.", gains no doctor line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Beside a passing skill, a doctor problem that names a wrong state, such as "my deep research run never converges", shows `Also: /doctor:helper` as the brief's second line. |
| REQ-005 | On the helper's held-out fixtures, more doctor problems reach a doctor recommendation in the top three than before, and no non-doctor row gains a hand-off. |
| REQ-006 | A workspace without the helper script, or a ranker that throws, leaves the ranking unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The routing slice rows `doctor-b-helper-handoff-01` to `-04` pass, and three of them fail with the scorer change removed.
- **SC-002**: The full advisor vitest suite passes, with `holdout-independent` and `scorer-eval-baseline-ratchet` among the passing files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `doctor-helper-match.cjs` exports and its `yaml` package | A missing or broken script would throw inside scoring | The loader returns null on any failure and the hand-off then does nothing; a unit test covers a workspace without the script |
| Risk | Word overlap fires on ordinary requests that share doctor vocabulary | Med | A problem cue is required, only a strong cue counts beside a passing skill, and the four corpora show no fire |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The helper's route table loads once per workspace and reloads only when `_routes.yaml` changes, so a scoring call adds one in-memory rank. The advisor's existing latency tests pass unchanged.

### Security
- **NFR-S01**: N/A: the step reads two files inside the workspace the scorer already trusts and writes nothing.

### Reliability
- **NFR-R01**: Any load or rank failure is a no-match, never a scoring error.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty prompt gets no ranker candidate and no cue, so the ranking is unchanged.
- Maximum input: a long prompt is ranked once by the helper's ranker, which already accepts free text.
- Failure path: a missing helper script, a missing `_routes.yaml` or a throwing ranker returns no match, and the scorer returns the ranking it had.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One new scorer module, one fusion step, tests and four docs |
| Risk | 12/25 | A shared scorer: every advisor caller sees the change |
| Research | 10/20 | Thresholds measured against four corpora and the helper fixtures |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose the hand-off over more phrases per command and over relaxing the anchor rule.
<!-- /ANCHOR:questions -->

---
