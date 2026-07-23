# Deep Review Iteration 003

## Dimension

Correctness — REQ-008 async-ingest `fromScan` fix verification plus same-class producer sweep. Goal: confirm the implementer's claim that the `processFile` callback registered with `initIngestJobQueue` was the LAST missing-`fromScan` call site, audit the test assertions, and audit the job-queue crash-recovery replay path for any separate re-entry point that could bypass the fix.

## Files Reviewed

| File | Lines touched | Claim verified |
|---|---:|---|
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | 2440-2464, 1729, 2485-2499 | `processFile` ingest callback (governance + provenance branches) both pass `fromScan: true`; the two same-class producers (`startupScan` at :1729, file-watcher `reindexFn` at :2488) also pass `fromScan: true`. |
| `.opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts` | 84-86, 117, 584-664, 700-751 | Crash-recovery reset path (`resetIncompleteJobsToQueued` + `enqueueIngestJob` loop in `initIngestJobQueue`) re-enters through the same `processFileFn` callback registered at boot, so the fix is inherited. |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts` | 537-556, 1530-1543 | `indexSingleFile` correctly forwards `fromScan` through options into `indexMemoryFile`; the `handleMemoryIndexScan` worker loop already passes `fromScan: true` (line 1536). |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | 2215-2260, 2905-2920 | `fromScan` is consumed by `resolveIndexingOrigin` to produce `indexingOrigin` which gates `persistQualityLoopContent` — not a same-class producer for this fix. |
| `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts` | 2568-2581, 2583-2586 | T47c + T47c-2 are purely source-pattern regex assertions over the compiled `sourceCode` blob; T47c-2 specifically matches the governance and provenance branches' `fromScan: true` placement. Pattern mirrors T47d (REQ-006). |
| `.opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts` | 855-1018, 1042-1118 | Existing runtime tests exercise the gate's *consumer* (the `persistQualityLoopContent` branch in `indexMemoryFile` / `memory-save.ts`), not every caller — so REQ-008's per-caller guarantee depends on the source-pattern test. |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/implementation-summary.md` | 193, 207, 236 | Implementer claims (a) `processFile` passes `fromScan: true` on both branches, (b) the fix mirrors how `startupScan`/file-watcher were closed earlier in the packet, (c) build verified the compiled output contains the fix. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

#### Verification claims adjudicated (no severity warranted)

#### VERIFY-008-1 — `processFile` callback passes `fromScan: true` on both branches

- **File:** `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:2442-2456`
- **Spec evidence:** REQ-008 (sync origin-gating must hold across queued/crash-replayed ingest, per `implementation-summary.md:158-165`)
- **Claim:** Both branches of the `processFile` arrow function registered with `initIngestJobQueue` pass `fromScan: true`:
  - Governance branch (`:2446-2447`): `await indexSingleFile(filePath, false, governance ? { governance, fromScan: true } : { provenance: {...}, fromScan: true })` — the truthy-`governance` arm emits `{ governance, fromScan: true }`.
  - Provenance branch (`:2448-2455`): the falsy-`governance` arm emits `{ provenance: { provenanceSource: 'memory_ingest_start', provenanceActor: 'async-ingest', tool: 'memory_ingest_start' }, fromScan: true }` with the `fromScan: true` key as the last property before the closing brace, matching the regex target at `tests/context-server.vitest.ts:2580`.
