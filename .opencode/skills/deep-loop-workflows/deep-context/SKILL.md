---
name: deep-context
description: "Iterative codebase-context-gathering deep loop. Runs a configurable pool over a shared scope in parallel (native-only by default; optional heterogeneous CLI seats) and synthesizes a reuse-first Context Report for planning/implementation. Use before /speckit:plan or /speckit:implement to map existing code, integration points, and conventions."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: deep-context, context-gathering, codebase-context, reuse-catalog, by-model-parallel-sweep, agreement-merge, convergence-detection, coverage-graph, context-report, heterogeneous-executor-pool, pre-planning-context, relevance-gated-coverage -->

# Deep Context

Iterative, multi-model **codebase-context-gathering** loop. It sweeps the existing repository for the code relevant to a feature and synthesizes an implementation/planning-ready **Context Report** whose highest-value section is a **REUSE catalog** (existing functions/utilities to extend, cited by `file:symbol`). It is the "understand" loop that runs *before* `/speckit:plan` and `/speckit:implement`.

It is the fourth deep loop and the third consumer of `deep-loop-runtime` (alongside `deep-research` and `deep-review`). Unlike them it is **inward** (the codebase, not the web), and unlike a one-shot context lookup it is **convergence-gated** and **multi-model**: an operator-composed pool of executors sweeps the *same* scope in parallel, and **cross-executor agreement** drives finding confidence.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- You are about to plan or implement a feature and need a verified map of the existing code to reuse, the integration points to touch, and the conventions to follow.
- You want a Context Report that `/speckit:plan` can consume in place of its ad-hoc exploration dispatch.
- You want diverse model lenses on the same code (e.g. 2 native agents + MiMo + gpt + deepseek) with agreement-weighted confidence.
- A feature spans multiple modules and the blast radius is unclear before you plan.

**Keyword triggers**:
- `gather context`, `map the code for X`, `what existing code`, `what can I reuse`
- `pre-plan context`, `context loop`, `context sweep`, `deep context`
- `/deep:context`

### When NOT to Use

**Do not use for**:
- Outward/web knowledge discovery — use `deep-research`.
- Code audit / defect finding — use `deep-review`.
- Strategy deliberation between competing plans — use `deep-ai-council`.
- A quick one-shot context lookup — use the `@context` agent.

---

## 2. SMART ROUTING

> Pattern: aligned with the [sk-doc smart-router resilience template](../sk-doc/assets/skill/skill_smart_router.md).

### Primary Detection Signal

```text
Request contains "gather context" / "map the code" / "what existing code" / pre-plan understanding?
    |
    +-- /deep:context invoked?         → ALWAYS load guides/quick_reference
    +-- "convergence" / "stop" / "saturation"?    → load convergence/* (signals, recovery, graph)
    +-- "state" / "jsonl" / "registry" / resume?  → load state/* (format, jsonl, outputs, reducer)
    +-- "reuse" / "REUSE catalog" / "report"?     → load state/state_outputs + context_report_template
    +-- "sweep" / "executor pool" / "seat"?       → load protocol/loop_protocol
    +-- Low-confidence or scope not stated?       → UNKNOWN_FALLBACK_CHECKLIST
```

### Phase Detection

