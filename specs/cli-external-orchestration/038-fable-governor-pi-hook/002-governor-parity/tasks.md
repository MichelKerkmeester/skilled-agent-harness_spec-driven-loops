---
title: "Tasks: Governor Capsule Parity Fix"
description: "Bridge fallback parity, label sync, verification."
trigger_phrases:
  - "governor parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Tasks authored"
    next_safe_action: "T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Governor Capsule Parity Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read bridge fallback + canonical composition; confirm gap lines
  - [evidence: gap confirmed at `mk-skill-advisor-bridge.mjs:319-379` (local fallback lacked proof; native path used inline renderer)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Route bridge fallback through the parity renderer (mk-skill-advisor-bridge.mjs)
  - [evidence: `TERMINAL_PROOF_DIRECTIVE` added and appended in both fallback branches; `loadNativeAdvisorModules` now delegates to canonical renderer (`mk-skill-advisor-bridge.mjs:322,369,374,461`)]
- [x] T003 Add parity test: fallback output contains the proof directive (system-skill-advisor/tests/)
  - [evidence: `plugin-bridge.vitest.ts:91` asserts `Proof over appearance:` in parsed brief]
- [x] T004 Sync injection-contract.md label to model-agnostic wording
  - [evidence: `.opencode/hooks/injection-contract.md:50` — Fable-5 replaced with model-agnostic wording; grep returns 0 hits]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run vitest; grep fallback + label assertions
  - [evidence: `npx vitest run tests/compat/plugin-bridge.vitest.ts` — 9/9 pass; compat suite 33/33 pass; an operator-recorded manual comparison observed both bridge and canonical output at 806 bytes, while the automated assertion checks containment only and does not compare bytes; the historical full-repository observation recorded 21 failed test files (IPC/corpus/missing-plugin/env), with the reproducible current package-root baseline retained in `../007-dispatch-validation-evidence/evidence/full-corpus-baseline.md`]
- [x] T006 Run validate.sh --strict on this folder
  - [evidence: `validate.sh --strict` on this folder — result recorded in impl-summary]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`
  - [evidence: `grep -c "\[x\]" tasks.md` matches task count; completion verified via `validate.sh --strict`]
- [x] validate.sh --strict exits 0
  - [evidence: `bash validate.sh <folder> --strict` — RESULT: PASSED, 0 errors 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
