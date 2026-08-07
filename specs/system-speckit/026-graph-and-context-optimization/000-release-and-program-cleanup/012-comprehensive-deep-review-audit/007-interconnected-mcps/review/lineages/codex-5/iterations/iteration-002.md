# Iteration 002 - Security And Executor Contracts

Session: fanout-codex-5-1780596001496-uhn96t
Executor: cli-codex model=gpt-5.5
Focus: security and executor contracts

## Scope Reviewed

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts`

## Findings

### F004 - P1 - Codex dispatch emits service-tier values outside the validated executor schema

Evidence:

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13` limits service tiers to `priority`, `standard`, and `fast`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:174` to `:178` emits `service_tier=${lineage.serviceTier || 'default'}`.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:756` to `:763` resolves a null/default tier path.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:772` to `:774` serializes that tier into the command string.

Impact:

The dispatch layer can send a value the validated schema does not permit. That makes Codex lineage behavior dependent on CLI tolerance instead of the framework's own contract.

Concrete fix:

Use one shared service-tier enum and do not synthesize `default` unless the schema explicitly allows it. If no tier is set, omit the flag.

### F005 - P2 - Review lineage write scope is prompt-only while the default sandbox permits workspace writes

Evidence:

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83` to `:85` defaults CLI executor sandboxing to `workspace-write`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:320` resolves the Codex sandbox from that default.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` starts the subprocess with only prompt/environment boundaries for artifact write scope.

Impact:

Review lineages are instructed to write only to their artifact roots, but the process sandbox still allows broader workspace writes by default.

Concrete fix:

For review fan-out, default child executors to read-only or to an artifact-root-only writable policy where supported. At minimum, fail closed unless the caller explicitly chooses workspace-write.

## Typed Claim Adjudication

```json
[
  {
    "findingId": "F004",
    "claim": "Codex dispatch can emit a service-tier value outside executor-config validation.",
    "status": "confirmed",
    "evidence": [
      ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:174",
      ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:772"
    ]
  },
  {
    "findingId": "F005",
    "claim": "The review write boundary is enforced by prompt rather than by the default sandbox.",
    "status": "confirmed",
    "evidence": [
      ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:320",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344"
    ]
  }
]
```

Review verdict: CONDITIONAL
