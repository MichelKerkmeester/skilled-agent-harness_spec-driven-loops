---
title: "sk-prompt Router"
description: "Sibling router for sk-prompt: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-prompt router"
  - "sk-prompt routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# sk-prompt Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-prompt/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A `$text`, `$improve`, `$refine`, `$short`, `$json`, `$yaml` or `$raw` prefix reaches sk-prompt, and so does a request to improve, enhance, score or restructure a prompt, or a design-generation brief. The resource families are the flat `references/` pair (the DEPTH methodology and the framework library with CLEAR scoring) and the `assets/` guides for the Markdown, JSON and YAML formats plus the CLI prompt quality card. A request that scores no intent still loads the DEPTH reference, then asks the disambiguation checklist rather than guessing.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **TEXT_ENHANCE** — the `$text`, `$improve`, `$refine` and `$short` prefixes, and "improve / enhance / prompt / text / refine" phrasings, load `references/depth-framework.md` and `references/patterns-evaluation.md`. It is also the zero-score fallback, so a request that matches nothing loads the DEPTH default plus the `UNKNOWN_FALLBACK_CHECKLIST` questions instead of guessing.
- **FRAMEWORK** — "framework / rcaf / costar / tidd-ec / scoring" requests load `references/patterns-evaluation.md`, which replaces the DEPTH default rather than joining it, because the framework library is the whole answer.
- **DESIGN_GEN** — "design generation / generate ui / canvas / design brief / variations" requests load `references/patterns-evaluation.md`; the brief shape belongs here while the run transport and the measured reference extraction belong elsewhere.
- **FORMAT_MARKDOWN** — "markdown / md / readme" requests load `assets/format-guide-markdown.md` and `references/patterns-evaluation.md`, the one format guide plus the scoring source.
- **FORMAT_JSON** — "json / schema / api-ready" requests load `assets/format-guide-json.md` and `references/patterns-evaluation.md`.
- **FORMAT_YAML** — "yaml / frontmatter / config" requests load `assets/format-guide-yaml.md` and `references/patterns-evaluation.md`.
- **RAW** — the `$raw` token, or "raw passthrough", loads nothing at all: passthrough is asked for by command token and never inferred from prose, and it skips DEPTH with the references.
- **CLI_FAST_PATH** — "cli prompt quality card / prompt framework selection table / clear pre-dispatch check / fast path prompt quality" requests load `assets/cli-prompt-quality-card.md`, the card a CLI orchestrator reads before dispatch instead of the full body.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the primary detection signal, the phase tree, the resource domains, the loading levels and the smart-router pseudocode.

<!-- CRITICAL: Keep one authoritative Smart Router Pseudocode block in this section.
     Detection context may appear before pseudocode. Do NOT duplicate routing logic in separate lookup tables. -->

### Primary Detection Signal

The primary routing signal is the **command prefix** (`$improve`, `$text`, `$refine`, `$short`, `$json`, `$yaml`, `$raw`).
When present, the prefix determines the operating mode directly. When absent, the router falls back to **keyword-weighted intent scoring** against the request text, selecting the top-scoring intent (or top-2 when scores are close).
A zero-score fallback defaults to `TEXT_ENHANCE` with a disambiguation checklist.

### Phase Detection

```text
USER REQUEST
    |
    +- STEP 0: Detect mode ($command prefix or keyword signals)
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Framework Selection (7 frameworks evaluated)
    +- Phase 2: DEPTH Processing (3-10 rounds based on mode)
    +- Phase 3: Scoring & Validation (CLEAR)
    +- Phase 4: Output Delivery (formatted prompt)
```

### Resource Domains

This skill uses a **simple intent router**, not a keyed resource-subdirectory router. Its real resources are flat markdown files under `references/` and `assets/`.
There are no `references/<key>/` or `assets/<key>/` runtime-key directories to select. The router therefore discovers markdown resources recursively from `references/` and `assets/`, then applies command-prefix and intent scoring against the discovered inventory.

- `references/` for DEPTH methodology, framework definitions, and CLEAR scoring.
- `assets/` for format-specific deep-dives (Markdown, JSON, YAML).

```text
references/depth-framework.md            - DEPTH methodology, RICCE integration
references/patterns-evaluation.md        - 7 frameworks, CLEAR scoring
assets/format-guide-markdown.md          - Markdown format deep-dive
assets/format-guide-json.md              - JSON format deep-dive
assets/format-guide-yaml.md              - YAML format deep-dive
```

### Resource Loading Levels

| Level       | When to Load             | Resources                                                                  |
| ----------- | ------------------------ | -------------------------------------------------------------------------- |
| ALWAYS      | Every skill invocation   | SKILL.md (this file)                                                       |
| CONDITIONAL | If intent signals match  | references/depth-framework.md, references/patterns-evaluation.md           |
| CONDITIONAL | If design-generation signals match | references/patterns-evaluation.md                                 |
| ON_DEMAND   | Only on explicit request | assets/format-guide-markdown.md, assets/format-guide-json.md, assets/format-guide-yaml.md |

A run that loads `references/patterns-evaluation.md` reads three of its sections, not the whole file:

