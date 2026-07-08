---
title: "Feature Specification: Reorganize sk-doc/assets - promote heavy-traffic templates to assets root, propagate references across 4 runtimes"
description: "Phase parent for Reorganize sk-doc/assets - promote heavy-traffic templates to assets root, propagate references across 4 runtimes"
trigger_phrases:
  - "068-sk-doc-organization"
  - "sk-doc assets reorganization phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Reorganize sk-doc/assets - promote heavy-traffic templates to assets root, propagate references across 4 runtimes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/068-sk-doc-organization |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All 3 phase children pass `validate.sh --strict` and ship clean diff to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-doc` skill's `assets/` directory has accreted a two-level hierarchy that no longer matches its access patterns. Two heavy-traffic groups — the `agent_template.md` / `command_template.md` files and the `feature_catalog/` / `testing_playbook/` package folders — sit one folder deeper than they need to be (under `assets/agents/` and `assets/documentation/` respectively). They are referenced from many places: sk-doc internal docs (~13 files), six `/create:*` commands replicated across four runtime trees with their YAML execution-path files (~30+ files), the `@create` agent across four runtimes (4 files), and an OpenCode setup install guide. Promoting these four items to `assets/` root and removing the now-empty `agents/` subfolder shortens every load path and removes the only one-template-deep subfolder.

### Purpose
Pure relocation + reference-string update across four runtime mirrors. No template content changes, no API changes, no architectural decisions. Decomposed into three phases because cross-runtime mirror parity is the highest-risk dimension and each phase has a natural validation boundary that supports surgical rollback.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Promote 4 asset items out of single-purpose subfolders (2 dirs + 2 files)
- Delete the now-empty `assets/agents/` folder physically (no archive, no `.bak`)
- Apply 4 fixed-string substring substitutions across `.opencode/.claude/.codex/.gemini` runtime trees
- Mirror parity preserved via bulk file copy (rsync) for `.opencode↔.claude↔.codex` and TOML regeneration for `.gemini`
- Final Opus verification gate via `@review` + `sk-code-review`

### Out of Scope (locked decisions)
- `barter/coder/` mirror tree (~30 parallel copies; user confirmed out-of-scope)
- `z_archive/` and historical iteration logs / research / review records (immutable history)
- `.opencode/skills/sk-doc/changelog/v1.1.3.0.md` and `v1.4.0.0.md` (preserve historical accuracy at release time)
- Build artifacts (`.tmp/`, `dist/`, `observability/*.jsonl`)
- Template byte-content (moved files preserve byte-identity)
- `decision-record.md` (pure relocation has no architectural decision)

### Files to Change (aggregate)
Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/assets/{feature_catalog,testing_playbook}/` | Move | 001 | Promoted from `documentation/` subfolder to `assets/` root |
| `.opencode/skills/sk-doc/assets/{agent,command}_template.md` | Move | 001 | Promoted from `agents/` subfolder to `assets/` root |
| `.opencode/skills/sk-doc/assets/agents/` | Delete | 001 | Empty after moves; physical rmdir |
| `.opencode/skills/sk-doc/{SKILL.md,references/,changelog/}` | Modify | 002 | 4 fixed-string substring substitutions |
| `.opencode/commands/create/{*.md,assets/*.yaml,README.txt}` | Modify | 002 | Canonical `/create:*` command surface |
| `.opencode/agents/create.md`, `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | 002 | Canonical `@create` agent + install guide |
| `.claude/commands/create/`, `.codex/prompts/create/`, `.claude/agents/create.md` | Replicate | 002 | rsync byte-identity copy from `.opencode/` |
| `.gemini/commands/create/*.toml`, `.gemini/agents/create.md`, `.codex/agents/create.toml` | Regenerate | 002 | TOML re-escape from updated `.opencode/` source |
| Spec folder docs | Modify/Create | 003 | implementation-summary, validate, graph-metadata refresh |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-relocate/ | Physical file moves: 2 dirs + 2 files promoted to `assets/` root; empty `agents/` subfolder physically deleted. Single cli-codex batched dispatch (`git mv` × 4 + `rmdir`). | Complete |
| 2 | 002-update-and-mirror/ | Reference-string sweep: 4 fixed-string substitutions across canonical `.opencode/`, then mirror replication via rsync to `.claude/`/`.codex/` and TOML regeneration for `.gemini/`. cli-codex executes; Claude audits 4-way mirror parity. | Complete |
| 3 | 003-verify-and-ship/ | Validation + Opus verification gate (@review + sk-code-review, fresh context, reruns validate.sh + rg in fresh shell). Implementation-summary, graph-metadata refresh, branch policy enforcement. | Complete |
| 4 | 004-remediation/ | Remediate 7-iter deep-review findings: fix P1 broken cross-link in `frontmatter_templates.md:770`, P2 outdated tree diagram in `quick_reference.md:174-188`, P2 illustrative `assets/agents/` examples in skill-creation guidance. Single small commit on main. | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-relocate | 002-update-and-mirror | 4 git mv operations succeed; `assets/agents/` physically deleted; new files visible at `assets/{feature_catalog,testing_playbook,agent_template.md,command_template.md}`; references still point to OLD paths (expected — Phase 002 fixes them). | `ls -la assets/`; `test ! -e assets/agents`; `git status --porcelain` |
| 002-update-and-mirror | 003-verify-and-ship | Zero residual `rg` hits in active scope; `.opencode↔.claude↔.codex` byte-identical via `diff -rq`; 4 `.gemini/*.toml` parse cleanly; `.codex/agents/create.toml` regenerated with sandbox + Path Convention preserved; canonical .opencode/install_guides/ + agent/create.md updated. | `rg --no-config --no-ignore-vcs 'assets/(documentation/(feature_catalog\|testing_playbook)\|agents/)'`; `diff -rq`; `python3 -c 'import tomllib; tomllib.loads(...)'` |
| 003-verify-and-ship | 004-remediation | (Phase 3 ship; deep-review run surfaced P1 + 2 P2 findings → 004-remediation triggered) | 7-iter cli-copilot deep-review → review-report.md → CONDITIONAL → REMEDIATE_AND_SHIP |
| 004-remediation | (final) | All deep-review findings resolved (P1-003-A link fix, iter4-F1 P2 tree rewrite, P2-003-A examples cleanup); validate.sh --strict still PASS | `rg`/manual link check; validate.sh --strict |
| 003-verify-and-ship | 004-remediation | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None — all scope/sequencing decisions resolved during planning. Reference plan: `/Users/michelkerkmeester/.claude/plans/reorganize-sk-doc-assets-by-promoting-dynamic-pearl.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
