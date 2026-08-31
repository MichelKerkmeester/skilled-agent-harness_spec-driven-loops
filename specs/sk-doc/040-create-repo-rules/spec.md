---
title: "Feature Specification: Create the sk-create-repo-rule sk-doc mode from the shipped repo-rules reference implementation"
description: "Phase parent for Create the sk-create-repo-rule sk-doc mode from the shipped repo-rules reference implementation"
trigger_phrases:
  - "040-create-repo-rules"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/040-create-repo-rules"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scaffolded the seven-phase decomposition around the reference implementation"
    next_safe_action: "Plan phase 002: distil the skill contract"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

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

# Feature Specification: Create the sk-create-repo-rule sk-doc mode from the shipped repo-rules reference implementation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None - this is a top-level phase parent |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `sk-create-repo-rule` ships as an advisor-routable sk-doc mode with a template, standards, a command, and a validated changelog |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repository now has a working repo-rules layer: a trigger-table router, eight rule files, a mandatory load gate, and per-section pointers from the always-loaded document into each rule that governs it. All of it was authored by hand, one decision at a time, and the knowledge of *how* to author one correctly - a rule's anatomy, which triggers are legitimate, what belongs in a rule versus in `AGENTS.md`, and the always-loaded-versus-triggered test that decides - exists only as the shape of the files that resulted. The next repository wanting a rule set, or the next rule added to this one, starts by reading eight examples and inferring the pattern.

### Purpose
Turn that inferred pattern into a `sk-doc` create mode: a skill that authors a repo rule to a template, against stated standards, wired into the router and the always-loaded document, with a command to invoke it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `.opencode/skills/sk-doc/sk-create-repo-rule/` nested workflow packet: `SKILL.md`, `README.md`, `references/`, `assets/`, `changelog/`, `manual-testing-playbook/`, `benchmark/`.
- A rule template capturing the anatomy the shipped set converged on: `Fires when` triggers, one binding rule sentence, an uppercase numbered body with dividers, and a closing self-check.
- Creation standards and an explicit do's-and-don'ts reference, including the test that decides whether a rule may exist at all: content that must bind on every turn cannot live behind a trigger.
- The `AGENTS.md` integration contract - how a generated rule earns its router rows, its pointer from the section it governs, and its place in the precedence ladder.
- One command, `/create:repo-rule`, authored through `sk-create-command` so it carries the router `.md` plus auto and confirm YAML like its siblings.
- Registration under the `sk-doc` hub: `mode-registry.json`, `hub-router.json`, `command-metadata.json`, `leaf-manifest.json`.
- A `changelog/` folder inside the mode, symlinked into `.opencode/changelog/sk-doc/` the way sibling modes are.

### Out of Scope
- **Authoring new rules for this repository** - the mode is the deliverable; using it is separate work.
- **A validator or CI check for rule-file conformance** - every prior phase excluded enforcement tooling, and nothing has changed that.
- **Changing any shipped rule** - phase 1 is the reference implementation and is closed.
- **Generalizing to non-repo-rules documents** - `sk-doc` already has modes for skills, commands, agents, READMEs and diagrams; this one is bounded to repo rules.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-repo-rule/` | Create | The mode packet |
| `.opencode/commands/create/repo-rule.md` plus assets | Create | The command and its YAML pair |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Register the mode |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Route to it |
| `.opencode/skills/sk-doc/command-metadata.json` | Modify | Declare the command |
| `.opencode/changelog/sk-doc/sk-create-repo-rule` | Create | Symlink to the mode's changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-repo-rules-router/ | The reference implementation: router, eight rules, the load gate, and per-section pointers - six phases of its own, shipped and validating. This is what the mode learns to generate | Complete |
| 2 | 002-inventory-and-skill-contract/ | Distil phase 1 into a contract: what a repo rule is, its anatomy, the boundary against sibling `sk-doc` modes, and the target tree | Complete |
| 3 | 003-skill-scaffold-and-template/ | Scaffold the packet; author `SKILL.md`, `README.md`, and the rule template | Complete |
| 4 | 004-creation-standards-and-guardrails/ | Creation standards plus do's and don'ts, including the always-loaded-versus-triggered test and the router's scope boundary | Complete |
| 5 | 005-agents-md-integration/ | The integration contract: router trigger and index rows, the pointer from the governed section, and where a rule sits in the precedence ladder | Complete |
| 6 | 006-command-and-hub-wiring/ | `/create:repo-rule` authored via `sk-create-command`; hub, mode-registry and command-metadata registration | Complete |
| 7 | 007-validation-and-changelog/ | Strict validation, the changelog folder and its symlink into `.opencode/changelog/sk-doc/`, advisor smoke test, closeout | Complete — advisor smoke test not run, accept path unexercised; see phase 007 |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-repo-rules-router | 002-inventory-and-skill-contract | The rule set ships and validates, giving phase 2 a working reference to distil from | `validate.sh --recursive --strict` passes for the packet and its six children |
| 002-inventory-and-skill-contract | 003-skill-scaffold-and-template | The contract names the anatomy, the boundary, and the target tree | Every element of the template traces to a shipped rule that uses it |
| 003-skill-scaffold-and-template | 004-creation-standards-and-guardrails | `SKILL.md` and the template exist and conform to `sk-create-skill` | The template produces a file matching phase 1's format assertions |
| 004-creation-standards-and-guardrails | 005-agents-md-integration | Standards state what a rule may not be, not only what it should be | Each refusal names the failure it prevents |
| 005-agents-md-integration | 006-command-and-hub-wiring | A generated rule has a documented path into the router and the always-loaded document | The contract reproduces the wiring phase 1 performed by hand |
| 006-command-and-hub-wiring | 007-validation-and-changelog | `/create:repo-rule` exists with its YAML pair and is registered in the hub | Command resolves in both runtime directories; hub entries present |
| 007-validation-and-changelog | — | The mode validates, the changelog is symlinked, and the advisor routes to it | `validate.sh --recursive --strict`; symlink resolves; advisor smoke test |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which child phase should execute first?
- What handoff criteria must each child satisfy?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
