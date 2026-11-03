---
title: "Feature Specification: Conversation playbook scenarios"
description: "Adds a conversation scenario kind to sk-create-manual-testing-playbook and one shared tmux runner, so an orchestrator can play the human in a real interactive runtime session, answer its questions on a timed script and check state after every turn."
trigger_phrases:
  - "conversation playbook scenarios"
  - "conversation scenario runner"
  - "orchestrator versus test subject"
  - "multi-turn playbook scenario"
  - "timed prompt conversation test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios"
    last_updated_at: "2026-11-02T13:10:00Z"
    last_updated_by: "beb6e7b1-5f31-42db-8cd9-f58f27216e79"
    recent_action: "Both phases complete; runner proven live"
    next_safe_action: "Operator reviews the commit file list"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "043/006 names DEVIATION and N/A stage marks the runner does not write"
    answered_questions:
      - "Codex: default_mode_request_user_input is enabled in the repository and on the machine (decision record Q005)"
      - "The work lives in a new sk-doc packet"
      - "The runner is shared and lives in the playbook skill"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
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

# Feature Specification: Conversation playbook scenarios

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | None, this is a top-level packet in the `sk-doc` track |
| **Parent Packet** | sk-doc/065-conversation-playbook-scenarios |
| **Predecessor** | None |
| **Successor** | None. `specs/system-speckit/043-decision-capture/006-live-conversation-test` is the first consumer |
| **Handoff Criteria** | Both children pass `validate.sh --strict`, and the runner has a passing MTP-007 run on Claude Code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A manual testing playbook scenario today is one prompt and one answer. The only multi-turn support in `sk-create-manual-testing-playbook` is a `Turn | Exact user input` table, and the validator reads nothing from it except the Turn 1 cell, which it compares with the scenario prompt. No shipped scenario uses that table, and no script in the repository types into a live session. So a feature that only shows itself in the middle of a conversation cannot be proved by the playbook. Decision capture is the case that exposed this: it records the answers an operator gives to the questions a runtime asks, and its build was checked by single-prompt scenarios, never by an orchestrator playing the human through a series of timed turns.

### Purpose
Give the skill a conversation scenario kind and one shared runner. A scenario then scripts the human side of a conversation: what to type, how long to pause, which questions the subject should ask, how to answer each one and what state must hold after every turn. The runner drives a real interactive session of Claude Code, OpenCode, Codex, Pi or Devin through that script in a tmux pane, inside a scratch project, and keeps the evidence.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the conversation scenario contract: the orchestrator and subject roles, the fenced `json conversation` block, its turns with send delays, the expected questions with scripted answers, the per-turn state check and the evidence each turn leaves.
- Add validator rules for that block, with tests, and update the snippet template, `SKILL.md` and a new contract reference.
- Build one runner in the skill's `scripts/` folder that drives a runtime's interactive CLI in a tmux pane on a private socket, refuses to run outside a scratch project and cleans up every pane and process it started.
- Write one adapter per runtime for Claude Code, OpenCode, Codex, Pi and Devin, each fixed from a recorded live probe, with an honest feasibility note.
- Add one conversation scenario to the skill's own playbook and the guidance the decision-capture live test uses.

### Out of Scope
- The decision-capture conversation scenario itself. `specs/system-speckit/043-decision-capture/006-live-conversation-test` owns it and uses this runner.
- Adapters for Cursor and Hermes. No scenario needs them today, and adding one later is one adapter entry.
- Writing benchmark reports from a run. The skill's results contract keeps that a hand step, and the runner writes its evidence folder only.
- Running live runtimes in CI. A live run needs logged-in CLIs and spends model quota.
- Installing anything. tmux 3.8, `expect` and `script` are already on this machine, and the plan uses tmux only.

