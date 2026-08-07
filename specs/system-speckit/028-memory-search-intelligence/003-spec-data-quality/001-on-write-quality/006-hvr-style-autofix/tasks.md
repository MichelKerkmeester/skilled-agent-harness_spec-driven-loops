---
title: "Tasks: A6 HVR Style Auto-Fix Linter [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hvr style"
  - "em-dash linter"
  - "prose semicolon"
  - "oxford comma"
  - "style auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/006-hvr-style-autofix"
    last_updated_at: "2026-07-04T17:11:59.545Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark and default-off verification tasks for A6"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A6 HVR Style Auto-Fix Linter

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

- [ ] T001 [B] Confirm the shared-safe-fix-engine phase has landed `dq-engine.ts`, `detector-registry.ts`, and the frozen `fixClass` allow-list (`.opencode/skills/system-spec-kit/mcp_server/.../detector-registry.ts`)
- [ ] T002 Locate the shipped wikilink validator fence detector and decide reuse-direct versus a shared prose-range helper
- [ ] T003 [P] Pin the deterministic default for each ambiguous swap, the em-dash to spaced-hyphen or sentence split and the semicolon to sentence split or comma
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the fence-aware prose-range parser that excludes fenced code blocks inline code spans and YAML frontmatter, REQ-001 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts`)
- [ ] T005 Implement the three deterministic swap rules over prose ranges only, em-dash, prose semicolon, and Oxford comma removal, REQ-002 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts`)
- [ ] T006 Add the length-neutrality guard and the `content_hash` idempotency guard so a re-run over clean prose is a no-op, REQ-003 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts`)
- [ ] T007 Register the `hvr.style` entry with `fixClass: 'safe'` and gate `fix` on `'safe'` in `opts.allowFixClass`, REQ-004 (`.opencode/skills/system-spec-kit/mcp_server/.../detector-registry.ts`)
- [ ] T008 Distinguish a prose semicolon from a semicolon in an inline code span or HTML entity and an Oxford comma from a comma in a code-like list, REQ-005 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts`)
- [ ] T009 Document each deterministic default inline and assert the exact output per ambiguous case, REQ-006 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Prove a spec-doc with em-dashes prose semicolons and Oxford commas auto-fixes to zero issues with all code inline-code and frontmatter regions byte-identical, SC-001 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts`)
- [ ] T011 Prove a re-run over already-clean prose applies zero changes and a byte-diff confirms fenced and frontmatter regions are unchanged, SC-002 (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts`)
- [ ] T012 Benchmark, assert swap precision 1.0 and planted catch-rate 1.0 on fixtures with post-apply conformance to zero and a second-pass no-op (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts`)
- [ ] T013 First-run real-defect floor, a report-mode `detect` scan over the live `.opencode/specs` corpus flags at least one genuine HVR-style violation in real authored prose (`.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts`)
- [ ] T014 Default-off, declare `SPECKIT_HVR_STYLE_AUTOFIX` default OFF and prove it through `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS` plus a flags-off byte-identical round-trip (`.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`)
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
