---
title: "Figma (mcp-figma) Router"
description: "Sibling router for mcp-figma: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-figma router"
  - "mcp-figma routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Figma (mcp-figma) Router

The machine router for [`SKILL.md`](../../../.skilled/skills/mcp-tooling/mcp-figma/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request that names `figma`, `figma-ds-cli`, Figma Desktop, rendering in Figma, tokens and variables, an extract to DESIGN.md, an export, a connect or a daemon reaches mcp-figma, and this router picks from the CLI command reference, the command-gating taxonomy, the optional MCP wiring, the troubleshooting reference and the paste-ready MCP assets rather than from the whole folder. Design context pulled through an opt-in Figma MCP loads the wiring doc and the paste-ready assets on top of the CLI baseline, so the MCP path never replaces the transport every other route reads. A request whose keywords barely score loads nothing and asks a disambiguation checklist instead of guessing.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **CREATE_RENDER** — "render / create / frame / component / icon / layout / draw / mockup / wireframe / prototype / artboard" requests load `references/figma-cli-reference.md` and `references/tool-surface.md`. "button", "generate", "sketch", "card", "import" and "build" sit in the same keyword set, so any one of them fires this intent alone.
- **DESIGN_SYSTEM_TOKENS** — "token / variable / var: / collection / shadcn / design system / theme / palette / tailwind" requests load `references/figma-cli-reference.md` and `references/tool-surface.md`. "style", "swatch", "typography", "spacing" and "primitive" join the same keyword set.
- **INSPECT_EXPORT** — "inspect / extract / export / screenshot / DESIGN.md / a11y / audit / storybook" requests load `references/figma-cli-reference.md` and `references/tool-surface.md`. "accessibility", "contrast", "snapshot", "properties", "svg", "png", "jsx", "download" and "capture" join the same keyword set.
- **CONNECT_SETUP_DAEMON** — "connect / safe / patch / unpatch / daemon / diagnose / reconnect / setup / set up / restart" requests load `references/figma-cli-reference.md` and `references/troubleshooting.md`. "install", "bridge", "plugin" and "health" join the same keyword set.
- **MCP_CONTEXT** — "mcp / code mode / design context / figma-developer-mcp / framelink / utcp / get_design_context" requests load `references/mcp-wiring.md`, `assets/utcp-figma-manual.md`, `assets/env-template.md` and `references/figma-cli-reference.md`, the last one because every scored route keeps the CLI baseline. "pull" is also in that keyword set.
- **TROUBLESHOOT** — "error / failed / not connected / binary not found / unauthorized / not working / won't connect" requests load `references/troubleshooting.md` and `references/figma-cli-reference.md`. "broken", "doesn't work", "not responding", "unresponsive", "crash", "timeout", "conflict", "stuck" and "permission denied" join the same keyword set.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the direction and phase detection, the resource domains and loading levels, and the intent scoring.

### Primary Detection Signal

Detect the workflow **direction** first. Almost everything is the CLI, and the optional Figma MCP is opt-in and only when the agent must pull context FROM Figma.

```bash
# Direction detection (pseudo)
echo "$REQUEST" | grep -qiE 'mcp|code mode|design context|pull .*figma|get_design_context|figma-developer-mcp' && DIR="OPTIONAL_MCP"
# default for create/modify/export/tokens/connect/inspect:
: "${DIR:=CLI}"

# Binary detection (canonical = figma-ds-cli; figma-cli is ambiguous with an unrelated npm package)
command -v figma-ds-cli >/dev/null && BIN="figma-ds-cli"
[ -z "${BIN:-}" ] && command -v figma-cli >/dev/null && BIN="figma-cli"   # verify it's silships, not unic/figma-cli
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify the binary on PATH (figma-ds-cli, else silships figma-cli) + Figma Desktop open
    +- STEP 1: Score intent -> CREATE_RENDER | DESIGN_SYSTEM_TOKENS | INSPECT_EXPORT | CONNECT_SETUP_DAEMON | MCP_CONTEXT | TROUBLESHOOT
    +- Phase 1: Connect / daemon (safe default; yolo only on consent)            [CONNECT_SETUP_DAEMON]
    +- Phase 2: Inspect / export (read-only; explicit output paths, no overwrite) [INSPECT_EXPORT]
    +- Phase 3: Author / modify / tokens (sk-design-md-generator measured-reference pairing FIRST; MUTATING -> gate; DESTRUCTIVE -> confirm+target+rollback) [CREATE_RENDER / DESIGN_SYSTEM_TOKENS]
    +- Phase 4: Optional MCP context pull via Code Mode (Framelink figma)         [MCP_CONTEXT]
    +- Phase 5: Verify (daemon healthy, output captured, no unconfirmed mutation)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring. This skill uses a **flat intent router**: there are no keyed `references/<key>/` or `assets/<key>/` subdirectories. References are the primary loaded resources. Assets are paste-ready snippets for the optional MCP path.

```text
references/figma-cli-reference.md   # CLI/daemon/connect model + command examples
references/tool-surface.md          # read-only / mutating / destructive taxonomy + gating
references/mcp-wiring.md            # optional Figma MCP (Framelink) via Code Mode
references/troubleshooting.md       # failure modes + fixes
assets/utcp-figma-manual.md         # paste-ready Framelink figma .utcp_config.json manual + .env note
assets/env-template.md              # the prefixed figma_FIGMA_API_KEY .env line
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| ALWAYS (scored routes) | Every scored route (declared per intent in RESOURCE_MAP) | `references/figma-cli-reference.md` (binary/daemon/connect baseline) |
| CONDITIONAL | Author/modify/tokens intent | `references/tool-surface.md` (gating taxonomy) |
| CONDITIONAL | MCP_CONTEXT intent | `references/mcp-wiring.md` (Code Mode Framelink path) |
| CONDITIONAL | Setup / error intent | `references/troubleshooting.md` |
| FALLBACK | Zero-score routes only | `references/figma-cli-reference.md` suggested (never auto-loaded) |
| ALWAYS (design work) | A read/export feeds a design decision, OR an author/modify/token path will create or change design artifacts (render, create, bind, variants, tokens) | `sk-design-md-generator` measured Style Reference (extracted design tokens), applied before deciding or authoring |

### Smart Router Pseudocode

> Resilience pattern: see the sk-doc smart-router template, `sk-doc/sk-create-skill/assets/skill/skill-smart-router.md` in the skills library. Guard paths, discover at runtime, score intents, and fall back when unsure. Because this skill has no keyed resource subdirectories, intent selects from the flat resource inventory below.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/figma-cli-reference.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"
MIN_CONFIDENCE = 1
AMBIGUITY_DELTA = 1

INTENT_MODEL = {
    "CREATE_RENDER":        {"keywords": [("create", 3), ("render", 4), ("frame", 3), ("component", 3), ("icon", 3), ("layout", 3), ("import", 3), ("build", 3), ("draw", 3), ("mockup", 3), ("wireframe", 3), ("prototype", 3), ("artboard", 3), ("button", 2), ("generate", 3), ("sketch", 2), ("card", 2)]},
    "DESIGN_SYSTEM_TOKENS": {"keywords": [("token", 4), ("variable", 4), ("var:", 4), ("collection", 3), ("shadcn", 3), ("design system", 4), ("theme", 3), ("palette", 3), ("style", 2), ("swatch", 3), ("typography", 3), ("spacing", 3), ("tailwind", 3), ("primitive", 2)]},
    "INSPECT_EXPORT":       {"keywords": [("inspect", 3), ("extract", 4), ("export", 4), ("screenshot", 3), ("DESIGN.md", 4), ("a11y", 3), ("audit", 3), ("accessibility", 3), ("contrast", 2), ("snapshot", 3), ("properties", 2), ("svg", 2), ("png", 2), ("storybook", 3), ("jsx", 2), ("download", 3), ("capture", 2)]},
    "CONNECT_SETUP_DAEMON": {"keywords": [("connect", 4), ("safe", 3), ("patch", 4), ("unpatch", 4), ("daemon", 4), ("diagnose", 3), ("reconnect", 3), ("setup", 3), ("set up", 3), ("install", 2), ("bridge", 2), ("plugin", 2), ("restart", 3), ("health", 2)]},
    "MCP_CONTEXT":          {"keywords": [("mcp", 4), ("code mode", 4), ("design context", 4), ("figma-developer-mcp", 4), ("pull", 2), ("framelink", 4), ("utcp", 3), ("get_design_context", 4)]},
    "TROUBLESHOOT":         {"keywords": [("error", 4), ("failed", 4), ("not connected", 4), ("binary not found", 4), ("unauthorized", 3), ("broken", 3), ("not working", 4), ("doesn't work", 4), ("won't connect", 4), ("not responding", 3), ("unresponsive", 3), ("crash", 3), ("timeout", 3), ("conflict", 3), ("stuck", 3), ("permission denied", 3)]},
}

# Mirror of INTENT_MODEL in the standard {weight, keywords} shape that
# INTENT_SIGNALS parsers read (the tuple form above parses to zero intents
# there). Runtime scoring uses INTENT_MODEL; this block changes no routing.
# Per-intent weight = the MAX per-keyword weight in INTENT_MODEL for that intent
# (all six resolve to 4). Keys and keywords stay identical to INTENT_MODEL — a
# key-sync test fails closed if the two blocks ever drift apart.
INTENT_SIGNALS = {
    "CREATE_RENDER":        {"weight": 4, "keywords": ["create", "render", "frame", "component", "icon", "layout", "import", "build", "draw", "mockup", "wireframe", "prototype", "artboard", "button", "generate", "sketch", "card"]},
    "DESIGN_SYSTEM_TOKENS": {"weight": 4, "keywords": ["token", "variable", "var:", "collection", "shadcn", "design system", "theme", "palette", "style", "swatch", "typography", "spacing", "tailwind", "primitive"]},
    "INSPECT_EXPORT":       {"weight": 4, "keywords": ["inspect", "extract", "export", "screenshot", "DESIGN.md", "a11y", "audit", "accessibility", "contrast", "snapshot", "properties", "svg", "png", "storybook", "jsx", "download", "capture"]},
    "CONNECT_SETUP_DAEMON": {"weight": 4, "keywords": ["connect", "safe", "patch", "unpatch", "daemon", "diagnose", "reconnect", "setup", "set up", "install", "bridge", "plugin", "restart", "health"]},
    "MCP_CONTEXT":          {"weight": 4, "keywords": ["mcp", "code mode", "design context", "figma-developer-mcp", "pull", "framelink", "utcp", "get_design_context"]},
    "TROUBLESHOOT":         {"weight": 4, "keywords": ["error", "failed", "not connected", "binary not found", "unauthorized", "broken", "not working", "doesn't work", "won't connect", "not responding", "unresponsive", "crash", "timeout", "conflict", "stuck", "permission denied"]},
}

RESOURCE_MAP = {
    "CREATE_RENDER":        ["references/figma-cli-reference.md", "references/tool-surface.md"],
    "DESIGN_SYSTEM_TOKENS": ["references/figma-cli-reference.md", "references/tool-surface.md"],
    "INSPECT_EXPORT":       ["references/figma-cli-reference.md", "references/tool-surface.md"],
    "CONNECT_SETUP_DAEMON": ["references/figma-cli-reference.md", "references/troubleshooting.md"],
    "MCP_CONTEXT":          ["references/mcp-wiring.md", "assets/utcp-figma-manual.md", "assets/env-template.md", "references/figma-cli-reference.md"],
    "TROUBLESHOOT":         ["references/troubleshooting.md", "references/figma-cli-reference.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the direction: drive the CLI (default) or pull context via the optional Figma MCP",
    "Confirm figma-ds-cli is on PATH (NOT the unrelated npm 'figma-cli') and Figma Desktop is open",
    "For any author/modify/delete, confirm the target node/file and that a mutation is intended",
    "For destructive verbs, confirm an explicit target and a one-line rollback before running",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)               # raises if path escapes the skill
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def classify_intents(request: str):
    text = (request or "").lower()
    scores = {i: 0 for i in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw, w in cfg["keywords"]:
            if kw in text:
                scores[intent] += w
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    primary, top = ranked[0]
    if top == 0:
        return (None, None, scores)   # unrouted -> no intent selected; fallback branch disambiguates
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_figma_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [i for i in (primary, secondary) if i]
    loaded, seen, notices = [], set(), []

    def load_if_available(rel: str) -> bool:
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)
            return True
        if guarded not in inventory:
            notices.append(f"Resource not found in inventory: {guarded}")
        return False

    if max(scores.values() or [0]) < MIN_CONFIDENCE:
        # Fallback-only: nothing is loaded on a zero-score route; the default
        # reference is offered as a suggestion beside the disambiguation ask.
        return {"intents": intents, "load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
                "suggested_fallback": DEFAULT_RESOURCE, "resources": loaded, "notices": notices}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded, "notices": notices}
```
