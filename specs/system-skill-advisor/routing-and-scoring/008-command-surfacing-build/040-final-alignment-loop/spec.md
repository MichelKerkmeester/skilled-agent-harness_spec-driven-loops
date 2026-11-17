---
title: "Feature Specification: Phase 40: final-alignment-loop"
description: "The final alignment run and review pass twelve left seven P1: a playbook prompt that no longer routes, four ways a refused or questioned command is still offered, and four advisor tasks the advisor does not rank first. This phase fixes each, then reruns review and alignment."
trigger_phrases:
  - "final alignment loop"
  - "phase 40 final alignment loop"
  - "command mention refusal after name"
  - "advisor probe intent signals arena"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 40: final-alignment-loop

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 40 of 40 |
| **Predecessor** | 039-main-sk-doc-routing-repair |
| **Successor** | None |
| **Handoff Criteria** | Each P1 has a case that fails on the old code, the gates hold, a review pass and a full alignment run report 0 P0 and 0 P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 40** of the command surfacing build. The full alignment run `20261116T195539Z` on `b8ebee37d75` reported 0 P0, 7 P1 and 24 P2, and review pass twelve kept one P1 as a known limit under a capped close. The operator then chose, through the ask tool on 2026-11-16, the full loop: fix every P1, the mention check ones included, and rerun review and alignment.

**Scope Boundary**: `commandOnlyMentioned` and `typedCommandIn` in `runtime/lib/command-attach.ts` and their guards test, one manual testing playbook scenario, and the advisor's `intent_signals`. No scorer weight, threshold, corpus row, baseline or ledger change.

**Dependencies**:
- The alignment run's `findings.json` and review pass twelve's `review/review-report.md`

**Deliverables**:
- The fixes, a failing-first case for each, the gate evidence, review pass thirteen and a fresh alignment run
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader who refuses or questions a command still gets it offered in four shapes: a refusal after the name ("/create:readme is not what I want, do not run it"), the command named as a document ("read the /create:readme document and tell me what it does"), a wrapper the fold keeps such as `[/create:readme]`, and a doc path such as `/create:readme.md` beside a led refusal. One playbook scenario pins a prompt that no longer tops `/doctor:update`. Four advisor tasks, a stale skill graph rebuild, the Vibe prompt hook setup and the behaviour arena, rank another skill or none first.

### Purpose
A refused or questioned command is never offered in those shapes, a request still is, the playbook passes as written, and the four advisor tasks rank the advisor first without moving the floors.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend ... "/create:readme is not what I want, do not run it"
{"skillId":"sk-doc","command":"/create:readme","policy":"start"}
$ ... "run /doctor:git setup but do not actually run it"
{"skillId":"command-doctor-git-setup","command":"/doctor:git setup","policy":"run"}
$ ... "read the /create:readme document and tell me what it does"
{"skillId":"sk-doc","command":"/create:readme","policy":"start"}
commandOnlyMentioned("do not run [/create:readme], just explain", "/create:readme") = false (plain form true)
run-probes: P05 top command-doctor-helper, P07 top sk-prompt, P08 top sk-doc, P09 top none (want system-skill-advisor)
Claude hook on "update skilled to the latest version": ambiguous sk-git vs sk-doc, no /doctor:update
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read a refusal of the command after its name ("do not run it", "don't actually run it")
- Read a command named as a document, file, page or source as a mention
- Drop square brackets, `~~`, `<code>` tags, guillemets and primes in the fold, and widen the typed reader's start boundary to match
- Skip a doc-path occurrence such as `/create:readme.md` in the occurrence scan
- Change the playbook prompt to one that tops `/doctor:update`
- Add advisor `intent_signals` for the four probe tasks
- Run review pass thirteen and a full alignment run

### Out of Scope
- Underscore emphasis, because a command name may hold an underscore
- Any scorer weight, threshold, corpus row or baseline change
- Reading holdout prompt text (D6)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify | The mention fold, the tail refusal, the document noun, the path skip and the typed start boundary |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modify | Failing-first cases and the wider wrapper matrix |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md` | Modify | The third prompt |
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | Modify | Intent signals for the four probe tasks |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompiled graph |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A refusal after the name, a command named as a document, a wrapper in the wider set and a doc path beside a led refusal each read as a mention, and every request fixture still reads as a request |
| REQ-002 | The suite reports 0 failed with `AI_SESSION_CHILD` unset and set, `FLOOR` prints 24/44, 0/35 and 2/44, `EVAL` prints [160,49,21,5] or better and the stored sets are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The playbook scenario's third prompt tops `/doctor:update` through the Claude hook |
| REQ-004 | The four probe prompts top system-skill-advisor through `run-probes.cjs` |
| REQ-005 | The review passes and the full alignment run report 0 P0 and 0 P1, or each remaining one is recorded with the operator's decision, including the known limit class the operator accepted on 2026-11-17 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: each new case fails on `b8ebee37d75` and passes after the fix
- **SC-002**: the floors and stored sets are unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A tail refusal clause reads a real request as a refusal | High | REQUEST6, CONTROL5 and the wrapper matrix must stay requests |
| Risk | New advisor phrases pull other prompts to the advisor | Medium | `FLOOR`, `EVAL` and the holdout count gate each phrase |
| Risk | A fresh alignment run writes fresh probes | Medium | REQ-005 records any remainder with the operator's decision |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The fold adds a constant number of regex passes per prompt

### Security
- **NFR-S01**: No holdout or command prompt text is read or printed
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created

### Reliability
- **NFR-R01**: Earlier phases' committed evidence stays unchanged

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no command name returns no mention
- Maximum input: an or-list of wrapped commands with a refusal after the last one reads as a refusal of each
- Failure path: "run /speckit:save, don't skip it" stays a request, because "skip" is not a use verb
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One module, one test file, one playbook, one metadata file |
| Risk | 11/25 | Command offers on every runtime |
| Research | 4/20 | Each finding names its case |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
