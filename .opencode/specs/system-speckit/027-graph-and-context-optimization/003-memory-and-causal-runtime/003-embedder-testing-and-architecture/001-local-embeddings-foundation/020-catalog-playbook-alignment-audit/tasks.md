---
title: "Tasks: Catalog/playbook alignment audit for local embeddings default set"
description: "Completed task ledger for the documentation-only catalog/playbook alignment audit packet."
trigger_phrases:
  - "catalog playbook audit tasks"
  - "embedding defaults task ledger"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit"
    last_updated_at: "2026-05-13T15:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Applied code graph scan remediation follow-up"
    next_safe_action: "Restart MCP server if needed, then rerun code_graph_scan"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-catalog-playbook-alignment-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which catalog and playbook entries need update/delete/edit/create actions after local embedding defaults changed?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: Catalog/playbook alignment audit for local embeddings default set

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Create Level 3 child phase folder from system-spec-kit scaffolding (`020-catalog-playbook-alignment-audit/`).
- [x] T002 Read sk-doc and system-spec-kit template guidance.
- [x] T003 [P] Confirm parent phase folder exists and contains children 001-019.
- [x] T004 [P] Lock write scope to the new child phase folder only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Record memory provider cascade in `spec.md` and `implementation-summary.md`.
- [x] T006 Record memory `llama-cpp` GGUF active default and `hf-local` ONNX q8 fallback.
- [x] T007 Record CocoIndex default model, query prompt, and code-only include behavior.
- [x] T008 Map P0/P1 system-spec-kit feature catalog and playbook update targets.
- [x] T009 Map P0/P1 mcp-coco-index stale model/Voyage expectation targets.
- [x] T010 Map P2/P3 review, caveat, and non-impact candidates.
- [x] T011 Document ADRs for provider-surface separation and approved documentation follow-up scope.
- [x] T012 Update system-spec-kit embedding/API catalog and playbook entries.
- [x] T013 Update mcp-coco-index default model catalog, playbook, reference, template, README, install guide, and SKILL wording.
- [x] T014 Add code-only include/default exclusion caveats where docs/spec wording could mislead.
- [x] T015 Refresh 020 packet docs and parent phase metadata.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Fill all Level 3 required docs.
- [x] T017 Create metadata files `description.json` and `graph-metadata.json`.
- [x] T018 Run strict spec validation.
- [x] T019 Run placeholder marker check.
- [x] T020 Verify stale current-default wording was removed from targeted docs.
- [x] T021 Attempt code graph refresh and record stale/timeout status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Code Graph Scan Remediation

- [x] T022 Diagnose code graph stale/timing-out refresh behavior (`code_graph_status`, `code_graph_query`, source reads, SQLite metadata).
- [x] T023 Update explicit scan behavior to honor incremental content-hash reindexing across Git HEAD drift (`scan.ts`).
- [x] T024 Refresh candidate manifests after successful incremental scans (`scan.ts`).
- [x] T025 Surface structural persistence errors before parse-error noise in failed-scan metadata (`scan.ts`).
- [x] T026 Add focused scan regression coverage and run typecheck (`code-graph-scan.vitest.ts`).
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual content verification passed against the dispatch findings.
- [x] Strict validator passed after final edits.
- [x] Approved follow-up documentation edits were applied and verified.
- [x] Focused code graph scan regression test and TypeScript typecheck passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
