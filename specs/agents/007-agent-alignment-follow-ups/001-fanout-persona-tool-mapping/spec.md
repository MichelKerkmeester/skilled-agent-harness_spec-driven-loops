---
title: "Feature Specification: Phase 1: fanout-persona-tool-mapping"
description: "The deep-loop fan-out runner inlines an agent persona for every executor that is not native and adds no tool-mapping line. The two personas it inlines both allow Bash, so the failure seen with a Bash-denying persona may not apply. This phase probes a Codex child and changes the runner only when a run reads nothing."
trigger_phrases:
  - "fanout persona tool mapping"
  - "phase 1 fanout persona tool mapping"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: fanout-persona-tool-mapping

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-deepseek-harness-persona-probe |
| **Handoff Criteria** | `scratch/decision.md` holds one `decision:` line backed by three probe reports |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the agent alignment follow-ups packet.

**Scope Boundary**: The prompt the fan-out runner builds for a `cli-codex` lineage. The agent files, the Codex dispatch rule and the prompts for every other executor kind do not change.

**Dependencies**:
- None. This phase changes a different artifact from phases 2 to 4 and can run at any point.

**Deliverables**:
- Three recorded read-only Codex runs with the persona the runner inlines
- One recorded decision: `no-change` or `add-line`
- On `add-line` only: the mapping line in the runner for a `cli-codex` lineage, and one test for it
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`agentPersonaBlock` in the fan-out runner inlines `.skilled/agents/<name>.md` into the prompt of every lineage whose kind is not `native`, and it adds no tool-mapping line. The predecessor packet saw a Codex child read nothing and exit 0 when it was given a persona that denies Bash and names Read, Grep and Glob. The runner inlines only `deep-research` or `deep-review`, and both personas allow Bash, so the observed cause is absent here. Whether a Codex lineage still stalls on tool names it does not have is not known, because no run has tested it.

### Purpose
The fan-out runner carries a tool-mapping line for Codex only if a live run shows a Codex child needs one, and the answer is recorded either way.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c -i 'tool mapping' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs || echo 0
0
$ rg -n 'const agentName = ' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
1564:  const agentName = loopType === 'review' ? 'deep-review' : 'deep-research';
$ rg -n '^  bash:' .skilled/agents/deep-research.md .skilled/agents/deep-review.md
.skilled/agents/deep-research.md:10:  bash: allow
.skilled/agents/deep-review.md:10:  bash: allow
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build the persona block the runner inlines for `deep-research` and save a read-only probe prompt that asks for one named file
- Run that prompt three times through `codex exec --sandbox read-only` with no mapping line, and read each report's `FILES READ:` line
- Record the decision: `no-change` when all three runs name the file, `add-line` when any run names none
- On `add-line`, put a tool-mapping line directly above the persona for a `cli-codex` lineage, worded so a lineage may still write inside its lineage directory
- On `add-line`, add one test that the line is present for `cli-codex` and absent for `cli-opencode` and `native`

### Out of Scope
- Adding the line for `cli-opencode`, `cli-pi`, `cli-cursor`, `cli-devin` or `cli-claude-code` - the predecessor's table records each as having the persona's tools or a native persona surface
- The `cli-deepseek-harness` kind - phase 2 probes it
- Copying the Codex rule's literal text - it ends `Run no other command`, and a fan-out lineage must write its iteration files
- Editing `deep-research.md` or `deep-review.md` - the personas are correct for the runtimes that have their tools

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/` | Create | Baseline, probe prompt, three reports and the decision |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify, on `add-line` only | Mapping line above the persona for a `cli-codex` lineage |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify, on `add-line` only | One test for the line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Three read-only Codex runs with the inlined `deep-research` persona and no mapping line are recorded, each judged by its report and never by exit status. | `ls scratch/codex-run-1.txt scratch/codex-run-2.txt scratch/codex-run-3.txt` lists three files, and `rg -c '^FILES READ:' scratch/codex-run-1.txt` prints 1 for each |
| REQ-002 | The decision is recorded with the evidence it rests on. | `rg -c '^decision: ' scratch/decision.md` prints 1, and the file names the three report files and the codex-cli version |
| REQ-003 | On `add-line`, a `cli-codex` lineage prompt carries the mapping line directly above the persona, and the prompts for `cli-opencode` and `native` are unchanged. On `no-change`, the runner is not edited. | On `add-line`: the new test passes and `rg -c -i 'tool mapping' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints 1 or more. On `no-change`: `git diff --stat main -- .skilled/skills/system-deep-loop` prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | On `add-line`, the mapping text allows the lineage to write inside its lineage directory. | `rg -c 'Run no other command' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints no line |
| REQ-005 | The two test files that read the persona block pass before and after, with the same count of passing tests or one more. | `npx vitest run tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` in `.skilled/skills/system-deep-loop/runtime` exits 0 both times, and the counts are saved in `scratch/baseline.txt` and `scratch/after.txt` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c '^decision: ' scratch/decision.md` prints 1.
- **SC-002**: On `add-line`, `rg -c -i 'tool mapping' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints 1 or more, up from 0. On `no-change` it still prints 0.
- **SC-003**: The vitest run for the two test files exits 0 from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `codex` installed and logged in through ChatGPT OAuth | No live runs, so no decision | Run `codex login status` first. If it is not logged in, the probe tasks are marked `[B]` and the operator is asked to log in |
| Risk | Three passing runs do not prove the failure never happens, because the predecessor saw it once in three runs on codex-cli 0.167.2 | Med | The decision file states the sample size and the version. A later failure reopens the finding with its report |
| Risk | A mapping line that restricts the shell stops a lineage from writing its iteration files | High | REQ-004 bans the read-only wording, and the probe on `add-line` is rerun with the new line before the phase closes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the line go on `cli-codex` only or on every kind that is not `native`? Decision: `cli-codex` only, and only on `add-line`. The predecessor's table shows every other kind has the persona's tools or a native surface, and phase 2 owns the harness.
- Does a probe with a short read task stand in for a full fan-out lineage? Decision: yes for this question. The probe uses the same persona block the runner builds, and the question is whether the child uses its shell for a named read. A full lineage would add cost and write files without testing anything further.
<!-- /ANCHOR:questions -->

---
