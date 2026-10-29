---
title: "Code Quality (quality) Router"
description: "Sibling router for sk-code-quality: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-code-quality router"
  - "sk-code-quality routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Code Quality (quality) Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this mode when they ask for the post-implementation quality gate, the P0/P1/P2 author checks, comment hygiene, a SKILLED or surface authoring checklist for `.skilled/`, `specs/` or MCP server source, or a check before done. It routes by target path more than by keyword, because the checklists a change needs follow the files it touches, and `node scripts/quality-gate.cjs --explain <path>` outranks any keyword match. It selects from three resource families: this mode's own doctrine under `references/`, starting at `references/runner-contract.md`, `../shared/references/universal/code-quality-standards.md` and `references/code-style-guide.md`; the surface and language checklists under `../sk-code-skilled/assets/checklists/`; and the runner with `assets/quality-defaults.json` and the scripts this mode owns.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`QUALITY`** fires on `quality gate`, `comment hygiene`, `p0 p1 p2`, `code smell`, `dist staleness`, `naming`, `standards`, `checklist`, `author quality gate`, `envelope`, `restraint` and `yagni` at weight 1, the packet's only key. It loads `references/quality-config.md`, on top of the three `DEFAULT_RESOURCE` files every run loads: `references/runner-contract.md`, `../shared/references/universal/code-quality-standards.md` and `references/code-style-guide.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic route map, its thin prompt-intent projection and the call sequence that reads them.

### Primary Detection Signal

Surface identity is resolved once by the parent shared router. This mode consumes that result and then routes by target path and quality intent:

```text
QUALITY TASK
    |
    +- Surface identity -> ../shared/references/stack-detection.md
    +- Phase lifecycle  -> ../shared/references/phase-detection.md
    +- Resource routing -> ../ROUTER.md
    |
    +- Quality runner     -> node scripts/quality-gate.cjs (one verdict for the change)
    |     +- any surface  -> the universal floor plus the runner's built-in checks
    |     +- UNKNOWN      -> the floor plus the runner's checks, with `unknown` recorded
    |
    +- SKILLED target    -> ../sk-code-skilled/assets/checklists/<target-checklist>.md
    +- Comment hygiene    -> scripts/check-comment-hygiene.sh, called once by the runner
    +- Dist staleness     -> scripts/check-dist-staleness.sh when generated artifacts are involved
```

### Phase Detection

```text
Phase 1 Implementation writes or changes files
    -> Phase 1.5 Code Quality Gate runs here
        -> run node scripts/quality-gate.cjs and read its gate
        -> load every checklist the verdict lists before any completion claim
        -> the runner calls comment hygiene once over every modified file
        -> apply P0/P1/P2 author checks and judge the judgment_required items
        -> edit in place only for gate failures
    -> Phase 2 Debugging if checks expose a failing symptom
    -> Phase 3 Verification after the gate is clean enough to verify
```

### Thin Prompt-Intent Projection

sk-code-quality routes primarily by TARGET PATH (the checklists `--explain` names for a file), not by prompt keywords. Its parent-to-child discoverability is the hub `quality` signal. This thin prompt-intent projection deliberately does not model the path-keyed dispatch.

```python
# Thin prompt-intent router: sk-code-quality owns a single routable checklist. Its
# real routing is target-path-keyed (the checklists --explain names), and its parent
# discoverability is the hub quality signal. This block only made the one asset
# scoreable by the retired deterministic router-replay.
DEFAULT_RESOURCE = [
    "references/runner-contract.md",
    "../shared/references/universal/code-quality-standards.md",
    "references/code-style-guide.md",
]

INTENT_SIGNALS = {
    "QUALITY": {"weight": 1, "keywords": ["quality gate", "comment hygiene", "p0 p1 p2", "code smell", "dist staleness", "naming", "standards", "checklist", "author quality gate", "envelope", "restraint", "yagni"]},
}

RESOURCE_MAP = {
    "QUALITY": [
        "references/quality-config.md",
    ],
}
```

### Call Sequence

```text
discover_markdown_resources()
    -> _guard_in_skill() + load_if_available()
    -> score_intents()/select_intents() for the thin QUALITY projection
    -> get_routing_key() from target path, then select the path-keyed checklist
    -> UNKNOWN_FALLBACK when no routable target path is available
```

The declarations behind `--explain` stay authoritative, and the runner reads them directly. One `--explain` call takes several paths.
Each file's entry lists its `surfaces`, the folder each surface loads from in `surface_skills`, the `source` seat that declared each checklist and that checklist's parsed `## Rule overrides` rows, and a single path prints the same fields at the top level.
The prompt-intent projection only makes the default quality resources scoreable.
