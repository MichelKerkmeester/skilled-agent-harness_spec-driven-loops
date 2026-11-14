---
title: "Feature Specification: Phase 6: codex-persona-tool-mapping"
description: "The Codex dispatch rules require inlining the agent persona, and a persona that denies Bash made a Codex child refuse to read any file while exiting 0. This phase adds a tool-mapping line to the rule and proves it with a live dispatch."
trigger_phrases:
  - "codex persona tool mapping"
  - "phase 6 codex persona tool mapping"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: codex-persona-tool-mapping

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-trim-duplicated-and-dead-agent-text |
| **Successor** | None |
| **Handoff Criteria** | A read-only Codex dispatch with an inlined persona reads the file it was asked to read |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the agent contract and registry alignment packet.

**Scope Boundary**: The persona-injection rule for external CLI dispatch and its canonical source. The agent files themselves do not change in this phase.

**Dependencies**:
- None. This phase changes a different artifact from phases 1 to 5 and can run at any point.

**Deliverables**:
- A tool-mapping requirement with its literal text in the Codex dispatch rule
- The same rule stated once in the canonical persona-injection contract
- The failure signature recorded where an orchestrator will look for it
- One recorded live dispatch that read the file it was asked to read
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rule 17 of `cli-codex/SKILL.md` requires every Codex dispatch to inline the agent persona. On 2026-11-14, with codex-cli 0.167.2, a read-only dispatch that inlined the `context` persona read nothing: the persona denies Bash and names Read, Grep and Glob, Codex has none of those tools, and the model refused to use its shell. The run exited 0 and its report ended `FILES READ: none`, so an orchestrator that checks only the exit status would have taken it for a finished audit.

### Purpose
A Codex child given any agent persona knows which of its own tools stand in for the persona's, so a read-only persona still reads and a silent empty run cannot pass as done.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md || echo 0
0
$ rg -n 'Codex has no native persona surface' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md | cut -c1-60
228:   - **Codex has no native persona surface.** `.codex/ag
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add to rule 17 of `cli-codex/SKILL.md` the requirement to put a tool-mapping line above an inlined persona, with the literal text to copy
- State the rule once in the canonical persona-injection contract that `cli-codex/SKILL.md` cites, for every CLI whose tools differ from the persona's
- Record the failure signature, exit 0 with a report that names no file read, beside the other dispatch gotchas in `cli-codex/SKILL.md`
- Run one read-only Codex dispatch with the `context` persona and the mapping line, and record that it read the named file
- Bump the packet version and add its changelog entry as the hub's version rule requires

### Out of Scope
- Changing `context.md` or any other agent file - the persona is correct for the runtimes that have its tools
- Adding the line to the dispatch rules of the other six CLI modes - each is checked in T002, and a mode that needs it is listed as a follow-up with its evidence
- Changing the shared deep-loop runner - research and review lineages build their own prompts there

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | Rule 17 and the dispatch gotchas |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | The canonical persona-injection contract |
| `.skilled/skills/cli-external-orchestration/cli-codex/changelog/` | Create | One entry for the new packet version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | Rule 17 of `cli-codex/SKILL.md` requires a tool-mapping line above an inlined persona and gives the literal text. |
| REQ-002 | A read-only `codex exec` that inlines the `context` persona with the mapping line reads the file it is asked to read. |
| REQ-003 | The same prompt without the mapping line is run once, and its result is recorded whether or not it reproduces the failure. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-004 | The canonical persona-injection contract states the rule for every CLI whose tools differ from the persona's. |
| REQ-005 | `cli-codex/SKILL.md` records the failure signature beside its other dispatch gotchas. |
| REQ-006 | The packet's version and its newest changelog entry agree. |
| REQ-007 | Each of the other six CLI modes is checked for the same gap, and the result is recorded. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more, up from 0.
- **SC-002**: `scratch/codex-probe-report.txt` contains `FILES READ: .skilled/agents/README.txt`.
- **SC-003**: `scratch/other-modes.md` has a row for each of the six other modes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | `codex` installed and logged in through ChatGPT OAuth | No live proof for REQ-002 and REQ-003 | Run `codex login status` first. If it is not logged in, the two tasks are marked `[B]` and the operator is asked to log in |
| Risk | The failure does not reproduce in the control run, because one of two earlier runs with no mapping line did read files | Med | REQ-003 records the control result either way. The rule is justified by the one observed failure, not by a guaranteed reproduction |
| Risk | The mapping line lets a read-only persona run a command that changes state | Med | The literal text names read commands only, and the dispatch keeps `--sandbox read-only`, which blocks writes whatever the model tries |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The mapping line adds under 60 words to a prompt.

### Security
- **NFR-S01**: Every probe dispatch runs with `--sandbox read-only`, and the mapping text names only `cat`, `sed -n`, `rg`, `ls`, `wc` and `find`.

### Reliability
- **NFR-R01**: The probe is judged by its report file, never by exit status, because both the failed and the working run exited 0.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: Empty input: a dispatch with no persona, the declared exception in rule 17, needs no mapping line.
- Maximum input: Maximum input: the largest persona, `orchestrate.md` at 62,567 bytes, still fits with the line added.
- Failure path: Failure path: a report that names no file read is treated as a failed dispatch even at exit 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 6/25 | Two skill files and one changelog entry, under 40 lines |
| Risk | 8/25 | A rule every Codex dispatch follows |
| Research | 8/20 | Six other mode packets to read |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where does the canonical persona-injection contract live? `cli-codex/SKILL.md` cites a `Persona Injection` section in `sk-prompt/assets/cli-prompt-quality-card.md`, and a search for that exact heading found nothing. Decision: T003 locates it. If it does not exist, the rule goes into `cli-codex/SKILL.md` only and the dangling citation is reported.
- Does the hub's release version move with a packet change? Decision: T004 reads the version rule in the hub's `SKILL.md` and follows it.
<!-- /ANCHOR:questions -->

---


