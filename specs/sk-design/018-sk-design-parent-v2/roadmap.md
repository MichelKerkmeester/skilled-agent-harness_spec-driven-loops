---
title: "Roadmap: reinstating sk-design as a parent hub"
description: "What ships in what order, what each step breaks while it is mid-flight, and what proves it fixed. Execution order is not the folder numbering, and the difference is deliberate."
importance_tier: important
contextType: reference
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Marked steps 1 through 4 done and left step 5 as the only open phase"
    next_safe_action: "Run 005: replay the sixteen phrases from the final state and compare against the baseline"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - "specs/sk-design/018-sk-design-parent-v2/scratch/routing-baseline.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
---

# Roadmap: reinstating sk-design as a parent hub

<!-- SPECKIT_TEMPLATE_SOURCE: roadmap | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-design/018-sk-design-parent-v2` |
| **Level** | 2 (phase parent) |
| **Phases** | 10 |
| **Open** | 1 (`008`) |
| **Branch** | `skilled/v4.0.0.0` |

`sk-design` was a hub until 19 August 2026 and was dismantled on purpose by
`016-deprecate-sk-design-interface`. This packet reinstates it with four modes instead of two, and
the whole job is a routing change wearing a file move. Every step therefore ends the same way: a
request is replayed and either arrives or does not.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

Folder numbers read in a sensible order. Work runs in another, because each step must land on a
tree the previous one left green.

| # | Phase | Status | What it breaks mid-flight | What proves it fixed |
|---|-------|--------|---------------------------|----------------------|
| 1 | `002-hub-and-fundamentals` | **Done** `112d5471f4` | The root has no SKILL.md between move and author, so it lands as one commit | Fleet gate class H pass; two design phrases at baseline |
| 2 | `003-md-generator-as-mode` | **Done** | The generator's own identity files must go, or the root reports a nested identity; `/design:extract` and the design agent hold dead paths until rewritten | Both hub gates; `skill_graph_validate` clean; the generator's own tests from the new path; the regression 002 introduced closed |
| 3 | `004-chart-and-diagram-cutover` | **Done** | A router signal whose packet is not on disk fails whichever hub is wrong, so both hubs are edited in one commit | Both parent-skill checks; chart phrases naming sk-design and sk-doc no longer claiming them; the chart corpus checker from its new location |
| 4 | `001-sk-create-chart` | **Done** | 219 files carry the old pointer until repaired; the trigger index is stale until regenerated | `validate.sh --strict` on the moved packet; pointer sweep clean |
| 5 | `005-closure-and-routing-proof` | **Done** | Nothing | Sixteen-phrase replay at generation 638: zero phrases reach nobody, against four at the baseline |
| 6 | `006-design-mode-and-command-rename` | **Done** | Both command names change with no forwarder; 249 files move; the compiled routing must be re-minted in the same commit | Replay at or above the closing scores; the compiled-routing guard green; the corpus checker from the renamed path |
| 7 | `007-close-inherited-failures` | **Done** | Nothing; it only repairs | Both hubs' typed-gold gates green, the compiled-routing scenario green, the router-unification packet 25 of 25 |
| 8 | `008-fundamentals-beyond-ui` | **Now** | Broader vocabulary can pull a canvas phrase off the mode that owns it | New surface phrases above the bar with chart and diagram replayed as controls |
| 9 | `009-router-conformance` | **Done** | Nothing; prose and structure only | Peer section skeleton, every path resolving, replay unchanged |
| 10 | `010-readme-human-voice` | **Done** | Nothing; prose only, but easy to damage silently | 0 prose em-dashes, 0 splices, 0 out-of-scope edits |

**Now.** Step 7, closing the gates this packet left red. The rename landed with the replay
byte-identical, so the fixtures can move once onto their final names.

**Next.** Step 7 closes every gate this packet left red, including the four FLOWCHART fixtures that
`005` recorded and handed on. The operator has since directed that they move to the design hub rather
than stay with their benchmark, so the option `005` left open is now decided.

**Later.** Step 8 broadens fundamentals past screen UI to slide decks, print and document layouts.

Still unscheduled and still its own packet: vocabulary in `description.json` moves no advisor score.
If that is why long phrases miss elsewhere in the fleet, it is worth checking before anyone writes a
packet to tune scorer thresholds.
<!-- /ANCHOR:now-next-later -->

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

| Milestone | Target | State |
|-----------|--------|-------|
| Hub class contract satisfied | `description.json`, `mode-registry.json`, `hub-router.json` present; `leaf-manifest.config.json` absent | Met in step 1 |
| Four modes routable | `sk-design-fundamentals`, `sk-design-md-generator`, `sk-create-chart`, `sk-create-diagram` under the hub | Met in steps 1–3 |
| Chart packet relocated | 1,528 renames, `validate.sh --strict` green across all 35 spec folders | Met in step 4 |
| Sixteen phrases replayed | Every phrase reaching a skill at baseline still reaches one, proven by replay not by configuration | Met in step 5, at generation 638 |

### Two things carried forward, not resolved

**A regression this packet owns.** `validate this design.md` scored 0.8451 to the md generator at
baseline and returned nothing after the hub conversion, because two identities carrying design
vocabulary split a weak phrase. It closes in step 2 when they merge, and that is an acceptance
criterion there rather than a hope.

**A weakness this packet inherits and does not own.** `sk-doc` answers `create a chart` at 0.918 and
answers `make a chart of orders by month`, `flowchart` and `ascii flowchart of the approval loop`
with nothing, while carrying 27 chart and diagram vocabulary strings. Recorded so no later reader
mistakes it for damage done here. Fixing it is its own packet.
<!-- /ANCHOR:milestones-targets -->

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

| Step | Depends on | Why |
|------|-----------|-----|
| 1 `002` | nothing | The hub root must exist before anything can be a mode under it |
| 2 `003` | 1 | The generator merges into a hub that must already be class H |
| 3 `004` | 1, 2 | Both hubs are edited in one commit; the router signals must resolve to packets on disk |
| 4 `001` | 3 | The chart skill must already live under `sk-design` before its spec packet is filed there |
| 5 `005` | 1, 2, 3, 4 | Closure replays the final state; a replay of a half-moved tree proves nothing |
| 6 `006` | 5 | A rename should land on a measured fleet, so the replay after it means something |
| 7 `007` | 6 | The fixtures move once, onto the final mode names |
| 8 `008` | 6 | The contract should name the modes by their final names |

### The depth cost of step 4

The chart packet is 299 directories and already nested three levels deep. Moving it under this
parent makes five. No rule forbids it and the operator has ruled to proceed; it is recorded here
because legibility is the cost, and `001` is a relocated subtree rather than authored work.
<!-- /ANCHOR:dependencies -->
