---
title: "Implementation Plan: Embedder ONNX Hardening — Round 2 Review Remediation"
description: "Technical approach for each of the 4 findings: a dynamic shutdown-failsafe timeout, a dedicated env var for the DB-leak fix, preserve-on-omit provider writes, and a subprocess-boundary end-to-end DB-resolution test."
trigger_phrases:
  - "009 embedder onnx hardening plan"
  - "hf-model-server dynamic shutdown failsafe"
  - "skill-advisor dedicated db path env var plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/009-embedder-onnx-hardening-round2"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored technical approach for all 4 findings"
    next_safe_action: "Get plan approved, then execute tasks.md Phase 2"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-embedder-onnx-hardening-round2-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Embedder ONNX Hardening — Round 2 Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launcher + shutdown script (`hf-model-server.cjs`), TypeScript MCP server library (`schema.ts`) |
| **Framework** | Vitest for regression coverage; live subprocess drills for shutdown-timing verification |
| **Storage** | `skill-graph.sqlite` (`vec_metadata` table, `setActiveEmbedder`/`getActiveEmbedder`) |
| **Testing** | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck`, scoped Vitest per finding, strict spec validation |

### Overview

Each finding gets a narrowly-scoped fix at the exact boundary the review identified, plus a regression test that would have caught the gap: F1 replaces a single fixed shutdown-failsafe timeout with a tiered one that only allows a slow, drain-aware timeout when work is genuinely in-flight; F2 stops treating a blindly-forwarded `MEMORY_DB_PATH` as evidence skill-advisor was explicitly configured, replacing that signal with a dedicated skill-advisor-namespaced var; F3 changes the 3-arg `setActiveEmbedder()` form from "clear the provider" to "leave the provider untouched" when the caller omits it; F4 adds a subprocess-boundary test that exercises the real consumer resolution path instead of only `createChildEnv()`'s return value.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 4 findings read against the actual shipped code (`hf-model-server.cjs` shutdown/dispose control flow, `mk-skill-advisor-launcher.cjs` `createChildEnv()`/`CHILD_ENV_ALLOWLIST`, `schema.ts` `setActiveEmbedder*()`, `launcher-bootstrap.vitest.ts` existing DB-leak coverage) before drafting this plan.
- [x] F3's "only test files use the 3-arg form" claim grep-verified against every `setActiveEmbedder(` call site in the repo.
- [x] F1's "25/25 was a live A/B drill, not a committed automated test" claim confirmed against 005's implementation-summary.md and the absence of shutdown-timing assertions in `hf-model-server.vitest.ts`.

### Definition of Done
- [x] All 4 technical approaches below are implemented exactly as scoped (no drift into out-of-scope refactors). F1's test shape used the plan's own explicitly-allowed real-subprocess approach with an injected fake loadModel (not a documented alternative); F4's test shape used the plan's own explicitly-allowed in-process alternative to the subprocess fallback — see implementation-summary.md's Deviations.
- [x] Every new/updated test in tasks.md Phase 2 passes.
- [x] `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits 0.
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` returns `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Boundary-scoped hardening: each fix stays inside the exact module the review flagged, matching packet 005's own established pattern of fixing leaks at the boundary rather than inside shared cascade code.

### Key Components
- **`hf-model-server.cjs` `shutdown()`**: owns the SIGKILL failsafe timing decision (F1).
- **`mk-skill-advisor-launcher.cjs` `createChildEnv()`/`CHILD_ENV_ALLOWLIST`**: owns the child env assembly and the "already configured" signal (F2).
- **`schema.ts` `setActiveEmbedderTransactional()`**: owns the persisted-provider write semantics (F3).
- **New end-to-end test**: owns proof that the real consumer path (`shared/embeddings/factory.ts`'s DB-candidate resolution, invoked from a child-process-shaped environment) opens the correct file (F4).

### Data Flow

F1: `shutdown(signal)` currently arms one unconditional 1500ms failsafe, then calls `app.close({disposeModel: true})`, which awaits `dispose()`'s own bounded waits (`INFERENCE_DRAIN_TIMEOUT_MS` = 5000ms for in-flight inference, `MODEL_LOAD_TIMEOUT` = 120000ms for a pending load). The fix inspects in-flight state at the moment `shutdown()` is invoked and arms one of two failsafe durations accordingly, so the failsafe never races ahead of a drain that is actually happening.

F2: `createChildEnv()` currently filters `sourceEnv` through `CHILD_ENV_ALLOWLIST` (which includes `MEMORY_DB_PATH`), then only injects the advisor's own default when `filtered.MEMORY_DB_PATH` is falsy — so any ambient `MEMORY_DB_PATH` in the parent env silently wins. The fix removes `MEMORY_DB_PATH` from the generic allowlist pass-through and instead computes the child's `MEMORY_DB_PATH` explicitly from a new dedicated var (checked directly against `sourceEnv`, never blind-forwarded), falling back to `advisorDbPath()` when that dedicated var is unset. `shared/embeddings/factory.ts` still only ever reads `MEMORY_DB_PATH` from the child's env — unchanged, out of scope — but what determines that value on the launcher side no longer collides with mk-spec-memory's established meaning of the same name.

F3: `setActiveEmbedderTransactional()` currently always writes `ACTIVE_EMBEDDER_PROVIDER_KEY` inside its transaction, using `provider?.trim() ?? ''` — so an omitted 4th argument writes an empty-string sentinel unconditionally. The fix skips that write entirely when `provider === undefined` (the "omitted" case), leaving whatever was already persisted intact; an explicit empty string or a dedicated "clear" call remains available for a caller that genuinely wants to clear it (see Edge Cases below).

F4: the existing coverage only asserts `createChildEnv()`'s return value in-process. The fix adds a test that builds the exact env `createChildEnv()` would hand to the real child, then exercises it against the real consumer boundary — either the existing exported resolution entry points in `shared/embeddings/factory.ts` invoked under that env (in-process `vi.stubEnv`-style, if that suffices to reach `resolveConfiguredDatabaseCandidates()`'s private code path indirectly) or, if that proves insufficiently end-to-end, a real Node subprocess spawned with that exact env against two temp fixture sqlite files carrying distinguishable sentinel `vec_metadata` rows (one shaped like the advisor's `skill-graph.sqlite`, one shaped like mk-spec-memory's `context-index.sqlite`), asserting the resolved/reported embedder metadata matches the advisor's sentinel.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hf-model-server.cjs` `shutdown()` failsafe timer | Fixed 1500ms `setTimeout` armed unconditionally before `app.close()` | Replace with a tiered/dynamic timeout keyed off in-flight state at shutdown time; clear the timer on success | New SIGTERM-during-active-embed live test |
| `hf-model-server.cjs` `main().catch()` startup-failure failsafe | Same fixed-1500ms pattern, separate call site | Inspect only — startup failure has no in-flight embed to protect, so the fast timeout is likely still correct here; confirm during implementation, do not change blindly | Code read + existing startup-failure test path |
| `mk-skill-advisor-launcher.cjs` `CHILD_ENV_ALLOWLIST` | Includes `MEMORY_DB_PATH` for blind pass-through | Remove `MEMORY_DB_PATH` from blind pass-through; add the new dedicated override var | `launcher-bootstrap.vitest.ts` allowlist-filter tests |
| `mk-skill-advisor-launcher.cjs` `createChildEnv()` | Injects default only when `filtered.MEMORY_DB_PATH` is already falsy | Compute `MEMORY_DB_PATH` explicitly from the new dedicated var or the existing default, ignoring any ambient `MEMORY_DB_PATH` in `sourceEnv` | Updated + new `launcher-bootstrap.vitest.ts` cases |
| `launcher-bootstrap.vitest.ts` "honors an explicit parent-provided MEMORY_DB_PATH" test | Asserts the old pass-through behavior the fix removes | Update to assert the new dedicated var is honored instead | Test itself, re-run green |
| `schema.ts` `setActiveEmbedderTransactional()` | Always writes the provider key, defaulting omitted to `''` | Skip the provider-key write when `provider === undefined` | New `schema.vitest.ts` preserve-on-omit case |
| `schema.ts` `ensureActiveEmbedder()` backfill cascade | Self-heals a missing/empty provider on next read | Unchanged — confirm it remains correct now that "omitted" no longer means "cleared to empty" | Existing `ensure-active-embedder.vitest.ts` suite re-run |
| `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md` | Claims 3-arg call sites are "unchanged" | Correct the claim; cross-reference this packet | Doc read |

Required inventories:
- Same-class producers: grep confirmed exactly two call sites inside `schema.ts` itself now use the 4-arg form (`setActiveEmbedder` export and its internal transactional helper); every other repo call site (all test files) uses the 3-arg form and is a consumer, not a producer, of the write semantics.
- Consumers of changed symbols: `rg -n 'setActiveEmbedder\(' --glob '*.ts'` across the repo (18 call sites, all listed above); `rg -n 'MEMORY_DB_PATH' .opencode/bin/mk-skill-advisor-launcher.cjs .opencode/skills/system-skill-advisor/mcp_server/tests/` for the env-var consumers; `shared/embeddings/factory.ts`'s `resolveConfiguredDatabaseCandidates()` remains the sole downstream reader of the final `MEMORY_DB_PATH` value and is explicitly unchanged.
- Matrix axes (F2): {ambient `MEMORY_DB_PATH` unset, ambient `MEMORY_DB_PATH` set to an unrelated value, dedicated override var set, dedicated override var unset} × {default-injection path, explicit-override path} — implementation must cover all 4 combinations, not just the 2 the current test suite covers.
- Matrix axes (F1): {idle at shutdown, in-flight inference at shutdown, pending model-load at shutdown} × {SIGTERM, SIGINT} — implementation should cover at minimum the busy-inference × SIGTERM cell new, plus confirm the idle × {SIGTERM, SIGINT} cells still pass fast.
- Algorithm invariant (F2): the child process must never receive a `MEMORY_DB_PATH` value that was not either (a) explicitly set via the new dedicated skill-advisor var, or (b) computed by the launcher's own default. No other path may reach the child.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all 4 target files and their existing tests before drafting this plan.
- [x] Grep-verify F3's "test-only 3-arg call sites" claim and F2's "no production config sets MEMORY_DB_PATH today" claim.
- [x] Confirm F1's "25/25 was a live drill, not a committed test" claim against 005's implementation-summary.md.
- [x] Get this plan's 4 technical approaches approved before implementation starts.

### Phase 2: Core Implementation
- [x] F1: implement the tiered/dynamic shutdown-failsafe timeout in `hf-model-server.cjs`; clear the timer on success.
- [x] F1: add the SIGTERM-during-active-embed live regression test.
- [x] F2: add the dedicated skill-advisor-namespaced DB-path override var; remove `MEMORY_DB_PATH` from `CHILD_ENV_ALLOWLIST`'s blind pass-through; compute it explicitly in `createChildEnv()`.
- [x] F2: update the existing explicit-override test to the new var; add the ambient-collision regression test.
- [x] F3: skip the provider-key write in `setActiveEmbedderTransactional()` when `provider === undefined`.
- [x] F3: add the preserve-on-omit regression test; correct 005's implementation-summary.md claim.
- [x] F4: add the end-to-end DB-resolution test (in-process variant — see Architecture's explicitly-allowed alternative).

### Phase 3: Verification
- [x] Run scoped Vitest for each of the 4 findings' new/updated tests.
- [x] Run full `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck`.
- [x] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict`.
- [x] Confirm no regression in the existing `ensure-active-embedder.vitest.ts`, `schema.vitest.ts`, and `launcher-bootstrap.vitest.ts` suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live subprocess | F1 busy-shutdown (SIGTERM mid-embed) vs. idle-shutdown timing | Direct child-process spawn + signal drill, mirroring 005's own A/B verification style but as a committed test |
| Unit/Vitest | F2 env-var precedence matrix, F3 preserve-on-omit provider write | `npx vitest --run launcher-bootstrap`, `npx vitest --run schema` (scoped to `system-skill-advisor/mcp_server`) |
| End-to-end | F4 real DB-resolution path under the launcher-derived env | New Vitest spec exercising the actual consumer boundary (subprocess or closest faithful in-process equivalent) |
| Typecheck | `schema.ts` compile contract after the F3 change | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` |
| Spec validation | Level 2 packet completeness | `validate.sh <this-packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 005 Round 2 shipped code (predecessor) | Internal | Green | This packet plans fixes for gaps in already-shipped code; no blocking dependency on further 005 work. |
| `shared/embeddings/factory.ts`'s public resolution entry points | Internal | Green (out of scope to modify) | If the public surface proves insufficient for a faithful F4 end-to-end test, implementation must choose the subprocess-spawn fallback described in Architecture rather than modifying the shared factory. |
| Live daemon for F1's shutdown drill | Runtime | Yellow | The live SIGTERM-during-embed test needs a real spawned `hf-model-server.cjs` process (not just an in-process mock) to genuinely exercise the native `dispose()` path; implementation must confirm this is feasible in CI/sandbox before committing to the exact test shape. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the 4 fixes regresses existing green tests, or the F1 shutdown-timing change measurably slows idle daemon restarts.
- **Procedure**: Revert the scoped changes to the single file each finding touches (see Files to Change in spec.md); each fix is independent, so a regression in one does not require reverting the other three.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Setup | This packet's spec/plan approval | Gate 3 documentation and an approved technical approach must exist before any code changes land. |
| Core Implementation | Setup | Each of the 4 fixes needs its target file's current behavior traced first (already done for this plan; must be re-confirmed by whoever implements, since the tree may have moved). |
| Verification | Core Implementation | The new/updated tests only prove anything once the corresponding fix exists; running them first would just document the pre-fix bugs, not verify the fixes. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Area | Estimate | Notes |
|------|----------|-------|
| F1 (shutdown failsafe) | Medium | Small code change, but the live SIGTERM-during-embed test needs careful subprocess orchestration to be deterministic. |
| F2 (env var rename) | Low-Medium | Small code change; touches one existing test's semantics plus one new test. |
| F3 (preserve-on-omit) | Low | Small, localized code change; straightforward regression test. |
| F4 (e2e DB-resolution test) | Medium | No code change to production, but designing a faithful, CI-deterministic end-to-end test against a boundary that spans two packages (`system-skill-advisor`'s launcher, `system-spec-kit`'s shared factory) takes real design care. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

Rollback is finding-scoped. Each of F1-F4 touches exactly one production file (see Files to Change in spec.md); reverting any single finding's change does not require touching the other three. No data migrations are involved in any of the 4 fixes.
<!-- /ANCHOR:enhanced-rollback -->
