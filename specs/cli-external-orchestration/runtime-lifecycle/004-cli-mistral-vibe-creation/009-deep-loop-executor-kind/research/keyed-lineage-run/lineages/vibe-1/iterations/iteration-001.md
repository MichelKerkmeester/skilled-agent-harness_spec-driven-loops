# Iteration 1: What the `cli-mistral-vibe` deep-loop executor kind adds

## Focus

The research topic asks, in one short paragraph, what the deep-loop executor kind `cli-mistral-vibe` adds. The narrowest evidence-backed reading is: what does this kind contribute to the deep-loop runtime that the eight kinds before it did not already provide? That reading is answered from the runtime source that owns the kind, the fan-out adapter that builds its command, the audit table that guards it, and the spec packet that specifies it. Deferred alternative reading: a comparison of Mistral model quality against other executors, which is out of scope for a code-research iteration and is recorded under Ruled Out.

## Actions Taken

1. Read the spec packet for the phase that introduces the kind: `goal.md`, `acceptance-criteria.md`, `spec.md`.
2. Read the executor kind registry and its per-kind capability tables in `executor-config.ts`.
3. Read `buildVibeLineageCommand` and the `export.json` scoring helpers in `fanout-run.cjs`.
4. Read the recursion-guard, env-allowlist and state-home tables in `executor-audit.ts`.
5. Read the `if_cli_mistral_vibe` branch in `deep-research-auto.yaml`.
6. Confirmed implementation status against the test tree (`tests/unit`, `tests/stress/cli-adapter`).

## Findings

1. `cli-mistral-vibe` is the ninth entry in `EXECUTOR_KINDS`, and its accepted config surface is deliberately the narrowest of the CLI kinds: `model`, `timeoutSeconds` and `liveTools` only. It accepts no `reasoningEffort`, no `sandboxMode` and no `agentPersona`, because Vibe pins thinking per roster row in `.vibe/config.toml` and exposes no reasoning flag, no OS sandbox flag and no persona surface. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-22] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:141]

2. The kind adds a dedicated fan-out adapter, `buildVibeLineageCommand`, registered in `LINEAGE_COMMAND_ADAPTERS`. It runs Vibe in print mode only, and it builds the command as `vibe --prompt-file <lineage>/vibe-prompt.txt --output-dir <lineage>/vibe-output --trust --model <alias> --auto-approve`, with `cwd` set to the lineage directory and `VIBE_HOME` pointed at `<lineage>/vibe-home`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3154-3250] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3256]

3. The adapter adds a three-part preflight that no earlier kind performs in this shape: a `command -v vibe` PATH probe, an exact version gate on `3.1.2` run inside a throwaway `VIBE_HOME` outside the checkout, and a roster check against `VIBE_ALLOWED_MODELS`. A missing binary, a wrong version or an off-roster alias each throw before the lineage launches. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3101-3102] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3163-3190]

4. The kind adds the fan-out's first per-lineage outcome read from an executor's own export record. `resolveVibeLineageOutcome` scores `vibe-output/export.json`: exit 0 with `exit_code` 0 and `outcome` absent or `finished` is `success`; exit 3 with an export present is `partial` and never counts as success; anything else, including a clean exit with no export, is `failure`. The verdict is attached to the settled pool result as `result.outcome` for Vibe lineages only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3131-3152] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4244-4250] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4477-4485]

5. The kind adds a multi-name recursion guard and a Vibe-specific env allowlist. The ancestor walk matches `vibe`, `vibe-rs` and `vibe-app-server` rather than the launcher alone, because the Python launcher execs away and a running Vibe appears as its Rust binary or app server. The env filter passes the `VIBE_` prefix plus the single key `MISTRAL_API_KEY`, treats `VIBE_HOME` as lineage state, and denies an inherited `VIBE_HOME` so a leaf cannot reach the operator's Vibe state. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:77] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:108] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:174] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:190] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:199]

6. The kind is fan-out only, and both deep-loop YAMLs enforce that. The `if_cli_mistral_vibe` branch prints that the kind runs only as a fan-out lineage and exits 2, pointing the operator at `--count=2` or a second `--executor` group. This mirrors the `cli-deepseek-harness` precedent and follows from the lineage-local `VIBE_HOME`, output folder and export scoring all living in the fan-out adapter. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1223-1232] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/goal.md:44]

7. Model selection is by roster alias, not by provider model name, and the allowlist is enforced twice. `VIBE_SUPPORTED_MODELS` holds `deepseek-flash` and `glm-flash`; `isVibeSupportedModel` gates the config parser, and `VIBE_ALLOWED_MODELS` gates the adapter. A model outside the pair is rejected at parse time and again at command-build time. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:301-307] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:705-712] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3186-3190]

