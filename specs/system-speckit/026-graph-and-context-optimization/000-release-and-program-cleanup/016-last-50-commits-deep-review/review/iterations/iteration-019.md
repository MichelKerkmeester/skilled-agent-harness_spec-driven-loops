# Iteration 019 — Cross-cutting systemic synthesis (dimension: correctness, angle: cross-cutting)

## Dispatcher
- **Run:** 19 of 20 (dispatch slot — parallel/synthesis mode)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness | **Angle:** cross-cutting (systemic patterns spanning multiple prior findings)
- **Budget profile:** scan (target 9-11 tool calls; used 10)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`); synthesis across findings from iterations 002-010
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-019.md` + `deltas/iter-019.jsonl`. Did NOT touch `deep-review-state.jsonl`, `deep-review-strategy.md`, findings-registry, or config.

## Files Reviewed
- **All prior iteration findings (read-first per dispatch):** `iterations/iteration-002.md` … `iteration-010.md` (F-002, F-003, F-004, F-005, F-A2-01/02/03, A3 P2s, F-A4-01/02/03, F-A5-01/02/03, F-A6-01/02/03, A7 P2, F-A8-01/02, F-A9-01).
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` (full, 726 lines) — every default-on flag; the 3 flags flipped in-range; `isOptInEnabled` vs `isFeatureEnabled` selector.
- `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` (full, 82 lines) — `isFeatureEnabled` + `getRolloutPercent` + `deterministicBucket` (the SHARED default-on gate behind ~70 flags).
- `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:180-285` — the only test asserting the flipped flags' default semantics.
- **socket-server fork census (find):** 4 copies — `shared` (402L canonical), `system-code-graph` (402L FORK), spec-kit + skill-advisor (22L shims). Confirms F-003 surface at HEAD.
- **drift-guard census (grep `skills/*/scripts`):** mirror-drift guards EXIST for agent mirrors (`deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs`, `shared/lib/mirror-sync-verify.cjs`, `shared/tests/mirror-sync-verify.vitest.ts`) but NONE target the socket-server forks or the launcher `processLiveness` duplication.
- git: `0060a097b3` (default-on flip), `a2d1a9bc9e` (in-range remediation that reverted the destructive reconsolidation flip).

## Findings — New

### P0 Findings
None. The three cross-cutting clusters compound EXISTING P1/P2 findings into worse combined-failure / latent-spread risk, but no cross-cutting analysis produced a new immediate-harm P0. (The most severe combined cluster, the shutdown compound F-X19-02, is bounded by durable crash-recovery — same P1 ceiling its constituents already carry.)

### P1 Findings

1. **Systemic copy-paste-fork-without-a-drift-guard pattern: a single security TOCTOU defect (F-A5-01/F-A5-03) now lives unsynced in TWO daemon binaries, and the repo HAS the drift-guard machinery but never pointed it at these runtime forks** -- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:1-402` (byte-identical fork of `shared/ipc/socket-server.ts`) + `.opencode/bin/mk-code-index-launcher.cjs:296-306` (`processLiveness` fork of `bin/lib/model-server-supervision.cjs:274-284`) vs the EXISTING-but-unapplied guards `.opencode/skills/deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs` + `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs` -- This is the emergent pattern the dispatch asked about, and it is bigger than any single prior finding. The consolidation work collapsed `mcp_server` and `skill-advisor` to 22-line re-export shims (so they *cannot* drift), but left code-graph as a full 402-line FORK whose own header still claims to be "canonical" (F-003). Iteration 006 then proved that fork is BYTE-IDENTICAL today and therefore carries BOTH security defects — the fresh-bind tail-symlink TOCTOU (F-A5-01, P1) and the fail-open canonicalization (F-A5-03, P2) — into a SECOND privileged daemon (`mk_code_index`). The same anti-pattern repeats at the launcher layer: `processLiveness` (the function whose ESRCH/EPERM contract drives lease-reclaim correctness, F-002) is duplicated verbatim into `mk-code-index-launcher.cjs` instead of imported (F-005). The systemic risk is not "two copies exist" — it is that **the project already ships a generic drift-detection harness (`mirror-sync-verify.cjs` + `check-mirror-drift.cjs`, with its own vitest) for AGENT mirrors, yet none of it is wired to assert byte-equality of the socket-server fork or the processLiveness twin.** So a future security fix to the `shared/` tail-symlink fence will land in 1 of 2 daemons and silently NOT reach code-graph, re-opening F-A5-01 in `mk_code_index` with zero CI signal. A defect-duplication-without-sync pattern is the highest-leverage latent correctness/security risk in the range because it converts every future single-file security fix into a silent partial fix.
   - Finding class: systemic drift-hazard (security-defect duplication across consolidation forks; available guard not applied)
   - Scope proof: all 4 socket-server files + both launchers are in-range; `find` confirms 2×402L forks + 2×22L shims at HEAD; `grep skills/*/scripts` confirms `check-mirror-drift.cjs`/`mirror-sync-verify.cjs` exist (for agent mirrors) and NONE reference socket-server or processLiveness; F-A5-01/F-A5-03 (iter 6) proved the code-graph fork is byte-identical and carries the security defects.
   - Affected surface hints: make code-graph's socket-server a re-export shim like the other two (eliminates the fork entirely), OR point the existing `mirror-sync-verify` harness at `{code-graph socket-server == shared}` and `{mk-code-index processLiveness == model-server-supervision}` byte-equality; the header's false "canonical" label in the fork.

   ```json
   {
     "id": "F-X19-01",
     "type": "systemic-drift-hazard",
     "severity": "P1",
     "claim": "The consolidation forked the socket-server (and processLiveness) without a drift guard, so a single security TOCTOU (F-A5-01) is now duplicated byte-for-byte into a second daemon (code-graph) and any future fix to shared/ will silently not propagate — while the repo already owns a generic drift-verify harness that was never aimed at these runtime forks.",
     "evidenceRefs": [
       "system-code-graph/mcp_server/lib/ipc/socket-server.ts:1-402 (402L fork; header claims canonical)",
       "system-spec-kit/mcp_server/lib/ipc/socket-server.ts (22L re-export shim)",
       "system-skill-advisor/mcp_server/lib/ipc/socket-server.ts (22L re-export shim)",
       "shared/ipc/socket-server.ts:238,355 (the F-A5-01 TOCTOU lines duplicated into the fork)",
       "bin/mk-code-index-launcher.cjs:296-306 (processLiveness fork) vs bin/lib/model-server-supervision.cjs:274-284",
       "deep-improvement/scripts/lib/mirror-sync-verify.cjs (drift-verify harness exists, not applied here)",
       "deep-improvement/scripts/agent-improvement/check-mirror-drift.cjs (mirror-drift guard exists, agent-mirror only)"
     ],
     "counterevidenceSought": "Grepped all skills/*/scripts for any guard referencing socket-server or processLiveness byte-equality — found only agent-mirror guards + an unrelated node_modules vite chunk. Confirmed via find that only spec-kit + advisor are shims; code-graph remains a full fork at HEAD. Confirmed iter-006 diff -q result (byte-identical) still describes HEAD (same 402L counts).",
     "alternativeExplanation": "code-graph intentionally vendors its own copy for package independence, so duplication is by design. Rejected as a clean pass: even if vendoring is intentional, (a) the absence of ANY drift guard while the repo ships one for agent mirrors is an inconsistent hardening posture, and (b) the fork already carries an active P1 security defect (F-A5-01) that a shared-only fix would not reach. Intentional vendoring without a sync guard is exactly the failure mode.",
     "finalSeverity": "P1",
     "confidence": 0.78,
     "downgradeTrigger": "Drop to P2 if a build/CI step already asserts code-graph socket-server == shared byte-equality (none found this pass), or if the underlying F-A5-01 is itself downgraded to P2 by a deployment guarantee (then this becomes a maintainability drift-hazard).",
     "findingClass": "systemic-drift-hazard",
     "scopeProof": "All forks + launchers + the existing-guard scripts are in-range / live; cross-references F-003, F-005, F-A5-01, F-A5-03 from iters 2 and 6.",
     "affectedSurfaceHints": ["code-graph socket-server shim conversion OR byte-equality CI guard", "mk-code-index processLiveness import OR parity guard", "false 'canonical' header in the fork", "reuse existing mirror-sync-verify harness for runtime forks"]
   }
   ```

2. **Shutdown/lifecycle durability cluster compounds under a real concurrent-session SIGTERM: the unfenced ingest worker (F-A4-01), the divergent exit-code handler stacks (F-A4-02), and the non-re-entrant socket server (F-A4-03) interact into a worse combined failure than any one alone** -- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1563-1610,1624-1628,1681-1692` + `lib/ops/job-queue.ts:746-752` + `lib/runtime/shutdown-hooks.ts:129-148` + `shared/ipc/socket-server.ts:357-388` -- Individually these are one P1 (F-A4-01) and two P2s (F-A4-02, F-A4-03). The cross-cutting question — "do they compound on a real concurrent-session SIGTERM?" — resolves YES, and the compound is materially worse: (1) This checkout is shared by multiple Claude/codex sessions (Known Context + memory `concurrent-session-git-index-race`); a SIGTERM to one daemon while another session drives an ingest job is operationally reachable, not theoretical (iter-005 Edge Case 4). (2) On that signal BOTH handler stacks fire (F-A4-02): `shutdown-hooks.ts:129-134` races to `exitProcess(143|130)` while `context-server.ts:1681-1692` runs `fatalShutdown(...,0)`. The non-determinism is not merely a cosmetic exit-code disagreement — it is a RACE on WHICH stack reaches `process.exit` first. (3) If the bare `shutdown-hooks` stack wins the exit race, it calls `exitProcess` WITHOUT running `fatalShutdown`'s ordered drain (`runShutdownHooks` is step 9 of fatalShutdown at 1607-1609, but the standalone handler doesn't invoke the fileWatcher-first / closeDb-after sequence). That skips the very ordering that F-A4-01 depends on to NOT leave a dirty WAL: the ingest worker (already unfenced, F-A4-01) keeps writing through `get_db()` (which reopens a closed DB) with no drain, and now potentially no `closeDb` TRUNCATE checkpoint at all. (4) Even if `fatalShutdown` wins, its 5000ms `Promise.race` force-kill (1624-1628) can fire mid-`indexSingleFile` while the worker is reopening the DB (F-A4-01), leaving the `.unclean-shutdown` marker re-created and a non-empty WAL at rest — and the leaked non-re-entrant socket server (F-A4-03) means a fast respawn's bind hits the EADDRINUSE reclaim branch (the only path that runs the `canUnlinkExistingSocket` fence), which is also the branch where F-A5-01's fresh-bind gap interacts. So the three A4 findings + the A5 fresh-vs-reclaim asymmetry form a coupled failure surface that a concurrent-session SIGTERM can drive into: dirty-marker + uncheckpointed WAL + nondeterministic exit code + the socket landing on the reclaim branch — all recoverable on next boot (the P1 ceiling holds), but the COMBINED probability and blast radius are higher than the sum of the parts, and the divergent-exit-stack race is the new amplifier the single-finding view missed.
   - Finding class: systemic lifecycle-compound (concurrent-SIGTERM failure interaction)
   - Scope proof: all cited lines are in-range A4 targets (verified in iter-005); the concurrent-session premise is the documented Known Context; the handler-stack race is F-A4-02; the unfenced worker is F-A4-01; the socket reclaim-branch coupling is F-A4-03 ∩ F-A5-01.
   - Affected surface hints: collapse to ONE signal-handler stack (let `fatalShutdown` own SIGTERM/SIGINT exclusively; make `shutdown-hooks` register a hook rather than its own `process.once` exit); add the ingest worker to the cleanup drain BEFORE `closeDb`; the fix to F-A4-02 (single stack) is the keystone — it guarantees the ordered drain always runs, which retroactively bounds F-A4-01.

   ```json
   {
     "id": "F-X19-02",
     "type": "systemic-lifecycle-compound",
     "severity": "P1",
     "claim": "On a concurrent-session SIGTERM, the two divergent signal-handler stacks (F-A4-02) race to exit; if the bare shutdown-hooks stack wins it skips fatalShutdown's ordered drain, so the already-unfenced ingest worker (F-A4-01) can leave a dirty WAL with no closeDb checkpoint, while the non-re-entrant socket leak (F-A4-03) forces the next respawn onto the EADDRINUSE reclaim branch — a coupled failure worse than any single A4 finding.",
     "evidenceRefs": [
       "context-server.ts:1681-1692 (fatalShutdown SIGTERM/SIGINT -> exit 0)",
       "lib/runtime/shutdown-hooks.ts:129-148 (own process.once SIGTERM/SIGINT -> exitProcess 143/130)",
       "context-server.ts:1607-1609 (runShutdownHooks is step 9 of fatalShutdown, not the standalone stack)",
       "context-server.ts:1624-1628 (5000ms Promise.race force-kill can skip closeDb)",
       "lib/ops/job-queue.ts:746-752 (fire-and-forget drainQueue, no shuttingDown guard) [F-A4-01]",
       "shared/ipc/socket-server.ts:357-388 (non-re-entrant activeServer leak) [F-A4-03]",
       "shared/ipc/socket-server.ts:335 (canUnlinkExistingSocket fence only on EADDRINUSE reclaim) [F-A5-01 coupling]"
     ],
     "counterevidenceSought": "Checked whether shutdown-hooks' own handler also runs the ordered drain — it does NOT (it calls handleShutdownSignal->exitProcess directly); checked whether re-entrancy guards prevent the EXIT race — the guards (shuttingDown 1559, running 63) prevent double-RUN of hooks but do not arbitrate which stack reaches process.exit first; confirmed crash-recovery (resetIncompleteJobsToQueued + boot unclean-marker repair) bounds impact to recoverable, capping at P1.",
     "alternativeExplanation": "In practice the ingest queue is usually idle at shutdown and fatalShutdown almost always wins the race, so the compound never materializes. Partially accepted (this is why it stays P1, recoverable, not P0) — but the concurrent-session context makes a mid-job SIGTERM reachable, and the exit-stack race is genuinely nondeterministic, so the worst-case compound is a real release-readiness concern, not theoretical.",
     "finalSeverity": "P1",
     "confidence": 0.7,
     "downgradeTrigger": "Drop toward P2 if a single-stack fix already lands (only one SIGTERM handler), or if the ingest worker is provably stopped before closeDb in some path not found this pass, or if jobs are contractually idle at shutdown.",
     "skepticPass": "Skeptic: 'aren't these just 3 independent findings re-stated?' Referee: NO — the NEW fact is the exit-stack RACE (F-A4-02) can BYPASS the ordered drain that F-A4-01's recoverability implicitly assumed; that coupling is only visible at the cross-cutting level and raises combined blast radius. Confirmed P1 (recoverable ceiling holds), reported as a compound, not a re-count.",
     "findingClass": "systemic-lifecycle-compound",
     "scopeProof": "All cited lines are in-range A4/A5 targets verified in iters 5-6; the concurrent-session premise is documented Known Context.",
     "affectedSurfaceHints": ["collapse to one SIGTERM/SIGINT handler stack (F-A4-02 fix is the keystone)", "drain ingest worker before closeDb (F-A4-01)", "dispose prior socket server on re-init (F-A4-03)"]
   }
   ```

