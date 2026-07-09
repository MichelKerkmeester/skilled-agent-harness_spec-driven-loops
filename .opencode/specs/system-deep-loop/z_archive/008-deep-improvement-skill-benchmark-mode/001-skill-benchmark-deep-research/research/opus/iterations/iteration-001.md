# Iteration 001 — Lane C "skill-benchmark": scoring dimensions for real-world utilization (RQ1) + external prior art (RQ7)

> Model: opus · Iteration 1 of 5 · LEAF (no sub-dispatch) · Read-only research
> Web note: `WebSearch`/`WebFetch` were permission-gated in this background context (denied, not retried). External prior-art citations below are drawn from established knowledge and given as canonical URLs **flagged `[web-unverified]`**; a later iteration with web access should confirm exact metric names/numbers. All repo citations are first-hand from files read this iteration.

---

## Focus

RQ1 — define the scoring dimensions for benchmarking a SKILL's **real-world utilization** (how AIs actually discover and use it at the right moments), distinct from (a) Lane A's agent-file 5-dim scoring, (b) sk-doc doc-shape/DQI validation, and (c) manual testing playbooks. Five candidate dimensions: routing/activation accuracy, unprompted reference/asset discovery, efficiency/bottlenecks, usefulness via skill-on/off ablation, structural connectivity.

RQ7 — map how tool/skill discoverability and routing are evaluated externally (retrieval precision/recall, tool-selection accuracy, ablation, LLM-as-judge, agent-eval harnesses) so Lane C reuses proven metrics rather than inventing them.

---

## Actions Taken

1. Read the target skill `deep-agent-improvement/SKILL.md` (full) — captured the two co-equal lanes, the three pluggable seams, the smart-router (`INTENT_SIGNALS`/`RESOURCE_MAP`/`load_if_available`), the Lane A 5-dimension framework, and Lane B's pluggable scorer/grader.
2. Read `system-skill-advisor/SKILL.md` (full) — captured how skills are routed *today* (`advisor_recommend` confidence scoring, lane weights, `advisor_validate` baselines, the `manual_testing_playbook/`), and the same smart-router orphan/dead-key surface.
3. Grepped `sk-doc/SKILL.md` — confirmed sk-doc owns **document quality (DQI)** and structural/template enforcement (`extract_structure.py`, `validate_document.py`), i.e. static doc shape, not runtime behavior.
4. Globbed the 121 sibling packet (`121-deep-agent-improvement-benchmark-mode`) — confirmed the build template: `001-mode-selector-design` (decision-record) → `002-implementation-deep-research` → `003-build-benchmark-mode` → hardening review. Lane C should follow the same packet arc.
5. Synthesized RQ1 dimensions against RQ7 external metric families.

---

## Findings (each cited)

### F1 — The Lane C gap is real: no existing surface measures runtime utilization

Three existing surfaces all measure **static artifact shape**, never **behavioral use**:

- **Lane A 5-dim** scores the agent *file*: Structural Integrity (0.20), Rule Coherence (0.25), Integration Consistency (0.25), Output Quality (0.15), System Fitness (0.15) — "template compliance," "ALWAYS/NEVER rules align," "mirrors in sync," "frontmatter complete." All are read-the-file checks. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:252-262]
- **sk-doc** owns DQI + structure/template enforcement via `extract_structure.py`/`validate_document.py` — "structure, metrics, DQI, and checklist data." Static. [SOURCE: .opencode/skills/sk-doc/SKILL.md:216,355,424]
- **manual_testing_playbook** is "deterministic operator scenarios" — human-run, not an automated measure of in-the-wild AI behavior. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:84]

None answers Lane C's question: *when an AI faces a real task, does it activate this skill at the right moment, open the right reference without being told the path, do so efficiently, and is it measurably better off for having the skill?* That is a behavioral/causal question requiring run-time fixtures + ablation, not parsing. This is the defensible distinct charter for Lane C.

### F2 — Dimension 1: Routing / Activation Accuracy (does it fire when it should, stay silent when it shouldn't)

Sub-metrics:
- **Activation recall** — of N prompts that *should* route here, fraction the advisor/hook surfaces above the 0.8 confidence threshold. (The advisor already emits a confidence score per skill; reuse it.) [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:70-72]
- **Activation precision / false-activation rate** — of prompts that should *not* route here, how often it incorrectly fires (over-triggering pollutes context).
- **Abstention / boundary correctness** — on out-of-scope prompts, does it correctly NOT activate? The skill literally ships a "When NOT to Use" list and a "do not use as a replacement for the target skill" rule — those become negative fixtures. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:66-72; .opencode/skills/system-skill-advisor/SKILL.md:51]
- **Near-neighbor confusion** — distinguishing the skill from siblings. Live evidence this is a real failure mode: this very session's advisor brief reported `ambiguous: sk-code 0.93/0.16 vs deep-research 0.93/0.16` — a tie collision between two skills. [SOURCE: UserPromptSubmit hook context, this session]

