## Multi-AI Council Report: Divergent convergence mode architecture

### Task Classification
- **Type**: Architecture / feature planning
- **Council Seats Dispatched**: 3: Analytical Architecture, Critical Reliability, Pragmatic Integration
- **Dispatch Mode**: Sequential Depth 1
- **Vantage Integrity**: Native current OpenCode runtime only; no external CLI
- **Resolved Packet**: `.opencode/specs/system-deep-loop/030-deep-loop-improved/012-deep-loop-divergent-mode`

### Council Composition
| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Analytical Architecture | native OpenCode | Smallest ownership-preserving state machine | 91 |
| seat-002 | Critical Reliability | native OpenCode | Resume, quorum, collision, recursion, scope, verdict locks, hard stops | 94 |
| seat-003 | Pragmatic Integration | native OpenCode | Minimal surfaces, parity, reducers, synthesis, tests | 89 |

### Seat 001 - Analytical Architecture / native OpenCode
Keep graph computation in `convergence.cjs`, final legality in YAML, and mechanics in a purpose-built adapter.

### Seat 002 - Critical Reliability / native OpenCode
Require 3/3 returns, two-of-three agreement, durable pivot-local artifacts, deterministic resume, and hard-stop precedence.

### Seat 003 - Pragmatic Integration / native OpenCode
Use one flag/config shape, one adapter, four surgical YAML branches, reducer projections, and ordered tests.

### Strategy Comparison
| Dimension | Weight | Analytical | Critical | Pragmatic |
| --- | ---: | ---: | ---: | ---: |
| Correctness | 30 | 27 | 28 | 26 |
| Completeness | 20 | 18 | 19 | 18 |
| Elegance | 15 | 14 | 12 | 14 |
| Robustness | 20 | 16 | 20 | 15 |
| Integration | 15 | 14 | 13 | 15 |
| Pre-Critique Total | 100 | 91 | 92 | 90 |
| Post-Critique Adjustment | +/-10 | -2 | 0 | -2 |
| Final Total | 100 | 89 | 92 | 88 |

### Deliberation Notes
- **Round 1 Independent Findings**: all seats chose modifier-only, post-gate pivot architecture.
- **Round 2 Cross-Critique**: corrected identity, persistence, propagation, and strictness details.
- **Round 3 Reconciliation**: merged Critical transaction safety, Analytical ownership/state, Pragmatic integration/tests.

### Winning Strategy
- **Leader**: Critical Reliability, 92/100
- **Key Strength**: closes duplicate, partial-quorum, collision, recursion, scope, and review-lock hazards.
- **Complementary Elements**: ownership/state from Analytical; propagation/test order from Pragmatic.

### Recommended Plan

#### A. Config, syntax, propagation
Canonical field: `antiConvergence.convergenceMode: default|off|sliding-window|divergent`. Add `antiConvergence.divergent` with `maxPivots:3`, `maxCouncilSeatOutputs:9`, `minRemainingIterations:1`, `candidateSimilarityThreshold:0.85`. Three seats and one round are invariants, not knobs.

Expose `--convergence-mode=<enum>` on research/review. Both setup modes populate nested config and initial JSONL. All four YAMLs extract it and pass `--convergence-mode "{convergence_mode}"` to `convergence.cjs`. That script validates/reports divergent but leaves `CONTINUE|STOP_ALLOWED|STOP_BLOCKED` computation unchanged. Evidence: `convergence.cjs:177-237,693-742`; current YAML calls omit mode.

#### B. Pivot classification and hard-stop precedence
Terminal precedence: pause/cancel; manual stop; unrecoverable error; mandatory security escalation; maxIterations; exhausted duration/Council budget. Never pivot these.

STOP_BLOCKED, failed quality gates, graph CONTINUE, unresolved review P0/P1/adjudication, and stuck recovery remain blocked/continue/recovery. Only a post-gate legal STOP from an allowlisted saturation origin (composite convergence, all questions answered, all dimensions clean) is eligible. If no legal frontier survives, synthesize normally.

#### C. Events, identity, transitions, resume
Owning JSONL vocabulary: `pivot_started`, `pivot_candidate_rejected`, `pivot_seat_returned` ×3, `pivot_deliberation_completed`, `pivot_selected`, `pivot_completed`, `pivot_failed`.

`pivotId = pivot-<ordinal>-<sha256(sessionId|generation|loopType|sourceIteration|normalizedTrigger)[0:12]>`; ordinal is display-only, not identity input.

State: `LEGAL_STOP→PIVOT_PENDING→COUNCIL_RUNNING→PIVOT_SELECTED→PIVOT_COMPLETED→CONTINUE`. No new terminal stopReason. Resume the same id, fill only missing durable seats, synthesize after all three, and restore focus only from pivot_completed. Equal duplicate hashes are idempotent; conflicts fail closed. Reducers project history, saturated/rejected sets, frontier/focus, artifact refs, and costs.

#### D. Adapter, Council semantics, cost, artifacts
Create a purpose-built divergent-pivot adapter over low-level Council mechanics; do not use generic session/topic orchestrators or root persistence. It owns mechanics only and accepts mode-owned eligibility/candidate inputs.

