# Deep Review Iteration 005 - cross-runtime-mirror-consistency

## Dispatcher

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold

- Iteration: 5 of 5
- Dimension: cross-runtime-mirror-consistency
- Session: `2026-05-04T08:16:07.000Z`
- Lineage: `new`, generation `1`
- Scope authority: only the approved 007 review packet was written; reviewed command, skill, agent, mirror, and implementation files remained read-only.
- Executor note: cli-copilot was not self-invoked from this Copilot-backed OpenCode session after the cli-copilot self-invocation guard was loaded; this iteration completed locally against the same command-owned packet.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/commands/deep/start-review-loop.md`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
- `.opencode/agents/deep-review.md`
- `.claude/agents/deep-review.md`
- `.codex/agents/deep-review.toml`
- `.gemini/agents/deep-review.md`
- `.opencode/skills/sk-deep-review/SKILL.md`
- `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/iterations/iteration-005.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **cli-copilot deep-review authority guard is not applied consistently across auto and confirm workflows** -- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:703` -- Auto mode constructs `targetAuthority = { type: 'approved', specFolder: specFolderRaw }` [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:702-704], but `buildCopilotPromptArg` expects a discriminated union keyed by `kind` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:101-103]. The helper only enters its approved branch when `input.targetAuthority.kind === 'approved'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:275-286], then only prepends the target-authority preamble when `targetAuthority.kind === 'approved'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:292-301]. With the YAML's `type` shape, neither the approved branch nor the missing-authority `writeIntent` branch fires, so the original prompt is passed through and `--allow-all-tools` remains enabled [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:316-340]. Confirm mode is weaker still: its cli-copilot branch invokes `copilot -p "$(cat "$PROMPT_PATH")" --allow-all-tools --no-ask-user` directly without `buildCopilotPromptArg` or a target-authority preamble [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:700-716]. This is a P1 because the 007 review explicitly depends on preventing recovered or historical context from redirecting writes away from the approved `007-marker-validation-unused-scaffold/review` packet.
   - Finding class: cross-consumer
   - Scope proof: Compared the command entrypoint, auto and confirm YAML executor branches, helper union type, helper branch logic, generated prompt pack, and runtime agent mirrors. The runtime mirrors consistently enforce a local review-packet write boundary, so the defect is isolated to cli-copilot YAML-to-helper wiring and confirm-mode parity rather than agent mirror text.
   - Affected surface hints: ["deep_start-review-loop_auto.yaml", "deep_start-review-loop_confirm.yaml", "buildCopilotPromptArg", "cli-copilot executor", "target authority"]
   - Recommendation: Change the auto YAML object to `{ kind: 'approved', specFolder: specFolderRaw }`, add a missing-authority `{ kind: 'missing', writeIntent: true }` fallback when the resolved spec folder is absent, and route the confirm cli-copilot branch through the same helper before allowing `--allow-all-tools`.

```json
{
  "findingId": "F005",
  "claim": "The cli-copilot deep-review workflows can omit the target-authority guard because auto mode passes the wrong discriminator to buildCopilotPromptArg and confirm mode bypasses the helper entirely.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:702-704",
    ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:101-103",
    ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:275-301",
    ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:316-340",
    ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:700-716"
  ],
  "counterevidenceSought": "Checked the helper implementation, auto YAML notes, confirm YAML branch, canonical agent contract, runtime mirrors, prompt-pack template, and prior cross-runtime review findings. The helper exists and mirrors enforce read/write boundaries, but the auto call shape and confirm branch do not deliver that helper's authority preamble to cli-copilot.",
  "alternativeExplanation": "A transpiler or runtime wrapper could theoretically normalize `type` to `kind`, but no inspected YAML, helper, or executor wrapper performs that normalization, and the helper branches directly on `.kind`.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade only if an executed end-to-end cli-copilot run proves the rendered prompt starts with `## TARGET AUTHORITY` and missing authority strips `--allow-all-tools` for both auto and confirm modes despite the inspected source shape."
}
```

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `agent_cross_runtime` | pass | Canonical OpenCode, Claude, Codex, and Gemini deep-review agent surfaces all require a single-iteration LEAF reviewer, prohibit Task/sub-agent dispatch, require BINDING lines, and limit writes to the resolved local-owner review packet [SOURCE: .opencode/agents/deep-review.md:61-104] [SOURCE: .claude/agents/deep-review.md:61-104] [SOURCE: .codex/agents/deep-review.toml:54-97] [SOURCE: .gemini/agents/deep-review.md:61-104]. |
| `skill_agent` | partial | `sk-deep-review` correctly states the command owns dispatch and every iteration must produce markdown plus JSONL delta, but the prompt-pack template still contains the stale `.agents/skills/sk-code-review/...` doctrine path already recorded by packet 005 [SOURCE: .opencode/skills/sk-deep-review/SKILL.md:55-60] [SOURCE: .opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:16-19] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/iterations/iteration-005.md:46-50]. |
| `command_yaml` | fail | Auto YAML intends to use `buildCopilotPromptArg`, but passes `type` instead of `kind`; confirm YAML bypasses the helper for cli-copilot. |
| `target_authority` | fail | The inspected auto/confirm cli-copilot paths can run without the required `## TARGET AUTHORITY` preamble even though this review's strategy forbids redirecting writes to historical `006` artifacts. |
| `resource_map` | skipped | Target `resource-map.md` is absent by configured review context. |

