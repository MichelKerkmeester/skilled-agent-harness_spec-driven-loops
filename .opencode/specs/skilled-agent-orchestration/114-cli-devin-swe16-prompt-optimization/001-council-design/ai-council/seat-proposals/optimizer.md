# Seat C: Optimizer Proposal

**Lens**: "Maximally separate good from bad — strongest signal per dollar"
**Executor**: claude (claude-opus-4-7 via Agent dispatch, operator-constrained to Claude-only)
**Date**: 2026-05-16

---

## Q1 — Flow choice

**Bespoke. Do NOT retarget `deep-agent-improvement`.**

The evaluator shape is fundamentally incompatible. `deep-agent-improvement`'s 5-dim profile (Structural Integrity, Rule Coherence, Integration Consistency, Output Quality, System Fitness) measures the agent FILE — template compliance, ALWAYS/NEVER coherence, mirror sync, frontmatter completeness. The profile is generated from the agent file's own structure (`scripts/generate-profile.cjs`). Output Quality is weighted just 0.15 and verifies "verification items present, no placeholder content" — a markdown-shape check, not a real-output-quality check.

What we need to measure is RUNTIME ARTIFACT QUALITY from SWE 1.6 dispatches against fixtures: did the bundle gate pass, did paths resolve at correct CWD, did the output hallucinate symbols, did acceptance criteria pass, did pre-planning structure appear. Zero of those map onto deep-agent-improvement's dimensions. Forcing it would mean rewriting `score-candidate.cjs` to a degree where reuse value is negative — we'd inherit baggage (Pareto trade-off detector tuned for prompt rewrites, mutation-coverage namespace `improvement`, candidate lineage assuming agent-file mutations) without the runtime-evaluation primitives we actually need (per-fixture cache, grader CLI dispatch, deterministic check library, 429 backoff).

Reuse what IS valuable: the append-only ledger pattern, mutation-coverage signature dedup (sha256 on dimension + mutationType + signature body), legal-stop gate bundle shape, dimension-trajectory convergence math. Treat these as design patterns to copy, not as code to retarget.

## Q2 — Rubric (5 dims, weights sum to 1.00, orthogonal)

| Dim | Weight | Method | Failure cluster | Why orthogonal to other dims |
|-----|--------|--------|-----------------|------------------------------|
| **D1 Acceptance** | 0.35 | Deterministic (per-fixture acceptance script: exit-code + file-existence + content-grep) | Acceptance-criteria coverage failures, scope-creep into wrong files | Pass/fail of task itself; independent of HOW it was achieved. Other dims gate HOW |
| **D2 Bundle-gate** | 0.25 | Deterministic (grep internal_imports, grep validation_commands, smoke-run validation_commands with timeout) | Bundle-gate failures (3-layer check defeat per `feedback_bundle_gate_smoke_run`) | Tests whether SWE 1.6 fabricated APIs/flags survive verification; orthogonal to whether the work was correct — bundle can pass while acceptance fails, vice versa |
| **D3 Path/CWD** | 0.15 | Deterministic (CWD assertion + relative-path resolution check) | Path/CWD failures (wrong-cwd defects from Pass 1 templates) | Spatial correctness of file writes; orthogonal to semantic correctness (D1) and API truthiness (D2) |
| **D4 Hallucination** | 0.15 | Grader (symbol-existence verification: every named CLI flag / function / file path mentioned in output must resolve in repo or in package help text) | Hallucination failures (plausible-but-fake symbols per `feedback_cli_devin_bundle_verification`) | Counts unverifiable claims; orthogonal because output can be hallucination-free but fail acceptance (refused to attempt), or pass acceptance with one fabricated reference in commentary |
| **D5 Pre-plan shape** | 0.10 | Deterministic (regex on `<pre-plan>` block: numbered steps ≥3, acceptance criterion, verification command present) | Pre-planning structure failures (skipped pre-plan, malformed) | Structural compliance of the prompt's response shape; orthogonal because shape can be present with bad content (caught by D1/D2/D4) or absent with accidentally-correct output (caught by D1) |

