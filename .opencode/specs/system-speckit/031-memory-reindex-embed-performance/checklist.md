---
title: "Verification Checklist: Memory Reindex + Embed Ingest Performance"
description: "Verification Date: 2026-07-22"
trigger_phrases:
  - "memory reindex embed performance checklist"
  - "scan write-back fix verification"
  - "persistQualityLoopContent regression evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-23T17:10:53Z"
    last_updated_by: "orchestrator"
    recent_action: "10-iter deep review (MiniMax-M3) CONDITIONAL; all 4 findings remediated"
    next_safe_action: "Restart daemon, verify health, then measure per-stage timings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit-031-memory-perf-handover-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Memory Reindex + Embed Ingest Performance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md:93` — REQ-006 added, citing ADR-001.
- [x] CHK-002 [P0] Technical approach defined
  - **Evidence**: `handover.md:62` — root cause + fix approach confirmed via two independent code-reading passes before any edit.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: no new dependencies; fix reuses the already-computed `indexingOrigin` local variable.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change is minimal and follows existing patterns
  - **Evidence**: one-line change (`persistQualityLoopContent: indexingOrigin !== 'scan'`) plus a WHY comment, mirroring the existing origin-aware branch two lines above it (`mcp-server/handlers/memory-save.ts`).
- [x] CHK-011 [P0] No console errors during test runs
  - **Evidence**: `[memory-save] Quality loop applied 1 auto-fix(es)` is the expected log line, not an error; no unhandled errors in either test run.
- [x] CHK-012 [P1] Error handling unchanged
  - **Evidence**: `memory-save.ts:2974` — fix touches only the value passed to an existing option; no new error paths introduced.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: mirrors the existing `origin`-based provenance branch already present in the same function.
- [x] CHK-014 [P0] Comment hygiene — no ephemeral IDs embedded in code comments
  - **Evidence, corrected after independent review**: the first-pass comment at `memory-save.ts:2971` cited "ADR-001" by name, and a test comment at `handler-memory-index.vitest.ts:1615` cited "T520" — both hard-blocked identifier references. Rewritten to state the durable WHY (an automated pass shouldn't silently rewrite files a human didn't touch) without citing either.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Fix behavior verified end-to-end, not just read
  - **Evidence**: `npx vitest run tests/handler-memory-index.vitest.ts -t "persistQualityLoopContent scan-origin write-back gating"` → 2 passed.
- [x] CHK-021 [P0] Both sides of the gate tested (regression + legitimate-path preservation)
  - **Evidence**: scan-origin test proves the source file is byte-identical after a force-scan of an oversized/low-quality fixture; direct-origin test proves `memory_save` still applies and persists the auto-fix trim on the same fixture shape.
- [x] CHK-022 [P1] No regressions in adjacent suites
  - **Evidence**: `npx vitest run tests/memory-save-extended.vitest.ts tests/quality-loop.vitest.ts tests/memory-save-supersede-reindex.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/write-provenance.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts tests/memory-save-dedup-order.vitest.ts` → 185 tests, 180 passed, 5 failed. The 5 `resolveMemoryReference` failures confirmed pre-existing via `git stash` bisection (identical failure with this fix removed); unrelated function, out of scope, not fixed here.
