# Iteration 12 — Bug repros, and the v4.0.0.12 claim tested

Segment 1, iteration 12 of 16. The four carried P1 findings were each given the smallest
repro that could be run from outside the repository, and the v4.0.0.12 doctor/sk-git diff
was read and its claim tested end to end in a scratch repo under `/tmp`.

## Focus

1. Repro, run and verdict for the four carried P1s: the install/hook checklist fail-open,
   `symlink-engine check` always exit 0, the `/doctor:runtime-mirrors` existence-only
   battery, and `sk-git` CI running one of five suites.
2. `git diff v4.0.0.11..v4.0.0.12 -- .skilled/commands/doctor .skilled/skills/sk-git`, then
   test its `/doctor:git setup follows export default plugin` claim.

## Actions Taken

1. Built a bare scratch repo `/tmp/iter12-fix` (git init, one `.pi` adapter, no `.skilled/`)
   and ran the battery unmodified: `node .skilled/commands/doctor/scripts/git-setup-check.cjs
   --repo /tmp/iter12-fix --tool pi --json`, printing every row and the process exit code.
2. Resolved the inspected repository's hooks folder with
   `git -C /tmp/iter12-fix rev-parse --git-path hooks` and listed `/tmp/iter12-fix/.git/hooks`.
3. Read `checkInstall` and `checkHooks` in full, the `TOOL_FILES`/`TOOL_HOOK_EVENTS` tables,
   `adapterExportsBinding` and its new `findTopLevelBindingDeclaration` helper added by
   v4.0.0.12, plus the added test helpers.
4. Ran `symlink-engine.cjs check --root /tmp/iter12-root` (empty target) and read the exit
   code, not the piped one.
5. Counted the battery's row types and resolved every row path; counted the sk-git test
   suites against the workflow that is supposed to run them.
6. Path-limited `git diff --stat v4.0.0.11..v4.0.0.12` and the full diff of that range for
   the two cluster paths, then read `.skilled/changelog/skilled/v4.0.0.12.md`.

## Findings

### F12-01 — CONFIRMED P1: `hooks` PASSes for a repository with no hooks, because the operator's global `core.hooksPath` answers for it
**Type:** 3 bug · **Severity:** P1 · **Release:** v4.0.0.11 · **Confidence:** high (repro ran)

`checkHooks` opens at `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:354]`,
takes its hook *names* from the battery's own source folder
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:373]`, and then resolves the
*target* folder through git. On this machine that resolution leaves the inspected repository
entirely:

```
$ node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo /tmp/iter12-fix --tool pi --json
PASS     install        []
PASS     hooks          []
SKIP     trust          ["untrusted: hooks from another checkout skip this clone's own scripts"]
...
STATUS DEGRADED

$ ls /tmp/iter12-fix/.git/hooks
applypatch-msg.sample  commit-msg.sample  fsmonitor-watchman.sample  ...   (samples only, no hooks)
$ git -C /tmp/iter12-fix rev-parse --git-path hooks
/Users/michelkerkmeester/.config/git/hooks
```

`/tmp/iter12-fix` has **zero** installed hooks, and the report says `hooks PASS` with an empty
detail list — while the very next row (`trust`) SKIPs because it noticed "hooks from another
checkout skip this clone's own scripts". So the battery knows the state is a borrowed-hook
state and still passes the row that is supposed to prove the commit-msg gate is installed.
The consequence is exactly the fail-open the doctor exists to prevent: on any machine whose
global git config points at a healthy Skilled checkout, every inspected project reports
`hooks` green, including a project that will never run `commit-msg`. The repository's own
installer is what should have run; the global config makes that unobservable.

The PASS branch is deliberate in the source's own comment — it accepts "the repository's own
tree … or this checkout's, which a core.hooksPath shares"
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:354]` — but the accepted set is
broader than the comment: `rev-parse --git-path hooks` returns the *global* path, not only a
`core.hooksPath` this checkout sets, so a third state (operator-global) is folded into PASS.

**Fix direction (not applied):** report the resolved hooks dir and its owner as a detail line
on PASS, and treat a hooks dir outside both the inspected repo and this checkout as DEGRADED.
**Verify:** the three commands above, in that order.

### F12-02 — CONFIRMED P1: the `install` row reports PASS for a repository where sk-git is not installed
**Type:** 5 UX (report label vs scope) · **Severity:** P2 · **Release:** v4.0.0.11 · **Confidence:** high (repro ran)