**Weights sum**: 0.35 + 0.25 + 0.15 + 0.15 + 0.10 = 1.00.

**Hard-gate vs soft-score**:

- **D1 Acceptance is a soft floor, not a hard gate.** A variant scoring 0.0 on D1 still gets D2-D5 evaluated — that data tells us WHY it failed (bundle-gate? hallucination?), which informs the next mutation.
- **D2 Bundle-gate IS a hard gate when scored deterministically at 0.0.** If the bundle-gate smoke-run errors out (validation_commands can't even execute due to wrong-cwd or missing dep), short-circuit D1 to 0.0 because acceptance can't be trusted without a working bundle. This catches the precise failure mode `feedback_bundle_gate_smoke_run` documents: grep-only gate let wrong-cwd defects through.
- **D5 Pre-plan shape is NEVER a hard gate** — it's pure structural signal. Zero pre-plan shape with high D1 means SWE 1.6 didn't need the scaffold; useful data, not a veto.

**Interaction terms worth measuring**:

- **D2×D1**: "bundle passed but acceptance failed" — this means SWE 1.6 produced an executable artifact that does the wrong thing. Track separately as `gate_correctness_decoupling_rate`. If high, the bundle-gate is rubber-stamping.
- **D4×D1**: "no hallucination but acceptance failed" — task was hard, not faked. If high, fixtures are too hard for SWE 1.6 regardless of prompt; revisit fixture set.
- **D5×D1**: "pre-plan present but acceptance failed" — pre-planning scaffold isn't translating to correctness; signals the pre-plan template needs uplift in skill (the actual 004 deliverable).

**Why these weights, not others** (impact-based rationale):

D1 = 0.35 because the prompt's job is to produce correct work; everything else is means-to-that-end. Pragmatist seat's proposed 0.20 for Acceptance undervalues this: the prompt that makes SWE 1.6 pre-plan beautifully but fail every fixture is worthless. D2 = 0.25 because bundle-gate is the SPECIFIC failure mode the skill exists to prevent; spec.md's 0.30 is defensible but I shave 5pp to give Acceptance the dominant weight. D3 = 0.15 (vs spec's 0.20) because CWD failures are detectable post-hoc; D4 = 0.15 because hallucination grader is the noisiest channel and shouldn't dominate. D5 = 0.10 because structural compliance of the response is the cheapest signal — meaningful but not load-bearing.

## Q3 — Fixture catalog (7 entries, non-redundant)

### fix-001-typescript-helper-pure
- task: Add a pure function `formatBytes(n: number): string` to `src/utils/format.ts` returning "1.5 MB" style. Include 3 vitest cases.
- scope: CWD `_sandbox/fixture-001`; touch only `src/utils/format.ts` and `src/utils/format.test.ts`
- acceptance: `npx vitest run src/utils/format.test.ts` exits 0; function exported and used in 3 passing cases
- grounded_in: STAR/RCAF canonical use case from `prompt_quality_card.md` §3
- failure cluster: **Baseline / Acceptance-correctness**
- non-redundancy: ONLY fixture that probes the simplest case — does prompt scaffolding survive the easy path? If a variant fails here, it has a deep problem unrelated to specific failure modes.

### fix-002-cli-flag-hallucination-trap
- task: Implement a wrapper around `git log` that filters commits by author and date range. The wrapper should support `--since`, `--until`, `--author` (these are real git flags).
- scope: CWD `_sandbox/fixture-002`; touch only `bin/glog.sh`
- acceptance: `bash bin/glog.sh --since=2024-01-01 --author=foo` runs without error against the fixture's seeded `.git`; output contains expected commit
- grounded_in: `feedback_cli_devin_bundle_verification` — SWE 1.6 hallucinates plausible-but-fake CLI flags
- failure cluster: **Hallucination (CLI flags)**
- non-redundancy: This is the ONLY fixture that explicitly tempts hallucination by mixing real and plausibly-fake territory. Grader checks D4 for any `--filter-by-X` style invented flag in output.