```text
REQUEST
    |
    +- STEP 0: Detect scope (feature / spec folder / query provided?)
    +- STEP 1: Score intents → loop setup, sweep dispatch, merge/agreement,
               convergence, state, coverage graph, or report synthesis
    +- STEP 2: Load intent-matched resources (guarded, existence-checked)
    +- Phase 1: Frontier seeding + parallel sweep (protocol/loop_protocol)
    +- Phase 2: Agreement merge + convergence (state/state_reducer_registry, convergence/*)
    +- Phase 3: Synthesis → Context Report (state/state_outputs, context_report_template)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring from `INTENT_SIGNALS`. References are organized into the same subfolder families as the sibling deep loops:

- `references/guides/` — operator cheat sheet (`quick_reference.md`); the ALWAYS baseline.
- `references/protocol/` — `loop_protocol.md`: iteration lifecycle, parallel sweep, host-writes-state, merge.
- `references/convergence/` — `convergence.md` (hub), `convergence_signals.md` (the 5 signals + weights + thresholds), `convergence_recovery.md` (blocked-stop / stuck recovery), `convergence_graph.md` (the `loop_type='context'` coverage-graph stop path).
- `references/state/` — `state_format.md` (packet hub), `state_jsonl.md` (record types), `state_outputs.md` (dashboard / Context Report), `state_reducer_registry.md` (reduce-state.cjs ownership + robustness).
- `assets/context_report_template.md` — Context Report schema (REUSE-catalog-first, pointers not bodies).
- `assets/deep_context_config.json` — config shape (scope, executor pool, concurrency, thresholds).

### Resource Loading Levels

| Level       | When to Load                             | Resources                                          |
| ----------- | ---------------------------------------- | -------------------------------------------------- |
| ALWAYS      | Every skill invocation                   | `references/guides/quick_reference.md`             |
| CONDITIONAL | Intent signals match                     | The intent-mapped `convergence/`, `protocol/`, `state/` refs + `context_report_template.md` |
| ON_DEMAND   | Explicit deep-dive keyword (see `ON_DEMAND_KEYWORDS`) | The full reference set                  |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/guides/quick_reference.md"

# Deep-context intent signals: a top-level weight + flat keyword list per intent
# (canonical sibling shape — matches deep-research / deep-review).
INTENT_SIGNALS = {
    "LOOP_SETUP":       {"weight": 4, "keywords": ["deep context", "context loop", "gather context", "map the code", "pre-plan context", "frontier", "seed", "setup", "init"]},
    "SWEEP_DISPATCH":   {"weight": 4, "keywords": ["parallel sweep", "executor pool", "by-model", "heterogeneous", "seat", "fanout", "dispatch", "council seats", "multi-model"]},
    "MERGE_AGREEMENT":  {"weight": 4, "keywords": ["agreement", "merge", "dedup", "contradiction", "attribution", "confidence", "unit_id", "reducer", "registry"]},
    "CONVERGENCE":      {"weight": 4, "keywords": ["convergence", "stop", "saturation", "relevance gate", "agreement rate", "blocked stop", "STOP_ALLOWED", "recovery", "stuck"]},
    "STATE":            {"weight": 4, "keywords": ["state file", "jsonl", "dashboard", "packet", "findings-registry", "resume", "state log"]},
    "COVERAGE_GRAPH":   {"weight": 3, "keywords": ["coverage graph", "loop_type", "node kinds", "covered_by", "confirms", "graph signals", "upsert"]},
    "REPORT_SYNTHESIS": {"weight": 4, "keywords": ["context report", "reuse catalog", "reuse", "integration point", "touch list", "synthesis", "report"]},
}

RESOURCE_MAP = {
    "LOOP_SETUP":       ["references/protocol/loop_protocol.md", "references/state/state_format.md"],
    "SWEEP_DISPATCH":   ["references/protocol/loop_protocol.md", "references/guides/quick_reference.md"],
    "MERGE_AGREEMENT":  ["references/state/state_reducer_registry.md", "references/convergence/convergence_signals.md"],
    "CONVERGENCE":      ["references/convergence/convergence.md", "references/convergence/convergence_signals.md", "references/convergence/convergence_recovery.md", "references/convergence/convergence_graph.md"],
    "STATE":            ["references/state/state_format.md", "references/state/state_jsonl.md", "references/state/state_outputs.md", "references/state/state_reducer_registry.md"],
    "COVERAGE_GRAPH":   ["references/convergence/convergence_graph.md"],
    "REPORT_SYNTHESIS": ["references/state/state_outputs.md", "assets/context_report_template.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/guides/quick_reference.md"],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all references", "complete reference", "resume deep context", "state log", "context/iterations", "blocked stop", "coverage graph", "reduce-state", "config schema"],
    "ON_DEMAND": [
        "references/protocol/loop_protocol.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
        "references/convergence/convergence_recovery.md",
        "references/convergence/convergence_graph.md",
        "references/state/state_format.md",
        "references/state/state_jsonl.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
        "assets/context_report_template.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "State the target feature or module to gather context for.",
    "Confirm whether a spec folder exists (or provide a standalone run path).",
    "Specify the executor pool (native × N, plus any CLI seats) or accept the default.",
    "Confirm verification expectations: what signals will indicate a useful Context Report?",
]

AMBIGUITY_DELTA = 1


def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)  # raises if outside skill root
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()


def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}


def load_if_available(relative_path: str, inventory, loaded, seen):
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)


def score_intents(user_request: str) -> dict[str, int]:
    text = (user_request or "").lower()
    scores = {intent: 0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        weight = cfg["weight"]
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight
    return scores


def select_intents(scores: dict[str, int]) -> tuple[str, str | None]:
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("LOOP_SETUP", None)
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary)
    return (primary, None)


def route_deep_context_resources(user_request: str, task=None):
    inventory = discover_markdown_resources()
    scores = score_intents(user_request)
    primary, secondary = select_intents(scores)
    intents = [primary] + ([secondary] if secondary else [])

    loaded = []
    seen = set()

    # ALWAYS baseline (the operator cheat sheet)
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path, inventory, loaded, seen)

    # No signal → return the baseline plus the disambiguation checklist
    if max(scores.values() or [0]) <= 0:
        return {
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    # CONDITIONAL: load intent-mapped resources
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path, inventory, loaded, seen)

    # ON_DEMAND: explicit deep-dive keywords pull the full reference set
    text = (user_request or "").lower()
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path, inventory, loaded, seen)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## 3. HOW IT WORKS

> Depth lives in the references: [protocol/loop_protocol.md](references/protocol/loop_protocol.md) (full lifecycle), the [convergence/](references/convergence/convergence.md) family (stop contract, signals, recovery, graph), and the [state/](references/state/state_format.md) family (packet, JSONL, outputs, reducer). This section is the quick map.

**Process** (host-driven loop; the host = the orchestrating command/agent):

```text
STEP 1: Seed the frontier
       ├─ Extract anchors from the target feature/query (paths, symbols, errors)
       ├─ Expand via code_graph_query (blast-radius/calls) into ranked SLICE nodes
       └─ Fall back to Glob + Grep when the code graph is stale or absent
       ↓
