---
title: "Tasks: cli-classifier quality fixes"
description: "Fixes the required findings from the cli-classifier quality research: five cli-jev docs without an Overview, a backwards transport sentence, a caller that records Pi answers as Jev, two transport edge cases and three stale doc lines."
trigger_phrases:
  - "cli-classifier fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-classifier quality fixes

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

- [x] T001 Scaffold the packet and capture the suite baseline
- [x] T002 Write one DeepSeek brief per code fix
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Record `transport` in clarify-default call records (`score-clarify-default.cjs`)
- [x] T004 Guard `choiceRequestFrom` against a missing question (`jev-transport.mjs`)
- [x] T005 Default `spawnClassifierCall` `env` to `process.env` (`jev-transport.mjs`)
- [x] T006 [P] Add Overview sections to the five cli-jev docs
- [x] T007 [P] Fix the hub transport sentence, the Hermes copy, the shared README, the test count and the review band
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the baseline suites and compare counts
- [x] T009 Luna read-only review of the code diff, fix any P0 or P1
- [x] T010 Validate the packet and write the summary
- [x] T011 Narrow the hub keywords and update the advisor divergence ledger (`SKILL.md`, `local-native-approved-divergences.json`)
- [x] T012 Add the install step (`README.md`, `SKILL.md`)
- [x] T013 Check in the injection screen report (`benchmark/reports/2026-10-03--injection-screen--jev-pi-default/`)
- [x] T014 Release `v0.8.0.0` (`changelog/v0.8.0.0.md` and the hub version fields)
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
<!-- /ANCHOR:cross-refs -->

---



