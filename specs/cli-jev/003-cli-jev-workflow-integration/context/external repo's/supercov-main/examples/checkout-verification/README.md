# Checkout example

Source and recorded results for the example in [Agent workflow](https://supercov.com/docs/agent-loop#example).

## Run the example

[Download the starter](https://supercov.com/downloads/supercov-tutorial.zip),
extract it, and open the `supercov-tutorial` folder in your coding agent.
Requires Node.js 22+ and npm.

From that folder:

```sh
npm ci
```

Then paste this into the agent:

```text
Measure code coverage with npx supercov and write one missing test.
Only change tests. Rerun the full test suite and show me the test you
added and the before-and-after coverage.
```

The download contains only the original function and two tests. The completed
test and recorded results are kept separately here, not in the starter.

## Files

- `starter/`: the unsolved project, pinned to Supercov 0.0.42.
- [agent-run/](agent-run/): the recorded agent commands, completed test, and diff.
- `scripts/verify-tutorial.mjs`: checks the starter, replays the agent's saved
  test, and verifies that it catches removal of the expiry check.
- `scripts/package-starter.py`: builds the download from an explicit five-file
  list, excluding the solution, recordings, dependencies, and Git history.
- `src/`, `tests/`, and `recorded/`: the original CLI-only example and its output.

The [Agent workflow guide](https://supercov.com/docs/agent-loop#example) explains the agent's
commands, the missing condition, and the test it wrote.

## Maintaining the example

From this directory, install dependencies and verify both reproductions:

```sh
npm ci
node scripts/verify-tutorial.mjs
npm run demo
```

These checks use temporary directories and do not change the starter or saved
recording. The agent's recorded result is two tests to three, with MC/DC from
50% to 100% and line and branch coverage unchanged at 100%.

Build the standalone download with Python 3:

```sh
python3 scripts/package-starter.py /tmp/supercov-tutorial.zip
```

`npm run record` updates the older CLI-only output in `recorded/`. It does not
create a new agent run or overwrite `agent-run/`.
