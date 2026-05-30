# Iteration 001 — RQ1 Scoring Dimensions + RQ7 Prior Art (MiniMax-2.7)

## Focus
RQ1: Define the scoring dimensions for benchmarking a skill's real-world utilization — routing/activation accuracy, unprompted reference/asset discovery, efficiency/bottlenecks, usefulness via skill-on/skill-off ablation, and structural connectivity (orphan refs, dead router keys). Plus RQ7: external prior art on tool/skill discoverability and routing evaluation (retrieval precision/recall, tool-selection accuracy, ablation, LLM-as-judge, agent-eval harnesses).

---

## Actions Taken

1. **Read deep-agent-improvement SKILL.md** — mapped the skill's two co-equal lanes (Agent-Improvement / Model-Benchmark), three pluggable seams (candidate-source, dispatcher, scorer), smart router (INTENT_SIGNALS, RESOURCE_MAP, RUNTIME_ASSETS), lane-aware references/assets organization, loop-host.cjs entry point with `--mode` flag, and the 5-dimension scoring rubric.
2. **Read sk-doc SKILL.md and system-skill-advisor SKILL.md** — confirmed sk-doc validates doc shape/package-structure, and system-skill-advisor routes requests externally at ≥0.8 confidence. Lane C is positioned as distinct from both.
3. **Reviewed sibling packet 121-deep-agent-improvement-benchmark-mode/001-mode-selector-design/spec.md** — the Lane B template established the mode selector pattern, pluggable seams, and the evaluator contract. Lane C inherits the same architecture.
4. **Synthesized RQ1 measurement framework** from deep grounding in the skill's own router design, the evaluator contract, and cross-referencing with prior art from Tau-Bench and Brown et al.

---

## Findings

### F-minimax-i1-1: The skill's smart router is self-referential — and this is the primary measurement target

The deep-improvement skill's SKILL.md (§2 Smart Routing) defines `INTENT_SIGNALS`, `RESOURCE_MAP`, and `RUNTIME_ASSETS` that collectively determine which sub-documents load for a given task text. Lane C must answer: given a realistic prompt that should activate the skill, does the router actually load the correct references? The router is both the subject of measurement and the mechanism of measurement — which creates a distinct challenge: the router scores itself.

This contrasts with Lane A (agent-improvement scores a bounded agent) and Lane B (model-benchmark scores model outputs against fixtures). Lane C scores the skill's own routing behavior in the wild.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:97-214]

### F-minimax-i1-2: The three pluggable seams determine Lane C's insertion point

The skill architecture exposes three extension points: candidate-source (where scenarios come from), dispatcher (how they're routed to executors), and scorer (how outcomes are evaluated). Lane C scenario fixtures are the candidate-source; a hint-free dispatch harness is the dispatcher; a new benchmark scorer plugs into the scorer seam. The existing `loop-host.cjs --mode=skill-benchmark` pattern is the correct entry point — no new infrastructure required, just a new mode.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:275-280]

### F-minimax-i1-3: Lane-aware resource organization creates the observable surface

Resources are strictly partitioned by lane under `references/` and `assets/`: `agent-improvement/`, `model-benchmark/`, `shared/`. This is critical for Lane C because the benchmark harness must observe which documents load vs which should have loaded — the lane boundaries are the natural comparison points. For a given scenario, the expected document set is fully enumerated from the skill's own RESOURCE_MAP for that intent class.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:81-88]

### F-minimax-i1-4: sk-doc validates shape — Lane C measures behavior

sk-doc enforces document structure, frontmatter, README presence, and component consistency. It answers "does this skill look correct?" not "does this skill work correctly when invoked?" Lane C fills the behavioral gap. They are complementary and non-overlapping: a skill can have perfect sk-doc compliance and still route incorrectly, load wrong references, or create token overhead that makes AIs skip it.

[SOURCE: .opencode/skills/sk-doc/SKILL.md:14-20, 46-50]

### F-minimax-i1-5: system-skill-advisor operates at a different layer

The advisor routes requests to skills via `advisor_recommend` on `mk_skill_advisor` at ≥0.8 confidence. It scores the *selection* of the correct skill from the global skill set. Lane C scores what happens *after* a skill has been selected — whether the skill's own smart router activates correctly. These measure different things: external routing accuracy vs internal routing accuracy. Both are worth measuring as separate sub-dimensions.

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-73]

