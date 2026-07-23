---
title: "Implementation Summary: defaultMode Policy Implementation"
description: "Four hubs flipped to defaultMode null with a routing-helper fallback; sk-design's hub-identity over-emission fixed; sk-prompt kept. Config-only, reversible, gated — route-gold held every baseline. Canon gained a third defer-routed archetype."
trigger_phrases:
  - "default mode implementation summary"
  - "hubs flipped to null default done"
  - "sk-design over-emission fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/003-default-mode-implementation"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Flipped 4 hubs to defaultMode null + routing-helper fallback; sk-design fixed"
    next_safe_action: "Open follow-ups: defaultApplied telemetry (blocked), cli runtime enforcement, live measurement"
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

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-default-mode-implementation |
| **Status** | Complete (config-only, reversible, gated) |
| **Completed** | 100% — 4 flips + sk-design fix + canon archetype landed; follow-up card + cli-detection config landed |
| **Level** | 2 |
| **Executor** | GPT-5.6-SOL high fast (independently verified) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Applied the vetted `defaultMode` recommendations from research packet `021` — **config-only, reversible, gated**.

1. **Four hubs flipped to defer-routed** (`908efde8d8`): `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-design` each got `defaultMode: null` and `defaultResource: ["shared/references/smart_routing.md", "mode-registry.json"]` (the routing helper / mode-map). A zero-signal request now defers and is pointed at *how to choose a mode*, not at a guessed child. `sk-prompt` kept its `prompt-improve` default (it genuinely anchors the `hub-identity` catch-all).
2. **sk-design over-emission fixed** — `hub-identity` sat in all six modes' `classes` (the same over-emission defect the fleet route-gold program cured elsewhere; sk-design escaped only because it has no route-gold scenarios). Removed from every mode's `classes`; the class definition stays as discovery-only.
3. **Canon: third archetype** — added a **defer-routed hub** archetype to `create-skill`'s `parent_hub_router_schema.md` (null default, keyword-scored, `hub-identity` discovery-only, routing-helper fallback) so the four flipped hubs are no longer schema-orphans and future authors pick default-vs-defer deliberately.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed by **GPT-5.6-SOL high fast** (`codex exec`), one hub at a time, each change config-only and reversible, and each gated on route-gold staying green. The parent independently re-ran the route-gold gate per hub and scope-checked every diff. A follow-up pass (2026-07-18) added the compressed presented-not-scored card (`defaultResourceSemantics: "fallback-only"` + `defaultResourceContract`, dropping `mode-registry.json` from the scored union) and a declarative `runtimeDetection` config block on cli-external — both config-only, route-gold-gated, and reversible.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flip 4 hubs to `defaultMode: null`, keep sk-prompt | Four defaults contradicted authored defer behaviour or were vestigial; sk-prompt genuinely anchors the `hub-identity` catch-all |
| Fallback loads the routing helper, never a guessed child | A zero-signal request should be pointed at *how to choose*, not silently committed to one mode |
| Config-only + reversible, gated on route-gold | Confidence is directional-pending-measurement, so every change is undoable from recorded originals |
| Add a defer-routed archetype to the create-skill canon | The four flipped hubs were schema-orphans; the canon now lets authors pick default-vs-defer deliberately |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Route-gold held every baseline** (independent re-run): system-deep-loop 20/20, mcp-tooling 13/13, cli-external 7/7, sk-design 0/0 — all PASS. The flips do not move route-gold (the gate does not score the default on zero-signal), so no regression was possible or observed.
- **sk-design over-emission gone** — `router-replay` on "help me with sk-design": before, all six modes fired; after, `intents: []` / `deferReason: no-mode-scored`.
- **Telemetry reflects the flip** — `defaultApplied` now `false` (was `true`) on the flipped hubs.
- **Scope**: only the four `hub-router.json` + the canon doc + this packet. No shared benchmark/scorer machinery, no sk-prompt, all JSON parses.
- **Reversibility**: originals recorded in `spec.md` §3; any flip is undone by restoring its `defaultMode`/`defaultResource`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **`defaultApplied` dual-write telemetry** (`configured` vs `consulted` vs `selected`) is **BLOCKED by a constraint conflict**: it lives in the shared scorer (`router-replay.cjs`), which the goal's own constraint says never to touch. It needs an operator decision to resolve.
- **cli runtimeDetection runtime enforcement** — the consuming logic (reading the runtime + filtering candidates) is a runtime-code change, deferred beyond the config block.
- **Live measurement** — a sol-ultra 2x4 keep-vs-null benchmark (from `021`) would turn "directional" into "measured"; not yet run.
<!-- /ANCHOR:limitations -->
