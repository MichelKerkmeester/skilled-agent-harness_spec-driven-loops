# Deep Research Strategy — 122/002 implementation-deep-research (run: MiniMax-2.7)

## 2. TOPIC
Determine the best way to IMPLEMENT the `deep-agent-improvement` → `deep-improvement` rename and Lane C ("skill-benchmark"). The design is already converged in `001-skill-benchmark-deep-research/research/research.md`; this loop turns that design into a concrete, build-ready implementation playbook (code architecture, runtime wiring, trace capture, fixtures, scorer/report, rename runbook).

## 3. KEY QUESTIONS (remaining)
- [ ] IQ1: Lane C module architecture & seam reuse within the FIXED per-lane layout (`skill-benchmark/` subdir + `shared/`): what is shared vs Lane-C-specific; how much of Lane B's scorer/grader/cache + `dispatch-model.cjs` to reuse vs fork.
- [ ] IQ2: How to wire `loop-host.cjs --mode=skill-benchmark` (materialize → dispatch → score → report) while keeping Lane A/B byte-identical when the flag is absent (TST-1).
- [ ] IQ3: Trace-capture implementation — fidelity tier to build first; parse ALL file-touch verbs (Read, Bash cat/rg, Grep, Glob) across 5 executors; canonicalize to resource keys; golden-trace fixture.
- [ ] IQ4: Router-replay (Mode A, pure route function) + live (Mode B) implementation; out-of-band `advisor_recommend` capture for D1 inter-skill; A↔B divergence finding.
- [ ] IQ5: Contamination linter (routers' own substring logic) + 3-tier fixture pipeline (T1 auto+paraphrased / T2 hand-authored holdout / T3 adversarial) + public/private schema + T1↔T2 circularity meter + coverage assertion.
- [ ] IQ6: Scorer + report-builder — D1-D5 computation reusing Lane B shapes; render `report.md` FROM `report.json`; bottleneck ranking by funnel attrition; remediation taxonomy.
- [ ] IQ7: Rename execution runbook from the 001 impact map (atomic advisor TS+Python update, index-regen LAST, validation gate) + resolve the 4 decision-record items (agent identity; `deep-model-benchmark` alias; command verbs [keep]; narrow-vs-wide [operator chose NARROW]).
- [ ] IQ8: Pilot skills to dogfood first; weight/verdict-band calibration; vitest/integration test patterns for the new lane; external prior art for harness implementation.

## 4. NON-GOALS
Implementing the rename or Lane C (later phases); redesigning the converged 001 design; redesigning `deep-loop-runtime`; deciding the per-lane directory layout (fixed) or the rename scope (fixed as narrow). Research only — report findings, do not implement.

## 5. STOP CONDITIONS
Reach 5 iterations, OR all IQ1–IQ8 answered with cited, build-ready evidence and stable newInfoRatio.

## 6. ANSWERED QUESTIONS
[None yet]

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
## 8. WHAT FAILED
## 9. EXHAUSTED APPROACHES (do not retry)
## 10. RULED OUT DIRECTIONS
## 11. NEXT FOCUS
Iteration 1: IQ1 module architecture & seam reuse + IQ8 pilot/calibration/test/prior-art — ground in the actual Lane A/B scripts and the 001 converged design; produce a concrete shared-vs-skill-benchmark module map and a first-pilot plan.
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- Converged design: `001-skill-benchmark-deep-research/research/research.md` — D1-D5 (D1=25 split inter12+intra13, D2=20, D4=25, D3=15, D5=15 hard-gate), hint-free harness (public/private split, contamination linter, Mode A router-replay + Mode B live), 3-tier anti-circular fixtures, dual report (json → md), rename impact map (~12-18 operational files, 7 buckets, index-regen LAST).
- Target skill: `.opencode/skills/deep-agent-improvement/` (→ `deep-improvement`). Lane A (agent-improvement) + Lane B (model-benchmark); entry `scripts/shared/loop-host.cjs --mode=<lane>`; three seams (candidate-source, dispatcher, scorer).
- FIXED layout: one subdir per lane under `assets/`/`references/`/`scripts/` (`agent-improvement/`, `model-benchmark/`, + new `skill-benchmark/`) + `shared/`. Not a research question.
- Operator decision: rename scope = NARROW (skill + agent id + advisor + refs; keep command verbs + `agent-improvement` token family). IQ7 validates/documents it.
- Lane B template: built in packet 121; reuse its scorer/grader/cache + `dispatch-model.cjs` shapes.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 | Convergence: 0.01 | Per-iteration: 12 tool calls / 10 min
- Executor doctrine (operator-set): GPT-5.5 xhigh-fast (cli-codex) generates the 5 iterations; Opus 4.8 agents verify + synthesize. Generation 1 | Started 2026-05-30
