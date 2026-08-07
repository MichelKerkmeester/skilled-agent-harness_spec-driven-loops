# Iteration 011 — Adversarial Verify of A1 launcher-lease findings (dimension: correctness)

## Dispatcher
- **Run:** 11 (adversarial-verify pass; parallel-safe — writes only this file + `deltas/iter-011.jsonl`)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness
- **Angle:** A1-verify (refute-or-confirm F-002, F-004)
- **Budget profile:** adjudicate (target 8-10 tool calls; referee work on two prior findings)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`, base `f05bdac2cf`)
- **Working-file parity:** `git diff 12de3d3a7e -- .opencode/bin/mk-spec-memory-launcher.cjs` → empty (exit 0); the working file IS the reviewed blob, so direct Reads are canonical.
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)

## Files Reviewed
- `.opencode/bin/mk-spec-memory-launcher.cjs` — FULL acquire/classify/reclaim/heartbeat/respawn sequence: `writeOwnerLeaseFile`/`writeOwnerLeaseFileExclusive` (281-302), `classifyOwnerLease` (336-353), `acquireOwnerLeaseFile` (355-393), `refreshOwnerLeaseFile`/heartbeat (395-433), `reapOwnerBeforeRespawn` (641-659), `respawnAfterDeadSocket` (661-734), `bridgeOrReportLeaseHeld(AndExit)` (744-771), acquire call site + heartbeat start (1344-1349, 1211-1216). Verified by direct Read.
- `.opencode/bin/lib/model-server-supervision.cjs` — `processLiveness` source (274-284): EPERM → `'unknown-eperm'`. Verified by direct Read.
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` — reclaim coverage (360-367: dead-pid → `staleReclaimed`). No EPERM/`unknown-eperm`/`classifyOwnerLease` test. Verified by grep.
- `.opencode/specs/.../changelog/003-memory-and-causal-runtime/changelog-006-009-launcher-eperm-parity-fix.md` — design intent for EPERM-as-live-lease. Verified by direct Read.

## Findings — New
None new as standalone defects. This iteration re-adjudicates two carried-forward findings (verdicts below) and records one adjacent observation under Edge Cases.

### P0 Findings
None.

### P1 Findings
None confirmed. **F-002 is DOWNGRADED out of P1** (see verdict below).

### P2 Findings

