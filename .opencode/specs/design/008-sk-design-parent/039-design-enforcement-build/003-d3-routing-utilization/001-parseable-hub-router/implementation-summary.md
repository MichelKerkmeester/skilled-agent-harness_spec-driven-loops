---
title: "Implementation Summary: D3-R1 Parseable hub-router projection"
description: "Post-build record for the new sk-design hub-router.json projection and the additive router-replay.cjs reader: what was built, how it was verified, the acceptance and no-regression evidence, and that this is the selection layer a later gated scorer runs against."
trigger_phrases:
  - "parseable hub router implementation summary"
  - "hub-router.json projection summary"
  - "router-replay reader build record"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/001-parseable-hub-router"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the hub-router projection build and mark the checklist verified"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-parseable-hub-router |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | `.opencode/skills/sk-design/hub-router.json` (new) + additive reader branch in `router-replay.cjs` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-design` parent hub now parses. Before this phase, `router-replay.cjs` returned `parseable:false` on the hub because its routing intent lived in prose with no inline dictionaries and no referenced routing doc, so the entire hub selection layer was unscored. This phase moves that intent into data and teaches the replay tool to read it, turning the hub from un-projectable prose into a scored, parseable router. This is the SELECTION layer that the gated hub-route scorer (a later phase) will run against.

### Sibling routing projection

A new `hub-router.json` sits beside `mode-registry.json` and carries the hub's routing decision as declarative data: a `routerPolicy` (defaultMode, ambiguityDelta, tieBreak order, and the single/orderedBundle/defer outcomes), `routerSignals` per mode (interface, foundations, motion, audit, md-generator) with mode-level weight, class list, and resource paths, and typed `vocabularyClasses` that give every previously-untyped hub keyword exactly one home. The registry stays identity-only; only the prose default and multi-axis policy moved into data.

### Additive presence-gated reader

`router-replay.cjs` gained a `projectHubRouter` helper and a new branch in `parseRouter` placed AFTER the referenced-doc attempt. The branch fires only when the inline and referenced-doc paths leave the router empty and a sibling `hub-router.json` exists, so it is a true no-op for every skill that ships no such file. When it fires it projects the sibling file into the scorer's existing `intentSignals`/`resourceMap`/`defaultResource` shape, one intent per mode with class keywords unioned and lowercased, so the existing `parseable` computation returns `true`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/hub-router.json` | Created | Declarative hub routing projection: `routerPolicy` + `routerSignals` + typed `vocabularyClasses` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modified | Surgical, presence-gated, backward-compatible `projectHubRouter` reader branch |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) authored one new data file and added one additive branch, then verified both in place. A positive acceptance replay confirmed the hub now parses and routes. A no-regression check swapped the reader in place (HEAD versus new) and diffed the parse output for the unaffected skills, confirming the new branch is a true no-op when no `hub-router.json` is present. A scope check confirmed the change set is limited to the two named files, with `mode-registry.json` and `SKILL.md` untouched, `node --check` clean, and an evergreen scan finding no spec, packet, or phase identifiers in the data file or code comments. The orchestrator re-ran the acceptance and no-regression checks independently rather than trusting the implementer's claim.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the routing policy in a sibling `hub-router.json`, not in `mode-registry.json` | Keeps the registry identity-only and gives the router a single, projectable data home |
| Gate the reader branch on `fs.existsSync(hub-router.json)` | Makes the change a true no-op for every other skill, so no-regression holds by construction |
| Insert the branch AFTER the inline and referenced-doc paths | Preserves the established precedence ladder; the sibling is only reached when both earlier paths are empty |
| Give every keyword exactly one `vocabularyClasses` home | Prevents class drift and ambiguous routing |
| Collapse typed per-class weights to the scorer's flat shape here | This phase only makes the hub parseable; the gated scorer that uses per-class weights is a later phase |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `hub-router.json` exists and is valid JSON | PASS, `.opencode/skills/sk-design/hub-router.json`, `JSON.parse` succeeds |
| Reader branch present in `router-replay.cjs` | PASS, `projectHubRouter` helper plus presence-gated `parseRouter` branch |
| `node --check router-replay.cjs` | PASS, no syntax error |
| ACCEPTANCE: `"animate the menu"` parses | PASS, `parseable:true` (was `parseable:false`) |
| ACCEPTANCE: routes to the expected mode | PASS, `intents` is `['motion']`, exit 0 |
| NO-REGRESSION: in-place HEAD-vs-new swap | PASS, sk-code, design-interface, and sk-doc parse identically before and after |
| NO-REGRESSION: routing still discriminates | PASS, sk-code routes to `IMPLEMENTATION`, design-interface to `DESIGN_PRINCIPLES` |
| Scope clean (only the two named files) | PASS, `mode-registry.json` and `SKILL.md` untouched per `git status` |
| Evergreen scan (no spec/packet/phase IDs) | PASS, no identifiers or `specs/` paths in the data file or code comments |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Selection layer only, scorer not built.** This phase makes the hub parseable and routable; the gated hub-route scorer that consumes the typed per-class weights is a later phase and is out of scope here.
2. **Per-class weights are carried but not scored.** `vocabularyClasses` retains typed classes for the future scorer, but this projection collapses them to the scorer's flat `{weight, keywords}` shape, so per-class weighting has no runtime effect yet.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Selection-layer build record for the sk-design hub-router.json projection and the additive router-replay.cjs reader
-->
