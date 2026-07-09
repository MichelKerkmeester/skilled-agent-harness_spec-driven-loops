---
title: "Implementation Plan: Post-Remediation Dual-Pass Deep Review"
description: "How the dual-pass review runs: two parameterized cli-opencode deep-review drivers (both MiMo-v2.5-pro, 5 iterations each) over skill:deep-improvement, each writing its own review packet under 015, then a run-to-run comparison synthesis. Read-only; no source mutation. (MiniMax-M3 was planned then aborted, replaced with a second MiMo pass.)"
trigger_phrases:
  - "post-remediation deep review plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the dual-model review plan"
    next_safe_action: "Await both loops; synthesize reports + comparison"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-remediation-deep-review"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Post-Remediation Dual-Model Deep Review

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two parameterized cli-opencode deep-review drivers run over `skill:deep-improvement`, both **MiMo-v2.5-pro** (`--variant high`), 5 iterations each: run 1 → `review-mimo-v25pro/`, run 2 → `review-mimo-v25pro-run2/`. Each driver mirrors the deep-review `auto.yaml` main-loop contract — per-iteration fresh-context dispatch, write the canonical packet (config/state/registry/deltas/iterations/dashboard), check convergence — and gives extra scrutiny to the just-shipped v1.11.1.0 remediation files. After both passes finish, each gets a synthesized `review-report.md` and the two are compared into a combined verdict measuring run-to-run finding stability.

### Technical Context
The review target is the committed v1.11.1.0 deep-improvement skill (suite 358/0 + drift 4/4 green). Dispatch uses `opencode run --model <id> --format json --dangerously-skip-permissions --pure --dir <repo>` with closed stdin; `--pure` keeps each dispatch independent of the (currently flaky) MCP servers. Live model id confirmed via `opencode models`: `xiaomi-token-plan-ams/mimo-v2.5-pro`. (A `minimax-coding-plan/MiniMax-M3` pass was planned then aborted by the operator and replaced with a second MiMo pass.)

### Overview
Get two independent MiMo passes over the remediated skill cheaply, compare their findings for run-to-run stability, and confirm no regression slipped through — without mutating the skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
Both providers authed (Xiaomi + MiniMax Token Plan); live model ids confirmed; the driver syntax-checks clean; the 015 phase home exists.

### Definition of Done
Both loops complete their iterations; each writes a packet + a synthesized `review-report.md`; a cross-model comparison records overlap / model-unique findings / verdict; `git status` shows only `015/` review artifacts (read-only confirmed).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-iteration fresh-context dispatch driven by a parameterized Node driver that owns state (config/state/registry/deltas/dashboard) and convergence, mirroring the command-owned `deep-review` loop shape for a single cli-opencode executor.

### Key Components
The parameterized driver (`/tmp/dr-driver.cjs`); two MiMo dispatches (`xiaomi-token-plan-ams/mimo-v2.5-pro --variant high`, two fresh sessions); the deep-review packet conventions; per-pass `review-mimo-v25pro*/` output dirs under 015.

### Key Decisions
- **Two MiMo passes, run-to-run stability.** The operator aborted the planned MiniMax-M3 pass and replaced it with a second MiMo pass; comparing two fresh MiMo runs measures finding stability (a non-deterministic reviewer should still re-surface the stable, real issues).
- **`--pure` dispatch.** The review only needs Read/Grep/Bash/Write; `--pure` drops the MCP/plugin runtime so the dispatch is immune to the flaky code-graph/skill-advisor servers.
- **Read-only, no worktree.** The loop writes only its own `015/review-*/` packet, so RM-8 worktree isolation is unnecessary (unlike a write-capable remediation dispatch).
- **Per-pass dirs under one phase.** Keeps both reports side-by-side for direct comparison; run 2 follows run 1 (shared Xiaomi quota).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- This phase writes ONLY review artifacts under `015/review-mimo-v25pro/` and `015/review-mimo-v25pro-run2/`.
- The review TARGET (read-only) is the deep-improvement skill — primarily the v1.11.1.0 remediated files (grader, live-executor, dispatch-model, score-model-variant, score-skill-benchmark, d4-ablation, sweep-benchmark, SKILL.md, README.md, scoring_contract.md, changelog).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Confirm provider auth + live model ids; parameterize the driver (model/variant/output-dir/session/iterations); create the 015 phase home.

### Phase 2: Core Implementation
Run both MiMo passes (run 2 after run 1, shared Xiaomi quota). Each runs 5 risk-ordered iterations (inventory+correctness → correctness → security → traceability → maintainability), dispatching MiMo per iteration with extra scrutiny on the remediation files, writing iteration narratives + delta findings + state + dashboard. (The originally-planned MiniMax-M3 pass was aborted after MiMo run 1 and replaced with MiMo run 2.)

### Phase 3: Verification
On completion, synthesize each pass's `review-report.md` from its registry; build the run-to-run comparison (agreement vs pass-unique findings, per-pass + overall verdict); confirm read-only (`git status` shows only `015/`); finalize the phase docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code under test — this is a review activity. Validation is operational: both loops produce well-formed packets (parseable state/registry), the dashboards show per-iteration findings, and the read-only invariant holds (`git status` shows only `015/` artifacts; the deep-improvement skill is unchanged after the run).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The authed Xiaomi Token Plan provider (both MiMo passes), the cli-opencode dispatch contract, the deep-review packet conventions, and the committed v1.11.1.0 deep-improvement skill as the read-only review target.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing to roll back — the review is read-only and only adds `015/` artifacts. If a loop misbehaves, kill the background task; the partial packet persists and the report is synthesized from whatever the registry holds (gap noted). Discarding the phase is `rm -rf 015/` if desired.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (auth + driver + home) → 2 (run 1, then run 2 after the MiniMax abort) → 3 (synthesize per-pass reports + run-to-run comparison). Phase 3 depends on both passes completing (or being stopped with partial state).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small for the operator (driver param + launch + synthesis); the review effort is the two MiMo passes' (10 dispatches total, ~3-4 min/iteration each, run 2 after run 1).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
Providers authed; live model ids confirmed; driver syntax clean; deep-improvement skill committed + green at review start.

### Rollback Procedure
Kill the background drivers if needed; the review is read-only so the skill is untouched. Remove `015/` to discard the phase.

### Data Reversal
None — review artifacts only; no source or persisted-state changes.
<!-- /ANCHOR:enhanced-rollback -->
