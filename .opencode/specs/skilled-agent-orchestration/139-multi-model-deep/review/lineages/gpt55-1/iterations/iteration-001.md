# Iteration 001: gpt55-1 Fanout Lineage

## Focus

Single-iteration breadth review across correctness, security, traceability, and maintainability for the recent daemon re-election, stale-reclaim reap, and hook-portability work.

Files reviewed:

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
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: Stale-owner reclaim is not the spawn mutex the reap fix relies on, `.opencode/bin/mk-spec-memory-launcher.cjs:468`. The stale-reclaim branch of `acquireOwnerLeaseFile()` rewrites the existing owner lease with `writeOwnerLeaseFile()` and then rereads it (`:468-481`), whereas the true `O_EXCL` path only applies when no owner lease exists (`:456-467`). The new reap-before-respawn branch explicitly relies on the owner lease as the spawn mutex (`:1482-1502`), but two fresh launchers can interleave `A write -> A reread -> B write -> B reread`, so both observe themselves as the owner before either reaches respawn. The later `writeLeaseFile()` reprobe has the same last-writer-wins shape (`:1522-1530`), and the bootstrap lock is skipped when artifacts are already ready (`:1229-1265`), so it is not a guaranteed spawn mutex. In the bad interleaving, both launchers can reap/respawn or briefly release detached daemons, undermining the single-writer guarantee the fix was meant to restore.

```json
{
  "findingId": "F001",
  "claim": "The stale-owner-lease reclaim that gates reap-before-respawn is not mutually exclusive, so two concurrent fresh launchers can both believe they acquired ownership and proceed into the respawn path despite the inline O_EXCL mutex claim.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:456-467",
    ".opencode/bin/mk-spec-memory-launcher.cjs:468-481",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1229-1265",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1482-1502",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1522-1530"
  ],
  "counterevidenceSought": "Checked the no-existing-lease O_EXCL branch, the stale-existing-lease branch, the bootstrap lock behavior, the downstream writeLeaseFile reprobe, and launchServer owner checks. None provide an atomic compare-and-swap for the stale-existing owner lease branch.",
  "alternativeExplanation": "A later owner-lease heartbeat or lease reprobe may cause one racing launcher to stand down, reducing the window. That does not make the branch a mutex, and detached re-election children can already have been spawned or released by then.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if stale-owner reclaim is protected by a real atomic mutation lock or compare-and-swap and a concurrent fresh-session reclaim test proves only one launcher can enter respawn.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F002**: Re-election release path does not await or escalate model-server shutdown, `.opencode/bin/mk-spec-memory-launcher.cjs:1372`. In the release branch, the launcher calls `hfControl.reapProcessTree(releasedModelServer.pid)`, sends the root model-server `SIGTERM`, and immediately `process.exit(0)` (`:1372-1384`). `reapProcessTreeGroups()` only schedules descendant `SIGKILL` from an unref'd timer (`model-server-supervision.cjs:347-356`), so the immediate process exit can prevent escalation from running; the root child also has no awaited grace or `SIGKILL`. The normal shutdown branch does wait and escalate (`mk-spec-memory-launcher.cjs:1402-1417`). This is bounded because it affects the model-server sidecar, not the context-server WAL writer, but a model server that ignores SIGTERM can leak until external cleanup.
- **F003**: Live test misses secondary-connected fresh-reap composition, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:210`. The first live test proves a secondary keeps transport after owner disposal when no fresh launcher reaps the daemon (`:183-208`). The second proves a fresh session reaps a released daemon and preserves a single DB writer when no secondary is connected (`:210-243`). The production promise combines both behaviors: a live secondary should survive while a later fresh session handles the stale lease. That matrix row is not asserted, so F001-like regressions can pass the current durability suite.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `shared-context.md:7-12`, `mk-spec-memory-launcher.cjs:1482-1502` | Release/reap behavior is present, but the O_EXCL mutex claim is stronger than the stale-reclaim implementation. |
| checklist_evidence | partial | hard | `checklist.md:47-118` | Local packet checklist is template-only; no checked item overstates completion, but it does not prove the daemon work. |
| feature_catalog_code | not run | advisory | n/a | Catalog files were outside this lineage's 12-file target. |
| playbook_capability | not run | advisory | n/a | Playbook files were outside this lineage's 12-file target. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: the P1 is a concrete concurrency issue in the recently added stale-reclaim reap path. The P2s are bounded supporting gaps on shutdown hardening and test composition.

## Ruled Out

- Missing hook target: every reviewed hook command uses a relative path from the runtime project dir; no missing target was found in `.claude/settings.local.json`, `.codex/hooks.json`, or `.devin/hooks.v1.json`.
- P0 data-loss claim for F001: not asserted. The race is real, but the pass did not execute a reproducer and downstream owner/lease checks may narrow the damage window.

## Dead Ends

- The local spec packet is not useful for normative requirements because it still contains template placeholders.
- Code graph was not needed for this pass because the high-risk paths were named directly in the review config and shared context.

## Recommended Next Focus

Fix or falsify F001 first. Add a true atomic stale-owner reclaim mutex shared by the stale-reclaim path and a live concurrent fresh-session reclaim test. Then add the missing secondary-connected fresh-reap matrix row and decide whether the release path should await model-server SIGTERM/SIGKILL like normal shutdown.

Review verdict: CONDITIONAL