Same run as F12-01: `install PASS` over `/tmp/iter12-fix`, which has no `.skilled/` at all.
The cause is by design in the code — `checkInstall` documents itself as "the toolchain files
this battery itself needs" and tests them under `OWN_ROOT`
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:314]`, with
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:316]` naming the three required
paths and `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:338]` restoring them
from HEAD. The drift is in the report: an operator reading an eleven-row report about a
*project* takes `install PASS` to mean "sk-git is installed here". If the row is meant to be
about the battery, its source string (`skills/sk-git/SKILL.md + hard-rules.json + scripts/`)
does not say so; if it is meant to be about the project, it is testing the wrong root. Nothing
breaks if the label gains "(battery)" or the row is removed from a `--repo` run; something
breaks if a caller ever branches on this row's result.

**Verify:** `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo /tmp/iter12-fix --json | grep -A1 '"install"'`.

### F12-03 — CONFIRMED (re-logged with the repro): `symlink-engine check` exits 0 on a target with nothing installed, and it is now the only doctor engine that cannot signal "not healthy"
**Type:** 3 bug · **Severity:** P1 · **Release:** v4.0.2.0 surface · **Confidence:** high (repro ran)

```
$ node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root /tmp/iter12-root
missing          core .skilled
EXIT=0
```

The exit is unconditional at `[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1801]`.
The new comparison this iteration: the sibling engine *does* signal, and distinguishes two
degrees — the same fixture run above returned exit `1` for a FAIL row and exit `3` for
`STATUS=DEGRADED`. So within one doctor surface, `git-setup-check` reports three exit states
and `symlink-engine` reports one. The caller named at
`[SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:59]` therefore cannot use the
exit code the way the neighboring probe can.

**Verify:** the command above plus `echo $?`; compare with
`node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo /tmp/iter12-fix --tool pi --json >/dev/null; echo $?`.

### F12-04 — CONFIRMED P1: `sk-git` CI runs one of five suites, and the other four run nowhere
**Type:** 3 bug · **Severity:** P1 · **Release:** v4.0.0.16 (workflow), suites older · **Confidence:** high (counted)

The workflow's only test step is single-suite by name
`[SOURCE: .github/workflows/sk-git-script-tests.yml:50]`, running
`bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`
`[SOURCE: .github/workflows/sk-git-script-tests.yml:51]`. The suite directory holds five:
`commit-id-naming.test.sh`, `migrate-legacy-branch-names.test.sh`, `stamp-branch.test.sh`,
`validate-message-git-timeout.test.mjs`, `worktree-naming.test.sh`. A repository-wide grep of
`.github/workflows/` for the other four filenames returns nothing, so a regression in the
Commit-Id stamper, the message validator's git-timeout path, the branch-name migrator or the
branch stamper reaches `main` unseen. `message-contract.yml` does not cover it: its step runs
`node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs`
`[SOURCE: .github/workflows/message-contract.yml:48]`, which is the library, not the hook.
The workflow's own header explains why *this* suite was wired ("ran in no workflow")
`[SOURCE: .github/workflows/sk-git-script-tests.yml:3]` — the same argument applies to the
other four and was not carried across. Cheap fix: `for f in tests/*.test.sh; do bash "$f"; done`
plus `node --test tests/validate-message-git-timeout.test.mjs`.

**Verify:** `grep -rn "commit-id-naming.test\|stamp-branch.test\|migrate-legacy-branch-names.test\|validate-message-git-timeout.test" .github/workflows/` → no hits.

### F12-05 — CONFIRMED P1: the runtime-mirrors hook battery is 66 existence checks and nothing else, duplicating a registration-aware suite that runs nowhere
**Type:** 6 over-engineering (duplication) · **Severity:** P2 · **Release:** v4.0.0.x surface · **Confidence:** high (counted)

Every row in the battery is the same primitive:
`grep -o 'type: [a-z_]*' .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml | sort | uniq -c`
returns `66 type: file_exists` and nothing else; the battery opens at
`[SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:58]` and the run
instruction describes it as "a plain path-existence read, no execution"
`[SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:148]`. All 66 unique
paths resolve today, so the battery is presently green by construction and can only ever
detect a deleted or renamed file.

The stronger detector already exists: `hook-adapter-path-parity.vitest.ts` resolves each
runtime config's own hook *commands* against the repo root
`[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:7]`
and asserts every path exists — i.e. it derives the list from the registrations instead of a
hand-maintained 66-row copy, and it would catch a config entry pointing at a deleted adapter
that the battery cannot see. Neither name appears in any workflow or in
`[SOURCE: .skilled/commands/doctor/_routes.yaml:553]`'s neighborhood (grep over
`.github/workflows/` and the routes file: no hits for either). What breaks if the 66 rows are
removed: the `/doctor:runtime-mirrors` output loses its "N hook adapters degraded to fallback"
line `[SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:174]`, and nothing
in CI changes, because no CI step runs them. What would be gained: one generator or one
vitest instead of two lists.

**Verify:** the grep above; `grep -rn "hook-adapter-path-parity\|hook_adapter_fallback" .github/workflows/ .skilled/commands/doctor/_routes.yaml` → no hits.

