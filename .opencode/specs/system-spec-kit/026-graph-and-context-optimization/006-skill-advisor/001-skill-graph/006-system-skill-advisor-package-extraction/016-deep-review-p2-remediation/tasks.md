---
title: "Tasks: P2 remediation for 015 deep-review advisories"
description: "Task ledger for closing the nine 015 deep-review P2 advisories and documenting two D2b shared seams."
trigger_phrases:
  - "013/009/016 tasks"
  - "p2 remediation tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/016-deep-review-p2-remediation"
    last_updated_at: "2026-05-14T21:30:00Z"
    last_updated_by: "codex"
    recent_action: "Commit and push complete"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: P2 remediation for 015 deep-review advisories

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

- [x] T001 Read `015-mcp-server-mk-skill-advisor-rename/review/review-report.md`.
- [x] T002 Read review iterations `iter-001.md` through `iter-005.md`.
- [x] T003 Read D2b broader seams section in packet 011 implementation summary.
- [x] T004 Scaffold Level 2 packet 016 docs and metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Fix stale parent metadata launcher path, launcher entity, trigger phrase, and active child.
- [x] T006 Add `MK_SKILL_ADVISOR_DB_DIR` preferred env var with `SYSTEM_SKILL_ADVISOR_DB_DIR` fallback.
- [x] T007 Update runtime config and package docs for the env-var order.
- [x] T008 Add `rename-invariants.vitest.ts` for server registration, launcher identity, and config parity.
- [x] T009 Fix stale standalone advisor validation command docs.
- [x] T010 Document accepted-as-is disposition for `sqlite-integrity.ts` and `skill-label-sanitizer.ts` shared seams.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `npm run build` in advisor MCP.
- [x] T012 Run `npm test` in advisor MCP and record pass count.
- [x] T013 Run packet 016 strict validation.
- [x] T014 Run parent 013/009 strict validation.
- [x] T015 Commit and push to `origin main`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Advisor Vitest, packet strict validation, and parent strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Canonical Findings**: See `../015-mcp-server-mk-skill-advisor-rename/review/review-report.md`.
<!-- /ANCHOR:cross-refs -->