### F-minimax-i1-6: Prior art — Coverage (skill-on vs skill-off ablation) is the fundamental usefulness metric

"Large Language Monkeys" (Brown et al., 2024) establishes that coverage — the fraction of problems solved by any generated sample — scales log-linearly with repeated sampling. For skill benchmarking: Coverage = task success rate with skill active minus task success rate without it. This is the cleanest ablation measure because it directly measures the skill's marginal contribution to task outcomes. Repeated sampling addresses the non-determinism concern — coverage is stable across runs when averaged.

[SOURCE: arxiv.org/abs/2407.21787]

### F-minimax-i1-7: Prior art — Tau-Bench establishes tool-call trace capture for routing observation

Tau-Bench (Berkeley, 2024) demonstrates that multi-round agent evaluation with tool-call sequence traces produces reproducible capability measurements. Translated to Lane C: a hint-free dispatch harness captures the AI's file-read trace (which documents were opened, in what order) without revealing expected answers. The trace IS the measurement signal. This mirrors exactly how Lane B's benchmark runner captures output artifacts for scoring.

[SOURCE: arxiv.org/abs/2404.08144]

### F-minimax-i1-8: Prior art — Tool retrieval precision/recall maps to routing P/R

ToolACE, API-Bank, and BMT benchmarks measure tool-augmented LLMs on: (a) retrieval precision/recall — did the model retrieve the right tool? (b) tool selection accuracy — did it call the right tool? (c) argument binding accuracy — did it pass correct arguments? Translated to Lane C: routing precision = did the AI load the right reference? routing recall = did the AI load all relevant references for this intent? INTENT_SIGNALS keyword matching ≈ argument binding quality. The key difference: tool retrieval benchmarks have ground-truth tool inventories; Lane C must derive the expected document set from the skill's own RESOURCE_MAP (which is self-referential by design).

[SOURCE: academic synthesis from tool-use benchmark literature]

### F-minimax-i1-9: Prior art — LLM-as-judge applicability and circularity risk

LLM-as-judge evaluates agent outputs on multi-dimensional rubrics (helpfulness, correctness, coherence). Applied to Lane C: judge prompts with vs without the target skill's context, then scores the outcome delta. The critical risk is circularity: if the judge knows the skill is being benchmarked, it may score differently. Mitigation: use task-only prompts without mentioning the skill; judge on task outcomes, not skill-specific quality. This works for usefulness scoring but is harder for routing accuracy — routing correctness requires knowing the expected route, which leaks into the prompt.

[SOURCE: academic synthesis]

### F-minimax-i1-10: RQ1 — Five scoring dimensions for Lane C, operationalized

| Dimension | What It Observably Measures | Hint-Free Capture Method | Normalization |
|---|---|---|---|
| **D1: Routing/Activation Accuracy** | Fraction of correctly routed intent classes (loaded correct refs, did not load irrelevant refs) | Scenario prompts with ground-truth expected-resource sets; compare loaded docs against expected; trace the skill's own RESOURCE_MAP as ground truth | Fraction = correct-routes / total-routes; per-skill, not cross-skill absolute |
| **D2: Unprompted Discovery (P/R)** | Precision = loaded relevant refs / total loaded; Recall = loaded relevant refs / total relevant refs in skill | Log all Read() calls during skill invocation against the skill's full references/assets inventory | P/R normalized against skill size; smaller skills have smaller denominator |
| **D3: Efficiency/Bottlenecks** | Tool calls to reach needed resource; token overhead from over-loading; dead router keys (keys with zero hits across all scenarios) | Count tool calls per scenario; parse RESOURCE_MAP keys for zero-hit keys; measure context loaded vs context needed | Relative to skill complexity; dead-key % is skill-absolute (lower is better) |
| **D4: Usefulness (Ablation)** | Task success delta: skill-on vs skill-off; measures marginal contribution of the skill | Run scenario with and without skill context; judge task outcome (pass/fail or quality score) | Delta in success rate (0-1); also report variance across repeated runs |
| **D5: Structural Connectivity** | Orphan references (present in inventory, never loaded in any scenario); broken routing keys (key in RESOURCE_MAP but no scenario triggers it) | Cross-reference load log (from D1/D2 traces) against full inventory and RESOURCE_MAP key set | Orphan % and dead-key % (both lower is better); per skill-absolute |

