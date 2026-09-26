---
title: "Tasks: Research Phase for Jev Typed Judgments Across .skilled"
description: "Ordered tasks for the context digests, the Grok 4.7 allowlist entry, the three-lineage fan-out, the Opus synthesis and the scaffolding of the proposed build phases."
trigger_phrases:
  - "jev research tasks"
  - "three lineage fan-out tasks"
  - "grok 4.7 allowlist tasks"
  - "jev synthesis tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Research Phase for Jev Typed Judgments Across .skilled

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

- [x] T001 [P] Write the repository-rules digest (`context/repo-rules-digest.md`)
- [x] T002 [P] Write the seam map of every place Jev could plug in, with paths (`context/seam-map.md`)
- [x] T003 [P] Write the digest of the vendored Jev material and the ideas file, naming the two `jev` packages apart (`context/jev-material-digest.md`)
- [x] T004 [P] Write the digest of harnesses that can measure usefulness (`context/measurement-digest.md`)
- [x] T005 Write three lenses and 30 label-keyed angles in four waves, a draft topic and the synthesis brief (`context/research-angles.md`, `scratch/synthesis-brief.md`)
- [x] T006 Tighten the topic with the prompt-improver and save it as one line with no double quote, backtick, dollar sign or backslash (`scratch/research-topic.txt`)
- [x] T007 [P] Add `grok-4.7-xhigh-fast` to both cli-cursor allowlists (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs`)
- [x] T008 [P] Cover the new id in the allowlist tests (`runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts`)
- [x] T009 [P] Document the new id and add a changelog entry (`.skilled/skills/cli-external-orchestration/cli-cursor/`)
- [x] T010 Probe the new id live with `Reply OK` and record the reply
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T011 Ping each executor and preview each lineage's prompt through `buildLoopPrompt`
- [x] T012 Run the three-lineage fan-out in the background (`research/`)
- [x] T013 Rerun alone any lineage that ends short of 10 iterations
- [x] T014 Run the merge and resource-map steps (`research/`)
- [ ] T015 Dispatch a fresh Opus 5.5 max leaf to write the ranked synthesis (`research/research.md`)
- [ ] T016 Scaffold the proposed build phases as Planned siblings, one Opus 5.5 high leaf per phase (`../NNN-*/`)
- [ ] T017 Add each new phase's binding row and phase-map row (`../goal.md`, `../spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Confirm each lineage state log holds 10 records ending `maxIterationsReached`
- [ ] T019 Reopen five citations and three recommendations from the synthesis against the code
- [ ] T020 Review the fan-out containment advisories and `git status` for lineage writes outside `research/`
- [ ] T021 Run `validate.sh --strict --recursive` on the parent until it prints `RESULT: PASSED`
- [ ] T022 Run `check-goal.cjs` on the parent and every child
- [ ] T023 Fill `implementation-summary.md` and save continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