RQ7 prior art:
- **MetaTool** frames exactly this as *tool-usage awareness* (should any tool be used) + *tool selection* (which one), including "selection with similar tools," "scenario-based selection," and "reliability" (abstain when no suitable tool). [SOURCE: https://arxiv.org/abs/2310.03128 `[web-unverified]`]
- **Berkeley Function Calling Leaderboard (BFCL)** makes *relevance/irrelevance detection* — correctly abstaining when no function applies — a first-class scored category. Maps directly to activation precision/abstention. [SOURCE: https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html `[web-unverified]`]
- Standard classification framing: precision / recall / F1 + a skill-vs-skill confusion matrix.

**Remediation:** low recall → weak/missing `triggers`/`keywords`/`INTENT_SIGNALS`; low precision → over-broad keywords; near-neighbor collision → overlapping keywords needing disambiguation or lane-weight tuning. Each points at a concrete frontmatter/`INTENT_SIGNALS` edit.

### F3 — Dimension 2: Unprompted Reference/Asset Discovery (right ref opened without being given the path)

This is the core "well-routed *internally*" test. Treat the skill's `references/`+`assets/` as a retrieval corpus and the `RESOURCE_MAP` as the gold task→resource mapping.

Sub-metrics:
- **Resource Hit@k / Recall@k** — for a task with a known-correct reference, is it among the top-k resources the router/AI actually loads?
- **MRR / first-correct-rank** — how highly the right reference ranks.
- **Resource precision (cost-weighted)** — fraction of loaded resources actually used. Hazard already in the code: the `ON_DEMAND_KEYWORDS` branch loads **every** `RESOURCE_MAP` value, the opposite of precise. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:201-205]
- **Path-free discovery rate** — in skill-on runs, did the AI reference the right file by name/content when the prompt did *not* contain the path? (judged from the trajectory).

