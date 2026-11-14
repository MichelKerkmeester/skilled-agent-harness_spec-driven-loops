---
title: "Feature Specification: Phase 1: fix-agent-contract-contradictions"
description: "Eight statements in the agent files contradict the frontmatter or each other, so an agent that follows its own file cannot finish its workflow. This phase makes every contract say one thing."
trigger_phrases:
  - "fix agent contract contradictions"
  - "phase 1 fix agent contract contradictions"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: fix-agent-contract-contradictions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-agent-registry-and-generated-rosters |
| **Handoff Criteria** | Every row in this phase's `acceptance-criteria.md` is `Met` and the mirror check passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the agent contract and registry alignment packet.

**Scope Boundary**: Only statements that contradict another statement, a permission or the current system. No section is renamed, no text is trimmed for length and no roster is edited here.

**Dependencies**:
- None. This phase runs first so later phases edit files whose contracts are already consistent.

**Deliverables**:
- Eight agent files whose permissions, return values, step order and delegation rules agree with themselves and with each other
- Regenerated runtime copies that pass the mirror check
- One recorded test dispatch showing a named agent keeps its tool limits when the orchestrator dispatches it
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight statements in `.skilled/agents/` cannot all be followed. `ai-council.md` denies Bash and says it never runs shell commands, yet its rules make it record every state event through a `node` script. `orchestrate.md` tells the runtime to dispatch every agent as `general-purpose`, a wrapper that has every tool, so the read-only limits on `context` and `review` do not hold on that path. `code.md`, `review.md`, `deep-research.md` and the council report template each state two rules that disagree, and five files still name tools and a profile that no longer exist.

