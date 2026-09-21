---
title: "Tasks: v4 changelog in the root README voice"
description: "The ordered tasks for the changelog voice rewrite, the four count corrections and the fact-preservation proof."
trigger_phrases:
  - "v4 changelog voice tasks"
  - "changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4 changelog in the root README voice

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

- [x] T001 Open the packet and mint its derived metadata (`specs/system-speckit/033-system-speckit-v4/045-v4-changelog-voice-rewrite/`)
- [x] T002 Fix the baseline: wall census, HVR scan, skeleton counts and the token extraction against `HEAD` (`../CHANGELOG-v4.0.0.0.md`)
- [x] T003 Verify the four corrections at their sources: hub inventory, `mcp-tooling/mode-registry.json`, activation cohort (`.skilled/skills/`, `.skilled/bin/lib/compiled-routing/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the census paragraphs into benefit-led bullets or 2-3 sentence paragraphs, fresh-anchored (`../CHANGELOG-v4.0.0.0.md`)
- [x] T005 Correct the four counts: six hubs to seven, ten modes to nine twice, five other hubs to six (`../CHANGELOG-v4.0.0.0.md`)
- [x] T006 Add the two "What's New at a Glance" bullets for the jev hub and the orca promotion (`../CHANGELOG-v4.0.0.0.md`)
- [x] T007 Record the phase map row 45, the timeline milestone and the parent metadata (`../spec.md`, `../timeline.md`, `../graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the census, the scanner, the semicolon sweep and the skeleton counts (`../CHANGELOG-v4.0.0.0.md`)
- [x] T009 Diff the token extraction against `HEAD` and account for every difference (`../CHANGELOG-v4.0.0.0.md`)
- [x] T010 Write the implementation summary with the recorded evidence and validate the packet, the parent and the recursive run (`implementation-summary.md`)
- [x] T011 Commit once and push to `skilled/v4.0.0.0` and `main`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
