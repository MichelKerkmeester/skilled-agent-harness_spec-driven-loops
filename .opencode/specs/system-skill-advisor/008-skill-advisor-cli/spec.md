---
title: "Skill-Advisor CLI Workstream"
description: "Phase-parent packet for the skill advisor cli: CLI-fallback feasibility research for the mk_skill_advisor MCP server (9 tools), followed by implementation phases if the verdict is GO."
trigger_phrases:
  - "skill advisor cli feasibility"
  - "skill advisor cli fallback"
  - "mk_skill_advisor cli"
  - "028 003 research"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-cli"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All phases complete; tri-daemon gate + T9xx transport-down drill passed"
    next_safe_action: "Workstream complete"
    blockers: []
    key_files:
      - "spec.md"
      - "000-skill-advisor-cli-research/spec.md"
    completion_pct: 100
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

# Feature Specification: Skill-Advisor CLI Workstream (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-09 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mk_skill_advisor MCP server (9 tools: 4 advisor + 5 skill_graph) powers Gate-2 routing and the prompt-submit advisor brief, but the MCP surface has the same transport fragility class as the other servers - and this system already shipped a partial answer: skill_advisor.py (3,642 lines) is the documented Gate-2 fallback covering advisor_recommend via a DIVERGENT Python scorer with a native-bridge probe, while advisor_rebuild and 4 of 5 skill_graph tools have no CLI at all. Six orphaned mk-skill-advisor launchers were observed on this host - the lifecycle question is live here.

### Purpose

Settle CLI-fallback feasibility for mk_skill_advisor with evidence, then deliver a dual-stack CLI (MCP stays registered) if the verdict is GO — mirroring the proven spec-memory workstream pattern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Phase 000: CLI-fallback feasibility research for mk_skill_advisor (9 tools), leveraging the settled spec-memory record as prior art
- Later phases (created on a GO verdict): dual-stack CLI build, hardening/tests, runtime integration

### Out of Scope

- MCP removal — dual-stack throughout
- Daemon redesign — launcher, IPC bridge, and handlers stay unchanged

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 000-skill-advisor-cli-research/** | Complete | Research phase: feasibility verdict (GO) |
| CLI entrypoint + shim for mk_skill_advisor | Complete | Created on the GO verdict, scoped by the research |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Status | Scope |
|-------|--------|--------|-------|
| 000 | `000-skill-advisor-cli-research/` | Complete | Feasibility research: GO for additive 9-tool CLI; skill_advisor.py reconciled as facade; D1–D8; 3 packets |
| 1 | `001-cli-core/` | Complete | skill-advisor CLI: 9-subcommand Zod codegen, trusted-caller fail-closed gate on mutations, IPC + auto-spawn, exits |
| 2 | `002-hardening-and-tests/` | Complete (tri-daemon program gate passed) | Parity + lifecycle lock: 10-prompt Python parity fixture, rebuild/scan wall-time MEASURED, orphan-reaping fixtures, dual-client |
| 3 | `003-runtime-integration/` | Complete (T9xx transport-down drill passed: Claude+Codex hooks 9/9 each, fail-open, no cold spawn) | Pairing: prompt-submit hooks ×3 runtimes (CLI warm path under <60ms bar; 824.8ms one-shot ban), plugin bridge CLI fallback, doctor routes, docs |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phase 000 is the scope authority: implementation phases inherit its delta specs and measurements verbatim
- Runtime pairing rule (program-wide): phase 3 ships hooks for Claude Code/Codex plus the OpenCode plugin, warm-only

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000-skill-advisor-cli-research | 001-cli-core | Research terminal: GO with delta specs pinned | `000-skill-advisor-cli-research/research/research.md` |
| 001-cli-core | 002-hardening-and-tests | 9/9 invocable; mutating commands fail closed untrusted; exit matrix verified | Invocation matrix + refusal test |
| 002-hardening-and-tests | 003-runtime-integration | All fixtures green incl. parity; zero orphans; job semantics documented with measurements; tri-daemon drill passed | CI fixture run + process-table assertion + drill log |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Can mk_skill_advisor be given a dual-stack CLI fallback with zero feature loss, and at what effort? — ANSWERED: GO; see `000-skill-advisor-cli-research/research/research.md` and the findings fence in `000-skill-advisor-cli-research/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `000-skill-advisor-cli-research/spec.md` — research phase (verdict lands in its generated findings fence)
- `../001-spec-memory-cli/000-spec-memory-cli-research/research/research.md` — settled prior art (§1–14)
- `../context-index.md` — program reorganization bridge
