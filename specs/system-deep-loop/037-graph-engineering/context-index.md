# 037 Graph-Engineering — Program Index

> **Start here.** This folder is a research program: it studies how to evolve the in-house `system-deep-loop` engine into a **graph-based agent-loop system** over the **036** authority plane. Six studies were run (five source studies + one integration capstone). This index is the map — what each study found, where to read it, and what the program concluded. It is the sanctioned program-narration surface for this phase parent; the parent `spec.md` documents root purpose only.

**Status:** all six studies complete. Research-only — no runtime code changed. Every study is a fixed-depth deep-research run (SOL synthesis → DeepSeek V4 Pro verification from study 2 on), landed on `origin/skilled/v4.0.0.0` and `origin/main`.

---

## 1. Reading order (fastest path in)

1. **This index** — the map.
2. **[handover.md](handover.md)** — program state, what shipped, the one real next step, how to resume.
3. **The capstone, in plain terms** — [006 · findings-plain-language.md](006-cross-study-integration/research/findings-plain-language.md). The whole integrated design without jargon.
4. **The capstone, in full** — [006 · research.md](006-cross-study-integration/research/research.md). The single integrated architecture (spine + P1–P8 + tensions).
5. **Any single source study** — use the table below; each row links its plain-language summary, full synthesis, and independent verification.

For each study the reading order inside its `research/` folder is always the same: **`findings-plain-language.md` (plain) → `research.md` (full) → `verification-deepseek-v4-pro.md` (the independent check)**. Everything else in `research/` is machine-generated evidence (see the legend in §6).

---

## 2. The six studies

| # | Study | Layer | One-line takeaway | Depth | Independent verdict |
|---|-------|-------|-------------------|-------|---------------------|
| **1** | [agent-swarms](001-agent-swarms/research/research.md) · [plain](001-agent-swarms/research/findings-plain-language.md) | Graph (product runtime) | Add a versioned, compiled execution graph as a **projection over 036**: the graph proposes transitions, 036 stays the only authority. | 20 iters | *SOL synthesis only — no DeepSeek pass (verification began at study 2)* |
| **2** | [graphene-main](002-graphene-main/research/research.md) · [plain](002-graphene-main/research/findings-plain-language.md) · [verify](002-graphene-main/research/verification-deepseek-v4-pro.md) | Graph (event-sourced + belief) | Make state **event-derived**: ledger folds, belief settlement, causal-prefix parity, claim-and-fence, refusals, human gates. | 20 iters | DeepSeek **PASS-WITH-FIXES** |
| **3** | [graph-arch](003-graph-arch/research/research.md) · [plain](003-graph-arch/research/findings-plain-language.md) · [verify](003-graph-arch/research/verification-deepseek-v4-pro.md) | Graph (governance) | **Admission ≠ authorization**: org-policy compiler, durable gates, hierarchical budgets, authority-zero refusals, governance mutants. | 20 iters | DeepSeek **REWORK** (applied) |
| **4** | [graph-engineering-master](004-graph-engineering-master/research/research.md) · [plain](004-graph-engineering-master/research/findings-plain-language.md) · [verify](004-graph-engineering-master/research/verification-deepseek-v4-pro.md) | Graph (knowledge doctrine) | **Knowledge is non-authoritative**: competency-driven modeling, ontology, extraction, quality, reversible fusion, hybrid serving. | 20 iters | DeepSeek **PASS-WITH-FIXES** |
| **5** | [noaa-paper-and-blog-theory](005-noaa-paper-and-blog-theory/research/research.md) · [plain](005-noaa-paper-and-blog-theory/research/findings-plain-language.md) · [verify](005-noaa-paper-and-blog-theory/research/verification-deepseek-v4-pro.md) | Loop / harness | The inner loop: **typed self-checking iteration returns**, agent-curated memory, model-callable context, bounded LEAF, three-layer eval, harness mutants. | 20 iters | DeepSeek **PASS-WITH-FIXES** |
| **6** | [cross-study-integration](006-cross-study-integration/research/research.md) · [plain](006-cross-study-integration/research/findings-plain-language.md) · [verify](006-cross-study-integration/research/verification-deepseek-v4-pro.md) | **Capstone** | Welds S1–S5 into **one design**: cross-cutting spine, eight unified artifacts (P1–P8), six resolved tensions, one integrated architecture, one next step. | 10 iters (xhigh) | DeepSeek **PASS-WITH-FIXES** |

