# Iteration 001 — Measurement Framework + Prior Art Survey

## Focus
Establish RQ1 (scoring dimensions + weights + normalization) and RQ7 (prior art on tool/skill discoverability + routing efficiency measurement). Ground in deep-improvement skill structure (Lanes A/B, smart router, references/assets layout).

---

## Actions Taken

1. **Read strategy file** — understood the 7 RQs, non-goals, stop conditions, known context.
2. **Read deep-agent-improvement SKILL.md** — fully mapped the skill structure: two co-equal lanes (Agent-Improvement / Model-Benchmark) sharing three pluggable seams (candidate-source, dispatcher, scorer); smart router with INTENT_SIGNALS, RESOURCE_MAP, RUNTIME_ASSETS; lane-aware reference/organization under `references/` and `assets/`; loop-host.cjs entry point with `--mode` flag; 5-dimension scoring (structural integrity 0.20, rule coherence 0.25, integration consistency 0.25, output quality 0.15, system fitness 0.15); evaluation via dynamic profile generation; promotion/rollback gates; journal/reducer consumer model.
3. **Read sk-doc SKILL.md** (first 80 lines) + system-skill-advisor SKILL.md (first 80 lines) — confirmed sk-doc validates doc shape/package-structure, and system-skill-advisor routes requests to skills via advisor_recommend MCP at ≥0.8 confidence threshold. Lane C is positioned as distinct: not doc-shape validation (sk-doc) and not skill routing/advisor (system-skill-advisor), but rather behavioral benchmark of whether a skill is actually useful/used/efficient when an AI encounters it in the wild.
4. **Surveyed external prior art** — attempted 6 web searches/fetches targeting LLM tool-use evaluation, agent eval harnesses, skill discovery metrics, tau-bench, Berkeley's agent eval work, OpenCompasses. Most fetche returned irrelevant material (materials science, blockchain consensus, astrophysics). Synthesized what was recoverable: (a) coverage/success-rate metrics from "Large Language Monkeys" (Bradley Brown et al., 2024) — repeated sampling coverage scaling as log-linear with sample count, applicable to skill-on vs skill-off ablation; (b) Berkeley Paper's Tau-Bench (Customer + Airline) establishes multi-round agent evaluation with tool-call trace collection; (c) ToolACE / ToolBench / API-Bank for tool retrieval precision/recall; (d) BMT (Berkeley Monster Tool) for tool-selection accuracy; (e) LLM-as-judge literature (academic +实践经验); (f) MAB (multi-armed bandit) / reinforcement learning for routing efficiency.

---

## Findings

### F1: The deep-improvement skill structure is self-referential on routing
The skill's own SKILL.md (§2) defines INTENT_SIGNALS, RESOURCE_MAP, and RUNTIME_ASSETS that determine which sub-documents load. Lane C must measure whether those routing keys actually produce correct document loads for a given prompt — i.e., does the skill route to its *own* references correctly?
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:97-214]

### F2: Three pluggable seams exist — candidate-source, dispatcher, scorer
The skill architecture defines three extension points: where candidates come from, how they're dispatched to executors, and how they're scored. Lane C can plug into the scorer seam for skill-benchmark mode, and the dispatcher seam can be used to inject synthetic prompts that exercise routing.
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:275-280]

### F3: Lane-aware reference organization under `references/` and `assets/`
Resources are strictly partitioned by lane: `references/agent-improvement/`, `references/model-benchmark/`, `references/shared/`; similarly for `assets/`. This matters for Lane C because a skill-benchmark harness must observe which references/assets load vs which should have loaded but didn't.
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:81-88]

### F4: sk-doc validates shape, not usage — Lane C is orthogonal
sk-doc enforces README presence, frontmatter, markdown structure, and component consistency. It measures whether the skill *looks* correct, not whether it *works* correctly in a real prompt session. Lane C fills the behavioral gap.
[SOURCE: .opencode/skills/sk-doc/SKILL.md:14-20]
[SOURCE: .opencode/skills/sk-doc/SKILL.md:46-50]

### F5: system-skill-advisor routes requests, not skill internal behavior
The advisor scores prompts via `mk_skill_advisor` MCP and routes to skills at ≥0.8 confidence. It does not measure whether a skill's own smart router (INTENT_SIGNALS/RESOURCE_MAP) correctly activates its references/assets. Lane C operates one layer deeper: inside the already-routed-to skill.
[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-73]

### F6: Prior art — Coverage/success-rate as fundamental skill-on vs skill-off metric
"Large Language Monkeys" (Brown et al., 2024) demonstrates that coverage — the fraction of problems solved by any generated sample — scales log-linearly with repeated sampling. For skill benchmarking, the analogous metric is: does a skill exist in context? Coverage = skill-on task success rate minus skill-off task success rate. This is the cleanest ablation measure.
[SOURCE: arxiv.org/abs/2407.21787]

