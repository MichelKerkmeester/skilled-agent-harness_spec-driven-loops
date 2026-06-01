---
title: "Decision Record: Lane C Live Playbook Mode (Mode B)"
description: "Architectural decisions for the Lane C redesign: dual-mode playbook benchmarking, self-contained live dispatch + cross-model parsing, approximate D4 ablation, and the staged generator mutation boundary."
trigger_phrases:
  - "Lane C mode B decisions"
  - "skill-benchmark dual-mode decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR-001..004 for the Mode B build"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-live-playbook-mode"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Decision Record: Lane C Live Playbook Mode (Mode B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One playbook corpus, dual trace-mode (router CI gate + live default)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | User (dual-mode, live default), Claude |

<!-- ANCHOR:adr-001-context -->
### Context

The old Lane C graded skills with synthetic, decontaminated fixtures replayed by a deterministic router — artificial corpus, simulated execution, empty-gold scores. The skill's own `manual_testing_playbook` is the authored, live-execution contract.

### Constraints
- CI must stay deterministic + offline + free.
- Live dispatch is stochastic, costs API, needs auth, is slow.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: make the playbook the default corpus, scored in two trace-modes — `router` (deterministic CI gate, real-gold) and `live` (cli-opencode, operator default) — over one parser, reporting A↔B divergence.

**How it works**: `run()`'s internal fallback stays `router` so tests are deterministic; live is the operator-facing default (deferred until the live executor was stable). Browser scenarios run only in live mode.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dual-mode (chosen)** | real corpus + deterministic gate + live truth | two paths to maintain | 9/10 |
| Router-only over playbook | deterministic, cheap | never runs the skill live | 6/10 |
| Live-only | most real | breaks CI; costly | 3/10 |

**Why this one**: keeps the CI gate while exposing live behavior; A↔B divergence is itself the headline finding.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Real-gold scoring replaces empty-gold placeholders (router mode).
- Live mode measures what the skill actually does (CS-001 routed correctly live where router-replay did not).

**What it costs**:
- Two trace-modes + executors to maintain. Mitigation: one shared parser + one observed-result contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared change breaks 200+ tests | H | back-compat adapters; 245 green |
| Live default ships broken | M | default-flip deferred until live executor stable |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | empty-gold fixtures were artificial |
| 2 | Beyond Local Maxima? | PASS | 3 corpus/exec options weighed |
| 3 | Sufficient? | PASS | shared seam, additive |
| 4 | Fits Goal? | PASS | playbook + live is the ask |
| 5 | Open Horizons? | PASS | generalizes to any skill's playbook |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: `load-playbook-scenarios.cjs`, `executor-dispatch.cjs`, `run/score/build-report` + `loop-host`.

**How to roll back**: `git revert` the harness edits; new modules are inert unless trace-mode=live.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Self-contained live dispatch + cross-model parsing; gpt-5.5 uses `high`, not `xhigh`

**Status**: Accepted · **Date**: 2026-06-01

**Decision**: `live-executor.cjs` spawns `opencode run` directly (not via dispatch-model.cjs) because MiniMax rejects `--agent` that helper hardcodes; it drops `--agent` entirely (this opencode build classifies `general` as a subagent) and parses the NDJSON `{type, part:{tool, state, text}}` schema. The routing-JSON extractor is cross-model robust (fenced-any-tag / bare-object / prose fallback).

**Finding (live spike + diagnostics)**: `gpt-5.5-fast --variant xhigh` exceeds 4 min/dispatch and times out (exit null, partial output) — the cause of earlier null surfaces, NOT a parse bug. At `--variant high` it completes (~78s), emits a clean ```json fence, and scores well (CS-001 surface WEBFLOW, aggregate 76). **Use `high`** for live runs; `xhigh` is too slow to finish.

**Consequences**: live mode is advisory; default to the critical-path subset; `SKILL_BENCH_OPENCODE_MODEL` / `SKILL_BENCH_OPENCODE_VARIANT` configure the model/effort.

---

## ADR-003: D4 usefulness ablation is APPROXIMATE

**Status**: Accepted · **Date**: 2026-06-01

**Decision**: opencode has no clean single-skill suppression. Skill-OFF ≈ `MK_SKILL_ADVISOR_HOOK_DISABLED=1` + a "do not load any skill" preamble, verified by `observedReads==0` (else the pair is dropped as contaminated). D4 = normalized on/off grade delta via the existing `gradeD4`, stamped `attribution:"approximate"`. Validated in the spike (skill-off drops sk-code loads to 0).

---

## ADR-004: Generator never mutates the live playbook

**Status**: Accepted · **Date**: 2026-06-01

**Decision**: the auto-CREATE generator is opt-in (`createMissing`), writes only to `manual_testing_playbook/_generated_staging/`, and emits a `promoteHint` for operator review — Lane C stays diagnostic-by-default. Each staged scenario must pass 4 gates (contamination, parser round-trip, structural, router self-consistency); generated scenarios are tier `T1-auto` (a generator that read the router cannot author a true T2 holdout).
