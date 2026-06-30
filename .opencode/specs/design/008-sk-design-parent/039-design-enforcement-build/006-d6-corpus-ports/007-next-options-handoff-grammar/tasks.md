---
title: "Tasks: nextOptions[] + handoff status grammar (no silent chain)"
description: "Additive task list to port the next-options + handoff grammar onto command-metadata.json, design-command-surface-check.mjs, and the five /design:* wrappers, holding STATUS=PASS drift=0 and hubRoute 23/5/0."
trigger_phrases:
  - "d6-r7 next options handoff grammar"
  - "handoff grammar design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/007-next-options-handoff-grammar"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with one-line evidence under canonical phases"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: nextOptions[] + handoff status grammar (no silent chain)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline: run the surface-check and record `STATUS=PASS ... invalid=0 drift=0`, exit 0 (`design-command-surface-check.mjs`) [10m] — Done: green baseline captured before any edit
- [x] T002 [B] Confirm D6-R1 sequencing (001's `argumentGrammar`/`choreography[]` land first) and plan to add `handoff` beside them without clobbering (`001-command-recipe-projection/`) [15m] — Done: R1 fields verified intact; `handoff` added additively; `drift=0` after merge
- [x] T003 [B] Confirm the two design decisions: a grouped `handoff` object shape and a dedicated wrapper section vs an enriched success tail (`spec.md`) [10m] — Done: grouped `handoff` object + dedicated `## HANDOFF GRAMMAR` section; success tail kept intact
- [x] T004 Record the `mode-registry.json` hash to prove identity preservation later (`mode-registry.json`) [5m] — Done: hash recorded; registry confirmed byte-unchanged after the work

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### SSOT additive edits (command-metadata JSON)
- [x] T005 Add a `handoff` object to the audit record (`nextOptions[]` = `next` set, each with `when`; `handoffRequired:false`; non-empty `handoffReason`) (`command-metadata.json`) [10m] — Done: object added, `nextOptions == next`
- [x] T006 [P] Add a `handoff` object to foundations, interface, md-generator, motion records (`command-metadata.json`) [25m] — Done: four records tagged, each `nextOptions == next` with populated `when`
- [x] T007 Verify every record's `handoff.nextOptions[].command` set equals its `next` set, no self-reference, all reasons evergreen (no spec id/path) (`command-metadata.json`) [10m] — Done: lockstep + no-self + evergreen confirmed

### Surface-check enforcement (ESM script)
- [x] T008 Add `handoff` to the required-field set (`design-command-surface-check.mjs`) [10m] — Done: a record missing `handoff` reports INVALID
- [x] T009 Add `validateHandoff()`: `nextOptions[]` non-empty; each `command` resolves to a known recipe; not the own command; no duplicate; set equals `next` (`design-command-surface-check.mjs`) [30m] — Done: validator enforces resolution, no-self, no-duplicate, lockstep
- [x] T010 Extend `validateHandoff()`: `handoffRequired` boolean-and-`false`; `handoffReason` non-empty; each `nextOptions[].when` non-empty (`design-command-surface-check.mjs`) [20m] — Done: recommend-only + non-empty reason/when enforced
- [x] T011 Add `expectedHandoffDrift()`: assert each wrapper `## HANDOFF GRAMMAR` section carries the three tokens, every option command + rationale, `HANDOFF_REQUIRED=false`, and the no-silent-chain assertion; register the new drift field (`design-command-surface-check.mjs`) [40m] — Done: detector wired; new drift field registered
- [x] T012 Keep every comment evergreen — no spec path, phase id, or artifact number in the checker (`design-command-surface-check.mjs`) [5m] — Done: evergreen scan clean

### Wrapper projection (command docs)
- [x] T013 Add the `## HANDOFF GRAMMAR` section to audit.md (`NEXT_OPTIONS`, `HANDOFF_REQUIRED=false`, `HANDOFF_REASON`, per-option `when`, no-silent-chain line) matching the SSOT (`commands/design/audit.md`) [10m] — Done: section added, matches the SSOT
- [x] T014 [P] Add the `## HANDOFF GRAMMAR` section to foundations, interface, md-generator, motion wrappers (`commands/design/*.md`) [30m] — Done: four wrappers carry matching sections

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `node design-command-surface-check.mjs`; resolve any drift until `invalid=0 drift=0`, exit 0 [15m] — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified, no pipe-masking)
- [x] T016 Bite (temp-corrupt-restore): inject an unknown/malformed `nextOptions` command; confirm the checker fails; revert (`command-metadata.json`) [10m] — Done: `STATUS=INVALID invalid=1`; reverted
- [x] T017 Bite (temp-corrupt-restore): remove `handoffRequired` from a record; confirm the checker fails the silent-chain case; revert (`command-metadata.json`) [10m] — Done: `STATUS=INVALID invalid=2` (required-field + boolean-type); reverted
- [x] T018 `node --check` the surface-check script and `JSON.parse` the metadata [5m] — Done: both clean
- [x] T019 Confirm D6-R1 `argumentGrammar`/`choreography[]` preserved and registry/routing identity: `mode-registry.json`/`hub-router.json`/`score-skill-benchmark.cjs` untouched by this phase; `hubRoute` 23/5/0 [15m] — Done: R1 fields intact; no rename leaked; hubRoute 23/5/0
- [x] T020 Update `implementation-summary.md` and mark all `checklist.md` items with evidence [15m] — Done: implementation-summary authored; checklist fully `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (both design decisions resolved in Setup)
- [x] Surface-check `STATUS=PASS ... invalid=0 drift=0`, exit 0 (post-change)
- [x] Unknown-option and silent-chain negative probes both bite (`invalid=1` / `invalid=2`), then reverted
- [x] `mode-registry.json` byte-unchanged; `hubRoute` 23/5/0 held
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Sibling scope boundaries**: phase 001 (argumentGrammar/choreography), 002 (scorer cap), 008 (structural surface-check audit)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Additive: command-metadata.json handoff object + surface-check validator/detector + five wrappers
- Holds STATUS=PASS drift=0 and hubRoute 23/5/0; registry identity preserved
- Sequencing 001 -> 007 -> 008
-->