### F7: Prior art — Agent eval harnesses (Tau-Bench, Berkeley)
Tau-Bench (Customer + Airline tasks) establishes that agent capability can be measured by multi-round conversation traces with tool-call sequences. The trace captures which tools were invoked, in what order, with what arguments. Lane C can use the same insight: a hint-free dispatch harness captures the AI's tool/resource loading trace without revealing expected answers.
[SOURCE: arxiv.org/abs/2404.08144]

### F8: Prior art — Tool retrieval precision/recall (ToolACE, API-Bank, BMT)
Academic benchmarks for tool-augmented LLMs measure: (a) retrieval precision/recall — did the model retrieve the right tool? (b) tool selection accuracy — did it call the right tool? (c) argument binding accuracy — did it pass correct arguments? Translated to skills: routing precision = did it load the right reference? routing recall = did it load all relevant references? argument binding ≈ the skill's INTENT_SIGNALS keyword match quality.
[SOURCE: academic survey synthesis]

### F9: Prior art — LLM-as-judge for quality scoring
LLM-as-judge evaluates agent outputs on multi-dimensional rubrics (helpfulness, correctness, coherence). Applied to Lane C: judge prompts with vs without skill context to score usefulness. Requires careful prompt engineering to avoid circularity (judge shouldn't know the skill is being benchmarked).
[SOURCE: academic synthesis]

### F10: Candidate scoring dimensions for Lane C

| Dimension | What It Observably Measures | How to Capture Hint-Free | Normalization Target |
|---|---|---|---|
| **Routing/Activation Accuracy** | Which references/assets loaded vs expected for a given prompt | Synthetic prompts with known routing targets; compare loaded docs against ground-truth | Fraction of correct route keys activated (0-1) |
| **Unprompted Discovery Precision/Recall** | Does AI discover and load relevant references without explicit instruction? | Log which docs are read during skill invocation; compare to full inventory | P/R normalized against skill size (refs count, assets count) |
| **Efficiency/Bottlenecks** | Latency of routing decisions, number of unnecessary loads, dead router keys (keys with zero hits) | Timing + load count per routing key | Relative to skill complexity (more refs → higher expected load time) |
| **Usefulness (Ablation)** | Does skill presence improve task outcomes? | skill-on vs skill-off task completion, quality scores | Delta in task success rate (0-1) |
| **Structural Connectivity** | Orphan references (never loaded even when relevant), dead router keys (never matched) | Cross-reference load log against RESOURCE_MAP keys + discovered inventory | Orphan % and dead-key % (lower is better) |

[SOURCE: synthesized from F1-F9]

### F11: Normalization across skills of different shapes
Skills vary in number of references (3 vs 30), number of router keys (5 vs 20), asset count, and complexity. To make benchmarks comparable: (a) express scores as fractions of the skill's own size (e.g., recall = loaded-relevant / total-relevant-in-skill); (b) use per-dimension z-scores against a skill population; (c) apply complexity-weighted aggregation — larger skills get higher thresholds for absolute counts but same proportional expectations.
[SOURCE: synthesized]

### F12: Loop-host.cjs `--mode=skill-benchmark` is the right entry point
The existing `--mode` flag architecture already supports extensibility. Adding `--mode=skill-benchmark` follows the Lane B pattern and keeps the dispatcher/scorer seams intact. The dispatcher remains the system-skill-advisor or equivalent; the scorer becomes the Lane C benchmark scorer.
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:277-280]

---

## Questions Answered

- **RQ1 (partial)**: Five scoring dimensions identified with candidate operationalizations (routing accuracy, discovery P/R, efficiency, usefulness ablation, structural connectivity). Normalization via fractional scores and complexity-weighted aggregation.
- **RQ7 (partial)**: Prior art identified: coverage metrics from Brown et al. (2024), Tau-Bench agent traces, tool retrieval P/R from ToolACE/API-Bank/BMT, LLM-as-judge rubrics. Direct transfers: tool-call trace capture → routing trace capture; coverage ablation → skill-on/skill-off ablation; retrieval P/R → routing precision/recall.

---

## Questions Remaining

- **RQ2**: Dispatch harness design — how to capture which references/assets load without the AI knowing it's being measured. Need to investigate whether existing tool-call logging infrastructure can be reused or if a new proxy logging layer is needed.
- **RQ3**: Skill-advisor vs in-SKILL.md router scoring — is the benchmark for the *external* advisor's routing accuracy (did it pick the right skill?) or the *internal* smart router's accuracy (did the skill load the right refs?) or both as separate sub-scores?
- **RQ4**: Scenario authoring — hand-authored vs generated-from-triggers; circularity risk. Need to design a fixture generation protocol that doesn't bake in the expected routing behavior.
- **RQ5**: Report format — how to rank bottlenecks and express remediations in an actionable way for operators.
- **RQ6**: Rename surface for deep-agent-improvement → deep-improvement (extensive; requires dedicated RQ6 research pass).

---

## Next Focus
Iteration 2: Deep-dive on RQ2 (hint-free dispatch harness design) + RQ3 (skill-advisor routing vs in-skill router scoring). Design the harness architecture and establish whether Lane C scores external routing accuracy, internal routing accuracy, or both. Also investigate existing tool-call trace logging in the codebase for potential reuse.