---
title: "Tasks: Phase 54: v4-0-0-13-changelog-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4 0 0 13 changelog opencode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 54: v4-0-0-13-changelog-opencode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the unreleased changelog and the `sk-create-changelog` contract it must follow, so the section grammar, the 12-bullet glance ceiling and the default of dropping test counts are known before editing (`.skilled/changelog/skilled/v4.0.0.13.md`, `.skilled/skills/sk-doc/sk-create-changelog/`)
- [x] T002 Establish the facts the file will state: 17 plugin files under `.opencode/plugins/`, 053's 17-of-17 live matrix on OpenCode 1.19.3 and 2.0.32, and the release-tree suite counts rerun for this phase - plugins 516, hook node 886 over 30 files, hook vitest 452 and battery unit 51. The dispatch audit count gets no row of its own, because the tests it covers already sit inside the hook vitest row
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Brief 1: move the OpenCode section up to sit right after In-Session Handover and fill it with eight H4 items - plugins on both versions, shared agents/commands/config, dispatch follows the version, side-by-side install, one default model, version-aware guards, tested live on both versions, and what still differs (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T004 Brief 2: name the OpenCode work in the frontmatter description, the intro, Why This Release and the glance list, merging related bullets so the list falls from 14 to the template's ceiling of 12 (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T005 Brief 3: carry the testing item with its suite table, kept although the template drops test counts by default because the operator asked for the testing to be shown, and record the deviation (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T006 Brief 4: correct the plugin count from sixteen to 17 so it matches `.opencode/plugins/` (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T007 Brief 5: add three OpenCode upgrade notes for the side-by-side install, the `OPENCODE_BIN` pin and the shared llmgateway default model (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Round 1 read-only DeepSeek review, then fix its 2 P1s: the `OPENCODE_DB` sentence read backwards, and the dash-and-bash claim had no record (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T009 Round 2 read-only DeepSeek review, then fix its 3 P1s: the sk-vision tools gate was unstated, the 872 hook node count was stale, and 323 was an audit-time count (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T010 Run both content validators over the finished file: `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T013 Round 3 read-only DeepSeek review, then fix its 1 P1 and 4 P2s in one brief: say the suites "run in CI" rather than that they block a merge, drop the dispatch audit row so the table holds four, scope `opencode-go` to OpenCode 1, describe the `OPENCODE_DB` migration as documented rather than probed, and name the two Pi extension suites; a narrow read-only check of the changed sentences then returned PASS, with one P2 - this phase's own `spec.md` still listed 124 - now fixed (`implementation-summary.md`, `spec.md`)
- [x] T011 Push to main - `31f48d136f` on main
- [x] T012 Confirm CI green at the pushed commit - CI green on main `75bf33afe9`, Spec-Kit Check 39744488854
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T011 and T012 closed: `31f48d136f` is on main, and main `75bf33afe9` ran 13 workflows green, including Spec-Kit Check 39744488854
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Live two-version matrix**: See `../053-final-commit-live-proof/scratch/live-runs/results-matrix.md`
<!-- /ANCHOR:cross-refs -->

---
