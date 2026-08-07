# Iteration 002 — Correctness / A1 launcher-IPC concurrency (dimension: correctness)

## Dispatcher
- **Run:** 2 of 20
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness
- **Angle:** A1 launcher/IPC concurrency
- **Budget profile:** verify (target 11-13 tool calls; evidence rereads + cross-launcher parity)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`, base `f05bdac2cf`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)

## Files Reviewed
- `.opencode/bin/mk-spec-memory-launcher.cjs` — lease lifecycle (owner-lease acquire/reclaim/heartbeat/clear), lines 60-393, 410-484, 680-739, 1330-1374. Verified by direct Read.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` — owner socket-path staleness + bridge decision, lines 320-379. Verified by direct Read.
- `.opencode/bin/mk-code-index-launcher.cjs` — owner-lease + local `processLiveness` copy, lines 296-330. Verified by direct Read.
- `.opencode/bin/mk-skill-advisor-launcher.cjs` — owner-lease parity (token grep: 0 owner-lease tokens). Verified by grep.
- `.opencode/bin/lib/model-server-supervision.cjs` — shared `processLiveness` source, lines 274-293. Verified by direct Read.
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` (402L canonical) vs `system-code-graph/mcp_server/lib/ipc/socket-server.ts` (402L) vs the two 22-line re-export shims (spec-kit + advisor). Verified by `diff -u` (exit 0) + line counts + header reads.

## Findings — New

### P0 Findings
None. The charter's lease-CAS-TOCTOU and stdout-collision P0 hypotheses were adversarially tested and ruled out (see Ruled Out).

### P1 Findings

1. **EPERM owner-lease is permanently un-reclaimable — heartbeat-staleness safety net is structurally unreachable** -- `.opencode/bin/mk-spec-memory-launcher.cjs:339` (with `:346-348`, consumed at `:361`) -- `classifyOwnerLease` returns `'unknown-eperm'` at line 339 **before** the heartbeat-staleness gate at lines 346-348 (`Date.now() - heartbeatMs > ttlMs * 2`). In `acquireOwnerLeaseFile` (line 361) `'unknown-eperm'` is bucketed with `'live-owner'` → `{ acquired: false }`, with no fall-through to the staleness check. Therefore any owner lease whose recorded `ownerPid` now resolves to `EPERM` (`process.kill(pid,0)` throws EPERM) is treated as a perpetually-live owner: the 2×TTL heartbeat reclaim — the intended escape for a dead/PID-reused owner — can never fire for it. The launcher wedges (every new launcher bridges/reports instead of taking ownership) until the `.spec-memory-owner.json` file is manually deleted. EPERM is a real precondition the code itself documents ("EPERM means the process exists but we lack permission (e.g. sandbox)", line 480) and is reachable in sandboxed runtimes (this review session runs sandboxed). Introduced in-range by `3419e0a3e9` (feat(016) launcher-ownership hardening O6). Real defect, not style: an availability/liveness bug where the documented reclaim path is dead code for the EPERM case.
   - Finding class: defect (concurrency/liveness)
   - Scope proof: in-range diff (`git log -S "stale-heartbeat-reclaim"` → `3419e0a3e9`); both the EPERM return (line 339) and the heartbeat gate (346-348) are inside `classifyOwnerLease`, consumed at the line-361 branch in `acquireOwnerLeaseFile`.
   - Affected surface hints: owner-lease classification ordering; `unknown-eperm` handling in `acquireOwnerLeaseFile`; consider letting an EPERM lease still age out via the 2×TTL heartbeat gate (or a longer EPERM-specific TTL) instead of treating it as immortal.

   ```json
   {
     "id": "F-002",
     "type": "concurrency-liveness",
     "severity": "P1",
     "claim": "An owner lease whose ownerPid resolves to EPERM is classified live-owner-equivalent and can never be reclaimed via the heartbeat-staleness gate, wedging the launcher until manual lease deletion.",
     "evidenceRefs": ["mk-spec-memory-launcher.cjs:339","mk-spec-memory-launcher.cjs:346-348","mk-spec-memory-launcher.cjs:361","mk-spec-memory-launcher.cjs:480 (EPERM=sandbox comment)"],
     "counterevidenceSought": "Searched acquireOwnerLeaseFile + classifyOwnerLease for any later EPERM-aging escape; none exists. reapOwnerBeforeRespawn also returns owner-liveness-unknown-eperm (line 643-644) — same non-reclaim posture, confirming no alternate reclaim route.",
     "alternativeExplanation": "EPERM owners are intended to be immortal because they are genuinely-live but unreadable. Rejected: a long-dead owner under PID-reuse into a foreign-uid process also yields EPERM, and the heartbeat gate exists precisely to cover that — but it is unreachable here, so the design intent is defeated for that case.",
     "finalSeverity": "P1",
     "confidence": 0.8,
     "downgradeTrigger": "If a deployment invariant guarantees the spec-memory owner is always same-uid (EPERM impossible in practice), drop to P2."
   }
   ```

2. **code-graph keeps a full 402-line fork of the `shared` socket-server that the consolidation's own contract says "cannot drift" — no shim, no shared import, no sync guard** -- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:1-402` (vs canonical `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts`) -- The consolidation collapsed `mcp_server` and `skill-advisor` to 22-line re-export shims that `export ... from '@spec-kit/shared/ipc/socket-server.js'`, and the spec-kit shim header explicitly states the bind/reclaim/serve behaviour "is shared across every daemon launcher so the security contract cannot drift between services." code-graph did NOT get a shim: it holds a full byte-identical copy whose header even claims to be the "Canonical bridge logic shared by every daemon launcher." Today `diff -u` is clean (exit 0), so this is not a current behavioural defect — but it is a real latent correctness/security defect: any future fix to the race-safe stale-socket fence or dir-ownership hardening in `shared/` will silently NOT propagate to code-graph, violating the stated invariant for 1 of 3 consumers. No sync/check guard was found under `.opencode/skills/*/scripts`. All four files are in-range.
   - Finding class: defect (consolidation invariant violation / drift hazard)
   - Scope proof: all four socket-server files appear in `git diff --name-only a9e9bdb0a5^..HEAD`; `diff -u shared code-graph` exits 0 (identical now); the two shim files re-export `@spec-kit/shared/...`; code-graph does not.
   - Affected surface hints: code-graph socket-server should be a re-export shim like the other two, OR a CI drift guard should assert byte-equality of the code-graph copy against `shared`. Header comment in code-graph mislabels a fork as "canonical."

   ```json
   {
     "id": "F-003",
     "type": "drift-hazard",
     "severity": "P1",
     "claim": "code-graph's socket-server is a full unsynced fork of the shared canonical, contradicting the documented 'security contract cannot drift' invariant; future shared fixes will not reach code-graph.",
     "evidenceRefs": ["system-code-graph/mcp_server/lib/ipc/socket-server.ts:1-5 (claims canonical)","system-spec-kit/mcp_server/lib/ipc/socket-server.ts (22-line shim re-export)","diff -u shared vs code-graph exit 0"],
     "counterevidenceSought": "Grepped .opencode/skills/*/scripts for a socket-server sync/drift guard — none found (only a node_modules vite chunk matched). Confirmed code-graph header does not import @spec-kit/shared.",
     "alternativeExplanation": "code-graph intentionally vendors its own copy for package independence. Rejected as a clean pass: even if intentional, the absence of a drift guard plus the 'cannot drift' contract makes silent divergence inevitable and the header's 'canonical' claim is false for a fork.",
     "finalSeverity": "P1",
     "confidence": 0.75,
     "downgradeTrigger": "If a build step or test already asserts code-graph==shared byte-equality (not found this pass), drop to P2 maintainability."
   }
   ```

