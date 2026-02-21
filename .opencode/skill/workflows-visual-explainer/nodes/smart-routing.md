---
description: "Intent scoring pseudocode and resource loading strategy for routing user requests to the correct command and resources"
---
# Smart Routing

This node defines how user prompts are classified into intents and how resources are loaded based on those intents. The router runs at activation time, before any Phase 1 analysis begins.

---

## Intent Model

Seven intent classes cover every use case for this skill. Intent classification uses keyword scoring — each keyword has a weight representing its signal strength for that intent.

```python
from pathlib import Path
from typing import Optional

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_MODEL = {
    # Primary intent: generate a new visual from scratch
    "GENERATE": {
        "keywords": [
            ("generate", 4),
            ("diagram", 3),
            ("visual", 3),
            ("architecture", 3),
            ("flowchart", 3),
            ("mermaid", 3),
            ("chart", 3),
            ("table", 2),
            ("timeline", 2),
            ("dashboard", 2),
            ("render", 2),
            ("visualization", 3),
            ("create html", 4),
            ("make a page", 3),
        ]
    },

    # Review a git diff or PR visually
    "DIFF_REVIEW": {
        "keywords": [
            ("diff", 4),
            ("review diff", 5),
            ("pr review", 4),
            ("pull request", 3),
            ("changes", 2),
            ("commit", 2),
            ("branch", 2),
            ("what changed", 3),
        ]
    },

    # Review a plan or spec document visually
    "PLAN_REVIEW": {
        "keywords": [
            ("plan review", 5),
            ("plan analysis", 4),
            ("analyze plan", 4),
            ("review plan", 4),
            ("spec review", 4),
            ("plan.md", 3),
            ("spec.md", 3),
        ]
    },

    # Recap recent work or progress
    "RECAP": {
        "keywords": [
            ("recap", 5),
            ("summary", 3),
            ("progress", 3),
            ("what happened", 3),
            ("last week", 3),
            ("this week", 3),
            ("past 2 weeks", 3),
            ("recent work", 3),
        ]
    },

    # Fact-check or verify an existing HTML output
    "FACT_CHECK": {
        "keywords": [
            ("fact check", 5),
            ("fact-check", 5),
            ("verify", 3),
            ("accuracy", 3),
            ("correct this", 3),
            ("is this right", 3),
            ("check the output", 3),
        ]
    },

    # Aesthetic or styling focused request
    "AESTHETIC": {
        "keywords": [
            ("style", 3),
            ("aesthetic", 4),
            ("theme", 3),
            ("design", 2),
            ("color", 2),
            ("font", 2),
            ("look and feel", 4),
            ("blueprint", 4),
            ("neon", 4),
            ("terminal", 3),
            ("editorial", 4),
        ]
    },

    # Diagram type selection focused request
    "DIAGRAM_TYPE": {
        "keywords": [
            ("which diagram", 4),
            ("what type", 3),
            ("er diagram", 4),
            ("entity relationship", 4),
            ("state machine", 4),
            ("state diagram", 4),
            ("mind map", 4),
            ("mindmap", 4),
            ("sequence", 3),
            ("flowchart vs", 4),
        ]
    },
}
```

---

## Scoring Algorithm

```python
def classify_intent(prompt: str) -> tuple[str, float, list[str]]:
    """
    Returns: (intent_name, confidence_score, resource_paths)
    confidence_score: 0.0–1.0, where 1.0 = high confidence
    """
    prompt_lower = prompt.lower()
    scores: dict[str, int] = {}

    for intent, config in INTENT_MODEL.items():
        score = 0
        for keyword, weight in config["keywords"]:
            if keyword in prompt_lower:
                score += weight
        if score > 0:
            scores[intent] = score

    if not scores:
        # Default to GENERATE with low confidence
        return ("GENERATE", 0.4, [DEFAULT_RESOURCE])

    # Sort by score descending
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_intent, top_score = ranked[0]

    # Confidence heuristic: normalize against max possible score for that intent
    max_possible = sum(w for _, w in INTENT_MODEL[top_intent]["keywords"])
    confidence = min(top_score / (max_possible * 0.4), 1.0)

    # Resolve resources
    resources = resolve_resources(top_intent)

    return (top_intent, confidence, resources)


def resolve_resources(intent: str) -> list[str]:
    """Always include default resource; add intent-specific resources."""
    base = [DEFAULT_RESOURCE]
    intent_resources = RESOURCE_MAP.get(intent, [])
    return base + [r for r in intent_resources if r not in base]
```

