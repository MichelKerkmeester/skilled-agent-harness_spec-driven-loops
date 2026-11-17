# Containment note - mention-14

This lineage was executed as a detached fan-out worker. All review artifacts were written under `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-14/`.

## Writes outside the lineage

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/observability-events.jsonl` gained orchestration-status rows for `mention-14` and `data-14` (`producer: fanout-run`). The parent fan-out runner wrote them; this lineage did not author or edit that file.
- `.skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` received the coverage-graph nodes and edges through `upsert.cjs`. The review brief mandates that call; the database is shared runtime state, not a review artifact.
- The iteration records and convergence events were appended through `append-mode-event.cjs`, whose ledger, audit and effect frames live under this lineage directory.

## Not modified

No file under review was changed: both scope files still match `e626653ce79`. No spec, command, skill, agent or runtime mirror was edited. No git write command was run. The holdout rule was honored throughout: `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` were never opened, no forbidden diff was run, and no score summary or CLI session text was read.

## Verdict correction

The first `synthesis_complete` row (ledger sequence 19) carried `CONDITIONAL` because `review-verdict.cjs` ran before the terminal-gates row existed. After `terminal-gates.cjs` recorded `coverage: fail`, the same script returned `FAIL`. A corrected `synthesis_complete` row (sequence 20) with `FAIL` was appended; the report, dashboard and strategy carry `FAIL`. The earlier row is retained as append-only ledger history and is superseded by the later one.
