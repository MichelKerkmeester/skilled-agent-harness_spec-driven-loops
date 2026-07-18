---
title: "Implementation Summary: defaultMode Policy Implementation"
description: "Four hubs flipped to defaultMode null with a routing-helper fallback; sk-design's hub-identity over-emission fixed; sk-prompt kept. Config-only, reversible, gated — route-gold held every baseline. Canon gained a third defer-routed archetype. Shared-machinery items (telemetry, compressed card, cli detection) flagged as follow-ups. Executor: GPT-5.6-SOL high fast, independently verified."
trigger_phrases:
  - "default mode implementation summary"
  - "hubs flipped to null default done"
  - "sk-design over-emission fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/022-default-mode-implementation"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Flipped 4 hubs to defaultMode null + routing-helper fallback, fixed sk-design over-emission, added defer-routed canon archetype; route-gold held all baselines"
    next_safe_action: "Shared-machinery follow-ups: defaultApplied dual-write telemetry, compressed presented-not-scored card, cli-external runtime detection"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The defaultMode flips do not move route-gold (the gate does not score the default on zero-signal), so gating was clean"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: defaultMode Policy Implementation

---

## What Was Built

Applied the vetted `defaultMode` recommendations from research packet `021` — **config-only, reversible, gated**.

1. **Four hubs flipped to defer-routed** (`908efde8d8`): `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-design` each got `defaultMode: null` and `defaultResource: ["shared/references/smart_routing.md", "mode-registry.json"]` (the routing helper / mode-map). A zero-signal request now defers and is pointed at *how to choose a mode*, not at a guessed child. `sk-prompt` kept its `prompt-improve` default (it genuinely anchors the `hub-identity` catch-all).
2. **sk-design over-emission fixed** — `hub-identity` sat in all six modes' `classes` (the same over-emission defect the fleet route-gold program cured elsewhere; sk-design escaped only because it has no route-gold scenarios). Removed from every mode's `classes`; the class definition stays as discovery-only.
3. **Canon: third archetype** — added a **defer-routed hub** archetype to `create-skill`'s `parent_hub_router_schema.md` (null default, keyword-scored, `hub-identity` discovery-only, routing-helper fallback) so the four flipped hubs are no longer schema-orphans and future authors pick default-vs-defer deliberately.

Executor: **GPT-5.6-SOL high fast** (`codex exec`), independently verified by the parent.

## Verification

- **Route-gold held every baseline** (independent re-run): system-deep-loop 20/20, mcp-tooling 13/13, cli-external 7/7, sk-design 0/0 — all PASS. The flips don't move route-gold (the gate doesn't score the default on zero-signal), so no regression was possible or observed.
- **sk-design over-emission gone** — `router-replay` on "help me with sk-design": before, all six modes fired; after, `intents: []` / `deferReason: no-mode-scored`.
- **Telemetry reflects the flip** — `defaultApplied` now `false` (was `true`) on the flipped hubs.
- **Scope**: only the four `hub-router.json` + the canon doc + this packet. No shared benchmark/scorer machinery, no sk-prompt, all JSON parses.

## Reversibility

Originals recorded in `spec.md` §3. Any flip is undone by restoring its `defaultMode`/`defaultResource`. Confidence is directional-pending-measurement, so the changes are deliberately reversible.

## Follow-ups

### Done in the follow-up pass (2026-07-18, config-only, each route-gold-gated + reversible)

- **Compressed presented-not-scored card — DONE.** All four flipped hubs (`system-deep-loop`, `sk-design`, `mcp-tooling`, `cli-external-orchestration`) now declare `defaultResourceSemantics: "fallback-only"` + a `defaultResourceContract`, and `defaultResource` drops `mode-registry.json` (loads only the compressed `shared/references/smart_routing.md`). This stops the scorer's legacy behavior of unioning the full registry into every scored route — the exact over-emission the null default guards against. Route-gold held: sdl 99/20, sk-design 94/37, mcp 98/13, cli 90/7 — all PASS, unchanged. (mcp-tooling already had the semantics from a prior pass; it only needed the card swap.)
- **cli-external runtime-detection block — DONE (declarative config).** Added a `runtimeDetection` block to cli-external's `routerPolicy`: an `excludeInRuntimeMode` map (`opencode→cli-opencode`, `claude-code→cli-claude-code`, `codex→cli-codex`) plus a contract to remove the in-runtime CLI from candidates before scoring/defer, fail-open when detection is unavailable. This is the config/contract layer; the runtime enforcement that consumes the block is a separate wiring step.

### Still open

- **`defaultApplied` dual-write telemetry** (`configured` vs `consulted` vs `selected`) — **BLOCKED by a constraint conflict**: it lives in the shared scorer (`router-replay.cjs`), which the goal's own constraint says never to touch. Cannot be implemented without violating that rule; operator must resolve the conflict.
- **cli runtimeDetection runtime enforcement** — the consuming logic (actually reading the runtime + filtering candidates) is a runtime-code change, deferred beyond the config block.
- **Live measurement** — sol-ultra's 2×4 keep-vs-null benchmark (from `021`) would turn "directional" into "measured".
