---
title: "Implementation Plan: Phase 1 — corpus research"
description: "Configure and run a four-lineage deep-research fan-out (20/15/8/7) over the external design corpus, then merge and verify the per-lineage iteration split."
trigger_phrases:
  - "corpus research plan"
  - "fan-out research plan"
  - "deep research lineages"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/001-corpus-research"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-1 plan"
    next_safe_action: "Verify prerequisites and write the fan-out config"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — corpus research

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research fan-out (`/deep:research`) over `deep-loop-runtime` |
| **Framework** | CLI executors: `cli-opencode` (GPT-5.5, MiMo, Kimi), `cli-claude-code` (Opus 4.8) |
| **Storage** | `research/` JSONL state + per-lineage dirs + merged `research.md` |
| **Testing** | Per-lineage cap verification + `validate.sh --recursive` |

### Overview
Run four independent research lineages in parallel — GPT-5.5×20, Opus-4.8×15, MiMo×8, Kimi×7 — each converging on its own iteration cap, then merge them into one cited `research.md` plus a findings registry. The heterogeneous model mix reduces single-model bias in the taxonomy + structural-model recommendation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] MiMo/Kimi opencode model ids confirmed from `sk-prompt-small-model/references/models/`
- [ ] Second Claude account `~/.claude-account2` authenticated
- [ ] Fan-out config written with per-lineage `iterations` set on every lineage

### Definition of Done
- [ ] Each lineage `deep-research-state.jsonl` reached its cap (`stopReason: maxIterationsReached`)
- [ ] `research/research.md` produced with citations
- [ ] Taxonomy + structural-model recommendation summarized for the review gate
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel fan-out → independent convergence → merge (no per-iteration model rotation).

### Key Components
- **Four lineages**: `gpt55fast` (20), `opus48-claude2` (15), `mimo25pro` (8), `kimi27` (7).
- **fanout-run.cjs**: spawns each lineage with its own `config.maxIterations` from the per-lineage `iterations` field.
- **fanout-merge.cjs**: merges lineage findings into `research.md` + findings registry.

### Data Flow
`external/` corpus → each lineage reads + iterates into `research/lineages/{label}/` → merge → `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase runs a research job and writes only under `research/`. No production code, schema, or policy surfaces are touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/` artifacts | research output | create | files present post-run |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm MiMo + Kimi opencode model ids
- [ ] Confirm `~/.claude-account2` is authenticated
- [ ] Write `research/deep-research-fanout-config.json` (per-lineage `iterations` 20/15/8/7)

### Phase 2: Core Implementation
- [ ] Smoke-test MiMo + Kimi lineages at 1 iteration
- [ ] Launch the four-lineage fan-out via `/deep:research`
- [ ] Let each lineage converge to its cap; merge lineages

### Phase 3: Verification
- [ ] Verify each lineage hit `maxIterationsReached` at its target count
- [ ] Verify `research/research.md` exists with citations
- [ ] Summarize taxonomy + structural recommendation; STOP for human review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | MiMo/Kimi executor wiring | 1-iter lineage run |
| Integration | Full fan-out + merge | `/deep:research`, fanout-merge.cjs |
| Manual | Cap verification + spec validation | `jq`/grep on state JSONL, `validate.sh --recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-loop-runtime` fan-out | Internal | Green | No multi-model research |
| `~/.claude-account2` | External | Yellow | Opus lineage cannot run |
| MiMo/Kimi opencode models | External | Yellow | Small-model lineages cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor wiring fails, or a lineage cannot reach its cap.
- **Procedure**: Research artifacts are isolated under `research/`; delete the run dir and re-launch. No external state is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
