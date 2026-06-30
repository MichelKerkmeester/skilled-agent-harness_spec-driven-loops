# Iteration 001 — DeepSeek-v4-pro: RQ1 Scoring Dimensions + RQ7 Prior Art

**Model:** deepseek-v4-pro | **Iteration:** 1 of 5 | **Date:** 2026-05-30

---

## Focus

Establish the measurement framework for RQ1 (scoring dimensions + weights for benchmarking skill real-world utilization) and survey prior art for RQ7 (how tool/skill discoverability and routing are evaluated externally). Ground findings in the actual deep-agent-improvement skill structure (lanes A/B, smart router, references/assets layout) and the 121 sibling template.

---

## Actions Taken

1. **Read** `.opencode/skills/deep-agent-improvement/SKILL.md` (full 534 lines): analyzed Lane A/B structure, smart router pseudocode with 8 `INTENT_SIGNALS` keys, `RESOURCE_MAP` with 8 intent-to-path entries, `RUNTIME_ASSETS` with `ALWAYS` + conditional `MODEL_BENCHMARK` loading, Lane A 5-dimension evaluation framework (Structural Integrity 0.20, Rule Coherence 0.25, Integration Consistency 0.25, Output Quality 0.15, System Fitness 0.15), three pluggable seams (candidate-source, dispatcher, scorer), and loop-host entry with `--mode=` routing. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:25-214]

2. **Read** `.opencode/skills/sk-doc/SKILL.md` (full 466 lines): identified the boundary between doc-shape validation (DQI scoring via `extract_structure.py`, frontmatter validation, template compliance, structure enforcement) and the Lane C gap — sk-doc validates document quality, NOT real-world AI utilization. Manual testing playbooks are deterministic scenario-driven (not agent-observed). [SOURCE: .opencode/skills/sk-doc/SKILL.md:349-445]

3. **Read** `.opencode/skills/system-skill-advisor/SKILL.md` (full 397 lines): analyzed the advisor's standalone MCP routing model — 8 public tools, semantic-lane scoring with confidence threshold ≥0.8, skill graph SQLite with nodes/edges, fallback to Python shim + keyword matching. The advisor's own INTENT_SIGNALS and RESOURCE_MAP serve as the primary routing-data source for Lane C benchmarking. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-271]

4. **Read** Phase 002 rename spec and Phase 121 template: the rename surface covers skill dir, SKILL.md frontmatter/triggers/keywords, 3 commands, agent file + 4 runtime mirrors (.claude/.codex/.gemini/.opencode), advisor graph, descriptions.json, sentinel sk-prompt-models, and root CLAUDE.md/AGENTS.md. The 121 sibling completed 19 phases — the arc structure (design → research → build → harden → review → remediate → doc) is the proven template. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37-52] [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/spec.md:115-161]