### Files to Change
Per-phase detail lives in each child's `plan.md`. Paths below are relative to `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` unless they start with `.skilled/`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `references/conversation-scenarios.md` | Create, then Modify | 001, 002 | Contract in 001. Running, per-runtime notes and live-test guidance in 002 |
| `assets/manual-testing-playbook-snippet-template.md` | Modify | 001 | Conversation Script subsection with a filled example |
| `SKILL.md` | Modify | 001, 002 | Conversation scenario rules, new checks, runner usage, version |
| `ROUTER.md` and `references/README.md` | Modify | 001 | Name the new reference |
| `scripts/validate-playbook-package.cjs` | Modify | 001 | Parse and check the conversation block, sync its first send |
| `scripts/tests/validate-playbook-package.test.cjs` | Modify | 001 | Clean case plus one failing case per rule |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Modify | 001 | Regenerated to list the new reference |
| `scripts/run-conversation-scenario.cjs` | Create | 002 | The runner and its five adapters |
| `scripts/tests/run-conversation-scenario.test.cjs` and `scripts/tests/fixtures/` | Create | 002 | Fake subject, recorded question screens, runner tests |
| `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md` | Create | 002 | MTP-007 |
| `manual-testing-playbook/manual-testing-playbook.md` and `README.md` | Modify | 002 | Index MTP-007 and list the runner |
| `changelog/v1.0.9.0.md` and `changelog/v1.1.0.0.md` | Create | 001, 002 | Release notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-scenario-contract/ | Define the conversation block, its validator rules and tests, the template and the contract reference | Complete |
| 2 | 002-conversation-runner/ | Build the tmux runner with its scratch guard, evidence and cleanup, five runtime adapters from live probes and the MTP-007 scenario | Complete |
| 3 | 003-conversation-adoption-research/ | Audit all 56 playbook packages for scenarios that should become conversations and rank them | Complete |
| 4 | 004-conversation-adoption-build/ | Build the ranked conversation scenarios, one child phase per skill or mode, and decide the runner gaps | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-scenario-contract | 002-conversation-runner | The validator accepts a valid conversation block, rejects each malformed shape and exports `parseConversationScript` for the runner | `node scripts/tests/validate-playbook-package.test.cjs` exits 0, and a fleet run reports the same package, violation and warning counts as before the change |
| 002-conversation-runner | 003-conversation-adoption-research | The runner plays MTP-007 live on all five runtimes and the style rule is written in the playbook mode's `SKILL.md` | `scratch/runs/matrix7/` holds five PASS results |
| 003-conversation-adoption-research | 004-conversation-adoption-build | `research.md` gives every package a verdict and ranks the candidates with a source and deciding question | `validate.sh --strict` on 003 prints `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Codex offers its question tool, `request_user_input`, only in Plan mode by default. Being done now (open-questions.md 1): enable `default_mode_request_user_input` only in the scratch project's Codex config (002 REQ-015).
- The 043/006 stage marks are settled in `decision-record.md` ADR-002: DEVIATION is a turn FAIL with the deviation printed, N/A is a check exit 77 that skips one turn, and the runner writes `checkpoints.tsv`.
- Deep-research topic: review the conversation-scenario plan before building it, covering what to reuse or improve in sk-create-manual-testing-playbook, whether phases 001 and 002 should change, the per-runtime feasibility claims and the runner's fit with 043/006.

### Research Context

Deep research is active for this topic (3 iterations, cli-pi `deepseek-v4.1-flash-1017`, thinking `max`). `research/research.md` is the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- Keep both phases and their order; split neither. Re-order 002's tasks so the fake-subject core reaches M2 before the five live probes.
- 001 must mask the `json conversation` block before `verdictChecks` and `evergreenChecks`, which scan raw text, so a `check` that greps for `BLOCKED` does not fail as `FORBIDDEN_VERDICT`.
- 002's REQ-008 `git status --ignored` snapshot cannot see an append to an existing ignored queue file and collapses fully ignored folders; hash file contents instead.
- 002 should bound `check` and `setup` in time and include the runner's own children in the cleanup survivor check.
- Every adapter launch flag exists in the installed CLIs; dialog keys still need the T001 probes. A scratch project outside the repository loses repo-local runtime config, so `setup` must carry it.
- The runner cannot yet express five 043/006 needs: DEVIATION and N/A marks with retry-once, S0 without a human turn, S8 compact plus send, S12 in a second scratch project inside one scenario, and seeded think-time jitter. Decide these before 001 freezes its closed key set.
<!-- END GENERATED: deep-research/spec-findings -->

The findings above are folded into the children: 001 REQ-003 and REQ-010, 002 REQ-003, REQ-006 to REQ-009 and REQ-013 to REQ-015, and the five 043/006 needs settled in `decision-record.md` ADR-002.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Decision record**: See `decision-record.md` for the operator's answers and the cross-phase format decision
- **First consumer**: `specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
