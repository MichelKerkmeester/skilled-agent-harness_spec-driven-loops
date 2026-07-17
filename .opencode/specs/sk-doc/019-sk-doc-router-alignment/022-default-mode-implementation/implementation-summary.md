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

## Known Limitations / Follow-ups (shared machinery — out of scope here)

- **`defaultApplied` dual-write telemetry** (`configured` vs `consulted` vs `selected`) lives in the shared scorer (`router-replay.cjs`) — needs a scorer change, not done.
- **Compressed presented-not-scored disambiguation card** — the fallback currently loads the full mode-map (`smart_routing.md` + `mode-registry.json`); a compressed card + a "present don't score" runtime contract is a refinement.
- **cli-external runtime-detection block** (auto-exclude the in-runtime CLI) — the null flip is the safe first step; the detection mechanism is deferred.
- **Live measurement** — sol-ultra's 2×4 keep-vs-null benchmark (from `021`) would turn "directional" into "measured".
