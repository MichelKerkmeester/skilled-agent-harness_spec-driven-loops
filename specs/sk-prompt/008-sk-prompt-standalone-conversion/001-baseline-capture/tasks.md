---
title: "Tasks: Phase 1: baseline-capture"
description: "Ordered capture tasks for the eight pre-change gates plus the routing metrics transcription."
trigger_phrases:
  - "008 phase 001 tasks"
  - "baseline capture tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: baseline-capture

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

- [x] T001 Create the capture directory (`scratch/baseline/`) — evidence: 8 capture files present
- [x] T002 Confirm the working tree is on the release branch with the hub intact — evidence: `git branch --show-current` returned `skilled/v4.0.0.0`; `.opencode/skills/sk-prompt/mode-registry.json` present
- [x] T003 [P] Probe the executor reachability for later phases — evidence: `devin 3000.6.2 (ce8ebcc1)`, `devin auth status` returned "Logged in (via Devin)"
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Capture the three skill-root gates (`scratch/baseline/g1.txt`–`g3.txt`) — evidence: root-metadata `checked=14 passed=14 failed=0`, leaf-manifest `checked=14 fresh=14 failed=0`, derived `checked=14 fresh=14 stale=0 errored=0`; all `exit=0`
- [x] T005 Capture the compiled-routing freshness guard (`scratch/baseline/g4.txt`) — evidence: "All hubs fresh or excused: serving matches inputs, and the runtime matches its source"; `exit=0`
- [x] T006 Capture the prompt-quality card-sync guard (`scratch/baseline/g5.txt`) — evidence: "GUARD PASS — tables not inlined, Tier-3 pointer-only, registry complete, all models discoverable"; CHECK 1–4 all PASS; `exit=0`
- [x] T007 Capture the skill-graph compiler validation (`scratch/baseline/g6.txt`) — evidence: "Discovered 14 skill graph-metadata.json files … VALIDATION PASSED"; `exit=0`
- [x] T008 Capture the per-hub parent-skill structural check (`scratch/baseline/g7.txt`) — evidence: 6 of 6 hubs PASS, including `sk-prompt`
- [x] T009 Capture the routing-accuracy corpus scorer (`scratch/baseline/g8.txt`) — evidence: `"overall_pass": true`, accuracy 0.5641, gate3 f1 0.9843, joint TT=107 FT=3 FF=1; `exit=0`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Transcribe the zero-headroom metrics into the summary — evidence: FT=3 against `--max-joint-ft 3` and FF=1 against `--max-joint-ff 1` recorded as at-ceiling in `implementation-summary.md`
- [x] T011 Record the ratchet pins the deletion will move — evidence: `delegation` bucket 11/11 accuracy 1.0, `holdout_top1` 55/72, and the three corpus sha256 pins recorded in `implementation-summary.md`
- [x] T012 Confirm no tracked file was modified by the capture — evidence: `git status --short` showed only the pre-existing `sk-communication/SKILL.md` modification, unrelated to this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: every task above carries a recorded command result
- [x] No `[B]` blocked tasks remaining — evidence: no task in this phase entered a blocked state
- [x] Manual verification passed — evidence: see the Verification table in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
