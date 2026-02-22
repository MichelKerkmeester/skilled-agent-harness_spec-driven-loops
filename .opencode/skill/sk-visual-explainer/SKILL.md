---
name: sk-visual-explainer
description: "Converts complex technical context into self-contained, styled HTML visual artifacts with strict quality checks, weighted intent routing, and template-first delivery."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.1.0.0
---

<!-- Keywords: visual, diagram, HTML, generate, architecture, flowchart, sequence, chart, mermaid, review, diff, plan, recap, fact-check, table, render, visualization, timeline, dashboard, metrics, data-table, aesthetic, css, typography -->

# sk-visual-explainer — Styled HTML Diagram Generator

Converts complex terminal output and technical concepts into styled, self-contained HTML pages with diagrams, tables, and visualizations. Uses a 4-phase **Think > Structure > Style > Deliver** workflow with strict validation and deterministic library pinning.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Commands

| Command | Purpose | Example Trigger |
|---------|---------|----------------|
| `/visual-explainer:generate` | Generate a visual diagram or styled page from any topic | "generate an architecture diagram for this service" |
| `/visual-explainer:diff-review` | Visual review of git diffs, PRs, or commit ranges | "visual diff review of this PR" |
| `/visual-explainer:plan-review` | Visual analysis of a plan document | "visually review specs/007-auth/plan.md" |
| `/visual-explainer:recap` | Visual recap of recent work or progress | "generate a visual recap of the last 2 weeks" |
| `/visual-explainer:fact-check` | Verify accuracy of an existing HTML output | "fact-check this visual output against the spec" |

### Keyword Triggers (Auto-Activate)

Activate this skill when the user's message contains: `visual`, `diagram`, `HTML page`, `generate HTML`, `flowchart`, `architecture diagram`, `mermaid`, `chart`, `sequence diagram`, `timeline`, `dashboard`, `render`, `visualization`, `styled page`, `table render`, `data table`.

### Proactive Trigger

Auto-render a styled HTML table when responding with data that has:
- 4 or more rows, OR
- 3 or more columns

Announce: "I'm rendering this as a styled HTML page for readability."

### When NOT to Use

- Plain text is sufficient (< 4-row tables, simple lists, short explanations)
- Output must be a React, Vue, or Svelte component
- Server-side rendering required (live data, authentication, database queries)
- User explicitly requests plain Markdown output