STEP 2: Parallel sweep (one iteration)
       ├─ native seats → parallel batch of @deep-context Task subagents
       ├─ CLI seats → deep-loop-runtime multi-seat-dispatch + per-kind spawn
       └─ Both groups start together; barrier-join (true heterogeneous parallelism)
       ↓
STEP 3: Merge + agreement (host only)
       ├─ Dedup findings by unit_id = sha256(path:symbol:kind)
       ├─ Union per-executor attribution; boost confidence by agreement count
       └─ Surface contradictions (CONTRADICTS edges); never silently resolve
       ↓
STEP 4: Persist + converge
       ├─ Host writes iteration state + coverage-graph events (loop_type='context')
       └─ convergence.cjs --loop-type context → CONTINUE / STOP_ALLOWED / STOP_BLOCKED
       ↓
STEP 5: Synthesize
       └─ At stop, emit Context Report (context/context-report.md + .json)
```

**Output**: a Context Report — REUSE catalog (verified `file:symbol` + signature + how-to-extend + confidence-by-agreement + freshness), integration points, touch list, conventions, pruned dependency subgraph, and gaps/unknowns. It ships **pointers, not source bodies** (the consumer pulls bodies just-in-time), which avoids context rot and stale-reference failure.

**Heterogeneous pool example** (opt-in Custom — NOT the default; the default pool is native-only, 2 seats): 2 native agents + 1 MiMo-v2.5-pro (cli-opencode) + 1 gpt (cli-codex) + 1 deepseek-v4-pro (cli-opencode), all sweeping the same scope in parallel; a reuse candidate confirmed by 3 of 5 executors outranks a single-executor find.

**Script**: `scripts/reduce-state.cjs` — the agreement-weighted context reducer. Reads the host-written state log + per-seat findings and produces the `findings-registry.json` and human-readable dashboard. Run from the repository root:

```bash
node .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs <spec-folder>
```

### Runtime Mirrors (native seat dispatch)

The native `@deep-context` seat is dispatched **by name** (`agent: deep-context` in the loop YAML), resolved by each host runtime from its OWN `agents/` directory. It therefore lives as one canonical source plus two runtime mirrors that must stay in sync:

| Runtime | File | Frontmatter |
|---------|------|-------------|
| OpenCode | `.opencode/agents/deep-context.md` | **canonical source** — `mode: subagent` + `permission:` block |
| Claude Code | `.claude/agents/deep-context.md` | mirror — `tools:` allow-list (read-only), same body |
| Codex | `.codex/agents/deep-context.toml` | mirror — `developer_instructions = '''…'''` + `# Converted from:` header + `sandbox_mode = "read-only"`, same body |

