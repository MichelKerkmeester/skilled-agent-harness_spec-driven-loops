---
title: "Implementation Summary: Making the Chart Mode Reachable"
description: "Registered sk-create-chart as the hub's sixteenth mode, wired both routing stages and proved each one separately. The vocabulary deliberately leaves the neighbouring diagram packet its own type names, and the canary was shown red under a withdrawn registration before it was trusted green."
trigger_phrases:
  - "chart routing integration"
  - "registered is not routed"
  - "two stage routing evidence"
  - "canary negative control"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/005-routing-integration"
    last_updated_at: "2026-09-02T07:56:52Z"
    last_updated_by: "implementation"
    recent_action: "Registered the mode, wired both routing stages and published the compiled routing"
    next_safe_action: "Proceed to phase 006, the manual testing playbook and the whole-fleet gates"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/skills/sk-doc/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-routing-integration |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A chart request now reaches the chart mode, and a check fails when it stops doing so. `sk-create-chart` is registered in `.opencode/skills/sk-doc/mode-registry.json` as the hub's sixteenth mode, both routing stages carry it, and each was exercised with real prompts rather than trusted because a registry entry exists. Registration also closed invariant 6a, which had failed since the directory appeared.

### The Vocabulary, Which Was The Design Work

The neighbouring `sk-create-diagram` names bar, line, scatter, radar, Gantt and org-chart types in its own selection guide, and the accepted overlap was the reason both live under one hub. Measurement changed what that overlap meant. None of those names carried routing vocabulary before this phase, so `make a bar chart of revenue by region` scored zero at stage two and reached nothing. Claiming the bare names would therefore have been free in routing terms and dishonest in documentation terms, because the neighbour's own guide promises them.

So the 33 keywords split three ways. Fifteen are form names that packet has no file for, such as `treemap`, `waterfall chart`, `heatmap`, `box plot`, `candlestick chart`, `donut chart`, `waffle chart`, `histogram` and `parallel coordinates`. Fifteen are explicit chart-authoring and data-visualization phrasings, such as `create a chart`, `plot the data`, `data visualization`, `chart catalog` and `standalone html chart`. Three are data-qualified crossovers, `bar chart of`, `line chart of` and `scatter plot of`, which catch a request for a data chart while leaving the bare type name with the neighbour.

Every candidate was checked in both directions against all 324 existing keywords in `hub-router.json`, `mode-registry.json` and `ROUTER.md` before a single one was written. There were zero collisions. A bare `chart` token was never a candidate, because `flowchart`, `org chart`, `gantt chart` and `radar chart` all contain it.

### The Nine Surfaces

- **`.opencode/skills/sk-doc/mode-registry.json`**: a sixteenth mode, `packetKind: workflow`, `backendKind: template-scaffold`, `command: null`, `advisorRouting.routingClass: metadata` and 33 aliases, inserted after `sk-create-diagram`.
- **`.opencode/skills/sk-doc/hub-router.json`**: a `create-chart-aliases` class holding the same 33 keywords, a `routerSignals` entry at weight 3 and a `routerPolicy.tieBreak` slot. Weight 3 matches the neighbour, and the `routerSignals` key position after it matters, because the compiled tie-break is derived from that key order rather than from the `tieBreak` array.
- **`.opencode/skills/sk-doc/ROUTER.md`**: an intent-model bullet stating which names stay with the neighbour, a `CHART` entry in `INTENT_SIGNALS`, a `CHART` entry in `RESOURCE_MAP` naming the catalog, the colour systems and the template contract, and the mode's four reference documents added to `FULL_INVENTORY`.
- **`.opencode/skills/sk-doc/graph-metadata.json`** and **`.opencode/skills/sk-doc/description.json`**: the stage-one vocabulary, which is the only path a metadata-class mode has to the advisor.
- **`.opencode/skills/sk-doc/SKILL.md`**: the mode-table row invariant 6b requires, plus every packet count corrected from fourteen to fifteen. Four enumerations there also still omitted `sk-create-frontmatter`, and leaving them would have made the new count false, so both names were added.
- **`.opencode/skills/sk-doc/leaf-manifest.json`**: regenerated with `generate-leaf-manifest.cjs --write`. Three `.gitkeep` placeholders under the mode's populated asset directories were removed first, because the generator walks every file and would otherwise have indexed them as routable leaves.
- **The mode's own `SKILL.md`, `README.md` and `references/README.md`**: all three described a report mode, gallery pages a render block is lifted from, and an empty corpus. None of that is true. Report mode is cut, one form is one file, and the corpus holds twenty forms across six families.
- **The hub canary, both its fixture and its checks**: a `single-create-chart` case, refreshed digests and refreshed live-topology counts.
- **The compiled route manifest**: refreshed in the authored tree, synced, verified and finalized.