<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`.

- `references/` for generation patterns, CSS/layout standards, library guidance, navigation, and quality checks.
- `assets/templates/` for reusable HTML starter templates.
- `assets/library_versions.json` as machine-readable version source-of-truth (used by drift checks, not markdown routing).
- `scripts/` for validation and drift enforcement scripts.

### Resource Loading Levels

| Level       | When to Load             | Resources                                 |
| ----------- | ------------------------ | ----------------------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline                   |
| CONDITIONAL | If intent signals match  | CSS/library/checklist references          |
| ON_DEMAND   | Only on explicit request | Navigation patterns and template deep-dive |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, ambiguity handling, and unknown fallback guidance.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "GENERATE": {"weight": 4, "keywords": ["generate", "diagram", "visual", "architecture", "flowchart", "mermaid", "chart", "table", "timeline", "dashboard"]},
    "DIFF_REVIEW": {"weight": 4, "keywords": ["diff", "review diff", "pr review", "commit", "changes"]},
    "PLAN_REVIEW": {"weight": 4, "keywords": ["plan review", "plan analysis", "analyze plan"]},
    "RECAP": {"weight": 4, "keywords": ["recap", "summary", "progress", "what happened"]},
    "FACT_CHECK": {"weight": 4, "keywords": ["fact check", "verify", "accuracy", "correctness"]},
    "AESTHETIC": {"weight": 3, "keywords": ["style", "aesthetic", "theme", "visual direction"]},
    "DIAGRAM_TYPE": {"weight": 3, "keywords": ["diagram type", "which diagram", "state machine", "mind map", "er diagram"]},
}

COMMAND_BOOSTS = {
    "/visual-explainer:generate": "GENERATE",
    "/visual-explainer:diff-review": "DIFF_REVIEW",
    "/visual-explainer:plan-review": "PLAN_REVIEW",
    "/visual-explainer:recap": "RECAP",
    "/visual-explainer:fact-check": "FACT_CHECK",
}

RESOURCE_MAP = {
    "GENERATE": ["references/css_patterns.md", "references/library_guide.md"],
    "DIFF_REVIEW": ["references/css_patterns.md", "references/library_guide.md"],
    "PLAN_REVIEW": ["references/css_patterns.md", "references/quality_checklist.md"],
    "RECAP": ["references/css_patterns.md", "references/navigation_patterns.md"],
    "FACT_CHECK": ["references/quality_checklist.md"],
    "AESTHETIC": ["references/css_patterns.md"],
    "DIAGRAM_TYPE": ["references/library_guide.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full checklist", "full template", "deep dive", "navigation pattern"],
    "ON_DEMAND": [
        "references/navigation_patterns.md",
        "assets/templates/architecture.html",
        "assets/templates/mermaid-flowchart.html",
        "assets/templates/data-table.html",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm desired visual artifact type (architecture, flowchart, data table, dashboard, timeline)",
    "Confirm audience (developer, reviewer, stakeholder)",
    "Provide the source of truth (spec, diff, notes, dataset)",
    "Confirm delivery constraints (single-page vs split pages, static HTML only)",
]

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "description", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()

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

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}

    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]

    command = str(getattr(task, "command", "")).lower()
    for prefix, intent in COMMAND_BOOSTS.items():
        if command.startswith(prefix):
            scores[intent] += 6

    if getattr(task, "has_tabular_data", False):
        scores["GENERATE"] += 2

    return scores

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 1.0, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["GENERATE"]

    noisy_hits = sum(1 for term in ["visual", "diagram", "plan", "review", "fact check"] if term in task_text)
    max_intents = adaptive_max_intents if noisy_hits >= 3 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break

    return selected[:max_intents]

def route_visual_explainer_resources(task):
    inventory = discover_markdown_resources()
    task_text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, task_text, ambiguity_delta=1.0)

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

    if sum(scores.values()) < 0.5:
        load_if_available("references/library_guide.md")
        return {
            "intents": ["GENERATE"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    if any(keyword in task_text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

<!-- /ANCHOR:smart-routing -->

---

<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

The skill executes a strict 4-phase workflow. Do not skip phases.

### Phase 1 — Think
- Analyze audience: developer, stakeholder, or technical reviewer.
- Identify artifact type: architecture, flowchart, table, dashboard, timeline.
- If confidence on diagram type is <80%, present 2-3 options and ask.

### Phase 2 — Structure
- Read templates from `assets/templates/` before composing output.
- Prefer template adaptation over blank-page HTML.
- Select rendering approach: Mermaid | Chart.js | semantic table | CSS grid/timeline.
- Build semantic layout with landmarks (`header`, `main`, `section`, `figure`, `figcaption`).

### Phase 3 — Style
- Use `--ve-*` custom properties for all visual tokens.
- Keep typography intentional; do not use Inter/Roboto/Arial as primary display/body fonts.
- Keep CSS-first motion with reduced-motion fallback.
- Provide both light and dark themes.
- Include contrast and forced-color resilience (`prefers-contrast`, `forced-colors`).

### Phase 4 — Deliver
- Save output to `.opencode/output/visual/{command}-{description}-{timestamp}.html`.
- Run `scripts/validate-html-output.sh` and fix all errors.
- For library updates, run `scripts/check-version-drift.sh`.
- Report artifact path, file size, and validator status.

<!-- /ANCHOR:how-it-works -->

---

<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS
- Self-contained HTML with inline CSS/JS or pinned CDN dependencies.
- `--ve-*` token namespace for visual variables.
- `prefers-reduced-motion` media query for all animation paths.
- `prefers-color-scheme` support and `<meta name="color-scheme" content="light dark">`.
- Contrast-aware behavior via `prefers-contrast` and `forced-colors` fallback blocks.
- Mermaid `theme: 'base'` with explicit `themeVariables`.
- Mermaid hardened defaults when Mermaid is used: `securityLevel: 'strict'`, `deterministicIds: true`, bounded `maxTextSize`, bounded `maxEdges`.
- Google Fonts with `display=swap` when web fonts are used.
- Mermaid zoom controls (+/-/reset, Ctrl+scroll, drag-to-pan) on every `.mermaid-wrap`.

### ❌ NEVER
- Build-step frameworks (React, Vue, Svelte) for generated output.
- Hardcoded local absolute paths in output HTML.
- Inter, Roboto, or Arial as primary display/body font variables.
- `color:` in Mermaid `classDef` declarations.
- Opaque light fills in Mermaid `classDef` where alpha transparency is required.
- Background scripts (`setInterval`, polling `fetch`, localStorage loops) in static outputs.

### ⚠️ ESCALATE IF
- Content exceeds single-page capacity (> 15 sections).
- User requires runtime server-side data fetch.
- Requested artifact must be framework-native component output.
- Diagram type confidence remains <80% after clarification.

<!-- /ANCHOR:rules -->

---

<!-- ANCHOR:references -->
## 5. REFERENCES

### Internal References

- [quick_reference.md](./references/quick_reference.md)
- [css_patterns.md](./references/css_patterns.md)
- [library_guide.md](./references/library_guide.md)
- [navigation_patterns.md](./references/navigation_patterns.md)
- [quality_checklist.md](./references/quality_checklist.md)
- [library_versions.json](./assets/library_versions.json)

### Template Assets

- [architecture.html](./assets/templates/architecture.html)
- [mermaid-flowchart.html](./assets/templates/mermaid-flowchart.html)
- [data-table.html](./assets/templates/data-table.html)

### Enforcement Scripts

- `scripts/validate-html-output.sh`
- `scripts/check-version-drift.sh`

<!-- /ANCHOR:references -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

1. Squint test: hierarchy is clear under blur.
2. Swap test: style is content-specific, not generic.
3. Light/dark both appear intentional.
4. Information completeness: source content is represented accurately.
5. No overflow across 320px-2560px.
6. Mermaid zoom controls work on every Mermaid artifact.
7. File opens cleanly on `file://` with no console errors.
8. Accessibility baseline is met (contrast, non-color-only signals, control labels).
9. Reduced-motion mode is fully usable.
10. `meta[name="color-scheme"]` is present.
11. Mermaid hardened config signals are present when Mermaid is used.
12. Version drift check passes against `assets/library_versions.json`.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Canonical Library Versions

| Library | Version | Use Case |
|---------|---------|---------|
| Mermaid.js | 11.12.3 (ESM) | Flowcharts, sequences, ER, state, mindmap |
| Chart.js | 4.5.1 | Dashboards, metrics, bar/line/pie |
| anime.js | 4.3.6 (optional) | Advanced stagger/shape animation |
| Google Fonts | pinned families + `display=swap` | Typography |

### Output Convention

```text
.opencode/output/visual/{command}-{description}-{timestamp}.html
```

### Cross-Skill Integration

| Skill | When to Call |
|-------|-------------|
| `system-spec-kit` memory | `/recap` and `/plan-review` context retrieval |
| `sk-git` | `/diff-review` evidence gathering |
| `mcp-chrome-devtools` | post-delivery console/layout verification |

### Resource Loading Contract

| Resource | Loading |
|----------|---------|
| `references/quick_reference.md` | ALWAYS |
| `references/css_patterns.md` | CONDITIONAL |
| `references/library_guide.md` | CONDITIONAL |
| `references/quality_checklist.md` | CONDITIONAL |
| `references/navigation_patterns.md` | ON_DEMAND |
| `assets/templates/*.html` | ON_DEMAND |

<!-- /ANCHOR:integration-points -->