The body is identical across all three; only the frontmatter format differs. The command and loop YAML are **shared** — the `.claude/` and `.codex/` `commands`/`prompts`/`skills` directories are symlinks to `.opencode/` — so they intentionally reference the canonical `.opencode/` paths and dispatch by name; do NOT fork them per runtime. If a mirror is missing for a runtime, the native seats silently fail to dispatch there (the CLI seats still run, but the cross-executor agreement signal degrades). When you edit the canonical agent, re-sync both mirrors in the same change.

---

## 4. RULES

### ALWAYS

1. **Treat every executor seat as a read-only analyzer.** The host writes all state (iteration files, coverage-graph, the merged report). Sub-agents must never write the merged report.
2. **Carry the full lineage prompt contract to every seat**: gather-subject + scope/slice + known-context + output schema. A seat told only "analyze" returns generic noise.
3. **Apply each model's prompt framework via `sk-prompt-small-model`** (e.g. MiMo → COSTAR, MiniMax → TIDD-EC) using the lineage `promptFramework` field.
4. **Verify every cited `file:symbol` against the code graph** before it enters the report; label anything unverified. A stale reference is worse than omission.
5. **Honor the cli-* skill contracts for dispatch** (model id form, `</dev/null` for opencode, omit top-level `--agent`). Read the relevant `cli-X/SKILL.md` before composing any CLI prompt.
6. **Ship pointers + signatures, not source bodies.** Context rot begins when full source is pasted into reports.
7. **The host applies the deep-loop-runtime robustness layer** (shared with `deep-research` and `deep-review`): state writes are atomic (temp+fsync+rename via `writeStateAtomic`), the JSONL state log is repaired before each reduce (`repairJsonlTail`), each seat's output is validated before merge (`post-dispatch-validate`, surfacing `seatValidationWarnings`), a single-writer advisory loop-lock is held via `scripts/loop-lock.cjs` for the duration of the session, and CLI seats are dispatched with the runtime recursion-guard env so no seat can launch a nested deep-context loop.
8. **Keep the native agent's runtime mirrors in sync** — when editing `.opencode/agents/deep-context.md` (canonical), update `.claude/agents/deep-context.md` and `.codex/agents/deep-context.toml` in the same change. The loop dispatches the native seat by name from each runtime's own `agents/` dir, so a missing mirror means native seats silently fail to dispatch in that runtime. See **Runtime Mirrors** in §3.

### NEVER