### Both Stages, Proven Separately

Stage one, the advisor. Six chart phrasings that previously reached `sk-design`, `sk-code` or nothing at all now return `sk-doc` at confidence 0.82 to 0.9049. Stage two, the same runs carry `compiledRoute.action=route` with `targets=['sk-create-chart']`, and `router-replay.cjs` resolves `sk-create-chart/SKILL.md`, which is on disk.

A sweep of all 33 keywords ran through both stages. Stage two resolved `sk-create-chart` for all 33. Stage one initially selected `sk-doc` for 23 of them, and the ten bare fragments that returned nothing were closed by adding the nine real form names to the hub's graph metadata. One remains, the two-word fragment `chart template`, left out deliberately because it is generic enough to be worth losing.

### The Neighbours Kept Everything

Twelve neighbour phrasings and three out-of-domain phrasings were replayed at both stages, before and after. Every one resolved identically: `sk-create-diagram` still takes the sequence diagram, the flowchart, the org chart, the Gantt chart, `/create:diagram` and `/create:flowchart`, and `sk-create-readme`, `sk-create-quality-control`, `sk-create-frontmatter` and `sk-create-changelog` still take theirs. Stage-one scores moved in the fourth decimal, which is the expected effect of a larger hub corpus, and no route changed. The canary's fifteen pre-existing single-route cases also still resolve to their own modes.

### A Canary That Was Shown Failing

The route coverage guard derives its expected set from the live registry rather than from a written list, so a registered mode with no fixture case fails it. To prove the coverage binds this route rather than merely existing, the registration was withdrawn from both routing files and every digest was refreshed so the drift tripwire could not mask the result. The canary failed with `single-create-chart action: 'defer' !== 'route'`. A byte-exact restore, confirmed by sha256 against a backup taken beforehand, returned it to `REAL-GREEN` at the same effective policy hash.

### Five Canaries Were Already Red