### P2 Findings

3. **Reclaim-path owner-lease write skips fsync, unlike the exclusive fresh-acquire writer — durability asymmetry** -- `.opencode/bin/mk-spec-memory-launcher.cjs:281-285` (`writeOwnerLeaseFile`, used by reclaim at `:382` and heartbeat refresh at `:399`) vs `:288-302` (`writeOwnerLeaseFileExclusive`, fsyncs at `:294`) -- The fresh-acquire path CAS-writes the lease with `openSync('wx')` + `fsyncSync` (durable). The reclaim path and the heartbeat refresh use `writeOwnerLeaseFile` which writes a tmp then `renameSync` with **no fsync of the file data or the parent dir**. On crash/power-loss immediately after rename, the reclaimed lease can be lost (dirent/data not yet durable), reopening the very double-owner window the exclusive path closes. Narrow window and the re-read at line 383-384 already serializes the in-memory winner, so this is a durability hardening gap (P2), not an active double-owner bug.
   - Finding class: durability gap
   - Scope proof: both writers are in-range (`3419e0a3e9`); fsync present at line 294, absent in lines 281-285.
   - Affected surface hints: add `fsyncSync` (file + parent dir) to `writeOwnerLeaseFile`'s rename path for parity with the exclusive writer; or document why reclaim durability is intentionally weaker.

