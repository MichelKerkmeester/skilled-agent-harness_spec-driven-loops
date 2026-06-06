---
title: "Implementation Plan: Skill-Advisor CLI Feasibility [system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/plan]"
description: "Single-execution research plan: one fan-out invocation, one cli-codex lane (gpt-5.5, high, fast), forced 10 iterations against the 10-KQ register."
trigger_phrases:
  - "skill advisor cli feasibility plan"
  - "skill advisor cli fallback plan"
  - "mk_skill_advisor cli plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research"
    last_updated_at: "2026-06-06T14:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Run complete; plan gates closed"
    next_safe_action: "Scaffold implementation phases on operator direction"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill-Advisor CLI Feasibility

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | deep-loop-runtime (Node CJS) orchestrating one cli-codex lane |
| **Framework** | deep-research fan-out (single lineage) |
| **Storage** | File-based JSONL state + registry under `research/` |
| **Testing** | `validate.sh --strict` + `orchestration-summary.json` lane outcome |

### Overview
One fan-out invocation runs a single gpt-5.5 (reasoning high, service tier fast) lane with a forced 10-iteration terminal cap against the 10-KQ register in spec.md, then the orchestrator compiles the verdict report. This packet ships research, not code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (verdict-shaped report, parity coverage, prior-art transfer)
- [x] Dependencies identified (codex CLI, OAuth)

### Definition of Done
- [x] REQ-001..REQ-003 in spec.md verified with evidence
- [x] Lane outcome verified via orchestration summary + state log (1/1, 10/10 iterations)
- [x] Docs reconciled and final strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-owned research loop with a single fan-out lineage (no application architecture changes).

### Key Components
- **Orchestrator**: init (lock, config, strategy, state log) → launch → monitor → synthesis.
- **Lane**: `fanout-run.cjs` single cli-codex subprocess; gpt-5.5, `-c model_reasoning_effort=high -c service_tier=fast`; 1500s per-iteration ceiling.
- **Compile**: lane writes `lineages/gpt/research.md`; orchestrator promotes/condenses into root `research/research.md` and the spec fence.

### Data Flow
Topic + 10-KQ register → 10 forced read-only investigation iterations → findings registry + lane synthesis → root research.md + generated spec-findings fence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: research-only packet; no bug fix, no code mutation. The lane is a read-only investigator; the only writes are workflow-owned artifacts under `research/` plus the bounded generated block in spec.md.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| research/** | workflow artifact tree | create (workflow-owned) | orchestration-summary.json + validate.sh |
| system-skill-advisor runtime | research subject | unchanged (read-only evidence source) | git status clean outside the packet |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet bootstrapped from v2.2 templates; jsons generated
- [x] Pre-run `validate.sh --strict` passes (2026-06-06, 0 errors 0 warnings)

### Phase 2: Core Execution
- [x] Launch the fan-out invocation (single lane, forced 10) — launched 2026-06-06T13:59Z
- [x] Monitor `research/orchestration-status.log` to completion — 1/1 succeeded

### Phase 3: Verification
- [x] Lane outcome verified; root research.md verdict-shaped
- [x] Reconciliation: tasks ticked, fence written, metadata regenerated, strict validation, memory save
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Lane health | 1 lane, exit codes, salvage | orchestration-status.log, orchestration-summary.json |
| Content | Verdict shape vs REQ-002/REQ-003 | Manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| codex CLI + ChatGPT OAuth | External | Green (proven today) | Lane cannot dispatch |
| deep-loop-runtime fan-out scripts | Internal | Green (4 successful runs today) | Fall back to native single-executor loop |
| Spec-memory research record | Internal | Green | Premise input for the lane |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Run produces unusable output or must be abandoned mid-flight.
- **Procedure**: Research-only rollback: stop the lane (pool SIGTERM honors salvage), archive `research/` outputs, revert packet docs via git. No production system is touched.
<!-- /ANCHOR:rollback -->
