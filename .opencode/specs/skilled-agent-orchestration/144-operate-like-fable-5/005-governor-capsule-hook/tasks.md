---
title: "Tasks: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder"
description: "Ordered task list to author the governor-rules doc, add the ~90-word capsule constant beside the comment-hygiene directive in render.ts, append it on the per-turn reminder, rebuild the advisor, and verify by render + word-count tests."
trigger_phrases:
  - "fable-5 governor capsule tasks"
  - "render.ts governor tasks"
  - "B2 task list"
  - "fable-governor.md tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-operate-like-fable-5/005-governor-capsule-hook"
    last_updated_at: "2026-06-15T14:06:37Z"
    last_updated_by: "planning-author"
    recent_action: "Authored task list for the B2 governor capsule"
    next_safe_action: "Execute T001: write fable-governor.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/constitutional/fable-governor.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-skilled-agent-orchestration/144-operate-like-fable-5/005-governor-capsule-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder

<!-- SPECKIT_LEVEL: 2 -->

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

_Author the canonical governor doc._

- [ ] T001 Create `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` with the 4 generic rules (problem-not-self; outcome-over-process / result-first; commit-and-move with `// DECISION:`; minimum honest qualifier). Verify: file exists, all 4 rules present.
- [ ] T002 Add the inherited G4 honesty guardrail to `fable-governor.md` (steers efficiency, not capability; never skip verification/tests/gates). Verify: guardrail sentence present (REQ-005).
- [ ] T003 [P] Document the 3 hook carriers in `fable-governor.md` (Claude/Codex `user-prompt-submit.ts` `additionalContext`; OpenCode `experimental.chat.system.transform`). Verify: all 3 named (REQ-006).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Surface the capsule on the hook._

- [ ] T004 Add a `GOVERNOR_CAPSULE` constant beside `HYGIENE_DIRECTIVE` (render.ts:51-53) in `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`, with a WHY comment. Verify: typecheck clean (REQ-002 text mirrors `fable-governor.md`).
- [ ] T005 Append `GOVERNOR_CAPSULE` on the same per-turn reminder emission that already carries `HYGIENE_DIRECTIVE`, in `render.ts`. Verify: render output contains the capsule (REQ-001).
- [ ] T006 Rebuild the compiled skill-advisor artifact. Verify: build succeeds and the built artifact contains the capsule text (REQ-004).
- [ ] T007 Confirm the capsule paragraph is <=~90 words and contains no model-family name, in `render.ts` / `fable-governor.md`. Verify: word count <=~90, no `Opus`/`gpt`/`claude` tokens (REQ-003).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add a `vitest` assertion that the rendered advisor brief contains the capsule, plus a word-count/no-model-name assertion, in the render test suite. Verify: new tests pass (SC-001, SC-002).
- [ ] T009 Run the full render `vitest` suite across the no-recommendation, ambiguity, and timeout-fallback rows; confirm the hygiene directive and prior behavior are unchanged. Verify: suite green, no regression vs the 003 baseline (REQ-007).
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict` and reconcile spec/plan/tasks/checklist. Verify: validator PASSED (CHK-040).
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

