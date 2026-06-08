# Deep Review Report - gpt55-3 Fanout Lineage

## Executive Summary

**Verdict:** CONDITIONAL
**Stop reason:** `maxIterationsReached` (`config.maxIterations=1`)
**Scope:** 12-file target covering daemon re-election, stale-reclaim reap, hook portability, cleanup scripts, bridge/proxy helpers, and durability tests.
**Active findings:** P0=0, P1=1, P2=2.
**hasAdvisories:** false.

This lineage found one release-relevant P1: `reapLeaseChildBeforeRespawn()` can authorize replacement spawn after SIGKILL without confirming the old daemon is gone. The other two findings are bounded evidence/tooling gaps around the missing live matrix row and comment hygiene enforcement.

## Planning Trigger

`/speckit:plan` is required before treating the daemon re-election work as release-ready. The active P1 affects the single-writer invariant: when the old child survives the final wait, the launcher can still move into replacement spawn.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F001",
      "severity": "P1",
      "title": "Reap-before-respawn can spawn after unconfirmed SIGKILL",
      "evidence": [
        ".opencode/bin/mk-spec-memory-launcher.cjs:708-726",
        ".opencode/bin/mk-spec-memory-launcher.cjs:1482-1502"
      ]
    },
    {
      "id": "F002",
      "severity": "P2",
      "title": "Live test matrix omits secondary plus fresh-session composition",
      "evidence": [
        ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:183-243"
      ]
    },
    {
      "id": "F003",
      "severity": "P2",
      "title": "Comment hygiene misses reversed packet labels used by target launchers",
      "evidence": [
        ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:163-171",
        ".opencode/bin/mk-spec-memory-launcher.cjs:1025",
        ".opencode/bin/mk-code-index-launcher.cjs:715"
      ]
    }
  ],
  "remediationWorkstreams": [
    "Fail-closed reap confirmation",
    "Daemon re-election live test matrix",
    "Comment hygiene pattern closure"
  ],
  "specSeed": [
    "Reap-before-respawn MUST only spawn a replacement after the previous child is confirmed dead or after an explicit adoption/report path is selected.",
    "Daemon re-election tests SHOULD include owner plus secondary, owner disposal, and a later fresh session in one live scenario.",
    "Comment hygiene MUST reject both `packet 096` and `096 packet` comment forms."
  ],
  "planSeed": [
    "Capture the second waitForPidExit result after SIGKILL and return allowed:false when the pid survives.",
    "Add an injected-unit or live regression for post-SIGKILL wait failure before replacement spawn.",
    "Add the three-session adoption/fresh-session matrix row.",
    "Extend comment hygiene regex coverage and fixtures for reversed packet labels."
  ],
  "findingClasses": {
    "F001": "algorithmic",
    "F002": "matrix/evidence",
    "F003": "tooling-gap"
  },
  "affectedSurfacesSeed": [
    ".opencode/bin/mk-spec-memory-launcher.cjs",
    ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Impact | Fix Recommendation | Disposition | Finding Class | Scope Proof | Affected Surface Hints |
|----|----------|-----------|-------|----------|--------|--------------------|-------------|---------------|-------------|------------------------|
| F001 | P1 | correctness | Reap-before-respawn can spawn after unconfirmed SIGKILL | `.opencode/bin/mk-spec-memory-launcher.cjs:708-726`, `:1482-1502` | A still-live old daemon can overlap a replacement despite the single-writer handoff intent. | Store the post-SIGKILL wait result and fail closed with `allowed:false` if the pid remains live. | active | algorithmic | Within configured launcher target. | stale-reclaim respawn; dead-socket respawn; single-writer invariant |
| F002 | P2 | traceability | Live test matrix omits secondary plus fresh-session composition | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:183-243` | Combined secondary/fresh-session regressions can pass existing tests. | Add a three-session live test. | active | matrix/evidence | Within configured durability test target. | daemon re-election live matrix |
| F003 | P2 | maintainability | Comment hygiene misses reversed packet labels used by target launchers | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:163-171`, `.opencode/bin/mk-spec-memory-launcher.cjs:1025`, `.opencode/bin/mk-code-index-launcher.cjs:715` | Hygiene enforcement does not catch an active forbidden-label form. | Add reversed-label regex and fixture coverage; update the two launcher comments. | active | tooling-gap | Within configured hygiene and launcher targets. | comment hygiene scanner; launcher comments |

## Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Fail-closed reap confirmation | F001 | Treat an unconfirmed post-SIGKILL child as `allowed:false`; avoid replacement spawn while the old pid may still hold the database. |
| Live matrix completion | F002 | Add owner + secondary + owner disposal + later fresh session test and assert secondary behavior plus single SQLite opener. |
| Hygiene closure | F003 | Match `\b\d+\s+packet\b`, add fixtures, and remove the reversed packet labels from target comments. |

## Spec Seed

- A stale-reclaim or dead-socket respawn MUST fail closed when the prior child remains live after the final reap attempt.
- Daemon re-election verification SHOULD cover the composed owner/secondary/fresh-session sequence in addition to the two separate rows.
- Comment hygiene MUST reject both forward and reversed ephemeral packet label forms.

## Plan Seed

1. Inventory all callers of `reapLeaseChildBeforeRespawn()` and decide the common fail-closed return shape.
2. Change the function to capture and branch on the post-SIGKILL wait result.
3. Add a regression that simulates `waitForPidExit(childPid, 1000) === false` and asserts no replacement spawn.
4. Add the missing live matrix row in `daemon-reelection-adoption-live.vitest.ts`.
5. Extend comment hygiene patterns and update the two launcher comments.
6. Re-run syntax checks, the durability tests, and comment-hygiene checks.

## Traceability Status

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Code implements release and reap paths, but F001 conflicts with the single-writer claim after unconfirmed SIGKILL. |
| checklist_evidence | partial | hard | The local packet checklist is scaffold-only with no checked completion claims. |
| feature_catalog_code | partial | advisory | Reviewed hook entries and launcher primitives; full catalog validation was not run in max-1 lineage. |
| playbook_capability | notApplicable | advisory | No playbook files were in the configured target. |

## Deferred Items

- Full security review of socket path trust and env override boundaries was not run beyond the named hook and cleanup files because this lineage is capped at one iteration.
- F002 and F003 can be remediated with F001 but do not independently force a FAIL verdict.

## Search Ledger

*No search-depth state captured (legacy v1 record)*.

## Audit Appendix

| Field | Value |
|-------|-------|
| Iterations | 1 |
| Dimensions covered | correctness, security, traceability, maintainability |
| JSONL records | config, iteration, claim_adjudication, synthesis_complete |
| Final verdict | CONDITIONAL |
| Release-readiness state | in-progress |
| Artifact dir | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/review/lineages/gpt55-3` |

Verification evidence: `node --check` passed for both launchers; `bash -n` passed for `session-cleanup.sh`; comment-hygiene checks passed on both launchers, which supports F003 because the `096 packet` comments were not flagged.

Replay note: this lineage stopped because `maxIterations=1`, not because legal convergence gates passed. The parent fan-out merge should apply strongest restriction across lineages.
