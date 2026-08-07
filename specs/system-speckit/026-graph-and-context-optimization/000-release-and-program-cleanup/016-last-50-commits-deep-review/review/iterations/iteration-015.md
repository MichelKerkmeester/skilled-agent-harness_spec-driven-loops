# Iteration 015 — Correctness / A1 verify+deepen (dimension: correctness)

## Dispatcher
- **Run:** 15 (parallel-safe worker; canonical state log holds runs 1-2 only — see Edge Cases #1)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness
- **Angle:** A1-verify+deepen (verify F-003; deepen cross-launcher session-proxy parity)
- **Budget profile:** verify (target 11-13 tool calls; evidence rereads + cross-launcher parity)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`, base `f05bdac2cf`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-015.md` + `deltas/iter-015.jsonl`. Did NOT touch shared state/strategy/registry/config.

## Files Reviewed
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` (402L canonical) vs `.../system-code-graph/mcp_server/lib/ipc/socket-server.ts` (402L full copy) — `diff -q` exit 0; md5 identical (`74f7e5c2…`). Verified by `diff -q` + `md5`.
- `.opencode/skills/system-skill-advisor/.../socket-server.ts` (22L shim) + `.../system-spec-kit/mcp_server/.../socket-server.ts` (22L shim) — md5 identical to each other (`2eb26523…`), re-export `@spec-kit/shared/...`. Verified by `cat`/`md5`.
- `.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts` — **THE drift guard** (was missed by iter-2). Verified by direct Read.
- `.opencode/skills/system-code-graph/vitest.config.ts` + `package.json` (`"test": "vitest run"`) — drift test is in the runnable suite. Verified by find + grep.
- `.opencode/bin/mk-spec-memory-launcher.cjs` — `createSessionProxy` call-sites (15, 203-210, 1390-1396), bridge-secondary rationale (195-211). Verified by Read/grep.
- `.opencode/bin/mk-code-index-launcher.cjs` — owner-lease + `bridgeOrReportLeaseHeld` (119-130, 454-498, 588-589, 858-870), shared-daemon comment (854). Verified by Read/grep.
- `.opencode/bin/mk-skill-advisor-launcher.cjs` — `bridgeOrReportLeaseHeld` (235-262), no `createSessionProxy`. Verified by grep.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` — shared raw bridge `bridgeStdioToSocket` (80-99) + `maybeBridgeLeaseHolder` (311-381). Verified by grep.

## Findings — New

### P0 Findings
None.

### P1 Findings
None new. (Verdict on the existing P1 F-003 below downgrades it; that is a disposition change, not a new finding.)

### P2 Findings

1. **F-003 socket-server fork — DRIFT GUARD EXISTS; downgrade P1 → P2 (header-label inaccuracy only)** -- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:4-7` -- F-003 (iter-2 P1) claimed code-graph holds a full unsynced fork of `shared/ipc/socket-server.ts` with **"no drift guard, so a future fix to shared/ won't reach code-graph."** That claim is **FACTUALLY REFUTED**. A drift guard exists and is active: `system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:36-50` reads both files and asserts `normalize(localCopy).toBe(normalize(canonical))` (CRLF-normalized byte-equality) against the canonical `shared/` path. It has NO skip/todo markers, sits at a path matched by the code-graph `vitest run` default glob (`vitest.config.ts` present, `package.json` `"test": "vitest run"`), and was added IN-RANGE by `3d1667dd68` ("socket-server reconvergence (014, 015)") — i.e. the very consolidation work introduced its own guard. So a future fix to `shared/` that is NOT mirrored into code-graph WILL turn this test red. F-003's documented `downgradeTrigger` — "If a build step or test already asserts code-graph==shared byte-equality (not found this pass), drop to P2 maintainability" — is satisfied. The only residual is cosmetic/maintainability: the code-graph header (lines 4-7) still labels the fork "Canonical bridge logic shared by every daemon launcher," which over-claims (it is a guarded local mirror, not the canonical source; the canonical source is `shared/`, and the guard's own header at lines 5-10 correctly says code-index "keeps a LOCAL byte-identical copy because it has no dependency on the shared package"). The "security-amplifier" framing inherited from F-A5-01 does not hold for the drift vector: silent divergence is prevented by CI, so a shared-side security fix cannot silently fail to reach code-graph.
   - Finding class: maintainability (label inaccuracy; drift hazard mitigated by existing guard)
   - Scope proof: all four socket-server files + the drift test + the bridge are in-range (`git diff --name-only a9e9bdb0a5^..HEAD`); the drift test was ADDED in-range by `3d1667dd68`; `diff -q shared code-graph` exit 0 today.
   - Affected surface hints: correct the code-graph header to say "local byte-identical mirror of `shared/ipc/socket-server.ts`, kept in sync by `tests/lib/ipc-socket-drift.vitest.ts`" instead of "Canonical." Optionally make the same vendoring decision explicit (no `@spec-kit/shared` dependency in `system-code-graph/package.json` is the stated reason for a copy over a shim).

   ```json
   {
     "id": "F-003",
     "type": "drift-hazard",
     "severity": "P2",
     "claim": "code-graph's socket-server is a full byte-identical mirror of the shared canonical; an ACTIVE in-range drift-guard test (ipc-socket-drift.vitest.ts) enforces byte-equality, so future shared fixes that miss code-graph fail CI. Residual issue is only the over-claiming 'Canonical' header label.",
     "evidenceRefs": ["system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:36-50 (toBe byte-equality assert)","system-code-graph/.../socket-server.ts:4-7 (header mislabels fork as Canonical)","system-spec-kit/shared/ipc/socket-server.ts (true canonical)","diff -q shared vs code-graph exit 0; md5 identical 74f7e5c2","drift test added in-range by 3d1667dd68; vitest.config.ts present; package.json test=vitest run; no skip markers"],
     "counterevidenceSought": "Read the full drift test (asserts localCopy.toBe(canonical), CRLF-normalized); confirmed not skipped; confirmed wired into vitest run; confirmed added in-range. Iter-2 grepped only .opencode/skills/*/scripts and missed tests/ — that blind spot is why F-003 was originally filed P1 with the 'no drift guard' claim.",
     "alternativeExplanation": "The guard could be a no-op or unwired. Rejected: it uses a real toBe equality on file contents, has no skip markers, lives under the default vitest include glob, and code-graph package.json runs `vitest run`. The 'cannot drift' contract IS mechanically enforced for code-graph.",
     "finalSeverity": "P2",
     "confidence": 0.85,
     "downgradeTrigger": "Re-escalate to P1 ONLY if the drift test is later shown excluded from CI (e.g. an exclude glob or a CI job that skips code-graph tests) — not verified runnable in CI this pass, only verified present, active, and in the local `vitest run` set."
   }
   ```

## Traceability Checks
- **Iteration number:** canonical `deep-review-state.jsonl` has 2 `type:"iteration"` lines (runs 1-2); JSONL-derived = 3, but dispatch assigns 15 and 14 prior delta/iteration artifacts (iter-001..010 + this fan-out) exist on disk. In this parallel-safe fan-out the dispatch-assigned number (15) is authoritative for the delta/artifact filename; the canonical JSONL is reducer-owned and not yet merged. Recorded as Edge Case #1 (not a defect).
- **Range integrity:** HEAD `12de3d3a7e`, base `a9e9bdb0a5^` = `f05bdac2cf` (per config/iter-2; unchanged).
- **Provenance of the drift guard:** `ipc-socket-drift.vitest.ts` added in-range by `3d1667dd68` (`git log --diff-filter=A`); `launcher-session-proxy.cjs` added in-range by `598be61b05`, hardened by `c68c7bf5e3`.
- **Lineage:** sessionId `2026-06-05T11:16:17Z`, generation 1, lineageMode new — consistent with config/registry.

## Integration Evidence
- **Drift guard (named test surface):** `.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts` — `expect(localCopy).toBe(canonical)` on the code-graph copy vs `shared/ipc/socket-server.ts`. In-range, active, in `vitest run` set. This is the exact guard iter-2's F-003 said it could not find.
- **Cross-launcher secondary-session path (named surfaces):** all three launchers route secondary (non-lease-holder) sessions through the SHARED `.opencode/bin/lib/launcher-ipc-bridge.cjs` (`maybeBridgeLeaseHolder`→`bridgeStdioToSocket`, lines 80-99, 311-381) via `bridgeOrReportLeaseHeld` — spec-memory at `mk-spec-memory-launcher.cjs:744-765`, code-index at `mk-code-index-launcher.cjs:588-589/858-870`, advisor at `mk-skill-advisor-launcher.cjs:235-262`. Secondary sessions do NOT wedge anywhere.
- **session-proxy asymmetry (named surfaces):** `createSessionProxy` present ONLY in `mk-spec-memory-launcher.cjs` (require at :15; used at :203-210 and :1390-1396); ZERO occurrences in code-index and advisor launchers (grep). Per the spec-memory comment at :195-201 and commit `598be61b05`, the proxy's sole added value over the raw bridge is surviving a transparent daemon recycle. code-index/advisor have NO transparent-recycle workflow (grep for `recycle|SIGTERM child|transparent`: 0 matches), so there is nothing for a proxy to shield.

## Edge Cases
1. **Parallel-safe iteration numbering (ambiguity resolved):** canonical JSONL count (2) ≠ dispatch number (15). In fan-out mode each worker writes its own `deltas/iter-NNN.jsonl`; a reducer merges them into the canonical log later. Chosen interpretation: honor the dispatch-assigned number 15 for the delta/artifact filenames; do NOT append to the canonical `deep-review-state.jsonl`. Not a state-corruption defect.
2. **F-003 severity hinges entirely on the guard's existence (contradiction resolved):** iter-2 filed F-003 P1 specifically because it grepped `.opencode/skills/*/scripts` and found no guard. This pass searched `tests/` too and found the guard. Both sides cited: iter-2's negative grep was scope-limited (scripts-only); this pass's positive find is in `tests/lib/`. Adjudication: the guard wins (it is real, active, in-range, byte-equality, unwired-skip-free) → F-003 downgrades P1→P2.
3. **"Verified present" ≠ "verified in CI":** I confirmed the drift test is in the LOCAL `vitest run` set (config + package.json + glob + no skip), but did NOT execute it nor confirm a CI job runs code-graph tests (read-only pass; no test execution in budget). Downgrade is therefore to P2, not full clean — `downgradeTrigger` re-escalates to P1 if the test is later shown excluded from CI.
4. **code-graph MCP disconnected** (per Known Context): structural search unavailable; used Grep+Read+git+diff+md5, sufficient for this diff-scoped verify.

## Confirmed-Clean Surfaces
- **Cross-launcher secondary-session liveness (`launcher-ipc-bridge.cjs:80-99`, used by all three launchers):** CLEAN for the wedge hypothesis. A second launcher invocation while the lease is held does NOT wedge: `bridgeOrReportLeaseHeld`→`maybeBridgeLeaseHolder` deep-probes the daemon socket (`deepProbe:true`, 362) and pipes the new client's stdio to the live daemon (`bridgeStdioToSocket`, 96-99). The session-proxy absence in code-index/advisor only removes recycle-survival, which those services never trigger. No secondary-session concurrency defect found.

## Ruled Out
1. **F-003 as a standing P1 "no drift guard" defect:** RULED OUT. The guard `ipc-socket-drift.vitest.ts:36-50` exists, is active, in-range (`3d1667dd68`), and asserts byte-equality vs `shared/`. The "future shared fix won't reach code-graph" failure mode is mechanically prevented (test goes red). Hunter: "fork with no guard = silent security drift." Skeptic: "grep tests/, not just scripts/ — found the guard." Referee: claim refuted; residual is only the over-claiming `Canonical` header → P2 maintainability.
2. **Session-proxy gap as a concurrency defect (secondary sessions wedge):** RULED OUT. All three launchers bridge secondaries via the shared raw bridge; secondaries connect and work. The proxy only adds recycle-survival, needed solely by spec-memory's transparent dist-recycle workflow (memory note `mcp-front-proxy-deploy-recycle`; commit `598be61b05`). code-index/advisor have no such workflow (0 recycle markers). The asymmetry is intentional and correct, not a bug. iter-2's "sessionProxy=0 parity gap" is a benign feature asymmetry, NOT a deferrable defect.

## Next Focus
- **Dimension:** correctness
- **Focus area:** A1 residual closure — re-assert F-002 (EPERM owner-lease un-reclaimable) under skeptic challenge and confirm whether code-index/advisor share the same EPERM-immortal-lease pattern (code-index `:476` mirrors `EPERM→treat as live lease`, so F-002's reclaim-gate-unreachability may replicate cross-launcher). Then F-004 reclaim-durability fsync parity.
- **Reason:** F-003 is now settled (P2). F-002 is the strongest surviving correctness P1 and its EPERM pattern appears duplicated in code-index (`:476`) and advisor — needs a cross-launcher verify before the adversarial pass closes A1.
- **Rotation status:** A1 verify done for F-003 + session-proxy parity; F-002/F-004 verify still open for the iter 14-20 adversarial band.
- **Blocked/productive carry-forward:** Productive — F-003 P2 disposition feeds A6 (drift-guard test gap is CLOSED for socket-server; re-scope A6 to other vendored copies, e.g. `processLiveness` duplication F-005 which still lacks a guard). BLOCKED: do not re-file F-003 as P1 "no guard" — that approach is exhausted/refuted.
- **Required evidence:** for F-002 cross-launcher — code-index `classifyOwnerLease`/EPERM bucket (around `:476` + reclaim gate), advisor EPERM posture; whether either has a heartbeat-staleness escape that spec-memory lacks.
