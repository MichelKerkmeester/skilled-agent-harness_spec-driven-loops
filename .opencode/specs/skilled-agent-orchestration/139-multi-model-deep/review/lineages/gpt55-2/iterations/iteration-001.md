# Deep Review Iteration 001: gpt55-2

## Scope

Focus dimension: correctness. This lineage reviewed the daemon re-election/reap path, bridge/proxy interaction, hook portability files, session cleanup, and comment hygiene within the configured 12-file target set.

## Method

- Read the parent review config and shared context.
- Read target spec docs for traceability context; they are scaffold placeholders.
- Read the launcher release path, stale-reclaim branch, reap helper, bridge helper, session proxy, hook configs, cleanup script, and the two durability tests.
- Used direct reads and Grep because code graph readiness was stale.
- Ran syntax checks for both launchers and `session-cleanup.sh`.
- Ran the comment hygiene checker against both target launchers.

## Findings

### F001 P1: Fresh session can reap a daemon still serving a live secondary

[SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1372] The release branch keeps the context-server daemon alive for adoption and only clears the owner lease. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1482] A later fresh launcher sees the dead owner pid as `staleReclaimable`, reads `staleLease.childPid`, and calls `reapLeaseChildBeforeRespawn(orphanChildPid)` before spawning a replacement. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:193] The tests prove a secondary can be bridged to that daemon after owner disposal, and [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:225] separately prove a fresh session reaps the orphan, but there is no combined owner+secondary+fresh test.

Scenario: session A owns daemon D, session B bridges to D, A exits and releases D, then session C starts. C reclaims the dead-owner lease and reaps D with no active-secondary/adopt-in-place gate. B's proxy may reattach to the replacement, but any in-flight request is dropped and the advertised "secondary keeps transport" behavior is no longer stable once another fresh session joins.

Finding class: cross-consumer. Confidence: high.

### F002 P2: SIGKILL reap result is discarded before replacement spawn

[SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:710] When the child does not exit after SIGTERM, `reapLeaseChildBeforeRespawn` sends SIGKILL and awaits `waitForPidExit(childPid, 1000)`. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:726] The result is discarded and the function returns `allowed: true` regardless. If the child remains alive in an uninterruptible filesystem or WAL state, the launcher can spawn a replacement while the original daemon still holds the database.

Finding class: edge-case. Confidence: medium.

### F003 P2: Comment hygiene misses reversed packet labels present in target launchers

[SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:169] The checker flags `packet <number>` but not `<number> packet`. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1025] and [SOURCE: .opencode/bin/mk-code-index-launcher.cjs:715] both contain `096 packet` comments. The checker exited clean on both target launchers during this review, so the enforcement does not fully implement the no ephemeral packet labels rule.

Finding class: tooling-gap. Confidence: high.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | F001 identifies a missing combined scenario behind the shared-context claim. |
| checklist_evidence | partial | Checklist remains generic scaffold with unchecked items. |
| feature_catalog_code | partial | Launcher behavior was checked; runtime config default-on files were not in this lineage's direct file target except hooks. |
| playbook_capability | not_applicable | No playbook run in max-1 lineage. |

## Verification Evidence

| Command | Result |
|---------|--------|
| `node --check .opencode/bin/mk-spec-memory-launcher.cjs` | PASS |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | PASS |
| `bash -n .opencode/scripts/session-cleanup.sh` | PASS |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/bin/mk-spec-memory-launcher.cjs` | PASS, supports F003 because `096 packet` was not flagged. |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/bin/mk-code-index-launcher.cjs` | PASS, supports F003 because `096 packet` was not flagged. |

## JSON Findings

```json
[
  {
    "severity": "P1",
    "file": ".opencode/bin/mk-spec-memory-launcher.cjs",
    "line": 1482,
    "title": "Fresh session can reap a daemon still serving a live secondary",
    "detail": "The staleReclaimable branch reaps staleLease.childPid before respawn with no active-secondary/adopt-in-place gate. A secondary can be bridged to the released daemon after owner disposal, while the fresh-session test reaps the orphan only in a no-secondary setup. In the combined case, a third session can kill the daemon currently serving the secondary and drop in-flight work before the proxy reattaches.",
    "confidence": "high"
  },
  {
    "severity": "P2",
    "file": ".opencode/bin/mk-spec-memory-launcher.cjs",
    "line": 713,
    "title": "SIGKILL reap result is discarded before replacement spawn",
    "detail": "After SIGKILL, reapLeaseChildBeforeRespawn awaits waitForPidExit(childPid, 1000) but ignores the result and returns allowed:true. A child that remains alive after the window can coexist with the replacement daemon on the same database.",
    "confidence": "medium"
  },
  {
    "severity": "P2",
    "file": ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh",
    "line": 169,
    "title": "Comment hygiene misses reversed packet labels present in target launchers",
    "detail": "The checker flags 'packet <number>' but not '<number> packet'. Both target launchers contain '096 packet' comments, and the checker exited clean on both files during this review.",
    "confidence": "high"
  }
]
```

Review verdict: CONDITIONAL