1. **Never sweep the whole repo** or paste raw source into the report. Seed a focused frontier; expand only within the blast radius.
2. **Never count "files visited" as progress.** Only relevance-gated, agreement-eligible findings advance coverage.
3. **Never let a seat write outside its own artifact dir** or mutate `spec.md` (that is `/speckit:plan`'s job).
4. **Never register new MCP tools.** The runtime is MCP-free by design.
5. **Never hand-roll the gather as a manual `cli-opencode` background dispatch** instead of running this loop. `/deep:context` already uses read-only seats with host-written state (Gate-3-safe) and accepts `cli-*` executor seats via `--executors`, so a manual substitute discards convergence detection and the cross-executor agreement signal for no safety gain. If the command genuinely cannot run, flag the deviation; do not silently substitute.

### ESCALATE IF

1. **A provider in the pool is not authenticated** or the code graph is unavailable and Glob/Grep fallback is insufficient to seed a meaningful frontier.
2. **Executors contradict on a finding's contract** (different signature or reuse verb for the same `unit_id`) and the host cannot reconcile from evidence — surface both sides to the operator.
3. **The loop cannot reach the agreement/relevance gates within the iteration cap** — surface partial findings plus the blocking gate and let the operator decide whether to extend the cap or accept the partial report.

---

## 5. REFERENCES

References are organized into subfolder families (`guides/ protocol/ convergence/ state/`), matching the sibling deep loops.

### Guides

| Document | Purpose |
|----------|---------|
| [guides/quick_reference.md](references/guides/quick_reference.md) | One-page operator cheat sheet (commands, params, state files, convergence tree). ALWAYS baseline. |

### Protocol

| Document | Purpose |
|----------|---------|
| [protocol/loop_protocol.md](references/protocol/loop_protocol.md) | Iteration lifecycle, parallel dispatch, merge, and host-writes-state invariant |

### Convergence

| Document | Purpose |
|----------|---------|
| [convergence/convergence.md](references/convergence/convergence.md) | Stop-contract hub: CONTINUE / STOP_ALLOWED / STOP_BLOCKED + why agreement + relevance are guards |
| [convergence/convergence_signals.md](references/convergence/convergence_signals.md) | The 5 signals, composite-score weights, and the threshold reference table |
| [convergence/convergence_recovery.md](references/convergence/convergence_recovery.md) | Blocked-stop recovery foci and stuck-recovery frontier widening |
| [convergence/convergence_graph.md](references/convergence/convergence_graph.md) | The `loop_type='context'` coverage-graph stop path (nodes/edges → signals) |

### State

| Document | Purpose |
|----------|---------|
| [state/state_format.md](references/state/state_format.md) | The `context/` packet-file hub: owners, mutability, routing |
| [state/state_jsonl.md](references/state/state_jsonl.md) | `deep-context-state.jsonl` append-only record types |
| [state/state_outputs.md](references/state/state_outputs.md) | Dashboard, iteration files, deltas, and the Context Report outputs |
| [state/state_reducer_registry.md](references/state/state_reducer_registry.md) | `reduce-state.cjs` ownership: registry schema, dedup/agreement, runtime robustness |

### Templates and Assets

| Asset | Purpose |
|-------|---------|
| [context_report_template.md](assets/context_report_template.md) | Context Report schema consumed by `/speckit:plan` and `/speckit:implement` |
| [deep_context_config.json](assets/deep_context_config.json) | Run config shape; copied to `{spec_folder}/context/` at init |

### Reference Loading Notes

- Load `references/guides/quick_reference.md` on every invocation (ALWAYS baseline).
- Load the `convergence/` family when tuning stop behavior or diagnosing a blocked stop; the `state/` family when working with the packet, JSONL, or reducer.
- Load `assets/context_report_template.md` when synthesizing or verifying the deliverable.
- Keep Smart Routing as the single routing authority; do not duplicate routing logic here.

---

## 6. SUCCESS CRITERIA

**Task complete when**:
- A Context Report exists at `{spec_folder}/context/context-report.md` with a REUSE catalog whose entries are code-graph-verified (no unlabeled stale refs).
- Convergence stopped via `STOP_ALLOWED` (coverage + relevance + agreement gates passed) or a recorded cap/blocked stop with partial findings and the blocking gate named.
- Per-executor attribution + agreement counts are recorded for every finding in `context/findings-registry.json`.

**Quality gates**:
- `agreementRate >= 0.50` — findings are multi-model-confirmed, not single-seat noise.
- `relevanceFloor >= 0.50` — the loop collected focused context, not tangential files.
- `sliceCoverage >= 0.70` — the defined scope was swept, not partially skimmed.

---

## 7. INTEGRATION POINTS

**Triggers**: pre-planning context gathering; requests matching "gather context", "map the code for X", "what can I reuse for X", `/deep:context`.

**Pairs with**:
- `deep-loop-runtime` — coverage-graph (`loop_type='context'`), convergence script, parallel seat dispatch, executor config.
- `sk-prompt-small-model` — per-model prompt framing for the heterogeneous pool.
- `cli-opencode` / `cli-codex` / `cli-claude-code` — CLI seat dispatch contracts.
- `system-code-graph` — frontier seeding + reference verification.
- `/speckit:plan` and `/speckit:implement` — downstream consumers of the Context Report.

**Packet layout** (`{spec_folder}/context/`):
- `deep-context-config.json` — run config.
- `deep-context-state.jsonl` — append-only state log.
- `deep-context-strategy.md` — focus and scope notes.
- `iterations/iteration-NNN.md` — per-iteration summaries.
- `findings-registry.json` — agreement-weighted findings (reducer-owned).
- `deep-context-dashboard.md` — auto-generated progress view (reducer-owned).
- `context-report.md` + `context-report.json` — the deliverable.

If the user named a spec folder, or one is derivable from the scope (e.g. a spec-folder path inside the scope text), the packet MUST live at `{spec_folder}/context/`. A standalone run dir is used ONLY when no spec folder is named or derivable — fail-closed, never as a default when a folder is identifiable (see `auto_mode_contract` §1 source 3 + fallback guard). In the standalone case the host hands the report path to `/speckit:plan`.

---

## 8. QUICK REFERENCE

| Item | Value |
|------|-------|
| Command | `/deep:context` (`:auto` / `:confirm`) |
| Agent | `@deep-context` (LEAF, read-only analyzer seat) |
| Loop type | `context` in `deep-loop-runtime` coverage-graph + `convergence.cjs` |
| Node kinds | `SLICE, FILE, SYMBOL, PATTERN, REUSE_CANDIDATE, DEPENDENCY, CONSTRAINT, GAP` |
| Convergence signals | `sliceCoverage`, `reuseCatalogCoverage`, `agreementRate` (guard), `relevanceFloor` (guard), `dependencyCompleteness` |
| Packet | `{spec_folder}/context/` (config, state, iterations, `context-report.md`) |
| Default pool | 2 native `@deep-context` seats (native-only), over the shared scope; add `--executor` for CLI/heterogeneous |
| `relevanceGate` | 0.55 (findings below route to `lowConfidence`) |
| `agreementMin` | 2 distinct executors for agreement-eligibility |
| `maxIterations` | 8 |
| `convergenceThreshold` | 0.10 (new agreement-eligible findings per iteration at saturation) |
| `fanout.mode` | `by-model-shared-scope` |
| Stop score weights | reuse-first (0.30 reuseCatalog, 0.25 agreement, 0.20 slice, 0.15 relevance, 0.10 dependency) |
| Runtime robustness | Inherits deep-loop-runtime durability layer: atomic-state, jsonl-repair, post-dispatch-validate, loop-lock (`scripts/loop-lock.cjs`), executor-audit recursion guard |

---

## 9. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/guides/quick_reference.md` (the ALWAYS baseline) and `references/protocol/loop_protocol.md`, then load intent-specific `convergence/` and `state/` resources according to Section 2.

Scripts: `scripts/reduce-state.cjs` — the agreement-weighted context reducer; run it from the repository root with a spec-folder argument.

Related skills: `deep-research` for outward/web investigation (sibling loop whose structure this mirrors), `deep-review` for code audit, `deep-loop-runtime` for shared executor and coverage-graph infrastructure, `sk-prompt-small-model` for per-model prompt framing, and `system-spec-kit` when packet documentation or memory continuity applies.
