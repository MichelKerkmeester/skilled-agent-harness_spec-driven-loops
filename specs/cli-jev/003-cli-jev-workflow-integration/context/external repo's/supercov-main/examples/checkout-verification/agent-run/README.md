# Recorded agent run

This run used a fresh Codex agent with only the files from `../starter/` and the
prompt in `prompt.txt`. Dependencies were installed before the run. The agent
was not given the completed test, expected coverage, or this tutorial.

Shell commands were run through a logging wrapper that saved their arguments,
stdout, stderr, and exit status to `commands.jsonl`. File edits were made by
the agent. The temporary project path and timings are retained in the logs.

- `commands.jsonl`: all shell commands from the agent run, in order.
- `completed/tests/session.test.js`: the file the agent left behind.
- `change.patch`: the difference from the starter's original test file, with
  temporary directory prefixes removed from the patch's path labels.
- `before-summary.txt`, `before-file.txt`, `after-summary.txt`, `diff.txt`:
  unmodified stdout extracted from that run for the tutorial.
- `metadata.json`: recording date, tool versions, and file hashes.

The original tests were preserved. Only `tests/session.test.js` changed.
The application source, package files, and `.gitignore` were unchanged.

The `stale run` message in the diff's stderr is expected: the first run was
recorded before the test file changed. It remains valid for a before/after
comparison.

`node scripts/verify-tutorial.mjs` checks the starter and replays the saved test
in fresh temporary directories. It also checks a deliberately broken copy with
the expiry guard removed. This is deterministic verification of the saved
change, not a new agent run.
