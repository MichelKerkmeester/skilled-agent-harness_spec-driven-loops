# Iteration 017 — A15: two-version doctor and CI check design

## Focus

Specify concrete, scriptable checks that prove the repo works on whichever OpenCode version is installed, using only facts this run has proven. Deliver a check list (command, expected output, pass rule) for v1, v2 and both, the doctor integration point with file paths, and a CI job outline.

## Actions Taken

1. Read the doctor router manifest and its schema comment block: `.skilled/commands/doctor/_routes.yaml`. Established that routes are argv-driven and that `script_invocations` carries per-command exit semantics, `mutating`, `gate3_location` and `trigger_phrases`. [SOURCE: .skilled/commands/doctor/_routes.yaml:24]
2. Read one shipped battery and its presentation contract to copy the pass-rule idiom: `.skilled/commands/doctor/assets/doctor-setup.yaml` and `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`. The exit taxonomy (0 pass, 3 DEGRADED, 2 usage/crash, other fail) is stated there per leg. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:41] [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:13]
3. Listed the doctor script directory and the CI workflow directory to find the slot for a new battery and a new job.
4. Probed v1's status surfaces. `opencode debug paths` names the log directory `~/.local/share/opencode/log`. `opencode --version` reports 1.19.3.
5. Probed v1's discovery oracle: `opencode debug config </dev/null` — exit 0, 742,350 bytes of resolved config, and **zero** new log lines. The resolved config carries top-level `plugin` (an array of `file://` specs) and `plugin_origins` (`{spec, source, scope}`), covering both `scope:"global"` (`~/.config/opencode/plugins/orca-opencode-status.js`) and project entries.
6. Read v1's log for plugin outcomes. Two distinct greppable lines exist: INFO `msg="loading plugin" id=<abs> entrypoint=file://<abs>` and WARN `message="failed to load plugin" target=<abs> ref=err_<hex> cause="Cause([Fail(PluginModule.LoadError: ...`. All 16 repo plugins appear as distinct `loading plugin` ids, and a separate earlier run shows 8 repo plugins as `failed to load plugin`.

No files outside this packet were written. One attempted probe (`opencode run -m nosuchprovider/nosuchmodel`) was **denied by the repo's own Pi dispatch guard**, not by this packet's constraints; the denial itself is recorded as a finding.

## Findings

**F1 — v1 has a model-free discovery oracle, and it is richer than expected.** `opencode debug config </dev/null` exits 0 and prints `plugin` (spec array) plus `plugin_origins` (spec, source directory, scope). This is a per-plugin *inventory* check with no server, no model and no plugin evaluation. Cost: one process, ~742 KB of stdout, so redirect to a file and assert against it, never pipe into `jq` in a loop.

**F2 — v1 has no per-plugin status API, but it does have a per-plugin outcome log.** Under `opencode debug paths` → `log`, the run log carries `msg="loading plugin" id=<abs>` for every plugin that loaded and `message="failed to load plugin" target=<abs> ref=err_... cause="...PluginModule.LoadError..."` for every plugin that did not. Both shapes were observed for this repo's own 16 paths. A doctor leg can therefore read a log window and decide per file, with no custom marker convention.

**F3 — `debug config` resolves discovery but does not load modules.** Zero fresh log lines across a full successful config resolution proves the two checks are separate legs, not one: discovery from `debug config`, load outcome from the log during a real load.

**F4 — the repo's own guard denies a nested `opencode run` from a Pi agent.** The probe was refused with "Pi dispatch denied for cli-opencode. Name the matching executor in the user request." A `/doctor:opencode` leg must not depend on shelling `opencode run` when the doctor runs inside Pi; it must use `debug config` + log reading, or report SKIP/DEGRADED. In CI (no Pi) the same command is available, so the load leg belongs in the CI job, guarded by an `OPENCODE_DISPATCH_ALLOWED`-style escape the guard already provides.

