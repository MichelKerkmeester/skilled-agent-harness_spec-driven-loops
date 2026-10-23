---
title: "Tasks: Phase 63: v4-0-0-13-final-changelog"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4 0 0 13 final changelog tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 63: v4-0-0-13-final-changelog

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

- [x] T001 Read the `sk-create-changelog` contract and the changelog as phase 061 left it, so the section grammar, the glance ceiling, the target voice and the exact text to replace are known before the brief goes out (`.skilled/skills/sk-doc/sk-create-changelog/`, `.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T002 Collect the facts the changelog must state: phase 058's default model from commit `5b5f56720f`, phase 062's dispatch preference from commit `4505c338b1`, and the suite counts from reruns on this tree (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/058-deepseek-v4-1-flash-1017-default/`, `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/062-opencode-2-primary-v1-fallback/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Send one DeepSeek v4.1 flash 1017 writer brief through `cli-pi` at high thinking with seven exact replacements, and confirm all seven applied (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T004 Move the default model to `llmgateway/deepseek-v4.1-flash-1017`, LLM Gateway's 2026-10-17 release, in the `#### One Default Model on Both Versions` item, the dispatch glance bullet and the llmgateway upgrade note, naming both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime with Pi's blackhole workers at `high`, and add the upgrade note for pinning the older `deepseek-v4.1-flash` (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T005 Rewrite the dispatch wording to take the first `opencode2` anywhere on PATH and use `opencode` only when no `opencode2` is installed, with the fan-out runtime picking the same way, and add the `Expect OpenCode 2 when both are installed` upgrade note after `Move to OpenCode 2` (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T006 Refresh the suite table from reruns on this tree: plugins 516 to 533, hook node tests 886 to 914, hook vitest 452 to 461 and battery unit tests 55 unchanged, and recheck the plugin count of 17 and the 12 `.markdown` files as unchanged (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run both content validators over the updated file: `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers, and the glance list holds 11 bullets (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T008 Run one separate read-only DeepSeek v4.1 flash 1017 review at max thinking. It returned VERDICT: PASS with no P0 or P1 and two P2s, recorded and not fixed: 'runs OpenCode 2 whenever it is installed' at lines 17 and 39 compresses away the `OPENCODE_BIN` override that line 99 states, and OpenCode 1 is named before OpenCode 2 inside two clauses at lines 99 and 172 without inverting the recommendation. The title is confirmed unchanged as 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2' (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T009 Fill this phase's four docs and the parent packet's phase-map and handoff rows from the facts and the verification record (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [x] T010 Commit and push to main: `5801f6f807` on main (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T011 Confirm CI is green on the pushed commit: 12 of 12 on `5801f6f807`, and 13 passed with Trigger Index Rebuild skipped on the index rebuild `dd180cefeb`, Spec-Kit Check 39879181332 (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, the push and CI tasks included
- [x] No `[B]` blocked tasks remaining
- [x] Review done: one read-only DeepSeek v4.1 flash 1017 session at max thinking returned VERDICT: PASS with no P0 or P1 and two P2s recorded
- [x] Manual verification passed: both validators report 0 issues and 0 hard blockers, the glance list holds 11 bullets, and the title is unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The default model change**: See `../058-deepseek-v4-1-flash-1017-default/implementation-summary.md`
- **The dispatch preference change**: See `../062-opencode-2-primary-v1-fallback/implementation-summary.md`
- **The trimmed changelog this phase started from**: See `../061-v4-0-0-13-changelog-trim-and-simplify/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
