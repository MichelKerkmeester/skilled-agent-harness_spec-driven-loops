---
title: "Tasks: DeepSeek V4 Flash pinned to the Max thinking tier"
description: "Task breakdown for the force-to-max Flash effort pin, tests, and catalog corrections."
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/044-deepseek-v4-flash-max-only"
    last_updated_at: "2026-08-16T17:34:05Z"
    last_updated_by: "implementer"
    recent_action: "Authored task breakdown"
    next_safe_action: "Packet complete"
    blockers: []
    completion_pct: 100
---
# Tasks: DeepSeek V4 Flash pinned to the Max thinking tier

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
- `[ ]` open · `[x]` done
- `[P]` parallelizable
- IDs group by phase: T-1xx setup, T-2xx implementation, T-3xx verification.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T-101 Verify Flash capability live: `reasoning: true`, `thinkingLevelMap.max` present; no `-max` id on pi/opencode.
- [x] T-102 Baseline: run the three affected vitest suites and record pass counts.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T-201 Add `isFlashMaxPinnedModel` + `pinReasoningEffortForModel` to `executor-config.ts`.
- [x] T-202 Mirror the predicate in `fanout-run.cjs`.
- [x] T-203 Apply the pin in `buildPiLineageCommand` (`--thinking`) and record the pinned effort.
- [x] T-204 Apply the pin in `buildOpencodeLineageCommand` (`--variant`) and record the pinned effort.
- [x] T-205 [P] Helper unit tests in `executor-config.vitest.ts` (match/exclusion/effort mapping).
- [x] T-206 [P] Builder pin tests in `fanout-run.vitest.ts`; update the provider-map assertion for Flash `--thinking max`.
- [x] T-207 [P] Correct the cli-pi catalog (reasoning + `--thinking max` note).
- [x] T-208 [P] Fix the cli-opencode catalog "non-reasoning" claim + `--variant max` note.
- [x] T-209 [P] Add the cli-devin Max-thinking-only policy note.
- [x] T-210 Add a changelog entry.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T-301 Watch the old behavior fail (Flash without `--thinking max`), then re-run: all green with the pin.
- [x] T-302 Confirm non-Flash models keep their requested effort.
- [x] T-303 Confirm the devin `-max` uid is not matched by the pin.
- [x] T-304 `validate.sh <folder> --strict` exit 0/1; reconcile completion metadata.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria
- REQ-001..006 satisfied; SC-001..003 observed; checklist all `[x]` with evidence.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md` · Decisions: `decision-record.md`

<!-- /ANCHOR:cross-refs -->
