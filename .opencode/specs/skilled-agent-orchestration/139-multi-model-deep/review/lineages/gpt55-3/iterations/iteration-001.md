# Iteration 001: gpt55-3 Fanout Lineage

## Focus

Single-iteration breadth review across correctness, security, traceability, and maintainability for the daemon re-election/reap path, launcher bridge/proxy helpers, hook portability files, session cleanup, and comment hygiene enforcement.

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

- **F001**: Reap-before-respawn can spawn after unconfirmed SIGKILL, `.opencode/bin/mk-spec-memory-launcher.cjs:713`. `reapLeaseChildBeforeRespawn()` waits for the child to exit after SIGTERM (`:708`), sends SIGKILL when the grace window expires (`:711-713`), ignores the post-SIGKILL `waitForPidExit()` result, and always returns `allowed: true` (`:726`). The stale-reclaim path uses this result as the gate before spawning a replacement daemon (`:1482-1502`). If the old context-server pid remains alive after the final wait, the launcher can still proceed to replacement spawn, violating the same single-writer handoff invariant the branch is intended to protect.

```json
{
  "findingId": "F001",
  "claim": "The stale-reclaim reap path can authorize replacement spawn even when the recorded child has not been confirmed dead after SIGKILL.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:708-726",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1482-1502"
  ],
  "counterevidenceSought": "Read reapLeaseChildBeforeRespawn(), stale-reclaim caller, dead-socket respawn caller, and durability tests for any post-SIGKILL false-result gate. No caller checks a false post-SIGKILL wait result before replacement spawn.",
  "alternativeExplanation": "The replacement daemon may repair FTS after an unclean close, and SIGKILL usually terminates the process. That does not cover the still-live pid case, where a replacement can overlap the original writer.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade if reapLeaseChildBeforeRespawn captures the second wait result, returns allowed:false when the pid survives, and a regression test proves replacement spawn is blocked for that path.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F002**: Live test matrix omits the secondary plus fresh-session composition, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:210`. The first test proves a secondary keeps transport after owner disposal without a later fresh launcher (`:183-208`). The second proves a fresh session reaps a released daemon in a no-secondary setup (`:210-243`). The combined case, owner plus secondary, owner disposal, then fresh session starts, is not asserted, so regressions in secondary continuity during fresh-session stale reclaim can pass.
- **F003**: Comment hygiene misses reversed packet labels used by target launchers, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:169`. The scanner flags `packet <number>` but not `<number> packet` (`:163-171`), while both target launchers contain `096 packet` comments (`.opencode/bin/mk-spec-memory-launcher.cjs:1025`, `.opencode/bin/mk-code-index-launcher.cjs:715`). The hygiene script exited clean on both files in this lineage, confirming the gap.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/bin/mk-spec-memory-launcher.cjs:188-195`, `:708-726`, `:1482-1502` | Release/reap behavior exists, but F001 shows fail-open behavior after unconfirmed SIGKILL. |
| checklist_evidence | partial | hard | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/checklist.md:47-118` | Local packet checklist is scaffold-only and has no checked completion claims to verify. |
| feature_catalog_code | partial | advisory | `.claude/settings.local.json:73-81`, `.codex/hooks.json:3-24`, `.devin/hooks.v1.json:2-24` | Hook entries exist for reviewed runtimes; full catalog coverage was not run in max-1 lineage. |
| playbook_capability | notApplicable | advisory | n/a | No playbook files were in the configured target. |

## Verification Evidence

| Command | Result |
|---------|--------|
| `node --check .opencode/bin/mk-spec-memory-launcher.cjs` | PASS |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | PASS |
| `bash -n .opencode/scripts/session-cleanup.sh` | PASS |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/bin/mk-spec-memory-launcher.cjs` | PASS, supporting F003 because `096 packet` was not flagged. |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/bin/mk-code-index-launcher.cjs` | PASS, supporting F003 because `096 packet` was not flagged. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: F001 is a fail-closed correctness issue in the reap-before-respawn gate. F002 and F003 are bounded matrix/tooling gaps that should accompany remediation but do not block on their own.

## Ruled Out

- Hook-command portability blocker: no missing relative hook command was found in `.claude/settings.local.json`, `.codex/hooks.json`, or `.devin/hooks.v1.json`.
- P0 data-loss claim for F001: not asserted because this pass did not run a reproducer and the still-live-after-SIGKILL path is an edge condition.

## Dead Ends

- The target spec packet is not useful for normative requirements because `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` still contain scaffold placeholders.
- Code graph was stale; direct reads and Grep were used instead.

## Recommended Next Focus

Fix or falsify F001 first. Capture the post-SIGKILL wait result and fail closed when the old child remains live, then add a regression that forces the false wait path. Add F002's three-session matrix row and close F003's reversed-label hygiene pattern as follow-up.

Review verdict: CONDITIONAL