### Purpose
Every agent file states one contract that its own permissions allow, so an agent that follows the file can finish its workflow and a caller can parse what comes back.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n --no-heading -e 'never runs shell commands' -e 'No files were modified by' -e 'Skip steps 3-5' -e 'RETURN is `DONE`' -e 'This Copilot profile' -e '^### Step 9' .skilled/agents | cut -c1-100
.skilled/agents/orchestrate.md:94:This Copilot profile enforces **single-hop delegation**. Nested su
.skilled/agents/ai-council.md:24:The Multi-AI Council is a scoped-write planning architect that seek
.skilled/agents/ai-council.md:503:- No files were modified by the Multi-AI Council.
.skilled/agents/code.md:416:- Return "mostly done" or "should work" — RETURN is `DONE` (PASS) or `BL
.skilled/agents/review.md:67:**If dispatched with `Complexity: low`:** Skip steps 3-5 of the 8-step
.skilled/agents/deep-research.md:303:### Step 9: Write Delta
.skilled/agents/deep-research.md:318:### Step 9: Update Research (Progressive)
$ rg -c -i 'memory tools' .skilled/agents
.skilled/agents/orchestrate.md:1
.skilled/agents/ai-council.md:1
.skilled/agents/deep-review.md:1
.skilled/agents/context.md:4
.skilled/agents/debug.md:1
$ rg -c 'general-purpose' .skilled/agents/orchestrate.md
10
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the persistence rules in `ai-council.md` so the agent writes artifacts with Write and Edit, and the calling workflow runs the gateway and helper scripts, as `deep-ai-council-auto.yaml` line 66 already does
- Change the council report template line that says no files were modified, so it says no code or spec files were modified and the council artifacts were written
- State one delegation rule for `ai-council` in both `ai-council.md` and `orchestrate.md`: a leaf when another agent dispatches it, and allowed to dispatch seats only when the operator invokes it directly
- Replace the `general-purpose` dispatch instruction in `orchestrate.md` with dispatch by the agent's own name, and use one spelling for the wrapper where a runtime has no named agents
- Give `code.md` one return vocabulary, keep the standards load in the `review.md` fast path, and make the `deep-research.md` overview and detailed steps list the same steps in the same order with unique numbers
- Remove the two `Copilot profile` mentions and the eight `memory tools` mentions, replacing each with the retrieval the file already describes

### Out of Scope
- Adding `design` and `prompt-improver` to the orchestrator rosters - phase 2 generates those tables, so a hand edit here would be overwritten
- Renaming sections to the template's names - phase 4 owns the outline
- Cutting repeated or restated text - phase 5 owns length

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/agents/ai-council.md` | Modify | Persistence ownership, report template line, delegation rule, one stale mention |
| `.skilled/agents/orchestrate.md` | Modify | Dispatch by agent name, council tier wording, two stale phrases, one stale mention |
| `.skilled/agents/code.md` | Modify | One return vocabulary |
| `.skilled/agents/review.md` | Modify | Fast path keeps the standards load |
| `.skilled/agents/deep-research.md` | Modify | One step order with unique numbers |
| `.skilled/agents/context.md`, `deep-review.md`, `debug.md` | Modify | Stale `memory tools` mentions |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/` | Regenerate | Runtime copies of the changed files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `ai-council.md` gives the agent no instruction that needs a tool its frontmatter denies. The calling workflow is named as the runner of `append-mode-event.cjs` and `persist-artifacts.cjs`. |
| REQ-002 | `orchestrate.md` dispatches each agent by its own name, and no line says every custom agent uses the general wrapper. |
| REQ-003 | A `context` agent dispatched the way `orchestrate.md` instructs cannot write a file on Claude Code. |
| REQ-004 | `code.md` names one set of return values in both the return template and the rules. |
| REQ-005 | The runtime copies of every changed agent file match the canonical file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-006 | The `review.md` fast path keeps the standards load and names the steps it skips. |
| REQ-007 | The `deep-research.md` overview and its detailed steps list the same steps in the same order, each with a unique number. |
| REQ-008 | The council report template says which files were written. |
| REQ-009 | `ai-council.md` and `orchestrate.md` state the same delegation rule for the council. |
| REQ-010 | No agent file names the retired memory tools or a Copilot profile. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -e 'RETURN is .DONE.' -e 'Skip steps 3-5' -e 'No files were modified by the Multi-AI Council' -e 'all custom agents use the general subagent type' .skilled/agents` prints no line.
- **SC-002**: `rg -n -i -e 'memory tools' -e 'copilot profile' .skilled/agents` prints no line, down from 10 matching lines.
- **SC-003**: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 after the edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | `.skilled/commands/deep/assets/deep-ai-council-auto.yaml` owns the gateway call | If the workflow does not run every script the agent file used to name, a council run loses an artifact | Task T002 lists each script the agent file names and the workflow line that runs it before any rule is rewritten |
| Risk | A runtime with no named agents receives a dispatch by name and fails | High | The instruction keeps the wrapper for that case, and the crosswalk is read first to list which runtimes register named agents |
| Risk | Removing a `memory tools` mention drops a real retrieval step | Med | Each mention is replaced with the trigger index or ripgrep step the same file already describes, never deleted outright |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: no service runs, the change is text in eleven Markdown files.

### Security
- **NFR-S01**: The change grants no agent a tool it lacked. `rg -n '^  bash:' .skilled/agents/ai-council.md` still prints `bash: deny`.

### Reliability
- **NFR-R01**: Every runtime copy is regenerated in the same commit as its canonical file, so no tree runs an older contract.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: An agent with nothing to fix, such as `design.md`, `markdown.md` and `prompt-improver.md`, is not opened.
- Maximum input: `orchestrate.md` carries ten `general-purpose` mentions. Each one is classified as a dispatch instruction or as the built-in agent's name before it is changed.
- Failure path: If the test dispatch in REQ-003 can write the file, the phase stops with that task marked `[B]` and the result recorded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 12/25 | Eight files in `.skilled/agents` plus six generated trees, under 150 changed lines |
| Risk | 14/25 | A dispatch instruction that every orchestrated run follows |
| Research | 8/20 | One workflow file and one runtime crosswalk to read |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which runtimes register agents by name? Decision: read `.skilled/bin/agent-mirror-crosswalk.md` in T003 and keep the wrapper only for the runtimes it lists as having none.
- Should the council gain Bash for its two scripts instead? Decision: no. The workflow already runs the gateway, so widening the permission would add a tool the agent does not need.
<!-- /ANCHOR:questions -->

---