Studies 1–4 are the **graph layer** (how agents are wired and who may change state). Study 5 is the **loop/harness layer** (how one iteration works). Study 6 is the **integration** of both.

---

## 3. What the program concluded (one paragraph)

The five studies describe **one system, not five**: a **graph** decides what work is eligible and in what order → a **bounded loop** does each unit of work → **typed evidence** stacks up → and **nothing anywhere becomes permission** to change protected state except one final authority, **036**. The single invariant that makes them one acyclic system is **"a proposal is never permission"** — a graph edge, a passing test, a confident memory, a settled belief, a policy "allow," even a human approval, are all only typed inputs re-checked at one boundary. The honest headline: **036 runs dark today** (it watches after the fact and returns the legacy result unchanged), so every authority claim in the design is a **target-state contract, not live enforcement**. The capstone's eight artifacts (P1–P8) are **proposed, unimplemented schemas**, not shipped code. Full detail: [006 · research.md](006-cross-study-integration/research/research.md).

---

## 4. The one real next step

No further design closes the gap. The next evidence class is **one mutant-driven shadow vertical slice**: freeze a corpus + the exact legacy build, run one typed graph through the full return→evidence→belief→policy machine, fire 036's dark adapter only *after* the legacy result (prove zero visible difference), inject ~15 mutants and require each to fail at its expected earliest owner. Even a perfect run would not authorize production cutover — it moves the program from *integrated design* to *implementation-qualification*, one measurable, reversible step. Specified in [006 · research.md](006-cross-study-integration/research/research.md) §"What Remains Unproven".

---

## 5. Where to read what

| You want… | Go to |
|-----------|-------|
| The whole program at a glance | this index |
| Program state / resume / next step | [handover.md](handover.md) |
| The integrated design (plain, then full) | [006/research/findings-plain-language.md](006-cross-study-integration/research/findings-plain-language.md) → [006/research/research.md](006-cross-study-integration/research/research.md) |
| One source study's findings | that study's `research/` (see §2 links; each folder has its own `research/README.md`) |
| Curated background primers (graph engineering, loops-vs-graphs, primitives, reference impls, deep-loop→graph mapping) | [reference/README.md](reference/README.md) |
| The vendored source corpus (4 repos, 12 blogs, 1 paper) | [context/](context/) |
| The original gen-1 seed research (2026-08-08, pre-dates the six studies) | [research/research.md](research/research.md) |

---

## 6. Legend — what's in a study's `research/` folder

Each child `research/` folder mixes four human-readable docs with machine-generated loop evidence. When looking back, read the human docs; the rest is provenance.

**Read these (human-authored):**
- `research.md` — the full synthesis (SOL-authored, DeepSeek-verified from study 2 on).
- `findings-plain-language.md` — the same recommendations in plain terms.
- `verification-deepseek-v4-pro.md` — the independent second-model verdict + the fixes applied (absent in study 1).
- `resource-map.md` — the sources the study drew on.

**Provenance (machine-generated — evidence, not reading material):**
- `deep-research-state.jsonl` — append-only per-iteration state + route-proof records.
- `deep-research-config.json`, `deep-research-dashboard.md`, `findings-registry.json`, `observability-events.jsonl`, `orchestration-*.json/log`, `fanout-attribution.md` — loop configuration, dashboards, registries, telemetry, attribution.
- `lineages/<label>/` — the raw fan-out lineage: per-iteration `iterations/`, `prompts/`, `deltas/`, `artifacts/`, and logs.

---

## 7. Honest caveats (carried in every study)

- **036 runs dark.** Every authority-subordination guarantee is target-state, not current enforcement. Legacy writers remain authoritative until a measured, operator-gated, per-mode cutover.
- **Design-level, zero measurements.** No target-system baselines exist (graph overhead, latency, cost, recall, recovery, operator load).
- **Novelty telemetry is executor-generated** — trajectory metadata, not proof of convergence or completeness.
- **Study 1 has no independent verification** — it is a single-model (SOL) synthesis; the DeepSeek adversarial pass was added from study 2 onward.