RQ7 prior art:
- Tool/document retrieval evaluated as IR: **Precision@k, Recall@k, nDCG, MRR, Hit Rate**. ToolLLM/ToolBench evaluates its API retriever with nDCG. [SOURCE: https://arxiv.org/abs/2307.16789 `[web-unverified]`]
- RAG retrieval metrics (context precision/recall, MRR, hit rate) — RAGAS. [SOURCE: https://arxiv.org/abs/2309.15217 `[web-unverified]`]

**Remediation:** a Hit@k miss → the reference is undiscoverable: missing `INTENT_SIGNALS` keyword coverage, absent from `RESOURCE_MAP`, or its content lacks the task vocabulary. Each is a one-line fix (add keyword / add map entry / retitle reference).

### F4 — Dimension 3: Efficiency / Bottlenecks (tool-calls & tokens to reach the needed resource)

Sub-metrics:
- **Tool-calls-to-resource** — number of Read/Grep/Glob before the correct reference is opened (lower = better-routed).
- **Tokens-to-first-useful-action** and **context cost of activation** (SKILL.md is ~535 lines; loading the full reference set is expensive).
- **Wasted loads** — resources loaded but never used (precision, cost-weighted).
- **Trajectory length** to task completion in skill-on runs.

RQ7 prior art:
- Agent-eval harnesses (**AgentBench**, **τ-bench**, **GAIA**, **WebArena**) report steps/actions and tool-call counts as standard secondary efficiency metrics. [SOURCE: https://arxiv.org/abs/2308.03688 AgentBench `[web-unverified]`]
- Anthropic Agent Skills' **progressive disclosure** principle makes a lean SKILL.md + load-on-demand an explicit efficiency goal — Lane C operationalizes it. [SOURCE: https://www.anthropic.com/engineering `[web-unverified]`]

**Remediation:** high tool-calls-to-resource → router/SKILL.md doesn't name the path inline; bloated SKILL.md → push detail into references; wasted loads → tighten the `ON_DEMAND`/`RESOURCE_MAP` branch.

### F5 — Dimension 4: Usefulness via skill-on / skill-off ABLATION (does it measurably help)

The decisive utility test, and the one that justifies the skill's existence. Run identical task fixtures twice — skill available/loaded vs. not — and compare.

Sub-metrics:
- **Quality delta** (skill-on − skill-off), judged by rubric/LLM-as-judge.
- **Success-rate delta** on objective fixtures (checkable answers).
- **Efficiency delta** (does it cut or add tool-calls/tokens).
- **Net value = benefit delta − context cost** (a skill that helps but costs ~4k tokens/activation can be net-negative on small tasks).
- **Harm check** — does skill-on ever make outcomes *worse* (over-constraining, misrouting)?

RQ7 + repo prior art — the infra largely **already exists**:
- The repo already ships an ablation tool: `eval_run_ablation` (mk-spec-memory MCP). [SOURCE: tool registry, this session — `mcp__mk-spec-memory__eval_run_ablation`]
- Lane A already runs a same-task **A/B stress** comparison (Mode 2A): generic attempt vs disciplined path, judged on grep/file/diff/exit-code signals. Lane C generalizes this to skill-on/off. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:239-248]
- Lane B already ships a **pluggable grader** (`--grader noop|mock|llm`) — reuse it as the LLM-as-judge for the quality delta. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:279]
- LLM-as-judge canon: **MT-Bench/Chatbot Arena** (pairwise + pointwise; documents position/verbosity/self-preference bias and mitigations) and **G-Eval**. [SOURCE: https://arxiv.org/abs/2306.05685 ; https://arxiv.org/abs/2303.16634 `[web-unverified]`]

**Remediation:** zero/negative delta → the skill isn't earning its context cost: either content not useful, or not reaching the model at the right time (loops back to D1/D2). Verdict is directly actionable: fix routing, merge, or retire the skill.

### F6 — Dimension 5: Structural Connectivity (orphan refs, dead router keys) — the cheap static gate

The only fully static dimension; deterministic, fast, and a prerequisite for D2.

Sub-metrics:
- **Orphan references** — files under `references/`/`assets/` that no `RESOURCE_MAP`/`DEFAULT`/`RUNTIME_ASSETS` entry and no SKILL.md link ever loads (compute as `discover_markdown_resources()` inventory minus the union of router targets). Unreachable knowledge.
- **Dead router keys** — `RESOURCE_MAP`/`RUNTIME_ASSETS` entries pointing at files not on disk. Critically, `load_if_available()` **silently no-ops** when the path isn't in inventory — so a dead key fails invisibly and never surfaces. This is exactly why it needs an explicit check. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:189-195]
- **Intent→resource coverage** — every `INTENT_SIGNALS` key must have a non-empty `RESOURCE_MAP` entry; the advisor already returns a "no knowledge base found for intent" notice when one is empty, which Lane C can assert against. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:242-246]
- **Dangling intra-skill links** and frontmatter/`graph-metadata.json` parse + skill-graph edge resolution. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:359-365]

RQ7 prior art: documentation dead-link checking + software reachability/dead-code analysis applied to the resource graph + knowledge-graph orphan-node detection (general technique, low citation need).

**Remediation:** every orphan/dead key is a precise `(file path, map entry)` pair to fix — the most deterministic dimension. Should run first and **gate** the behavioral dimensions (a dead router key often *explains* a D2 miss).

### F7 — Proposed weighting + hard-gate (utility-first, parallel to but distinct from Lane A)

Lane A weights structure/coherence highest because it scores a file. Lane C should weight **utility** highest because it scores *use*:

| Lane C dimension | Proposed weight | Nature |
| --- | --- | --- |
| D4 Usefulness (ablation) | 0.30 | graded (LLM-judge) |
| D1 Routing/Activation | 0.25 | deterministic (advisor scores) |
| D2 Reference discovery | 0.20 | deterministic (router) + behavioral |
| D3 Efficiency | 0.15 | deterministic (counts) |
| D5 Structural connectivity | 0.10 | static — **but a hard gate**: any dead router key = automatic finding, mirroring Lane A's trade-off detector blocking promotion |

[SOURCE for the contrast: .opencode/skills/deep-agent-improvement/SKILL.md:254-260 (Lane A weights), 402-405 (trade-off detector blocks promotion)]

### F8 — The three-seam architecture already fits Lane C; reuse, don't rebuild

Lane C maps cleanly onto the existing candidate-source / dispatcher / scorer seams that Lanes A and B share:
- **candidate-source** = the skill-under-test (its SKILL.md + references + RESOURCE_MAP), instead of an agent candidate or a model variant.
- **dispatcher** = reuse `scripts/model-benchmark/dispatch-model.cjs` to run a model over the fixture prompts. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:278]
- **scorer** = a new `skill-benchmark` scorer computing D1–D5; D1 can call `advisor_recommend`/`advisor_validate` directly for routing scores + baselines rather than reinventing routing. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:280-289,338]

