# Research: GPT Behavioral Hardening Follow-Up (Packet 031, Phase 007) — Final Consolidated Synthesis

> Consolidates **six independent fan-out lineages across two rounds**, all against the same evolving charter (`../research-prompt.md`). Round 1 (exploratory, 30 iterations each): `glm-max` (GLM-5.2, max reasoning), `gpt-fast-high` (GPT-5.5-fast, high). Round 2 (operator-directed critical re-review, 10 iterations each, per §9): `sonnet-critical` (Claude Sonnet 5), `glm-critical` (GLM-5.2, **partial** — 1/10, see §0), `opus-critical` (Claude Opus 4.8), `gpt-critical` (GPT-5.5-fast, self-critiquing). All lineages ran `stopPolicy: max-iterations` — no early convergence.

---

## 0. What Changed Between Rounds, and Why

The operator directly experienced all four reported symptoms in real OpenCode usage (slow `@orchestrate`, wrong sub-agent invocation, stuck flows, overthinking) and flagged a real methodological flaw in round 1: `gpt-fast-high` was GPT investigating GPT's own failures — a structural conflict of interest. Round 2 was commissioned to (a) treat the operator's experience as confirmed ground truth rather than an open question, and (b) apply adversarial, non-self-interested pressure to round 1's conclusions.

**`glm-critical` could not complete.** It ran 1 strong iteration (7 findings, newInfoRatio 0.92, independently spotted the ai-council route-proof issue as a "3-way contradiction"), then stalled reproducibly on iteration 2 across 3 attempts (~29-50 minutes each, near-zero CPU consumption during the stall — an API-side symptom, not genuine slow reasoning). The operator confirmed GLM usage was at zero at the time. This was a real infrastructure failure, not a research-quality issue, and is worth fixing/monitoring independently of this packet. It was replaced with two additional lineages — `opus-critical` and `gpt-critical` — rather than retried further.

**A genuine self-correction happened inside round 2 itself.** `sonnet-critical`'s single most assertive finding — that the ai-council route-proof validator is a "code-traced, guaranteed FAIL" — was itself wrong, and wrong in exactly the way round 2 existed to catch: it traced the validator function and the YAML config but never opened the file that actually emits the record being validated. `opus-critical` did open it, found the record hardcodes `mode:'council'` (matching the validator, not `'ai-council'` as sonnet-critical assumed), and showed the validator actually **passes**. `gpt-critical`, working independently, reached the same corrected understanding. This 2-vs-1 independent convergence (Opus and GPT-critical agreeing, against Sonnet's original claim) is treated as decisive below. It is also the clearest evidence in this whole packet that "trust the description, not just the code" cuts both ways — even a critical-review pass built specifically to catch soft framing can itself make a citation-trust error, which is why this round ran three independent models rather than one.

---

## 1. Cross-Lineage Agreement (highest confidence — 4-6 lineages independently concur)