1. **[F-002 — re-adjudicated] EPERM owner lease bypasses both reclaim routes — real but narrow edge-case hardening gap, NOT a must-fix gate bug** -- `.opencode/bin/mk-spec-memory-launcher.cjs:339` (early return) `+:346-348` (unreachable staleness gate) `+:361` (bucketed with live-owner) `+:643-644` (respawn route also refuses) -- The *structural* claim is CONFIRMED with exact evidence: `classifyOwnerLease` returns `'unknown-eperm'` at :339 before the 2×TTL heartbeat-staleness gate at :346-348, `acquireOwnerLeaseFile` buckets `'unknown-eperm'` with `'live-owner'` at :361 (`{acquired:false}`), and the dead-socket respawn route `reapOwnerBeforeRespawn` independently refuses at :643-644 (`owner-liveness-unknown-eperm`). Both documented reclaim escapes are therefore unreachable for an EPERM-resolving owner PID. **However, the failure is narrow and the severity is corrected to P2** because: (a) the EPERM-as-immortal-live-lease behavior is a deliberate, RCA-confirmed design decision (changelog-006-009): EPERM arises when a *different sandbox session* probes the owner, and in that case the owner is genuinely alive — bridging to it (not stealing ownership) is the correct, single-owner-preserving behavior; (b) a *dead* owner PID yields ESRCH → `'stale-pid'` (fully reclaimable, tested at launcher-lease.vitest.ts:360-367), NOT EPERM — EPERM-on-a-dead-owner requires PID reuse into a *foreign-uid* process, which contradicts the documented same-user multi-sandbox deployment (one shared checkout, all sessions same user); (c) the non-reclaim outcome is a *bridge/report*, not a hang: while the EPERM owner's socket is live, secondaries bridge and MCP keeps working; the genuinely-wedged corner (dead owner + EPERM probe + dead socket + no manual deletion) is the foreign-uid PID-reuse edge only. F-002's own `downgradeTrigger` ("if deployment guarantees same-uid owner, drop to P2") is effectively satisfied by the documented deployment.
   - Finding class: defect (concurrency/liveness, edge-case hardening)
   - Scope proof: all cited lines in-range (`3419e0a3e9` added the classification ordering; `git log -S "stale-heartbeat-reclaim"`); EPERM branch + parity rationale documented in in-range changelog-006-009; working file == reviewed HEAD blob.
   - Affected surface hints: let an EPERM lease still age out via a (longer, EPERM-specific) TTL on the heartbeat gate, OR document the cross-uid PID-reuse corner as accepted-risk; add the EPERM-mock vitest the changelog itself lists as a follow-up.

   ```json
   {
     "id": "F-002",
     "type": "concurrency-liveness",
     "severity": "P2",
     "claim": "An owner lease whose ownerPid resolves to EPERM bypasses both the heartbeat-staleness reclaim (gate at :348 unreachable due to early return at :339) and the dead-socket respawn (reapOwnerBeforeRespawn refuses at :643-644). Structurally confirmed; severity downgraded P1->P2 because the only stuck failure trace needs cross-uid PID reuse, which contradicts the documented same-user multi-sandbox deployment, and the common EPERM case (live cross-sandbox owner) is handled correctly by design.",
     "evidenceRefs": ["mk-spec-memory-launcher.cjs:339","mk-spec-memory-launcher.cjs:346-348","mk-spec-memory-launcher.cjs:361","mk-spec-memory-launcher.cjs:643-644","model-server-supervision.cjs:281 (EPERM->unknown-eperm)","launcher-lease.vitest.ts:360-367 (dead-pid=ESRCH=reclaimable, no EPERM test)","changelog-006-009-launcher-eperm-parity-fix.md:27 (EPERM=live cross-sandbox owner, by design)"],
     "counterevidenceSought": "Re-read BOTH reclaim routes end-to-end. Heartbeat route: confirmed unreachable for EPERM (early return :339 precedes gate :348). Respawn route: reapOwnerBeforeRespawn :643-644 ALSO refuses EPERM, so the double-block is real. THEN sought the deployment/intent counterevidence: changelog-006-009 documents EPERM-as-live-lease as the RCA-confirmed correct semantic for cross-sandbox probing; dead PIDs yield ESRCH (reclaimable, tested) not EPERM; EPERM-on-dead requires foreign-uid PID reuse, outside the documented same-user multi-sandbox model. The narrow-but-real edge survives; the P1 severity does not.",
     "alternativeExplanation": "EPERM owners are intended to be treated as live because in the documented deployment they ARE live (different sandbox, same user). The heartbeat gate's job is covering ESRCH-yielding dead/PID-reused owners, which it does. Only the foreign-uid PID-reuse corner escapes both routes -- a real but low-likelihood hardening gap, correctly P2 not P1.",
     "finalSeverity": "P2",
     "confidence": 0.85,
     "downgradeTrigger": "Already triggered: documented deployment is same-user multi-sandbox, satisfying the original P2 downgrade condition. Re-escalate to P1 only if a multi-uid owner (e.g. root daemon vs user launcher, or container-uid remap) is introduced for spec-memory."
   }
   ```

