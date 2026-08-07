# Iteration 004 - Security And Lifecycle

## Scope
Focused pass over executor guard, environment, and same-kind recursion behavior.

## Findings

### P1

- **F005**: fanout-run bypasses the shared executor recursion guard and env allowlist - `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:348` - The shared executor layer rejects same-kind dispatch through stack, ancestry, runtime env, and lockfile checks [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:404], then builds a filtered child environment and appends the dispatch stack [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:466]. fanout-run does not use that path; it invokes `spawnSync` directly and passes the full parent environment plus two lineage vars [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:348]. That means same-kind fan-out, such as a Codex parent spawning cli-codex, can bypass the guard and inherit unrelated runtime state.

## Claim Adjudication

```json
{
  "findingId": "F005",
  "claim": "fanout-run.cjs bypasses the shared executor dispatch guard and environment filtering used by single-executor CLI dispatch.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:404",
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:466",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:348"
  ],
  "counterevidenceSought": "Checked fanout-run imports and worker body for validateExecutorDispatchAllowed, buildExecutorDispatchEnv, runAuditedExecutorCommand, or runAuditedExecutorCommandAsync usage.",
  "alternativeExplanation": "The fan-out runner may have predated the shared guard or tried to avoid state-log coupling, but it still performs executor dispatch and should honor the same guard boundary.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if fanout-run is wrapped by an upstream guard that rejects same-kind lineages and filters parent env before process start.",
  "transitions": []
}
```

## Verdict Rationale
This iteration found an active P1. The issue is a lifecycle and security boundary gap in the fan-out execution path.

Review verdict: CONDITIONAL