1. `## 2. FRAMEWORK LIBRARY & SELECTION`, to score at least three frameworks and choose one.
2. The chosen framework's `###` subsection under `## 3. FRAMEWORK DEEP DIVES`. A switch to another framework reads its subsection too. A name that matches no subsection reads all of section 3.
3. `## 10. CLEAR EVALUATION MASTERY`, to score the result.

A request that carries an on-demand keyword (the `ON_DEMAND_KEYWORDS` list below) reads the whole file.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/depth-framework.md"
PATTERNS_RESOURCE = "references/patterns-evaluation.md"

COMMAND_INTENTS = {
    "$text": "TEXT_ENHANCE",
    "$improve": "TEXT_ENHANCE",
    "$refine": "TEXT_ENHANCE",
    "$short": "TEXT_ENHANCE",
    "$json": "FORMAT_JSON",
    "$yaml": "FORMAT_YAML",
    "$raw": "RAW",
}

INTENT_MODEL = {
    "TEXT_ENHANCE": {"keywords": [("improve", 4), ("enhance", 4), ("prompt", 3), ("text", 3), ("refine", 4)]},
    "FRAMEWORK": {"keywords": [("framework", 4), ("rcaf", 5), ("costar", 5), ("tidd-ec", 5), ("scoring", 3)]},
    "DESIGN_GEN": {"keywords": [("design generation", 5), ("generate ui", 4), ("canvas", 3), ("design brief", 4), ("variations", 3)]},
    "FORMAT_MARKDOWN": {"keywords": [("markdown", 4), ("md", 2), ("readme", 3)]},
    "FORMAT_JSON": {"keywords": [("json", 5), ("schema", 3), ("api-ready", 3)]},
    "FORMAT_YAML": {"keywords": [("yaml", 5), ("frontmatter", 3), ("config", 2)]},
    # $raw is the whole trigger: passthrough is asked for by command token, never
    # inferred from prose, and it deliberately loads nothing.
    "RAW": {"keywords": [("$raw", 5), ("raw passthrough", 4)]},
    # The fast-path card a CLI orchestrator reads before dispatch, instead of the
    # full body.
    "CLI_FAST_PATH": {"keywords": [("cli prompt quality card", 5), ("prompt framework selection table", 4), ("clear pre-dispatch check", 4), ("fast path prompt quality", 4)]},
}

# RAW loads nothing: passthrough skips DEPTH and every reference.
NO_LOAD_INTENTS = ("RAW",)

RESOURCE_MAP = {
    "TEXT_ENHANCE": ["references/depth-framework.md", "references/patterns-evaluation.md"],
    "FRAMEWORK": ["references/patterns-evaluation.md"],
    "DESIGN_GEN": ["references/patterns-evaluation.md"],
    "FORMAT_MARKDOWN": ["assets/format-guide-markdown.md", "references/patterns-evaluation.md"],
    "FORMAT_JSON": ["assets/format-guide-json.md", "references/patterns-evaluation.md"],
    "FORMAT_YAML": ["assets/format-guide-yaml.md", "references/patterns-evaluation.md"],
    "RAW": [],
    "CLI_FAST_PATH": ["assets/cli-prompt-quality-card.md"],
}

ON_DEMAND_KEYWORDS = ["deep dive", "full template", "all frameworks", "format guide", "overnight-agent prompt", "system prompt", "prompt package", "prompt variant", "operator prompt", "evaluator prompt", "dispatch prompt"]

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is this a prompt enhancement request or a different task?",
    "Does the user want a specific framework applied?",
    "Is the user asking about scoring or evaluation?",
    "Should this route to sk-doc or sk-code instead?",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _task_text(task) -> str:
    if isinstance(task, str):
        return task.lower()
    return " ".join(
        str(task.get(f, "")) for f in ("text", "query", "description", "keywords")
    ).lower()

def detect_command_intent(task):
    text = _task_text(task).strip()
    for prefix, intent in COMMAND_INTENTS.items():
        if text.startswith(prefix):
            return intent
    return None

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for keyword, weight in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight
    return scores

def select_intents(task, scores, ambiguity_delta=AMBIGUITY_DELTA, max_intents=2):
    command_intent = detect_command_intent(task)
    if command_intent:
        return (command_intent, None)
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("TEXT_ENHANCE", None)
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= ambiguity_delta:
        return (primary, secondary)
    return (primary, None)

def route_prompt_improver_resources(task):
    inventory = discover_markdown_resources()
    text = _task_text(task)
    scores = score_intents(task)
    command_intent = detect_command_intent(task)
    primary, secondary = select_intents(task, scores)
    intents = [primary] + ([secondary] if secondary else [])
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    # Prefixes are authoritative; RAW skips DEPTH and reference loading.
    if command_intent == "RAW":
        return {"intents": intents, "intent_scores": scores, "resources": loaded, "load_level": "RAW"}

    # Unknown fallback: when no command prefix or keywords match at all.
    if not command_intent and scores.get(primary, 0) == 0:
        load_if_available(DEFAULT_RESOURCE)
        return {
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "resources": loaded,
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        }

    # Standard routing: DEPTH default + intent-mapped resources.
    if primary != "FRAMEWORK":
        load_if_available(DEFAULT_RESOURCE)
    else:
        load_if_available(PATTERNS_RESOURCE)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    # ON_DEMAND: load all mapped markdown resources when trigger keywords are present.
    if any(kw in text for kw in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```