**F5 — v1 discovery is a union, not an override.** `plugin_origins` from one resolution contains a `scope:"global"` user plugin and project plugins together, so an ancestor-level install is visible from a deeper cwd. This narrows the long-carried "union vs override" question in favour of union for v1.

**F6 — v1 normalises the config key to `plugin` (singular) in output, regardless of the input spelling.** The resolved key set is `['plugin','plugin_origins']`. This does not by itself settle whether v1 *accepts* `plugins` (plural) on input; it does show that any check asserting config shape must assert on the resolved form, not the authored form.

## Check list

### v1 (`opencode`, 1.19.x)

| # | Command | Expected output | Pass rule |
|---|---|---|---|
| V1-1 | `opencode --version` | `1.19.3` | matches `^1\.` |
| V1-2 | `opencode debug config </dev/null > "$TMP/v1-config.json"; echo $?` | exit `0`, ≥100 KB | exit 0 AND valid JSON |
| V1-3 | read `plugin_origins[].spec` from that file | 16 `file://…/.opencode/plugins/<name>.js` specs | every repo plugin basename present; any missing = FAIL naming the file |
| V1-4 | `opencode debug agent <name>` per repo agent | exit `0` | exit 0; non-zero = FAIL naming the agent |
| V1-5 | `opencode debug skill` | catalog text | each repo skill id appears once |
| V1-6 | log window around a load trigger: `grep -c 'msg="loading plugin"'` / `grep -c 'failed to load plugin'` in `$(opencode debug paths \| awk '$1=="log"{print $2}')` | counts | FAIL if any `failed to load plugin` line names a repo path; DEGRADED if zero lines (trigger produced no load) |

### v2 (`opencode2`, 2.0.x)

| # | Command | Expected output | Pass rule |
|---|---|---|---|
| V2-1 | `opencode2 --version` | `2.0.x` | matches `^2\.` |
| V2-2 | `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<urlenc cwd>" > "$TMP/plugins.json"` (raw query, redirect to file, retry once — first call returns before discovery) | JSON plugin list | every repo plugin `state.status == "active"`; any other status = FAIL printing the status |
| V2-3 | `opencode2 debug agents` | agent list | each repo agent present |
| V2-4 | `opencode2 api GET "/api/command?location%5Bdirectory%5D=<urlenc cwd>"` and `…/api/skill…` (raw, to file) | JSON lists | each repo command and skill id present |
| V2-5 | env propagation: `AI_SESSION_CHILD=1 OPENCODE_DB=…` with `--standalone` | plugin sees client env | without `--standalone` the daemon env wins (prior finding) — the leg must set `--standalone` or SKIP |

### Both

| # | Command | Expected output | Pass rule |
|---|---|---|---|
| B-1 | `command -v opencode; command -v opencode2` | two distinct absolute paths | never the same path; each version is invoked only through its own entry |
| B-2 | run B-1 plus both version probes in one battery | both families present only when both are installed | single-version install = SKIP the missing family, exit 3 DEGRADED, never FAIL |
| B-3 | the same `opencode.json` consumed by v1 `debug config` and the v2 equivalent | both exit 0 | a config that one family rejects is a FAIL naming the key |
| B-4 | `run` smoke test with a bogus model (`-m nosuchprovider/nosuchmodel`) on each family | plugin load lines appear, then model resolution fails | PASS on "plugins loaded"; the model error is expected and must be filtered out |

## Doctor integration point

Read-only diagnostic, so `mutating: read-only` and `gate3_location: n/a`.

