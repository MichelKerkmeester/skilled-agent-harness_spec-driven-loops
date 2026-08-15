---
title: "Tasks: Phase 009 Prompt Token-Contract"
description: "Planned task breakdown for the versioned marker contract, synthetic example, and fixed-corpus verification."
trigger_phrases:
  - "prompt-token-contract"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/009-prompt-token-contract"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned token-contract task breakdown."
    next_safe_action: "Execute T001 by capturing the fixed-corpus baseline."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 009 Prompt Token-Contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture old-profile marker-preservation and rewrite baseline on the fixed corpus (`test/`)
- [ ] T002 Inventory the prompt record, fixture, renderer, digest, and consumers (`src/contracts/prompt.ts`, `test/fixtures/prompt-profiles.json`, `src/providers/adapters.ts`)
- [ ] T003 Freeze the one-to-one marker rule, prose-only scope, and synthetic-only example policy (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a structured rubric/example surface only if required (`src/contracts/prompt.ts`)
- [ ] T005 Author the versioned token-contract instruction and synthetic few-shot (`test/fixtures/prompt-profiles.json`)
- [ ] T006 Record the revised version and digest inputs (`test/fixtures/prompt-profiles.json`)
- [ ] T007 Render the revised profile without changing message-body structure (`src/providers/adapters.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify every fixed-corpus marker appears exactly once, in order, unchanged (`test/`)
- [ ] T009 Verify the revised profile produces non-trivial prose rewriting (`test/`)
- [ ] T010 Verify synthetic examples contain no real protected bytes (`test/`)
- [ ] T011 Run existing restoration and fidelity regression checks (`packages/cli-communication-projection`)
- [ ] T012 Run `npm run check` and strict packet validation (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and checklist blockers have observed evidence.
- [ ] The fixed corpus reaches 100% restoration and non-trivial rewriting.
- [ ] Canonical bytes, protection, restoration, and wire-body structure are unchanged.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