### P2 Findings

1. **"Default-on flip" pattern confirmed and bounded: three opt-in gates were flipped to graduated-default-on in ONE commit (`0060a097b3`); one destructive flip was caught + reverted in-range (`a2d1a9bc9e`), but the two survivors (enrichment A2, auto-fix A6) share a single rollout gate whose partial-rollout (`SPECKIT_ROLLOUT_PERCENT<100`) bucketing branch is untested — extending F-A6-01 from one flag to the whole default-on cohort** -- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:143-145,152-153,170-171` + `lib/cognitive/rollout-policy.ts:46-74` + `tests/search-flags.vitest.ts:252-283` -- The dispatch asked whether OTHER defaults were flipped on in-range without coverage of the new default branch. Answer, verified: commit `0060a097b3` flipped THREE gates in one shot from `isOptInEnabled` (default OFF) to `isFeatureEnabled` (default ON): `SPECKIT_RECONSOLIDATION_ENABLED` (destructive merge/deprecate), `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` (A2), `SPECKIT_QUALITY_AUTO_FIX` (A6). The DESTRUCTIVE one (reconsolidation) was correctly caught by the in-range deep-review remediation `a2d1a9bc9e` (026/017) and reverted to opt-in (`search-flags.ts:143-145` now `isOptInEnabled`, asserted default-FALSE at `search-flags.vitest.ts:256`) — a positive self-correction signal. The two survivors (enrichment, auto-fix) are correctly default-on and DO have a unit assertion that the default is `true` (`search-flags.vitest.ts:253-254`). The systemic gap that only surfaces at the cross-cutting level: (a) ALL ~70 graduated flags resolve through the SINGLE shared `isFeatureEnabled` gate, which is additionally governed by `SPECKIT_ROLLOUT_PERCENT` (default 100) and a `deterministicBucket` partial-rollout path (`rollout-policy.ts:64-73`); (b) every default-on test asserts only the `percent>=100 -> true` branch — NO test exercises `SPECKIT_ROLLOUT_PERCENT` between 1-99, so the `deterministicBucket`/`isIdentityInRollout` bucketing branch (the one a real staged rollout would use) is untested across the entire flag cohort; (c) this is the same untested-default-branch class as F-A6-01 (auto-fix default-on path effectively untested at the integration level) but generalized — F-A6-01 is one instance of a cohort-wide coverage shape. Per-flag this is low-weight (P2), but the shared single-gate + untested partial-rollout makes it a systemic test-honesty note worth one finding rather than 70.
   - Finding class: systemic test-coverage-gap (shared default-on gate; untested partial-rollout branch; generalizes F-A6-01)
   - Scope proof: `0060a097b3` diff shows the 3 `isOptInEnabled`->`isFeatureEnabled` flips (RECONSOLIDATION/ENRICHMENT/AUTO_FIX); `a2d1a9bc9e` diff shows the reconsolidation revert; current source confirms 144 opt-in (reverted), 153 + 171 graduated (survivors); `rollout-policy.ts:46-73` is the shared gate with the untested 1-99 bucket branch; `search-flags.vitest.ts:252-283` asserts only the `>=100 -> true` default, no PERCENT<100 case.
   - Affected surface hints: add a rollout-policy unit test for `SPECKIT_ROLLOUT_PERCENT` in 1-99 (identity bucketing determinism); the F-A6-01 integration-branch test (advisory mode + unset env) is the highest-value single addition; document that the reverted reconsolidation flip is the audited safe boundary.

   ```json
   {
     "id": "F-X19-03",
     "type": "systemic-test-coverage-gap",
     "severity": "P2",
     "claim": "Three opt-in gates were flipped default-on in one commit (0060a097b3); the destructive reconsolidation flip was correctly reverted in-range (a2d1a9bc9e), but the two survivors plus ~70 graduated flags share one isFeatureEnabled gate whose partial-rollout (ROLLOUT_PERCENT 1-99) bucketing branch is untested everywhere — generalizing F-A6-01 from one flag to the whole cohort.",
     "evidenceRefs": [
       "search-flags.ts:143-145 (isSaveReconsolidationEnabled reverted to isOptInEnabled = default OFF)",
       "search-flags.ts:152-153 (isPostInsertEnrichmentEnabled = isFeatureEnabled = default ON, survivor)",
       "search-flags.ts:170-171 (isQualityAutoFixEnabled = isFeatureEnabled = default ON, survivor)",
       "rollout-policy.ts:59-74 (single isFeatureEnabled gate)",
       "rollout-policy.ts:46-51,64-73 (deterministicBucket partial-rollout branch, untested)",
       "tests/search-flags.vitest.ts:252-283 (asserts only >=100->true default; no PERCENT<100 case)",
       "0060a097b3 (the 3-flag default-on flip commit)",
       "a2d1a9bc9e (in-range remediation reverting reconsolidation to opt-in)"
     ],
     "counterevidenceSought": "Grepped tests for any SPECKIT_ROLLOUT_PERCENT assignment in 1-99 driving a flag through isFeatureEnabled — none found; confirmed the reconsolidation revert via git show a2d1a9bc9e; confirmed survivors via current-source grep; cross-checked F-A6-01 (iter 7) which already flagged the auto-fix integration branch — this finding generalizes it to the gate + cohort.",
     "alternativeExplanation": "Partial rollout is an ops-only knob never used in CI, so testing percent>=100 is sufficient. Partially accepted (keeps this at P2) — but a staged rollout is exactly when a bucketing bug would silently mis-gate a default-on feature for a fraction of identities, and no test would catch it; the destructive-flip near-miss shows the flip pattern is high-risk enough to warrant cohort-level coverage discipline.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "Drop to advisory if a rollout-policy unit suite already covers PERCENT in 1-99 with deterministic bucketing (not found in the searched test set), or if partial rollout is contractually never used."
   }
   ```

## Traceability Checks
- **Iteration number:** Committed `deep-review-state.jsonl` has 2 `type:"iteration"` lines (runs 1-2); `deltas/` holds iters 1-10. This is dispatch slot 19 (synthesis pass), parallel/synthesis mode — JSONL-derived serial numbering is superseded by the explicit dispatch assignment per the parallel-safety contract. Wrote only `iteration-019.md` + `deltas/iter-019.jsonl`; neither pre-existed. No shared-state mutation. Recorded as Edge Case 1.
- **Range integrity:** HEAD `12de3d3a7e`; the default-on flip is `0060a097b3` and its in-range remediation is `a2d1a9bc9e` (both inside `a9e9bdb0a5^..HEAD`). socket-server fork counts (2×402L + 2×22L) verified at HEAD via `find`.
- **Cross-cutting provenance:** F-X19-01 synthesizes F-003 + F-005 + F-A5-01 + F-A5-03 (iters 2, 6); F-X19-02 synthesizes F-A4-01 + F-A4-02 + F-A4-03 + F-A5-01 coupling (iters 5, 6); F-X19-03 synthesizes + generalizes F-A6-01 (iter 7) and F-A2 enrichment context (iter 3). All constituent file:line evidence re-confirmed against current source where new claims were added (search-flags.ts, rollout-policy.ts, the fork census, the guard census).
- **Lineage:** sessionId `2026-06-05T11:16:17Z`, generation 1, lineageMode new — consistent with prior iterations.

## Integration Evidence
- **Existing drift-guard harness (named):** `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs` + `.../agent-improvement/check-mirror-drift.cjs` + `.../shared/tests/mirror-sync-verify.vitest.ts` — a generic byte/structure drift-verification surface that the repo already ships for AGENT mirrors. Named explicitly because F-X19-01's recommendation is to reuse it for the socket-server / processLiveness forks rather than build new tooling. NOT applied to the runtime forks today (grep confirmed zero socket-server/processLiveness references in any guard script).
- **Shared rollout gate (named):** `lib/cognitive/rollout-policy.ts` `isFeatureEnabled` is the single function ~70 `search-flags.ts` accessors delegate to; it is also the partial-rollout governor via `SPECKIT_ROLLOUT_PERCENT`. This is the integration chokepoint behind F-X19-03.
- **socket-server consumers (named):** `shared` (canonical), `system-spec-kit/mcp_server` + `system-skill-advisor/mcp_server` (shims), `system-code-graph/mcp_server` (fork) — the 1-of-3-doesn't-conform shape that defines F-X19-01.

## Edge Cases
1. **Synthesis-mode iteration numbering (resolved toward dispatch):** committed state.jsonl lags (2 iterations) vs deltas/ (10) vs dispatch slot 19. Honored slot 19 per parallel-safety; reducer reconciles ordering. Safest in-scope interpretation; no shared-state write.
2. **Reconsolidation flip already remediated (contradiction adjudicated):** the raw `0060a097b3` diff shows reconsolidation flipped to default-on (alarming in isolation), but `git show a2d1a9bc9e` proves it was reverted to opt-in WITHIN the same range. Cited both sides; adjudicated to "destructive flip caught and reverted in-range — a positive signal, NOT a live defect." Reporting HEAD truth (opt-in) prevents a false-positive P1.
3. **Cross-cutting P1 vs re-count risk (skeptic-checked):** F-X19-01 and F-X19-02 each had to clear "is this just re-stating prior findings?" The Referee test for both: a NEW fact emerges only at the cross-cutting level — for F-X19-01, the EXISTING-but-unapplied drift-guard harness (the project owns the fix machinery yet didn't aim it here); for F-X19-02, the exit-stack RACE that can BYPASS the ordered drain F-A4-01's recoverability implicitly assumed. Both pass: they are emergent, not re-counts.
4. **No P0 escalation despite combined severity:** the shutdown compound (F-X19-02) is the worst combined cluster but stays P1 because durable crash-recovery (resetIncompleteJobsToQueued + boot unclean-marker repair) bounds it to recoverable — the cross-cutting view raises probability/blast-radius, not recoverability. Honest ceiling held; no inflation to P0.

## Confirmed-Clean Surfaces
- **Destructive default-on flip (`SPECKIT_RECONSOLIDATION_ENABLED`):** CLEAN at HEAD — flipped by `0060a097b3` then correctly reverted to opt-in by in-range remediation `a2d1a9bc9e`; unit-asserted default-FALSE (`search-flags.vitest.ts:256`). The in-range deep-review loop caught its own most dangerous flip.
- **Consolidation shims (`mcp_server` + `skill-advisor` socket-server):** CLEAN — 22-line re-export shims that structurally cannot drift; only code-graph remains a fork (F-X19-01).
- **Survivor default-on flags (enrichment, auto-fix) default assertion:** the `=true` default IS unit-asserted (`search-flags.vitest.ts:253-254`); the gap is the partial-rollout branch + the F-A6-01 integration branch, not the default-true assertion itself.

## Ruled Out
1. **Reconsolidation default-on as a live cross-cutting P1:** RULED OUT. The flip exists in `0060a097b3` but the in-range remediation `a2d1a9bc9e` reverted it before HEAD. Reporting it as live would be a false positive against the reviewed range. (It IS cited as the audited safe boundary in F-X19-03.)
2. **A cross-cutting P0:** RULED OUT. No combination of the existing P1/P2 findings produces immediate, non-recoverable harm. The shutdown compound (F-X19-02) is the closest but is recovery-bounded to P1; the fork-drift (F-X19-01) is latent (byte-identical today) and gated on a future shared-only fix.
3. **Treating F-X19-01/02 as duplicate re-counts of F-003/F-005/F-A4-*/F-A5-*:** RULED OUT per Edge Case 3 — each carries an emergent fact (unapplied-guard machinery; exit-stack-bypass-of-drain) absent from the constituent single findings.

## Next Focus
- **Dimension:** correctness | **Angle:** final adversarial-verify / convergence (iter 20).
- **Focus area:** Re-assert the three cross-cutting findings under skeptic challenge in the convergence pass, and confirm severity ordering for the review-report: P1 cohort = {F-002, F-003, F-A4-01, F-A5-01, F-X19-01, F-X19-02}; P2 cohort includes F-X19-03 + the prior P2s. Verify no P0 across the whole corpus (consistent with 18 iterations finding none).
- **Reason:** This synthesis pass found the systemic risk concentrates in (a) defect-duplication-without-sync across consolidation forks and (b) the concurrent-SIGTERM lifecycle compound — both are P1 promotion-relevant for the CONDITIONAL verdict the corpus is trending toward (no P0, multiple P1). The default-on flip pattern is bounded and largely self-corrected in-range.
- **Rotation status:** cross-cutting synthesis complete (iter 19). One convergence/verify iteration remains (iter 20).
- **Blocked/productive carry-forward:** Productive — F-X19-01 (fork drift-guard) is the single highest-leverage remediation (one CI guard or one shim conversion retroactively protects F-A5-01 propagation); F-X19-02 (single signal-handler stack) is the keystone that retroactively bounds F-A4-01. Both should headline the review-report's recommended-remediation section. BLOCKED: do not re-raise reconsolidation default-on as a finding (reverted in-range).
- **Required evidence (iter 20):** none new required; convergence pass re-checks the carried P1 set against the skeptic challenges already recorded in each claim-adjudication block.
- **Recovery note:** n/a — synthesis completed cleanly within the scan budget (10 tool calls).