1. Battery: `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` (new) — mirrors `.skilled/commands/doctor/scripts/git-setup-check.cjs` exit taxonomy: `0` PASS, `1` FAIL, `2` usage/crash, `3` DEGRADED/SKIP.
2. Workflow asset: `.skilled/commands/doctor/assets/doctor-opencode.yaml` (new) — one leg per row above, `mutation_boundaries.read_only: true`, repair lines pointing at `/doctor:setup`.
3. Presentation: `.skilled/commands/doctor/assets/doctor-opencode-presentation.txt` (new) — same per-leg table template as `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`.
4. Command router: `.skilled/commands/doctor/opencode.md` (new) — argv-driven, no positional target, matching `.skilled/commands/doctor/setup.md`.
5. Route entry: append to `.skilled/commands/doctor/_routes.yaml` — `command: /doctor:opencode`, `target: opencode`, `yaml: doctor-opencode.yaml`, `setup_vars: []`, `allowed_flags: []`, `mutating: read-only`, `gate3_location: n/a`, `mcp_tools: []`, and `script_invocations` naming each check with its exit semantics; `trigger_phrases` of three or more words (e.g. "which opencode version is installed", "check opencode plugin registration").
6. Registration: add the row to the target table in `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` and the leg list in `.skilled/commands/doctor/setup.md`.
7. Advisor bridge: add activation entries to both lists in `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`, then rerun `derive-command-bridges.cjs`, `route-validate.sh` and `doctor-phrase-reach.cjs` — the manifest's own four-step procedure. [SOURCE: .skilled/commands/doctor/_routes.yaml:46]

## CI job outline

New workflow `.github/workflows/opencode-dual-version.yml`, one job `doctor`, matrix over `{version: 1.19.3, family: v1}` and `{version: 2.0.32, family: v2}`, each installed into its own npm prefix so the two never share a `node_modules`:

1. `npm install --prefix "$RUNNER_TEMP/${{ matrix.family }}" <package>@${{ matrix.version }}` — package name is **UNKNOWN** in this run; iteration 15's install finding is the input and must be filled in before this job is written.
2. Symlink the prefix's `.bin/opencode` onto `PATH` under the family's entry name (`opencode` for v1, `opencode2` for v2) so the battery exercises the exact dispatch names the skill documents.
3. Run `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=${{ matrix.family }} --json`; upload the JSON and the v1 log window as artifacts.
4. Separate `both` job: install both prefixes, assert B-1 isolation, then run the repo's existing gates unchanged (`.github/workflows/comment-hygiene.yml`, `.github/workflows/routing-registry-drift.yml`) to prove a dual install does not perturb them.
5. Keep the job `continue-on-error: false` for the plugin-registration legs; the bogus-model smoke leg (B-4) is advisory only, because it depends on provider resolution it does not control.

## Questions Answered

None of the five strategy key questions is newly answered; all had already been ticked. This iteration converts settled facts into a verification design.

## Questions Remaining

- **A15-Q1 (new, P0):** which v1 command actually instantiates plugins? `debug config` does not, and the repo guard denies `run` from Pi. Candidates: `opencode debug agent <name>`, or any `run` variant under the guard's escape. Blocks V1-6 outside CI.
- **A15-Q2 (new, P1):** does the v1 log roll per run (timestamped files) or is `opencode.log` a single append-only file? V1-6 needs a stable window boundary; today's evidence is one 28 MB rolling file plus timestamped siblings.
- **A15-Q3 (new, P1):** what is the exact npm package name and version pin for each family (the CI matrix's `<package>@<version>`)? Carried from iteration 15's install findings, but never needed for a check list until now.
- **A15-Q4 (new, P2):** does `plugin_origins` include a `disabled` or `error` field when a spec fails to resolve, which would let V1-3 detect a broken entry without a load?
- Carried and untouched: `plugins` vs `plugin` config tolerance (narrowed to resolved-form by F6, not closed); flat-file plugin loading on v2; `sk-vision.js` symlink following; `run --format json`; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle`/`session.execution.*`; `SystemPart`; `context` `SessionRequestKind`; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`; v2 `run` positional directory; hidden `--dangerously-skip-permissions`; `models <provider>` on v2.

## Next Focus

A16 or the next open area the reducer selects; if A15 is revisited, the highest-value single probe is A15-Q1 — one v1 command that instantiates plugins would complete the v1 half of the check list.
