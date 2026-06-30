---
title: "Plan: sk-design sub-skill reference and asset expansion research"
description: "Executed plan for a 2-lineage deep-research fan-out (10 Opus + 10 GPT-5.5) producing a per-mode reference/asset expansion matrix for the five sk-design sub-skills, grounded in the prior corpus research and the external corpus."
trigger_phrases:
  - "design subskill expansion research plan"
  - "sk-design reference asset fan-out plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/009-reference-asset-expansion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed the fan-out plan; research synthesized"
    next_safe_action: "Operator review, then a gated implementation phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-009-reference-asset-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design sub-skill reference and asset expansion research

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Framework** | CLI executors: `cli-claude-code` (Opus 4.8, account2), `cli-opencode` (GPT-5.5-fast) |
| **Storage** | `research/` JSONL state + per-lineage dirs + merged `research.md` |
| **Testing** | Per-lineage cap/convergence verification + `validate.sh --strict` |

### Overview
Run a heterogeneous 2-lineage deep-research fan-out so two different models investigate the same charter independently, then merge for cross-lineage confidence. The narrowed question is per-mode reference/asset leverage, not taxonomy (already settled by 001). Each iteration takes one mode focus, reads the live mode tree plus the primary corpus source, and emits a typed, sourced, severity-tagged matrix entry with a do-not-add list.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Second Claude account `~/.claude-account2` authenticated for the Opus lineage
- [x] Grounding inputs confirmed: `001-corpus-research/research/{research.md,gap-analysis.md}`, `external/`, live `sk-design/` tree
- [x] Fan-out config written with per-lineage `iterations` set on both lineages (10 + 10)

### Definition of Done
- [x] Each lineage `deep-research-state.jsonl` reached its cap or converged
- [x] `research/research.md` produced with a per-mode matrix and citations
- [x] Per-mode "do not add" lists and the priority ranking summarized for the review gate
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel fan-out (concurrency 2) → independent convergence → merge (no per-iteration model rotation).

### Key Components
- **Two lineages**: `opus48-claude2` (cli-claude-code, claude-opus-4-8, xhigh, 10) and `gpt55fast` (cli-opencode, openai/gpt-5.5-fast, xhigh, 10).
- **fanout-run.cjs**: spawns each lineage with its own `config.maxIterations` from the per-lineage `iterations` field (the global max-iterations is ignored in fan-out).
- **fanout-merge.cjs**: merges lineage findings into `research.md` + findings registry with lineage-agreement markers.

### Data Flow
`001-corpus-research/research/{research.md,gap-analysis.md}` + `external/` corpus + live `sk-design/` tree → each lineage reads + iterates into `research/lineages/<label>/` → merge → `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase runs a research job and writes only under `research/`. No production code, schema, or policy surfaces are touched. The live `sk-design/` tree is read-only here; expansion is the gated follow-up.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/` artifacts | research output | create | files present post-run |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `~/.claude-account2` is authenticated for the Opus lineage
- [x] Confirm grounding inputs (001 research + gap-analysis, external corpus, live sk-design tree)
- [x] Write `research/deep-research-fanout-config.json` (per-lineage `iterations` 10 + 10, concurrency 2)

### Phase 2: Core Implementation
- [x] Smoke-test 1+1 to confirm executor wiring, then archive the smoke artifacts
- [x] Launch the full 10+10 fan-out via `fanout-run.cjs`
- [x] Let each lineage converge or hit its cap; merge lineages via `fanout-merge.cjs`

### Phase 3: Verification
- [x] Verify both lineages produced valid iterations and reached their cap or converged
- [x] Verify `research/research.md` exists with the per-mode matrix and citations
- [x] Summarize matrix, priority ranking, and do-not-add lists; STOP for operator review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Opus/GPT executor wiring | 1+1 fan-out run |
| Integration | Full fan-out + merge | `fanout-run.cjs`, `fanout-merge.cjs` |
| Manual | Cap/convergence verification + spec validation | `jq`/grep on state JSONL, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-loop-runtime` fan-out | Internal | Green | No multi-model research |
| `001-corpus-research` research + gap-analysis | Internal | Green | Findings cannot be grounded |
| `~/.claude-account2` | External | Green | Opus lineage cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor wiring fails, or a lineage cannot reach its cap or converge.
- **Procedure**: Research artifacts are isolated under `research/`; delete the run dir and re-launch. No external state is mutated (the live `sk-design/` tree is read-only this phase), so rollback is a directory removal.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