- **Do not unpark FIX-5/host-identity now.** Every lineage across both rounds reaches this conclusion, each strengthening the reasoning: round 1 said "insufficient evidence either way"; round 2 sharpens this to "FIX-5 addresses at most 1 of the 4 confirmed symptoms and may worsen latency — the cheaper prompt/routing layers have larger coverage of the actual confirmed problem." Unpark only on a negative gate: after the cheaper fixes land and an external smoke/benchmark runs, if GPT still shows semantic wrong-mode artifacts or a route-proof mismatch on any mode while Claude passes.
- **Keep `ai-council` as `mode: all`.** Unanimous across all 6 lineages. Converting it to subagent-only would remove a working, documented depth-0 parallel-seat path the reported symptoms don't implicate.
- **Harden `@orchestrate` via registry delegation, NDP-safely.** All lineages agree on the intent (stop letting orchestrate self-derive `mode=`/`execution=` via judgment; use `mode-registry.json` as the single source of truth). Round 2 sharpened the *mechanism*: a literal "Task-dispatch `@deep` and STOP" reading violates orchestrate's own documented nesting-depth cap (`Orch(0) → Sub-Orch(1) → @leaf(2)` is illegal, and `@deep` is itself `mode: primary`, not a depth-1 leaf). The corrected, NDP-safe fix: add the missing `@deep-context`/`@deep-review` rows to orchestrate's own Priority table, make its existing Deep Route field registry-resolved, and dispatch the resolved **leaf** agent directly at depth 1 — never dispatch `@deep` itself as a worker.
- **A detection-only enforcement plugin is feasible**, most likely home `system-skill-advisor` or a standalone plugin under `.opencode/plugins/`, using the `tool.execute.before` hook to inspect/rewrite dispatch args. Confirmed mechanism (round 2 resolved what round 1 could only argue by analogy). Hard limits, confirmed by multiple lineages: (a) it cannot create hard runtime identity — that remains FIX-5/host territory; (b) whether it can genuinely fail-closed (throw to block) vs. only mutate-and-warn is host-dependent and unconfirmed without a live smoke test; (c) it does not catch a schema-valid, route-matched artifact that does semantically wrong-mode work internally.
- **"Mode D" is real and already fired at least once.** Every one of the 7 surviving `/deep:*` command files opens with an identical "Phase 0: @GENERAL AGENT VERIFICATION" self-check — soft advisory prose asking the model to self-classify, with a hard block on "NO or UNCERTAIN." Phase 005's own research-mode failure (`STATUS=FAIL ERROR="General agent required"`) is a directly-confirmed, already-fired instance of exactly this mechanism — GPT reading an advisory self-check as a mandatory gate it must resolve before proceeding, and halting. This is a genuinely distinct root cause from mis-routing or latency, and it doesn't get fixed by FIX-5 (hard identity prevents wrong-agent dispatch; it does nothing about a model halting on a step it misreads as a gate). Fix: replace the self-classification question with a deterministic dispatch-context check (was this file invoked directly, or handed off via Task delegation?) across all 7 command files.
- **A GPT-vs-Claude benchmark is needed**, but round 2 added two hard preconditions round 1 didn't know it needed: (1) the ai-council leg is uninterpretable until the route-proof identity is reconciled toward the registry (§2 below); (2) a failure-classification schema must separate `phase0_self_check`/Mode-D failures from generic `route_mismatch`/`missing_artifact`/`timeout_latency` — otherwise a cheap, already-diagnosed Mode-D failure gets miscounted as unresolved GPT unreliability, repeating the exact conflation `gpt-fast-high`'s `stuck_latency` bucket already made in round 1.

## 2. The ai-council Route-Proof Finding (corrected, final)

**Final, cross-validated understanding** (2 of 3 round-2 lineages independently confirmed by direct code trace; the 3rd — `sonnet-critical` — made the citation-trust error this correction fixes):

The round-2 record-emitting code (`orchestrate-topic.cjs:310-313`) and the YAML validator (`deep_ai-council_auto.yaml:132-136`) **agree with each other** — both use `mode: council`, `target_agent: deep-ai-council`. Route-proof validation therefore **passes**, not fails as `sonnet-critical` originally claimed. The real defect is one level up: both of those agreeing values are **wrong relative to the actual source of truth**, `mode-registry.json` (`workflowMode: ai-council`, `agent: ai-council`) and the council's own emitted header (`mode=ai-council; target_agent=@ai-council`). `mode: council` is the *runtimeLoopType*, not the *workflowMode*; `target_agent: deep-ai-council` is the **packet name**, not an actual agent — no agent by that name exists. So route-proof currently certifies an artifact naming a non-existent agent as valid. This is a false-negative of the identical class the route-proof mechanism (phase 002) was built to catch, just one layer removed: the validator isn't wrong about matching the record, the record and validator are both wrong about what they should be matching *to*.

**Fix (unchanged in substance from round 2, corrected in framing):** edit `orchestrate-topic.cjs:310-313` and `deep_ai-council_auto.yaml:132-136` together, in the same change — `mode: council → ai-council`, `target_agent: deep-ai-council → ai-council` (or `@ai-council`), `resolved_route` updated to match. This is a small, low-risk, two-file edit. **Both sides must change together** — editing only one side converts a currently-passing-but-wrong state into a real, blocking FAIL. Sequence this before phase 011's benchmark runs its ai-council leg (per §4's numbering); the benchmark's ai-council result is not meaningful until this lands.

