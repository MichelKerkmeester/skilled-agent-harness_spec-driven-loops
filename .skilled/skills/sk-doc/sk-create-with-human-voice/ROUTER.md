---
title: "create-with-human-voice Router"
description: "Sibling router for sk-create-with-human-voice: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-with-human-voice router"
  - "sk-create-with-human-voice routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# create-with-human-voice Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request that names the Human Voice Rules, a voice pass, a rewrite in human voice or `/create:with-human-voice` reaches this packet, and so does a draft someone calls machine-written and a passage someone wants scored without edits. The resource families split with the operation: `apply` edits, so it reaches the scope gate, the scoring arithmetic and the report template, while `score` reports and stops at the scope gate and the arithmetic. `references/hvr-rules.md` sits outside both, because the scanner parses it on every run.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **APPLY** fires on "apply human voice", "rewrite in human voice", "make this sound human", "remove ai tells", "de-ai the writing" and "voice pass", at weight 5. It loads `references/scope-and-exemptions.md`, `references/scoring-and-verification.md` and `assets/voice-report-template.md`.
- **SCORE** fires on "sounds ai-generated", "reads like ai wrote it", "ai writing tells", "how does this score" and "human voice rules", at weight 4. It loads `references/scope-and-exemptions.md` and `references/scoring-and-verification.md`.

A request that scores below 4 on both keys loads `references/scope-and-exemptions.md` alone and returns `UNKNOWN_FALLBACK` with the checklist in the block below, because what may be touched is worth answering before the operation settles. The loading-levels table adds `references/hvr-rules.md` on every path, and `references/hvr-publish-supplement.md` when a document is scored or published.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's family boundary, its resource domains, its loading levels, its prompt-intent projection and the call sequence that reads them.

### Family Boundary

This is a nested workflow packet under `sk-doc`. It has no packet-local
`graph-metadata.json`, and the advisor identity lives at the hub root. Two operations
route here: `apply`, which edits, and `score`, which reports and does not.

### Resource Domains

- `references/scope-and-exemptions.md` - which spans the standard governs. Always first.
- `references/scoring-and-verification.md` - pass order, precedence arithmetic, bands, and the re-scan.
- `assets/voice-report-template.md` - the shape of the result.
- `scripts/hvr_scan.py` - the mechanical pass. Parses the standard at run time.
- `references/hvr-rules.md` - the base, what a reply loads. Referenced, never copied.
- `references/hvr-publish-supplement.md` - the supplement, what a published document adds. Loaded after the base when a document is scored or published.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | `references/scope-and-exemptions.md` |
| ALWAYS | Every invocation | `references/hvr-rules.md` |
| CONDITIONAL | A document is being scored or published | `references/hvr-publish-supplement.md` |
| CONDITIONAL | A score is being computed or quoted | `references/scoring-and-verification.md` |
| CONDITIONAL | A result is being reported | `assets/voice-report-template.md` |

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only
what exists, scores the two operations, and returns a disambiguation checklist rather
than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/scope-and-exemptions.md"

INTENT_MODEL = {
    "APPLY": {"weight": 5, "keywords": ["apply human voice", "rewrite in human voice", "make this sound human", "remove ai tells", "de-ai the writing", "voice pass"]},
    "SCORE": {"weight": 4, "keywords": ["sounds ai-generated", "reads like ai wrote it", "ai writing tells", "how does this score", "human voice rules"]},
}
RESOURCE_MAP = {
    "APPLY": ["references/scope-and-exemptions.md", "references/scoring-and-verification.md", "assets/voice-report-template.md"],
    "SCORE": ["references/scope-and-exemptions.md", "references/scoring-and-verification.md"],
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target: a file path, or the passage to work on",
    "Confirm the operation: apply (edits the text) or score (reports only)",
    "Confirm which spans are quoted, generated or otherwise out of scope",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_voice_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    # The scope gate loads on every path. Deciding what may be touched comes
    # before deciding what to change, and before quoting any number.
    load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                       # Tier 1: unclear operation
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

An unclear operation returns the checklist with the scope gate already loaded, because
the question of what may be touched is worth answering even when the operation is not yet
settled.