Rules: native current OpenCode runtime, Depth 1 sequential, no external/subprocess CLI, no recursion, one round, exactly three distinct mandates, 3/3 parse-valid returns, two-of-three material endorsement, no high-severity blocker. Auto fails closed on non-convergence; confirm may record an explicit audited operator choice.

Preflight max pivots, seat outputs, one remaining iteration, duration, timeout. Persist at `<artifactRoot>/divergent/pivots/<pivotId>/council/{config.json,state.jsonl,seats/*.md,deliberation.md,report.md}`; ordinary packet Council plans cannot collide.

#### E. Candidate relevance and dedup
Require candidate id/title/focus, evidenceRefs, relevance rationale, boundary verdict, stable fingerprint, seat provenance. Reject permission/tool/network/filesystem widening, non-goal/target escape, and reviewed-file mutation authority.

Dedup against current, saturated, rejected, and selected history using normalized hash plus token-overlap threshold; ambiguous material equivalence rejects fail-closed with reason.

Research: adjacent unanswered questions, contradiction/verification gaps, source-class gaps, alternate evidence methods. Review: unswept dimensions, producer-consumer/boundary paths, negative-test and traceability gaps; never fixes or verdict changes.

#### F. Auto/confirm parity
Shared adapter/event/candidate contract; local YAML legality. Auto selects the majority-endorsed highest legal candidate. Confirm offers accept top, choose another converged candidate, edit then revalidate, or manualStop. Non-converged override is explicit/audited. Add parity assertions across research/review auto/confirm.

#### G. Synthesis and executable tests
Research adds **Divergence Map**. Review adds **Dimension Expansion Map** without altering PASS/CONDITIONAL/FAIL. Include saturation, rejection, pivots, evidence, Council artifacts, failures, frontier.

Minimum matrix: 4-mode parser/propagation; golden default/off/sliding-window decisions; command compiler/drift; 2 families×2 workflows; eligible/hard-stop table; review P0/security locks; exact-three/3-of-3/two-of-three/one-CLI/recursion/cost; crash after each event; two-pivot + ordinary Council collision; mode-specific candidates/dedup; reducer replay; synthesis snapshots.

#### H. Phases, files, rollback, non-consumers
1. Baseline existing modes; canonical commands/config.
2. Convergence validation/reporting + pivot adapter/tests.
3. Research auto/confirm, reducer/assets/synthesis.
4. Review equivalent with verdict/security locks.
5. Regenerate compiled contracts; references/playbooks/benchmarks; full matrix.

Affected: `commands/deep/{research,review}.md`; legacy command bodies; four YAMLs; generated compiled contracts; `runtime/scripts/convergence.cjs`; new runtime Council adapter/dedup helper/tests; research/review config, strategy, dashboard, prompt, reducers, references/playbooks; existing runtime and system-spec-kit parity tests.

Explicit non-consumers byte-unchanged: `system-deep-loop/SKILL.md`, `mode-registry.json`, `hub-router.json`, agents, workflowMode/runtimeLoopType/backendKind, generic Council command/orchestrators/writers, context, improvement.

Rollback removes enum exposure and divergent YAML/adapter calls, restores defaults, regenerates projections. Additive pivot JSONL/artifacts remain inert; never rewrite history.

### Implementation Steps
1. Pin baselines and config contract. (Pragmatic, Analytical)
2. Build mechanics-only pivot adapter. (Critical, Analytical)
3. Wire research + reducer + Divergence Map. (Analytical, Pragmatic)
4. Wire review preserving locks + Dimension Expansion Map. (Critical, Pragmatic)
5. Regenerate and run full verification. (Pragmatic, Critical)

### Prerequisites
- Capture baselines before changes.
- Treat locked packet decisions as frozen.
- Keep JSONL authoritative and reducers projection-only.
- Fail closed if native sequential Council callback is unavailable.

### Plan Confidence
- **Overall**: 92%
- **Strategy Agreement**: 3/3
- **Consensus Quality**: Strong
- **Risk Level**: High control-flow blast radius, mitigated by opt-in gating and pinned fixtures.

### Dropped Alternatives
- **Analytical** (89): retained ownership/state; corrected identity/persistence details.
- **Pragmatic** (88): retained sequence/tests; corrected propagation/semantic ownership.
- Generic Council session/topic orchestration: collision, partial failure, external route, and excess-loop risk.
- New workflow/command/skill/agent: violates locked scope.

### Risks & Mitigations
- Duplicate resume → immutable id, hashes, fail-closed conflicts.
- Overwrite → pivot-scoped roots.
- Scope creep → evidence/boundary/dedup validation.
- Review regression → post-gate classification and lock fixtures.
- Cost → pivot/seat/remaining-budget guards.
- YAML drift → shared contracts + parity tests.

### Planning-Only Boundary
- No runtime or authored spec documents were modified.
- Only mandated packet-local `ai-council/**` artifacts were persisted.
- Implementation requires a subsequent approved workflow.
