---
title: "Implementation Summary: Embedder ONNX Hardening — Round 2 Review Remediation"
description: "F1-F4 implemented and verified: tiered shutdown failsafe, dedicated DB-path override var, preserve-on-omit provider writes, and a real end-to-end DB-resolution regression test."
trigger_phrases:
  - "009 embedder onnx hardening round 2 summary"
  - "hf-model-server tiered shutdown failsafe implemented"
  - "skill-advisor MK_SKILL_ADVISOR_MEMORY_DB_PATH"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/009-embedder-onnx-hardening-round2"
    last_updated_at: "2026-07-08T11:05:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented and verified F1-F4"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-embedder-onnx-hardening-round2-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F1 test shape: real subprocess + real SIGTERM with a fake loadModel injected via the existing options.loadModel seam"
      - "F4 test shape: in-process, using createChildEnv()'s real output against the real shared factory (plan's explicitly-allowed alternative to a subprocess)"
      - "F3 call-site recount: 3 4-arg sites in schema.ts, not 2 as plan/checklist claimed; corrected in 005's summary"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-embedder-onnx-hardening-round2 |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 4 findings from the independent adversarial review of packet 005's Round 2 shipped diff are fixed, each with a regression test that would have caught the original gap — verified by literally reverting each fix in isolation and watching its new test fail.

### F1 — shutdown failsafe can no longer SIGKILL mid-drain

`hf-model-server.cjs`'s `shutdown()` closure is extracted into an exported `installShutdownHandlers(app, options)`. The single fixed 1500ms SIGKILL failsafe is replaced with `computeShutdownFailsafeMs(app)`: idle at shutdown stays 1500ms; a pending model load gets `MODEL_LOAD_TIMEOUT + 2000ms`; in-flight inference gets `INFERENCE_DRAIN_TIMEOUT_MS + 2000ms` (these two are mutually exclusive — an embed can only start after `getModel()` resolves). The timer is now explicitly cleared on both the success and failure paths of `app.close()`, and a `shuttingDown` guard stops a second signal from re-arming a second timer.

### F2 — the DB-leak fix can no longer be silently reopened

`mk-skill-advisor-launcher.cjs` no longer blind-forwards a parent `MEMORY_DB_PATH` — that name's established meaning is mk-spec-memory's own database. `createChildEnv()` now computes the child's `MEMORY_DB_PATH` from a new dedicated `MK_SKILL_ADVISOR_MEMORY_DB_PATH` override var, falling back to the advisor's own `skill-graph.sqlite` when unset.

### F3 — the 3-arg embedder-provider call no longer destroys state

`schema.ts`'s `setActiveEmbedderTransactional()` skips the provider-key write entirely when `provider === undefined` (the omitted/3-arg case), preserving whatever is already persisted. An explicit empty string is still a deliberate write, distinct from omission.

### F4 — the DB-leak fix has a real end-to-end test

A new regression test feeds `createChildEnv()`'s real output into the real, unmocked `resolveProvider()` from `@spec-kit/shared/embeddings/factory.js`, against two fully test-controlled fixture sqlite databases. Prior coverage only asserted `createChildEnv()`'s return value in-process; this proves the real downstream consumer actually opens the file that value points to.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/hf-model-server.cjs` | Modified | F1: tiered shutdown failsafe, exported `installShutdownHandlers`/`computeShutdownFailsafeMs`, explicit timer cleanup, repeated-signal guard. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/hf-model-server-shutdown.vitest.ts` | Created | F1: live subprocess + real SIGTERM regression test. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/__fixtures__/hf-model-server-shutdown-harness.cjs` | Created | F1: subprocess harness, real `installShutdownHandlers()` with an injected fake `loadModel`. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | F2: dedicated `MK_SKILL_ADVISOR_MEMORY_DB_PATH` override var; `MEMORY_DB_PATH` removed from the blind-pass-through allowlist. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Modified | F2: renamed override test + ambient-collision test. F4: two-fixture end-to-end resolution tests. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | Modified | F3: skip the provider write when `provider === undefined`. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` | Modified | F3: preserve-on-omit regression test. |
| `.opencode/skills/system-skill-advisor/references/config/db_path_policy.md` | Modified | F2: documented the new override var alongside `MK_SKILL_ADVISOR_DB_DIR`. |
| `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md` | Modified | F3: corrected the "3-arg call sites remain valid unchanged" claim. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix was verified twice: once as "does the new test pass," once as an A/B check — swap in an isolated variant of the file with only that finding's fix reverted, re-run the same test, confirm it fails with the exact pre-fix symptom, then restore and diff the restored file byte-identical against the pre-swap copy. F1's busy-mid-embed test genuinely SIGKILLs at ~1.8s against the reverted timer logic. F2/F4's tests resolve the wrong (non-advisor) database against the reverted `createChildEnv()`. F3's test loses the persisted provider against the reverted write logic. All four swap-run-restore cycles ran against real files on disk, never against a git diff (packet 005's own Round 2 work was itself uncommitted in this working tree, so `git HEAD` predates all of it and isn't a valid pre-fix baseline).

