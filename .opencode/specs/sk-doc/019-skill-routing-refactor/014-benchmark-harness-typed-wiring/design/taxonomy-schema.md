# Design Note — The Unified Intent→Leaf Taxonomy (Phase 1 design-lock)

Status: draft (Phase 1 deliverable #1). No runtime is frozen or changed by this note — it is the design the Phase 3–4 rewrite implements. Authority: `decision-record.md` ADR-005.

## 1. The one decision, two lookups, one policy layer

Today two independent keyword classifiers score the same prompt and their outputs are intersected: the hub (`hub-router.json`) picks modes, the surface (`smart_routing.md`) picks leaves, and the cap keeps only leaves whose mode is in the hub set. That intersection is the zero-emission bug. ADR-005 replaces it with:

- **ONE scored decision** — `intent → leaf-pairs`, scored once against the typed taxonomy below.
- **TWO lookups** (not decisions) — `leaf → workflowMode` via `leaf-manifest.json`; `workflowMode → packet entrypoint` via `mode-registry.json`.
- **ONE policy layer** — `hub-router.json` shrinks to `{outcomes, ambiguityDelta, bundleRules, defer}`; its per-mode keyword scoring survives only as shadow telemetry.

The mode is therefore an **attribute of the selected evidence**, never an independent classification. This is the whole reason the coherence invariant is free: if the mode is read off the chosen leaves, advertised-mode == loaded-mode by construction.

## 2. The typed taxonomy format

Authored in `smart_routing.md` as a fenced, machine-parseable dict. Each intent maps to a typed pair set plus policy hints:

```
INTENT_TAXONOMY = {
  "FLOWCHART": {
    "keywords": {"owned": ["flowchart","mermaid","diagram","ascii diagram"], "shared": ["make","create"]},
    "pairs": [
      ["create-flowchart", "create-flowchart/references/notation_and_validator.md"],
      ["create-flowchart", "create-flowchart/references/worked_example.md"]
    ],
    "policyHints": {"bundle": false}
  },
  "AGENT_COMMAND": {                     # a mode-SPANNING intent
    "keywords": {"owned": ["agent","subagent","slash command"], "shared": ["make","create"]},
    "pairs": [
      ["create-agent",   "create-agent/references/..."],
      ["create-command", "create-command/references/..."]
    ],
    "policyHints": {"bundle": true, "bundleRule": "agent+command"}
  },
  "HVR": {                               # a SUB-mode intent (a slice within create-skill)
    "keywords": {"owned": ["hvr","hyphen vs snake","naming convention"], "shared": []},
    "pairs": [["create-skill", "shared/references/hvr_rules.md"]]
  },
  "FULL_INVENTORY": {                    # first-class, not a bypass flag
    "keywords": {"owned": ["everything","full inventory","all modes","load all"], "shared": []},
    "pairs": "@manifest",                # resolves by manifest enumeration at parse time
    "policyHints": {"fullInventory": true}
  }
}
```

Key properties this format buys us, none of which a mode-shaped taxonomy can express:
- **Mode-spanning intents** — `AGENT_COMMAND` legitimately emits two modes.
- **Sub-mode intents** — `HVR` selects one reference inside `create-skill`, not the whole mode.
- **First-class full inventory** — driven by an intent the production path can actually set, not a scenario-only flag.
- **Owned vs shared keywords** — the discriminator for the abstain rule (§4).

## 3. Scoring, projection, and the coherence invariant

1. Score each intent: `score = Σ owned-keyword hits · W_owned + Σ shared-keyword hits · W_shared`, `W_owned ≫ W_shared`.
2. Select intents within `ambiguityDelta` of the top (deterministic tie order — see §6), producing the union of their `pairs`.
3. Every pair's `workflowMode` is **looked up from its leaf** in `leaf-manifest.json` (never re-scored).
4. `advertisedWorkflowModes = orderedUnique(pairs[*].workflowMode)` capped at `MAX_WORKFLOW_MODES = 2` (a named `bundleRule` is the only exception).
5. **Fail-closed:** if the raw resource set is non-empty but the typed pair set is empty → **hard ERROR** (the tripwire). A silent zero is never emitted.

The hub keyword pass still runs, into `routeTelemetry.hubIntents` only, feeding the `intentRecall` / `hubRoute` scorer dimensions. It gates nothing.

## 4. Abstain vs guess (the backstop for making the surface authoritative)

Making the surface taxonomy authoritative raises its blast radius; the abstain rule bounds it. A win is **discriminative** only if the top intent matched ≥1 of its `owned` keywords. If the top intent's score comes **only from `shared` keywords** (bare `create`/`make`/`new`), the router does not guess — it routes to `UNKNOWN_FALLBACK` and DEFERs:

- Honor `defaultMode: null` + `outcomes.defer` (already declared in the hub, currently ignored).
- Emit a 2–3 option disambiguation question naming the top candidate modes and the one fact that decides.
- Never guess on shared verbs; never on JSON insertion order.

**Negation guard:** a negator (`don't`, `no`, `without`, `not`) within N tokens (proposal: N=3) before a keyword suppresses that hit — `"don't create a changelog, just explain it"` must not fire `CHANGELOG`.

## 5. Worked cases (must hold after Phase 5)

| Prompt | Today | Under the taxonomy |
|--------|-------|--------------------|
| "make an ascii diagram of the approval loop" | hub → `[create-skill,create-skill-parent]`; flowchart leaves filtered → **0 pairs** | `FLOWCHART` (owned: "ascii diagram","diagram") → 2 flowchart pairs; advertised mode `create-flowchart` | 
| "scaffold a new agent and its command" | hub over-selects create-skill → drops one or both | `AGENT_COMMAND` → `[create-agent, create-command]`, bundleRule permits 2 modes |
| "load the full sk-doc inventory" | hub empty → `[]` → **111 → 0** | `FULL_INVENTORY` intent → `@manifest` enumeration; SD-015 two gold surfaces |
| "create something" (bare) | guesses create-skill | shared-only → **DEFER** with a disambiguation question |
| "don't create a changelog, explain it" | fires CHANGELOG | negation guard suppresses → no CHANGELOG pair |

## 6. Determinism, coverage, and the dead tieBreak

- **Deterministic order** — ties break by a documented policy (proposal: descending owned-keyword count, then lexicographic mode id). This replaces the dead `routerPolicy.tieBreak` that `parent_hub_router_schema.md` §7 promises but the code never reads; Phase 8 reconciles the doc to whatever order Phase 4 implements.
- **Coverage** — every mode in `mode-registry.json` must be reachable by ≥1 intent. The collapse surfaces three modes with no current surface intent: `create-benchmark`, `create-diff`, `create-skill-parent`. Phase 3 authors intents for them; Phase 8's coverage lint fails if any mode is unreachable.
- **Vocab-class hygiene** — no keyword class may be referenced by more than ~2 sibling intents; hub-wide verbs (`create`/`make`/`new`) live only in the `shared` bucket (which cannot, alone, win — see §4), never as an owned discriminator.

## 7. Open design questions (for Phase 3, some may want operator input)

1. **`W_owned : W_shared` ratio and `ambiguityDelta`** — need values that keep the aligned fixtures resolving while making shared-only wins fall below the abstain threshold. Tuned against the frozen fixtures, then validated on the sealed holdout (never the reverse).
2. **`smart_routing.md` authored format** — extend the existing `INTENT_SIGNALS`/`RESOURCE_MAP` fences into this typed dict, or add a new `INTENT_TAXONOMY` fence and derive the legacy fences from it for one release? (Leaning: single `INTENT_TAXONOMY` as source of truth, legacy fences generated, to avoid a third hand-maintained copy.)
3. **Negation window N** — 3 tokens is a proposal; the holdout's negation cluster calibrates it.
4. **bundleRules registry** — which cross-mode bundles are sanctioned (`agent+command`, `skill+quality-control`, `create+changelog`?) is a small authored allow-list; needs enumeration in Phase 3.
