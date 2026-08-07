# Iteration 7 — MAINTAINABILITY Dimension

## Dimension
D4 Maintainability: comment hygiene, invariant clarity, pattern consistency, test file quality.

## Files Reviewed
- `.opencode/bin/mk-spec-memory-launcher.cjs:440-638` — leaseId-fencing trio in detail (`acquireOwnerLeaseFile`, `refreshOwnerLeaseFile`, `clearOwnerLeaseFile`, `clearOwnerLeaseFileIfOwner`).
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` — comment-hygiene grep (no ephemeral-artifact labels found).
- `.opencode/bin/lib/launcher-session-proxy.cjs` — comment-hygiene grep (clean).
- `.opencode/bin/lib/model-server-supervision.cjs` — comment-hygiene grep (clean).
- `.opencode/bin/mk-skill-advisor-launcher.cjs` — comment-hygiene grep (clean).
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:2430-2509` — REQ-008 `fromScan: true` call shape in `processFile` callback (async ingest queue init) and file-watcher reindex.
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2217-2257` — REQ-006 origin helper (`resolveIndexingOrigin`) and `processPreparedMemory` option block.
- `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts:60-72` — REQ-009 `handleTool` dispatch default for `memory_index_scan`.
- `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:230, 256, 261, 336, 415, 761` — schema-description strings (MCP-callable tool metadata).
- `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts:90-189` — TOCTOU interleaving test for the leaseId fence.
- `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-lease.vitest.ts` — CAS reclaim suite (grep only).
- `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts` — REQ-009 default test (grep only).

## Comment Hygiene (HARD rule: durable WHY only, no ephemeral labels)
Grep across all 7 implementation files for `REQ-0\d+`, `CHK-0\d+`, `T0\d+`, spec-folder paths, phase numbers, `specs/system-speckit/031...`, `Phase \d`, `spec-folder` directory references:

- `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` lines 230, 256, 261, 336 contain REQ-001/006 inside JSON-string tool-description fields. These are **schema metadata visible to MCP callers**, not file-source comments. They reference durable spec-intent identifiers (`REQ-001` deduplication, `REQ-006` intent-aware retrieval). Verdict: pre-existing/durable, not a hygiene violation.
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` lines 623, 630 contain `// Phase 1:` and `// Phase 2:` comments in the **prompt-display-budget** ranker, not from this session's packet (Phase 1/Phase 2 here are display phases, not packet phases).
- `.opencode/bin/mk-spec-memory-launcher.cjs:1203` is `path.join(kitDir, 'scripts', 'dist', 'spec-folder', 'generate-description.js')` — a directory path, not an ephemeral comment.
- No ephemeral-artifact labels (REQ-/CHK-/T0xx/031/plan.md/FIX ADDENDUM/P1-001) found in any comment across the 5 CJS launcher files or across `context-server.ts`, `lifecycle-tools.ts`, `memory-save.ts`.

**Verdict on the implementer's mid-session hygiene claim**: REAFFIRMED. The 3 caught violations did not reintroduce. No new violations introduced.

## Findings by Severity

### P2-003 (NEW) — LeaseId-fencing invariant has no anchor comment in the cleanup paths
- **File**: `.opencode/bin/mk-spec-memory-launcher.cjs:611-638`
- **Evidence**: The lease-mutation fencing invariant ("always re-validate the lease immediately before mutating the file") is anchored with explicit WHY comments in 2 of 3 lease-mutation functions:
  - `acquireOwnerLeaseFile` (line 525-528): "Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL). This collapses the fresh-acquire and stale-reclaim paths into a single CAS so only one racer can win..."
  - `acquireOwnerLeaseFile` (line 530-534): "Fence the unlink on the exact lease instance just classified stale: re-read immediately before removing so a delayed unlink cannot remove a DIFFERENT (fresh) lease..."
  - `refreshOwnerLeaseFile` (line 564-567): "Fence on this process's own leaseId, not just ownerPid: a stale writer whose ownerPid happens to still read back (e.g. it lost and re-won a later cycle under the same PID) must not overwrite a successor..."
  But the same invariant has **no anchor comment** in:
  - `clearOwnerLeaseFile` (line 611-626) — re-reads lease at line 614, fences on ownerPid+leaseId at line 615-616, second-read at line 616.
  - `clearOwnerLeaseFileIfOwner` (line 628-638) — only `// Idempotent cleanup.` as a comment.