2. **[F-004 — re-adjudicated] Reclaim/heartbeat owner-lease write skips fsync, unlike the exclusive fresh-acquire writer — durability asymmetry CONFIRMED at P2** -- `.opencode/bin/mk-spec-memory-launcher.cjs:281-285` (`writeOwnerLeaseFile`: tmp `writeFileSync` + `renameSync`, NO fsync), used by reclaim at `:382` and heartbeat refresh at `:399`/:402, vs `:288-302` (`writeOwnerLeaseFileExclusive`: `openSync('wx')` + `fsyncSync` at `:294`) -- The asymmetry is verified exactly as F-004 claimed. On crash/power-loss immediately after the reclaim `renameSync` (:285), the reclaimed lease's dirent/data may not be durable and the lease can be lost. **Confirmed at P2 (not higher)** because: `renameSync` is atomic so no torn lease is possible — the only loss mode is *total* loss of the dirent, which reopens a clean no-owner state (reclaimable by the next exclusive acquire at :369), NOT a double-owner; the in-memory re-read serialization (:383-384) already prevents concurrent double-owner; and the heartbeat refresh every ttl/2 = 30s (`startOwnerLeaseHeartbeat` :420-421, ttl 60s) re-writes the lease, so a lost reclaim self-heals on the next interval. This is a durability-hardening gap, correctly advisory.
   - Finding class: durability gap
   - Scope proof: both writers in-range (`3419e0a3e9`); fsync present at :294, absent in :281-285; reclaim caller :382, heartbeat caller :399. Working file == reviewed HEAD blob.
   - Affected surface hints: add `fsyncSync` (file fd + parent dir fd) to `writeOwnerLeaseFile`'s rename path for parity with the exclusive writer, OR document that reclaim durability is intentionally weaker because the lease self-heals via heartbeat + exclusive re-acquire.

   ```json
   {
     "id": "F-004",
     "type": "durability-gap",
     "severity": "P2",
     "claim": "writeOwnerLeaseFile (reclaim :382 + heartbeat :399) renames without fsync, unlike writeOwnerLeaseFileExclusive which fsyncs at :294; a crash right after rename can lose the reclaimed lease.",
     "evidenceRefs": ["mk-spec-memory-launcher.cjs:281-285 (no fsync)","mk-spec-memory-launcher.cjs:294 (fsync in exclusive writer)","mk-spec-memory-launcher.cjs:382 (reclaim caller)","mk-spec-memory-launcher.cjs:399 (heartbeat caller)","mk-spec-memory-launcher.cjs:420-421 (heartbeat interval = ttl/2 = 30s)"],
     "counterevidenceSought": "Checked whether the lost-reclaim window is exploitable into a double-owner: it is not -- renameSync is atomic (no torn write), total dirent loss reopens a clean no-owner state reclaimable by the next exclusive acquire (:369), and the re-read at :383-384 serializes concurrent racers. Heartbeat self-heals the lease every 30s. So impact is bounded to a transient lost reclaim, advisory.",
     "alternativeExplanation": "Reclaim durability is intentionally weaker than fresh-acquire because the lease is short-lived (30s heartbeat refresh) and self-healing; the exclusive writer fsyncs only because the fresh-acquire CAS is the single-owner-establishing operation. Plausible design intent, but undocumented -- so the asymmetry remains a real (low) hardening gap.",
     "finalSeverity": "P2",
     "confidence": 0.85,
     "downgradeTrigger": "N/A -- already P2; would drop to non-finding only if an inline comment documents the intentional asymmetry."
   }
   ```

## Traceability Checks
- **Iteration number:** JSONL `deep-review-state.jsonl` is the orchestrator log; this parallel-safe verify pass writes ONLY `iterations/iteration-011.md` + `deltas/iter-011.jsonl` and does NOT append to state.jsonl/strategy.md/registry (per dispatch parallel-safety contract). Dispatch ITERATION=11 honored.
- **Range integrity:** HEAD `12de3d3a7e`, base `a9e9bdb0a5^` = `f05bdac2cf` (re-confirmed via `git rev-parse`). Working file byte-identical to reviewed blob (`git diff 12de3d3a7e` empty).
- **Provenance:** F-002 ordering added by in-range `3419e0a3e9`; EPERM branch + parity rationale in in-range `changelog-006-009`. Both findings reside in in-range code.
- **Canonical IDs:** registry/strategy track F-002 (P1) and F-004 (P2); iteration-002 labeled the F-004 finding as bullet "3" but the strategy Progress Log and delta IDs confirm F-004 = the reclaim-durability finding. Verified against strategy.md:42.

## Integration Evidence
- **changelog-006-009 (named surface):** documents the EPERM branch as RCA-confirmed cross-sandbox-parity design (`leaseHeldFromFile` EPERM → live), establishing intent that downgrades F-002.
- **launcher-lease.vitest.ts (named surface):** reclaim test covers dead-pid (ESRCH) reclaim only; no EPERM/`classifyOwnerLease` coverage — confirms the EPERM reclaim corner is untested (the changelog itself lists an EPERM-mock vitest as a follow-up).
- No new external routing claims.

