---
title: "Tasks: Command-surface projection layer (argumentGrammar + choreography[])"
description: "Phased task list for the additive recipe-field port onto the sk-design command-metadata SSOT, its surface-check drift gate, and the five /design:* wrappers."
trigger_phrases:
  - "d6-r1 command recipe projection"
  - "command metadata design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/001-command-recipe-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with one-line evidence and canonical phase headers"
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
# Tasks: Command-surface projection layer (argumentGrammar + choreography[])

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

**Task Format**: `T### [P?] Description (file/path) [effort]`

**In-scope targets (verified on disk):**
- The sibling command-metadata JSON beside the mode registry (EDIT — additive).
- The design command surface-check ESM script under sk-design `shared/scripts/` (EDIT — additive).
- The five `/design:*` command markdown wrappers (EDIT — additive).
- The mode registry JSON (UNCHANGED — identity only).

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Confirm `ownerMode` stays singular vs the spec build-outline `ownerModes[]`; record the decision in the spec (`spec.md`) [15m] — Done: singular kept; the plural rename breaks `drift=0`, multi-skill aspects ride `choreography[]`
- [x] T002 [B] Confirm `next[]` stays the minimal next-options here and the full `nextOptions[]` handoff grammar defers to sibling phase 007; record the decision (`spec.md`) [10m] — Done: minimal kept; 007 owns the rich grammar
- [x] T003 Capture the baseline surface-check (`invalid=0 drift=0`, exit 0) before any edit (`design-command-surface-check.mjs`) [5m] — Done: baseline captured green before edits

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### SSOT additive edits (command-metadata JSON)
- [x] T004 Add `argumentGrammar` to the audit record; set `render` to the exact existing `argumentHint` (`command-metadata.json`) [15m] — Done: typed grammar added, `render === argumentHint`
- [x] T005 [P] Add `argumentGrammar` to foundations, interface, md-generator, motion; each `render` equals its `argumentHint` (`command-metadata.json`) [25m] — Done: four records tagged, render equals hint each
- [x] T006 Add `choreography[]` to the audit record from the wrapper's existing load order (hub then mode packet then references) (`command-metadata.json`) [15m] — Done: ordered `order`/`skill`/`resource`/`action` steps
- [x] T007 [P] Add `choreography[]` to foundations, interface, md-generator, motion from each wrapper's load order (`command-metadata.json`) [30m] — Done: four records carry ordered choreography
- [x] T008 Confirm no existing field was removed or mutated and the mode registry is untouched (`command-metadata.json`, `mode-registry.json`) [10m] — Done: additive only; registry byte-unchanged

### Surface-check enforcement (ESM script)
- [x] T009 Add `argumentGrammar` and `choreography` to the required-field set (`design-command-surface-check.mjs`) [15m] — Done: both required; a missing field reports INVALID
- [x] T010 Add `validateArgumentGrammar()`: positional array, flags array, non-empty `render`, and `render === argumentHint` (`design-command-surface-check.mjs`) [40m] — Done: validator enforces shape + render equality
- [x] T011 Add the choreography validator: non-empty ordered array, each step has a positive `order`, a non-empty `skill`, and a non-empty `action` (`design-command-surface-check.mjs`) [40m] — Done: ordered-array validation added
- [x] T012 Add the `## CHOREOGRAPHY` wrapper-drift detector that asserts every choreography step appears in the wrapper section; register the new drift field in the drift-field set (`design-command-surface-check.mjs`) [40m] — Done: detector wired into the drift collector
- [x] T013 Verify every code comment is evergreen — no spec path, phase id, or artifact number embedded (`design-command-surface-check.mjs`) [10m] — Done: evergreen scan clean

### Wrapper projection (command docs)
- [x] T014 Add a `## CHOREOGRAPHY` section to the audit wrapper listing its ordered choreography steps (`commands/design/audit.md`) [15m] — Done: section added, matches the SSOT
- [x] T015 [P] Add the `## CHOREOGRAPHY` section to foundations, interface, md-generator, motion wrappers (`commands/design/*.md`) [30m] — Done: four wrappers carry matching sections

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`; resolve drift until `invalid=0 drift=0`, exit 0 [20m] — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified, no pipe-masking)
- [x] T017 Bite: corrupt one real `argumentGrammar.render`; confirm the checker reports invalid, then revert [10m] — Done: `STATUS=INVALID invalid=1`; reverted
- [x] T018 Bite: diverge one wrapper `## CHOREOGRAPHY` numbered step from the metadata; confirm the checker reports drift, then revert [15m] — Done: `STATUS=DRIFT drift=1`; reverted to `drift=0`
- [x] T019 `node --check` the surface-check script and `JSON.parse` the metadata [5m] — Done: both clean
- [x] T020 Confirm registry/routing identity: `mode-registry.json`/`hub-router.json`/`score-skill-benchmark.cjs` untouched (`ownerModes`=0, `nextOptions`=0); `hubRoute` 23/5/0 [15m] — Done: no rename leaked; hubRoute 23/5/0
- [x] T021 Update `implementation-summary.md` and mark all `checklist.md` items with evidence [15m] — Done: implementation-summary authored; checklist fully `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (both logic-sync decisions resolved)
- [x] Surface-check returns `STATUS=PASS ... invalid=0 drift=0`, exit 0
- [x] All five records carry valid `argumentGrammar` (`render === argumentHint`) and `choreography[]`
- [x] All five wrappers carry a matching `## CHOREOGRAPHY` section
- [x] Mode registry byte-unchanged; no existing field regressed
- [x] checklist.md fully verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Sibling scope boundaries**: phase 002 (scorer cap), 007 (next-options handoff grammar), 008 (structural surface-check audit)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Additive recipe-field port; canonical Setup / Implementation / Verification phases
- Two blocking logic-sync decisions resolved in Setup (ownerMode singular, next minimal)
- Explicit render-INVALID and choreography-DRIFT bites plus registry identity in Verification
-->