- **Evidence refs:** Direct read of `:2440-2464`. The conditional is `governance ? {governance,fromScan:true} : {provenance:{...},fromScan:true}` — both arms carry `fromScan:true`. The fix comment at `:2444-2445` documents the rationale ("fromScan: true keeps this queued/crash-replayed path from writing quality-loop auto-fixes back to source docs, same as the startupScan/file-watcher gate"), confirming the implementer's intent is identical to the earlier REQ-006 closure of the same class of bypass.
- **Counterevidence sought:** any guarded path or shortcut that bypasses the conditional and calls `indexSingleFile` without `fromScan`. The callback body is exactly `await indexSingleFile(filePath, false, governance ? { ... } : { ... })` — no early return, no alternate branch, no helper indirection. The `governance` parameter is the only conditional input and is null/undefined for the no-governance path, which lands in the provenance arm that also sets `fromScan: true`.
- **Alternative explanation:** a developer could attempt to "optimize" the conditional into separate calls or use a default parameter — current code does neither, and the source-pattern regex T47c-2 pins both arms' shape.
- **Final severity:** no finding — verified correct.
- **Confidence:** 0.99.
- **Downgrade trigger:** if either arm's `fromScan: true` were dropped (or moved to a separate options-builder that only ran for one branch), T47c-2 would catch it on the source side; a runtime miss would require bypassing `indexSingleFile` entirely.

#### VERIFY-008-2 — Same-class producer sweep is complete (no third caller missed)

- **File:** `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1729, 2488`; `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1536`
- **Spec evidence:** REQ-006 / REQ-008 symmetry ("the daemon's own `startupScan()` and its file-watcher reindex callback both bypassed this gate … those two call sites were fixed in the same pass", `implementation-summary.md:62-65`); REQ-008 extends the same gating to the async-ingest producer.
- **Claim:** Independently reproducing `rg -n "fromScan" .opencode/skills/system-spec-kit/mcp-server --type ts` (excluding `dist/`) returns exactly the following production call sites that emit `fromScan: true`:
  1. `context-server.ts:1729` — `startupScan()` synchronous per-file indexer.
  2. `context-server.ts:2447` and `:2454` — the new `processFile` callback (REQ-008 fix).
  3. `context-server.ts:2488` — file-watcher `reindexFn`.
  4. `handlers/memory-index.ts:1536` — `handleMemoryIndexScan` worker loop, the synchronous handler behind `memory_index_scan` tool dispatch.
  The remaining `fromScan` hits in `handlers/memory-index.ts:542, 551` are the `indexSingleFile` signature and forwarding body (not a producer); hits in `handlers/memory-save.ts:2219, 2232, 2247, 2257, 2910, 2914` are the consumer side (`resolveIndexingOrigin` + the `indexingOrigin` provenance field + a `fromScan?: never` type guard on the public `memory_save` schema) — none of which produce an indexing path.
- **Evidence refs:** Independent `rg` reproduction (above) returns 4 producer-side emits and a handful of consumer-side reads; no fifth producer. The four producers cover every scan-like / unattended / queued entry point in `mcp-server/` that calls `indexSingleFile`. `memory-save.ts`'s save path is correctly *not* a `fromScan: true` producer — that is the entire point of the origin gate (direct saves keep their legitimate auto-fix write-back per NFR-DI02 at `implementation-summary.md:136`).
- **Counterevidence sought:** any internal call to `indexMemoryFile` (the lower-level function `indexSingleFile` delegates to) that bypasses `fromScan`. Grep for `indexMemoryFile(` returns the same producers plus its own definition in `handlers/memory-save.ts`; no other call site exists.
- **Alternative explanation:** if a future caller invoked `indexSingleFile(filePath, false, {})` (no `fromScan` key) — equivalent to `fromScan: undefined` — it would inherit the direct-origin write-back. Current code does not contain such a caller.
- **Final severity:** no finding — sweep complete, matches implementer's claim.
- **Confidence:** 0.95.
- **Downgrade trigger:** any future addition of a `indexSingleFile` / `indexMemoryFile` caller that omits `fromScan` would be a new REQ-008 violation; the source-pattern test does not catch this because it only matches the specific `processFile` block, not all call sites.

#### VERIFY-008-3 — Job-queue crash-recovery replay path inherits the fix

