ROLE: You bring the cli-opencode manual testing playbook in line with one corrected fact. Edit prose and command examples only. Keep every scenario id (CO-020, CO-026, CO-027, CO-028), heading, table and anchor. Short, plain sentences.

FACT (verified 2026-10-20 on OpenCode 1.19.3): `--share` is a hidden, deprecated option. Passing it prints `!  Session sharing has been discontinued`, the run carries on, and nothing is published (no URL). OpenCode 2.0.32 `run` has no `--share`. The skill now forbids passing it: `SKILL.md` NEVER rule 2 reads "Pass `--share`. On OpenCode 1.19.3 it is a hidden, deprecated flag that only prints "Session sharing has been discontinued", and OpenCode 2 `run` has no such flag". A parallel detached session on OpenCode 1 needs only `--port <N>`.

FILES (under `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/`):
- `manual-testing-playbook.md`
- `session-continuity/fork-and-share.md`
- `parallel-detached/parallel-detached-session.md`
- `parallel-detached/ablation-suite.md`
- `parallel-detached/worker-farm-loop.md`

EDITS:
1. Remove `--share` from every command example (`opencode run --share --port 4096 ...` → `opencode run --port 4096 ...`; delete a `--share \` line).
2. Every sentence that says `--share` publishes a session or a URL, or that a URL needs operator confirmation before it is published, becomes the fact in one sentence. A `DESTRUCTIVE SCENARIO (CHK-033)` banner keeps its label but its text says the scenario no longer publishes anything and still runs in the sandbox directory it names.
3. CO-020 (`fork-and-share.md` and its summary in `manual-testing-playbook.md`): the `--share` half of the scenario now checks that NEVER rule 2 forbids `--share` and states it is a deprecated no-op. Its expected signal is that rule, not a confirmation requirement. Optionally add one step: run `opencode run --share --format json --model <unresolvable> "ping" </dev/null` in a private data home and expect the `Session sharing has been discontinued` line. Keep the `--fork` half unchanged.
4. Do NOT edit the line that starts `Coverage note (2026-04-26):` in `manual-testing-playbook.md`.

VERIFY (run each, report output and exit code):
1. `rg -n -e '--share' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` and confirm no remaining line shows `--share` in a command to run (the optional CO-020 probe step excepted) or says it publishes.
2. `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`
3. `git diff --check`

REPORT: each file changed and the verify results.
