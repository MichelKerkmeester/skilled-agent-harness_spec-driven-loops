---
title: "Tasks: Provider Adapter Redesign Deferred P2 Closure"
description: "Task breakdown for F10, F23, F63, F64, F71, and F75 closure."
trigger_phrases:
  - "020 006 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign"
    last_updated_at: "2026-05-23T11:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed provider adapter tasks"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0200060200060200060200060200060200060200060200060200060200060200"
      session_id: "020-006-provider-adapter-redesign"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: Provider Adapter Redesign Deferred P2 Closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` Complete
- `[ ]` Pending
- `[P0]` Blocks packet completion
- `[P1]` Required before handoff
- `[P2]` Optional or informational
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 [P0] Scaffold Level 2 child packet under the pre-approved arc 020 path.
- [x] T002 [P0] Add decision-record addendum so the packet has the requested eight document files.
- [x] T003 [P0] Run scaffold strict validation. Evidence: errors 0, warnings 0.
- [x] T004 [P0] Read arc 020 parent `spec.md`, F61 ADR, prior bucket packet shape, and target code/test files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 [P0] Audit `DirectProviderAdapter` instantiation/state. Evidence: single construction path at `execution-router.ts:279`; state was provider promise only.
- [x] T011 [P0] Collapse `DirectProviderAdapter` to `createDirectProviderAdapter()` and focused helpers. Evidence: `execution-router.ts:179-249`.
- [x] T012 [P0] Move registered Ollama delegation to creation time. Evidence: `execution-router.ts:240-245`.
- [x] T013 [P0] Remove worker dimension fallback. Evidence: `sidecar-worker.ts:92-98`.
- [x] T014 [P0] Remove worker provider default and require provider env. Evidence: `sidecar-worker.ts:114-120`.
- [x] T015 [P0] Consolidate worker provider aliases. Evidence: `sidecar-worker.ts:100-112`.
- [x] T016 [P1] Update F95 direct-worker fixtures to provide required provider env. Evidence: `sidecar-hardening.vitest.ts:744-767` and `sidecar-hardening.vitest.ts:783-806`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 [P0] Add router dimension-validation fixture. Evidence: `execution-router.vitest.ts:190-200`.
- [x] T021 [P0] Add router Ollama delegation fixture. Evidence: `execution-router.vitest.ts:203-221`.
- [x] T022 [P0] Add worker invalid-dimensions fixture. Evidence: `sidecar-worker.vitest.ts:137-150`.
- [x] T023 [P0] Add worker missing-provider fixture. Evidence: `sidecar-worker.vitest.ts:153-166`.
- [x] T024 [P0] Add worker provider-alias fixture. Evidence: `sidecar-worker.vitest.ts:169-186`.
- [x] T025 [P0] Run focused router/worker vitest. Evidence: 2 files, 22 tests passed.
- [x] T026 [P0] Run full embedders vitest. Evidence: final retry passed 4 files, 54 tests; first retry failure was F48 only.
- [x] T027 [P0] Run mcp-server typecheck. Evidence: exit 0.
- [x] T028 [P0] Run packet and parent strict validation. Evidence: final validation entries in checklist.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All six findings closed with no DEFERRED-AGAIN rows.
- [x] Public router API signature unchanged.
- [x] Worker no longer silently supplies provider or dimension fallbacks.
- [x] New fixtures prove upstream dimension handling and provider fail-fast behavior.
- [x] Requested verification commands pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent spec: `../spec.md`
- F61 baseline: `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks/decision-record.md`
- Prior bucket: `../005-fix-deferred-p2s-for-runtime-process-lifecycle/`
- Source deferred list: `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md`
<!-- /ANCHOR:cross-refs -->
