---
title: system-deep-loop Surface Router — per-mode leaf sets
description: First-class surface router document at the system-deep-loop hub root (ROUTER.md). hub-router.json selects the workflow mode; this doc maps a request's deep-loop intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs. Relocated verbatim from shared/references/smart-routing.md (v1.0.0.0) as the ROUTER.md consolidation pattern.
trigger_phrases:
  - "system-deep-loop smart routing"
  - "deep-loop surface router"
  - "deep-loop leaf routing"
  - "deep-loop resource map"
importance_tier: important
contextType: general
version: 1.6.5.0
router_state: active
skill_pointer: SKILL.md
---

# system-deep-loop Surface Router — per-mode leaf sets

## 1. OVERVIEW

This is system-deep-loop's second-layer (surface) router, first-class at the hub root
as `ROUTER.md`. The hub selects a
workflow mode in [`hub-router.json`](../../../.skilled/skills/system-deep-loop/hub-router.json) (`research`,
`review`, `ai-council`); this doc
maps a request's deep-loop intent to the exact packet-local leaf resources that
mode should load. Every path is packet-qualified (`<packet>/references|assets/…`,
where `<packet>` is the mode's `mode-registry.json` `packet` field) and converts
to the canonical `(workflowMode, leafResourceId)` pair at the one contract
boundary (`sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 2. INTENT MODEL

- **research leaves** — the deep-research loop protocol, externalized state, and
  convergence references a `/deep:research` iteration loads.
- **review leaves** — the deep-review loop protocol, completion criteria, and
  convergence references a `/deep:review` audit loop loads.
- **ai-council leaves** — the council loop protocol, scoring rubric, and output
  schema a multi-seat deliberation loads.

A bare deep-loop identity term (e.g. "deep loop") names no mode, so it fires no
intent and falls back to the hub default (disambiguation).

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is
the human-facing contract; this block is the byte-for-byte source the
deterministic router-replay parses. Keep them in sync: when a map row changes
above, update the matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path
resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to
a canonical typed pair.

```python
# No always-loaded preamble: deep-loop routing loads only the selected mode's
# leaves so the hub default route stays minimal (disambiguation on no match).
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "RESEARCH":          {"weight": 4, "keywords": ["deep research", "iterative investigation", "research loop", "research summary", "investigate why", "autoresearch", "research convergence", "deep-research", "iterative investigation workflow", "research convergence detection", "iterative-research"]},
    "REVIEW":            {"weight": 4, "keywords": ["deep-review", "deep review of", "before running deep review", "review request", "review loop", "iterative review", "severity findings", "release readiness", "review convergence", "audit the diff", "deep review", "iterative review loop", "severity weighted findings", "convergence review", "release-readiness", "deep-review wave"]},
    "AI_COUNCIL":        {"weight": 4, "keywords": ["ai council", "council deliberation", "multi-seat", "planning council", "council convergence", "seat diversity", "deep-ai-council", "ai council deliberation", "multi-seat planning council"]}
}

RESOURCE_MAP = {
    "RESEARCH": [
        "deep-research/references/protocol/loop-protocol.md",
        "deep-research/references/state/state-jsonl.md",
        "deep-research/references/convergence/convergence.md"
    ],
    "REVIEW": [
        "deep-review/references/protocol/loop-protocol.md",
        "deep-review/references/protocol/completion-criteria.md",
        "deep-review/references/convergence/convergence.md"
    ],
    "AI_COUNCIL": [
        "deep-ai-council/references/integration/loop-protocol.md",
        "deep-ai-council/references/scoring/scoring-rubric.md",
        "deep-ai-council/references/structure/output-schema.md"
    ]
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit.
- No keyword match is the hub's UNKNOWN fallback: confirm the target deep-loop
  mode before loading anything.

---

## 5. MACHINE ROUTER

The hub's routing prose, moved here from `SKILL.md` so the skill body keeps only the pointer. It sits last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 3 stays the only replay source.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `system-deep-loop`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Surface Router — per-mode leaf sets

Stage 2 of routing lives in section 3 of this file. It defines three things:
- The per-mode leaf-intent model: the research loop protocol/state/convergence leaves, the review loop protocol/completion/convergence leaves, and the ai-council loop protocol/scoring/output-schema leaves.
- The machine-readable `DEFAULT_RESOURCE` / `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay and benchmarks parse.
- The how-to-read rules: a dominant intent → one leaf set; near-tied intents → deduped union; no keyword match → hub `defer`, never a silent default to a mode.

Every `RESOURCE_MAP` path is packet-qualified and converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

This router stays a separate document from `SKILL.md` on purpose; [the parent-skill reference](../../../.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md#why-the-leaf-router-stays-in-routermd) gives the reason once.

This hub is an intent/registry router, not a keyed resource-discovery router.
At runtime, it omits `discover_markdown_resources` and only guards registry-selected packet loads.
It never selects hub-level `references/<key>/` or `assets/<key>/` resources by runtime key.
It also carries a second-layer surface router in section 3 of this file.
That router is a benchmark/replay artifact, mirroring sk-prompt/sk-code. It maps a resolved mode's intent to packet-qualified child leaves so router-replay can emit canonical `{workflowMode, leafResourceId}` typed pairs against `leaf-manifest.json`.
The surface layer never re-decides the mode and is not a runtime hub discovery surface.
The hub still routes by `workflowMode` through `mode-registry.json` alone.

### Note on the `allowed-tools` grant in `SKILL.md`'s frontmatter

The hub's own routing logic is read-only: it classifies, guards a path and loads a packet.
Under the two-axis hub canon contract, a hub's `allowed-tools` list MUST equal the exact union of every registered mode's `toolSurface.allowed` in `mode-registry.json`.
This hard invariant is enforced by `parent-skill-check.cjs` (check 3j: "hub allowed-tools equals the union of mode tool surfaces").
Narrowing `SKILL.md`'s frontmatter grant to what routing-only logic needs would fail that check.
It would also break every mode whose `toolSurface` is not a subset of the narrowed list.
Treat the breadth of `allowed-tools` as evidence of the child modes' combined needs, not of mutating logic living in the hub.

### The three-tier discriminator
- **`workflowMode`** — the public active mode key: `research`, `review`, and `ai-council`.
- **`runtimeLoopType`** — the graph-backed convergence key consumed by `runtime/scripts/convergence.cjs` (validated against active `research|review|council`). **Explicit `null` for custom backends; never inferred from `workflowMode`.** Note `ai-council` maps to `runtimeLoopType: council`.
- **`backendKind`** — which backend runs the mode: `runtime-loop-type` (research/review/ai-council).

### Routing rule
```
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is research, review, or ai-council work",
    "Confirm the target artifact: research.md, a review verdict, or ai-council deliberation artifacts",
    "Confirm the matching /deep:* command or agent type when one is already known",
    "Confirm the backend expectations: runtimeLoopType (research/review/council)",
]

classify the request to a workflowMode (dominant deep-loop intent; mode hint like "research: ..." overrides)
guard mode-registry.json inside SKILL_ROOT and read it as data
if classifier confidence is low or no mode dominates:
  → return UNKNOWN_FALLBACK with disambiguation_checklist = UNKNOWN_FALLBACK_CHECKLIST
else:
  → resolve workflowMode from the hint / classified intent (or the /deep:* command / advisor alias)
  → find registry[mode]; if missing, return UNKNOWN_FALLBACK instead of loading a guessed path
  → guard registry[mode].packet/SKILL.md inside SKILL_ROOT and load it only if the packet directory and SKILL.md both exist
       e.g. registry["research"].packet → system-deep-loop/deep-research/SKILL.md
  → if registry[mode].runtimeLoopType !== null: backend = convergence.cjs --loop-type <runtimeLoopType>
```

Before router-driven loads call `load()`, use `_guard_in_skill(relative_path)`.
Reject paths that escape this skill or do not end in `.md`.
Before loading, check `if packet_base.exists()` and `if packet_skill.exists()`.
The fallback must name the unresolved `workflowMode` when known and avoid loading any guessed packet.
Ask the operator to provide one of the registered modes or the matching `/deep:*` command.

Intent classification favors the single dominant active deep-loop mode.
A mode hint (`research: ...`, `review: ...`, `ai-council: ...`) overrides the classifier.
The legacy advisor projection maps stay hardcoded and drift-guarded against the registry.
The command files remain static routers with hardcoded asset/mode routing. Neither resolves from `mode-registry.json` at runtime, but both stay equal to its projection.

Per-mode behavior is **not flattened**.
Each active packet keeps its own convergence math, state shape, artifacts and tool-permission guards. Research has WebFetch; review/ai-council are code/inward-only.
This hub preserves exactly one `graph-metadata.json`, so the advisor discovers exactly one skill identity.
That remains true whether a mode is reached through the hub `Skill()`, a `/deep:*` command or an agent.
