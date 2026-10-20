# Iteration 001 — A24: cli-opencode docs/flag drift vs installed OpenCode 1.19.3 and 2.0.32

## Focus

A24 cli-opencode docs and flag drift: where do `.skilled/skills/cli-external-orchestration/cli-opencode/` (SKILL.md, references, assets) and its dispatch code disagree with OpenCode 1.19.3 (`opencode`) and 2.0.32 (`opencode2`) as installed on this machine? Compare every documented flag, subcommand and dispatch shape against `opencode --help`, `opencode run --help`, `opencode2 --help` and `opencode2 run --help`, and the version detection in the deep-loop runtime (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`). Constraint honored throughout: help/version/list commands only — no OpenCode service or server started, stopped or restarted (PID 46220 untouched), no `opencode upgrade`, no edits outside this research packet.

## Actions Taken

1. Read the run config for identity (`lineage.sessionId` = `2026-10-19T19:09:07.051Z`) and the strategy's two key questions.
2. Probed the installed binaries: `opencode --version` → `1.19.3` (exit 0); `opencode --help`; `opencode2 --version` → `opencode v2.0.32` (exit 0); `opencode2 --help`; `opencode run -m opencode-go/deepseek-v4.1-flash --help </dev/null`; `opencode2 run -m opencode-go/deepseek-v4.1-flash --help </dev/null`. Also `opencode run --share -m ... --help </dev/null` as a `--share` acceptance probe. (Help-only; the `-m` pin and `</dev/null` satisfy the repo's cli-opencode hard rules; no message positional, so no session starts.)
3. Read the three primary doc surfaces end-to-end: `SKILL.md`, `references/cli-reference.md`, `references/install-and-versions.md`, and cross-checked every `--share` and agents-path claim site via rg across the skill tree.
4. Read the deep-loop resolver `opencode-version.cjs` (225 lines) and matched its resolution order and version pattern against the observed binary outputs.
5. Read `.github/workflows/opencode-dual-version.yml` and pulled CI evidence with `gh run list` / `gh run view` for the three post-merge runs on main (39294766387, 39299540911, 39308825187), including failed-log tails.
6. Checked on-disk reality for the agent-directory claims (both `.opencode/agents` and `.skilled/agents` exist) and the state-directory claim in cli-reference §8 (`~/.opencode/state` does not exist; `~/.local/share/opencode` does).

Probe-method note: `<bin> help run` does NOT surface run-specific flags — on v1.19.3 it prints top-level help (exit 1), on 2.0.32 it errors with `Unexpected positional argument: "run"` (exit 1). The docs' §9 drift procedure correctly says to use `opencode run --help`; anyone re-verifying must use that exact form.

## Findings

### Drift table

| # | Doc claim | Doc site | Installed reality (probe, 2026-10-19) | Severity | Status |
|---|-----------|----------|----------------------------------------|----------|--------|
| 1 | CI workflow green on main after the 2026-10-19 merge (topic premise) | `.github/workflows/opencode-dual-version.yml` | Three consecutive `failure` runs on main: 39294766387 (17:30Z), 39299540911 (18:04Z), 39308825187 (19:11Z). The 18:04 run died in the bun build step (`bun: command not found`, exit 127) — the battery never ran. The 19:11 run, after the bun PATH fix (6d7f6b8499), ran the battery to completion and still failed with `"exit": 1`; all three jobs (v1, v2, both) failed. Which battery leg failed is above the captured log tail. | P1 | confirmed |
| 2 | `--share` (with `--port`) is a v1 `run` flag for detached sessions | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:168] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:113] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:239] plus README.md:106–114, assets/prompt-templates.md:125/348/394, references/integration-patterns.md:31/128 | Installed 1.19.3 `run --help` lists NO `--share`. Passing `--share` yields no parse error (non-strict yargs; a hidden alias cannot be ruled out), so runtime effect is unverified under the help-only constraint. Per the skill's own drift procedure (cli-reference §9 step 1: diff `run --help` against §4), the flag is not on the documented surface it is claimed to be on. | P2 | confirmed (help surface) |
| 3 | Skill default model: `opencode-go/deepseek-v4.1-flash` at `max` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:158] | cli-reference states the v1 default as `opencode-go/deepseek-v4-flash` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:158] and repeats it in §5 [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:281]. Two different default ids stated as THE skill default — internal contradiction (v4 vs v4.1). | P2 | confirmed (internal) |
| 4 | Agent definitions load from `.opencode/agents/<slug>.md` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:196] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:23] | Sibling docs say `.skilled/agents/<slug>.md` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:35] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:289] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:171]. Both directories exist on disk; which path the installed binary actually reads is unverified under the help-only constraint. | P2 | confirmed (internal contradiction) |
| 5 | v2 `--log-level` "unverified on OpenCode 2.0.32" | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:107] | Installed 2.0.32 global flags list `--log-level` with choices `all\|trace\|debug\|info\|warn\|warning\|error\|fatal\|none`. The "unverified" note is stale; install-and-versions.md §6 documents the same enum correctly. | P3 | confirmed |
| 6 | SKILL.md's OpenCode 1 core-flag list is complete | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:168] | Installed 1.19.3 `run --help` also has `--attach`, `-p/--password`, `-u/--username` and `-i/--interactive`, none of which SKILL.md's list carries (cli-reference §4's table does include them — the summary line is the incomplete one). | P3 | confirmed |

### Positive controls (documented claims that MATCH installed reality — no drift)

- Version baselines: `opencode --version` → `1.19.3`; `opencode2 --version` → `opencode v2.0.32` — exactly the shapes SKILL.md §3 and install-and-versions §5 pin ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134]).
- v1-only flags: `--command` appears in installed 1.19.3 `run --help` and not in v2's ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:174]); `--variant`, `--dir`, `--port` present on v1, absent on v2 `run`; `--pure` present on v1 run, absent on v2.
- v2 surface: `#max` model-suffix shape, `--agent`, `--standalone`, `--server`, `-f`, `--title`, `--thinking`, `--format (default|json)` all present exactly as documented ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:239]).
- Deep-loop resolver `opencode-version.cjs` matches reality: per-directory `opencode2`-before-`opencode` PATH scan, `OPENCODE_BIN` override, and a `VERSION_PATTERN` that accepts both observed output shapes and maps major 1→v1, 2→v2 ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:202]).
- cli-reference §8 state-layout claim matches this machine: `~/.opencode/state` does not exist; `~/.local/share/opencode/` does.
- CI `both` job's expectations match installed reality verbatim: it asserts `opencode --version` == `1.19.3` and `opencode2 --version` == `opencode v2.0.32`, the exact strings the local binaries print.

