---
title: "Iteration 1 — deepseek-01: The key gate as code: probes, the package collision and every failure path"
trigger_phrases: []
---

# Iteration 1 — deepseek-01: The key gate as code

## Focus

Angle **deepseek-01** (W1): *The key gate as code: probes, the package collision and every failure path.* Maps to RQ1, RQ5 and RQ7; answers angle questions 1 to 5. All claims below were opened this iteration; nothing is carried from BASE without saying so. No round-2 sibling file was read (W1).

## Actions Taken

1. Read the Python `jev-cli` 0.6.2 transport contract and its reference: `.skilled/skills/cli-jev/cli-usage/SKILL.md` and `references/cli-reference.md`.
2. Read the Python CLI source at `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`: credential resolution (`:90-109`), `auth` handling (`:396-422`), the version argument (`:327`) and the exit taxonomy (`:435-443`).
3. Read the npm `jevctl` 0.2.3 vendored sources: `src/versionCheck.ts`, `src/errors.ts`, `src/credentials.ts`, `src/cli.ts` (`:89`, `:100-210`) and `src/commands/auth.ts`, plus its `docs/auth.md`.
4. Read the D5 gate and failure-path requirements in `../002-advisor-jev-tiebreak-arm/spec.md` (REQ-002, REQ-003, REQ-010, Edge Cases) and `../003-goal-verifier-jev-shadow/spec.md` (REQ-003, REQ-009, REQ-011).
5. Derived the exit-code matrix for both packages and the per-arm handling table from those sources; no command was run against either package.
6. Named each idea `N-deepseek-01-<k>`; one candidate was dropped with its reason.

## Findings

**F1 (new). The Python `jev-cli` 0.6.2 version string is a hardcoded literal, not the installed package's metadata.** `root.add_argument("--version", action="version", version="jev 0.6.2")` at `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:327`. The D5 check 2 (`jev --version` printing exactly `jev 0.6.2`) therefore tests a string the file self-declares; a vendored copy whose literal was never bumped passes while its behavior may differ, and a stale install whose literal says `0.6.2` passes regardless of the wheel's real version. What would confirm the installed identity: `importlib.metadata.version("jev-cli")` at build time, or reproducing the check against a known secondary build. [SOURCE: jev-cli-main/src/jev_cli/__init__.py:327]

