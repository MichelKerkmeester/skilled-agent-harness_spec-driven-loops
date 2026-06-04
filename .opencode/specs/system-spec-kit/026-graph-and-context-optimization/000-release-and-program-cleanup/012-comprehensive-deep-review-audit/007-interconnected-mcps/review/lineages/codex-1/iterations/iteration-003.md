# Iteration 003 - Traceability

## Scope
Focused pass over executor config claims versus command construction.

## Findings

### P1

- **F003**: per-lineage `iterations` only sizes timeout and never reaches child `maxIterations` - `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154` - The fan-out schema documents `iterations` as a per-lineage max-iterations override [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292], and exposes the field in the lineage schema [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:299]. The runner only uses it to compute timeout [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154], and the child prompt lists spec folder, artifact dir, session id, executor, and loop type without passing a max-iterations override [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:129]. A configured lineage cap therefore does not constrain the actual loop.

- **F004**: Codex service tier defaults drift between cli-codex, YAML, and fanout-run - `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177` - The cli-codex contract says the default invocation is `gpt-5.5`, medium reasoning, fast service tier [SOURCE: .opencode/skills/cli-codex/SKILL.md:206], and says delegations should always pass `service_tier="fast"` explicitly [SOURCE: .opencode/skills/cli-codex/SKILL.md:241]. The deep-loop enum includes `priority`, `standard`, and `fast`, not `default` [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13]. The single-executor review YAML renders `service_tier=${executor.serviceTier}` even when the value is null [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:774], while fanout-run substitutes `service_tier=default` when absent [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177].

## Claim Adjudication

```json
{
  "findingId": "F003",
  "claim": "Fan-out lineage iterations are validated and documented as max-iteration overrides but only affect subprocess timeout sizing.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292",
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:299",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:129"
  ],
  "counterevidenceSought": "Checked buildLoopPrompt, native fan-out prompt wiring, and auto YAML for a child max_iterations binding.",
  "alternativeExplanation": "The field may have been intended only as a timeout multiplier, but both the inline schema comment and operator-facing spec describe max-iteration override semantics.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade if docs are changed to say iterations is timeout-only and a separate maxIterations override is introduced.",
  "transitions": []
}
```

```json
{
  "findingId": "F004",
  "claim": "Codex CLI dispatch can emit service_tier=null or service_tier=default even though local contracts require fast and the enum excludes default.",
  "evidenceRefs": [
    ".opencode/skills/cli-codex/SKILL.md:206",
    ".opencode/skills/cli-codex/SKILL.md:241",
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13",
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:774",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177"
  ],
  "counterevidenceSought": "Checked executor-config defaults and both single-executor and fan-out Codex command builders.",
  "alternativeExplanation": "The Codex CLI might tolerate default or null as config strings, but that still contradicts the local cli-codex dispatch contract and bypasses explicit fast-tier reproducibility.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if Codex CLI documents service_tier=default/null as valid and the local cli-codex skill is updated to allow it.",
  "transitions": []
}
```

## Verdict Rationale
This iteration found active P1 findings. Both are contract drift in the executor surface.

Review verdict: CONDITIONAL
