---
title: "Tasks: Comment ephemeral-artifact pointer cleanup"
description: "Per-file task tracker for the comment-only ephemeral-pointer sweep across the embedding-stack program and adjacent system-spec-kit modules."
trigger_phrases:
  - "comment ephemeral pointer cleanup tasks"
  - "ephemeral pointer sweep file list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup"
    last_updated_at: "2026-05-29T20:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed all edits; phases marked done"
    next_safe_action: "Commit with safe pathspecs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003163"
      session_id: "031-006-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Comment ephemeral-artifact pointer cleanup

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Verify the sk-code rule + allowed-vs-forbidden contract (`code_style_guide.md` §4)
- [x] T002 Audit + classify every hit (true violation / false positive / allowed structural); scaffold this spec folder

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Embedding / daemon program files:
- [x] T003 vector-index-store.ts — drop `WS-1`, `031/review`, `026/004/012` (3 lines)
- [x] T004 context-server.ts — drop `026/007/011`, `026/007/009` (2 lines)
- [x] T005 reindex.ts — drop `031/review`, `026/004/012` (2 lines)
- [x] T006 registry.ts — drop `031/005` reranker-removal note
- [x] T007 factory.ts — drop spec-folder names header, `in 003`, `ADR-014` (3 lines)
- [x] T008 hf-local.ts — drop spec-folder names from prefix-registry header
- [x] T009 bench-dtype-q8-fp16.cjs — drop `031/005`, `REQ-006` (2 lines)
- [x] T010 embedding-reconcile.ts — drop acceptance-contract folder + iteration pointers

Older core modules:
- [x] T011 [P] types.ts — drop `REC-010` / `Spec 103`
- [x] T012 [P] document-helpers.ts — drop `Spec 126`
- [x] T013 [P] memory-parser.ts — drop `Spec 126`
- [x] T014 [P] lineage-state.ts — drop `T070-3`
- [x] T015 [P] quality-scorer.ts — drop `Per DR-004`
- [x] T016 [P] api/index.ts — drop `review-report.md P2-MNT-02`
- [x] T017 [P] preflight.ts — drop `010-index-large-files` prefix
- [x] T018 [P] query-flow-tracker.ts — drop `Spec:` header pointer
- [x] T019 [P] config.ts — drop `(010-perfect-session-capturing)`
- [x] T020 [P] vector-index-schema.ts — drop `(010-index-large-files)`, keep `V16:`
- [x] T021 [P] retry-budget.ts — drop `C4 (iter 5)`
- [x] T022 [P] trigger-phrase-sanitizer.ts — drop iteration-doc authority pointer
- [x] T023 [P] tool-schemas.ts — drop `(CHK-160)` string + `@see decision-record.md` comment
- [x] T024 [P] shared-payload.ts — drop `@see …/research.md` pointer

Shared bin launchers:
- [x] T025 mk-spec-memory-launcher.cjs — drop rename pointer, `016/006/009`, `REQ-007`, `REQ-011` (4 lines)
- [x] T026 mk-skill-advisor-launcher.cjs — drop `008-REQ-001/002`, `REQ-011`, deep-review iter pointer (4 lines)
- [x] T027 launcher-ipc-bridge.cjs — drop `031/005`, `026/007/011` (2 lines)

Owner-authorized extras:
- [x] T028 mk-code-index-launcher.cjs — drop `DR-*`, `REQ-011`, `016/006/009`, packet pointer (~12 lines; comment-only)
- [x] T029 generate_report.py — drop `Phase 005` from generated report output

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Build both workspaces (`npm run build --workspace=@spec-kit/{shared,mcp-server}`) → exit 0
- [x] T031 `node --check` every touched `.cjs` + `python3 -m py_compile` the report → OK
- [x] T032 Re-run the ephemeral-pointer audit; only allowed/false-positive matches remain
- [x] T033 `validate.sh --strict` on this packet; write implementation-summary.md

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Build + `node --check` + re-audit + strict validation all pass

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