### CI verdict (question 2, decisive half)

The workflow DOES test what it claims: it installs the two pinned packages (`opencode-ai@1.19.3`, `@opencode/cli@2.0.32`) into separate prefixes, asserts the two dispatch names resolve to two different absolute paths with the two expected version strings, and then runs the doctor battery (`opencode-version-battery.cjs`) per family and for both at once. It is red on main: the 19:11Z run executed the battery (legs report PASS in the visible tail, e.g. v2 family "57 skill entries visible") and still exited 1, with all three jobs failing. The failing leg is not identifiable from the captured tail.

## Questions Answered

- "Which cli-opencode docs, flags and subcommands drift from OpenCode 1.19.3 and 2.0.32 as installed?" — Answered: six drift/contradiction rows above (one P1 CI, two P2 flag/default drifts, one P2 path contradiction, two P3 staleness rows), plus five positive controls confirming the rest of the documented surface matches both installed binaries and the resolver.
- "Do the doctor battery and the dual-version CI workflow test what they claim, and did CI pass on main?" — Answered on both halves: the workflow tests exactly what its header claims (pinned dual install, name-distinctness, version-string identity, battery execution), and CI did NOT pass on main (three consecutive failures; latest runs the battery and exits 1). Local battery execution was out of scope by the no-server constraint; the battery script's claim set was verified by reading it and its CI wiring.

## Questions Remaining

- Which specific battery leg failed in run 39308825187 (the JSON artifact `battery-*` from that run, or the fuller failed-log body, names it), and is the same leg failing locally for the same reason?
- Does v1 1.19.3 accept `--share` functionally at runtime (hidden alias), or is the documented `--share` detached-session flow simply broken against the installed baseline? Requires a runtime probe outside this iteration's help-only constraint.
- Which agent directory (`.opencode/agents/` vs `.skilled/agents/`) does the installed binary actually read — resolvable with `opencode agent list` / `opencode debug agent <slug>` in a later iteration that permits non-help read-only subcommands.

## Next Focus

Pull run 39308825187's battery JSON artifacts (upload steps are `if: always()`), identify the failing leg(s), and decide whether the failure is a battery-script expectation drift (the same class as rows 2–6 above) or a real regression in the plugin/skill surface on one or both majors. If the leg evidence is insufficient, verify the same battery locally is NOT required — instead re-derive the leg's expectation from `opencode-version-battery.cjs` and check that expectation against the installed binaries' help surfaces.

## SCOPE VIOLATIONS

None. All writes stayed inside this research packet; every researched path was read-only; no OpenCode service, server or upgrade was touched.
