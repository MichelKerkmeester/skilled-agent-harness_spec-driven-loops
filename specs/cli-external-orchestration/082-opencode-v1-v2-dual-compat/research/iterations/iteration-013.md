# Iteration 013 — A11: `cli-opencode` dispatch to both OpenCode versions

Run: `2026-10-18T09:23:10.373Z` · Segment 1 · Iteration 13 of 20 · Mode: research (`@deep-research`)

## Focus

Which changes does the `cli-opencode` skill need so it dispatches correctly whichever version is installed? Covering (1) version detection for two different `--version` formats, (2) a full v1 → v2 flag and subcommand matrix, (3) the files inside `cli-opencode` that encode v1-only behaviour, and (4) the deep-loop runtime's `cli-opencode` command builder and what must branch there.

Constraint honoured: the Pi guard blocks `opencode run`, so every version fact below comes from the captured help text and OpenAPI under `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/`. No live `opencode` invocation was made.

## Actions Taken

1. Read the captured version strings and global help for both binaries: `[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-version.txt]` and `[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-version.txt]`, then `v1-help.txt` and `v2-help.txt`.
2. Diffed `run` specifically — `[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-run-help.txt]` against `[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt]` — and the subcommand trees (`session`, `debug`, `api`, `serve`, `service`, `models`, `auth`).
3. Queried `[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json]` for the operations that replace the removed `run --command`, and read the request-body property lists for `session.command`, `session.prompt`, `session.create`.
4. Grepped the three `cli-opencode` prose surfaces and `hard-rules.json` for the v1 flag vocabulary; counted the playbook files that use it.
5. Read `buildOpencodeLineageCommand`, `buildNativeLineageCommand`, `resolveExecutableVersion` and `isOpencodeBinaryAvailable` in `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs]`.

## Findings

### F1 — v2 `run` deletes seven flags the repo depends on, and changes two more

`v2-run-help.txt` lists exactly twelve FLAGS. Measured against `v1-run-help.txt`:

| Need | v1 1.19.3 | v2 2.0.32 | Kind of change |
|---|---|---|---|
| model + effort | `-m/--model provider/model` **and** `--variant high\|max\|…` | `-m/--model provider/model#variant` | **flag removed**, effort folded into the model string |
| registered command | `--command <family>/<name>` (args = message) | **absent** | **flag removed** |
| working directory | `--dir <path>` | positional `[<directory>]` on the root `opencode <subcommand> [flags] [<directory>]` form; `run`'s own ARGUMENTS list only `message...` | **flag removed**, relocation ambiguous |
| plugins off | `--pure` (global) | **absent** from every v2 help page captured, including the global one | **flag removed** |
| attach to server | `--attach <url>` + `-p/--password` + `-u/--username` | `--server <url>` | **renamed**, auth flags dropped |
| local server port | `--port <n>` | **absent** on `run`; lives on `serve --port` | **relocated** |
| share | `--share` | **absent**; nearest surfaces are `pair` (one-time links) and `stats` (shareable usage stats) | **removed** |
| file attach | `-f, --file` — `[array]` | `-f, --file string` | **arity changed** |
| permission bypass | `--dangerously-skip-permissions` — *not listed in v1 help either* | *not listed in v2 help* | **undocumented on both** |
| agent | `--agent <string>` | `--agent <string>` | kept |
| format | `--format default\|json` | `--format default\|json` | kept, identical choices |
| session | `-s/--session <id>` = continue an existing id | `-s/--session <id>` = "Session ID to continue, **or to create if it does not exist**" | **semantics widened** |
| fork | `--fork` "requires `--continue` or `--session`" | `--fork` with no stated precondition | constraint dropped |
| continue / title / thinking / auto | present | present | kept |
| log level | `choices: DEBUG, INFO, WARN, ERROR` | `choices: all, trace, debug, info, warn, warning, error, fatal, none` | **choice set changed** |

The consequence for the skill is structural, not cosmetic: **there is no v1-and-v2-safe invocation line.** `opencode run --variant max --format json --dir X "<prompt>"` exits with an unknown-flag error on v2, and `opencode run --format json X "<prompt>"` silently runs v1 in the caller's cwd instead of `X`. Every documented invocation must therefore be resolved through a version branch before it is rendered — see F6.

### F2 — Subcommand tree: 9 renames/removals, 7 v2-only additions