4. **`processLiveness` is duplicated verbatim in `mk-code-index-launcher.cjs` instead of importing the shared `model-server-supervision.cjs` copy — silent drift risk** -- `.opencode/bin/mk-code-index-launcher.cjs:296-306` vs `.opencode/bin/lib/model-server-supervision.cjs:274-284` -- spec-memory imports `processLiveness` from the shared lib (`mk-spec-memory-launcher.cjs:35`); code-index defines its own byte-identical local copy. Currently in sync (verified by side-by-side read), but the ESRCH/EPERM liveness contract — which directly drives lease reclaim correctness (see F-002) — can now diverge between the two launchers with no guard. P2 maintainability/drift; not a current defect.
   - Finding class: drift hazard
   - Scope proof: code-index launcher is in-range; both bodies read and confirmed identical; spec-memory imports the shared one at line 35.
   - Affected surface hints: code-index should `require('./lib/model-server-supervision.cjs').processLiveness` like spec-memory, or a guard should assert parity.

## Traceability Checks
- **Iteration number:** JSONL had 1 `type:"iteration"` line (run 1). Derived iteration = 2. Matches dispatch. No mismatch.
- **Range integrity:** HEAD `12de3d3a7e`, base `a9e9bdb0a5^` = `f05bdac2cf` (re-confirmed via `git rev-parse`).
- **Provenance of F-002 / F-003 / F-004:** all reside in code present in the diff range; F-002's classification ordering was added by in-range commit `3419e0a3e9` (`git log -S "stale-heartbeat-reclaim"`).
- **Lineage:** sessionId `2026-06-05T11:16:17Z`, generation 1, lineageMode new — consistent across config/state/registry.

## Integration Evidence
- **Cross-launcher parity (named surfaces inspected):** `mk-spec-memory-launcher.cjs` (owner-lease=8 tokens, sessionProxy=9, JSON-RPC-err=3), `mk-skill-advisor-launcher.cjs` (owner-lease=0 — confirms charter "advisor has NO owner-lease"), `mk-code-index-launcher.cjs` (owner-lease=9 — **refutes** charter "code-index missing owner-lease"; but sessionProxy=0, so code-index lacks the recycle-surviving session proxy that spec-memory has). Grep-token evidence.
- **socket-server consolidation:** spec-kit + advisor = 22-line shims re-exporting `@spec-kit/shared/ipc/socket-server.js`; code-graph = full 402-line fork; shared = 402-line canonical. `diff -u shared code-graph` exit 0 (byte-identical today). See F-003.

