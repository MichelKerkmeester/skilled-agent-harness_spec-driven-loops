---
title: sk-prompt Surface Router — per-intent leaf sets
description: Second-layer (surface) router for the sk-prompt hub. hub-router.json selects the workflow mode; this doc maps a request's prompt-craft intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "sk-prompt smart routing"
  - "prompt-craft resource map"
  - "prompt-models leaf routing"
  - "prompt-improve resource map"
importance_tier: important
contextType: general
version: 1.0.0.0
---

# sk-prompt Surface Router — per-intent leaf sets

This is sk-prompt's second-layer (surface) router. The hub selects a workflow mode
in [`hub-router.json`](../../hub-router.json) (`prompt-improve` vs `prompt-models`);
this doc maps a request's prompt-craft intent to the exact packet-local leaf
resources that mode should load. Every path is packet-qualified
(`<packet>/references|assets/…`) and converts to the canonical
`(workflowMode, leafResourceId)` pair at the one contract boundary
(`sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW (mode telemetry), this router
picks the LEAVES within it. The two layers stay separate — the hub never emits
leaf paths, and this router never re-decides the mode.

---

## 1. INTENT MODEL

- **prompt-improve leaves** — the DEPTH/CLEAR prompt engine's own references and
  format guides. A generic "write/improve a prompt" request loads the DEPTH
  framework; design-prompt, evaluation, and per-format requests load their
  focused leaf.
- **prompt-models leaves** — read-only per-model prompt-craft profiles. A request
  that names a specific small model by id (`deepseek-v4-pro`, `kimi-k2.7-code`,
  `minimax-m3`, `mimo-v2.5-pro`, `glm-5.2`) loads exactly that model's profile.
  A generic "which small model / compare models" request loads the model index
  and the pattern-index bridge; those two are lifecycle leaves, not a model choice.

Model-adjacent vocabulary alone (e.g. "for a small model") names no model id, so it
fires no `MODEL_*` intent and falls back to the hub default (`prompt-improve`).

---

## 2. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is the
human-facing contract; this block is the byte-for-byte source the deterministic
router-replay parses. Keep them in sync: when a map row changes above, update the
matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path resolves on disk and
is registered in `leaf-manifest.json`, so each dual-reads to a canonical typed pair.

```python
# No always-loaded preamble: prompt-craft routing loads only the selected
# intent's leaves so the hub default route stays minimal.
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "IMPROVE":        {"weight": 4, "keywords": ["better prompt", "improve prompt", "improve this prompt", "write a better", "enhance prompt", "structure this prompt", "prompt engineering", "depth thinking", "rewrite prompt", "stronger prompt"]},
    "DESIGN_PROMPT":  {"weight": 4, "keywords": ["image prompt", "image generation prompt", "design generation", "midjourney prompt", "visual prompt", "generate an image"]},
    "EVAL_PATTERNS":  {"weight": 4, "keywords": ["evaluate prompt", "prompt evaluation", "clear score", "clear scoring", "score this prompt", "prompt quality score", "grade the prompt"]},
    "FORMAT_JSON":     {"weight": 4, "keywords": ["json format", "json output format", "output as json", "in json"]},
    "FORMAT_MARKDOWN": {"weight": 4, "keywords": ["markdown format", "output as markdown", "in markdown"]},
    "FORMAT_YAML":     {"weight": 4, "keywords": ["yaml format", "output as yaml", "in yaml"]},
    "MODEL_INDEX":    {"weight": 4, "keywords": ["which small model", "compare models", "small-model dispatch", "per-model profile", "model comparison", "which model should"]},
    "MODEL_DEEPSEEK": {"weight": 4, "keywords": ["deepseek", "deepseek-v4-pro", "deepseek v4"]},
    "MODEL_KIMI":     {"weight": 4, "keywords": ["kimi", "kimi-k2.7", "kimi k2.7", "moonshot"]},
    "MODEL_MINIMAX":  {"weight": 4, "keywords": ["minimax", "minimax-m3", "minimax m3"]},
    "MODEL_MIMO":     {"weight": 4, "keywords": ["mimo", "mimo-v2.5-pro", "mimo v2.5"]},
    "MODEL_GLM":      {"weight": 4, "keywords": ["glm-5.2", "glm 5.2", "z.ai", "z.ai coding plan"]},
}

RESOURCE_MAP = {
    "IMPROVE": [
        "prompt-improve/references/depth_framework.md"
    ],
    "DESIGN_PROMPT": [
        "prompt-improve/references/design_generation_patterns.md"
    ],
    "EVAL_PATTERNS": [
        "prompt-improve/references/patterns_evaluation.md"
    ],
    "FORMAT_JSON": [
        "prompt-improve/assets/format_guide_json.md"
    ],
    "FORMAT_MARKDOWN": [
        "prompt-improve/assets/format_guide_markdown.md"
    ],
    "FORMAT_YAML": [
        "prompt-improve/assets/format_guide_yaml.md"
    ],
    "MODEL_INDEX": [
        "prompt-models/references/models/_index.md",
        "prompt-models/references/pattern_index.md"
    ],
    "MODEL_DEEPSEEK": [
        "prompt-models/references/models/deepseek-v4-pro.md"
    ],
    "MODEL_KIMI": [
        "prompt-models/references/models/kimi-k2.7-code.md"
    ],
    "MODEL_MINIMAX": [
        "prompt-models/references/models/minimax-m3.md"
    ],
    "MODEL_MIMO": [
        "prompt-models/references/models/mimo-v2.5-pro.md"
    ],
    "MODEL_GLM": [
        "prompt-models/references/models/glm-5.2.md"
    ],
}
```

## 3. How to read this

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit.
- A specific model id (`deepseek-v4-pro`, `glm-5.2`, …) loads only that model's
  profile; the `_index`/`pattern_index` lifecycle leaves load only on a generic
  model-inventory request.
- No keyword match is the hub's UNKNOWN fallback: confirm the target prompt/model
  and delivery format before loading anything.