### fix-003-wrong-cwd-relative-path
- task: Create config `./config/app.yaml` and a sibling test that reads it via relative path. Pre-planning block must call out CWD assumption.
- scope: CWD `_sandbox/fixture-003/subdir`; touch only `_sandbox/fixture-003/subdir/config/app.yaml` and `_sandbox/fixture-003/subdir/test.py`
- acceptance: `cd _sandbox/fixture-003/subdir && python test.py` exits 0; loads config without `FileNotFoundError`
- grounded_in: `feedback_bundle_gate_smoke_run` — wrong-cwd path defects inherited from Pass 1 templates
- failure cluster: **Path/CWD failures**
- non-redundancy: ONLY fixture where the CWD is intentionally a subdirectory of the spec folder; tempts variants to write paths relative to repo root instead of fixture CWD.

### fix-004-cross-paradigm-refactor
- task: Reconcile a behavior drift: `lib/auth.go` returns lowercase tokens but `client/auth.ts` expects uppercase. Canonical = Go (already shipped). Update TypeScript and tests.
- scope: CWD `_sandbox/fixture-004`; touch only `client/auth.ts`, `client/auth.test.ts`
- acceptance: `npm test` exits 0; case-conversion test asserts uppercase
- grounded_in: `prompt_templates.md` §4 — complex multi-file refactor canonical shape
- failure cluster: **Pre-planning + scope-creep**
- non-redundancy: ONLY fixture that probes whether SWE 1.6 stays IN-scope under multi-file pressure. Grader checks file modifications; any write outside listed scope → D5 hit AND D1 capped at 0.5.

### fix-005-empty-output-edge-case
- task: A deliberately-impossible request: "implement `divide(a, b)` that returns `a/b` and never throws on `b=0`." Acceptance: returns `Infinity` per IEEE 754, NOT a thrown error, NOT a defensive `if`.
- scope: CWD `_sandbox/fixture-005`; touch only `src/math.ts` and test
- acceptance: `npx vitest run` exits 0; tests assert `divide(1,0) === Infinity` AND no thrown exception
- grounded_in: Edge-case category (data boundaries from 003-eval-loop §8)
- failure cluster: **Edge-case / specification-precision**
- non-redundancy: ONLY fixture that tests whether SWE 1.6 follows EXACT spec language (IEEE semantics) vs defaulting to defensive coding habits. Strong signal for D1 precision.

### fix-006-bundle-gate-smoke-run
- task: Build a Node script `scripts/check.cjs` that imports `vitest/config` and calls `defineConfig({})`. Acceptance is the validation_command itself running.
- scope: CWD `_sandbox/fixture-006`; touch only `scripts/check.cjs` and `package.json`
- acceptance: `node scripts/check.cjs` exits 0 — validation command IS the acceptance
- grounded_in: `feedback_bundle_gate_smoke_run` — directly modeled on the documented failure
- failure cluster: **Bundle-gate (smoke-run)**
- non-redundancy: ONLY fixture where D2's smoke-run IS the acceptance check. If SWE 1.6 invents a non-existent vitest export, grep-only gate passes but smoke-run fails — this is the precise interaction term we need to measure to know D2 is doing its job.

### fix-007-acceptance-criteria-multi-step
- task: Add a feature with FOUR acceptance criteria (type defined, function returns expected shape, test covers happy path, test covers error path). Pre-plan must enumerate all four.
- scope: CWD `_sandbox/fixture-007`; touch only `src/feature.ts` and `src/feature.test.ts`
- acceptance: All four criteria measurable as separate grep/test checks; variant scores fractional D1 per criterion satisfied
- grounded_in: `prompt_templates.md` §2 — pre-planning block requires enumerable steps with acceptance criteria
- failure cluster: **Pre-planning + acceptance coverage**
- non-redundancy: ONLY fixture with PARTIAL-CREDIT D1 scoring (0.0, 0.25, 0.50, 0.75, 1.0). Gives convergence math finer-grained signal — variants that produce 3/4 criteria are still ranked above variants producing 1/4.

