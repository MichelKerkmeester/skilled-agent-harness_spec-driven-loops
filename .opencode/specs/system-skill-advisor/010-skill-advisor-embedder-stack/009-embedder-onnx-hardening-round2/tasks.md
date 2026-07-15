---
title: "Tasks: Embedder ONNX Hardening — Round 2 Review Remediation"
description: "Task ledger for the 4 findings: shutdown-failsafe timing, DB-leak env-var collision, provider-preserve write semantics, and an end-to-end DB-resolution test. All tasks complete with evidence."
trigger_phrases:
  - "009 embedder onnx hardening tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/009-embedder-onnx-hardening-round2"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed all Phase 1-3 tasks with evidence"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-embedder-onnx-hardening-round2-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Embedder ONNX Hardening — Round 2 Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete with evidence
- `[!]` Blocked with reason
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Gate 3 packet path and plan approval before any code changes. Evidence: dispatching prompt supplied the exact packet path; spec/plan/tasks/checklist all pre-existed as planning-only docs, read in full before any edit.
- [x] T002 Re-read `hf-model-server.cjs`'s current `shutdown()`/`dispose()` control flow (may have drifted since this plan was authored). Evidence: full file read confirmed the fixed-1500ms `shutdown()` closure and `dispose()`'s bounded drain/load waits exactly as plan.md described.
- [x] T003 Re-read `mk-skill-advisor-launcher.cjs`'s `createChildEnv()`/`CHILD_ENV_ALLOWLIST` and re-confirm no production config sets `MEMORY_DB_PATH` today. Evidence: full file read; `grep -n "MEMORY_DB_PATH" opencode.json .env .env.local` → no matches.
- [x] T004 Re-read `schema.ts`'s `setActiveEmbedder()`/`setActiveEmbedderTransactional()` and re-grep all call sites for 3-arg usage. Evidence: `rg -n 'setActiveEmbedder\(' --glob '*.ts'` — found 3 (not 2) 4-arg call sites inside `schema.ts` itself; all repo 3-arg sites are test-only. See implementation-summary.md's Deviations section and checklist.md CHK-FIX-002.
- [x] T005 Re-read `launcher-bootstrap.vitest.ts`'s existing DB-leak coverage and `shared/embeddings/factory.ts`'s `resolveConfiguredDatabaseCandidates()`. Evidence: both files read in full; confirmed `resolveConfiguredDatabaseCandidates()` is unexported and its `MEMORY_DB_PATH` short-circuit is the exact mechanism F2/F4's tests exercise.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [F1] Implement the tiered/dynamic shutdown-failsafe timeout in `hf-model-server.cjs`: fast timeout when idle at shutdown, drain-aware slow timeout when inference or model-load is in-flight. Evidence: `computeShutdownFailsafeMs(app)` — idle=1500ms, loading=`MODEL_LOAD_TIMEOUT+2000`, inference-in-flight=`INFERENCE_DRAIN_TIMEOUT_MS+2000`.
- [x] T011 [F1] Clear the failsafe timer explicitly on a successful `close()`. Evidence: `clearTimeout(forceExitTimer)` in `installShutdownHandlers()`'s `.then()` (and `.catch()`) branch.
- [x] T012 [F1] Add the SIGTERM-during-active-embed live regression test; confirm it fails against the pre-fix fixed-1500ms behavior and passes after the fix. Evidence: `hf-model-server-shutdown.vitest.ts` (real subprocess + real SIGTERM, fake loadModel injected via the existing `options.loadModel` seam) — 3/3 pass against the fix; A/B-confirmed fails (`SIGKILL` mid-drain) against an isolated pre-fix timer variant. See checklist.md CHK-020.
- [x] T013 [F2] Add the dedicated skill-advisor-namespaced DB-path override var to `CHILD_ENV_ALLOWLIST`; remove `MEMORY_DB_PATH` from the generic blind pass-through. Evidence: `MK_SKILL_ADVISOR_MEMORY_DB_PATH` added; `MEMORY_DB_PATH` removed from the Set.
- [x] T014 [F2] Compute `MEMORY_DB_PATH` explicitly in `createChildEnv()` from the new dedicated var or the existing default — never from a blindly-forwarded ambient value. Evidence: `createChildEnv()` reads `sourceEnv.MK_SKILL_ADVISOR_MEMORY_DB_PATH` directly, falls back to `advisorDbPath()`.
- [x] T015 [F2] Update `launcher-bootstrap.vitest.ts`'s "honors an explicit parent-provided MEMORY_DB_PATH" test to the new dedicated var. Evidence: renamed to "honors an explicit MK_SKILL_ADVISOR_MEMORY_DB_PATH override instead of the default", passes.
- [x] T016 [F2] Add the ambient-collision regression test: an unrelated `MEMORY_DB_PATH` set in the parent env must not override the advisor's default. Evidence: 2 new tests added (ambient-ignored + override-wins-over-hostile-ambient); A/B-confirmed fail against the isolated pre-F2 variant. See checklist.md CHK-021/CHK-022.
- [x] T017 [F3] Change `setActiveEmbedderTransactional()` to skip the provider-key write when `provider === undefined`, preserving any already-persisted value. Evidence: `providerWrite !== undefined` guard around the `ACTIVE_EMBEDDER_PROVIDER_KEY` insert.
- [x] T018 [F3] Add the preserve-on-omit regression test in `schema.vitest.ts`. Evidence: "preserves an already-persisted provider when a later 3-arg call omits it" — passes; A/B-confirmed fails against the isolated pre-F3 variant. See checklist.md CHK-023.
- [x] T019 [F3] Correct 005's `implementation-summary.md` claim about 3-arg call sites; cross-reference this packet, do not duplicate the writeup. Evidence: `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md` corrected.
- [x] T020 [F4] Design and implement the subprocess-boundary end-to-end DB-resolution test per plan.md's Architecture section. Evidence: implemented as the in-process variant plan.md explicitly allowed as the first candidate ("in-process vi.stubEnv-style, if that suffices") — real `createChildEnv()` output fed into the real `resolveProvider()` from `@spec-kit/shared/embeddings/factory.js` against two fixture sqlite DBs; 2 new tests in `launcher-bootstrap.vitest.ts`, A/B-confirmed genuinely catch the F2 leak scenario (same variant as T016's A/B). See checklist.md CHK-021.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run scoped Vitest for F1's new shutdown-timing test. Evidence: `hf-model-server-shutdown.vitest.ts` 3/3 pass (system-spec-kit/mcp_server).
- [x] T031 Run scoped Vitest for F2's updated + new `launcher-bootstrap.vitest.ts` cases. Evidence: full file 18/18 pass.
- [x] T032 Run scoped Vitest for F3's new `schema.vitest.ts` case; re-run `ensure-active-embedder.vitest.ts` for regressions. Evidence: `schema.vitest.ts` 6/6 pass; `ensure-active-embedder.vitest.ts` all pass (part of the 35/35 combined batch).
- [x] T033 Run scoped Vitest for F4's new end-to-end test. Evidence: 2/2 pass, part of `launcher-bootstrap.vitest.ts`'s 18/18.
- [x] T034 Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck`. Evidence: exit 0.
- [x] T035 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict`. Evidence: see checklist.md/implementation-summary.md for the final PASSED result after doc updates.
- [x] T036 Refresh metadata after final doc updates if needed. Evidence: `graph-metadata.json`'s `status` and `spec.md`'s Status field updated to reflect completion.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[!]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Item | Reference |
|------|-----------|
| Parent packet | `../spec.md` |
| Predecessor (Round 2 shipped) | `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md` |
| hf-model-server shutdown | `.opencode/bin/hf-model-server.cjs` |
| Launcher DB-leak fix | `.opencode/bin/mk-skill-advisor-launcher.cjs` |
| Embedder schema | `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` |
| Existing DB-leak unit test | `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` |
<!-- /ANCHOR:cross-refs -->