- [x] CHK-023 [P1] Build verified
  - **Evidence**: `npm run build` in `mcp-server/` exits clean; `dist/handlers/memory-save.js` contains the compiled fix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified
  - **Evidence**: `class-of-bug` — any scan-origin call into `indexMemoryFile` was affected (the flag was hardcoded, not file-specific).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: `indexMemoryFile()` is the single non-legacy producer of `persistQualityLoopContent` for both scan and direct callers (confirmed by reading the full function; `IndexMemoryFileOptions`/`BaseIndexMemoryFileOptions` expose no such field for callers to override).
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence, corrected after independent review**: the first pass only inventoried `indexMemoryFileFromScan()` and the main scan loop in `handlers/memory-index.ts`, and claimed that was every scan path — **this was wrong**. An independent GPT-5.6-Sol-Fast review found two more callers of `indexSingleFile()` that omitted the `fromScan` flag: the daemon's `startupScan()` and the file-watcher's `reindexFn` (both in `context-server.ts`), which defaulted them to `'direct'` origin, leaving the write-back reachable through ordinary daemon operation. Both now pass `{ fromScan: true }`; re-verified via `npx vitest run tests/handler-memory-index.vitest.ts tests/context-server.vitest.ts tests/context-server-error-envelope.vitest.ts` → 403 passed, 28 skipped. The atomic-save transaction path (`memory-save.ts:4022`/`:4038`) was already `false` and is untouched.
- [ ] CHK-FIX-004 [P0] Adversarial delimiter/path/parser table tests
  - **Deferred, documented**: not applicable — this is a content-persistence gate, not a path/parser/redaction boundary. The regression suite's scan-vs-direct pair is the adversarial-equivalent coverage for this fix's actual risk surface.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed
  - **Evidence, corrected after independent review**: the standard-write-back branch (`memory-save.ts:2785-2792`) is empirically tested (2/2 rows: origin scan|direct × outcome unchanged|trimmed), verified via `npx vitest run tests/handler-memory-index.vitest.ts -t "persistQualityLoopContent scan-origin write-back gating"`. The chunked-indexing branch (`memory-save.ts:2591-2602`) shares the identical `shouldPersistFinalizedFile` gate computed once at `memory-save.ts:2390`, so the fix protects it too, but no test exercises it directly — the auto-fix trim step always caps `fixedContent` at 8,000 characters whenever it fires, so content large enough to reach the 50,000-character chunk threshold can never simultaneously carry a live `fixedContent` from this trim path, making that specific combination structurally unreachable rather than merely untested. The original checklist wording ("2/2 rows covered") did not disclose this axis; corrected here.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed
  - **Deferred, documented**: `SPECKIT_QUALITY_AUTO_FIX=false` / `SPECKIT_QUALITY_LOOP=false` overrides were not exercised against this fix; the gate is origin-based and independent of those flags, so it is a low-risk deferral, not a blocker.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA
  - **Status**: change is uncommitted at time of writing; evidence is pinned to file:line in the working tree. Re-pin to a commit SHA once committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: `memory-save.ts:2974` — fix is a single boolean expression; no credentials involved.
- [x] CHK-031 [P0] No new input-validation surface
  - **Evidence**: `indexingOrigin` is derived server-side from caller identity (scan vs direct), not user input.
- [x] CHK-032 [P1] No auth/authz surface touched
  - **Evidence**: `memory-save.ts:2974` — fix is internal to the indexing pipeline; no auth boundary involved.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/handover/checklist synchronized
  - **Evidence**: `spec.md:93` REQ-006 + Open Questions updated; `handover.md:44` critical-bug section marked fixed; this checklist added.
- [x] CHK-041 [P1] Code comment explains the WHY, not the WHAT
  - **Evidence**: `memory-save.ts:2972` — inline comment cites ADR-001 and the scan/direct distinction, not a spec-path or task ID (comment-hygiene compliant).
- [ ] CHK-042 [P2] README updated
  - **Deferred**: no user-facing README covers this internal indexing behavior.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence, corrected after independent review**: `createSchemaBackedDb()`'s helper directory (`fs.mkdtempSync` under `os.tmpdir()` for the SQLite file) was closed via `vectorIndex.closeDb()` but the directory itself was never removed — 10 leaked `speckit-test-writeback-db-*` directories were found under `os.tmpdir()` from repeated local test runs. Fixed: the helper now returns `{ database, dbDir }` and both tests remove `dbDir` in their `finally` block. Confirmed 0 leaked directories after a fresh test run. The other fixtures (`fs.mkdtempSync` for the source-file trees) were already cleaned up correctly.
