---
title: "Decision Record: Deep-Loop Market Research (Loop-Engineering Landscape)"
description: "Method decisions for the 45-iteration non-converging research run: divergent convergence-mode for non-convergence (ADR-001), parallel fan-out vs sequential batches as an execution-start decision (ADR-002), and the GPT-via-cli-codex / GLM-via-cli-opencode transport split (ADR-003), with the open execution risks."
trigger_phrases:
  - "deep loop market research decisions"
  - "divergent mode decision"
  - "fan-out vs sequential batches"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research"
    last_updated_at: "2026-07-14T21:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "ADR-001/002/003 recorded at planning time; ADR-002 stays Proposed until execution start"
    next_safe_action: "Resolve ADR-002 (shape) and the ADR-003 GLM probe at execution start"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-001-dr"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-002: Shape A vs Shape B, decided at execution start."
      - "ADR-003 note: GLM provider prefix + max-variant support, probed at execution start."
    answered_questions: []
---
# Decision Record: Deep-Loop Market Research (Loop-Engineering Landscape)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Non-convergence via divergent convergence-mode, not convergence-off

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

We need 45 iterations of BROADENING research. The loop's default behavior converges: it stops when findings corroborate and novelty drops. We had to choose how to defeat early stopping without losing the loop's quality machinery.

### Constraints

- The loop engine owns stopping; we can only steer it through supported flags.
- Full depth is mandatory: the operator wants all 45 iterations spent.
- Quality guards (source diversity, weak-single-source rejection) must stay active.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `--max-iterations=45 --stop-policy=max-iterations --convergence-mode=divergent`.

**How it works**: `stop-policy=max-iterations` forces full depth regardless of convergence signals. `convergence-mode=divergent` pivots the loop into adjacent, contradiction, and missing-source questions at points where it would otherwise stop. The anti-convergence floor and quality guards stay active throughout.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **divergent mode + max-iterations stop-policy (chosen)** | Full depth AND active broadening; pivots steered by the engine, auditable in state JSONL | Slightly less predictable question trajectory | 9/10 |
| Convergence detection off entirely | Simple | No steered pivots: iterations can circle instead of broadening; loses the engine's novelty machinery | 4/10 |
| Default convergence with a high threshold | Familiar behavior | Still converges; wastes the mandate for full-depth broadening | 3/10 |

**Why this one**: It is the only supported combination that both guarantees 45 iterations and makes the engine actively hunt for new ground at every would-be stop.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Coverage keeps widening for the whole budget; would-be stops become pivots.
- Pivot events are auditable in `research/deep-research-state.jsonl`.

**What it costs**:
- Late iterations can chase lower-value tangents. Mitigation: orchestrator check-ins steer via the dashboard; dedup keeps repetition out of the synthesis.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Quality guards throttle broadening in edge cases | M | Guards stay active by design; watch for guard-triggered stalls at check-ins |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Default behavior would stop early; the mission is breadth |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | Two flags on a supported surface; no engine changes |
| 4 | **Fits Goal?** | PASS | Directly implements the non-converging mandate |
| 5 | **Open Horizons?** | PASS | Leaves the engine untouched for later phases to improve |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Launch flags only; verified in `research/deep-research-config.json` at init (CHK-020).

**How to roll back**: Stop the run; relaunch without the flags. State is packet-local and additive.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Execution shape, parallel fan-out (A) vs sequential batches (B)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (execution-start decision; recommendation: Shape B) |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (parallelism OK) + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Per-iteration in-lineage model switching is NOT native to the loop: executor config is immutable per run, with a single scalar model. The LUNA 25 / SOL 10 / GLM 10 split therefore has exactly two faithful realizations, and one must be picked at execution start.

### Constraints

- Executor config immutable per run; one model per lineage.
- Shape A means 3 concurrent CLI dispatches, which needs explicit operator OK.
- Orchestrator must keep check-in and steering points.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Nothing yet. Both shapes are documented as faithful; the recommendation is Shape B (sequential batches). The final call happens at execution start and this ADR flips to Accepted with the chosen shape.

**How it works**: Shape A is ONE `/deep:research` run with the fan-out `--executors` JSON from `plan.md` (3 independent parallel lineages under `research/lineages/{label}/`, reduced at the end). Shape B is three successive generations (LUNA 25, then SOL 10, then GLM 10) accumulating in one growing effort, later batches seeded by earlier findings, via `--lineage-mode=restart` between generations OR successive invocations.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shape B, sequential batches (recommended)** | Later generations aim at earlier gaps/contradictions (true broadening); natural between-generation gates for orchestrator steering; no parallel-dispatch load | Longest wall-clock; three launches to manage | 8/10 |
| Shape A, parallel fan-out | Best wall-clock; three independent perspectives; single launch | Lineages cannot cross-pollinate mid-run (duplicate-coverage risk); 3-way CLI dispatch load; needs operator parallelism OK | 7/10 |
| Per-iteration model switching in one lineage | Exactly matches the 25/10/10 split in one thread | NOT native: config immutable, single scalar model; would require hand-rolled loop mechanics, which the skill forbids | 1/10 |