## Integration Evidence

- `/deep:start-review-loop` setup recognizes `cli-copilot` as an executor option and documents it as `copilot -p "PROMPT" --model X --allow-all-tools --no-ask-user` [SOURCE: .opencode/commands/deep/start-review-loop.md:127-132].
- Auto YAML renders `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` into `{state_paths.prompt_dir}/iteration-{current_iteration}.md` [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:638-657].
- Auto YAML imports `buildCopilotPromptArg` and comments that workflow-resolved spec folder is the only legal write authority [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:690-701].
- Auto YAML passes `targetAuthority = { type: 'approved', specFolder: specFolderRaw }`, which does not match the helper's `kind` union [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:702-704] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:101-103].
- The helper only prepends `## TARGET AUTHORITY` or strips `--allow-all-tools` when `.kind` and `.writeIntent` match the expected shapes [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:292-340].
- Confirm YAML's cli-copilot branch never calls the helper and dispatches both small and large prompts with `--allow-all-tools` [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:700-716].
- Runtime mirrors did not introduce a separate artifact-redirection issue; all inspected mirrors keep the same packet-boundary and read-only target constraints [SOURCE: .opencode/agents/deep-review.md:33-34] [SOURCE: .claude/agents/deep-review.md:33-34] [SOURCE: .codex/agents/deep-review.toml:26-27] [SOURCE: .gemini/agents/deep-review.md:33-34].

## Edge Cases

- The stale prompt-pack doctrine path is a real cross-runtime issue, but it is already documented as a P1 in packet 005 and is not specific to the 007 marker validation sweep. This iteration cited it as carry-forward context, not as a new 007 finding.
- The confirm-mode branch is lower immediate risk for this run because this session used auto mode, but it is part of the same command surface and proves the helper integration is not mirrored consistently across modes.
- The helper has strong validation once invoked with the correct shape; F005 is a wiring and parity defect, not a defect in `validateSpecFolder` or `buildTargetAuthorityPreamble` themselves.

## Confirmed-Clean Surfaces

- Canonical and mirrored deep-review agents consistently prohibit nested dispatch and restrict writes to the resolved review packet.
- The auto-mode large-prompt branch is designed to rewrite `promptFileBody` with the authority preamble when the helper returns one; that branch becomes effective once the YAML passes the correct `kind` discriminator.
- The current 007 review artifacts stayed under `007-marker-validation-unused-scaffold/review/`; historical `006-command-markdown-yaml-workflow-alignment` artifacts were treated as context only.

## Ruled Out

- Ruled out a new runtime-mirror artifact path finding: the mirrors share the same write-boundary contract and are not the source of the redirect risk.
- Ruled out a helper implementation finding: the helper's expected `kind` union, approved preamble branch, missing-authority branch, and `--allow-all-tools` stripping are present.
- Ruled out a P0 severity: the defect can allow authority guard omission in autonomous executor dispatch, but this review did not observe an actual destructive write, data loss, credential exposure, or exploit path.
- Ruled out treating `006-command-markdown-yaml-workflow-alignment` as an active owner; it remains historical context only.

## Next Focus

- Dimension: `synthesis/max-iterations`
- Focus area: Synthesize final `review-report.md` with active P1 findings F001-F005 and a CONDITIONAL verdict.
- Carry-forward: F001/P1 target scaffold placeholders, F002/P1 graph metadata disconnect, F003/P1 marker comments counted as authored evidence, F004/P1 default validation path omits semantic marker validators, and F005/P1 cli-copilot authority guard wiring gap remain active.