- **File:** `.opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts:84-86, 117, 227-250, 584-664, 700-751`
- **Spec evidence:** REQ-008 includes crash-replayed ingest (`implementation-summary.md:159-163`: "ingest jobs are queued and, on daemon restart, **crash-replayed from scratch** — meaning the same destructive write-back this pass closed for `startupScan`/file-watcher is still reachable through unattended startup recovery")
- **Claim:** The crash-recovery replay path does not have its own re-entry point; it goes through the SAME `processFileFn` callback registered at boot:
  1. `initIngestJobQueue()` at `:739-751` calls `resetIncompleteJobsToQueued()` (`:745`) and then loops `enqueueIngestJob(jobId)` (`:746-748`) for each reset ID.
  2. `resetIncompleteJobsToQueued()` (`:227-250`) only UPDATEs the `ingest_jobs` DB row back to `state='queued'` and clears `files_processed` and `errors_json`; it does NOT directly call any indexer.
  3. `enqueueIngestJob()` (`:700-733`) pushes the jobId into `pendingQueue` and starts the `drainQueue()` worker via `setImmediate`.
  4. `drainQueue()` (`:668-698`) loops over `pendingQueue`, calling `processQueuedJob(jobId)` per item.
  5. `processQueuedJob()` (`:584-664`) at `:635` invokes `await processFileFn(nextPath, current.governance)` — this is the exact callback registered at `context-server.ts:2443`.
- **Evidence refs:** Direct read of `:739-751` (init), `:700-733` (enqueue), `:668-698` (drain), `:635` (worker invocation). `processFileFn` is the module-scoped variable at `:117`, assigned only once in `initIngestJobQueue()` at `:740` from `config.processFile`. There is no second registration, no alternate callback for replay, and no path that calls `indexSingleFile` directly bypassing the callback.
- **Counterevidence sought:** a different `processFile` closure registered at any later point that could shadow the original. Module-level `processFileFn` is a `let` assigned only in `initIngestJobQueue`; the module exports neither a setter nor a re-init function. Grep confirms `processFileFn` is referenced only in `:117` (declare), `:585-587` (worker guard), `:635` (worker invocation), and `:740` (init assignment).
- **Alternative explanation:** a future refactor that split `initIngestJobQueue` into "register callback" and "start worker" phases could conceivably allow a second registration — but the current code's single-assignment pattern makes this impossible without a deliberate refactor that the source-pattern T47c-2 would not catch.
- **Final severity:** no finding — replay path inherits fix.
- **Confidence:** 0.97.
- **Downgrade trigger:** if `processFileFn` were reassigned or if a second worker entry point were added without `fromScan: true`, the crash-recovery guarantee would break silently because the source-pattern test only pins the boot-time callback shape, not the replay path's identity with it.

#### VERIFY-008-4 — T47c / T47c-2 are source-pattern only, but consistent with T47d convention; a real coverage gap exists

- **File:** `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts:2568-2581`
- **Spec evidence:** REQ-006 verification (`implementation-summary.md:119-123`) established that runtime regression coverage lives in `handler-memory-index.vitest.ts` (real-DB harness) and source-pattern coverage lives in `context-server.vitest.ts` (T47c/T47c-2/T47d) for the call-site shape.
- **Claim:** T47c (`:2568-2570`) and T47c-2 (`:2575-2581`) are purely regex assertions over a captured `sourceCode` string:
  - T47c regex-matches `/processFile:\s*async\s*\(filePath:\s*string,\s*governance\)\s*=>\s*\{[\s\S]*?await\s+indexSingleFile\(filePath,\s*false[,)][\s\S]*?\}/` against the source text — i.e., "the callback exists, takes `(filePath, governance)`, and `await indexSingleFile(filePath, false, ...)` is inside it."
  - T47c-2 first extracts the `processFile` block via `/processFile:\s*async\s*\(filePath:\s*string,\s*governance\)\s*=>\s*\{[\s\S]*?\n\s{8}\},/` and then asserts two sub-regexes: (a) the governance ternary emits `{ governance, fromScan: true }`, and (b) the provenance branch emits `fromScan: true` immediately after the `provenance` object.
  - Neither test invokes the callback at runtime, mocks `indexSingleFile`, or asserts any DB / filesystem side-effect.
