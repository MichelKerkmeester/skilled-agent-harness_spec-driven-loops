---
title: "Autonomous Deep Research Loop Router"
description: "Sibling router for deep-research: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "deep-research router"
  - "deep-research routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Autonomous Deep Research Loop Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name `autoresearch`, a deep research loop, autonomous or iterative research, a multi-round investigation, a convergence check, a stuck loop, a research state packet or a `spec.md` anchoring question, and the `system-deep-loop` hub's `research` mode selects this packet. It routes to two resource families: the `references/` doctrine, which starts at `references/guides/quick-reference.md` on every invocation and adds the loop protocol, spec anchoring, convergence, state, recovery, runtime-parity and resource-map references, plus the `assets/` markdown templates and prompt assets on explicit request.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`LOOP_SETUP`** fires on `autoresearch`, `deep research`, `research loop`, `autonomous research`, `setup` and `init` at weight 4. It loads `references/protocol/loop-protocol.md`, `references/state/state-format.md`, `references/state/state-jsonl.md`, `references/protocol/spec-check-protocol.md` and `references/protocol/context-snapshot.md`.
- **`ITERATION`** fires on `iteration`, `next round`, `continue research`, `research cycle`, `delta` and `focus` at weight 4. It loads `references/protocol/loop-protocol.md`, `references/state/state-outputs.md` and `references/convergence/convergence-signals.md`.
- **`CONVERGENCE`** fires on `convergence`, `stop condition`, `diminishing returns`, `legal stop` and `newInfoRatio` at weight 4. It loads `references/convergence/convergence.md`, `references/convergence/convergence-signals.md` and `references/convergence/convergence-graph.md`.
- **`RECOVERY`** fires on `stuck`, `recovery`, `timeout`, `reconstruct`, `blocked stop` and `blocked_stop` at weight 4. It loads `references/convergence/convergence-recovery.md` and `references/state/state-reducer-registry.md`.
- **`STATE`** fires on `state file`, `jsonl`, `strategy`, `dashboard`, `registry` and `lineage` at weight 4. It loads `references/state/state-format.md`, `references/state/state-jsonl.md`, `references/state/state-outputs.md`, `references/state/state-reducer-registry.md` and `assets/deep-research-strategy.md`.
- **`SPEC_ANCHORING`** fires on `spec.md`, `generated fence`, `folder_state`, `lock` and `spec anchoring` at weight 3. It loads `references/protocol/spec-check-protocol.md` and `references/state/state-outputs.md`.
- **`RUNTIME_PARITY`** fires on `runtime`, `capability`, `parity`, `opencode` and `claude` at weight 3. It loads `references/guides/capability-matrix.md`.
- **`RESOURCE_MAP`** fires on `resource map`, `resource-map`, `inventory` and `coverage gate` at weight 3. It loads `references/protocol/loop-protocol.md` and `references/state/state-outputs.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail the short summary leaves out: the resource domains, the loading levels, the phase signals and the discovery pseudocode.

> Pattern: aligned with the [sk-doc smart-router resilience template](../../sk-doc/sk-create-skill/assets/skill/skill-smart-router.md).

### Resource Domains

The router discovers markdown resources from `references/` and `assets/`, then applies intent scoring from `RESOURCE_MAP`. Keep routing domain-focused rather than hardcoding exhaustive inventories.

- `references/guides/quick-reference.md` -- first-touch operator cheat sheet.
- `references/protocol/loop-protocol.md` -- lifecycle, dispatch, reducer sequencing, command-owned state flow.
- `references/protocol/spec-check-protocol.md` -- bounded `spec.md` anchoring and generated-fence write-back.
- `references/convergence*.md` -- stop contracts, signals, recovery, graph gates, reference-only convergence ideas.
- `references/state*.md` -- packet layout, JSONL records, markdown outputs, reducer ownership, reconstruction.
- `references/guides/capability-matrix.md` -- runtime parity.
- `assets/*.md` -- markdown templates and prompt assets safe for guarded markdown loading.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop, convergence, state, spec anchoring, runtime parity references |
| ON_DEMAND | Only on explicit request | Full reference set and markdown assets |

### Phase Signals

| Phase | Signal | Primary Resources |
|-------|--------|-------------------|
| Init | No JSONL exists or setup context | `loop-protocol.md`, `state-format.md`, `state-jsonl.md` |
| Iteration | Dispatch context includes iteration number | `loop-protocol.md`, `state-outputs.md`, `convergence-signals.md` |
| Stuck | Dispatch context includes recovery language | `convergence-recovery.md`, `state-reducer-registry.md` |
| Synthesis | STOP candidate or final report | `convergence.md`, `state-outputs.md`, `spec-check-protocol.md` |

### Smart Router Pseudocode

The authoritative routing logic covers scoped loading, weighted intent scoring, ambiguity handling and graceful fallback. It uses four patterns:
- Runtime discovery: `discover_markdown_resources()` scans `references/`/`assets/`.
- Existence-check-before-load: `load_if_available()` guards paths against `inventory` and `seen`.
- Extensible routing keys: intent labels map to resource families, not static file lists.
- Multi-tier graceful fallback: `UNKNOWN_FALLBACK_CHECKLIST` for disambiguation, and a missing family returns a helpful notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/guides/quick-reference.md"

INTENT_SIGNALS = {
    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research", "setup", "init"]},
    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle", "delta", "focus"]},
    "CONVERGENCE": {"weight": 4, "keywords": ["convergence", "stop condition", "diminishing returns", "legal stop", "newInfoRatio"]},
    "RECOVERY": {"weight": 4, "keywords": ["stuck", "recovery", "timeout", "reconstruct", "blocked stop", "blocked_stop"]},
    "STATE": {"weight": 4, "keywords": ["state file", "jsonl", "strategy", "dashboard", "registry", "lineage"]},
    "SPEC_ANCHORING": {"weight": 3, "keywords": ["spec.md", "generated fence", "folder_state", "lock", "spec anchoring"]},
    "RUNTIME_PARITY": {"weight": 3, "keywords": ["runtime", "capability", "parity", "opencode", "claude"]},
    "RESOURCE_MAP": {"weight": 3, "keywords": ["resource map", "resource-map", "inventory", "coverage gate"]},
}

RESOURCE_MAP = {
    "LOOP_SETUP": ["references/protocol/loop-protocol.md", "references/state/state-format.md", "references/state/state-jsonl.md", "references/protocol/spec-check-protocol.md", "references/protocol/context-snapshot.md"],
    "ITERATION": ["references/protocol/loop-protocol.md", "references/state/state-outputs.md", "references/convergence/convergence-signals.md"],
    "CONVERGENCE": ["references/convergence/convergence.md", "references/convergence/convergence-signals.md", "references/convergence/convergence-graph.md"],
    "RECOVERY": ["references/convergence/convergence-recovery.md", "references/state/state-reducer-registry.md"],
    "STATE": ["references/state/state-format.md", "references/state/state-jsonl.md", "references/state/state-outputs.md", "references/state/state-reducer-registry.md", "assets/deep-research-strategy.md"],
    "SPEC_ANCHORING": ["references/protocol/spec-check-protocol.md", "references/state/state-outputs.md"],
    "RUNTIME_PARITY": ["references/guides/capability-matrix.md"],
    "RESOURCE_MAP": ["references/protocol/loop-protocol.md", "references/state/state-outputs.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all references", "complete reference", "resume deep research", "state log", "research/iterations", "deltas", "overnight research", "active lineage", "reference-only", "optimizer"],
    "ON_DEMAND": [
        "references/protocol/loop-protocol.md",
        "references/protocol/spec-check-protocol.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence-signals.md",
        "references/convergence/convergence-recovery.md",
        "references/convergence/convergence-graph.md",
        "references/convergence/convergence-reference-only.md",
        "references/state/state-format.md",
        "references/state/state-jsonl.md",
        "references/state/state-outputs.md",
        "references/state/state-reducer-registry.md",
        "references/guides/capability-matrix.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm setup vs iteration vs convergence vs state recovery",
    "Confirm the target spec folder and research packet",
    "Provide the current phase, latest iteration, or failing state file",
    "Confirm whether full references or quick routing guidance are needed",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def _guard_resource_map(resource_map: dict[str, list[str]]) -> None:
    for intent, resources in resource_map.items():
        for relative_path in resources:
            guarded = _guard_in_skill(relative_path)
            if guarded.startswith("references/"):
                tail = guarded.removeprefix("references/")
                if "/" not in tail and "-" in Path(tail).stem:
                    raise ValueError(f"RESOURCE_MAP must target canonical references, not compatibility stubs: {intent} -> {guarded}")

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["LOOP_SETUP"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_deep_research_resources(task):
    _guard_resource_map(RESOURCE_MAP)
    _guard_resource_map({"ALWAYS": LOADING_LEVELS["ALWAYS"], "ON_DEMAND": LOADING_LEVELS["ON_DEMAND"]})
    inventory = discover_markdown_resources()
    scores = score_intents(task)
    intents = select_intents(scores)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if max(scores.values() or [0]) < 0.5:
        return {
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    result = {"intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```
