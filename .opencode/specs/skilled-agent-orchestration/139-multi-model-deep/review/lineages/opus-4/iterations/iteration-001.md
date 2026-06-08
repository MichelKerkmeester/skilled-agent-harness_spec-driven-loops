# Iteration 1: Single-pass breadth review (correctness + security + traceability + maintainability)

## Focus
Single-iteration (maxIterations=1) breadth review of the recent daemon-reliability /
re-election / reap-before-respawn / hook-portability work across all 12 target files.
Dimensions covered in one pass: correctness, security, traceability, maintainability.

Files under review (12):
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts`
- `.opencode/scripts/session-cleanup.sh`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
- `.claude/settings.local.json`
- `.codex/hooks.json`
- `.devin/hooks.v1.json`

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.85

## Findings

### P1, Required

- **F001**: Reap-before-respawn relies on a "spawn mutex" the stale-owner-lease reclaim path does not actually provide, `.opencode/bin/mk-spec-memory-launcher.cjs:1486`.
  The new stale-reclaim reap (`main()` `if (leaseResult.staleReclaimable)`, lines 1482-1502) reaps the recorded `childPid` before respawn and its comment states: *"The owner-lease O_EXCL acquisition above is the spawn mutex, so only the winning fresh launcher reaches here."* That guarantee holds only for the `existing === null` branch of `acquireOwnerLeaseFile()`, which uses `writeOwnerLeaseFileExclusive()` (`O_EXCL`, a true mutex — lines 456-467). When a stale owner lease still EXISTS on disk (owner SIGKILLed / crashed / heartbeat-stale — the detached re-election daemon survives a SIGKILL of its owner, so the daemon lease then records a dead owner pid + a live `childPid`), acquisition takes the reclaim branch (lines 468-481), which uses the NON-exclusive `writeOwnerLeaseFile()` (tmp+rename, last-writer-wins) followed by a reread. That reread does not serialize concurrent reclaimers: for the interleaving `A.write → A.reread → B.write → B.reread`, launcher A reads its own pid (acquired=true) AND launcher B reads its own pid (acquired=true) — BOTH "acquire" ownership. The reap is therefore performed by two launchers, both then respawn a context-server, and two daemons hold the same WAL DB open (the exact double-writer the fix exists to close). The downstream `writeLeaseFile()` + reprobe (lines 1522-1529) is a SECOND non-exclusive last-writer-wins TOCTOU that lowers — but does not eliminate — the probability; correctness rests on a probabilistic second check, not the claimed `O_EXCL` mutex. This is "a claim that does not match the code": the comment asserts an exclusivity guarantee the chosen write path does not deliver for the very branch it annotates.

  ```json
  {
    "findingId": "F001",
    "claim": "The stale-owner-lease reclaim that gates the reap-before-respawn is NOT mutually exclusive, so two concurrent fresh launchers can both acquire ownership, both reap, and both respawn a daemon onto the same WAL DB, contradicting the inline 'O_EXCL spawn mutex' guarantee.",
    "evidenceRefs": [
      ".opencode/bin/mk-spec-memory-launcher.cjs:468-481",
      ".opencode/bin/mk-spec-memory-launcher.cjs:456-467",
      ".opencode/bin/mk-spec-memory-launcher.cjs:1486-1502",
      ".opencode/bin/mk-spec-memory-launcher.cjs:1522-1529"
    ],
    "counterevidenceSought": "Checked for a stronger downstream guard: (a) acquireBootstrapLock() (lines 1229-1272, 1507) is a build-serialization lockdir — the EEXIST loser returns false and CONTINUES to writeLeaseFile()/launchServer(), so it is NOT a spawn mutex; (b) the writeLeaseFile() reprobe at 1522-1529 is itself a non-exclusive tmp+rename + reread, the same TOCTOU shape, so it reduces but does not close the window; (c) looked for an OS-level single-writer backstop — SQLite WAL mode explicitly permits multiple processes to open the same DB (that is precisely the double-writer hazard documented at lines 188-195 and in the adoption-live test), so the daemon open is not a backstop.",
    "alternativeExplanation": "Could argue rename atomicity makes the reread a sufficient mutex. Rejected: rename atomicity only guarantees no partial file; it imposes no happens-before between A's reread and B's write, so the A.write/A.reread/B.write/B.reread interleaving lets both read their own pid. The clean-DISPOSAL headline path (SIGTERM -> release -> clearOwnerLeaseFile) clears the owner lease and so takes the safe existing===null O_EXCL path; only the stale-owner-still-present path (SIGKILL/crash/heartbeat-stale) is exposed, which narrows but does not remove the defect.",
    "finalSeverity": "P1",
    "confidence": 0.72,
    "downgradeTrigger": "Downgrade to P2 if the reclaim branch is switched to an atomic compare-and-swap (e.g. reclaim via rename-into-place of an O_EXCL temp keyed on a unique token, or an flock/owner-lease mutation lock shared with owner-lease.ts) OR if a co-residency regression test proves the reprobe closes the concurrent stale-reclaim window; downgrade further if the daemon gains an exclusive DB-open lock that fails the second writer closed.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: non-exclusive stale-owner reclaim under the reap-before-respawn fix" }
    ]
  }
  ```

### P2, Suggestion

- **F002**: spec-memory `leaseHeldFromFile` omits the foreign-uid guard its code-index sibling enforces, `.opencode/bin/mk-spec-memory-launcher.cjs:556`.
  `mk-code-index-launcher.cjs:502-510` refuses to treat a LEGACY-path lease as held unless `fs.statSync(filePath).uid === process.getuid()`, with the rationale: *"A foreign-owned lease in a shared/former path could otherwise point this client at a spoofed IPC socket."* The spec-memory `leaseHeldFromFile` (lines 556-572) has no such uid check, yet it now surfaces the lease-recorded `socketPath` (line 562) that `bridgeReadiness()` / `maybeBridgeLeaseHolder()` connect through. A foreign-owned legacy lease (`.opencode/skill/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json`) could therefore redirect this client's MCP transport to an attacker-controlled socket. Real-world exploitability is low (the singular `.opencode/skill` path is normally an `ensureLayout`-managed symlink to `skills`, or absent — only a foreign-writable REAL dir there is exploitable), but the asymmetry with the hardened sibling against the same threat model, in the same body of recent socketPath work, is a defense-in-depth gap worth closing for parity.

- **F003**: Re-election RELEASE path SIGTERMs the model-server tree then `process.exit(0)` synchronously, so no SIGKILL escalation can ever fire, `.opencode/bin/mk-spec-memory-launcher.cjs:1372`.
  In the release branch (lines 1372-1385) the code does `hfControl.reapProcessTree(releasedModelServer.pid)` then `releasedModelServer.kill(signal)` and immediately `process.exit(0)`. `reapProcessTreeGroups` (`model-server-supervision.cjs:351-356`) schedules its descendant SIGKILL via `setTimeout(..., 1000).unref()`; because the launcher exits synchronously, that timer never runs, and the root `kill(signal)` (SIGTERM) has no follow-up SIGKILL/await either. The normal shutdown path (lines 1402-1417) DOES escalate to SIGKILL after a grace window. So an hf-model-server (or a descendant) that ignores or is slow on SIGTERM at release leaks as an init-reparented orphan. Blast radius is bounded — the model server is the embed sidecar (not the WAL writer), it has an idle self-exit, and the orphan sweeper can reap it — but the sweeper defaults OFF, so on default config a wedged model-server can persist until manual cleanup. The release path should mirror the normal-shutdown SIGTERM->grace->SIGKILL escalation (or document the intentional best-effort single-signal behavior).

- **F004**: code-index launcher carries the identical non-exclusive stale-owner reclaim with the same overstated "exactly one will see its own pid" comment, `.opencode/bin/mk-code-index-launcher.cjs:415`.
  `acquireOwnerLeaseFile()` reclaim (lines 415-429) mirrors the spec-memory pattern flagged in F001 (non-exclusive `writeOwnerLeaseFile` + reread, comment at 415-417 claiming "exactly one will see its own pid"). The blast radius is lower here — the code-index stale-reclaim branch (lines 916-918) only logs `staleReclaimed: true` and does NOT reap an orphan child the way spec-memory now does, and the code-index daemon is not detached — but the same not-a-true-mutex reasoning applies and the comment is similarly stronger than the code. Fix both launchers' reclaim mutex together for parity.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | mk-spec-memory-launcher.cjs:1482-1502, 1486-1487 | Shared-context claims verify against code EXCEPT the "O_EXCL spawn mutex" claim (F001): the documented exclusivity does not hold for the stale-reclaim branch it annotates. Reap-before-respawn presence + EPERM bail (1493-1500) confirmed. |
| checklist_evidence | partial | hard | spec.md, implementation-summary.md | Packet's spec.md / implementation-summary.md are UNFILLED Level-2 scaffolds (placeholder continuity, `completion_pct: 0`); the operative contract is `review/shared-context.md`. Code claims were verified against shared-context.md, not against an authored spec. |
| feature_catalog_code | n/a | advisory | — | The 3 runtime MCP configs that flip `SPECKIT_DAEMON_REELECTION` default-on are NOT in the 12-file target set; the code default-off + env-gated read (lines 196-198) is consistent with the default-on-via-config claim, but the configs themselves were out of scope to verify. |
| playbook_capability | n/a | advisory | — | No playbook scenarios in scope for this file set. |

## Assessment
- New findings ratio: 0.85 (first and only pass; all four findings novel)
- Dimensions addressed: correctness (F001, F003), security (F002), traceability (F001 comment-vs-code, cross-ref table), maintainability (F003, F004)
- Novelty justification: 1xP1 (weight 5) + 3xP2 (weight 3) = 8 severity-weighted new units, all first-seen; no refinements.

## Verified clean (checked, no defect)
- **Live DB isolation is real, not dead config**: the adoption-live test sets `SPEC_KIT_DB_DIR` (`daemon-reelection-adoption-live.vitest.ts:138`); `dist/core/config.js:35` honors `process.env.SPEC_KIT_DB_DIR` at the daemon, AND it equals the `__dirname`-derived default — double isolation. Not a finding.
- **Hook portability targets all exist**: every relative dist/script target in `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` resolves on disk (incl. the Devin UserPromptSubmit cross-package `system-skill-advisor/.../devin/user-prompt-submit.js`). `cd "${<RT>_PROJECT_DIR:-$PWD}" && node <relative>` rewrite is correct.
- **Reap-before-respawn EPERM bail**: lines 1493-1500 correctly report lease-held and exit(0) when the orphan child liveness is `unknown-eperm`, matching the shared-context claim.
- **Sequential single-reclaimer reap + double-WAL avoidance**: the adoption-live "fresh session after disposal" test (lines 210-243), incl. `sqliteOpenerPids(dbDir).length === 1`, validates the SEQUENTIAL path; F001 is strictly the CONCURRENT stale-owner sub-case.
- **session-cleanup.sh ancestry re-proof**: re-walks the live ppid chain before each kill and refuses the PPID-fallback that could cross sessions; orphan-sweep fallback defaults OFF. Sound.
- **session proxy reattach/replay**: `memory_save` replayability duplicate-secondary-index risk is explicitly documented as a known, out-of-scope gap (lines 146-153) — recorded as deferred, not a new defect.

## Ruled Out
- "`SPEC_KIT_DB_DIR` in the live test is a dead/unused env var" — ruled out: verified honored at `dist/core/config.js:35`.
- "Devin hook points at a non-existent path (cross-package skill-advisor)" — ruled out: target exists on disk.

## Dead Ends
- Searching for a missing hook dist target: none missing.

## Recommended Next Focus
Convert the stale-owner-lease reclaim (both launchers) to an atomic compare-and-swap or shared mutation lock and add a CONCURRENT-stale-reclaim co-residency regression (two launchers racing a SIGKILL'd owner, assert `sqliteOpenerPids == 1`). Then re-run to confirm F001 downgrades.

Review verdict: CONDITIONAL