This means Lane C is "a third `--mode` on `loop-host.cjs`" in spirit, keeping the default agent-improvement path byte-identical. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:275-277]

### F9 — Fixtures are auto-derivable from the skill's own metadata

No hand-authored corpus needed to start:
- **Positive / negative / near-neighbor prompts** derive from the skill's `WHEN TO USE`, `When NOT to Use`, frontmatter `triggers`/`keywords`, and `intent_signals`. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:38-72; .opencode/skills/system-skill-advisor/SKILL.md:6-26]
- **Gold task→reference map** = the `RESOURCE_MAP` itself (then Lane C tests whether the AI/router actually *reaches* the mapped reference under a paraphrased, path-free prompt).
- **Deterministic vs graded split:** D1/D3/D5 deterministic; D2 partly deterministic (router Hit@k) + partly behavioral; D4 graded — reuse Lane B's `noop|mock|llm` grader so the loop stays cheap by default. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:279]

### F10 — Rename surface (deep-agent-improvement → deep-improvement) is broad; needs its own mapping pass

Out of this iteration's RQ1/RQ7 focus, but surfaced incidentally. The rename touches at least: the skill directory `.opencode/skills/deep-agent-improvement/`; SKILL.md `name:`, `triggers:`, and the `<!-- Keywords -->` comment [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:2,7-14,17]; the commands `/deep:start-agent-improvement-loop` + `/deep:start-model-benchmark-loop` [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:520-521]; the mutator agent `.opencode/agents/deep-agent-improvement.md` plus `.claude/.codex/.gemini` mirrors [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:492,522]; `system-skill-advisor/.../skill-graph.json` (shown modified in git status); `specs/descriptions.json` + per-packet `graph-metadata.json`; and state namespaces/enums like `loop_type:"improvement"` [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:367]. Recommend a dedicated rename-surface mapping iteration before any rename — silent dead references here would also corrupt Lane C's own D5 connectivity scoring.

---

## Recommendations

1. **Adopt the 5 dimensions D1–D5 as Lane C's scoring rubric**, utility-weighted (F7), with structural connectivity as a hard gate, not a soft score.
2. **Build Lane C as a third `loop-host.cjs --mode=skill-benchmark`**, reusing candidate/dispatcher/scorer seams; do not fork a parallel harness (F8).
3. **Reuse existing infra wherever it exists:** `advisor_recommend`/`advisor_validate` for D1, `eval_run_ablation` + Lane A Mode 2A pattern for D4, Lane B `--grader` for the LLM-judge, the smart-router inventory for D5 (F2,F5,F8).
4. **Auto-generate the first fixture set** from each skill's own `WHEN TO USE`/`triggers`/`RESOURCE_MAP` so a skill can be benchmarked with zero hand-authoring (F9).
5. **Keep all findings remediable:** every Lane C metric must emit a concrete fix target (a keyword, a `RESOURCE_MAP` entry, a file path, a "retire/merge this skill" verdict) — not just a number.
6. **Sequence a dedicated rename-surface iteration** before renaming (F10).

---

## Open Questions

- **Path-free discovery (D2) measurement:** deterministic router Hit@k is easy, but measuring whether a *live model* opens the right reference unprompted needs trajectory capture — what's the cheapest deterministic proxy vs. a graded behavioral run?
- **Net-value threshold (D4):** what context-cost-vs-benefit cutoff declares a skill "net-negative / retire"? Needs a token-budget model.
- **Negative/near-neighbor fixture quality:** auto-derived negatives from "When NOT to Use" may be too easy; do we need adversarial near-miss prompts (sibling-skill paraphrases) to stress D1 precision?
- **Cross-skill scope:** is Lane C per-skill, or does it also score *the routing layer itself* (advisor confusion matrix across the whole skill set)? F2's `sk-code/deep-research` tie suggests the latter has value.
- **External-citation verification:** confirm BFCL relevance-detection naming, MetaTool subtask taxonomy, ToolLLM nDCG usage, and AgentBench step metrics with live web access in a later iteration (flagged `[web-unverified]` above).
- **Rename surface completeness (RQ from main topic):** enumerate every `deep-agent-improvement` reference (code, docs, state, graph) — deferred to a dedicated iteration.