**Why this recommendation**: The mission is breadth. Sequential seeding converts SOL and GLM budgets into targeted gap-filling instead of independent re-coverage, and the between-generation gates match the orchestrator's active check-in mandate.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Either shape preserves the exact 25/10/10 model split and the transport mandate.
- The decision is recorded, reversible before launch, and auditable after.

**What it costs**:
- Shape B: longer wall-clock. Mitigation: overnight-friendly; gates keep it steerable.
- Shape A: duplicated coverage risk. Mitigation: per-lineage angle allocation at init + end reducer dedup.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shape A lineage independence (no mid-run cross-pollination) | M | Angle allocation per lineage; reducer dedup; or choose B |
| Shape A 3-way parallel dispatch resource load | M | Explicit operator OK required; fall back to B |
| Shape B generation seams lose context | L | Seeding step reviews accumulated findings before each generation |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The split cannot run as one lineage; a shape must be chosen |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared, incl. the rejected native-switching idea |
| 3 | **Sufficient?** | PASS | Both shapes use only supported loop surfaces |
| 4 | **Fits Goal?** | PASS | Both realize the mandated 25/10/10 split faithfully |
| 5 | **Open Horizons?** | PASS | Decision is per-run; nothing engine-level is constrained |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Launch recipe only (fan-out JSON vs three successive launches); see `plan.md` section 3.

**How to roll back**: Before launch: flip the choice here. After launch: pause, keep completed state, continue under the other shape's remaining budget with the deviation recorded here.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Transport split, GPT via cli-codex and GLM via cli-opencode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (operator mandate) |
| **Date** | 2026-07-14 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Three executor lineages need transports. The operator mandates that GPT models run ONLY via cli-codex; GLM runs via cli-opencode. Both GPT lineages (gpt-5.6-luna, gpt-5.6-sol) satisfy the mandate on cli-codex.

### Constraints

- Operator mandate: no GPT dispatch through cli-opencode.
- cli-opencode does NOT support serviceTier; the GLM config omits it.
- cli-codex requires a live ChatGPT-OAuth session.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: LUNA and SOL on cli-codex (`gpt-5.6-luna` reasoningEffort `max` serviceTier `fast`; `gpt-5.6-sol` reasoningEffort `ultra` serviceTier `fast`); GLM on cli-opencode (`glm-5.2`, reasoningEffort `max`, no serviceTier).

**How it works**: The loop's executor configs carry kind + model + effort per lineage; cli-codex fronts both GPT lineages, cli-opencode fronts GLM. The GLM exact provider prefix (e.g. `zai-coding-plan/glm-5.2`) and whether GLM supports a `max` variant are probed via `opencode models` at execution start and recorded below.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **GPT on cli-codex + GLM on cli-opencode (chosen)** | Complies with the mandate; each transport runs the models it handles best | Two transports to pre-flight | 9/10 |
| Everything through cli-opencode | One transport | Violates the operator's GPT-only-via-cli-codex mandate | 0/10 |
| Everything through cli-codex | One transport, one auth | cli-codex does not front GLM | 1/10 |

**Why this one**: It is the only option that satisfies the operator mandate and covers all three models.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Mandate compliance is structural: no GPT traffic can route through cli-opencode.

**What it costs**:
- Two pre-flights instead of one. Mitigation: both checks are in tasks.md T002.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| cli-codex ChatGPT-OAuth stale/absent at launch or expiring mid-run | H | Pre-flight before launch; resume from state JSONL after re-auth |
| GLM provider prefix wrong or `max` variant unsupported | M | `opencode models` probe at execution start; record the working values here |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three models need transports; mandate constrains routing |
| 2 | **Beyond Local Maxima?** | PASS | Single-transport options evaluated and rejected |
| 3 | **Sufficient?** | PASS | Uses existing transports as-is |
| 4 | **Fits Goal?** | PASS | Enables the exact 25/10/10 split |
| 5 | **Open Horizons?** | PASS | Per-run routing; no lasting coupling |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Executor configs at launch only (see `plan.md` section 3 table and fan-out JSON).

**How to roll back**: Transport choice is per-launch; relaunch with corrected configs. GLM probe results and any prefix/variant corrections get appended to this ADR at execution start.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
