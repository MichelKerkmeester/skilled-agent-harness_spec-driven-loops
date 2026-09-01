---
title: "Implementation Summary: Making the Frontmatter Mode Reachable"
description: "Registered sk-create-frontmatter as the hub's fifteenth mode and wired both routing stages, then proved a request actually reaches it. Every keyword is qualified so none collides with a sibling: a bare frontmatter token was rejected because AGENT_CREATION already owns 'agent frontmatter'. Registration also closed the hub-gate deviation phase 002 recorded."
trigger_phrases:
  - "routing integration summary"
  - "qualified keyword vocabulary"
  - "registry entry is not a route"
  - "compiled routing lock recovery"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/004-routing-integration"
    last_updated_at: "2026-09-01T08:42:59Z"
    last_updated_by: "implementation"
    recent_action: "Registered the mode, wired both routing stages, and published compiled routing"
    next_safe_action: "Proceed to phase 005 (command and playbook)"
    blockers: []
    key_files:
      - "../002-mode-scaffold/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-routing-integration"
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
| **Spec Folder** | 004-routing-integration |
| **Completed** | 2026-09-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A frontmatter request now reaches the frontmatter mode, and a gate fails if it stops doing so. The mode
is registered in `.opencode/skills/sk-doc/mode-registry.json` as the hub's fifteenth entry, both routing
stages are wired, and both were exercised with real prompts rather than trusted because a registry entry
exists. Registration also closed the hub-gate deviation phase 002 recorded.

### The Seven Surfaces

- **`.opencode/skills/sk-doc/mode-registry.json`**: a fifteenth mode, `sk-create-frontmatter`, `packetKind: workflow`, `command: null`, `advisorRouting.routingClass: "metadata"`, and 17 aliases. The `metadata` class means the mode is resolved by hub membership rather than carrying an advisor entry of its own.
- **`.opencode/skills/sk-doc/hub-router.json`**: a `create-frontmatter-aliases` vocabulary class holding the same 17 keywords, a `routerSignals` entry at weight 4 pointing at `sk-create-frontmatter/SKILL.md`, and a `routerPolicy.tieBreak` slot.
- **`.opencode/skills/sk-doc/ROUTER.md`**: a prose bullet in the intent model, a `FRONTMATTER` entry in `INTENT_SIGNALS`, a `FRONTMATTER` entry in `RESOURCE_MAP` naming the mode's three leaves, and the same leaves added to `FULL_INVENTORY`, which enumerates the whole hub.
- **`.opencode/skills/sk-doc/SKILL.md`**: a mode-table row, required by hub invariant 6b.
- **`.opencode/skills/sk-doc/leaf-manifest.json`**: regenerated with `generate-leaf-manifest.cjs --write`, adding the mode's three leaves.
- **`.opencode/skills/sk-doc/graph-metadata.json`** and **`description.json`**: the frontmatter vocabulary that lets stage one find the hub, plus four "thirteen packets" claims corrected to fourteen across `SKILL.md`, the generated description and the causal summary.

### Every Keyword Is Qualified

This is the decision worth carrying forward. A bare `frontmatter` token was deliberately not used,
because `AGENT_CREATION` already owns "agent frontmatter": a bare token would have matched every prompt
that sibling matches, tied with it, and turned a sibling's exclusive route into a two-mode bundle. All 17
candidates were checked for substring collision against every existing keyword in both `ROUTER.md` and
`hub-router.json` before being added, and there were zero collisions in either.

The separation holds on real prompts, not just in the collision table. Replaying the intent scorer:
"create an agent with agent frontmatter and a permission object" scores `AGENT_CREATION: 12` with
FRONTMATTER at zero; "write release notes since the last version" scores `CHANGELOG: 8` with FRONTMATTER
at zero; and "yaml frontmatter block" scores `FRONTMATTER: 8` alone.

### Both Stages, Proven Separately

Stage one, the advisor: `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py
"I need to add a yaml frontmatter block and work out the description budget" --threshold 0.5` returns
`sk-doc` at confidence 0.95 with `"reason": "Matched: !description budget(signal), !frontmatter
block(signal), !yaml frontmatter(signal), create, frontmatter"`. Those three signal names are exactly the
ones added to the hub's graph metadata, so the match is the new vocabulary rather than a coincidence.

Stage two, the hub router: the canary case `single-create-frontmatter`, prompt `yaml frontmatter block`,
resolves to `"selectionKind":"single","targets":["sk-create-frontmatter"]` with
`realEvaluateRouteGoldPass: true`.

### The Canary's Two Legitimate Re-Pins

The harness pins a sha256 per authored hub source, so an edited source turns a canary red until the pin
is refreshed. Two re-pins were needed, and each was preceded by a run that proved the pin still fires
before it was moved. The first red run named `packets/sk-create-feature-catalog/SKILL.md` and
`packets/sk-create-manual-testing-playbook/SKILL.md`, which phase 003 had edited. The second named the
hub `SKILL.md` after the packet-count correction.

The harness also carries four live-topology counts, and its own code comment says registering a mode
refreshes them in the same change. Destinations, projection rows and distinct identity tuples went from
14 to 15, and distinct packets from 13 to 14. The invariant those counts encode is the gap between them,
that modes outnumber packets because one packet backs two modes, and that gap is unchanged.

### Publishing the Compiled Routing