---

## Resource Map

Maps intents to the specific reference files that should be loaded for that intent.

```python
RESOURCE_MAP = {
    "GENERATE":     [
        "references/css_patterns.md",
        "references/library_guide.md",
    ],
    "DIFF_REVIEW":  [
        "references/css_patterns.md",
        "references/library_guide.md",
    ],
    "PLAN_REVIEW":  [
        "references/css_patterns.md",
    ],
    "RECAP":        [
        "references/css_patterns.md",
    ],
    "FACT_CHECK":   [
        "references/quality_checklist.md",
    ],
    "AESTHETIC":    [
        "references/css_patterns.md",
    ],
    "DIAGRAM_TYPE": [
        "references/library_guide.md",
    ],
}
```

---

## Resource Loading Levels

| Level | Trigger | Resources Loaded |
|-------|---------|----------------|
| **ALWAYS** | Every skill activation | `references/quick_reference.md` |
| **CONDITIONAL — Style** | GENERATE, DIFF_REVIEW, PLAN_REVIEW, RECAP, AESTHETIC | `references/css_patterns.md` |
| **CONDITIONAL — Library** | GENERATE, DIFF_REVIEW, DIAGRAM_TYPE | `references/library_guide.md` |
| **CONDITIONAL — Quality** | FACT_CHECK | `references/quality_checklist.md` |
| **ON_DEMAND — Navigation** | Page has 4+ sections (detected during Phase 2) | `references/navigation_patterns.md` |
| **ON_DEMAND — Templates** | Reference implementation needed for the specific diagram type | `assets/templates/{type}.html` |

**Loading rule:** Do not pre-load ON_DEMAND resources. Read them only when the specific condition is met during execution.

---

## Confidence Thresholds and Actions

| Confidence | Action |
|-----------|--------|
| >= 0.7 | Proceed directly to Phase 1 with detected intent |
| 0.4–0.69 | Proceed but announce: "I'm interpreting this as a [INTENT] request — is that right?" |
| < 0.4 | Ask the user: "Should I generate a visual, review a diff, or something else?" |

---

## Multi-Intent Handling

When a prompt scores significantly on two or more intents (within 20% of each other), treat it as a compound request:

**Example:** "Generate a visual recap of the last 2 weeks and fact-check the architecture diagram from last session."

- RECAP: score 11
- FACT_CHECK: score 9
- GENERATE: score 6

**Action:** Execute RECAP first (highest score), then FACT_CHECK on the relevant file. Report both outputs.

---

## Proactive Table Detection

This runs independently of intent classification, applied to ANY response the skill is about to generate:

```python
def should_proactively_render(response_content: str) -> bool:
    """
    Returns True if the response contains a table large enough
    to benefit from HTML rendering.
    """
    # Detect markdown table by counting | separators
    lines = response_content.split('\n')
    table_lines = [l for l in lines if '|' in l and not l.strip().startswith('```')]

    if len(table_lines) < 3:
        return False  # Header + separator + at least 1 row = minimum 3 lines

    # Count columns by splitting a data row on |
    data_rows = [l for l in table_lines if not re.match(r'^\s*\|[-: |]+\|\s*$', l)]
    if not data_rows:
        return False

    col_count = len(data_rows[0].split('|')) - 2  # Exclude leading/trailing pipes
    row_count = len(data_rows)

    return row_count >= 4 or col_count >= 3
```

When `should_proactively_render()` returns `True`, activate with intent GENERATE, aesthetic DATA_DENSE, announce to user, and proceed through the workflow.

---

## Cross References
- [[when-to-use]] — Activation triggers that feed into the router
- [[commands]] — The command each intent maps to
- [[related-resources]] — Full index of all resources the router can load
