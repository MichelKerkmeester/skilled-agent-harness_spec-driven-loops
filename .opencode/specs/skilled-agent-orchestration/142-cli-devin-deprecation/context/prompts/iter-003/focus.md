READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = VERIFY + line-resolve the deep-loop COMMAND YAMLs + their command `.md` docs (the executor wiring at the workflow layer).

## shared current_focus — iteration 3 of 10 — SLICE cluster 3b: deep-loop YAML + command docs
Read each file and report EVERY exact cli-devin / devin site with the precise edit. Files (verify existence; some confirm/auto variants):
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` — `if_cli_devin` block + executor enum/description + any agent-config-recipe note paths.
- `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` — same.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` — `if_cli_devin` block + executor enum + recipe note paths.
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` — same.
- `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` — cli-devin seat dispatch note (~line 455) + executor `type =` enum (~line 168) + self-invocation guard note (~456).
- `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` — same.
- `.opencode/commands/deep/start-research-loop.md` — executor enum (~123,172) + `F) cli-devin` paragraph (~236).
- `.opencode/commands/deep/start-review-loop.md` — executor enum (~123,185) + `F) cli-devin` paragraph (~262).
- `.opencode/commands/deep/start-context-loop.md` — executor enum / `--executor=cli-devin` doc (the one you are running under; check the type list ~line 168 and PRE-BOUND example).
- ALSO grep `.opencode/commands/deep/assets/` and `.opencode/commands/deep/` for any other `cli-devin`/`devin` site (ai-council? a shared executor doc?).

For each: exact line(s), editType (delete-block | delete-enum-token | delete-paragraph | inline-edit), and whether the block references now-dead `cli-devin/assets/*.json` or `cli-devin/references/*.md` paths (those die with the skill dir).

## known-context
Iter1+2 agreement: research/review _auto if_cli_devin blocks confirmed; context-loop _auto seat note at 455-456 + type enum at 168 confirmed (host read line 168 + 455 directly). Confirm the confirm-variant line numbers and any research_confirm block. Note: the agent-config recipe paths (cli-devin/assets/agent-config-deep-{research,review}-iter.json, cli-devin/references/{deep-loop-iter-contract,agent-config-recipes}.md) are referenced from these YAMLs and die with the skill.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"block/enum/paragraph name", "kind":"integration_point", "reuse":"remove",
    "evidence":"path:line(s)", "relevance":0.0, "classification":"active-wiring", "verified":true,
    "editType":"delete-block|delete-enum-token|delete-paragraph|inline-edit",
    "notes":"exact edit + dead-asset-path note" } ] }
```
BINDING lines first (slice=deep-loop-yaml). Tool budget ~8-12.