### F12-06 — v4.0.0.12 claim CONFIRMED: `export default <binding>` is followed to its declaration
**Type:** 4 improvement (verified claim) · **Severity:** P2 · **Release:** v4.0.0.12 · **Confidence:** high (repro ran)

The release note says `/doctor:git setup` "follows `export default plugin;` to its declaration,
so an adapter written that way passes when it really binds the advisory"
`[SOURCE: .skilled/changelog/skilled/v4.0.0.12.md:28]`. The diff adds
`findTopLevelBindingDeclaration` and re-points `adapterExportsBinding` at it
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1376]`, then requires a
declaration before crediting the export
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1404]`.

Tested in `/tmp/iter12-fix` with `function ext(pi) { pi.on('tool_call', …) }` +
`export default ext`:

```
$ node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo /tmp/iter12-fix --tool pi --json
PASS ai-tool-hooks  ['…', 'pi (active): registered (.pi/extensions/git-preflight-advisory.ts)', '…']
```

The first attempt placed the imported helper at the repo root instead of beside the adapter and
the row failed with `.pi/extensions/git-preflight-advisory.ts imports ../lib/git-rule-checks.mjs,
which does not exist` — so the import is resolved relative to the adapter and a wrong location
fails closed. Both directions reproduced; the claim holds.

**Verify:** create `/tmp/x` with `.pi/extensions/git-preflight-advisory.ts` and
`.pi/lib/git-rule-checks.mjs`, then run the command above.

### F12-07 — Six of seven runtimes read `not set up` on a row that PASSes, and the PASS text never says why
**Type:** 5 UX · **Severity:** P2 · **Release:** v4.0.0.11 · **Confidence:** high (repro ran)

The same fixture report ends `PASS ai-tool-hooks` while listing
`claude/codex/devin/cursor/opencode/dsh: not set up`, because only the *active* tool is
required to register — the file table at
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:68]` enumerates all seven and
the source label states the active one
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1465]`. The verdict is
defensible; the sentence is not. An operator reading a PASS beside six "not set up" lines
cannot tell whether those six are advisory or a gap. One detail line ("only the active tool
must register") closes it. Nothing breaks if it is added.

**Verify:** the fixture run above and read the last row's details.

## Questions Answered

The focused questions ("do the hooks/CI behave as the notes say, with a repro for any wrong
accept or reject", "what friction do the operator and the AI user hit") are now half-closed:
four P1s have run repros with verdicts CONFIRMED — F12-01 (hooks fail-open via global
`core.hooksPath`), F12-02 (`install` row scope), F12-03 (`symlink-engine` exit 0, re-verified
with the three-state comparison), F12-04 (one of five suites), F12-05 (existence-only battery
plus the unrun parity suite). The v4.0.0.12 doctor claim is CONFIRMED with a two-direction
repro (F12-06), and its sk-git half is a version bump only:
`[SOURCE: .skilled/skills/sk-git/SKILL.md:6]` moves 1.9.3.0 → 1.9.4.0.

## Questions Remaining

- The v4.0.0.12 sk-git claim is not covered: the diff's fourth file is a new
  `changelog/v1.9.4.0.md` with no behavior change, so `/doctor:git setup` is the whole
  substance. Nothing else in that range remains untested.
- `Commit-Id: 0000000` plus a valid id; a pushed commit with no `Commit-Id`; the 20 s
  `BLOCKED [gate:git-timeout]` — all three still need a real push or a wedged git, beyond a
  scratch repo.
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper,
  merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) remain
  unmeasured; the battery exposes them as rows (`fsmonitor daemons: 0 main, 0 worktree,
  0 stray`, `base: .worktrees (from default)`) but the reaper itself was not exercised.
- Whether Devin's 16,384-byte rule cut truncates a binding rule; still unmeasured.

## Next Focus

1. F12-04 is the cheapest real win: wire the four unrun suites into
   `sk-git-script-tests.yml` and see whether they pass at HEAD — that answers the "would
   wiring them fail today" question the read-only bound kept open.
2. F12-01's fix shape: decide whether a foreign resolved hooks dir is DEGRADED, and check the
   two other engines' rows that resolve through git for the same borrowed-config class.
3. F12-05: decide whether the 66 rows or the parity vitest survives; the vitest is the one
   that can see a registration.

## SCOPE VIOLATIONS

None. Writes went to this run's `iterations/` and `deltas/` paths and to `/tmp/iter12-root`,
`/tmp/iter12-fix`. The repository was read only: `git diff`/`git rev-parse`, `grep`, `sed`,
`ls`, and two doctor scripts in check/report mode. `/tmp/iter12-git` was an early scratch repo
that was abandoned before use and never touched the repository.