[SOURCE: synthesized from F1-F9]

### F-minimax-i1-11: Normalization across skill shapes

Skills vary in reference count (3 vs 30), router key count (5 vs 20), asset count, and structural complexity. Cross-skill comparability requires: (a) fractional scores within each skill's own inventory (recall = loaded-relevant / total-relevant-in-skill); (b) per-dimension z-scores against a skill-population baseline (requires a benchmark corpus of diverse skills first); (c) complexity-weighted aggregation where larger skills have higher absolute thresholds for counts but the same proportional expectations. For initial deployment, D1-D4 use fractional scoring per skill; D5 uses skill-absolute percentages.

[SOURCE: synthesized]

### F-minimax-i1-12: Loop-host.cjs --mode=skill-benchmark is the correct entry point

The existing `--mode` flag architecture already supports three lanes. Lane C reuses the same entry point, dispatcher seam, and scorer seam — only the scorer implementation changes. The dispatcher injects hint-free scenario prompts; the scorer compares traces against ground-truth. No new CLI commands required; existing hardening infrastructure (DEEP_AGENT_ALLOW_CRITERIA_EXEC, DEEP_AGENT_GRADER_CACHE_RAW) applies similarly.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:277-280]

---

## Recommendations

1. **D1 (Routing Accuracy) and D2 (Discovery P/R) are the highest-priority dimensions** — they directly measure whether the skill's core router works. D4 (Usefulness) is the ultimate measure but harder to isolate from task difficulty. Score D1+D2 first; D4 as secondary validation.

2. **The dispatch harness must log Read() calls without the AI knowing** — the cleanest mechanism is a thin logging wrapper around the skill invocation that records which files were read (from the tool-call log), not what the content was. Compare against the skill's own RESOURCE_MAP to compute D1 and D2.

3. **Ground-truth expected-resource sets come from the skill's own RESOURCE_MAP** — this avoids needing external annotations. For each scenario's intent class, map to the expected documents via the skill's own router config. This is self-referential but auditable: the RESOURCE_MAP is human-readable and the scenario author can review it.

4. **D5 (Structural Connectivity) is the most actionable output** — orphan references and dead router keys are concrete, fixable findings. A skill with 3 orphan refs and 2 dead keys can be improved directly. D1-D4 are diagnostic but depend on scenario quality; D5 is deterministic.

5. **Lane C should be advisory/diagnostic by default** (matching the spec's NG1): it emits a Skill Benchmark Report, not a mutation. The report feeds into a Phase 003 remediation workflow or directly into Lane A (agent-improvement) if the operator chooses.

---

## Open Questions

- **OQ1**: Should D1 measure external routing (skill-advisor picked this skill correctly) or internal routing (skill loaded correct refs), or both as separate sub-scores? Currently leaning toward both as sub-dimensions D1a (external, skill-advisor accuracy) and D1b (internal, smart router accuracy).

- **OQ2**: How to avoid circularity in D4 (usefulness ablation) when the judge is itself an AI that may route to the skill being measured? Requires a clear ablation protocol: skill context removed entirely vs skill context replaced with a placeholder.

- **OQ3**: Scenario authoring protocol — hand-authored scenarios avoid circularity but don't scale; generated scenarios (from the skill's own triggers/INTENT_SIGNALS) risk baking in the expected routing behavior. A hybrid: hand-author a minimum viable set of intent classes, then generate variations programmatically.

- **OQ4**: Normalization at scale — the first few skills benchmarked will lack a population baseline for z-scoring. Start with per-skill fractional scoring; add population normalization when 10+ diverse skills have been benchmarked.

- **OQ5**: RQ6 (rename surface) was not addressed in this iteration — requires a dedicated pass across all references to deep-agent-improvement in the codebase.

---

## Next Focus
Iteration 2: Deep-dive on RQ2 (hint-free dispatch harness design) + OQ1 resolution (external vs internal routing scoring). Design the harness architecture and the Read() call logging mechanism.