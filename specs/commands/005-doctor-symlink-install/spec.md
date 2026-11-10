---
title: "Feature Specification: Doctor symlink and install commands: link Skilled into user project repos and guide setup"
description: "Two doctor commands that link the Skilled framework into a user's own project repository and guide a first-time install, wired into the helper, setup list, advisor and README."
trigger_phrases:
  - "doctor symlink install phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install"
    last_updated_at: "2026-10-31T14:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All three phases built, verified and strict-validated"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
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

# Feature Specification: Doctor symlink and install commands: link Skilled into user project repos and guide setup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/304-doctor-symlink-install` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | commands/005-doctor-symlink-install |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates `--strict` with `RESULT: PASSED` and its acceptance criteria are Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
People who use Skilled in their own project repositories link the framework in by hand, and two link shapes have grown up side by side. One repository links whole runtime folders at its root. Another keeps real runtime folders and links each entry inside them so its own commands and specs sit beside the links. Nothing checks either shape, and both repositories already hold broken links to Skilled paths that no longer exist. A new user has no guided way in.

### Purpose
Ship `/doctor:symlink`, which checks, links and unlinks the framework in a target repository in either shape behind a plan, a digest and one yes, and `/doctor:install`, a read-only guide that inspects a target repository and prints the ordered setup commands. Both are reachable from `/doctor:helper`, `/doctor:setup`, the skill advisor and the root README.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The symlink engine, its manifest, tests, router, workflows and presentation
- The install guide router, workflow and presentation
- Registration in the route manifest, setup list, advisor bridges, command index, root README, feature catalog, playbook and runtime mirrors

### Out of Scope
- Repairing the existing broken links in the operator's own repositories (the new command does that under the operator's yes)
- The stale targets in `.skilled/bin/relink-local-specs.sh`
- The project-root resolution defect for linked repositories, owned by `system-speckit/runtime-and-release/003-symlinked-runtime-root`; the install guide only warns about it

### Files to Change
Files touched across all phases, for the audit trail. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Create | 001 | Check, plan, apply and unlink engine |
| `.skilled/commands/doctor/symlink.md` + `assets/doctor-symlink-*` | Create | 001 | Router, workflows, presentation |
| `.skilled/commands/doctor/install.md` + `assets/doctor-install*` | Create | 002 | Read-only install guide |
| `.skilled/commands/doctor/_routes.yaml` | Modify | 003 | Four new routes |
| `README.md`, `.skilled/commands/README.txt` | Modify | 003 | Install section, doctor table and counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-symlink-engine-and-command/ | Symlink engine, manifest, tests and the `/doctor:symlink` router | Complete |
| 2 | 002-install-guide-router/ | Read-only `/doctor:install` guide | Complete |
| 3 | 003-integration-and-docs/ | Routes, advisor bridges, setup list, README, catalog, playbook, mirrors | Complete |
| 4 | 004-command-contract-and-readme/ | Command contract alignment, the root README setup section and the DOCTOR section | Complete |
| 5 | 005-central-doctor-playbook/ | One top-level doctor playbook, the moved scenarios and the re-pointed skill indexes | Complete |
| 6 | 006-doctor-helper-handoff/ | The advisor hands a reworded doctor problem to `/doctor:helper` | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-symlink-engine-and-command | 002-install-guide-router | The engine `check` subcommand is stable | `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` |
| 002-install-guide-router | 003-integration-and-docs | Both routers and workflows exist | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| 003-integration-and-docs | 004-command-contract-and-readme | Both commands are routed, bridged and mirrored | `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` |
| 004-command-contract-and-readme | 005-central-doctor-playbook | The command contract and README name both commands | `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type readme README.md` |
| 005-central-doctor-playbook | 006-doctor-helper-handoff | The central playbook indexes every doctor routing probe | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. Link shape (auto-pick), ignore location (`.git/info/exclude`) and run-record location (the checkout's `.skilled/output/doctor-symlink/`) are settled in the child contracts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