**F2 (new). The npm `jevctl` 0.2.3 prints a bare semver.** Commander's `.version(version, "-V, --version", ...)` at `context/external repo's/jev-cli-main/src/cli.ts:89` prints the `package.json` version (`0.2.3`), and the `version` subcommand writes `${version}\n` at `:139-144`. So when the npm package shadows the Python one on PATH, check 2 sees `0.2.3`, not `jev 0.6.2`, and the refusal fires as intended today. The check discriminates the two shipped packages by their print format, not by binary identity; a wrapper that prints `jev 0.6.2` passes it (see N-deepseek-01-1). [SOURCE: external repo's/jev-cli-main/src/cli.ts:89, :139-144]

**F3 (new; answers angle question 1's network half). The npm `jevctl` `--version` makes no network call, and its daily update check is skipped for three commands.** `warnIfOutdated` at `src/cli.ts:168-183` returns early on `JEV_NO_UPDATE_CHECK=1` (`:169`), on `--quiet`/`-q` (`:170`), and when the first non-flag token is `update`, `version` or `help` (`:166`, `:171-172`); it only then calls `checkForUpdate`, whose `fetchLatest` is a live npm query (`:174`). The bare `-V/--version` is commander's built-in version action, which prints during `parseAsync` and exits before line 200 runs. For any other npm command the check hits the cache at `JEV_VERSION_CACHE` or the config dir and goes to the network at most once per 24 h (`src/versionCheck.ts:9`, `:16-17`, `:50-66`). The Python package has no update check at all: its `--version` is argparse-only. [SOURCE: external repo's/jev-cli-main/src/cli.ts:166-183, :200; external repo's/jev-cli-main/src/versionCheck.ts:9, :16-17, :50-66]

**F4 (new; answers angle question 4). The Python `jev-cli` 0.6.2 resolves `TYPESAFE_API_KEY` from the environment first, and `auth status` does not tell you that an environment key is what satisfied it.** `api_key()` returns `os.environ.get(config["key_env"])` before touching the store (`__init__.py:90-93`; `"key_env": "TYPESAFE_API_KEY"` at `:21`), and the fallback store is `<XDG_CONFIG_HOME or ~/.config>/jev-cli/credentials.json` (`:41`). The `auth status` branch calls `api_key()` and prints `{"ok": true, "stored": true, "store": "<CREDENTIALS_FILE path>"}` (`:419-421`) — the `store` field names the credentials file path even when the key came from the environment and that file may not exist. So a key placed in a settings `env` block, or exported in a shell profile, passes D5 check 3 "by accident" from the operator's view, and the Python status line cannot show it. The npm package's status surface is honest about this: it reports a per-provider `source` of `env`, `keychain`, `file` or `none` (`src/commands/auth.ts:100-106`, `docs/auth.md` "Resolution order" and table). [SOURCE: jev-cli-main/src/jev_cli/__init__.py:21, :41, :90-93, :419-421; external repo's/jev-cli-main/src/commands/auth.ts:100-127; external repo's/jev-cli-main/docs/auth.md]

**F5 (new). Both packages resolve the same environment variable names, and the npm `jevctl` documentation recommends exactly the placement round-1 row 43 forbids.** The Python package's official provider reads `TYPESAFE_API_KEY` (`__init__.py:21`); the npm package's `ENV_VAR` map is `{typesafe: "TYPESAFE_API_KEY", openrouter: "OPENROUTER_API_KEY"}` (`src/credentials.ts:13-16`). Its `docs/auth.md` closes with: the Claude Code compaction hook cannot read the keychain, so "put the key in `~/.claude/settings.json` under `env`, or use the plugin's sensitive `apiKey` option". In this repository `.claude/settings.json` is tracked (BASE row 43, `git ls-files`), so following the npm vendor's recommendation makes the key a committed secret — and, because the variable name is shared, the same committed value satisfies D5 check 3 for the Python side (F4). This upgrades BASE's third-party-blog evidence (blog `:64-68`) to the npm package's own vendored documentation, and it ties the two facts — shared variable name, tracked file — into one failure path: a gate pass that proves nothing about operator intent. [SOURCE: jev-cli-main/src/jev_cli/__init__.py:21; external repo's/jev-cli-main/src/credentials.ts:13-16, `docs/auth.md`; BASE row 43]

**F6 (confirms BASE with new evidence; answers angle question 3). Two exit-code taxonomies that disagree in exactly the ways the gate must survive.**

| Exit | Python `jev-cli` 0.6.2 | npm `jevctl` 0.2.3 |
|---|---|---|
| 0 | A judgment printed | Command completed, no `--fail-on` condition matched |
| 1 | Unexpected/unclassified API response or bad payload shape | Usage, configuration, input **or transport** error (`errors.ts:2-9`) — merged classes; also `auth status` with no key (`auth.ts:127`) |
| 2 | Usage error: no quota spent | A `--fail-on` judgment condition matched (`errors.ts:8`) |
| 3 | Credential missing, empty, invalid, or HTTP 401/403 | (not a distinct class) |
| 4 | Retryable transport: 429, 5xx, connection, timeout | (not a distinct class) |
| 130 | KeyboardInterrupt | (not a distinct class) |

The Python error object is one JSON line on **stderr** with stdout empty (`cli-reference.md:157-159`); the npm CLI writes `jev: <message>` on stderr (`src/cli.ts:192`, `:195`). Any arm that ever read npm exit codes would misread exit 2 (a judgment result) as the Python usage error and exit 1 (its transport class) as unresumable; the version check is what keeps that from happening. [SOURCE: cli-reference.md:146-159; jev-cli-main/src/jev_cli/__init__.py:435-443; external repo's/jev-cli-main/src/errors.ts:2-9, src/commands/auth.ts:127, src/cli.ts:192-196]

**F7 (new; answers angle question 1's cost half). Gate cost per check, from code paths only.** Check 1 `command -v jev` is a shell builtin, no spawn. Check 2 is one process spawn: for the Python package, interpreter start plus argparse, no network and no quota (`:327`; the module defines constants at import and calls nothing); for the npm package, one node start, no fetch (F3). Check 3 is one spawn of `auth status`: the Python branch reads the env and at most one credentials file and never calls the API (`:419-421`); quota is zero for all three checks in both packages — only `auth test` builds a request and calls `call(...)` (`:403-418`), which BASE already marks as billed. The npm package's store resolution can additionally spawn helper processes (`which security` and `security find-generic-password` on macOS, `credentials.ts:73-84`, `:134-148`), but its check 2 refuses it before check 3 runs. Spawn **latency** is UNKNOWN and not measured here; the only recorded number is the round-1 host note that `auth status` exits without spending quota (002 `spec.md` Edge Cases, host-verified). [SOURCE: jev-cli-main/src/jev_cli/__init__.py:327, :396-421; external repo's/jev-cli-main/src/credentials.ts:73-84, :134-148; 002 spec.md REQ-002, Edge Cases]

**F8 (new; answers angle question 5). Gate timing and mid-run rejection, per arm, from the phase docs.** Offline scripts run the gate once per run, before any call, in the order check 1 → check 2 → check 3 (002 REQ-002; 003 REQ-003). The plugin mode runs it once per session (003 REQ-011). A mid-run rejection is handled per arm: R1 stops the arm on exit 3 and reports finished rows as `partial`, stops on exit 2, retries exit 4 once then marks the row `unmeasured`, and stops as `interrupted` on exit 130 (002 REQ-010); the R2 plugin form disables the shadow for the rest of the session on exit 3 with one line, and skips that one record on exit 4, a timeout or a malformed answer (003 REQ-011). No path writes a default score. [SOURCE: 002 spec.md REQ-002, REQ-010; 003 spec.md REQ-003, REQ-011]

**F9 (new; a recorded gap). The R19 and R20 Jev arms have no per-exit-code handling written anywhere.** Their phase folders do not exist yet, and neither BASE's records nor any existing spec text says what the R19 deletion arm or the R20 lint arm do on exit 1, 2, 3 or 4; only the shared skip line (`jev arm skipped: <check>`) and "no default score" are fixed. Since the Python matrix (F6) assigns four non-success codes and the R1 contract (F8) already fixes the semantics, the two future arms should inherit that table by reference rather than re-derive it. This is a documentation gap for the synthesis's build-phase section, not a code defect. [SOURCE: BASE section 11 R19 and R20 records; BASE section 9 "Failure modes and no key"; 002 spec.md REQ-010]

**F10 (new). The version gate cannot be satisfied by the npm package today, but it also cannot distinguish an honest Python install from a shell wrapper that prints the string.** The three probes are ordered precisely so a wrong package never reaches check 3, and the skip/refuse lines are specified with a proposed addition to print the found version and binary path (BASE section 9, from seat-002). What the probes do not do is assert the resolved path (`command -v jev` output) against anything. Confirmed from code: no arm code exists yet, so this is a design note on 002 REQ-002/003 REQ-003, not a defect in shipped behavior. [SOURCE: 002 spec.md REQ-002; 003 spec.md REQ-003; BASE section 9 D5]

**F11 (confirms BASE with new evidence). The Python status surface never prints the key, and the npm surface prints a masked key.** Python `auth status` prints `stored` and a `store` path only (`:421`); the npm `auth status` builds rows with a `mask(value)` key column (`src/commands/auth.ts:102-106`, `docs/auth.md` example `apik…64`). Neither leaks the secret; both leak its existence and, for npm, its first characters. [SOURCE: jev-cli-main/src/jev_cli/__init__.py:421; external repo's/jev-cli-main/src/commands/auth.ts:102-106]

## Per-Idea Records

### Idea 1: The three-check D5 gate as one shared contract across four arms

- **Idea:** The ordered gate (`command -v jev` → `jev --version` exactly `jev 0.6.2` → `jev auth status` exit 0), with per-feature switches and no default score. Type: process contract, not a judgment.
- **Builds on:** BASE section 9 D5; 002 REQ-002/REQ-003; 003 REQ-003; angle questions 1 to 5.
- **Value:** The operator's consent surface for every billed call; the reason no feature is live by accident.
- **Seam:** gate text in `../002-advisor-jev-tiebreak-arm/spec.md` REQ-002 (`:110-118`) and `../003-goal-verifier-jev-shadow/spec.md` REQ-003; Python version literal at `jev-cli-main/src/jev_cli/__init__.py:327`; Python key resolution at `:90-93`.
- **Metric, baseline, harness:** Correctness is checkable by a stub `jev` on PATH that logs invocations (002 REQ-002 boundary: log stays empty without `--jev`; refuse line on wrong version). No harness id; it is a contract test, H-gap "gate refusal matrix".
- **Cost, latency, privacy:** One shell builtin plus two spawns per run or session; no network; no quota; nothing leaves the machine. Latency UNKNOWN (F7).
- **Key gate and no-key behavior:** This is the gate itself. On failure the arms print one line naming the failed check; with no key they behave exactly as today.
- **Rough LOC:** Zero as a shared helper (row 27 keeps it inline); the gate is ~15 lines inside each arm's script.
- **Verdict:** **build-now (it is already specified; the assessment is that it holds).** Its weak point is check 3's inability to report the key's origin (F4) and check 2's string-not-identity nature (F1/F10), both addressed by the two ideas below.
- **Confidence:** Confirmed from code for every check's behavior, both packages (F1 to F8); latency inferred UNKNOWN.

### N-deepseek-01-1: One gate-identity line: print the accepted version string and resolved path once, and the found version plus path on refusal

- **Idea:** `choice`-free design change to 002 REQ-002/003 REQ-003: on refusal, print the found version line and `command -v jev` output (BASE already proposes this, seat-002); on acceptance, print one header line once per run: the version string and resolved path, so any log records which binary ran. Type: contract line, no judgment.
- **Builds on:** Angle question 2; BASE section 9 ("the line also prints the version line it found and the binary's path").
- **Value:** A wrapper or mis-PATH install becomes visible in the run log instead of passing silently; the operator can fix PATH from the report alone.
- **Seam:** 002 `spec.md` REQ-002 acceptance text; the future `score-jev-tiebreak.mjs` (proposed) gate block; the same block in R19/R20's scripts.
- **Metric, baseline, harness:** Baseline: today's REQ-002 text prints nothing on success. Metric: the header line appears exactly once per keyed run — a one-line assertion in the stub-`jev` test.
- **Cost, latency, privacy:** Zero additional spawns (the path comes from the check-1 call the gate already makes); no egress.
- **Key gate and no-key behavior:** The header prints only after check 2 passes; with no key, nothing is added to the default output, so the no-key run stays byte-identical.
- **Rough LOC:** 1 line per arm script plus 1 in the skip-line table.
- **Verdict:** **next.** It is a doc amendment to a Planned phase, cheap and testable; it does not justify reopening a deadline decision.
- **Confidence:** Confirmed that `command -v` prints the path; the exact line format is proposed, not chosen.

### N-deepseek-01-2: One key-origin line: report whether `TYPESAFE_API_KEY` is present in the environment before the feature announces its keyed mode

- **Idea:** Because the Python `auth status` cannot say whether the key came from the env or the store (F4), the arm's announcement line (required before the first billed call by 002 REQ-011 / 003 REQ-007) adds one token: `key source: environment` vs `key source: credential store`, decided by a shell test (`[ -n "$TYPESAFE_API_KEY" ]`) before spawning `jev`. Type: contract line.
- **Builds on:** Angle question 4; BASE row 43; 002 REQ-011.
- **Value:** The operator learns that a session export or a settings-`env` key — the row-43 path — is what passes the gate, which the Python status line actively obscures. It does not block anything; it makes the pass visible.
- **Seam:** announcement block of 002 REQ-011; 003 REQ-007.
- **Metric, baseline, harness:** Baseline: announcement names payload class and call count only. Metric: with `TYPESAFE_API_KEY` exported, the line says environment; without, credential store — two fixture cases.
- **Cost, latency, privacy:** One shell test, no spawn, no egress; prints no key material.
- **Key gate and no-key behavior:** Runs only inside the keyed path after the three checks; the unkeyed path never prints it.
- **Rough LOC:** 1 to 3 lines per arm script.
- **Verdict:** **next.** Cheap and honest; but if the phase owners rule the announcement already carries enough, it drops with no loss to the gate.
- **Confidence:** Confirmed the Python status field cannot distinguish sources; the env test's correctness is trivial shell semantics.

### N-deepseek-01-3: One per-exit-code handling table for the R19 and R20 arms, inherited by reference from R1's

- **Idea:** Close F9 by writing the four-code handling table (0/1/2/3/4, plus malformed answer) into the 005 and 006 phase docs as an explicit reference to 002 REQ-010's semantics, before either arm is built. Type: documentation of a contract.
- **Builds on:** Angle question 3; 002 REQ-010; BASE section 9 failure modes.
- **Value:** Two future scripts cannot invent divergent semantics for the same exit codes; the skip-line table stays one form.
- **Seam:** 002 `spec.md` REQ-010 as the normative table; 005/006 specs when written.
- **Metric, baseline, harness:** Baseline: no text exists (F9). Metric: each new arm's spec carries the table or a reference; a grep for the four codes in 005/006 returns it.
- **Cost, latency, privacy:** Zero.
- **Key gate and no-key behavior:** The table is exactly the keyed path's failure behavior; the unkeyed path is unchanged.
- **Rough LOC:** 0 (documentation).
- **Verdict:** **next.** It is part of what makes the R19/R20 arms buildable without new research.
- **Confidence:** Confirmed the gap from the absence of both phase folders and any table text.

### Dropped: deriving the key's origin by parsing the Python `store` field

- **Idea:** no idea survives: `store` always prints the credentials-file path (`:421`) whether or not the key came from the environment, so no parse can recover the origin. Dropped in favor of N-deepseek-01-2.
- **Verdict:** **drop.** [SOURCE: jev-cli-main/src/jev_cli/__init__.py:419-421]

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| The Python version string is a hardcoded literal, so check 2 is self-attesting | new | `__init__.py:327` |
| The npm package prints a bare semver (`0.2.3`), and its refusal follows from format, not identity | new | npm `src/cli.ts:89`, `:139-144` |
| The npm `--version` path performs no network fetch; the daily update check is skipped for version/update/help and by `JEV_NO_UPDATE_CHECK=1` | new | npm `src/cli.ts:166-183`, `src/versionCheck.ts:9-66` |
| The Python `auth status` passes on an env-var key and mislabels it as store-resolved | new | `__init__.py:90-93`, `:419-421` |
| Both packages share `TYPESAFE_API_KEY`, and the npm docs recommend placing it in `~/.claude/settings.json` `env` — the row-43 placement | new (confirms BASE row 43's conclusion from the npm package's own docs rather than the blog) | npm `docs/auth.md`, `src/credentials.ts:13-16`; BASE row 43 |
| Exit matrix: Python 0/1/2/3/4/130 vs npm 0/1/2, with npm `auth status` exit 1 on none | confirms BASE's Python matrix with new evidence; npm matrix new | `cli-reference.md:146-159`; `__init__.py:435-443`; npm `errors.ts:2-9`, `auth.ts:127` |
| Gate cost: builtin + two spawns, zero network, zero quota; exact paths cited | confirms BASE ("a shell builtin plus two Python spawns") with per-check code evidence | F7 sources |
| Timing: once per run; once per session for the plugin; exit 3 mid-run stops R1 and reports `partial` | confirms BASE with new evidence (the `partial` word and the session cache) | 002 REQ-002/010; 003 REQ-003/011 |
| R19/R20 arms have no per-code table anywhere | new | F9 sources |
| Python status never prints the key; npm masks it | confirms BASE with new evidence | `:421`; npm `auth.ts:102-106` |

## Sibling check

Independent: no round-2 sibling file read.

## Hand-off

- The W2 read of the sibling lineages should push past N-deepseek-01-1 and -2: check whether swe-04's skip-line table already includes the identity/origin lines, and whether grok contests printing the path.
- Iteration 2 picks up the compaction seams (angle deepseek-02): trace the `session.compact` budget text to its source and read the record shape after a compact boundary — do not reopen the gate here.
- If any sibling cites `auth status` behavior, verify which package they mean before accepting it; the exit-1 vs exit-3 split is the trap.