| v1 | v2 | Note |
|---|---|---|
| `export [sessionID]` | `session export` | also `GET /api/experimental/session/{sessionID}/export` (`session.export`) |
| `import <file>` | `session import` | |
| `attach <url>` | — | replaced by `--server` / `--standalone` on each data command |
| `agent create\|list` | — | listing → `debug agents`; `api` exposes `GET /api/agent` and `GET /api/agent/{agentID}` |
| `providers` (alias of `auth`) | `auth` | the `providers` alias does **not** appear in v2's subcommand list |
| `models [provider]` | `models` | no positional provider argument in the v2 help |
| `web` | `serve` | v2 `serve` is described as "Start the v2 API and web server" |
| `completion` | `--completions <bash\|zsh\|fish\|sh>` | flag, not subcommand |
| `plugin <module>` | `plugin <subcommand>` | |
| `db`, `github`, `pr` | — | no v2 counterpart in the captured help |
| — | `api`, `service`, `reload`, `pair`, `mini`, `uninstall`, `upgrade\|update` | v2-only |

`serve` survives but its flag set changed too: v2 exposes `--hostname`, `--port`, `--cors` (repeatable), `--service`, `--stdio`. `api` is the mechanically interesting addition — `opencode api <operation | method path...>` with `--data`, `--header`, `--param key=value` makes any OpenAPI operation a CLI call, which is how the removed `--command` gets replaced without hand-rolling `curl`.

### F3 — The `--command` replacement is a documented API operation, not a documented `run` feature

`POST /api/session/{sessionID}/command`, `operationId: session.command`, takes `{name, text, files, agents, skills, delivery}`. The near-twin `POST /api/session/{sessionID}/prompt` (`session.prompt`) takes `{id, text, files, agents, skills, metadata, delivery, resume}` — it has no `name`, so it is the plain-message path, not a command path.

That is the concrete difference iteration 7 could not settle: **v2 does route a slash-command name through a first-class operation, and `run` has no flag for it.** Two v2 routes exist and they are not equivalent:

- `opencode api session.command --param sessionID=<id> -d '{"name":"speckit/search","text":"<args>"}'` — the operation, semantics preserved.
- A `run` message beginning `/speckit:search <args>` — behaviour unverified on v2; v1's documented behaviour is the *negative* one (raw prose), and nothing captured for v2 shows expansion at `run` level (carried open question).

Note also `session.create` accepts `{id, parentID, title, agent, model, location, metadata, permissions}` and `session.switchModel` takes `{model}` — so on v2 the agent and the model can be set on the session through the API rather than on the `run` invocation, which is a second shape the skill may prefer for long-lived lineaged dispatches.

### F4 — Version detection: the two `--version` formats are genuinely different, and the repo's current guard fails on v2

- v1: `opencode --version` → `1.19.3` (bare semver, no prefix).
- v2: `opencode2 --version` → `opencode v2.0.32` (binary word, space, `v`, semver).

So a parser must accept `^\s*(?:[A-Za-z][\w.-]*\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$` — optional product word, optional `v`, optional prerelease/build tail — and take the major to select the contract.

The repo's existing check at `[SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134]` is `opencode --version | grep -q '^1\.'`. On v1 it passes; on a v2 binary it fails (the line starts with the word `opencode`), which means the skill would report "Not installed or version drift" for a perfectly healthy v2 install. The message at `[SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:133]` states the pin — "pinned to opencode v1.3.17" — a baseline that is already stale against the observed `1.19.3` and meaningless against `2.0.32`.

Also unresolved by naming: `opencode2` is a **different binary name**, so no amount of version parsing inside an `opencode`-only code path will find it. Detection needs a binary-resolution step *before* the version step (F7).

### F5 — `--dangerously-skip-permissions` is undocumented in both captured `run` help pages

It appears in neither `v1-run-help.txt` nor `v2-run-help.txt` (a grep for `dangerously` across the whole capture directory returns nothing). The skill and the runner both depend on it: `[SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:231]` requires the four-layer mitigation for `run --dangerously-skip-permissions`, and `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2341]` pushes it whenever the sandbox resolves to `danger-full-access`. Whether it is a hidden alias of `--auto` or was removed before 1.19.3 is **UNKNOWN** — help text alone cannot distinguish a hidden flag from an absent one. Recorded as an evidence gap rather than a defect, because the flag is functionally equivalent to the documented `--auto` on both versions and `--auto` *is* present in both.

### F6 — The deep-loop runner has no version signal at all, and two hardcoded assumptions

`buildOpencodeLineageCommand` at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2324]` emits:

```
run --model <model> --format json --dir <root> [--dangerously-skip-permissions] [--variant <effort>] <prompt>
```

with `--dir` at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2336]`, the bypass at `:2341`, `--variant` at `:2349`, the prompt positional last at `:2351`. On v2 that argv fails on at least two unknown flags (`--dir`, `--variant`) before the prompt is read.

