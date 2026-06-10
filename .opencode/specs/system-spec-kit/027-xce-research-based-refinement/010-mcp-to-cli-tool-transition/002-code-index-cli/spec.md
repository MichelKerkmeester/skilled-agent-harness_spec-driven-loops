---
title: "Code-Index CLI Workstream"
description: "Phase-parent packet for the code index cli: CLI-fallback feasibility research for the mk_code_index MCP server (8 tools), followed by implementation phases if the verdict is GO."
trigger_phrases:
  - "code index cli feasibility"
  - "code graph cli fallback"
  - "mk_code_index cli"
  - "028 002 research"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All phases complete; suites green; T9xx transport-down drill passed"
    next_safe_action: "Workstream complete"
    blockers: []
    key_files:
      - "spec.md"
      - "000-code-index-cli-research/spec.md"
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

# Feature Specification: Code-Index CLI Workstream (Phase Parent)

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

The mk_code_index MCP server (8 tools) is the structural-code-search backbone, but its only client surface is the MCP protocol layer: a mid-session transport disconnect removes the tools until restart (Code Graph showed "unavailable" at this session's own startup), every session pays schema token overhead, and hooks/cron/CI have no sanctioned shell path. The daemon architecture (launcher + IPC socket + owner lease, shared launcher-ipc-bridge.cjs) mirrors mk-spec-memory, whose CLI feasibility is already settled.

### Purpose

Settle CLI-fallback feasibility for mk_code_index with evidence, then deliver a dual-stack CLI (MCP stays registered) if the verdict is GO — mirroring the proven spec-memory workstream pattern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Phase 000: CLI-fallback feasibility research for mk_code_index (8 tools), leveraging the settled spec-memory record as prior art
- Later phases (created on a GO verdict): dual-stack CLI build, hardening/tests, runtime integration

### Out of Scope

- MCP removal — dual-stack throughout
- Daemon redesign — launcher, IPC bridge, and handlers stay unchanged

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 000-code-index-cli-research/** | Complete | Research phase: feasibility verdict (GO) |
| 001-cli-core/**, 002-hardening-and-tests/**, 003-runtime-integration/** | Complete | Implementation phases (see phase map) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Status | Scope |
|-------|--------|--------|-------|
| 000 | `000-code-index-cli-research/` | Complete | Feasibility research: GO for daemon-backed dual-stack CLI; 8/8 portable; D1–D10; 6–9d estimate |
| 1 | `001-cli-core/` | Complete | code-index CLI: all-8 manifest codegen, validateToolArgs parity, blocked-read rendering, exits, shim guards (~3.5–4.5d) |
| 2 | `002-hardening-and-tests/` | Complete | Regression-lock: dual-client, dual-spawn/respawn, blocked-read suite, all-8 parity (~1.5–2d) |
| 3 | `003-runtime-integration/` | Complete (T9xx transport-down drill passed: CLI dual-client ×3 rounds + warm-only no-spawn; bridge CLI/IPC route verified) | Pairing: hooks ×3 runtimes (CLI warm path), OpenCode plugin bridge REPAIR + CLI fallback, allowlists, dual-stack window (~1.5–2d) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phase 000 is the scope authority: implementation phases inherit its delta specs and measurements verbatim
- Runtime pairing rule (program-wide): phase 3 ships hooks for Claude Code/Codex plus the OpenCode plugin, warm-only

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000-code-index-cli-research | 001-cli-core | Research terminal: GO with delta specs pinned | `000-code-index-cli-research/research/research.md` |
| 001-cli-core | 002-hardening-and-tests | All 8 subcommands invocable; blocked-read renders blocked; exit matrix verified; auto-spawn from dead socket | Invocation matrix + drill |
| 002-hardening-and-tests | 003-runtime-integration | All suites green; zero orphans post-suite; parity locked at 8 | Full vitest run + process-table assertion |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Can mk_code_index be given a dual-stack CLI fallback with zero feature loss, and at what effort? — ANSWERED: GO; see `000-code-index-cli-research/research/research.md` and the findings fence in `000-code-index-cli-research/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `000-code-index-cli-research/spec.md` — research phase (verdict lands in its generated findings fence)
- `../001-spec-memory-cli/000-spec-memory-cli-research/research/research.md` — settled prior art (§1–14)
- `../context-index.md` — program reorganization bridge
