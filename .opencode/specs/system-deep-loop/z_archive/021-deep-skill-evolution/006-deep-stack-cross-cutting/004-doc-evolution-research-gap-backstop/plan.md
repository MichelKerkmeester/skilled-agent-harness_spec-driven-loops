---
title: "Implementation Plan: deep-research gap backstop for 008 doc-evolution"
description: "Run a convergence-gated cli-devin SWE-1.6 deep-research loop to hunt residual documentation and reference-structure gaps across the 5 deep-* skills after the 008 pass, recording findings as a deferred backlog."
trigger_phrases:
  - "deep-research gap backstop plan"
  - "008 residual gap research plan"
  - "deep-skill doc-evolution backstop plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/006-deep-stack-cross-cutting/004-doc-evolution-research-gap-backstop"
    last_updated_at: "2026-05-25T18:48:00Z"
    last_updated_by: "main_agent"
    recent_action: "deep-research-loop-converged-negative"
    next_safe_action: "final-closeout-reindex-and-post-impl-deep-review"
    blockers: []
    key_files:
      - "research/deep-research-state.jsonl"
      - "research/deep-research-dashboard.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000901"
      session_id: "116-008-009-deep-research-gap-backstop"
      parent_session_id: "116-008-009-deep-research-gap-backstop"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1-Q5 residual-gap questions answered NEGATIVE across 2 iterations"
---
# Implementation Plan: deep-research gap backstop for 008 doc-evolution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON spec-kit artifacts; cli-devin SWE-1.6 as the iteration executor |
| **Framework** | deep-research loop driven by `deep-loop-runtime` (reduce-state.cjs + convergence vote) |
| **Storage** | Externalized JSONL state (`deep-research-state.jsonl`), per-iteration deltas, findings-registry.json |
| **Testing** | `reduce-state.cjs` state-integrity reduce + rolling-average newInfoRatio convergence gate |

### Overview
Run a convergence-gated deep-research loop that hunts for residual documentation and reference-structure gaps across the 5 deep-* skills after the 008 manual pass, then records any converged findings as a deferred backlog in `008/001-spec-and-resource-map/resource-map.yaml`. The loop is read-only: it reports findings and never implements fixes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state iteration loop: a LEAF research executor produces evidence, and a deterministic driver reduces that evidence into canonical state.

### Key Components
- **cli-devin SWE-1.6 executor**: reads the per-iteration prompt, sweeps the corpus read-only, and writes one iteration narrative.
- **Driver post-processor**: parses the narrative's machine block, appends the canonical `type:"iteration"` record, and writes the delta.
- **reduce-state.cjs**: reduces state + iteration files + strategy into findings-registry.json, the dashboard, and the resource-map.

### Data Flow
Prompt to agent narrative to driver-parsed JSON block to `deep-research-state.jsonl` + `deltas/iter-NNN.jsonl` to reduce-state to registry/dashboard to convergence vote (stop or continue).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a read-only research backstop. The only mutated surface outside its own `research/` artifacts is the 008 resource-map deferred backlog.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `008/001-spec-and-resource-map/resource-map.yaml` | 008 audit + deferred-backlog source of truth | update: add `phase5_backlog.loop_outcome_009` | yaml parses; node-read confirms the block |
| The 5 deep-* skills (`references/`, SKILL.md, README, catalog, playbook) | subjects of the sweep | unchanged (read-only) | 0 findings recorded; iteration narratives cite read-only evidence |

Required inventories: the iter-2 adversarial pass ran `rg`/`ls`/`find` across all 5 skills' references, SKILL.md/README links, agent mirrors, and command surfaces; 0 dangling, 0 orphan, 0 stale-flat paths.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Canonical INIT state files written (config, state.jsonl, anchored strategy, registry)
- [x] cli-devin agent-config recipe substituted + tightened to narrative-only writes
- [x] Iteration-1 prompt composed (RCAF, pre-planning, sequential_thinking, output contract)

### Phase 2: Core Implementation
- [x] Iteration 1: full residual-gap sweep (one-at-a-time, SIGKILL between)
- [x] Iteration 2: adversarial concrete re-verification (grep/ls/diff evidence)
- [x] Driver bookkeeping per iteration (state record + delta + reduce)

### Phase 3: Verification
- [x] Convergence vote (2 consecutive concrete negatives, newInfoRatio 0.0)
- [x] converged + synthesis_complete events; reduce-state COMPLETE
- [x] Documentation updated and findings merged into the 008 backlog
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | State integrity (no corrupt JSONL, valid records) | `reduce-state.cjs` fail-closed parse |
| Integration | Loop convergence (rolling-average newInfoRatio) | driver post-processor + convergence vote |
| Manual | Iteration narrative quality + evidence | direct read of `iterations/iteration-00{1,2}.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin SWE-1.6 | External | Green | Loop cannot run; verified logged-in at setup |
| sequential_thinking MCP | External | Green | Iteration reasoning degraded; registered at setup |
| `deep-loop-runtime/lib/deep-loop/` | Internal | Green | Reducer/convergence break; restored by the 273ae52e30 loop-driver fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A later audit shows the negative result was wrong, or the recorded backlog entry is inaccurate.
- **Procedure**: Remove the `phase5_backlog.loop_outcome_009` block from the 008 resource-map.yaml and delete this packet's `research/` artifacts; no production code changed, so rollback is documentation-only.
<!-- /ANCHOR:rollback -->
