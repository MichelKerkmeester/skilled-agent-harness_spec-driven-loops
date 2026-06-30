---
title: "Implementation Plan: Phase 1 — Headroom Utilization Research"
description: "Configure and run a single-lineage 20-iteration deep-research loop (GPT-5.5 xhigh fast via cli-codex) over the vendored Headroom repo and our stack, then synthesize a cited research.md with an integration-fit matrix and ranked recommendation."
trigger_phrases:
  - "headroom research plan"
  - "headroom deep research loop"
  - "029 research plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-headroom-utilization/001-research"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Converged the deep-research loop and synthesized research.md"
    next_safe_action: "Human review of the ranked adoption recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-001-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Headroom Utilization Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (`/deep:research:auto`) over `deep-loop-runtime` |
| **Executor** | `cli-codex` — GPT-5.5, `model_reasoning_effort=xhigh`, `service_tier=fast` |
| **Storage** | `research/` JSONL state + `iterations/` + merged `research.md` |
| **Testing** | 1-iteration smoke check + cap/convergence verification + `validate.sh` |

### Overview
Run one deep-research lineage of up to 20 iterations with GPT-5.5 (xhigh, fast) over two co-located bodies of evidence — the vendored Headroom repo at `../external/` and our own `.opencode/` stack — and synthesize a cited `research/research.md` containing an integration-fit matrix (Headroom surface × our subsystem), a risk register, and a ranked adoption recommendation. Research-only: nothing is installed or wired.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `codex` installed and authenticated (ChatGPT OAuth confirmed; gpt-5.5 reachable)
- [x] `deep-research-config.json` written with the cli-codex executor block (gpt-5.5/xhigh/fast, maxIterations 20)
- [x] `deep-research-strategy.md` seeded with the charter (key questions, non-goals, stop conditions)

### Definition of Done
- [x] Loop reached convergence or `maxIterationsReached` at 20 (`deep-research-state.jsonl`)
- [x] `research/research.md` produced with citations to both `../external/` and `.opencode/`
- [x] Integration-fit matrix + risk register + ranked recommendation present for the review gate
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage iterative loop → fresh context per iteration → externalized JSONL state → convergence detection → synthesis.

### Key Components
- **`/deep:research:auto`**: owns init, dispatch, convergence, synthesis, continuity save.
- **`fanout-run.cjs`** (single cli-codex lineage): the YAML-sanctioned CLI dispatch path; spawns `codex exec` per iteration with the resolved executor flags.
- **Reducer**: maintains strategy.md machine sections, findings registry, dashboard.

### Data Flow
`../external/` + `.opencode/` evidence → each iteration reads state, picks one focus, writes `iterations/iteration-NNN.md` + appends JSONL → synthesis merges into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase runs a research job and writes only under `research/`. No production code, schema, or policy surfaces are touched, and the vendored `../external/` tree is read-only.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/` artifacts | research output | create | files present post-run |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm codex auth (ChatGPT OAuth) and gpt-5.5 reachability
- [x] Write `research/deep-research-config.json` (cli-codex gpt-5.5/xhigh/fast, maxIterations 20)
- [x] Seed `research/deep-research-strategy.md` charter (8 key questions, non-goals, stop conditions)

### Phase 2: Core Execution
- [x] 1-iteration smoke check that codex exec writes an iteration file + JSONL delta
- [x] Launch the 20-iteration loop in the background via `/deep:research:auto` (cli-codex)
- [x] Let the loop converge or hit the 20-iteration cap

### Phase 3: Verification
- [x] Verify terminal `stopReason` in `deep-research-state.jsonl`
- [x] Verify `research/research.md` exists with citations + the integration-fit matrix + risk register + recommendation
- [x] Run `validate.sh` on the child; STOP for human review of the recommendation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | codex executor wiring | 1-iteration run, check artifacts |
| Integration | Full loop + synthesis | `/deep:research:auto`, `fanout-run.cjs` |
| Manual | Cap/convergence + spec validation | grep/jq on state JSONL, `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` (GPT-5.5) | External | Green | No research loop |
| codex ChatGPT OAuth + gpt-5.5 access | External | Yellow | Loop fails at iteration 1 |
| `deep-loop-runtime` loop engine | Internal | Green | No iterative research |
| Vendored `../external/` corpus | Internal | Green | No research subject |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor wiring fails, OAuth lacks gpt-5.5, or the loop cannot make progress.
- **Procedure**: Research artifacts are isolated under `research/`; SIGTERM the background runner (it flushes a partial summary), delete the run dir, and re-launch. No external state or vendored upstream is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->
