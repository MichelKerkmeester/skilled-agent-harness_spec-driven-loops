---
title: "Research Plan: Skill & Advisor JSON Optimization"
description: "Three-lineage concurrent deep-research fan-out (SOL-high / GLM-5.2-high / Grok-4.5-high, 5 iters each, stop-policy max-iterations) across five dimensions, followed by cross-lineage synthesis into a ranked opportunity map."
trigger_phrases:
  - "skill json optimization research plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research"
    last_updated_at: "2026-07-29T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the 3-lineage fan-out plan"
    next_safe_action: "Launch the fan-out"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "029-skill-json-optimization-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Research Plan: Skill & Advisor JSON Optimization

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fan out three independent deep-research lineages, each on a distinct high-effort model, over the whole skill/advisor JSON surface. Force 5 iterations per lineage (no early convergence), run all three concurrently, then converge to a single cross-lineage synthesis that ranks the highest-leverage optimization, automation, effectiveness, testing, and integration gaps. Research only — no fix is implemented in this packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Iteration depth | 5/5 per lineage, all three concurrent |
| No early stop | `stop-policy=max-iterations` — convergence is telemetry only |
| Evidence | Every finding cites `file:line` or command/output |
| Coverage | All five dimensions and every in-scope JSON type addressed |
| Synthesis | Ranked opportunity map preserved with per-lineage evidence |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No production components. This is orchestration: three independent full research loops via the deep-loop fan-out driver (`fanout-run.cjs`, `loopType=research`), one per model, each writing to `research/lineages/{label}/`. Each lineage runs the standard deep-research state machine (config, JSONL deltas, strategy, iteration markdown, convergence telemetry) with fresh context per iteration. After all three finish, a synthesis pass merges their `research.md` outputs into one ranked report. The three executor lineages:

| Label | Kind | Model | Effort |
|-------|------|-------|--------|
| `sol-high` | cli-opencode | `openai/gpt-5.6-sol` | reasoningEffort high |
| `glm-high` | cli-devin | `glm-5-2` (GLM-5.2 High, free) | baked into uid |
| `grok-high` | cli-cursor | `cursor-grok-4.5-high` | baked into id |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Verify the fan-out driver's runtime deps resolve, capture a clean research baseline, and bind the run to this packet's `research/` artifact tree.

### Phase 2: Fan-out execution

Launch all three lineages concurrently (`concurrency=3`, `stop-policy=max-iterations`, 5 iterations each) over the five research dimensions. Each lineage converges independently to its own `research.md`.

### Phase 3: Synthesis

Merge the three lineages into one consolidated report ranking the highest-leverage gaps by dimension, mark cross-lineage agreement, and record per-lineage evidence. No fix is implemented; a ranked opportunity map is the deliverable.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The research itself is the test: three independent high-effort models at forced depth, each finding re-verified against source (`file:line`) before it counts. Cross-lineage agreement raises confidence; single-lineage claims are flagged as such in synthesis. No runtime behavior changes, so no code test suite applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The deep-loop fan-out runtime (`fanout-run.cjs` + `runtime/node_modules`), three external CLIs (cli-opencode, cli-devin, cli-cursor) with live auth, and the skill/advisor JSON surface under study.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research artifacts are additive docs under this packet's `research/` tree. Nothing outside the packet is modified; discarding the packet folder fully reverts the work. No code, contract, or generated file is touched.
<!-- /ANCHOR:rollback -->