Publication needed the documented refresh sequence: `compiled-route-manifest.cjs refresh --hub sk-doc`,
then `compiled-route-sync.cjs`, then the status, verify and canary gates, then `--finalize`. A first
attempt left a publication lock held by an exited process, which blocked the next sync with `EEXIST`.
`--revert` on the retained rollback cleared it, and a clean sync from the current sources succeeded.
Final state: all five hubs `compiled-serving`, `move-simulation OK: all 5 hubs resolve; 0 reads under
.opencode/specs`, all five canaries exit 0, and no lock or rollback directory left behind.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/mode-registry.json` | Modified | The fifteenth mode entry, with `packetKind: workflow`, `command: null`, `routingClass: "metadata"` and 17 aliases |
| `.opencode/skills/sk-doc/hub-router.json` | Modified | The `create-frontmatter-aliases` vocabulary class, a `routerSignals` entry at weight 4, and a `routerPolicy.tieBreak` slot |
| `.opencode/skills/sk-doc/ROUTER.md` | Modified | Intent-model bullet, `INTENT_SIGNALS` entry, `RESOURCE_MAP` entry with three leaves, and the same leaves in `FULL_INVENTORY` |
| `.opencode/skills/sk-doc/SKILL.md` | Modified | The mode-table row invariant 6b requires, plus the packet-count correction |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerated | Three new leaves, written by `generate-leaf-manifest.cjs --write` rather than by hand |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modified | Stage-one advisor vocabulary, and the corrected packet count in the causal summary |
| `.opencode/skills/sk-doc/description.json` | Modified | Stage-one advisor vocabulary, and the corrected packet count in the generated description |
| The sk-doc canary fixture | Modified | The `single-create-frontmatter` case, plus two source re-pins and the four refreshed live-topology counts |
| The compiled routing manifest | Refreshed | Republished through `refresh`, `sync`, the gates and `--finalize` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The vocabulary was designed and collision-checked before a single keyword was written, because a
collision is cheap to prevent and expensive to find later. The seven surfaces were then wired together,
since a mode reachable in one stage and not the other is invisible, and there is no useful intermediate
state to stop at. Verification was deliberately split: stage one and stage two were replayed separately
so that a pass in one could not mask a failure in the other, and the sibling-regression question was
answered twice, once by the 14 pre-existing canary cases and once by replaying the intent scorer
directly on sibling-owned prompts. Publication came last, from a state that already passed its gates,
through the documented refresh sequence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Every keyword is qualified; no bare `frontmatter` token | `AGENT_CREATION` already owns "agent frontmatter"; a bare token would tie with it and turn a sibling's exclusive route into a bundle |
| Check all 17 candidates for substring collision before writing any | A collision is invisible in a diff and obvious in a routing failure; the check costs one pass and returned zero collisions in both files |
| Prove routing by replay, not by registry presence | This hub has already shipped registered-but-unreachable modes, which is the failure spec.md §2 names |
| Regenerate `leaf-manifest.json` rather than hand-edit it | A hand-edited manifest drifts from the tree it indexes, and invariant 10d requires the manifest and the registry to reach each other in both directions |
| Re-pin the canary only after proving the pin still fires | A re-pin that is not preceded by a real red-then-green run is indistinguishable from disabling the check |
| Clear the publication lock with `--revert` rather than by deleting it | The retained rollback is the documented recovery path, and deleting a lock file leaves the served artifact in an unknown state |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stage one, `skill_advisor.py` on a frontmatter prompt | PASS — `sk-doc` at confidence 0.95, matching on `!description budget`, `!frontmatter block` and `!yaml frontmatter`, the three signals this phase added (REQ-001, SC-001) |
| Stage two, canary `single-create-frontmatter` | PASS — `"selectionKind":"single","targets":["sk-create-frontmatter"]`, `realEvaluateRouteGoldPass: true` (REQ-001, SC-001) |
| `d5-connectivity.cjs --skill .opencode/skills/sk-doc/sk-create-frontmatter` | PASS — `score: 100`, `gateFailed: false`, `routerParseable: true`, `hubStageTwoRouted: 3`, empty `deadResourcePaths`, `deadIntentKeys`, `orphanReferences`, `pathEscapes` and `findings` (REQ-002) |
| `d5-connectivity.cjs` on the hub | PASS — zero of each (REQ-002) |
| Canary coverage guard | PASS — `modesWithSingleRouteCase: 15`, derived from the live registry (REQ-003, SC-002) |
| All canary rows | PASS — 22 of 22 green; the 14 pre-existing single-route cases still resolve to their own modes (REQ-004, SC-003) |
| Intent-scorer replay on sibling prompts | PASS — `AGENT_CREATION: 12` and `CHANGELOG: 8` on their own prompts with FRONTMATTER at zero; `FRONTMATTER: 8` alone on its own (REQ-004, SC-003) |
| `parent-skill-check.cjs` on the sk-doc hub | PASS — `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0; closes the phase 002 deviation |
| Compiled routing publication | PASS — all five hubs `compiled-serving`, `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs`, all five canaries exit 0, no lock or rollback directory left behind |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A bare "frontmatter" prompt does not reach this mode on that token alone.** All 17 keywords are
   qualified, deliberately, so that `AGENT_CREATION` keeps "agent frontmatter" as an exclusive route.
   The qualified forms cover the phrasings the mode's own documentation uses, but a one-word prompt is
   not among them.
2. **The mode has no command surface.** The registry entry carries `command: null`, so the mode is
   reached through the hub router rather than by a slash command. Adding one is phase 005's scope.
3. **The canary's stale-pin failure mode will recur.** The harness pins a sha256 per authored hub
   source, so any future edit to a pinned source turns a canary red until it is re-pinned. That is the
   check working, not a defect, but a reader who has not seen it before will read the first red run as
   a routing regression.
4. **The publication lock is not self-clearing.** A lock left by an exited process blocks the next sync
   with `EEXIST` and needs `--revert` on the retained rollback to clear. Nothing in this phase changed
   that behavior; it is recorded here so the next operator recognizes it in one step rather than
   diagnosing it.
<!-- /ANCHOR:limitations -->

---
