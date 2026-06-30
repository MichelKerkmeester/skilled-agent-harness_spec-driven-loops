---
title: "Implementation Plan: Memory MCP to CLI Feasibility [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/plan]"
description: "Single-execution research plan: one /deep:start-research-loop:auto fan-out invocation with three CLI lanes (DeepSeek-v4-pro, MiniMax-M3, MiMo-V2.5-Pro), 5 forced iterations each, concurrency 2."
trigger_phrases:
  - "mcp cli feasibility plan"
  - "fan-out research plan"
  - "three lane research"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research"
    last_updated_at: "2026-06-06T12:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All four research runs complete (feasibility, design, risk resolution, risk closure)"
    next_safe_action: "Open the spec-memory CLI implementation packet via speckit:plan"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Memory MCP to CLI Feasibility

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | deep-loop-runtime (Node CJS) orchestrating cli-opencode lanes |
| **Framework** | `/deep:start-research-loop:auto` fan-out (one lineage per model) |
| **Storage** | File-based JSONL state + registries under `research/` |
| **Testing** | `validate.sh --strict` + `orchestration-summary.json` lane outcomes |

### Overview
One fan-out invocation runs three heterogeneous research lanes against the same topic, each with a forced 5-iteration terminal cap, then merges findings and compiles the verdict report. There are no implementation phases: this packet ships research, not code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (verdict-shaped report, parity coverage, lane state)
- [x] Dependencies identified (opencode CLI, three provider pools)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..REQ-003 in spec.md)
- [x] Lane outcomes verified via orchestration summary + per-lane state (3/3, 15/15 iterations)
- [x] Docs updated (spec/tasks/implementation-summary) and final strict validation passes (2026-06-06)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-owned research loop with fan-out lineages (no application architecture changes).

### Key Components
- **Orchestrator**: `/deep:start-research-loop:auto` resolves setup, spawns lanes, merges, compiles.
- **Lane pool**: `fanout-run.cjs` capped pool (concurrency 2), one opencode subprocess per lane; DeepSeek lane gets `--pure` natively; reasoning effort maps to `--variant high`.
- **Lanes**: deepseek (`deepseek/deepseek-v4-pro`), minimax (`minimax-coding-plan/MiniMax-M3`, 1500s per-iteration ceiling), mimo (`xiaomi-token-plan-ams/mimo-v2.5-pro`).
- **Merge + compile**: `fanout-merge.cjs` dedups findings by id with lineage attribution; reducer compiles `research.md`.

### Data Flow
Topic -> per-lane lineage configs (`research/lineages/{label}/`) -> 5 read-only investigation iterations per lane -> per-lane findings registries -> merged registry + attribution -> compiled `research/research.md` + generated spec-findings fence in spec.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: this packet is research-only (`research_intent=feasibility`), no bug fix, no code mutation. Lanes are read-only investigators; the only writes are workflow-owned artifacts under `research/` plus the bounded generated block in spec.md.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| research/** | workflow artifact tree | create (workflow-owned) | orchestration-summary.json + validate.sh |
| mk-spec-memory runtime | research subject | unchanged (read-only evidence source) | git status clean outside the packet |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet folder + four core docs authored from v2.2 templates
- [x] description.json + graph-metadata.json generated
- [x] Pre-run `validate.sh --strict` passes (2026-06-06, 0 errors 0 warnings)

### Phase 2: Core Execution
- [x] Launch the fan-out invocation (exact command in tasks.md T003 / approved plan file)
- [x] Monitor `research/orchestration-status.log` + per-lane iteration files to completion (3/3 succeeded)

### Phase 3: Verification
- [x] Merged registry + fanout-attribution.md present; research.md verdict-shaped
- [x] Per-lane iteration counts recorded (5/5/5); zero early stops; mimo cross-lane read documented
- [x] Reconciliation: tasks ticked, metadata regenerated, final strict validation PASSED, continuity saved via generate-context.js (full save: 6 files indexed, causal edges created, MCP not required)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Lane health | 3 lanes, exit codes 0/2/3, salvage sweeps | orchestration-status.log, orchestration-summary.json |
| Content | Verdict shape: parity matrix, loss table, go/no-go | Manual review against REQ-002/REQ-003 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode CLI 1.16.2 | External | Green | No lanes can run |
| deepseek-api / minimax-token-plan / xiaomi-token-plan pools | External | Green (smoke-tested 2026-06-06) | Affected lane fails; partial merge path applies |
| deep-loop-runtime fan-out scripts | Internal | Green | Fall back to three sequential single-executor loops |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Run produces unusable output or must be abandoned mid-flight.
- **Procedure**: Research-only rollback: stop lanes (pool SIGTERM honors salvage), delete or archive `research/` outputs, revert packet docs via git. No production system is touched.
<!-- /ANCHOR:rollback -->