## 3. Consolidated KQ Answers (final)

| KQ | Final Answer | Confidence |
|---|---|---|
| Decisive smoke evidence | Design an 8-run (4 modes × 2 models) external, non-OpenCode-shell smoke. The Claude/native leg does not need the external shell (only the GPT leg does, per `cli-opencode`'s self-invocation guard) — it can and should be run now as a partial check while the full harness is built. | High (4 lineages) |
| Real-world mis-route mechanism | A mix, not one class: mis-routing (missing orchestrate rows), **Mode D** (advisory-prose-as-hard-gate, confirmed-fired at least once), and latency (role-resolution overhead) as a separate, non-routing issue. | High (5 lineages) |
| ai-council subagent-only | Do not convert. Fix the route-proof identity instead (§2). | Unanimous (6/6) |
| orchestrate hardening | Registry-resolve the existing Deep Route field; add missing Priority-table rows; dispatch the resolved **leaf** at depth 1. Never Task-dispatch `@deep` itself as a depth-1 worker (NDP violation). | High (3 lineages traced the NDP mechanics explicitly) |
| Enforcement plugin | Feasible via `tool.execute.before`; detection-only; fail-closed capability unconfirmed without a live smoke test; default-export-only entrypoint required or hooks silently don't register. | High (3 lineages) |
| GPT-vs-Claude benchmark | 4 modes × 2 models, route-proof correctness + latency + a Mode-D-specific failure bucket. Blocked on the ai-council fix (§2) and Mode-D gate removal landing first. | Unanimous (6/6) |
| Literal-instruction-following pattern | Generalize `deep.md`'s pattern (deterministic table + one bounded clarification gate + pre-resolved header + fail-closed consistency check) to routing surfaces only — not to leaf/execution agents, which need to preserve Claude's evidence-responsive flexibility. | Unanimous (6/6) |
| Propagation scope | `orchestrate.md` (+ `.claude` mirror), the 4 deep command YAML/prompt seams, `orchestrate-topic.cjs` (ai-council identity fix), all 7 command files' Phase-0 blocks (Mode D fix), the new plugin surface. | High (5 lineages) |
| FIX-5 unpark decision | Wait. Negative gate: unpark only if, after the cheaper fixes land and the benchmark runs, GPT still shows semantic wrong-mode artifacts, a route-proof mismatch, or disproportionate stuck/latency failures on any mode while Claude passes. This is now confirmed via 3 independent non-GPT-biased convergences (glm-max, sonnet-critical, opus-critical) plus GPT's own self-critical agreement (gpt-critical). | Very high (6/6, cross-model) |

## 4. Recommended Phase Breakdown (final, reconciling all lineages)

Continuing numbering from phase 007:

1. **008 — Mode-D + route-identity fixes (low-risk, land first).** Replace the Phase-0 self-classification gate in all 7 `/deep:*` command files with a deterministic dispatch-context check. Reconcile the ai-council route-proof identity (`orchestrate-topic.cjs` + `deep_ai-council_auto.yaml`) toward the registry, both files together. Bundle `.claude` mirrors.
2. **009 — Orchestrate NDP-safe registry delegation.** Add the missing Priority-table rows, registry-resolve the Deep Route field, dispatch the resolved leaf directly at depth 1.
3. **010 — Detection-layer enforcement plugin.** Build the `tool.execute.before` hook; smoke-test whether fail-closed (throw) rejection actually works on the installed OpenCode version before relying on it.
4. **011 — External smoke + GPT-vs-Claude benchmark.** Run only after 008+009 land (so the benchmark measures the improved system, and the ai-council leg is meaningful). Requires a **confirmed genuine external, `OPENCODE_PID`-free shell** — verify this exists before starting; if it doesn't, this entire phase and everything downstream of it is unreachable, exactly as phase 005 already discovered once.
5. **012 — FIX-5 decision checkpoint.** Apply the negative gate from §3 against the 011 results. Unpark only if triggered.

## 5. Residual Risks Carried Forward

- **Gate runnability is still the single highest-priority residual.** The entire 011→012 chain depends on a genuine external shell existing and actually being used. This exact precondition already blocked phase 005 once.
- **Mode D magnitude is confirmed-in-mechanism and confirmed-fired-once, but not measured across all modes/models.** The 011 benchmark, with the Mode-D failure bucket added, is the measurement path.
- **Plugin fail-closed semantics are unconfirmed from the type surface alone** — `tool.execute.before` exists and can rewrite `args`, but whether it can genuinely reject (throw) a dispatch, versus only mutate-and-warn, is host-dependent and needs a live smoke test before phase 010 is considered done.
- **The ai-council fix is two-sided and touches live, uncommitted working-tree state** ("155 alignment" work in progress per opus-critical's iteration notes) — land both files in the same change; a one-sided edit converts a currently-passing-but-wrong state into a real FAIL.
- **`glm-critical`'s reproducible stall is worth its own follow-up** — a GLM-5.2 dispatch via `cli-opencode` hung near-silently (near-zero CPU, no error, no timeout enforcement at the configured 900s) for 29-50 minutes across 3 attempts, consistent with an API-side quota/usage exhaustion the runtime doesn't detect or surface cleanly. This is a real gap in the deep-research runtime's failure handling, independent of this packet's actual subject matter.
- **Mis-route taxonomy (A/B/C) and the FIX-1…FIX-5 ranking remain operator-asserted axioms**, carried from the predecessor research (`../001-deep-agent-router-and-orchestration/research/research.md` §0) and not re-validated by either round of this research.
- **Codex parity** stays deferred (pre-existing TOML-location contradiction, out of scope for this packet).

## 6. Lineage Summary

| Lineage | Round | Model | Iterations | Stop reason | Notes |
|---|---|---|---|---|---|
| `glm-max` | 1 | GLM-5.2, reasoning max | 30/30 | `maxIterationsReached` | 0 failed/salvaged |
| `gpt-fast-high` | 1 | GPT-5.5-fast, reasoning high | 30/30 | `max_iterations` | 30/30 required stdout-salvage recovery (narrative intact); this is the lineage round 2 was commissioned to critique |
| `sonnet-critical` | 2 | Claude Sonnet 5, effort high | 10/10 | `maxIterationsReached` | Found real, valuable corrections (Mode D upgrade, NDP violation, ai-council code-tracing); one high-confidence claim (ai-council "guaranteed FAIL") was itself overturned by round 2's own subsequent lineages — see §0 |
| `glm-critical` | 2 | GLM-5.2, reasoning max | **1/10 (partial)** | Reproducible stall, 3 attempts, abandoned | GLM usage was at 0 (operator-confirmed); infrastructure failure, not a research-quality issue; iteration 1's findings are preserved and counted |
| `opus-critical` | 2 | Claude Opus 4.8, effort high | 10/10 | `maxIterationsReached` | Corrected sonnet-critical's ai-council claim via direct code trace of the actual record emitter; confirmed everything else |
| `gpt-critical` | 2 | GPT-5.5-fast, reasoning high | 10/10 | `max_iterations` | GPT self-critiquing its own prior lineage; independently reached the same corrected ai-council understanding as opus-critical; explicitly flagged its own residual self-assessment bias in its final self-check |

<!-- ANCHOR:references -->
## References

- Predecessor research: `../001-deep-agent-router-and-orchestration/research/research.md`
- Research charter (both rounds): `research-prompt.md`
- Goal / operator symptom report: `../goal-prompt.md`
- Phase 005 (inconclusive smoke): `../005-gpt-verification-smoke/implementation-summary.md`, `verification-smoke.md`
- Phase 006 (FIX-5 decision record): `../006-host-hard-identity-fix5/decision-record.md`
- All 6 lineage syntheses: `lineages/glm-max/research.md`, `lineages/gpt-fast-high/research.md`, `lineages/sonnet-critical/research.md`, `lineages/glm-critical/iterations/iteration-001.md`, `lineages/opus-critical/research.md`, `lineages/gpt-critical/research.md`
- Merged findings registry: `deep-research-findings-registry.json`
- Fan-out attribution: `fanout-attribution.md`
<!-- /ANCHOR:references -->