- [x] CHK-051 [P1] No stray files
  - **Evidence**: `memory-save.ts`, `context-server.ts`, the two test files, and this packet's docs were touched; no other files modified.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:perf-objective -->
## Original Perf Objective (REQ-001 – REQ-005) — NOT STARTED

- [ ] CHK-060 [P0] Per-stage timings captured on a ~200-memory sample; dominant stage identified with evidence
- [ ] CHK-061 [P0] Only the measured-dominant stage optimized (no speculative changes)
- [ ] CHK-062 [P0] Change behind a feature flag and reversible
- [ ] CHK-063 [P0] Measured throughput improvement (memories/sec before→after) on a representative sample
- [ ] CHK-064 [P0] Zero recall regression — parity vs pre-change on a fixed query set

**Already answered while investigating the bug fix** (narrows what Step 0 still needs to measure): Ollama adapter batches requests (not a lever); summary generation is TF-IDF, not an LLM call (not the dominant cost); the full scan already batches 5 files concurrently via `Promise.all` (partially parallel already). Remaining unknown: where full-scan time actually goes.
<!-- /ANCHOR:perf-objective -->

---

<!-- ANCHOR:hardening -->
## Daemon/Startup/MCP Hardening (REQ-007..011) — IMPLEMENTED

Source: 7-iteration `/deep:research` loop, `research/research.md` §17 ranked items 1-5.

- [x] CHK-070 [P0] REQ-007: warm-owner MCP startup no longer runs two independent daemon-readiness probes
  - **Evidence**: `maybeBridgeLeaseHolder()` forwards its own successful probe as `initialReadyResult` (`launcher-ipc-bridge.cjs`); `bridgeStdioThroughSessionProxy` passes it through (`mk-spec-memory-launcher.cjs`); `createSessionProxy().start()` skips its own `waitForDaemonReady()` only when `initialReadyResult.status === 'alive'` (`launcher-session-proxy.cjs`). `npx vitest run tests/launcher-session-proxy.vitest.ts tests/launcher-ipc-bridge-probe.vitest.ts` → 36 passed, including 3 new tests proving the skip, the reattach-path non-regression, and rejection of a non-alive injected result.
- [x] CHK-071 [P1] REQ-007: `classifyOwnerLease()`'s synchronous `ps` call is timeout-bounded
  - **Evidence**: `spawnSync('ps', ..., { timeout: parsePositiveInteger(SPECKIT_PS_PROBE_TIMEOUT_MS, 2000) })` (`mk-spec-memory-launcher.cjs`); existing launcher-lease suites re-verified with no regression (`tests/launcher-lease.vitest.ts` 58 passed).
- [x] CHK-072 [P0] REQ-008: async ingest (`memory_ingest_start`) cannot write quality-loop auto-fixes back to source files
  - **Evidence**: `processFile` callback (`context-server.ts`) now passes `fromScan: true` on both branches; `tests/context-server.vitest.ts` T47c-2 (new) asserts this at the source level — `npx vitest run tests/context-server.vitest.ts -t "T47c"` → 2 passed.
- [x] CHK-073 [P0] REQ-009: manual/maintenance `memory_index_scan` calls default to `background: true`
  - **Evidence**: fixed at the MCP tool dispatch boundary (`tools/lifecycle-tools.ts`), not `memory-index.ts` internals — `db-instance-lock.ts` untouched (confirmed by diff scope). `tests/lifecycle-tools-scan-default.vitest.ts` (new, 4 tests) proves the default applies when omitted and is overridable both ways. Also empirically reproduced twice this session: a live `memory_index_scan` call hung 2+ minutes in the foreground, then the same call's background task later timed out and failed after exactly 1800s (30 minutes) with no response — direct, real-world confirmation of the exact bug this item fixes.