Before any edit, all five hub canaries failed on a stale `router-replay.cjs` pin left behind by commit `5bb2253daa`, which changed that scorer without following it. The shared pin at `005-decision-evaluator/harness/protected-digests.json` and the sk-doc copy were both moved to the current committed content. Ten of the sixteen authored hub digests were stale in the same way, on files this phase never touched. The four sibling canaries still fail, byte-identically to their baseline, because each keeps its own copy of the stale pin.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/mode-registry.json` | Modified | The sixteenth mode entry and its 33 aliases |
| `.opencode/skills/sk-doc/hub-router.json` | Modified | Vocabulary class, weight-3 signal after the neighbour, tie-break slot |
| `.opencode/skills/sk-doc/ROUTER.md` | Modified | Intent bullet, `CHART` signals, `CHART` leaves, full-inventory rows |
| `.opencode/skills/sk-doc/SKILL.md` | Modified | Mode-table row and every corrected packet count |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modified | Stage-one advisor vocabulary and the corrected causal summary |
| `.opencode/skills/sk-doc/description.json` | Modified | Stage-one keywords and the corrected generated description |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerated | The mode's leaves, written by the generator rather than by hand |
| `.opencode/skills/sk-doc/sk-create-chart/SKILL.md` | Modified | Report mode, galleries and the empty-corpus claim removed |
| `.opencode/skills/sk-doc/sk-create-chart/README.md` | Modified | Same corrections, plus the corpus check added to verification |
| `.opencode/skills/sk-doc/sk-create-chart/references/README.md` | Modified | The stale section replaced by what is deliberately absent |
| `.opencode/skills/sk-doc/sk-create-chart/assets/*/.gitkeep` | Deleted | Placeholders in populated directories that the leaf walker indexed |
| The sk-doc canary fixture and checks | Modified | The route case, refreshed digests and refreshed topology counts |
| The shared protected-digest manifest | Modified | One stale scorer pin moved to its current committed content |
| The compiled route manifest | Refreshed | Republished through refresh, sync, verify and finalize |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first, across both stages and every prompt, because a routing change is only legible against what the routing did before it. The vocabulary was then designed and collision-checked before a keyword was written, since a collision is cheap to prevent and expensive to find later. The nine surfaces were wired together rather than incrementally, because a mode reachable in one stage and not the other is invisible and there is no useful state to stop at halfway. Verification was deliberately split so a pass in one stage could not mask a failure in the other, and the neighbour question was answered twice, once by replaying every neighbour prompt and once by the canary's pre-existing cases. Publication came last, from a state that already passed its gates, through the documented refresh sequence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave the bare type names with `sk-create-diagram` | That packet's selection guide promises them, and taking the routing name while its documentation keeps the claim would create a contradiction this phase has no authority to fix |
| Claim three data-qualified crossovers instead | `bar chart of` catches the packet's most common real request without touching a name the neighbour documents |
| Weight 3, placed after the neighbour in `routerSignals` | Score is hit count times weight and the ambiguity delta is one, so weight 4 beside a weight-3 neighbour wins every single-hit tie. Parity plus key position hands genuine ties back |
| No bare `chart` keyword | `flowchart`, `org chart`, `gantt chart` and `radar chart` all contain it, so the token would have fired on requests the mode cannot serve |
| Check all 33 candidates for collision before writing any | A collision is invisible in a diff and obvious in a routing failure. The check cost one pass and returned zero hits |
| Regenerate the leaf manifest rather than hand-edit it | A hand-edited manifest drifts from the tree it indexes, and invariant 10b compares it byte for byte against a fresh regeneration |
| Remove three `.gitkeep` placeholders | Their directories are populated, and the leaf walker was indexing them as routable resources |
| Re-pin digests only after a run proved the pin still fires | A re-pin not preceded by a real red run is indistinguishable from disabling the check |
| Fix the mode's own three documents | A router pointing at instructions that describe a different skill is not integrated, and `SKILL.md` is itself a routing surface |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stage one, `skill-advisor.cjs` on six chart phrasings | PASS. `sk-doc` top at 0.82 to 0.9049, where three previously returned nothing and two reached a different hub (REQ-001, SC-001) |
| Stage two, the same six runs | PASS. `compiledRoute.action=route`, `targets=['sk-create-chart']` (REQ-002, SC-002) |
| Stage two, `router-replay.cjs` on all 33 keywords | PASS. 33 of 33 resolve to `sk-create-chart` with `sk-create-chart/SKILL.md`, which exists (REQ-002, REQ-003) |
| Stage one, the same 33 keywords | 32 of 33 select `sk-doc`. The fragment `chart template` returns no recommendation and is a recorded limitation (REQ-001) |
| Neighbour replay, twelve prompts at both stages | PASS. Every skill, action and target identical to baseline (REQ-006, NFR-P01) |
| Canary, `validate-canary.cjs` on sk-doc | PASS. `status: REAL-GREEN`, `modesWithSingleRouteCase: 16`, 23 of 23 green rows, `destinationCount: 16`, `distinctPacketCount: 15` (REQ-005) |
| Canary negative control | PASS. Registration withdrawn and every digest refreshed, canary failed with `single-create-chart action: 'defer' !== 'route'`, then returned green byte-exact (SC-004) |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS. Exit 0, zero warnings, invariant 6a now passes after failing since the directory appeared |
| Compiled manifest freshness | PASS. `fresh=false` with `causeCode: stale-manifest` after the edits, `fresh=true` after the refresh |
| `compiled-route-status.cjs --all` | PASS. All five hubs `compiled-serving` and fresh (REQ-004, SC-003) |
| `compiled-route-sync.cjs --verify` | PASS. `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs`, and the rollback was finalized with none left behind |
| Corpus check on the mode | PASS. `RESULT: PASSED`, errors 0, unchanged by the document edits |
| Voice scan on all six edited markdown documents | PASS. Zero hard blockers each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A bare "bar chart" with no object reaches neither mode.** That is unchanged from before this phase and deliberate. The neighbour documents the name and this packet claims only the data-qualified form, so `bar chart of` routes and a two-word `bar chart` does not.
2. **The fragment `chart template` does not select the hub at stage one.** It routes correctly at stage two and inside a full sentence. It was kept out of the advisor vocabulary because it is generic enough to pull unrelated work.
3. **The four sibling hub canaries are still red.** They failed identically before this phase on their own copies of the stale `router-replay.cjs` pin, and each needs the same one-line re-pin. Fixing them was outside this phase's write authority.
4. **Ten of the sixteen authored hub digests were stale on files this phase never touched.** They were refreshed against the committed tree, which is what the canary expects, but the pattern says the pins drift whenever a hub changes without the canary being run.
5. **The mode has no command surface.** The registry entry carries `command: null`, so it is reached through the hub router. Whether it should have one is not this phase's question.
6. **The parent packet's phase map still lists this phase as Pending.** The parent `spec.md` sits outside this phase's write authority, so phase 006 reconciles it.
<!-- /ANCHOR:limitations -->

---