5. **Web-fetched** Berkeley Function Calling Leaderboard (BFCL v4): AST-based evaluation of tool-calling accuracy; multi-category real-world functions; Overall Accuracy as unweighted average across sub-categories; v4 adds holistic agentic evaluation with multi-turn interactions, web search integration, and executor-aware scoring. [SOURCE: https://gorilla.cs.berkeley.edu/leaderboard.html]

6. **Web-fetched** ToolLLM/ToolBench (arXiv 2307.16789): 16,464 real REST APIs across 49 categories; ToolEval automatic evaluator using pass rate and win rate; depth-first search-based decision tree for multi-tool solution path validation; single-tool and multi-tool scenarios. [SOURCE: https://arxiv.org/abs/2307.16789]

7. **Web-fetched** Self-RAG (arXiv 2310.11511): adaptive retrieval with reflection tokens; evaluates whether retrieval was necessary before incorporating passages; reflection tokens enable controllable inference behavior. [SOURCE: https://arxiv.org/abs/2310.11511]

---

## Findings

### RQ1-A: Core Scoring Dimensions

#### D1 — Routing/Activation Accuracy (Recommended Weight: 0.30)

**What it measures:** Whether the AI invokes the skill when it should (recall) and avoids invoking it when it shouldn't (precision). Two sub-dimensions naturally emerge from the existing architecture:

- **Skill-Advisor Routing Precision:** Did `advisor_recommend` return this skill at ≥0.8 confidence for prompts where it is the correct skill? The advisor's own lane weights and fusion scores provide the gold-standard routing expectation. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:70-73]
- **In-Skill Smart-Router Accuracy:** Once the skill is loaded, did the AI's observed tool calls match the correct `INTENT_SIGNALS` + `RESOURCE_MAP` entries? For example, for a "benchmark a model" query, did the router select `MODEL_BENCHMARK` (weight 5) and load the correct `references/model-benchmark/` resources? [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113-133]

**Observable metric:** Normalized F1 = 2 × (precision × recall) / (precision + recall), where precision = (correct skill invocations) / (total skill invocations by AI) and recall = (correct skill invocations) / (total golden prompts that should trigger this skill). Golden prompts are drawn from the skill's own `trigger_phrases` frontmatter plus derived variants. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:6-14]

**Lane C harness implication:** The benchmark dispatcher must send prompts to the AI WITHOUT naming the skill, then observe whether the AI (a) invokes the skill command, (b) loads the correct SKILL.md, and (c) navigates to the right intent-matched resources — all from a hint-free prompt.

#### D2 — Unprompted Reference/Asset Discovery (Recommended Weight: 0.20)

**What it measures:** After skill invocation, does the AI open the right `references/` and `assets/` files without being told their paths? This tests the skill's self-documenting quality — how well its SKILL.md, router pseudocode, and inline path hints guide the AI to the correct deep resources.

**Observable metric:** Resource hit rate = (expected resources opened) / (total expected resources for the prompt intent), penalized by false positives (resources opened that are irrelevant to the intent). Directly analogous to retrieval precision/recall in RAG systems — e.g., Self-RAG's adaptive retrieval with reflection tokens evaluates whether retrieved passages were actually needed. [SOURCE: https://arxiv.org/abs/2310.11511]

**Ground truth sources per skill:**
- `RESOURCE_MAP` entries for each intent (e.g., `LOOP_EXECUTION` → `["references/shared/loop_protocol.md", "references/model-benchmark/benchmark_operator_guide.md"]`) [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124-133]
- `INTENT_SIGNALS` keywords that map to intents [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113-122]
- `RUNTIME_ASSETS` for always-loaded vs conditional assets [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:135-138]

#### D3 — Efficiency/Bottlenecks (Recommended Weight: 0.15)

**What it measures:** Tool-calls, token count, and wall-clock latency to reach the first correct resource and to complete the task. Identifies routing detours, unnecessary reads, and intent-selection overhead.

**Observable metric:** (tool-calls-to-first-correct-resource) + (total tokens consumed) / (skill complexity factor). Complexity factor = number of reference files × number of intents — normalizes across skills of different sizes.

**BFCL parallel:** BFCL v4 measures latency (in seconds) and cost (in USD) per model on their full benchmark. This maps directly: Lane C should measure total tool-call rounds and token cost per scenario. [SOURCE: https://gorilla.cs.berkeley.edu/leaderboard.html]

#### D4 — Usefulness via Skill-On/Skill-Off Ablation (Recommended Weight: 0.25)

**What it measures:** Does having the skill loaded produce measurably better outputs than running the same prompt without skill invocation? This is the "so what" dimension — the skill must demonstrably improve AI performance.

**Observable metric:** Output quality delta scored via LLM-as-judge (a stronger model rates aligned outputs on task completion, correctness, and conciseness). Both the skill-on and skill-off runs get the same prompt; the only difference is whether the skill's SKILL.md and routed resources are in context.

**Precedent:** Ablation studies are standard in retrieval evaluation (BFCL, ToolEval) and agent evaluation (SWE-bench uses execution-based pass@k). LLM-as-judge is established in MT-Bench and AlpacaEval. Lane C can use a deterministic rubric (correctness, completeness, conciseness) scored by a fixed judge model, avoiding self-evaluation circularity.

#### D5 — Structural Connectivity (Recommended Weight: 0.10)

**What it measures:** Static health of the skill's routing fabric. Are all `RESOURCE_MAP` paths valid on disk? Are all on-disk reference files reachable from at least one intent? Are there dead `INTENT_SIGNALS` keys (no matching keywords ever triggered)? Are there orphaned reference files (exist on disk but not referenced in any `RESOURCE_MAP` entry)?

**Observable metric:** Connectivity ratio = (valid RESOURCE_MAP paths on disk) / (total RESOURCE_MAP paths) × (referenced files / total on-disk reference files). Dead key ratio = (unreachable INTENT_SIGNALS keys) / (total keys).

**Precedent in this repo:** The skill-advisor's own `skill_graph_validate` already detects broken edges and schema-version drift. Lane C's structural connectivity check is a lightweight static analysis complement. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:287-289]

### RQ1-B: Normalization Across Skills of Different Shapes

Skills vary widely: `sk-code` has ~15 intents and 40+ references; a small utility skill might have 3 intents and 5 references. Raw tool-call counts or token costs are not comparable across skills.

**Proposed normalization strategy:**
1. **Per-skill baseline:** First run establishes the skill's own D1-D5 scores. Subsequent runs measure delta from baseline.
2. **Complexity-relative thresholds:** Normalize D2 (reference discovery) as (hit rate) / (skill reference count factor); normalize D3 (efficiency) against (reference file count × intent count).
3. **Family-relative ranking:** Compare skills only within the same family (e.g., `cli-*` skills vs each other, `deep-*` skills vs each other).
4. **No absolute pass/fail thresholds:** Skills are scored on a 0-100 composite, not pass/fail. The report ranks remediation actions by likely impact.

### RQ7-A: External Prior Art on Tool/Skill Discoverability

#### BFCL v4 (Berkeley Function Calling Leaderboard)

The most directly transferable prior art. BFCL evaluates LLM function-calling accuracy via AST-based matching of expected vs actual function calls. Key transferable patterns:
- **Multi-category evaluation:** Simple, Multiple, Parallel, Executor-Relevant, Irrelevance Detection, Web Search Integration — each tests a different tool-selection sub-skill
- **AST-based correctness:** Rather than string-matching, parses output into an AST and validates argument types, names, and values structurally
- **Unweighted overall accuracy:** Simple average across categories — transparent and reproducible
- **v4's agentic evaluation:** Evaluates multi-turn tool-use chains with state-aware correctness checking

**Transfer to Lane C:** The "Irrelevance Detection" category (model correctly identifies when NO tool should be called) maps directly to routing precision — the AI should NOT invoke the skill for unrelated prompts. The "Executor-Relevant" category maps to in-skill smart-router accuracy — did the right sub-resources get loaded for the right intent?

#### ToolLLM / ToolBench / ToolEval

ToolBench constructs 16k+ real API scenarios using a three-stage pipeline: API collection → instruction generation → solution-path annotation. ToolEval evaluates tool-use along two axes:
- **Pass rate:** Did the tool-call chain produce the correct final answer?
- **Win rate:** Does the evaluated model's output beat a reference model's output (LLM-as-judge comparison)?

**Transfer to Lane C:** The scenario construction pipeline (automated from skill metadata → instruction generation → solution-path annotation) is the template for Lane C's fixture generation (RQ4). The pass/win rate dual metric mirrors D1 (did it activate correctly?) + D4 (is the output better?).

#### Self-RAG: Adaptive Retrieval with Reflection

Self-RAG trains an LM to output special reflection tokens: `[Retrieve]` (decide whether to retrieve), `[Relevant]` / `[Irrelevant]` (judge passage quality), `[Supported]` / `[Partially]` / `[NoSupport]` (factuality check). The retrieval decision is made per-generation-step, not globally.

**Transfer to Lane C:** The concept of a "retrieval necessity" signal maps to Lane C's "did loading this reference help?" question. A skill-benchmark could instrument the AI to emit structured trace events after each reference load, capturing whether the loaded reference was actually cited in the final output.

#### Agent Evaluation Harnesses (SWE-bench, AgentBench)

- **SWE-bench:** Execution-based evaluation — resolve a GitHub issue, produce a patch, run the test suite. Pass@k metric. The key insight: automated verification via test pass/fail, not manual judgment.
- **AgentBench:** Multi-dimensional evaluation across 8 environments (code, web, OS, games, etc.) with standardized task sets and automated scoring.

**Transfer to Lane C:** Lane C's scoring should be execution-based rather than judgment-based wherever possible. Metrics like "file X was read within N tool calls" or "output contains concept Y" can be verified programmatically. LLM-as-judge should be reserved for qualitative dimensions (D4).

### RQ7-B: What Does NOT Transfer

- **Function-call signature matching (BFCL):** Skills don't have formal function signatures. The equivalent is "did a Read call target a file in the skill's references/ tree?" — a coarser signal.
- **Solution-path validation (ToolEval):** Skills don't have deterministic "correct chains" of resource loads — the same task can be solved by reading references in different orders. The benchmark must allow multiple correct paths.
- **Retrieval necessity at token-level (Self-RAG):** Too fine-grained. Skill benchmarking works at the "resource file" granularity, not paragraph or token level.

---

## Recommendations

1. **Adopt the 5-dimension framework (D1-D5) with the recommended weights** as the baseline scoring model for Lane C. The D1 (0.30) + D4 (0.25) primacy reflects that routing accuracy and demonstrable usefulness are the two most important signals of a "good" skill.

2. **Use the existing skill-advisor infrastructure as a routing ground truth** for D1. The advisor's `advisor_recommend` MCP tool already produces lane-attributed confidence scores. Run golden prompt sets through the advisor and treat its top-scoring skill as the expected answer.

3. **Build the hint-free dispatcher to emit structured tool-call traces** (file paths read, approximate token costs) as JSONL. Parse these traces to compute D2 (resource discovery) and D3 (efficiency). The trace is also the input for D4's skill-on/skill-off comparison.

4. **For D5 structural connectivity, implement a lightweight static checker** that cross-references RESOURCE_MAP entries against the filesystem and detects orphan refs + dead keys. This is a fast pre-benchmark health check that can run before any AI dispatch.

5. **Follow the 121 sibling's phase structure** for Lane C build: design-phase → deep-research (this pass) → build-phase → hardening review → remediation → docs. The rename (Phase 002) should happen before Lane C build (Phase 003) per the established ordering.

6. **Normalize scores per-skill, not cross-skill.** Provide baseline→delta reports rather than absolute rankings across unrelated skills. The remediation report should rank findings by estimated impact on the composite score.

---

## Open Questions

- **RQ2 (hint-free dispatch harness):** How to construct prompts that reliably trigger the target skill's domain without explicitly naming it or its trigger phrases, so the benchmark measures real discovery rather than prompted recall? Not addressed in this iteration.
- **RQ3 (score activation vs advisor vs smart router):** Should D1 be one blended score or three independent sub-scores (advisor recommendation, in-skill router, and end-to-end activation)? The 121 Lane B precedent suggests sub-scoring with a composite rollup.
- **RQ4 (scenario/fixture authoring):** How to generate benchmark prompts from a skill's own trigger_phrases and INTENT_SIGNALS without creating circularity (where the prompts are exactly the router keywords)?
- **RQ5 (remediation report format):** What structure should the benchmark report use to rank bottlenecks and express actionable remediations? Should follow the 121 Lane B's `reduce-state.cjs` dashboard pattern.
- **RQ6 (rename surface):** Partially mapped above but needs full dedicated deep-research pass in a later iteration. The rename ordering constraint is known (rename before Lane C build), but the exhaustive grep-surface still needs auditing.
- **D1-D5 weight calibration:** The recommended weights are initial estimates grounded in the skill's own structure. They need empirical calibration — run a pilot benchmark on 2-3 known skills and tune weights based on variance and discrimination power.
