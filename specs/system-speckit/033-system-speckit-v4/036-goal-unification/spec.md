---
title: "Feature Specification: Goal unification"
description: "Phase parent that makes the packet goal.md the single goal surface for every runtime: frontmatter-free chat sends, automatic parent updates with resend, and the goal hook rebuilt on spec-kit nesting."
trigger_phrases:
  - "goal unification"
  - "goal hook refactor"
  - "packet goal single source"
  - "goal.md frontmatter strip"
  - "goal state store retirement"
  - "goal command every runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification"
    last_updated_at: "2026-09-11T07:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the parent and seven children and authored the parent directive"
    next_safe_action: "Run 001-goal-unification-research"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 0
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

# Feature Specification: Goal unification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Predecessor** | 010-goal-file-addon, 029-goal-operator-resync-rule |
| **Successor** | None |
| **Handoff Criteria** | Every child Complete, `validate.sh --strict` recursive passes, goal hook and plugin suites green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three goal surfaces exist and nothing bridges them by code. The packet `goal.md` carries a durable directive with frontmatter, the cross-runtime goal hook keeps per-session JSON under `.opencode/skills/.state/goal/` and never reads `specs/`, and Claude Code sessions track goals in native memory files. The template and playbook tell an agent to resend the full text of the parent goal in chat, which includes frontmatter that burns the 4000-character objective cap and truncates the completion criteria. The resend rule is prose only, no speckit command reads or updates `goal.md`, and the shape and budget validator was deleted, so a parent can bind children whose goal files do not exist.

### Purpose
One goal surface. The packet `goal.md`, nested when the packet is phased and singular otherwise, becomes the source of truth the hook, the runtime commands and the speckit commands all read and write. Chat sends and prompt injections carry the durable slice without frontmatter and within budget. Spec-kit updates the parent goal when a durable fact changes, resends it, and keeps reminding without blocking work. Research decides the binding mechanism and the fate of the legacy store before any build phase starts.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deep research (15 sequential iterations, two models) into binding, strip, store fate, resend mechanics, runtime feasibility and budget
- Decision record freezing seven contracts before any code changes
- `goal.md.tmpl`, the set-string playbook, `spec-kit-docs.json` and a restored validator rule
- `goal-core.cjs` rebuilt on packet `goal.md` for read and write paths
- Goal commands and hooks for pi, opencode, cursor and devin; speckit-command and natural-language reach for Claude Code and Codex
- speckit plan, implement, complete, resume and save reading, updating and resending the parent goal
- Retirement or demotion of `.opencode/skills/.state/goal/`, docs, changelog and the verification sweep

### Out of Scope
- A new `/goal` command for Claude Code or Codex; both keep their native goal command
- Changes to the deep-loop runtime or the cli-pi model roster
- Rewriting the Claude Code native memory goal files; their fate is a research-decided documentation change only

### Files to Change
[Summary table of files touched across all phases — for audit trail only; per-phase detail lives in each child's plan.md]

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modify | 003 | Strip boundary, budget, resend wording |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | 003 | 4000 budget, cut order, dangling link |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modify | 003 | Restored goal shape and budget rules |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modify | 004 | Packet-backed read and write paths |
| `.opencode/hooks/goal/{pi,cursor}/*`, `.opencode/plugins/opencode-goal.js`, runtime command files | Modify/Create | 005 | Per-runtime surfaces |
| `.opencode/commands/speckit/*.md`, `assets/speckit-plan.yaml` | Modify | 006 | Goal read, update, resend, reminder |
| `.opencode/skills/.state/goal/`, `.opencode/hooks/goal/README.md`, `goal-plugin.md`, changelog | Modify/Delete | 007 | Retirement, docs, verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-goal-unification-research/ | 15 sequential research iterations: 10 deepseek-v4.1-flash, 5 glm-5.3-flash, via cli-pi and llmgateway, no early convergence | Complete |
| 2 | 002-decisions-and-contract-freeze/ | Seven ADRs frozen from the synthesis: binding, store fate, strip, resend, runtimes, budget, isolation reconciliation | Complete |
| 3 | 003-speckit-goal-contract/ | Template, playbook, contract JSON and restored validator rules | Complete |
| 4 | 004-goal-core-packet-backed/ | goal-core.cjs reads then writes packet goal.md as source of truth | Complete |
| 5 | 005-runtime-surfaces/ | Goal commands and hooks for pi, opencode, cursor, devin; speckit reach for Claude Code and Codex | Complete |
| 6 | 006-speckit-command-integration/ | speckit commands read, update, resend and remind on the parent goal | Complete |
| 7 | 007-retirement-docs-and-verification/ | Store retirement, READMEs, SKILL deltas, changelog, full verification and deep review | Complete |

| 8 | 008-hardening-research/ | Five-iteration hardening research and a second review; do-now rows built, do-next backlog recorded | Complete |
| 9 | 009-close-open-decisions/ | [Phase 9 scope] | Pending |
| 10 | 010-repo-wide-goal-research/ | [Phase 10 scope] | Pending |
| 11 | 011-goal-drift-remediation/ | [Phase 11 scope] | Pending |
| 12 | 012-open-items-research/ | [Phase 12 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` on a child folder to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-goal-unification-research | 002-decisions-and-contract-freeze | 15 iteration files, research.md and synthesis.md exist | Iteration count read from the state ledger, not the run summary |
| 002-decisions-and-contract-freeze | 003-speckit-goal-contract | Seven ADRs each with chosen option, rejected option and enforcement site | Parent goal resent if any decision wording changed |
| 003-speckit-goal-contract | 004-goal-core-packet-backed | Template, playbook and validator agree on strip boundary and budget | `validate.sh --strict` on 003 and a negative test on an over-budget goal |
| 004-goal-core-packet-backed | 005-runtime-surfaces | goal-core reads and writes packet goal.md with tests | `node --test` goal suites green |
| 004-goal-core-packet-backed | 006-speckit-command-integration | Same as above; 005 and 006 run in parallel | `node --test` goal suites green |
| 006-speckit-command-integration | 007-retirement-docs-and-verification | 005 and 006 both Complete | Recursive validate passes on 001 through 006 |
| 007-retirement-docs-and-verification | 008-hardening-research | 008 research and review syntheses exist; do-now rows built | Suites green after the build |
| 008-hardening-research | 009-close-open-decisions | [Criteria TBD] | [Verification TBD] |
| 009-close-open-decisions | 010-repo-wide-goal-research | [Criteria TBD] | [Verification TBD] |
| 010-repo-wide-goal-research | 011-goal-drift-remediation | [Criteria TBD] | [Verification TBD] |
| 011-goal-drift-remediation | 012-open-items-research | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which mechanism binds a session to a packet, and how do two sessions in one packet behave (research angle 1)
- Whether the legacy store is retired outright or demoted to a session-to-packet index (research angle 3)
- Whether the Claude Code native memory goal files stay as a mirror or retire (research angle 5)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
