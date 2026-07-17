---
title: "Implementation Summary: Sidecar-Worker P1 Fixes"
description: "Completion record for 010/003/001 sidecar-worker P1 closures."
trigger_phrases:
  - "arc 010 003 001 summary"
  - "sidecar-worker p1 implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode"
    last_updated_at: "2026-05-23T06:20:00Z"
    last_updated_by: "codex"
    recent_action: "completed-7-sidecar-worker-p1-fixes"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100030010100030010100030010100030010100030010100030010100030010"
      session_id: "010-003-001-sidecar-worker-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F14 uses structured liveness with PID 1 orphan detection and unknown fail-closed warning."
      - "F94 mirrors recoverable request ids and exits 1 for unparseable no-id input."
      - "F95 evicts rejected provider promises and preserves successful provider cache."
---
# Implementation Summary: Sidecar-Worker P1 Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Completed |
| **completion_pct** | 100 |
| **Started** | 2026-05-23 |
| **Completed** | 2026-05-23 |
| **Executor** | Codex |
| **Findings Closed** | F5, F14, F19, F26, F30, F94, F95 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

| Finding | Result | Evidence |
|---------|--------|----------|
| F5 | Collapsed model-name fallback to `SPECKIT_EMBEDDER_SIDECAR_MODEL` env, request config, then default with stderr warning. | `sidecar-worker.ts:74-88` |
| F14 | Replaced boolean parent liveness with structured `{ alive, reason, errorCode }`; PID 1 is orphaned; EPERM/ESRCH/unknown are explicit. | `sidecar-worker.ts:128-168`; tests `sidecar-hardening.vitest.ts:465-512` |
| F19 | Removed trivial provider-name helper indirection and kept only parsing/liveness/provider seams that carry behavior or test value. | `sidecar-worker.ts:74-259` |
| F26 | Consolidated trivial single-call helper chain while retaining non-trivial config, parsing, liveness, and error helpers. | `sidecar-worker.ts:74-259` |
| F30 | Standardized worker error payloads around `{ phase, code, detail }` while preserving JSON-line stdout contract. | `sidecar-worker.ts:45-53`, `sidecar-worker.ts:214-222`, `sidecar-worker.ts:320-363` |
| F94 | Removed `id: 0` pre-parse responses; recoverable malformed JSON mirrors the request id, unparseable no-id input exits 1 with stderr. | `sidecar-worker.ts:225-233`, `sidecar-worker.ts:318-352`; tests `sidecar-hardening.vitest.ts:514-555` |
| F95 | Wrapped cached provider creation promise with rejection eviction; successful provider promise remains cached. | `sidecar-worker.ts:243-259`; tests `sidecar-hardening.vitest.ts:557-615` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

- Rewrote `plan.md`, `tasks.md`, and `checklist.md` to the canonical anchor structure used by arc 010/002/004.
- Patched `sidecar-worker.ts` only within the requested worker-local behavior.
- Extended `sidecar-hardening.vitest.ts` with seven new assertions covering F14, F94, and F95.
- Created `decision-record.md` with ADRs for the three behavioral policies.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **F14 structured liveness:** Worker liveness uses structured results and treats PID 1, ESRCH, and unknown errors as not alive. EPERM remains alive with a distinct reason because permission denial still proves process existence.
- **F94 pre-parse policy:** The worker never sends synthetic `id: 0`; recoverable ids are mirrored and missing-id unparseable input terminates the worker with exit 1.
- **F95 cache policy:** Rejected provider creation promises are evicted immediately; resolved provider promises remain cached for performance and behavior stability.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Command | Exit | Evidence |
|---------|------|----------|
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts` | 0 | 1 file passed; 21 tests passed; includes 7 new F14/F94/F95 assertions. |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | 0 | `tsc --noEmit --composite false -p tsconfig.json` passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode --strict` | 0 | Strict validation passed after final docs update. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Scope intentionally excludes `sidecar-client.ts`, `execution-router.ts`, `ensure-rerank-sidecar.cjs`, reindex, registry, schema, and index files per phase boundaries.
- F95 in `execution-router.ts` remains outside this child phase because this packet owns only the `sidecar-worker.ts` surface.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff

Changed or created files:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/implementation-summary.md`

Suggested commit:

`fix(010/003/001): close 7 P1 sidecar-worker findings — F5+F14+F19+F26+F30+F94+F95`

PACKET-010-003-001 DONE: 7 P1, 7 new fixtures, strict-validate PASS, EXIT=0
