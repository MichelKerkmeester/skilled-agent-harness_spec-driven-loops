---
title: "Tasks: Answer-grammar hardening for the spec-gate Gate-3 parser"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "answer grammar hardening tasks"
  - "spec-gate skip regex tasks"
  - "answerParse tasks"
  - "gate-3 grammar tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/005-answer-grammar-hardening"
    last_updated_at: "2026-07-11T11:05:58.098Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 task breakdown for answer-grammar hardening"
    next_safe_action: "Start T001 - read the parser and enumerate the current corpus"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-answer-grammar-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Answer-grammar hardening for the spec-gate Gate-3 parser

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

- [ ] T001 Read `answerParse`, `SKIP_WORD_REGEX`, `ANSWER_LETTER_PREFIX_REGEX`, and `evaluateMutation`; enumerate the current answer corpus (`spec-gate-core.mjs:329-380,557-590`; `spec-gate-core.test.mjs:487-538`)
- [ ] T002 Capture the baseline test run `node --test spec-gate-core.test.mjs` (`spec-gate-core.test.mjs`)
- [ ] T003 [P] Inventory `GATE_3_QUESTION` / skip-regex / `result.detail` consumers across the core, Claude adapters, and OpenCode plugin (`spec-gate-core.mjs`, `hooks/claude/*.mjs`, `plugins/mk-spec-gate.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Tighten `SKIP_WORD_REGEX` to bare skip / skip-it class so "skip X ... do Y" no longer matches (`spec-gate-core.mjs:329`)
- [ ] T005 Guard the standalone-letter-D skip path so trailing prose defeats the skip (`spec-gate-core.mjs:360`)
- [ ] T006 Broaden letter recognition with a closed-set natural lead-in ("option/choice/answer/go with/use option" + A-E) so "option B" registers the letter and the bare-token binding fires (`spec-gate-core.mjs:330,369-373`)
- [ ] T007 Add `GATE_3_DENY_DETAIL` model-audience constant and return it from the `evaluateMutation` deny branch; keep advise/classify on `GATE_3_QUESTION` (`spec-gate-core.mjs:88-95,583-585`)
- [ ] T008 Preserve invariants during the change: do not widen the deny predicate, add no stdout/stderr, keep fail-open paths and `MK_SPEC_GATE_DISABLED` no-op untouched (`spec-gate-core.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Expand `POSITIVE_ANSWER_CORPUS` and `NEGATIVE_PROMPT_CORPUS` with skip-false-close, standalone-D, and natural lead-in cases (`spec-gate-core.test.mjs:487-538`)
- [ ] T010 Update the golden-loop deny-detail assertion to the new model-audience marker (`spec-gate-core.test.mjs:67`)
- [ ] T011 Run `node --test spec-gate-core.test.mjs` and `node --experimental-test-module-mocks --test spec-gate-core.test.mjs`; confirm 0 false positives / 0 false negatives (`spec-gate-core.test.mjs`)
- [ ] T012 Run `validate.sh --strict` on this phase folder and grep-confirm invariants (no `console.*` in the core, `DENY_CAPABLE_TOOLS` unchanged, no `mcp_server/` dist rebuild)
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