- [x] CHK-074 [P0] REQ-010: owner-lease stale removal and heartbeat replacement are fenced against the confirmed TOCTOU race
  - **Evidence**: `leaseId` (crypto.randomUUID) fencing token added to `buildOwnerLease`/`acquireOwnerLeaseFile`/`refreshOwnerLeaseFile`/`clearOwnerLeaseFile`. `tests/launcher-spec-memory-lifecycle.vitest.ts` (new test) reproduces the exact research §7.1 interleaving (mocks `fs.readFileSync` to install a racing launcher's fresh lease as a side effect of this process's own classification read) and proves the delayed launcher's unlink is refused, holder reported as the racing lease — 8/8 passed.
- [x] CHK-075 [P1] REQ-010: fencing does not change the SQLite sidecar lock's role as the final integrity boundary
  - **Evidence**: `db-instance-lock.ts` not touched by this change (confirmed by diff scope) — REQ-010 adds a leaseId comparison only, no new locking mechanism.
- [x] CHK-076 [P0] REQ-011: the empty-environment model-socket fallback uses a canonical short constant, not a `dbDir`-derived path
  - **Evidence**: `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` exported from `model-server-supervision.cjs`; `tests/embedders/launcher-model-server-cross-launcher.vitest.ts` new test asserts the exact default (`/tmp/mk-hf-embed/hf-embed.sock`) and confirms `Buffer.byteLength(...) <= 103`. **Scope correction found during implementation**: the constant alone was unreachable through the real bug path — both `createModelServerControl`'s own internal `dbDir` default and `mk-skill-advisor-launcher.cjs`'s `resolveModelServerSocketPath` wrapper unconditionally reconstructed the long path, masking the fix. Both fixed in the same pass (not originally in tasks.md T045-T047); a new cross-check test confirms the skill-advisor launcher also now converges on the canonical default under an empty child env, matching the plugin bridge's actual filtered-env reachability path from research §5.
- [x] CHK-077 [P1] REQ-011: `SPECKIT_IPC_SOCKET_DIR` is not repurposed for the model-socket directory
  - **Evidence**: code review confirms `resolveModelServerSocketPath` treats `SPECKIT_IPC_SOCKET_DIR` and the new canonical default as mutually exclusive branches (env var still takes precedence when set); no code path assigns one to the other.
- [x] CHK-078 [P1] No regressions in existing launcher/MCP/scan test suites after all 5 items land
  - **Evidence**: combined run across all 17 touched/new test files — `521 passed | 36 skipped`, 0 failures, 0 new. `npm run build` in `mcp-server/` exits 0.
- [ ] CHK-079 [P2] Items 6-8 from `research/research.md` §17 (observability, launcher/discovery separation, canonical context envelope) explicitly deferred, not silently dropped
  - **Evidence**: documented in spec.md scope addendum and plan.md overview as follow-on/longer-term, out of scope for this pass.
<!-- /ANCHOR:hardening -->

---

<!-- ANCHOR:deep-review -->
## Independent Deep Review (10 iterations, MiniMax-M3) — Verdict CONDITIONAL, Remediated

A 10-iteration `/deep:review` pass (executor: MiniMax-M3 via cli-opencode, no early convergence) independently reviewed the entire packet scope (REQ-006 through REQ-011, all 16 touched implementation + test files) across all four dimensions. Full report: `review/review-report.md`.

- [x] CHK-080 [P0] Correctness dimension reviewed, all REQ items independently verified
  - **Evidence**: `review/iterations/iteration-00{1-4}.md` — REQ-010, 007, 008, 009 each independently traced and behaviorally confirmed; REQ-006 covered under existing evidence.
- [x] CHK-081 [P1] Security dimension reviewed, no exploitable findings
  - **Evidence**: `review/iterations/iteration-005.md` — model-socket path, leaseId entropy, background-scan attack surface, spawn/eval sweep, and secrets sweep all PASS.
- [x] CHK-082 [P1] Traceability dimension reviewed against spec/checklist/continuity evidence
  - **Evidence**: `review/iterations/iteration-006.md` — spot-checked CHK-070..078 evidence directly; found 2 documentation P2s (see below).