`schema.ts` was rebuilt (`npm run build`) after the fix and after each A/B revert/restore, and the compiled `dist/mcp_server/lib/embedders/schema.js` was grepped to confirm the fix is actually what's on disk for the running daemon to load on its next restart.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| F1 test: real subprocess + real SIGTERM, fake `loadModel` injected via `createHfModelServer()`'s existing `options.loadModel` seam | Plan's chosen approach was a real child-process signal drill. A real onnx model load is either slow or network/cache-dependent, which would make a committed test flaky across environments. Reusing the real exported `installShutdownHandlers` keeps the signal-handling/timer logic under test 100% real; only the model itself is fake. |
| F2 override var name: `MK_SKILL_ADVISOR_MEMORY_DB_PATH` | Matches the existing `MK_SKILL_ADVISOR_DB_DIR`/`MK_SKILL_ADVISOR_TRUST_DEFAULT` naming convention. |
| F4 test shape: in-process, real `resolveProvider()` against real fixture sqlite files | Plan explicitly allowed this as the first candidate before a subprocess fallback. It suffices: `resolveConfiguredDatabaseCandidates()`'s `MEMORY_DB_PATH` short-circuit means the real consumer's resolution runs exactly as a real spawned child would see it. |
| F4 decoy fixture uses a dim mismatch (512 vs the registry's 768), not a different provider name | The shared registry has exactly one real ollama manifest, so no second "different name" sentinel exists. A dim mismatch makes the manifest-dim check reject the decoy deterministically. |
| F3 call-site recount (3, not 2) documented as a correction | Re-grep during implementation found a 3rd 4-arg call site the plan missed. The substantive claim (all 3-arg/omitted sites are test-only) still held; only the count was off — corrected rather than left inaccurate. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| F1 new: `hf-model-server-shutdown.vitest.ts` | PASS, 3/3 (busy-mid-embed, idle, repeated-signal) |
| F1 existing: `hf-model-server.vitest.ts` + `hf-model-server-perimeter.vitest.ts` | PASS, 34/34, unaffected |
| F1 A/B (timer hardcoded back to fixed 1500ms) | FAIL as expected: `child.signalCode === 'SIGKILL'` at ~1.8s |
| F2/F4 new + updated: `launcher-bootstrap.vitest.ts` | PASS, 18/18 full file |
| F2/F4 A/B (`createChildEnv()` reverted to blind-forward) | FAIL as expected: 4 tests fail with wrong-value assertions; e2e resolves `'hf-local'` not `'ollama'` |
| F3 new + existing: `schema.vitest.ts` | PASS, 6/6 full file |
| F3 A/B (write reverted to unconditional) | FAIL as expected: persisted `provider: 'ollama'` missing after the 3-arg call |
| F3 dependents: `ensure-active-embedder.vitest.ts`, `refresh-roundtrip.vitest.ts` | PASS, unaffected |
| Broader blast radius (13 files, system-skill-advisor) | PASS, 81/81 |
| Broader embedders folder (system-spec-kit) | PASS, 111/111 (2 unrelated skipped) |
| Typecheck (`npm run typecheck`, system-skill-advisor/mcp_server) | PASS, exit 0 |
| Build (`npm run build`, system-skill-advisor/mcp_server) | PASS, exit 0; dist confirmed to contain the F3 fix |
| `node --check` on both `.cjs` files | PASS, every edit |
| Idle-shutdown timing (NFR-001) | PASS: idle-SIGTERM test asserts `exit.elapsedMs < 2000ms`; idle tier unchanged at 1500ms |
| `validate.sh --strict` | PASS, `Errors: 0  Warnings: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Running daemon needs a restart to pick up the rebuilt dist/.** The F3 `schema.ts` fix is compiled into `dist/mcp_server/lib/embedders/schema.js`, but a currently-running `mk-skill-advisor` daemon has the old dist loaded in memory until restarted. Same class of loose end already open on sibling packets 006/012 (WU-5) — not a gap in this packet's own verification (fresh build+typecheck+test all confirm the on-disk fix), just an operational follow-up.
2. **F1's `main().catch()` startup-failure failsafe left unchanged.** Per plan's own note, a startup failure has no in-flight embed to protect, so the separate fixed-1500ms failsafe for the case where `main()` itself throws was inspected and deliberately left as-is.
3. **F3's "explicit empty-string clear" pathway is JS-reachable but not TS-typed.** `AutoSelectedEmbedderProvider` is a strict string union, so no current typed call site can pass `''`. The fix supports it at the runtime level (only `undefined` skips the write) per spec.md's edge case, but no production or test call exercises it through the typed public API today. Not a gap — no caller needs it.
4. **No commit made as part of this pass.** This implementation session was not asked to commit; `checklist.md` CHK-FIX-007 ("evidence pinned to commit SHA") is deferred to whenever the packet is committed.
<!-- /ANCHOR:limitations -->
