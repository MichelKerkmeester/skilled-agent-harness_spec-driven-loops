---
title: "Decision Record: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route [template:level_3/decision-record.md]"
description: "Decision record template for documenting architectural choices, alternatives, consequences, and implementation notes."
trigger_phrases:
  - "decision"
  - "record"
  - "name"
  - "template"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-measurement-baseline"
    last_updated_at: "2026-06-15T14:05:58Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-measurement-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build a runtime-agnostic `fable-metrics.cjs` instead of porting `leak_test.py`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-15 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

<!-- Voice guide: State the problem directly. "We needed to choose between X and Y because Z"
     not "A decision was required regarding the selection of an appropriate approach." -->

We needed a way to measure behavioral efficiency from deep-loop runs, and the only existing metric (`leak_test.py`) reads `~/.claude/projects/`. That path is Claude-specific, so it cannot see Codex or OpenCode runs and cannot read the framework's own deep-loop state. The research is explicit: prefer a standalone metric over adapting `leak_test.py`, because the deep-loop state JSONL is an already-universal, runtime-agnostic data source.

### Constraints

- Must read the framework's deep-loop state JSONL plus iteration markdown, not a runtime-specific home directory.
- Must run with no new third-party dependencies (Node stdlib only) so it ships inside the spec-kit scripts tree.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Write a new `fable-metrics.cjs` under `.opencode/skills/system-spec-kit/scripts/metrics/` that reads deep-loop state by path argument.

**How it works**: The script takes a spec-folder or state-file path, parses each lineage's `deep-research-state.jsonl` and `iterations/iteration-*.md`, and computes five metrics with defensive parsing. It writes a baseline snapshot once and is otherwise a pure read.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone `fable-metrics.cjs`** | Runtime-agnostic; reads framework state; reusable by later phases | Costs a from-scratch parser | 9/10 |
| Port `leak_test.py` as-is | Reuses existing metric logic | Claude-path-coupled (`~/.claude/projects/`); blind to Codex/OpenCode | 3/10 |

**Why this one**: A standalone script reads the framework's own runtime-agnostic deep-loop state, so the baseline is valid across all three runtimes and stays reusable by the governor and doctrine phases that follow.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A baseline can be captured before any governor change, making later behavioral movement provable rather than asserted.
- The same script and metric definitions are reused by every later fable-5 phase, so the before/after comparison stays apples-to-apples.

**What it costs**:
- A from-scratch parser for deep-loop state. Mitigation: keep the metric set to five and parse defensively, skipping malformed records instead of failing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lineage state schemas differ enough that coverage is thin | M | Report per-lineage coverage; record contributing lineages in the snapshot |
| Heuristic metric definitions drift between phases | M | Pin the definitions in the script header and snapshot; later phases reuse, not reimplement |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The research sequences measurement first so later changes are provable; no current metric reads framework state. |
| 2 | **Beyond Local Maxima?** | PASS | The `leak_test.py` port was evaluated and rejected as Claude-path-coupled. |
| 3 | **Sufficient?** | PASS | Five metrics plus a baseline snapshot cover the stated efficiency signals; nothing larger is needed for a baseline. |
| 4 | **Fits Goal?** | PASS | It is the first item on the structural-first sequence and unblocks every later phase. |
| 5 | **Open Horizons?** | PASS | A runtime-agnostic script is reusable by the governor and doctrine phases and across all three runtimes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Adds `.opencode/skills/system-spec-kit/scripts/metrics/fable-metrics.cjs`.
- Produces a baseline snapshot over the 002 lineage state files.

**How to roll back**: Delete `fable-metrics.cjs` and the baseline snapshot. Both are read-only artifacts with no runtime wiring, so removal has no behavioral side effect.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Deliver primarily through a read-only `/doctor fable-mode` route

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-15 |
| **Deciders** | Packet owner |

### Context

