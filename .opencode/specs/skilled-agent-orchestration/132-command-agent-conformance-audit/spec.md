---
title: "Feature Specification: Command, agent, and asset conformance audit against current skill reality"
description: "Phase parent for Command, agent, and asset conformance audit against current skill reality"
trigger_phrases:
  - "command agent conformance audit"
  - "command asset alignment"
  - "doctor command audit"
  - "agent file drift"
  - "132-command-agent-conformance-audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "fable-5"
    recent_action: "All 6 phases complete; recursive strict validate 0/0"
    next_safe_action: "Program complete; no further action needed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remediation landed as one packet per surface (002-005), small per-finding commits within — default followed"
      - "README sweep: changed-surface set covered by phase 005, per the default; full-sweep not needed"
      - "Deep-research --variant xhigh/max took effect on all 3 providers; smoke-tested before each batch (001)"
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

# Feature Specification: Command, agent, and asset conformance audit against current skill reality

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Packet Type** | Phase parent (lean trio) |
| **Children** | 6 (001–006) |
| **Active Child** | 006-validation-closeout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill layer has moved substantially — parent hubs now own former standalone skills as modes, several command/agent/skill names changed, and one deep-loop command family was retired. The command surface (`.opencode/commands/**`: 42 `command.md`, 62 workflow/route YAML, 35 presentation `.txt`, compiled contracts), the agent surface (12 agents mirrored across `.claude/agents` and `.opencode/agents`), and the repo READMEs may still encode logic, dispatch paths, or enumerations that no longer match that reality. Stale references silently mis-route, dead command links point at commands that cannot be invoked, and cross-runtime agent bodies drift apart.

### Purpose
Verify that every command, agent, and command asset still expresses logic that aligns with the current skill reality; fix what has drifted; and bring the repo's authored READMEs into agreement with the corrected command/agent/skill surface. Success is a command/agent/asset/doctor surface whose every dispatch, enumeration, and cross-reference resolves to something real, proven by strict validation and by executing the read-only `/doctor` targets.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every `.opencode/commands/**` `command.md`, workflow/route `.yaml`, and presentation `.txt`, plus the deep compiled contracts (`deep/assets/compiled/*.contract.md`, `manifest.jsonl`)
- The whole `/doctor` subsystem: router, route manifest, per-target YAML, and diagnostic scripts (including proving the read-only targets run clean)
- All 12 agents in both runtime directories (`.claude/agents`, `.opencode/agents`) and their README indices
- Authored repo READMEs that describe command / agent / skill reality
- Remediation of every confirmed drift the audit surfaces

### Out of Scope
- Rewriting skill behavior itself (SKILL.md logic) — this audit aligns the *surface*, not the skills' internal logic
- Vendored / build / worktree READMEs (`node_modules`, `mcp-servers/*/node_modules`, `.worktrees`, `dist`, `.venv`)
- Per-directory dev-note READMEs deep inside `mcp_server/**`, `scripts/**`, `tests/**` that track code, not surface

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-conformance-deep-research/ | Deep-research audit (15 iterations, 3 executor batches) of every command, agent, and asset for logic alignment; produces ranked P0/P1/P2 findings | Complete |
| 2 | 002-remediation-slash-commands/ | Fix `command.md` logic + auto/confirm YAML + presentation `.txt` + compiled contracts across create / deep / design / memory / speckit / root commands | Complete |
| 3 | 003-remediation-doctor/ | Fix the `/doctor` router, route manifest, per-target YAML and scripts; execute the read-only targets to prove they run clean | Complete |
| 4 | 004-remediation-agents/ | Align the 12 agents across `.claude/agents` + `.opencode/agents` (cross-runtime body sync, tool grants, path/skill/model refs) | Complete |
| 5 | 005-readme-alignment/ | Align authored repo READMEs with the corrected command / agent / skill reality | Complete |
| 6 | 006-validation-closeout/ | Recursive strict validate, `/doctor` route-validate, advisor re-baseline, parent rollup | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-conformance-deep-research | 002-remediation-slash-commands | Deep-research synthesis exists with ranked findings partitioned by surface (commands / doctor / agents) | `research.md` synthesis present; findings triaged P0/P1/P2 |
| 002-remediation-slash-commands | 003-remediation-doctor | Command + asset findings fixed; changed files re-validate | `validate.sh --strict` on touched packets; affected `:auto`/`:confirm` render clean |
| 003-remediation-doctor | 004-remediation-agents | Doctor findings fixed; `route-validate` passes; read-only targets executed clean | `route-validate.sh` exit 0; each read-only `/doctor` target runs without error |
| 004-remediation-agents | 005-readme-alignment | Agent findings fixed; both runtimes body-synced; grants coherent | frontmatter-stripped body diff clean; agent README indices match on-disk roster |
| 005-readme-alignment | 006-validation-closeout | READMEs reflect the corrected surface; no stale enumeration or dead ref | targeted README review; grep for retired names/paths returns nothing |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

All three questions are RESOLVED; none remain open at close (see each child's own continuity for detail).

- **RESOLVED** — Remediation landed per-surface (one packet per phase 002-005), the default.
- **RESOLVED** — README sweep covered the changed-surface set via phase 005, the default; a full ~370-README sweep was not required.
- **RESOLVED** — The deep-research `--variant xhigh`/`--variant max` providers took effect on all 3 executor batches; each was smoke-tested before its batch (phase 001, REQ-005).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