The second opencode path is `buildNativeLineageCommand` (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2258]`), which builds `run --format json --dir <root> --command deep/<loop> <input>` with `command: 'opencode'` at `:2281` — the same two v1-only flags plus `--command`, which v2 does not have at all.

The decisive obstacle to branching is that **the runtime never learns a version.** `resolveExecutableVersion` (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2093]`) does not spawn `--version`; it resolves the PATH entry, stats it, and returns `sha256:<digest>` of the binary contents (`:2108`). That is a strong identity primitive — it detects a binary swap — but it is not a semver, so no code path can compare a major. A separate `resolveExecutableSemver` (spawn `--version`, apply the F4 parser, cache by the same `${path}:${size}:${mtimeMs}` key) is the minimal addition.

The third assumption is binary naming: `isOpencodeBinaryAvailable` runs the literal `command -v opencode` (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2962]`) and `buildOpencodeLineageCommand` throws `cli-opencode executor unavailable` when it fails (`:2326`). A machine with only `opencode2` installed is reported as having no executor. The dispatch table at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2923]` maps the kind to the builder with no version input at all, so the branch has to be introduced either inside the builder (read the resolved semver) or as two table entries (`cli-opencode` / `cli-opencode2`).

### F7 — The concrete file change list inside `cli-opencode`

| File | What encodes v1-only behaviour | Change |
|---|---|---|
| `SKILL.md:5` (`version: 1.4.14.0`), `:133`, `:134` | the v1.3.17 pin and the `^1\.` guard | replace the guard with the F4 parser; state a per-major baseline (`1.19.x` / `2.0.x`) instead of one pin |
| `SKILL.md:153`, `:157` | default invocation carries `--variant max` | split into two invocation lines keyed by major |
| `SKILL.md:159`, `:189` | "never pass `--agent general`" doctrine | the rejection is v1-specific; v2 documents `--agent string` with no rejection note — keep as advisory on v1, reword for v2 |
| `SKILL.md:165` | core-flag list (`--variant`, `--port`, `--share`, `--pure`, `--file`, `--thinking`) | four of those seven do not exist on v2 |
| `SKILL.md:171` | `--command` doctrine | branch: v1 `--command`, v2 `session.command` operation (F3) |
| `SKILL.md:203`, `:207` | `--share --port`, `--attach` | v2: `pair`, `serve --port`, `--server` |
| `SKILL.md:215`, `:219` | version-baseline + `</dev/null` rules | keep stdin rule (universal); re-key the baseline |
| `SKILL.md:249` | "differs from the v1.3.17 baseline" | re-anchor to a detected major |
| `references/cli-reference.md:3`, `:18`, `:46`, `:61` | "Pinned to v1.3.17" in four places | make the pin a *matrix* with two rows |
| `references/cli-reference.md:103`–`:119` | the flag table itself — `--pure`, `--command`, `--share`, `--attach`, `-p/-u`, `--dir`, `--port`, `--variant`, `--thinking` | add a `v2` column; mark each row kept/renamed/removed |
| `references/cli-reference.md:123` | `--command` semantics "verified on v1.17.4" | add the v2 replacement route beside it |
| `references/cli-reference.md:132`, `:142` | canonical invocation recipe + flag-default table | same split as `SKILL.md:157` |
| `references/cli-reference.md:163`, `:165`, `:167` | `--share`, `--port`, `--session`/`--fork` sections | `--share` and `--port` need v2 substitutes |
| `references/providers-and-models.md:17`, `:113`, `:119`, `:131`, `:133` | `--variant` is the effort lever throughout, including the recipe at `:119` | v2 needs the `#variant` mapping; every `--variant` example gains a v2 twin |
| `hard-rules.json` | 5 rules; three are v1-shaped | `command-flag-for-slash-prompt` must name the v2 operation; `share-requires-confirmation` is vacuous on v2 (no `--share`); `no-bare-agent-general` must be marked v1-only or re-probed on v2. `stdin-redirect-required` and `explicit-model-required` stay universal |
| `assets/prompt-templates.md:76`, `:78`, `:112`, `:116`, `:157`, `:159` | six rendered invocations, each with `--variant max` | add the v2 rendering (`model#max`, positional dir) beside each |
| `assets/prompt-quality-card.md` | prompt-shape only — no invocation line found | no change |
| `manual-testing-playbook/` — 20 files name the v1 flag set | `cli-invocation/*` (5), `cross-repo-cross-server/{attach-remote-server, cross-repo-dispatch}`, `multi-provider/variant-levels-comparison`, `parallel-detached/*` (3), `session-continuity/*` (3), `agent-routing/*` (7), `intra-routing-recall/*` | each needs a version banner; the `attach` and `variant` pages change shape, not just wording |