The research leaves the delivery surface open (open question 3): a `/doctor fable-mode` diagnostic versus a `deep:model-benchmark` fixture-scored lane. We needed a surface that operators can run any time without side effects and that fits an existing pattern.

### Decision

**We chose**: Ship a read-only `/doctor fable-mode` route as the primary surface, and note a `deep:model-benchmark` dimension as a secondary option.

**How it works**: A new route entry in `_routes.yaml` (`mutating: read-only`) runs `fable-mode-check.cjs`, which calls the metric computation and renders the five metrics plus the baseline comparison. The doctor command already hosts read-only `.cjs` diagnostics (for example `parent-skill-check.cjs`), so this fits the established pattern.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`/doctor fable-mode` (read-only)** | On-demand; no side effects; matches existing doctor diagnostics | Not fixture-scored | 8/10 |
| `deep:model-benchmark` dimension only | Fixture-scored; integrated with benchmarking | Heavier; not an on-demand spot check | 5/10 |

**Why this one**: A read-only diagnostic is the cheapest on-demand way to inspect the baseline and drift; the benchmark dimension can be added later without reworking the metric core.

### Consequences

**What improves**:
- Operators get a safe, on-demand read of behavioral metrics.
- The route reuses the metric library, so there is one source of truth.

**What it costs**:
- Two delivery surfaces to keep in mind. Mitigation: document `/doctor fable-mode` as primary and the benchmark dimension as optional.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Route mistaken for mutating | L | `mutating: read-only` plus `route-validate.sh` enforcement |

### Implementation

**What changes**:
- Adds `.opencode/commands/doctor/scripts/fable-mode-check.cjs` and `.opencode/commands/doctor/assets/doctor_fable-mode.yaml`.
- Appends the `fable-mode` route to `.opencode/commands/doctor/_routes.yaml`.

**How to roll back**: Remove the route entry, the asset, and the script; re-run `route-validate.sh` to confirm a clean manifest.

---

## ADR-003: Keep the behavioral advisories non-blocking

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-15 |
| **Deciders** | Packet owner |

### Context

The research warns against blocking behavioral gates before baselines exist (open question 4, eliminated-alternatives list). We needed to surface low tool:text, self-openers, and high caveat density at dispatch time without risking a false block.

### Decision

**We chose**: Emit the advisories from `post-dispatch-validate.ts` as additive informational output that never sets a blocking verdict.

**How it works**: The advisory branch reads the same metric signals and appends warnings; it does not touch the existing pass/fail verdict logic. A `vitest` fixture asserts that a tripping input stays non-blocking.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Non-blocking advisories** | Surfaces drift safely; reversible; matches research guidance | No hard enforcement yet | 8/10 |
| Blocking gate now | Hard enforcement | Premature without a baseline; risks false blocks | 2/10 |

**Why this one**: Advisories give visibility now; promotion to blocking is a later, owner-directed decision once the baseline exists.

### Consequences

**What improves**:
- Behavioral regressions are visible at dispatch time without changing run outcomes.

**What it costs**:
- No automatic enforcement yet. Mitigation: the metric script and baseline make a later blocking decision low-risk.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Advisory edit changes the verdict | H | Confine to additive output; `vitest` non-blocking fixture |

### Implementation

**What changes**:
- Modifies `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` to add advisory output only.

**How to roll back**: Revert the advisory block in `post-dispatch-validate.ts`; the verdict logic is untouched, so the baseline behavior returns immediately.

---

## RISK MATRIX (phase-level)

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Heuristic metric definitions drift between phases, breaking the comparison | M | M | Pin definitions in the script header and snapshot; phases reuse the script |
| R-002 | The `post-dispatch-validate.ts` edit affects the blocking verdict | H | L | Additive advisory output only; `vitest` non-blocking fixture |
| R-003 | Lineage schemas differ enough that coverage is thin | M | M | Per-lineage coverage reporting; partial corpora accepted |
| R-004 | The new doctor route is treated as mutating | L | L | `mutating: read-only`; `route-validate.sh` enforcement |

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

