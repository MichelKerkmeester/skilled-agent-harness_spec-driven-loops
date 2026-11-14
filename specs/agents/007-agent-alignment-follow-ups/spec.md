---
title: "Feature Specification: Agent alignment follow-ups: close the four findings the agent contract and registry alignment packet left open"
description: "The agent contract and registry alignment packet closed with four findings it did not own: two persona dispatch paths with no tool-mapping line, one hand-typed agent list in the orchestrator's task template, and an authoring skill that never names the agent registry. Four phases settle each by evidence."
trigger_phrases:
  - "agent alignment follow ups phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Agent alignment follow-ups: close the four findings the agent contract and registry alignment packet left open

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | None, this is the packet root |
| **Parent Packet** | agents/007-agent-alignment-follow-ups |
| **Predecessor** | 006-agent-contract-and-registry-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every child phase has a recorded decision or a shipped change, and `validate.sh --recursive --strict` prints `RESULT: PASSED` for the parent and all four children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet `agents/006-agent-contract-and-registry-alignment` closed on 2026-11-14 and recorded four findings outside its scope. The deep-loop fan-out runner inlines an agent persona for every executor that is not native and adds no tool-mapping line, the line the Codex dispatch rule now requires. The DeepSeek Harness documents name no read tool, so nobody knows whether a harness child given a read-only persona reads files. The orchestrator's task template lists eight agent names typed by hand while the registry schedules ten, so a task package cannot name `@design` or `@prompt-improver` from the template. The agent authoring skill never tells an author to add a registry record, so a new agent file fails the roster check with an error the skill does not explain. Two of the four are suspected failures with no observed run behind them, and acting on them without evidence would add text to prompts and rules that nothing needs.

### Purpose
Each of the four findings ends as a shipped fix or as a recorded decision that no fix is needed, and each rests on a command output or a live dispatch.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decide by live Codex dispatch whether the fan-out runner needs a tool-mapping line, and add it for the Codex executor only when a run reads nothing (phase 1)
- Decide by live harness dispatch whether a DeepSeek Harness child needs a tool-mapping line, and add the rule to the harness skill only when the control run reads nothing (phase 2)
- Remove the hand-typed agent list from the orchestrator's task template so it cannot disagree with the registry (phase 3)
- Add the registry record to the agent authoring workflow, with the error an author sees without it (phase 4)

### Out of Scope
- Changing any agent's role, permissions or outline
- Changing the Codex dispatch rule or the canonical persona-injection contract, which the predecessor packet shipped
- The Routing Registry Drift Guard failure on main, which another packet owns
- Adding a mapping line to an executor no run has shown to need one

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify, only on a failed probe | 1 | Tool-mapping line above the persona for a `cli-codex` lineage |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify, only on a failed probe | 1 | One test for the line and its absence on other kinds |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Modify, only on a failed control | 2 | Tool-mapping requirement in rule 7 |
| `.skilled/agents/orchestrate.md` | Modify | 3 | The `Agent:` line of the task template |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/` | Regenerate | 3 | Runtime copies of `orchestrate.md` |
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modify | 4 | Registry step in the ordered creation workflow |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/` | Create | 4 | One entry for the new packet version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-fanout-persona-tool-mapping/ | Probe a Codex child with the persona the fan-out runner inlines, and add a tool-mapping line to the runner only when a run reads nothing | Pending |
| 2 | 002-deepseek-harness-persona-probe/ | Run one read-only harness dispatch with the `context` persona, with and without a tool-mapping line, and record which one reads its file | Pending |
| 3 | 003-orchestrate-task-package-agent-names/ | Replace the eight hand-typed agent names in the orchestrator's task template with a pointer to the generated routing table | Pending |
| 4 | 004-agent-authoring-registry-step/ | Add the registry record to the agent authoring workflow so a new agent file passes the roster check | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fanout-persona-tool-mapping | 002-deepseek-harness-persona-probe | The decision for the fan-out runner is recorded with its three probe reports | `rg -c '^decision: ' specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/decision.md` prints 1 |
| 002-deepseek-harness-persona-probe | 003-orchestrate-task-package-agent-names | The harness verdict is recorded with both report files | `rg -c '^verdict: ' specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/verdict.md` prints 1 |
| 003-orchestrate-task-package-agent-names | 004-agent-authoring-registry-step | The task template holds no hand-typed agent list and the runtime copies match | `rg -c '^├─ Agent: @code' .skilled/agents/orchestrate.md` prints no line, and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The level helper scored the whole work at 37 and recommended no phases. The operator chose one phased packet with four children on 2026-11-14, so each finding keeps its own evidence and its own close.
- The four phases change four different artifacts and do not depend on each other. The order in the map is the order the findings were recorded, and any phase can run first.
- Phase 3: the planning default replaces the hand-typed list with a pointer to the generated routing table. The alternative makes the roster script write that one line from the registry. The child's `spec.md` section 7 holds both. Operator answer: the pointer (2026-11-14).
- The executor model for implementation is not chosen. The predecessor packet used DeepSeek V4.1 Flash at max through OpenCode on LLM Gateway, by an operator instruction that covered that packet only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