- **Evidence refs:** Direct read of `:2568-2581`. The captured `sourceCode` is read at the top of the file (the surrounding `describe` block reads the production source as a string); the test bodies contain only `expect(...).toMatch(...)` calls. There is no `await processFile(...)` invocation in the test bodies.
- **Counterevidence sought:** any runtime assertion, any DB write check, or any `vi.mock` of `indexSingleFile` inside T47c or T47c-2. None present — the tests are pure source-pattern.
- **Alternative explanation:** T47c-2's regex matches the exact source text, so deleting `fromScan: true` from either branch fails the test immediately. The tests pin the source shape against accidental regression, which is the same convention T47d (`:2583-2586`) uses for the file-watcher `reindexFn`. The deeper runtime correctness (does `fromScan: true` actually gate `persistQualityLoopContent`?) is covered by the two real-DB tests in `handler-memory-index.vitest.ts` (referenced at `implementation-summary.md:73, 119`). The gap is therefore between the GATE (covered at runtime) and the CALLER (covered by source-pattern) — not a real correctness hole, but a structural asymmetry.
- **Final severity:** no finding — convention-consistent; documented for awareness.
- **Confidence:** 0.93.
- **Downgrade trigger:** if a future caller added an `indexSingleFile` invocation that omits `fromScan` outside the `processFile` block, T47c-2 would not catch it; this is a known structural asymmetry of source-pattern tests, not specific to this fix. Recommend documenting the convention in `checklist.md` next to the existing "chunked-branch coverage documented as structurally unreachable" entry (`implementation-summary.md:155-157`).

## REQ-008 Hypothesis Adjudication

The implementation-summary claim at `:193` ("the `memory_ingest_start` worker callback (`processFile` in `context-server.ts`) now passes `fromScan: true` on both its governed and provenance branches, closing the residual write-back gap the same way `startupScan`/file-watcher were closed earlier in this packet") is accurate. Four independent verification points confirm the intended behavior with file:line evidence:

1. The two-branch shape of the conditional in `processFile` (`:2442-2456`) emits `fromScan: true` regardless of `governance` truthiness — confirmed by direct read and by the T47c-2 regex target.
2. Independent `rg` reproduction over `mcp-server/` returns exactly four `fromScan: true` producers (startupScan, processFile, file-watcher, `handleMemoryIndexScan` worker) — no missed caller.
3. The crash-recovery replay path traverses `resetIncompleteJobsToQueued` → `enqueueIngestJob` → `drainQueue` → `processQueuedJob` → `processFileFn`, where `processFileFn` is the same callback registered at boot. There is no separate replay entry point.
4. T47c and T47c-2 are source-pattern only, matching the established T47d convention; runtime correctness of the `fromScan`-gated `persistQualityLoopContent` branch is already covered by `handler-memory-index.vitest.ts` per `implementation-summary.md:73, 119`.

The REQ-008 closure mirrors the REQ-006 closure structurally — same class of bypass (unattended indexing without `fromScan`), same fix pattern (pass the origin flag), same test convention (source-pattern at the call site + runtime at the gate). The implementation-summary's own framing at `:62-65` ("fixed in the same pass") is therefore evidence-consistent and reviewer-confirmed.

