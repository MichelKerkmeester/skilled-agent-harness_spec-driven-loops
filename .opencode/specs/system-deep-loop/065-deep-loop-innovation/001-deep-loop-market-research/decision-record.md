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
    recent_action: "Run 45/45 done; ADR-002 flipped to Accepted (manual); ADR-003 GLM probe recorded"
    next_safe_action: "Finish close-out: checklist evidence, implementation-summary, strict recursive validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-001-dr"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "ADR-002: Shape B, realized as a manual hand-rolled driver because the fan-out codex executor lacks top-level --search (cannot mine live repos) and patching it is out of scope; operator-authorized."
      - "ADR-003: GLM provider = zai-coding-plan/glm-5.2 (confirmed via opencode models); --variant max dispatches and GLM web-mines via opencode WebFetch."
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
| **Status** | Accepted — Shape B, realized as a manual hand-rolled loop (see Decision + Execution Amendment) |
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

**We chose**: **Shape B (sequential, findings-seeded generations)** — LUNA 25 → SOL 10 → GLM 10, each generation seeded by the accumulated findings registry, with orchestrator review gates between generations.

**How it works (as executed)**: Shape B was realized as a **manual hand-rolled driver** (`scratch/deep-loop-driver.cjs` + `scratch/angle-schedule.json`), not the `/deep:research` fan-out loop. The driver dispatches one iteration at a time (`codex --search exec` for LUNA/SOL; `opencode run` for GLM), accumulates a deduplicated `findings-registry.json` that seeds each subsequent iteration to broaden, and emits loop-equivalent state (`deep-research-config.json`, `deep-research-state.jsonl`, `iterations/iteration-NNN.md`, `deep-research-dashboard.md`).

### Execution Amendment (why manual, not the loop)

At planning time (Alternatives, below) hand-rolled loop mechanics were scored 1/10 ("the skill forbids"). Execution surfaced a blocker planning did not anticipate: **the fan-out loop's codex executor builds its command without codex's top-level `--search` flag** (confirmed by reading `runtime/scripts/fanout-run.cjs`), so its leaves have no live web access and cannot mine external GitHub repos — the entire point of this phase. Enabling `--search` there would require editing `fanout-run.cjs`, which is **out of scope** (research-only; zero writes outside the spec folder — SC-005). The operator therefore explicitly authorized running the loop manually via cli-codex / cli-opencode. The manual driver is the faithful realization of Shape B under that constraint and additionally delivers the true cross-iteration seeding Shape B calls for. Recorded per the PLAN-WORKFLOW LOCK: the blocker was verified against the executor's actual code, flagged to the operator, and authorized — not a silent substitution. A separate finding from the same investigation (codex 0.144.4 moved `--search` to a top-level-only flag; `codex exec --search` now fails) was captured in the cli-codex skill docs.
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

**Probe result (execution):** `opencode models zai-coding-plan` confirmed `zai-coding-plan/glm-5.2` is available. `opencode run --model zai-coding-plan/glm-5.2 --variant max` dispatched successfully, and GLM performed live web mining via opencode's WebFetch tool (its trace shows it self-correcting guessed URLs against live fetch: guess → 404 → search → correct URL). All GLM iterations 36–45 completed with parseable output; codex `--search` remained the GPT lineages' live-search mechanism (top-level flag, preceding `exec`).
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