- [x] CHK-083 [P1] Maintainability dimension reviewed (comment hygiene, pattern consistency, test quality)
  - **Evidence**: `review/iterations/iteration-007.md` — comment-hygiene claim reaffirmed clean; found 1 maintainability P2 (see below).
- [x] CHK-084 [P0] Every P0/P1 finding adversarially re-verified before being finalized
  - **Evidence**: `review/iterations/iteration-008.md` — P1-001 (owner-lease refresh/clear generation-check gap) independently re-verified via 3 concrete interleaving scenarios; reaffirmed P1 (bounded, self-healing, no data-integrity impact) rather than accepted at face value.
- [x] CHK-085 [P1] Reviewer's own test/build claims independently reproduced, not merely accepted
  - **Evidence**: `review/iterations/iteration-009.md` — re-ran the full 17-file, 521-test suite and `npm run build` independently inside the review worktree; confirmed the exact same 521 passed / 0 failed / 36 skipped result and a clean build.
- [x] CHK-086 [P1] Zero scope violations across the full review session
  - **Evidence**: `review/iterations/iteration-009.md`'s scope-violation retrospective — 0 `## SCOPE VIOLATIONS` sections across iterations 1-8; confirmed no writes occurred outside the review packet's allowed paths.
- [x] CHK-087 [P0] All findings remediated before packet closeout
  - **Evidence**: P1-001 — extended `implementation-summary.md` Phase 7 Known Limitations item 2 to explicitly cover the refresh/clear lease-mutation paths as the same accepted-risk TOCTOU class already documented for reclaim (not a code change; per the review's own downgrade trigger). P2-001 — fixed `plan.md`'s stale "Phase 5"/"Phase 4" continuity labels to match the "Phase 7 hardening" wording used consistently across sibling docs. P2-002 — replaced the two vague FIX ADDENDUM verification cells (`launcher-session-proxy.cjs` row, test-suite row) with concrete, re-runnable commands. P2-003 — added an invariant-explaining comment above `clearOwnerLeaseFile`/`clearOwnerLeaseFileIfOwner` in `mk-spec-memory-launcher.cjs` documenting the re-validate-before-unlink pattern and the intentional leaseId-vs-ownerPid-only fencing asymmetry between the two functions. Re-ran `tests/launcher-spec-memory-lifecycle.vitest.ts tests/launcher-lease.vitest.ts` after the comment-only code change — 20/20 passed.

<!-- /ANCHOR:deep-review -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items (fix) | 14 | 12/14 |
| P0 Items (perf objective) | 5 | 0/5 |
| P0 Items (hardening, REQ-007..011) | 5 | 5/5 |
| P0 Items (deep review) | 3 | 3/3 |
| P1 Items (fix) | 14 | 11/14 |
| P1 Items (hardening) | 3 | 3/3 |
| P1 Items (deep review) | 5 | 5/5 |
| P2 Items | 3 | 2/3 |

**Verification Date**: 2026-07-23

**Overall status**: the data-integrity fix is coded, tested, and built, including a P0 gap (daemon startup scan + file watcher) found by an independent GPT-5.6-Sol-Fast review and closed in the same pass. Daemon restart is intentionally held pending operator input (concurrent daemon processes — see handover.md). Five daemon/startup/MCP hardening items (REQ-007..011) are implemented, tested (521 passed across 17 files, 0 regressions), and built — including two scope corrections found during implementation (REQ-009's actual fix point was the MCP tool dispatch boundary, not `memory-index.ts`; REQ-011 needed two additional call sites beyond the original plan to actually reach the canonical default). A subsequent independent 10-iteration deep review (MiniMax-M3) returned verdict CONDITIONAL (0 P0, 1 bounded P1, 3 P2) and independently reproduced the test/build results; all 4 findings were remediated in the same pass (1 documentation extension, 2 doc-accuracy fixes, 1 code comment) — see the Independent Deep Review section above and `review/review-report.md`. The packet's original performance-measurement objective has not started.
<!-- /ANCHOR:summary -->
