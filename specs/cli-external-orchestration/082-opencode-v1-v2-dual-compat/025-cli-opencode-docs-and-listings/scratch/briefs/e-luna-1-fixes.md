ROLE: You apply four review fixes. Match each file's existing style. Comments never name a spec folder, phase, row or task id.

FIX 1 (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs` and its test `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`):
In `readV2`, the command read loop keeps the last body even when no two consecutive reads agreed on a non-zero count, so an empty or unsettled listing is judged as if it were final. Change it so `readV2` also returns `commandCounts` (the array of counts) and `commandsStable` (`stableIndex(commandCounts) !== -1`). In `legsForV2`, when the server started but `v2.commandsStable !== true`, the `command-listed` row is `makeResult('command-listed', 'v2', 'DEGRADED', 'the command listing never settled on a non-zero count', [`counts: ${JSON.stringify(v2.commandCounts ?? [])}`])` instead of a judged row. Keep everything else. Update every test fake that returns a started v2 result so it carries `commandsStable: true` where the test expects a judged `command-listed` row. Add one test `C8: v2 a command listing that never settles degrades command-listed` that calls `legsForV2` with a started result, `commandsStable: false`, `commandCounts: [0, 0, 0]` and an empty `commands` body, and asserts DEGRADED with the counts in the details. Also make the real-`readV2` test (the fake server one) assert `commandsStable === true`.

FIX 2 (`.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md`): the line `` - `opencode providers login opencode-go`  (recommended — default for cli-opencode; fronts deepseek-v4-flash) `` must say `deepseek-v4.1-flash`.

FIX 3 (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`):
- The retired-id test must also catch the bare slug without a provider prefix: a second pattern that matches the slug `deepseek-v4` + `-flash` when it is NOT preceded by a word character, `/`, `.` or `-`, and NOT followed by a word character, `.` or `-`. Build it from fragments like `RETIRED_ID` so the file does not spell the slug. A line fails if either pattern matches (the dated-record exemption still applies). Rename the test to `no current doc names the retired opencode-go id or its bare slug`.
- Also scan the generated Hermes copy `.hermes/skills/cli-opencode/SKILL.md` (resolve it from the repository root, which is five levels above the skill root; if the file does not exist, skip it, do not fail). Report its offenders with the path relative to the repository root.
- In `.github/workflows/opencode-dual-version.yml`, add `'.hermes/skills/cli-opencode/**'` to BOTH path lists, right after the two cli-opencode entries. Then run `bash .github/scripts/check-gate-inputs.sh` and `actionlint .github/workflows/opencode-dual-version.yml`; if the gate check rejects a `.hermes` path, remove it again and say so.

FIX 4 (`.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md`): rename the heading `### Operator confirmation for share URLs` to `### --share is a deprecated no-op` (keep the level). Nothing links to its anchor.

VERIFY (report tail and exit code of each):
1. `node --test .skilled/bin/tests/opencode-config-shape.test.cjs .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`
2. `bash .github/scripts/check-gate-inputs.sh`
3. `actionlint .github/workflows/opencode-dual-version.yml`
4. `git diff --stat`