The only residual observation is the structural asymmetry of source-pattern coverage (VERIFY-008-4): if a future `indexSingleFile` caller outside the `processFile` block omits `fromScan`, T47c-2 will not catch it. This is the same class of "all call sites must carry the flag" risk that REQ-006's P0 review finding exposed for `startupScan`/file-watcher, and the same defense — independent review with a `rg` sweep — applies going forward. Recommend this be documented in `checklist.md` next to the existing "chunked-branch coverage" caveat at `implementation-summary.md:155-157`, but it is not blocking.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | passed for REQ-008 | `implementation-summary.md:193` matches `context-server.ts:2442-2456` (callback) + `:1729, 2488` (same-class producers); `:739-751` + `:635` (crash-replay inheritance). |
| `checklist_evidence` | pending | T47c-2 is the cited evidence for the `fromScan` shape; need to confirm CHK for REQ-008 in `checklist.md` once located — not blocking this iteration since the implementer documents the evidence chain end-to-end at `implementation-summary.md:193, 236`. |
| `feature_catalog_code` | notApplicable | No feature-catalog entry under REQ-008. |
| `skill_agent` | notApplicable | No skill-authoring change. |
| `agent_cross_runtime` | notApplicable | No agent-definition change. |
| `playbook_capability` | notApplicable | No playbook change. |

## SCOPE VIOLATIONS

None. Reviewed files remained read-only; writes were limited to the four authorized review-state paths.

## Verdict

PASS — REQ-008 matches its implementation-summary and spec claims. No new findings; the newFindingsRatio for this dimension is 0.0.

The closure pattern is structurally identical to REQ-006 (origin-gating fix with a missed-sibling call site caught by independent review), which gives high confidence that the producer sweep genuinely covers the same class of bypass. The T47c/T47c-2 source-pattern convention is consistent with T47d; the deeper runtime coverage at the gate lives in `handler-memory-index.vitest.ts` per the existing two-test suite.

Caveat (carried as VERIFY-008-4 observation, not a finding): source-pattern tests pin the SHAPE of the `processFile` callback but cannot pin that every other `indexSingleFile` caller carries `fromScan`. Future iterations that add new unattended / queued / scan-like indexing entry points should re-run this same `rg "fromScan"` sweep before merging.

## Next Dimension

Iteration 4: correctness into REQ-009 background-scan default. Read `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` (the dispatch boundary where `background: true` is supposed to default) and `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` (the schema default + description). Independently verify that the two claimed internal-caller exemptions actually bypass the new default:
1. CLI reindex call site in `.opencode/bin/lib/launcher-ipc-bridge.cjs` (or whichever file invokes `handleMemoryIndexScan` directly from the CLI path) — should pass `background: false` explicitly OR go through a different entry point that doesn't hit the dispatch default.
2. Boot-time drift repair scan in `context-server.ts` (the startup `index_scan` job that runs on daemon boot) — should also pass `background: false` explicitly or invoke the handler with an option that bypasses the dispatch default.
A third call site worth checking: `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts` — verify the four new regression tests are non-vacuous and that `dist/tools/lifecycle-tools.js` contains the compiled fix.

## Verification

- `rg -n "fromScan" .opencode/skills/system-spec-kit/mcp-server --type ts` (excluding `dist/`) — 4 producer-side emits at `context-server.ts:1729, 2447, 2454, 2488` and `handlers/memory-index.ts:1536`; consumer-side reads in `handlers/memory-index.ts:542, 551` and `handlers/memory-save.ts:2219, 2232, 2247, 2257, 2910, 2914`.
- `rg -n "initIngestJobQueue|processFile|memory_ingest_start" .opencode/skills/system-spec-kit/mcp-server --type ts` — single `processFile` callback definition (`:2443`), single `initIngestJobQueue` call site in `context-server.ts:2442`, no alternate callback registration.
- `rg -n "processFileFn" .opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts` — 4 hits (declare `:117`, guard `:585-587`, worker invocation `:635`, init assignment `:740`); no second registration.
- Read `context-server.ts:2440-2464` — confirmed `governance ? {governance,fromScan:true} : {provenance:{...},fromScan:true}` shape.
- Read `job-queue.ts:84-86, 117, 227-250, 584-664, 700-751` — confirmed single-assignment callback pattern; crash-recovery replay re-enters through the same `processFileFn`.
- Read `context-server.vitest.ts:2568-2581, 2583-2586` — confirmed T47c and T47c-2 are source-pattern only; T47d is the established convention reference.

Review verdict: PASS
