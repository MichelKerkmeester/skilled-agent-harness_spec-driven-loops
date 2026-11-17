# Items carried to the packet review

Found by Opus task checks in phases 020 and 021, outside each task's scope.

- OpenCode plugin always fills skillLabel with top.skill, so the renderer's needs-mode owner fallback never runs on that path (found by the 021 T006 check, older than phase 021)
- Top-only route lookup runs on row 0, but the brief leads with the first passing row. When row 0 fails (for example a meaning-passed command row over the uncertainty bar) and row 1 passes, row 1 leads with no command on every runtime. Inferred by the 021 T014 check. Probed 2026-11-14: not reachable, the scorer drops failing rows before enrichment (fusion.ts 1618 to 1632), see the goal log row.
- Plugin test `termination grace stays inside the configured timeout budget` (elapsedMs < 200) failed once under load in a worker run, passed on rerun. Timing flake.
- Claude hook skillLabelFor (hooks/claude/user-prompt-submit.ts) falls back to recommendations[0] when metadata.skillLabel is missing, the pattern 021 T006 fixed in the OpenCode plugin. Fallback path only.
- `tests/handlers/advisor-validate.vitest.ts > surfaces named intent buckets with minN floors` failed once in a full-suite run at the phase 022 gate, then passed twice alone and in a full rerun (1983 passed). Probable flake under load, not reproduced.
