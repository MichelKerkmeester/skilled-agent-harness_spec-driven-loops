---
title: "Feature Specification: Create the sk-create-goal sk-doc mode that authors packet goals"
description: "Phase parent for sk-create-goal, an sk-doc creation mode that authors a packet's goal.md, top-level, phase parent and nested phase child, to the spec-kit goal contract."
trigger_phrases:
  - "060-create-goal-mode"
  - "sk-create-goal"
  - "create goal mode"
  - "author a packet goal"
  - "create:goal command"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode"
    last_updated_at: "2026-09-25T19:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned all nine phases; recursive strict validation passes"
    next_safe_action: "Plan phase 001: inventory the goal corpus, settle the mode contract"
    blockers: []
    key_files:
      - "specs/sk-doc/060-create-goal-mode/goal.md"
      - "specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md"
      - "specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the mode ship its own conformance checker, or is binding completeness a validator amendment for system-spec-kit?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: Create the sk-create-goal sk-doc mode that authors packet goals

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | None - this is a top-level phase parent |
| **Parent Packet** | sk-doc/060-create-goal-mode |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `sk-create-goal` ships as a routable sk-doc mode with a `/create:goal` command, a conformance check, a playbook and a changelog, and has authored one real packet goal end to end |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet goals already exist in this repository. A packet can carry a `goal.md` whose durable slice an operator sets as the session objective. A phase parent carries one parent goal, capped at 4,000 durable characters, plus a binding table that points at each phase child's own nested `goal.md`. The goal hooks print the chat slice to paste with `goal.cjs packet`. What nothing owns is the content. `create.sh --with-goal` and the inline renderer copy a template with placeholders, and the validator checks only two things: the parent budget, and that each binding row it finds resolves (`spec-doc-structure.ts:1050-1080`). A read-only audit of the live corpus, 286 goal documents, found the gaps this leaves. The parent goal of `specs/sk-git/028-crawlable-commit-history` measures 5,758 durable characters (`goal.cjs packet` reports `packet_budget=over`). A phase child in `specs/sk-design/018-sk-design-parent-v2` still carries the template's placeholder objective. The binding table in `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission` stops at phase 006 while phase 007 exists with no goal of its own. And one criterion can only be judged by opening other files. On top of that, `create.sh --phase --with-goal` scaffolds a goal into every child and none into the parent, so the one goal an operator actually sets has to be rendered by hand.

### Purpose
Give goal content an owner: an sk-doc creation mode, `sk-create-goal`, invoked through `/create:goal`, that authors a packet's `goal.md` to the spec-kit goal contract. It covers a top-level packet, a phase parent with its binding table, and each nested phase child. It keeps the parent inside its budget, keeps the binding complete, and hands the operator the chat slice to set. Rendering stays with system-spec-kit's template, and runtime binding stays with the goal hooks and the host's own goal command.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new nested workflow packet, `.skilled/skills/sk-doc/sk-create-goal/`, built to the `sk-create-skill` templates: `SKILL.md`, `README.md`, `references/`, `assets/` holding exemplars rather than a template of its own, `manual-testing-playbook/` and `changelog/`, plus `scripts/` if phase 001 confirms the conformance checker.
- Authoring standards for each part of a goal: the one-sentence objective, frozen decisions, three to seven criteria that can be checked without opening another file, the volatile log, and the voice.
- Parent and nested authoring: a binding table derived from the phase map, child goals derived from each phase's own spec, the precedence rule and the amendment rule, and a way to add a goal to a packet that has none.
- Keeping the parent in budget and handing it over: measure with `goal.cjs packet`, cut in the order the goal set-string playbook gives, and print the chat slice the operator pastes.
- `/create:goal`, authored through `sk-create-command` with its auto and confirm YAML and its presentation file, mirrored into every runtime command directory.
- Registration on every sk-doc hub surface, proven by replaying real requests through both routing stages.
- A changelog, `v1.0.0.0`, linked from the hub changelog.