8. The kind is implemented and tested while its own spec packet still records it as unbuilt. The stress fixture `tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` exists, `live-contracts.json` and `matrix-manifest.ts` both name the kind, and the three unit suites carry 34 `cli-mistral-vibe` references between them, yet `spec.md` still reads `Status: Planned` and every row of `acceptance-criteria.md` still reads `Unmet`. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json:50] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:13] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/spec.md:24] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/acceptance-criteria.md:44]

## Questions Answered

- Which source file owns the `cli-mistral-vibe` executor kind, and what config fields does it declare? Answered: `executor-config.ts` owns it; the fields are `model`, `timeoutSeconds` and `liveTools`.
- How does the fan-out adapter invoke the `vibe` CLI, and what argv, prompt-delivery, and permission flags does it pass? Answered: `--prompt-file`, `--output-dir`, `--trust`, `--model`, `--auto-approve`, with the prompt written to a file so it stays out of the process list.
- What does `cli-mistral-vibe` add over the executor kinds that already existed (native, cli-claude-code, cli-opencode, cli-codex)? Answered: a per-lineage `export.json` outcome, a two-name recursion guard, roster-alias model selection, and a fan-out-only dispatch contract.
- How is a `cli-mistral-vibe` lineage's output verified and its executor provenance recorded? Answered: verified from `vibe-output/export.json` through `resolveVibeLineageOutcome`; provenance recorded in the lineage's `invocation-metadata.json` and the adapter's `finalizeLineageCommand` fields.
- What limits or failure modes does the kind carry? Answered: fan-out only, no sandbox, no reasoning flag, exact version `3.1.2`, `MISTRAL_API_KEY` required, and exit 3 is ambiguous with the recursion guard's exit code.

## Questions Remaining

None. All five key questions are answered.

## Ruled Out

- Comparing Mistral model quality against other executor kinds. The topic asks what the kind adds to the runtime, not how well its models perform; no benchmark evidence exists in the packet and a quality claim would need a keyed run that `MISTRAL_API_KEY` blocks.
- Treating the spec packet's `Status: Planned` as the current implementation state. The runtime source and test tree contradict it, so the packet status was recorded as drift (finding 8) rather than as evidence that the kind is unbuilt.
- Reading the ACP supervisor as part of the kind. `spec.md` lists it as out of scope and the adapter builds print mode only.

## Dead Ends

- Searching for a `cli-mistral-vibe` entry in the deep-loop YAML's single-executor dispatch branches. The branch exists but deliberately refuses the kind, so there is no single-executor invocation path to document. This is a settled design decision (D4 in `goal.md`), not a gap.

## Edge Cases

- Ambiguous input: the topic's "what does it add" admits a quality-comparison reading and a runtime-contribution reading. The runtime-contribution reading was selected as the narrowest evidence-backed one; the quality reading is deferred under Ruled Out.
- Contradictory evidence: the spec packet says `Status: Planned` with every AC `Unmet`, while the runtime source and test tree show the kind implemented and covered. Both are cited in finding 8 and the contradiction is left unresolved rather than collapsed, because resolving it would require knowing whether the packet's status was simply not updated after implementation.
- Missing dependencies: `MISTRAL_API_KEY` is unset, so no keyed end-to-end lineage could be observed. The `export.json` scoring path was therefore read from source rather than from a live export record. This limits finding 4 to a code-level claim.
- Partial success: none. All six planned research actions succeeded.

## Sources Consulted

- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/goal.md
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/spec.md
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/acceptance-criteria.md
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- .skilled/commands/deep/assets/deep-research-auto.yaml
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/invocation-metadata.json
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/steer.md (absent; no lead ruling to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: all five key questions
- Questions answered: all five key questions

## Reflection

- What worked and why: starting from the spec packet's `goal.md` gave the frozen decisions (D1-D6) before any source was read, so the runtime reads could be checked against stated intent instead of being interpreted cold. Reading the adapter and the audit table in the same pass worked because the kind's identity is split across exactly those two files plus the config registry.
- What did not work and why: the first `grep -rn --include=*.ts` call failed under zsh globbing, which cost a call. `rg` with `--glob` is the reliable form in this shell.
- What I would do differently: read `executor-config.ts` and `fanout-run.cjs` first and the spec packet second. The packet's `Status: Planned` would then have been immediately recognisable as stale rather than as a possible blocker.

## Recommended Next Focus

None for this lineage: `maxIterations` is 1 and all five key questions are answered. If a follow-up lineage runs, the highest-value gap is the unresolved contradiction in finding 8 — whether the packet's `Status: Planned` and `Unmet` rows are stale bookkeeping or a deliberate hold pending the keyed run that `MISTRAL_API_KEY` blocks.

## SCOPE VIOLATIONS

None. One self-inflicted artifact is recorded for transparency: an early `write_file` call resolved its relative path against the lineage directory rather than the repository root and created a nested duplicate at `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/specs/.../deep-research-config.json`. It is inside the lineage write surface, inert (the reducer reads only the top-level `deep-research-config.json`), and was left in place rather than deleted because the iteration contract bans `rm`. No file outside the lineage directory was created, modified or deleted.