`references/agent-delegation.md`, `context-budget.md`, `integration-patterns.md`, `opencode-tools.md`, `permissions-matrix.md`, `self-invocation-guard.md`, `destructive-scope-violations.md`, and `README.md` were not opened this iteration, so their v1 coupling is **UNVERIFIED** — `integration-patterns.md` §6 is cited from `SKILL.md:219` for the stdin rule and is likely universal, but that is inference.

### F8 — A version-detection spec that both the skill and the runner can share

1. **Resolve the binary.** Candidates in order: `$OPENCODE_BIN` (operator override), `opencode2`, `opencode`. Probe with `command -v`. If none resolves, fail with the existing `cli-opencode executor unavailable` message naming both names.
2. **Ask the resolved binary for its version.** `<bin> --version`, capture stdout, tolerate stderr noise.
3. **Parse** with `^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$`. Both observed forms parse: `1.19.3` → 1.19.3; `opencode v2.0.32` → 2.0.32.
4. **Map major → contract.** `1` → v1; `>= 2` → v2; anything unparsable → treat as v2 if the binary name ends in `2`, else **refuse to dispatch** rather than guess (a wrong guess silently changes flag semantics, which is worse than a clear error).
5. **Optionally confirm the capability, not just the number** — `run --help | grep -q -- '--variant'` decides the effort lever directly. The version string is the only *formatted* difference; capability is what dispatch actually needs.
6. **Cache** the result on the same identity key the runner already computes (`${realpath}:${size}:${mtimeMs}`), so an upgraded binary invalidates the cache for free.

Present-in-both binary behaviour worth relying on: `--version`/`-v` exists on both, `--format json` has identical choices on both, `--agent`, `--title`, `--thinking`, `--auto`, `-c/--continue`, `-s/--session`, `--fork`, `-f/--file`, `--print-logs` all survive. That intersection is the migration-safe core; everything else is branch-only.

## Questions Answered

- **"How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?"** — answered. Detection spec in F4/F8, the flag matrix in F1, the subcommand matrix in F2, the `--command` replacement in F3, and the runner-side branching in F6.

## Questions Remaining

- Carried unchanged: `plugins` (plural) vs `plugin` (singular) config tolerance on both versions; `.opencode/plugins/` discovery unions; flat-file plugin loading on v2; `sk-vision.js` symlink following; `run --format json` schema and whether `--standalone` changes it; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance.
- Carried unchanged: command-template `` !`cmd` `` injection and `.opencode/command` vs `.opencode/commands` scanning on v2; why `/api/command` returned no project commands; the `~/.opencode/hooks.json` + `[features].opencode_hooks` surface; `#`-in-model shell safety across zsh/fish/`sh -c`; skill permission key (`skill` vs v1 equivalent), skill root precedence, `disable-model-invocation`, `allowed-tools` meaning on v2, the `node_modules` leak.
- **New (P0):** does `--dangerously-skip-permissions` exist on either `run` as a hidden flag? Help text cannot distinguish hidden from absent. Settle by `opencode run --dangerously-skip-permissions --help` exit status, or by reading the compiled argv schema in the binary — neither is available under the Pi guard.
- **New (P0):** v2 `run` positional-directory behaviour — `opencode run /path "<msg>"` (is `[<directory>]` consumed before `message...`?), `opencode /path run "<msg>"`, or neither. Blocks the entire v2 invocation shape in F6. Requires a live run.
- **New (P1):** does `--model provider/model#variant` survive on **v1 1.19.3** (i.e. can one model string serve both)? Requires a live run.
- **New (P1):** does v2 `run` expand a `/family:name args` message, or must `session.command` be used? Iteration 7's question, now sharpened by F3.
- **New (P2):** whether `assets/prompt-templates.md`'s six `--variant` invocations are rendered from a single template variable or hand-written six times (affects whether the change is one edit or six).
- **New (P2):** v2 `models` has no positional provider argument in its help — how does the auth pre-flight (`opencode models opencode-go`, `cli-reference.md:175`–`:178`) behave on v2? That pre-flight is a documented exit-code contract and v2 may not honour it.

## SCOPE VIOLATIONS

None. No file outside the allowed-write list was created, modified, renamed or deleted. The `cli-opencode` skill, `hard-rules.json`, `fanout-run.cjs` and the playbook were read only.

## Next Focus

**A12 — install, verification and pinning guidance for side-by-side and single-version setups** (strategy key question 3). Carry F8's detection spec forward as the centerpiece: a readiness-check script shape that resolves the binary, parses either version format, asserts the capability flags it needs, and reports which contract it will dispatch under; then the pinning story (two majors, no single pin), the side-by-side naming story (`opencode` + `opencode2`), and the irreducible gaps (F5's undocumented flag, F6's absent version signal, the live-run questions this iteration could not close).