## Edge Cases
1. **Reclaim TOCTOU re-read serialization (ambiguity resolved):** The reclaim path (lines 381-392) uses non-exclusive `writeOwnerLeaseFile` (last-writer-wins `renameSync`), then re-reads (383-384) and bows out unless `ownerPid === process.pid`. Two launchers racing a stale lease converge on a single owner via the re-read, so the comment's claim holds. Chosen interpretation: NOT a P0 double-owner bug; the only residual is durability (F-004).
2. **PID reuse bounded by 2×TTL:** A crashed owner's reused PID makes `process.kill(pid,0)` succeed (`live-owner`), but the heartbeat-staleness gate (line 348) reclaims after 120s — EXCEPT for the EPERM case (F-002), where that gate is unreachable.
3. **Charter hypothesis partially refuted:** "code-index missing socketPath/JSON-RPC-error/proxy" is only partly true — code-index HAS owner-lease but lacks sessionProxy/JSON-RPC-error surface. Recorded as integration evidence, not a finding (absence of a recycle-survival proxy in code-index is a feature-parity gap, deferrable to A1 revisit/iter 6).
4. **code-graph MCP disconnected** (per Known Context): structural search unavailable; used Grep+Read+git+diff, sufficient for diff-scoped review.

## Confirmed-Clean Surfaces
- **Owner socket-path staleness (`launcher-ipc-bridge.cjs:344-353`):** CLEAN for the inspected hazard. The bridge prefers the lease-recorded `socketPath` only when it still exists on disk (`fs.existsSync`, line 347) and falls back to `getIpcSocketPath` recomputation otherwise; tcp:// endpoints bypass the existence check intentionally. A stale recorded path cannot cause a bridge to a dead socket — it falls through to `no-bridge-socket` (line 351-353) then deep-probe (362). No staleness defect found at the charter-cited lines.

## Ruled Out
1. **Lease-CAS reclaim TOCTOU as a P0 (charter A1):** Ruled out. The non-exclusive reclaim writer is intentional; the re-read-after-write (lines 383-384) serializes racers to one owner. Adversarial Hunter/Skeptic/Referee: Hunter flagged "non-exclusive write on reclaim = double owner"; Skeptic found the re-read serialization; Referee: residual is durability only → demoted to P2 (F-004), no P0.
2. **`LEASE_HELD_BY` stdout colliding with proxied client stdio on a bridged secondary (charter A1, line 183 / bridge 326):** Ruled out. On a bridged secondary, the session proxy owns stdout and emits JSON-RPC errors on failure; the raw bridge's `onError` stdout marker is "intentionally unused here (it would corrupt the MCP stream)" (`mk-spec-memory-launcher.cjs:195-201`). `LEASE_HELD_BY` is only written on the report/no-bridge paths (bridge 326, 334, 352, 375), never while the proxy holds stdout. No interleave defect.

## Next Focus
- **Dimension:** correctness
- **Focus area:** A2 memory-write & async enrichment — start with partial-write/crash safety and transaction rollback in `mcp_server/handlers/memory-save.ts` (~2860-2897, churn 307) and `handlers/save/enrichment-state.ts`; then default-on enrichment blast radius (archived vs deprecated rows; auto-fix mutating content before link resolution), execution-status collapse (`handlers/save/post-insert.ts` ~435-499), E081→E085-089 error-class regressions (`handlers/save/response-builder.ts` ~495-533), and entity-density cache-invalidation completeness (`handlers/mutation-hooks.ts`).
- **Reason:** A2's `memory-save.ts` is the #5 churn hotspot and the session's known git-index race plus default-on enrichment make partial-write/crash safety the next-highest correctness risk after A1.
- **Rotation status:** correctness iter 2 of 5 complete (A1 done); A2 (iter 3), A3 relation-backfill.ts churn-748 (iter 4), A4 shutdown/WAL (iter 5).
- **Blocked/productive carry-forward:** Productive — F-003 (code-graph socket-server fork) feeds A5 (iter 7, security TOCTOU surface lives in that file) and A6 (iter 12, drift-guard test gap). F-002 EPERM-reclaim and F-004 durability should be re-asserted in the iter 14-20 adversarial-verify pass. Cross-launcher session-proxy parity gap (code-index sessionProxy=0) queued for A1 revisit.
- **Required evidence:** for A2 — transaction boundary + rollback path in memory-save.ts; whether enrichment defers AFTER commit or mutates pre-commit; exact error-code constants in response-builder.ts; cache-invalidation call sites in mutation-hooks.ts.