- **Sub-issue (the actual maintainability smell)**: In `clearOwnerLeaseFile` the second-read fence (line 616) is `readOwnerLeaseFile()?.ownerPid === ownerLeasePid` — ownerPid-only, NOT leaseId. This is asymmetric with `refreshOwnerLeaseFile`'s second-read at line 576 which checks both `ownerPid` and `leaseId`. **No comment explains whether this asymmetry is intentional or an oversight.**
- **Claim**: The fencing invariant is well-documented where the algorithm is non-trivial (acquire/reclaim), but undocumented where the algorithm appears trivial (clear paths). Two specific maintainability costs: (1) a future maintainer will not know whether to "harden" the clear functions by adding leaseId to the reread, (2) a maintainer copy-pasting a similar fence into a new function will copy the lighter check (ownerPid-only) without realizing it; the leaseId-checked variant doesn't propagate.
- **Counterevidence sought**: Is the asymmetric protection intentional? Yes — the only path for another process to overwrite the lease file with a new leaseId is via `acquireOwnerLeaseFile`, which always changes `ownerPid` first via its O_EXCL-CAS path. So checking `ownerPid` on the reread is logically sufficient. **But this property is itself undocumented** — a reader of the clear function cannot derive it.
- **Alternative explanation**: The implementer understood the asymmetric protection (they correctly anchored fences in the other two functions), but simply did not write the equivalent anchor in the cleanup paths because cleanup is called only on graceful shutdown and the analysis is shorter. Plausible, but leaves a documentation debt.
- **Final severity**: P2 — maintainability, not correctness. The asymmetry is logically valid; the documentation gap is the real cost.
- **Finding class**: instance-only (bounded to mk-spec-memory-launcher.cjs lease-mutation paths).
- **Scope proof**: `rg -n "function (acquire|refresh|clear|clearIf)OwnerLeaseFile" .opencode/bin/mk-spec-memory-launcher.cjs` returns 4 hits and these are the only lease-mutation fences in the file.
- **Affected surface hints**: ["lease-mutation fences", "cleanup paths", "invariant documentation"]
- **Risk score**: 2 (advisory only)
- **Confidence**: 70%
- **Recommendation**: Add a one-paragraph anchor comment above `clearOwnerLeaseFile` (line 611) explaining (a) why the function re-reads the lease immediately before unlink (racing-launcher fence), (b) why the second reread checks `ownerPid` only rather than both fields (the only path for leaseId change requires ownerPid change first via acquire's O_EXCL-CAS). Apply the same to `clearOwnerLeaseFileIfOwner` (line 628) which has even weaker fences (ownerPid-only on both reads, no leaseId anchor at all). No behavior change required.
- **Downgrade trigger**: If the implementer documents both the invariant and the asymmetric protection reasoning AND demonstrates via an existing test (or new one) that the asymmetric protection is exercised safely, the maintainability smell is fully resolved and the finding can be downgraded to P3 informational.

## No Other Findings
- **Pattern consistency REQ-006 vs REQ-008**: PASS. Both fixes use the identical option name `fromScan: true` (`context-server.ts:2447` and `:2454` mirror `memory-save.ts:2232`). The call shape diverges only where the ingest path branches on a conditional governance merge (`context-server.ts:2446-2455` ternary), which is justified: when the parent dispatched with governance metadata, the child reuses it directly; when it dispatched without governance, the child synthesizes a `provenance` block. A durable WHY comment at line 2444-2445 explains the gating: "fromScan: true keeps this queued/crash-replayed path from writing quality-loop auto-fixes back to source docs, same as the startupScan/file-watcher gate." Pattern parity ACHIEVED.
- **RE-006 vs RE-008 vs file-watcher call parity**: file-watcher at `context-server.ts:2488` calls `indexSingleFile(filePath, false, { fromScan: true })` without a provenance block (its caller is the watcher, not an MCP tool). The asymmetry on `governance`/`provenance` is correctly bounded by the call-site concerns. PASS.
- **REQ-009 dispatch default**: PASS. `lifecycle-tools.ts:65-70` carries a complete WHY comment ("Interactive/manual MCP calls default to the background job path so an unexpectedly long scan surfaces progress via memory_index_scan_status instead of blocking the caller with no output; pass background: false explicitly to force the old synchronous path. Internal callers that need synchronous completion (CLI reindex, boot-time drift repair) call handleMemoryIndexScan directly and bypass this default."). No ephemeral labels. The `background === undefined ? { ...scanArgs, background: true } : scanArgs` spread idiom is idiomatic and self-explanatory.
- **Test file quality**: PASS. The TOCTOU test at `launcher-spec-memory-lifecycle.vitest.ts:114-161` is exemplary maintainability: it has a multi-line preamble (lines 114-117) explaining the exact race it reproduces, an `// ownerLeaseReadCount` mock-ordering script, a "this is the fence's whole point" line-159 anchor, and direct `expect` assertions tied to the fence invariant (`expect(attempt.holder?.leaseId).toBe(racingLease.leaseId)`, `expect(launcher.readOwnerLeaseFile()?.leaseId).toBe(racingLease.leaseId)`). The describe block at line 92 (CAS reclaim) and the describe block at line 164 (heartbeat gate) are clearly bounded. No magic-number smells. No brittle exact-string assertions.

## Traceability Checks
- **spec_code**: not re-tested in iter 7; iter 6 results stand. REQ-006..009 and REQ-011 match implementation; REQ-010 complete-fencing claim remains bounded by active P1-001.
- **checklist_evidence**: not re-tested; iter 6 results stand.
- **skill_agent**: notApplicable.
- **agent_cross_runtime**: notApplicable.
- **feature_catalog_code**: notApplicable (no product surface).
- **playbook_capability**: notApplicable.

## Verdict
**MAINTAINABILITY: PASS WITH P2-003.**
- 0 P0, 0 P1 (P1-001 unchanged, still active as algorithmic-gap finding), 0 P2 carry, +1 P2 new (P2-003: invariant-anchor gap in clear functions).
- newFindingsRatio: 1/1 = 1.0 (low volume: only one new finding).
- Comment-hygiene discipline (HARD project rule) REAFFIRMED across all 7 implementation files.
- REQ-006/008 pattern parity ACHIEVED.
- Test file maintainability GOOD.
- The single real maintainability gap (P2-003) lives in the same file as the algorithmic finding (P1-001) and is bounded by it; P2-003 is documentation/invariant-anchor, not correctness.

## Next Dimension — Recommendation for §12 Iteration 8
Per the user's request, set §12 NEXT FOCUS for iteration 8. The remaining frontier has two valid focuses; allocation choice below.

**Recommended Focus: Iteration 8 — adversarial re-verification of P1-001 specifically.**
Iter 7 finds P2-003 (maintainability) bounded by P1-001 (correctness). Before carrying P1-001 to the synthesis pass in iter 10, the open question is **whether P1-001's "generation check + reread is not mutation-atomic" framing is actually exploitable in practice or is already adequately mitigated by the SQLite sidecar lock + O_EXCL-CAS acquisition pattern**. Construct and adjudicate these three scenarios:

- **Scenario A — `refreshOwnerLeaseFile` late-arrival heartbeat**: Process A holds lease L1 (leaseId=X). A pauses. Process B stale-reclaims, generating L2 (leaseId=Y). A's heartbeat resumes, calls refresh with leaseId=X, line 568 refuses (leaseId mismatch), A self-shuts-down. SAFE. Verify the test at `launcher-spec-memory-lifecycle.vitest.ts:118-161` covers this — it covers acquire/clear, NOT refresh.
- **Scenario B — `clearOwnerLeaseFile` cross-process unlink**: A shutting down; B just acquired. A's clear at line 614 reads, sees `ownerPid=B`, returns false (line 612 `ownerLeasePid` is still A's pid in memory). SAFE — but no test validates the race.
- **Scenario C — `startOwnerLeaseHeartbeat` against post-crash successor**: A crashes mid-`acquireOwnerLeaseFile` (after write, before fsync). B stale-reclaims, wins with leaseId=Y. A respawns, reaches line 590 `startOwnerLeaseHeartbeat`, reads lease, but `ttlMs`-only; next heartbeat at line 594 calls refresh with A's STALE in-memory `ownerLeaseId=X`, line 568 refuses (leaseId mismatch), graceful SIGTERM shutdown. SAFE but noisy (unnecessary shutdown).

**Verdict on P1-001 after Scenario adjudication**:
- If Scenarios A and B are confirmed SAFE and the implementation has an existing test or can be hardened with a small test extension: P1-001 **downgrades to P2-004** (improvement: add test coverage for refresh + clear TOCTOU paths).
- If Scenarios A/B show an exploitable window: P1-001 STANDS at P1.
- If Scenario C reveals a previously-unframed maintainability gap (e.g., `startOwnerLeaseHeartbeat` should re-acquire rather than refresh from stale in-memory state on launch): restate under a new finding ID.

**Iter 8 budget allocation**: 13 tool calls — (3) read the three lease-mutation functions + sibling test, (1) read existing test for gaps, (1) spawn a new vitest focused on Scenario A refresh race, (4) run vitest targeted tests, (3) write iter-008 narrative + delta + state.jsonl append. Reserve 1 call for adjustments.

**Alternative iter-8 focus (lower priority)**: review-plan.md phase-label cleanup (P2-001 from iter 6) — but this is documentation, lower blast radius than P1-001 adjudication. Defer to iter 9 if iter 8 cannot complete Scenario C in budget.

## SCOPE VIOLATIONS
None.
