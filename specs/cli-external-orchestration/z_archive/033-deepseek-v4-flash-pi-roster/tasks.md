---
title: "Tasks: DeepSeek V4 Flash in the cli-pi enforced roster"
description: "Task breakdown for adding deepseek-v4-flash to the pi allowlist, updating aligned tests and the PI-017 fixture, and verifying cli-opencode."
trigger_phrases:
  - "deepseek v4 flash tasks"
  - "pi allowlist tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-deepseek-v4-flash-pi-roster"
    last_updated_at: "2026-08-02T06:04:34Z"
    last_updated_by: "implementer"
    recent_action: "Author task breakdown"
    next_safe_action: "Packet complete; optional follow-up sk-prompt-models Flash profile"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-035-deepseek-v4-flash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: DeepSeek V4 Flash in the cli-pi enforced roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Probe live CLIs for Flash availability (`cursor-agent --list-models`, `devin models list`, `opencode models deepseek`, `~/.pi/agent/models-store.json`)
- [x] T002 Locate every pi-roster enumeration (`grep mimo-v2.5-pro-ultraspeed` across `executor-config.ts`, `fanout-run.cjs`, tests, fixture)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `deepseek-v4-flash` to `PI_SUPPORTED_MODELS` (`system-deep-loop/runtime/lib/deep-loop/executor-config.ts`)
- [x] T004 [P] Add `deepseek-v4-flash` to `PI_ALLOWED_MODELS` (`system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T005 [P] Add `['deepseek-v4-flash', 'deepseek']` to `PI_MODEL_PROVIDERS` (`system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T006 Update roster assertion seven→eight + sorted list (`tests/unit/executor-config.vitest.ts`) and provider-map test (`tests/unit/fanout-run.vitest.ts`)
- [x] T007 Update roster count and enumeration seven→eight (`cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `vitest` for executor-config, fanout-run, combo-matrix (`188 passed`)
- [x] T009 Run `npm run typecheck` (`tsc` exit 0) and verify cli-opencode `providers-and-models.md` lists Flash
- [x] T010 Generate metadata (`generate-description.js`) + `validate.sh --strict`; complete checklist.md and implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All affected unit tests passing (`188 passed`)
- [x] cli-cursor / cli-devin confirmed unchanged
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