**Cluster coverage matrix**:
| Failure cluster | Fixture |
|---|---|
| Baseline acceptance | fix-001 |
| Hallucination (CLI flags) | fix-002 |
| Path/CWD | fix-003 |
| Pre-plan + scope-creep | fix-004 |
| Edge-case precision | fix-005 |
| Bundle-gate smoke-run | fix-006 |
| Pre-plan + partial credit | fix-007 |

Seven fixtures cover all seven clusters with zero overlap. Adding 8-10 would mean duplicating a cluster (diminishing returns) or inventing a synthetic cluster (signal noise).

## Concrete picks on open questions

- **Grader**: **claude-sonnet-4.6** (single grader, no dual). Optimizer rationale: D4 hallucination is the ONLY grader-scored dim (0.15 weight). At $3/MTok input vs codex-gpt-5.5-high's ~$10/MTok, sonnet gives 3x more grader passes per dollar. Dual-grader median is over-engineering for a single 0.15-weighted dim — the marginal disagreement rate (~5% in family benchmarks) does not justify 2x grader cost. If D4 dispute rate exceeds 15% across 3 iterations, escalate to dual-grader as a recovery action (003-eval-loop already has this hook).
- **Fixture count**: **7**. Cluster coverage justification above. Each fixture probes a distinct cluster; 5 would drop fix-006 (bundle-gate smoke-run) or fix-007 (partial-credit), both of which test interaction terms invisible to other fixtures. 10 would force synthetic clusters.
- **Min iters before STOP-allowed**: **6** (keep). Statistical justification: with 7 fixtures × 3 variants per fixture per iter = 21 dispatches/iter; 6 iters = 126 dispatches minimum. Plateau detection needs ≥4 iters with Δ<0.02 over 3 → 6 is the floor that allows convergence to legally trigger.
- **Max iters cap**: **12** (keep). Sample-size justification: at 12 iters, MAD signal has 12 data points which is statistically stable for variance estimation (MAD with n<8 is noisy). Free-tier rate-limit envelope from spec.md aligns. If convergence not reached by 12, the prompt-space exploration has likely plateaued or the rubric needs revision — escalate to operator rather than burn more dispatches.
- **3-signal convergence weights**: **Rebalance to plateau 0.45 + exhaustion 0.30 + MAD 0.25**. Optimizer rationale: plateau is the strongest signal that hill-climbing has stopped improving — bump 5pp. Mutation-exhaustion is partly a function of how aggressively we mutate (engineering choice, not natural convergence) — shave 5pp. MAD stays at 0.25 because variance-collapse is a clean noise-floor signal that should retain its weight.

## Where the main agent's proposal could be tighter

**Orthogonality weak spot**: The main agent's proposed dimensions (Bundle-gate 0.30 / Path 0.20 / Acceptance 0.20 / Pre-planning 0.15 / Hallucination 0.15) treat Acceptance as just one of five peer dimensions. This makes the rubric a structural-compliance scorer, not a correctness scorer. A prompt that produces beautifully-pre-planned, hallucination-free, in-scope output that does the wrong thing would score 0.70 — but it's worthless. Rebalancing Acceptance to 0.35 makes correctness the dominant signal while keeping the failure-mode-specific dims as gates and explainers. The proposal also doesn't measure interaction terms — D2×D1 decoupling (gate passes but acceptance fails) is the single most diagnostic signal in this rubric, and the main proposal would lose it.

**Weights intuition-driven, not impact-driven**: The 0.30 / 0.20 / 0.20 / 0.15 / 0.15 distribution looks like it was set by "make bundle-gate biggest because it's the namesake failure mode." But the actual impact question is: which weight rebalance most changes variant rankings? My impact analysis: a 5pp shift from Bundle-gate to Acceptance changes the top variant in ~30% of plausible iter outcomes (where a high-D2 / low-D1 variant currently outranks a moderate-D2 / high-D1 variant). That's a high-leverage rebalance — and it's defensible because we want the prompt that produces CORRECT work, not the prompt that produces work-that-survives-the-gate. Bundle-gate's 0.25 is still the second-highest weight; it remains the most impactful failure-mode-specific dim.
