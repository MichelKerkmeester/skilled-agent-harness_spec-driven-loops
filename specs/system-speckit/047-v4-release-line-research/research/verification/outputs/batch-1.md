### V01
VERDICT: CHANGED
SEVERITY: propose P1 because the CLI rejection was not observed, so P0’s observed-breakage condition is unmet.
EVIDENCE: `.skilled/commands/deep/assets/deep-research-auto.yaml:1619` - the args include `--pure`; line 1642 sets `command: 'opencode'`. `opencode --version` failed with `EPERM` while opening its log, before printing a version.
COMMAND: `opencode --version` -> exit 1
CORRECTED CLAIM: All four cited YAML branches hardcode `opencode` and pass `--pure`. Whether the installed CLI rejects that flag remains unverified.

### V02
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `executor-config.ts:19` includes `cli-deepseek-harness`; `deep-research-auto.yaml:1211` through `:1667` has six `if_cli_*` branches and none for it; `fanout-run.cjs:3002` throws when the DSH builder has no lineage directory.
COMMAND: `rg -n 'if_cli_|cli-deepseek-harness|requires a lineage directory|EXECUTOR_KINDS' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` -> exit 0
CORRECTED CLAIM: -

### V03
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `deep-research-auto.yaml:1198` and `deep-research-confirm.yaml:1183` read `config.executor.type`; the template uses `kind` at `deep-research-config.json:20`, and `executor-config.ts:537` removes the deprecated `type` field during normalization. The review YAMLs use `kind` at `deep-review-auto.yaml:1232` and `deep-review-confirm.yaml:1310`.
COMMAND: `rg -n 'config\\.executor\\.(type|kind)|normalizeExecutorConfigInput' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` -> exit 0
CORRECTED CLAIM: The two deep-research YAMLs use `config.executor.type` where the template and normalized reader use `kind`. The two deep-review YAMLs use `kind`.

### V04
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `deep-research-auto.yaml:1327`, `:1428` and `:1530` use `{generation}` in dispatch IDs. The explicit bare-variable assignment is at `:329` under restart; the other dispatch IDs use `{config.lineage.generation}`, including `:1253`.
COMMAND: `rg -n '\\{generation\\}|generation:' .skilled/commands/deep/assets/deep-research-auto.yaml` -> exit 0
CORRECTED CLAIM: -

### V05
VERDICT: CONFIRMED
SEVERITY: propose P2 because the branches are unreachable from the validated executor schema, so they do not break a supported executor configuration.
EVIDENCE: `deep-review-auto.yaml:1239` contains `if_cli_copilot`, and `:1288` states there is no `cli-copilot` executor kind in the schema. `executor-config.ts:11`–`:19` lists the allowed kinds without `cli-copilot`; the other cited YAMLs also contain `if_cli_copilot`.
COMMAND: `rg -n 'if_cli_copilot|cli-copilot|EXECUTOR_KINDS' .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` -> exit 0
CORRECTED CLAIM: -

### V06
VERDICT: CHANGED
SEVERITY: propose P2 because the claimed ownership gap is absent; the workflow YAML implements single-executor policy and minimum-iteration behavior.
EVIDENCE: `convergence.cjs` has no `stopPolicy` or `minIterations` matches. `deep-research-auto.yaml:643` reads `stopPolicy`, and `:815` applies the `minIterationsNotReached` guard. Review stop-policy logic also appears at `deep-review-auto.yaml:780`.
COMMAND: `rg -c 'stopPolicy|minIterations' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` -> exit 1, no matches
CORRECTED CLAIM: `convergence.cjs` does not reference these fields. The single-executor YAMLs implement stop-policy behavior, research YAML implements the minimum-iteration floor, and `fanout-run.cjs` handles fan-out policy.

### V07
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `fanout-run.cjs:1134` rejects `max-iterations` without a positive lineage cap. The native builder defaults missing caps to 12 at `:1759`, while the only call to `findMaxIterationsPolicyViolation` is at `:4036`, after the lineage result returns.
COMMAND: `rg -n 'findMaxIterationsPolicyViolation|const maxIterations = lineage\\.iterations \\|\\| 12|stopPolicy = normalizeStopPolicy' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` -> exit 0
CORRECTED CLAIM: -

### V08
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `v4.0.0.8.md:69` says every script refuses unknown options. `append-mode-event.cjs:58` parses any `--key` into an argument without checking an allowlist; the pure probe returned `{"bogusFlag":"ok"}`. `status.cjs --bogus-flag` returned `Unknown option: --bogus-flag`. A source search found explicit checks in 15 of 27 top-level scripts.
COMMAND: `node -e 'const { parseArgs } = require("./.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs"); console.log(JSON.stringify(parseArgs(["--bogus-flag", "ok"])));'` -> exit 0. `node .skilled/skills/system-deep-loop/runtime/scripts/status.cjs --bogus-flag` -> exit 3. `rg -l 'assertKnownFlags|unknown (option|flag)' .skilled/skills/system-deep-loop/runtime/scripts -g '*.cjs' | sort -u | wc -l` -> exit 0
CORRECTED CLAIM: The changelog overstates coverage. At least 15 of the 27 top-level scripts have explicit unknown-option checks, while `append-mode-event.cjs` accepts unknown keys.

BATCH DONE