## Dispatcher
- Agent: deep-review leaf iteration
- Iteration: 004
- Run: 4
- Session: fanout-glm-1782805948784-ypcv5r
- Target: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/030-agent-loops-improved`
- Review packet root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm`
- Focus: security -- executor environment and sandbox trust boundaries for detached fan-out lineages
- Budget profile: scan (overrun recorded: evidence/counterevidence reads exceeded the nominal 9-11 call profile)

## Files Reviewed
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:756`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1030`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1267`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1330`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:537`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:50`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:167`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:275`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_review_auto.yaml:192`

## Findings - New

### P0 Findings
- None.

### P1 Findings
1. **Detached OpenCode lineages run with prompt-only write isolation** -- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1084` -- The `cli-opencode` fan-out branch starts `opencode run` with `--dangerously-skip-permissions` and no sandbox/workspace restriction, then relies on prompt text to keep writes inside the lineage directory. The runner itself acknowledges that lineage-dir-only write enforcement is prompt-based rather than sandbox-enforced [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1267`-`1273`], while the generated prompt only says to write outputs to the lineage directory and not touch other paths [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:811`-`817`]. This leaves a detached executor that is supposed to review read-only targets and write only local lineage artifacts with full workspace mutation capability if the model drifts, prompt-injection content is followed, or a tool call is mis-routed.
   - Finding class: cross-consumer
   - Scope proof: Checked `buildLineageCommand`, `buildLoopPrompt`, sandbox resolution, executor env filtering, config validation, tests, and the deep-review protocol; `cli-opencode` cannot be configured to a safer sandbox because config validation rejects `sandboxMode` for that kind [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:167`-`170`], and the protocol still documents a workspace sandbox boundary for CLI dispatch [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:275`-`288`].
   - Affected surface hints: [`fanout-run.cjs cli-opencode dispatch`, `lineageDir write boundary`, `executor-config sandboxMode support`, `deep-review CLI protocol`, `detached OpenCode lineage review targets`]
   - Recommendation: Stop using `--dangerously-skip-permissions` for detached `cli-opencode` review lineages unless an equivalent path-scoped sandbox is active; at minimum pass the strongest available OpenCode sandbox/workdir flags, allow `sandboxMode` where supported, and make unsafe fallback opt-in with an explicit fatal warning for review fan-out.
   - Claim adjudication:
```json
{
  "type": "security-trust-boundary",
  "claim": "Detached cli-opencode review lineages are granted unrestricted workspace mutation capability while the intended lineage-only write boundary is enforced only by prompt text.",
  "evidenceRefs": [
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1074-1091",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1267-1273",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:811-817",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:167-170"
  ],
  "counterevidenceSought": "Checked executor env filtering and recursion guards; they filter secrets and block recursive same-kind dispatch but do not restrict filesystem writes. Checked config tests; cli-opencode sandboxMode is rejected rather than exposing a safer runtime knob. Checked protocol docs; they still describe sandboxed CLI dispatch rather than dangerous permission bypass.",
  "alternativeExplanation": "The dangerous permission flag was chosen so the subprocess can write required lineage artifacts; however the implementation uses the repository root as the process cwd and admits the lineage-only boundary is not technically enforced.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade only if OpenCode `--dangerously-skip-permissions` is proven to be constrained by an external process sandbox to the lineage directory in this fan-out path, or if review fan-out is changed to fail closed unless a path-scoped sandbox is available."
}
```

### P2 Findings
- None.

## Traceability Checks
- Security focus compared implementation against the deep-review CLI executor protocol. The implementation uses OpenCode `--dangerously-skip-permissions` [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1078`-`1091`] while the protocol references CLI dispatch with a sandbox boundary [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:275`-`288`].
- Auto-workflow setup binding evidence was read for context only; no new setup finding was added because prior iterations already cover binding gaps [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_review_auto.yaml:192`-`199`].

## Integration Evidence
- `cli-opencode` detached lineage dispatch: `buildLineageCommand` constructs the runtime command [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1074`-`1091`].
- Executor environment helper: `buildExecutorDispatchEnv` filters parent env and stamps `SPECKIT_CLI_DISPATCH_STACK`, but does not enforce filesystem sandboxing [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:537`-`553`].
- Config/parser surface: `EXECUTOR_KIND_FLAG_SUPPORT` omits `sandboxMode` for `cli-opencode` [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:50`-`54`].

## Edge Cases
- Optional code graph structural impact was unavailable/stale from startup context, so this iteration used direct Grep/Read evidence only.
- The scan budget was exceeded while seeking counterevidence in executor audit, config validation, tests, and protocol docs; no additional review targets were modified.
- Config/registry/dashboard/report files are absent by declared leaf boundary; this iteration did not block on them and did not create them.

## Confirmed-Clean Surfaces
- Environment filtering removes unrelated secrets such as `GITHUB_TOKEN` and `OPENAI_API_KEY` from CLI child env in the unit coverage [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts:477`-`497`].
- Same-kind recursion stack detection is implemented before spawn in the fan-out worker [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1311`-`1321`].

## Ruled Out
- P0 escalation: ruled out because the evidence shows a serious workspace trust-boundary failure for detached reviewers, but not an independently demonstrated auth bypass, secret exfiltration, or destructive data-loss path.
- Environment-secret leak finding: ruled out because the allowlist filters unrelated secret env vars for non-native CLI executors and tests assert that behavior.
- Native OpenCode branch security finding: ruled out for this iteration because the required focus was detached fan-out lineage trust boundaries and the clearest actionable issue is the `cli-opencode` detached branch.

## Next Focus
- dimension: traceability
- focus area: child phase docs and named implementation surfaces for review fan-out requirements-to-code coverage
- reason: security now has one active P1; rotate to the next remaining dimension to check whether phase docs, feature catalog entries, and command/runtime surfaces agree on fan-out guarantees
- rotation status: move from security to traceability
- blocked/productive carry-forward: PRODUCTIVE — direct runner/config/protocol reads exposed a trust-boundary gap
- required evidence: child phase docs for executor/sandbox requirements, `.opencode/commands/deep/review.md`, `.opencode/commands/deep/assets/deep_review_auto.yaml`, `fanout-run.cjs`, `executor-config.ts`, and relevant feature catalog/manual testing entries

Review verdict: CONDITIONAL