### Out of Scope
- **Changing system-spec-kit.** The goal template, the renderer, `create.sh` and the validator stay as they are. The missing parent goal on the `--phase` path and the missing binding-completeness check go to that skill as amendments.
- **Runtime goal state.** Binding, injection, resend tracking, `/goal-opencode`, `/goal-pi`, `/goal-cursor` and the host's own goal command belong to the goal hooks.
- **Rewriting the existing goal corpus.** The mode is the deliverable. Using it on older packets is separate work, apart from the one real goal phase 009 authors to prove the accept path.
- **Session objectives typed in chat.** The mode writes files and hands over a slice; it never sets a session objective.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/` | Create | 002-006, 008, 009 | The mode packet |
| `.skilled/skills/sk-doc/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `SKILL.md`, `description.json`, `leaf-manifest.json` | Modify | 007-hub-routing-integration | Register and route the mode in both stages |
| `.skilled/commands/create/goal.md` and its three assets | Create | 008-command-and-playbook | The command, its YAML pair and its presentation file |
| `.skilled/skills/sk-doc/command-metadata.json`, `.skilled/commands/create/README.txt` | Modify | 008-command-and-playbook | Bind and index the command |
| `.claude/commands/create/goal.md`, `.codex/prompts/create-goal.md`, `.pi/prompts/create-goal.md`, `.cursor/commands/create-goal.md` | Create | 008-command-and-playbook | Runtime mirrors |
| `.skilled/changelog/sk-doc/create-goal`, a symlink to `../../skills/sk-doc/sk-create-goal/changelog` | Create | 009-verification-and-closeout | Release notes reachable from the hub, the way every sibling mode links its own |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-goal-inventory-and-mode-contract/ | Read only. Inventory the goal system and the live goal corpus, settle what the mode owns against system-spec-kit and the goal hooks, and fix the target tree | Complete |
| 2 | 002-mode-scaffold/ | Build the `sk-create-goal` packet to the create-skill templates, rendering through system-spec-kit's goal template and never a fork of it | Complete |
| 3 | 003-authoring-standards-and-exemplars/ | Quality rules for the objective, decisions and criteria, with good and bad exemplars taken from the live corpus | Complete |
| 4 | 004-parent-and-nested-goal-authoring/ | Parent directive and binding table from the phase map, child goals from each phase spec, precedence, amendment, and adding a goal to a packet that has none | Complete |
| 5 | 005-budget-and-chat-slice-handoff/ | Keep the parent within 4,000 durable characters, cut in the playbook's order, and hand the operator the chat slice without touching runtime state | Complete |
| 6 | 006-goal-conformance-check/ | A check for what the validator misses: an unbound phase, a leftover placeholder, a criterion count outside three to seven. Proven by negative controls | Complete |
| 7 | 007-hub-routing-integration/ | Every sk-doc hub surface, and aliases that catch goal authoring without capturing the session phrases the goal hooks own | Complete |
| 8 | 008-command-and-playbook/ | `/create:goal` through `sk-create-command`, its runtime mirrors, and the mode's manual testing playbook | Complete |
| 9 | 009-verification-and-closeout/ | Run the playbook, author one real goal end to end, measure newcomer reachability, ship the changelog, close the packet | Complete |
| 10 | 010-asset-templates-and-folder-readmes/ | Per-kind goal templates checked against `goal.md.tmpl`, code-folder READMEs and the references index removed | Complete |
| 11 | 011-cross-surface-references/ | Name the mode in the READMEs, the `@markdown` agent and the feature catalog, regenerate the advisor command bridges and update the command counts | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-goal-inventory-and-mode-contract | 002-mode-scaffold | The contract names what the mode owns, what it hands to system-spec-kit and the goal hooks, and the target tree | Every corpus defect the audit cites is reproduced by a command, and every owned or deferred item names its owner |
| 002-mode-scaffold | 003-authoring-standards-and-exemplars | The packet exists and conforms to the create-skill templates, with no forked goal template in it. It stays unregistered, so the parent-skill check's `6a` failure for the new child directory is expected and recorded, as `049-sk-create-frontmatter` phase 002 recorded it | The packaging gate reports PASS, and the parent-skill check fails on `6a` for `sk-create-goal` and nothing else |
| 003-authoring-standards-and-exemplars | 004-parent-and-nested-goal-authoring | Each standard names the failure it prevents, and a real corpus example shows it | The rubric flags the known-bad corpus examples and passes the known-good ones |
| 004-parent-and-nested-goal-authoring | 005-budget-and-chat-slice-handoff | A parent and its children can be authored with every phase bound | A fixture packet validates with every phase child listed and no `SPECDOC_SUFFICIENCY_006` |
| 005-budget-and-chat-slice-handoff | 006-goal-conformance-check | An over-budget parent can be cut without losing a criterion, and the chat slice is printed | `goal.cjs packet` reports the cut fixture within budget with its criterion count unchanged |
| 006-goal-conformance-check | 007-hub-routing-integration | The check catches each defect it claims to catch | Each negative fixture fails for its named reason and the positive fixture passes |
| 007-hub-routing-integration | 008-command-and-playbook | The mode is reachable in both routing stages, not merely registered, and the `6a` failure recorded in phase 002 is closed | Advisor to sk-doc to `sk-create-goal` on real requests, with out-of-domain replays not reaching the mode; the parent-skill check on the sk-doc hub path reports OK |
| 008-command-and-playbook | 009-verification-and-closeout | The command resolves on every runtime and the playbook package validates | The command mirrors resolve and the playbook validator reports PASS |
| 009-verification-and-closeout | 010-asset-templates-and-folder-readmes | The mode is shipped and the operator asked for templates, READMEs and the index removal | `node --test` 15 of 15, guard fresh, recursive strict `RESULT: PASSED` |
| 010-asset-templates-and-folder-readmes | 011-cross-surface-references | The templates shipped and the operator asked for the mode to be named wherever its siblings are | Recursive strict `RESULT: PASSED` with phase 010 committed |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Answered by phase 001: both. The mode ships its own conformance checker, as `sk-create-repo-rule` ships `check-repo-rules.cjs`, and phase 006 records a binding-completeness amendment request for system-spec-kit's validator without changing it. The reasoning is in `001-goal-inventory-and-mode-contract/mode-boundary.md` section 5.
- Which aliases catch "write a goal for this packet" without capturing "set the goal" or "resend the goal", which system-spec-kit's HOOKS intent and the goal hooks already answer? Phase 007 settles it by replay.
- Answered in planning: adding a goal to an existing packet is its own operation, because `create.sh --phase --with-goal` never scaffolds the parent goal. Phase 004's `spec.md` carries the decision; phase 004 confirms it when it runs.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Packet goal**: See `goal.md` for the durable directive and the binding table
- **Audit evidence**: See `001-goal-inventory-and-mode-contract/scratch/` for the two read-only audits this decomposition was built from
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
