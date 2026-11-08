# Iteration 11 — Doctor, git, CI and runtime layer

Segment 1, iteration 11 of 11. Last iteration; the focus corrected the two carried
corrections, then took one tested claim from each of v4.0.0.11, v4.0.0.12 and v4.0.0.14.

## Focus

1. Correct `f-iter010-007`: count real symlinks per runtime folder and say which
   mirrored kinds are copies versus links.
2. Correct `f-iter010-002`: reproduce the exact command `doctor-install.yaml:59` builds.
3. One tested claim from each of v4.0.0.11, v4.0.0.12 and v4.0.0.14.

## Actions Taken

1. `find <runtime> -type l | wc -l` per runtime, then per kind (`agents`, `commands`,
   `prompts`, `skills`) at `-maxdepth 1`, plus `readlink` on `.cursor/agents/*` and
   `.opencode/commands/*`, and a byte compare of `.claude/agents/*` against `.skilled/agents/*`.
2. Ran the install workflow's own inspect command verbatim against an empty target under
   `/tmp/iter11-root`, three variants, capturing the real exit code (not `head`'s).
3. Ran `git-setup-check.cjs` unmodified in this checkout; read `statusOf`/`renderHuman`,
   the `CHECKS` array and the `--tool` fallback. Ran `advisor_status` with the exact flags
   `doctor-setup.yaml` builds. Counted `*.md` doctor commands. Read `validate.sh` and the
   two helper files the fsmonitor guard traces, plus the guard itself.
4. Path-limited `git log --since/--until` over the release windows for v4.0.0.11,
   v4.0.0.12 and v4.0.0.14 (tag dates 2026-10-17, 2026-10-17, 2026-10-25).

## Findings

### F11-01 — Mirror link shape is per-kind *and* per-runtime, and `.cursor/agents` chains to the Claude mirror, not to the source
**Type:** 1 drift (duplication) · **Severity:** P1 · **Release:** present at v4.0.2.0 (HEAD, not introduced by one release) · **Confidence:** high (all counts measured)

Measured at HEAD: `.claude` 79 links / 109 entries, `.codex` 26 / 90, `.cursor` 81 / 92,
`.devin` 41 / 61, `.dsh` 79 / 156, `.opencode` 23 / 4024, `.pi` 58 / 50112. Per kind:

| runtime | agents | commands | prompts | skills |
|---|---|---|---|---|
| `.claude` | 13 entries, **0 links** (copies) | 7 / 1 link | — | — |
| `.codex` | 11 / 0 | — | 45 / 0 | — |
| `.cursor` | 11 / **11 links** | 46 / 45 | — | — |
| `.devin` | 11 / 0 | — | — | — |
| `.dsh` | 11 / 0 | — | 45 / 0 | 55 / 55 |
| `.opencode` | — | 10 / 9 | — | — |
| `.pi` | 11 / 0 | — | 46 / 0 | — |

So the same kind is a link in one runtime and a copy in five, and `agents` is a copy in
every runtime but Cursor. The link shape is not a property of the kind.

The sharp half: `.cursor/agents/*` resolves to `../../.claude/agents/*`, not to
`.skilled/agents/*`. `[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1791]`
is the engine's `check` branch, which reports entry status per manifest row; a manifest
row that models "cursor agents link to the claude mirror" is not what the footprint
implies. By contrast `.opencode/commands/*` resolves to `../../.skilled/commands/*`,
the real source. Consequences: (a) deleting `.claude/` dangles 11 Cursor agent links with
no source-level owner; (b) a drift check that compares `.claude/agents` against
`.skilled/agents` cannot see that `.cursor` follows `.claude`, because the cursor hop is a
link while the claude hop is a copy; (c) the copies are *legitimately* different — the
byte compare showed Claude `tools: Read, Bash, Grep, Glob` where the source carries an
OpenCode `permission:` block, so "copy is stale" is **not** the claim and must not be
used as one.

Orphan: `.claude/agents` holds 13 files against 12 in `.skilled/agents`; `Explore.md`
exists only in the mirror, so a regenerate-from-source pass would leave it behind and a
delete-and-relink pass would drop it.

**Verify:**
`for f in .cursor/agents/*; do readlink "$f"; done | sed 's#/[^/]*$##' | sort -u`
`find .claude/agents -maxdepth 1 -type l | wc -l` → `0`
`ls .claude/agents | wc -l` → `13`; `ls .skilled/agents | wc -l` → `12`

### F11-02 — `symlink-engine.cjs check` exits 0 in every state, including a target with nothing installed
**Type:** 4 improvement (exit-code contract) · **Severity:** P2 · **Release:** v4.0.2.0 surface · **Confidence:** high (three runs, real exit codes)

`[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1801]` returns `0`
unconditionally after `emit(report, ...)`, with no reference to `report` contents. Reproduced
the command named at `[SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:59]`:

```
node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root /tmp/iter11-root          → EXIT 0
  missing          core .skilled
...same + --runtimes claude,opencode  → EXIT 0 (adds claude .claude, claude .mcp.json, opencode .opencode)
...same + --link-instructions         → EXIT 0 (adds instructions AGENTS.md, CLAUDE.md, REPO RULES.md)
```

Nothing in the doctor surface can distinguish "all linked" from "nothing installed" without
parsing text: `[SOURCE: .skilled/commands/doctor/_routes.yaml:553]` and
`[SOURCE: .skilled/commands/doctor/assets/doctor-symlink-check.yaml:57]` both invoke `check`
with no exit-code clause, and `[SOURCE: .skilled/commands/doctor/_routes.yaml:610]` documents a
narrower flag set than `doctor-install.yaml:59`. The three documents already disagree on the
flag surface (`--include` and `--json` present in one, absent in two), so the read-only proof
step has no single owner of its contract. What breaks if the exit code is left as-is: nothing
today, because every caller renders lines; what breaks if someone adds "exit 0 means installed"
the way `doctor-install.yaml:59` does for its two build probes is a green install over an
empty target.

**Verify:** run the three commands above; `echo $?` each time. Compare
`grep -n "check --root" .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-*.yaml`.

### F11-03 — A fully healthy sk-git setup reads as `STATUS=DEGRADED`, exit 3, on six of the seven runtimes
**Type:** 5 UX (operator and AI user) · **Severity:** P2 · **Release:** v4.0.0.11 · **Confidence:** high (repro ran)

Ran `node .skilled/commands/doctor/scripts/git-setup-check.cjs` unmodified in this checkout
from a Pi session. Nine rows PASS, `ai-tool-hooks` is UNKNOWN, and the battery ends:

```
UNKNOWN  ai-tool-hooks
      source: eight adapter files, no active tool detected
      no active AI tool detected: pass --tool <claude|codex|devin|cursor|opencode|pi|dsh>
      claude: registered (.claude/settings.json)
      ... six more, all registered
STATUS=DEGRADED degraded=0 skipped=0 unknown=1
EXIT=3
```

The cause is at `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1466]`: the
active tool is `explicit ? '--tool' : 'CLAUDECODE'`. Exactly one runtime is auto-detected; the
other six fall to the message at
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1561]`. The v4.0.0.11 note claims
"It works in all seven AI tools" and "A half-working setup no longer reads as healthy"
`[SOURCE: .skilled/changelog/skilled/v4.0.0.11.md:21]` — the inverse now holds too: a
*wholly* healthy setup reads as not-healthy wherever `CLAUDECODE` is unset.

Two aggravations, both read:
- `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1624]` prints `repair:` only
  for `FAIL` and `DEGRADED`, and `statusOf` at
  `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1611]` ranks `FAIL` above
  `UNKNOWN`/`DEGRADED` — so the row that produced exit 3 is the one row with no repair line.
  The nine passing rows also never say why they passed. What breaks if the UNKNOWN repair line
  is added: nothing; it is one condition.
- `/doctor:setup` compensates by passing `--tool` explicitly
  `[SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54]`, while `/doctor:git setup`
  only instructs the model to add it
  `[SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:48]` and documents the
  UNKNOWN outcome at `[SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:41]`.
  Two routes to the same battery disagree on whether the flag is supplied or requested.

**Verify:** `node .skilled/commands/doctor/scripts/git-setup-check.cjs; echo $?` from any
non-Claude runtime (expect 3 in a green repo); re-run with
`--tool=pi` and expect `STATUS=OK` and exit 0.

### F11-04 — The fsmonitor guard accepts a constant *name*, so a rename satisfies it without disabling anything
**Type:** 4 improvement (guard strength) · **Severity:** P2 · **Release:** v4.0.0.14 · **Confidence:** high (regex read; coverage measured)

The v4.0.0.14 claim is true today: `[SOURCE: .skilled/changelog/skilled/v4.0.0.14.md:111]`
says every validator git call turns the monitor off, and measured coverage is complete —
`cite-drift-scan.mjs` has 5 `spawnSync('git'` calls against 6 `GIT_NO_FSMONITOR` mentions
(1 declaration + 5 uses) `[SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:181]`,
and `check-source-tags-helper.mjs` has 3 against 4
`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53]`.
`validate.sh` itself contains no git invocation at all — the claim's subject is the helpers,
not the entry point.

The guard that will keep that true is weaker than it reads. At
`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:22]`:

```
const FSMONITOR_OFF = /core\.fsmonitor=false|FSMONITOR|GIT_CONFIG_/u;
```

`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:120]`
tests it against the whole call text, so the *identifier* `GIT_NO_FSMONITOR` satisfies the
guard even if it were redefined as `[]`; the alternation on a bare `FSMONITOR` means any
constant, comment-adjacent token or option name containing the word passes. The shell scanner
at `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:132]`
requires the literal `core.fsmonitor=false` on the same line, so the code scanner and the
shell scanner do not agree on what "off" means. What breaks if the alternation is narrowed to
`/core\.fsmonitor=false|FSMONITOR_OFF|GIT_CONFIG_/`: the current five and three call sites
still match on the constant name, and a future `const GIT_NO_FSMONITOR = []` fails loudly.

**Verify:** `grep -n FSMONITOR_OFF .skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts`;
`npx vitest run cli/tests/validator-git-fsmonitor.vitest.ts` in the CLI package.

## Questions Answered

**Q9 (mirror half).** Which mirror files duplicate another, and what breaks if each is removed:
measured above. Removing `.claude/agents` breaks 11 Cursor agent links (F11-01). `Explore.md`
in `.claude/agents` has no source, so it is not regenerable. `symlink-engine.cjs check` cannot
report any of this as failure (F11-02), so the duplication has no detector today. The
hooks/workflow half stays open.

**Release claims tested this iteration (all three confirmed, one with a caveat):**
- v4.0.0.11 "eleven read-only checks" `[SOURCE: .skilled/changelog/skilled/v4.0.0.11.md:21]` —
  `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1571]` opens a `CHECKS` array
  with exactly 11 entries (`install, hooks, trust, gates, standards, allowlist, worktrees,
  commit-id, advisory-rules, suppression, ai-tool-hooks`). Confirmed. The DRIFT is in the
  *verdict*, not the count (F11-03).
- v4.0.0.12 "lists all 17 doctor commands" `[SOURCE: .skilled/changelog/skilled/v4.0.0.12.md:22]`
  — `ls .skilled/commands/doctor/*.md | wc -l` → 17. The "five read-only setup checks" are the
  five legs at `[SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54]` and its
  neighbours (sk-code, sk-git, trigger-index, runtime-mirrors, advisor). Confirmed, and the
  advisor leg's fixed invocation now works: ran
  `advisor_status --workspace-root "$PWD" --format json --timeout-ms 500 --warm-only` and got
  exit 0 with `data.freshness: "live"`, `skillCount: 16`, `indexStaleness.state: "fresh"`.
- v4.0.0.14 "every git call the validator makes now turns the monitor off"
  `[SOURCE: .skilled/changelog/skilled/v4.0.0.14.md:111]` — confirmed by the coverage counts in
  F11-04, with the caveat that the statement's grammatical subject (`validate.sh`'s calls) is
  the helper scripts; `validate.sh` makes none.

## Questions Remaining

- **Q4 (hooks half)** — the fail-open repro and the v4.0.0.15/v4.0.0.16 worktree behaviours
  (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`,
  `SPECKIT_WORKTREE_BASE`) still need a scratch repo, outside the read-only bound.
- **Q9 (hooks and workflows half)** — 11 checks now measured, but which *hooks* and *workflow
  files* lack a caller is untouched.
- **Q10** — doctor-output friction is now measured on five engines; the hook-rejection and
  CI-failure halves remain unmeasured.
- `Commit-Id: 0000000` plus a valid id; `pre-push` without a `Commit-Id`; the 20 s
  `BLOCKED [gate:git-timeout]`. Open since iteration 2, all three need writes.
- Whether Devin's 16,384-byte rule cut truncates a binding rule; the concatenated size was
  never measured.
- Whether the `.github/workflows` set matches the v4.0.0.16 CI note, and whether any workflow
  reads a group variable its README row does not name.

## Next Focus

The run is at its last iteration. What the next pass should take, in order:
1. F11-01's manifest question — does `symlink-engine.cjs` model `cursor agents → claude agents`
   as an intended row, or is it an accident of the sync order? A `check --json` on this
   checkout answers it without any write.
2. F11-03's asymmetry — should the battery detect `PI_*`/`OPENCODE`/`CODEX` the way it detects
   `CLAUDECODE`, or should `UNKNOWN` stop outranking `OK` in the exit code?
3. F11-04 — narrow the alternation and see whether the five and three call sites still pass.

## SCOPE VIOLATIONS

None. All writes went to this run's `iterations/` and `deltas/` paths plus `/tmp`. No
repository file, hook, workflow or mirror was created, edited, renamed or deleted; the
one mutating-looking command (`symlink-engine.cjs check`) was the `check` subcommand against
an empty `/tmp` target, and the git commands were `log`/`show`/`diff` only.
