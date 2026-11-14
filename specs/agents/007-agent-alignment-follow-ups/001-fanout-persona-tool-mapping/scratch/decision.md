# Decision for the fan-out runner's persona block

decision: no-change

## Evidence

Three read-only Codex runs with the persona block the runner inlines, and no tool-mapping line. Each was judged by the last line of its report file, not by exit status.

| Run | Report file | Last line | Command the child ran |
|---|---|---|---|
| 1 | `scratch/codex-run-1.txt` | `FILES READ: .skilled/agents/README.txt` | `sed -n '1p' .skilled/agents/README.txt` |
| 2 | `scratch/codex-run-2.txt` | `FILES READ: .skilled/agents/README.txt` | `sed -n '1p' .skilled/agents/README.txt` |
| 3 | `scratch/codex-run-3.txt` | `FILES READ: .skilled/agents/README.txt` | `head -n 1 .skilled/agents/README.txt` |

All three reports also give the first heading correctly: `AGENTS DIRECTORY`.

- codex-cli version: 0.169.0, model gpt-6-luna at medium on the fast tier, `--sandbox read-only`
- commit the runs were made on: 63e6261895
- prompt: `scratch/codex-probe-prompt.txt`, built with `withAgentPersona('deep-research', <task>, <repo root>)` from `fanout-run.cjs`, so it carries the same block a lineage gets
- all three processes exited 0, which decided nothing

## Why no change

The failure the predecessor packet saw needs a persona that denies Bash. The runner inlines only `deep-research` or `deep-review` (`fanout-run.cjs` line 1564), and both allow Bash (line 10 of each agent file). With the shell allowed, each child used it for the read without being told to.

## Limits of this evidence

- Three runs on one version are a sample. They show the child reads on codex-cli 0.169.0 and do not prove it always will.
- The probe is a single read task with the lineage's persona, not a full research lineage. It tests whether the child uses its shell for a named read, which is the question this phase asked.
- Only `deep-research` was probed. `deep-review` carries the same `bash: allow` line and was not run.
- A later run that ends `FILES READ: none` reopens this finding. The fix is then the `add-line` branch in `tasks.md`.
