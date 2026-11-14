---
title: "Feature Specification: Fix every contract defect in the eleven agent definition files, add an agent registry that generates the orchestrator rosters, bind agents to skills through skill routers, and remove template drift and duplicated text"
description: "Eleven agent definition files carry contract contradictions, hand-typed rosters that omit two agents, three ways of reaching skills, an outline that has drifted from the template and about a tenth of restated text. Six phases fix each and add the checks that stop it returning."
trigger_phrases:
  - "agent contract and registry alignment phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment"
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

# Feature Specification: Fix every contract defect in the eleven agent definition files, add an agent registry that generates the orchestrator rosters, bind agents to skills through skill routers, and remove template drift and duplicated text

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | None, this is the packet root |
| **Parent Packet** | agents/006-agent-contract-and-registry-alignment |
| **Predecessor** | 005-haiku-explore-and-context-agents |
| **Successor** | None |
| **Handoff Criteria** | Every child phase's `acceptance-criteria.md` says `Closeable: Yes` and `validate.sh --recursive --strict` prints `RESULT: PASSED` for the parent and all six children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The eleven files in `.skilled/agents/` define how every agent in this repository behaves, and an audit on 2026-11-14 found five kinds of defect in them. Eight statements contradict a permission or another statement, so an agent that follows its file cannot finish its workflow or its caller cannot parse the result. The list of agents is typed by hand in four places, and three of them omit `design` and `prompt-improver`, so the orchestrator cannot route to either. Agents reach skills in three different ways, and three agents hard-code paths to files inside a skill. Ten of the eleven files have drifted from the agent template's current outline, and about a tenth of the text restates itself. Only the runtime copies are checked in CI. Nothing checks the rosters, the cited skill paths or the outline, which is why each of these drifted without anyone seeing it. The audit also found that the Codex dispatch rule for inlining a persona can make a child refuse to read files while exiting 0.

### Purpose
Every agent file states one contract its permissions allow, reaches skills through their entry points, follows the template and says each rule once, and CI fails when a roster, a cited skill path or an outline drifts.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the eight contract contradictions and the stale wording in the agent files (phase 1)
- Add an agent registry and generate the orchestrator rosters and the README roster from it, so `design` and `prompt-improver` become routable (phase 2)
- Bind agents to skills through each skill's entry point and check that every cited skill path exists (phase 3)
- Bring the eleven files onto the agent template's outline and add a check that fails on drift (phase 4)
- Remove restated text without losing a rule, and hold the one shared block identical across files (phase 5)
- Add a tool-mapping line to the Codex persona-injection rule and prove it with a live dispatch (phase 6)

### Out of Scope
- Changing what any agent is for, or adding or retiring an agent
- Editing a skill's router, registry or reference files. A route a router cannot select is reported to the skill's owner
- Making the `/design:*` commands dispatch `@design`
- The frontmatter translation between runtimes, which `.skilled/bin/agent-mirror-crosswalk.md` already governs

### Files to Change

| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `.skilled/agents/*.md` | Modify | 1, 3, 4, 5 | Contracts, skill binding, outline and length |
| `.skilled/agents/agent-registry.json` | Create | 2, 4 | One record per agent, later with template exceptions |
| `.skilled/agents/README.txt` | Modify | 2 | Generated roster |
| `.skilled/bin/sync-agent-roster.cjs` and its vitest file | Create | 2, 3, 4, 5 | Writes rosters and checks rosters, skill paths, outlines and the shared block |
| `.github/workflows/agent-mirror-sync.yml` | Modify | 2 | Runs the check |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | 5 | Summary rule and the canonical shared block |
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | 6 | Tool-mapping rule and failure signature |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | 6 | Canonical persona-injection contract |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/` | Regenerate | 1 to 5 | Runtime copies of each changed agent file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-fix-agent-contract-contradictions/ | Make each agent file state one consistent contract: permissions, return values, step order, delegation and current wording | Complete |
| 2 | 002-agent-registry-and-generated-rosters/ | Add one agent registry and generate the orchestrator rosters from it, so `design` and `prompt-improver` become routable | Complete |
| 3 | 003-skill-binding-through-routers/ | Bind agents to skills through each skill's own entry point and router, and check that every cited skill path exists | Pending |
| 4 | 004-agent-template-conformance-and-drift-check/ | Bring the eleven files onto the agent template's current outline and add a check that fails when one drifts from it | Pending |
| 5 | 005-trim-duplicated-and-dead-agent-text/ | Remove restated summaries and repeated sections, and hold the one shared block identical across files | Pending |
| 6 | 006-codex-persona-tool-mapping/ | Add a tool-mapping line to persona injection so a Codex child given a read-only persona still reads files | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fix-agent-contract-contradictions | 002-agent-registry-and-generated-rosters | The eight contradictions are gone and the runtime copies match | `rg -n -e 'RETURN is .DONE.' -e 'Skip steps 3-5' -e 'Copilot profile' .skilled/agents` prints no line, and the mirror check exits 0 |
| 002-agent-registry-and-generated-rosters | 003-skill-binding-through-routers | The registry lists all eleven agents and the generated rosters match it | `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 |
| 003-skill-binding-through-routers | 004-agent-template-conformance-and-drift-check | Agents reach skills through entry points and every cited skill path exists | `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 with the path check on |
| 004-agent-template-conformance-and-drift-check | 005-trim-duplicated-and-dead-agent-text | Every agent file follows the template outline or holds a named exception | `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 with the outline check on |
| 005-trim-duplicated-and-dead-agent-text | 006-codex-persona-tool-mapping | Restated text is gone and no rule was lost | `scratch/removal-map.md` has a row per removed block, and the `wc -w` total for `.skilled/agents/*.md` is 50000 or lower |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Phase 2: a cheaper design checks the four hand-typed rosters against the directory and adds no registry. It stops the roster drift but leaves tier and dispatcher typed by hand. Operator answer: build the registry (2026-11-14).
- Phase 5: removing the eight closing summaries may change how well a model keeps its limits in mind. Operator answer: remove them and test three agents before and after (2026-11-14).
- Phase 3: whether the `sk-code` router can select the frontend visual references for a design task is not yet known. The phase tests it first and keeps any path the router cannot select.
- Phases 1 to 5 run in order because each edits sections the next one depends on. Phase 6 changes a different artifact and can run at any point.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
