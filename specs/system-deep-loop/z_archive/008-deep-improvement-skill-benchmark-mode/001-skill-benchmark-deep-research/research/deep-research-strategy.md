# Deep Research Strategy — 122/001 skill-benchmark (run: MiniMax-2.7)

## 2. TOPIC
Design Lane C ("skill-benchmark") for the `deep-improvement` skill: how to benchmark whether a *skill* is well-structured, well-routed, efficient, and useful **in practice** (how AIs actually discover/use it), distinct from manual testing playbooks and sk-doc doc-shape validation. Plus the `deep-agent-improvement` → `deep-improvement` rename impact map.

## 3. KEY QUESTIONS (remaining)
- [ ] RQ1: Scoring dimensions + weights for benchmarking real-world skill utilization (routing/activation accuracy, unprompted reference/asset discovery, efficiency, usefulness/ablation, structural connectivity); normalization across skills of different shapes.
- [ ] RQ2: A credible hint-free dispatch harness that captures which references/assets an AI loads + tool trace, without leaking the expected answer.
- [ ] RQ3: Score activation vs the skill-advisor, vs the in-SKILL.md smart router, or both as separate sub-scores; operational meaning of "properly utilized".
- [ ] RQ4: Scenario/fixture authoring — hand-authored vs generated-from-the-skill's-own-triggers; avoiding circularity.
- [ ] RQ5: How the Skill Benchmark Report should rank bottlenecks + express remediations for follow-up action.
- [ ] RQ6: Exhaustive rename surface + safe ordering for deep-agent-improvement → deep-improvement (skill dir, SKILL.md, commands, agent + runtime mirrors, advisor graph, descriptions.json, sentinel, root docs).
- [ ] RQ7: Prior art — how agent/skill frameworks measure tool/skill discoverability + routing efficiency (retrieval precision/recall, ablation, LLM-as-judge) and what transfers.

## 4. NON-GOALS
Implementing fixes; remediating the skills Lane C flags; replacing sk-doc validation or manual playbooks; redesigning deep-loop-runtime. Research only — report findings, do not implement.

## 5. STOP CONDITIONS
Reach 5 iterations, OR all RQ1–RQ7 answered with cited evidence and stable newInfoRatio.

## 6. ANSWERED QUESTIONS
[None yet]

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
## 8. WHAT FAILED
## 9. EXHAUSTED APPROACHES (do not retry)
## 10. RULED OUT DIRECTIONS
## 11. NEXT FOCUS
Iteration 1: Establish the measurement framework for RQ1 + survey prior art (RQ7) — define candidate scoring dimensions and how each is observably measured; ground in the actual deep-improvement skill structure (Lanes A/B, smart router, references/assets layout) and the 121 sibling.
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- Target skill: `.opencode/skills/deep-agent-improvement/` (to be renamed `deep-improvement`). Has Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) + Lane B (model-benchmark, `/deep:start-model-benchmark-loop`); three pluggable seams (candidate-source, dispatcher, scorer); entry `scripts/shared/loop-host.cjs --mode=<lane>`; references/assets organized by lane (`agent-improvement/`, `model-benchmark/`, `shared/`); uses `deep-loop-runtime`.
- Sibling packet `121-deep-agent-improvement-benchmark-mode` built Lane B (18 phases) — template for this work.
- Lane C = third lane reusing the same seams + `loop-host.cjs --mode=skill-benchmark`.
- Smart-router pattern: SKILL.md INTENT_SIGNALS + RESOURCE_MAP + RUNTIME_ASSETS; skill-advisor (`system-skill-advisor`) routes requests to skills at ≥0.8 confidence.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 | Convergence: 0.01 | Per-iteration: 12 tool calls / 10 min
- Executor: cli-opencode minimax/MiniMax-M2.7 | Generation 1 | Started 2026-05-30