## Edge Cases
1. **Heartbeat-start is NOT in the EPERM race path (dispatch framing refined):** The dispatch framed F-002 as "EPERM mishandled relative to heartbeat start." Tracing the flow: `startOwnerLeaseHeartbeat` (:1215) runs only AFTER a launcher wins acquisition (`acquired:true`, :1344-1349 → launchServer → :1215). An EPERM-hitting launcher returns `{acquired:false}` at :361 and bridges/exits before any heartbeat starts. So there is no "heartbeat started despite EPERM" ordering race; the real defect is the narrower classification-ordering reachability gap (:339 before :348). Recorded so the dispatch hypothesis is corrected, not silently dropped.
2. **NEW adjacent observation (recorded, not a standalone finding):** `acquireOwnerLeaseFile` at :374 and :388 calls `classifyOwnerLease(holder/reread)` to label a losing race; if that holder's PID resolves to EPERM, the label is `'unknown-eperm'` — purely diagnostic (drives a log line + bridge target), no correctness impact. Confirms the EPERM path is diagnostic-only outside the reclaim gap and adds no new defect.
3. **Self-heal bounds for F-004:** lost reclaim self-heals within one heartbeat interval (30s) or the next exclusive acquire; bounded transient, not a persistent inconsistency.

## Confirmed-Clean Surfaces
- **Dead-socket respawn double-check (`respawnAfterDeadSocket` :693-705):** CLEAN. Before reaping, it re-reads the owner lease (:693-694) and the pid lease (:700-701) and bows out (`respawn-superseded`) if either changed while waiting for the respawn lock — a correct serialization guard. The EPERM refusal at :708-712 is the only path that blocks a genuinely-needed respawn, and only for the foreign-uid corner (F-002).
- **Atomicity of reclaim (`writeOwnerLeaseFile` :283-285):** CLEAN for torn-write — `renameSync` is atomic; the only gap is durability (F-004), not consistency.

## Ruled Out
1. **F-002 as a P1 must-fix gate bug:** RULED OUT (downgraded to P2). The structural double-block is real, but the only stuck failure trace requires cross-uid PID reuse, contradicting the documented same-user multi-sandbox deployment; the common EPERM case is correct-by-design (live cross-sandbox owner → bridge). Hunter confirmed structure; Skeptic produced the changelog-006-009 + ESRCH-vs-EPERM + deployment counterevidence; Referee downgraded P1→P2.
2. **"EPERM mishandled relative to heartbeat start" as a distinct race:** RULED OUT. Heartbeat start is post-acquisition-win only; EPERM-hitting launchers never reach it (see Edge Case 1).
3. **F-004 escalation to P1 (double-owner via lost reclaim):** RULED OUT. Atomic rename + clean-no-owner loss mode + re-read serialization + 30s heartbeat self-heal bound impact to a transient lost reclaim; stays P2.

## Next Focus
- **Dimension:** correctness
- **Focus area:** carry the corrected severities forward; if a later iteration revisits A1, target the foreign-uid / multi-uid owner question (only path that would re-escalate F-002) and confirm whether any spec-memory deployment runs the owner as a different uid than the launcher.
- **Reason:** both verified findings are now P2; the only re-escalation lever is a multi-uid deployment, which is the single unverified assumption.
- **Rotation status:** A1 adversarial-verify (this pass) complete; verdicts settled for F-002 (→P2) and F-004 (confirmed P2).
- **Blocked/productive carry-forward:** BLOCKED — do not re-litigate F-002 as P1 or as a heartbeat-start race (both refuted with evidence). PRODUCTIVE — the EPERM-mock vitest follow-up (named in changelog-006-009) and the multi-uid deployment question remain open hardening items.
- **Required evidence (if A1 revisited):** spec-memory owner-vs-launcher uid model; any container/root-daemon deployment for the owner.
- **Recovery note:** N/A — adjudication completed within budget.
