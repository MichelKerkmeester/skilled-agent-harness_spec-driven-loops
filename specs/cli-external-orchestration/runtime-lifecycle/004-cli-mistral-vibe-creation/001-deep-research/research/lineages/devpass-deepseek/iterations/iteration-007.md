# Iteration 7: deep-loop executor support

## Focus

Angle 7: what a `cli-mistral-vibe` executor kind would need in the deep-loop runtime — the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage. Read the executor contract and the fan-out command builder as the two files a new kind must satisfy.

## Findings

1. A new kind starts with registration in two places: `EXECUTOR_KINDS` (the `ExecutorKind` union) and the zod `kind` enum, plus an entry in `EXECUTOR_KIND_FLAG_SUPPORT` naming which config fields that kind accepts. For Vibe the honest entry is `model`, `sandboxMode` (if mapped), `timeoutSeconds`, `liveTools` — **not** `reasoningEffort`, because Vibe has no reasoning flag. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-21,87-138]

2. The command builder is a table entry, not a new code path: `LINEAGE_COMMAND_ADAPTERS` maps each kind to a builder and `buildLineageCommand` throws on an unknown kind. A `buildVibeLineageCommand` would emit `vibe -p <prompt> --model <alias> --agent <profile> --output text --output-dir <lineage>/vibe-export --max-turns <n> --time-limit <s> --workdir <repo> --trust`, with stdin closed because `-p` carries the prompt. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3099-3121] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:17-67]

3. The environment allowlist is per kind and additive: `EXECUTOR_COMMON_ENV_ALLOWLIST` covers PATH/HOME/LANG/TMPDIR/NODE_PATH/TERM/USER/LOGNAME/locale plus the spec-gate and child-session keys, and each kind adds a prefix list. Vibe needs `VIBE_` (VIBE_HOME, VIBE_CWD) and `MISTRAL_` (MISTRAL_API_KEY) prefixes; without them a dispatched Vibe reports a missing credential, exactly the failure the cli-pi comment records for `LLMGATEWAY_`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:121-177]

4. A closed model roster is mandatory because `--model` takes an **alias** that config may not define: an off-roster alias fails late or resolves to whatever `active_model` is. A `VIBE_SUPPORTED_MODELS` list plus `isVibeModelAllowed` follows the `PI_SUPPORTED_MODELS`/`DSH_SUPPORTED_MODELS` pattern. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:263-279]

5. The roster must be a pair (alias, expected thinking level), not a bare model id. Vibe's reasoning effort is a per-model config field, while the runtime pins DeepSeek V4 Flash and GLM-5.3 Flash to `max` through `isFlashMaxPinnedModel`/`pinReasoningEffortForModel`; with no CLI flag, the only way to honour that pin is a Vibe model row that already carries `thinking = "max"`, and the executor should reject an alias whose row does not. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:281-310] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:551-566]

6. The recursion guard is generic: the dispatch stack is stamped with the kind and `detectSameKindFromStack` refuses a lineage that tries to launch its own kind again. A `cli-mistral-vibe` kind joins by being added to the stampable kinds; no Vibe-specific code is needed, and `vibe` dispatching `vibe` would then be refused before spawn. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3746-3765]

7. Dispatch-audit recognition has three tables to extend: `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` (`false` for Vibe, because there is no sandbox flag), `EXECUTOR_WEB_SEARCH_POLICY` (`inherit` only, because Vibe exposes no web-search switch), and the session-env map. The session-env entry should be omitted rather than guessed — cli-devin sets that precedent — until a Vibe session-id variable is observed. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:140-220]

8. Vibe's exit taxonomy maps onto the audit's outcome classes better than any current CLI: `0` finished is success, `1` usage/config is a caller error, `2` infrastructure is a dispatch failure, `3` is "stopped without finishing" and must be scored as partial work, `4` is a server abort. The runner needs that mapping so a `3` is not recorded as a successful iteration. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:32-84]

9. Stress coverage already has a home: `runtime/tests/stress/cli-adapter` plus the fan-out tests for pwd, stderr, in-process prompt and receipts (`fanout-lineage-pwd.test.ts`, `fanout-lineage-stderr.test.ts`, `fanout-loop-prompt-in-process.test.ts`, `executor-audit-cli-branch-receipts.test.ts`). A new kind needs one adapter fixture in the stress folder and a receipt assertion in the audit test, matching how the shipped kinds are covered. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts]

## Ruled Out

- Mapping `reasoningEffort` to a Vibe flag: no such flag exists, so the field must be declared unsupported and the pin carried by the model row.
- Guessing a `VIBE_SESSION_ID` env var for the session-env map: unobserved, and cli-devin deliberately omits its equivalent rather than inventing one.

## Dead Ends

- Looking for a per-kind sandbox flag in Vibe: none exists, so `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` must be `false` and containment must be post-hoc.
- Looking for a Vibe web-search policy switch: the CLI has no such option, so the policy is `inherit`.

## Edge Cases

- Ambiguous input: "the command builder" could mean the YAML `step_dispatch_iteration` branch or `fanout-run.cjs`. The fan-out builder is the single source of truth for the shared kinds, so it is the one graded.
- Contradictory evidence: none.
- Missing dependencies: no `cli-mistral-vibe` kind exists yet, so every requirement is derived from the shipped kinds rather than from a failing build.
- Partial success: the required extension points are named exactly; line-level edits and a live dispatch are build-phase work.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- .skilled/skills/system-deep-loop/runtime/tests (executor and fan-out tests)
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt

## Assessment

- New information ratio: 1.0
- Questions addressed: What would a cli-mistral-vibe deep-loop executor kind need?
- Questions answered: Answered in full for the runtime extension points; the live dispatch remains a build-phase action.

## Reflection

- What worked and why: reading the kind registry and the adapter table first turned "add an executor" into a checklist of exact tables, and the cli-pi comment supplied the proven failure mode for a missing env prefix.
- What did not work and why: looking for a reasoning flag. Vibe's absence forced the sharper finding that the roster must carry the thinking level, which is a better requirement than a flag mapping.
- What I would do differently: read `EXECUTOR_KIND_FLAG_SUPPORT` before the CLI help; it defines what a kind may even declare, so the help only fills in the argv.

## Recommended Next Focus

Angle 8: ACP and other integration seams. Read `vibe/acp` and `vibe-app-server` for the ACP surface, compare it with print mode for fan-out dispatch, and close with what the merge and phase plan need.
