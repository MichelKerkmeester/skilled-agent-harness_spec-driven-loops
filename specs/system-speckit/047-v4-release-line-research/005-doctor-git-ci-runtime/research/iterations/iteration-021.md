# Iteration 21 — Consolidation and Extension (child 005, final iteration)

## Focus

Three tasks, all read-only: (1) re-run each of the six confirmed P1 repros once more and record command, key output line and exit code; (2) rank three cheap changes by how many confirmed findings each closes, naming the file and line each touches; (3) for any v4.0.x.y release with no finding in this child, state whether it changed anything in scope.

## Actions Taken

1. Re-ran the six P1 repros against HEAD. All six reproduced; two verdicts needed correction (F21-01, F21-02).
2. Counted finding restatements per defect family across all 20 delta files, to rank the candidate changes by *closed findings*, not by intuition.
3. Checked release attribution across every delta record, read the v4.0.0.5/.6/.7 notes, and confirmed the single-commit claim with `git rev-parse`.
4. Read the exact code line each candidate change would touch, rather than citing the line a previous iteration named.
5. Verified the hook link set with `ls -la`/`readlink` before restating either hook finding (the "check symlinks before claiming duplication" rule).

### Repro re-run table

| # | Finding | Command | Key output | Exit |
|---|---|---|---|---|
| R1 | f-iter015-001 / f-iter012-003 | `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root /tmp/iter21-empty --source .skilled` | `source-missing   core .skilled` | 0 |
| R2 | f-iter015-002 | `git -C $(mktemp -d) rev-parse --git-path hooks` after `git init` | `~/.config/git/hooks` (repo `.git/hooks` holds only `*.sample`) | 0 |
| R3 | f-iter018-001 / f-iter015-003 / f-iter012-004 / f-iter008-001 | `ls .skilled/skills/sk-git/scripts/tests/*.test.*` vs `grep run: .github/workflows/sk-git-script-tests.yml` | 5 suites on disk; `<name>: Run the worktree-naming suite` is the only `run:` step | 0 |
| R4 | f-iter015-004 / f-iter013-002 | `grep -rln "agents-md" .github/workflows/` ; `node .../agents-md-manifest.cjs --check` | grep: no output, rc=1; check: `FAIL: the manifest's derived key does not match AGENTS.md` | grep 1, check 1 |
| R5 | f-iter016-002 / f-iter015-005 | `grep -n "runtime: " .skilled/bin/lib/mirror-sync-verify.cjs` ; `ls -ld .{,claude,opencode,codex,cursor,pi,devin,dsh}/agents` | 3 runtime rows; 7 trees with agent files (13/12/11/11/11/11/11) | 0 |
| R6 | f-iter019-001 | `GIT_CONFIG_GLOBAL=/dev/null bash .skilled/scripts/install-git-hooks.sh --status` | `SHADOWED: the installed hook resolves outside this checkout` ×6 | 0 |

R1's key line is the whole finding: the engine names the defect (`source-missing`) and then exits 0, because the check branch ends in a literal `return 0` and no flag reaches it [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1801]. The dispatch that lands there is at [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1791]. `inspect()` has already computed the per-runtime statuses, so the verdict is discarded rather than unavailable.

R3's asymmetry is one workflow with one step against five tracked suites [SOURCE: .github/workflows/sk-git-script-tests.yml:51]. Nothing else in the workflow invokes a suite, so `run:` appears once.

R5 confirms the roster is three rows — opencode required, claude required, codex optional [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:51] [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:52] [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:53] — while `.claude`, `.opencode`, `.codex`, `.cursor`, `.pi`, `.devin` and `.dsh` all ship agents files. `.opencode/agents` is a symlink to `../.skilled/agents`, so the first row compares the source with itself; the run still prints `11 agent(s) checked — all mirrors in sync — OK` and exits 0.

R4: the checker is red for a real reason (two independent messages, [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:567] and [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:380]) and no workflow runs it, so the red canary ships unseen.

## Findings

### F21-01 — the SHADOWED verdict is correct and the stated mechanism is wrong; the count is 6, not 7

- **type** bug · **severity** P1 · **release** v4.0.2.0 · **confidence** high
- The installed hooks are absolute symlinks: `.git/hooks/commit-msg -> /Users/.../Skilled/.opencode/scripts/git-hooks/commit-msg`. `resolve_target` tests `-L`, takes `readlink`, and because the value is absolute it skips the `dirname` branch entirely, returning the recorded spelling unchanged [SOURCE: .skilled/scripts/install-git-hooks.sh:99]. The comparison at [SOURCE: .skilled/scripts/install-git-hooks.sh:136] therefore compares two spellings of one file, and the message it prints — `resolves outside this checkout` — is false. The finding stands, but its stated mechanism ("follows one symlink hop without canonicalising") describes the relative-target branch only; for the links actually installed this is **zero** hops, so a fix aimed at hop-following would not close it. `.opencode/scripts` is itself a symlink to `../.skilled/scripts`, which is why the two spellings meet.
- The status output also shows **6** SHADOWED, not 7: `prepare-commit-msg` prints `(not installed)`. Earlier iterations recorded 7; that count depended on a link set that has since changed. The false-verdict claim holds for all six installed hooks.
- **verify** `GIT_CONFIG_GLOBAL=/dev/null bash .skilled/scripts/install-git-hooks.sh --status | grep -c SHADOWED` → 6, exit 0; `readlink .git/hooks/commit-msg`

### F21-02 — the Commit-Id stamper is shipped but not installed, while the gate that requires its output is

- **type** bug · **severity** P2 · **release** local state at HEAD (not a release delta) · **confidence** high
- `.skilled/scripts/git-hooks/prepare-commit-msg` exists and is 15,240 B; `.git/hooks/prepare-commit-msg` does not exist. The installer's copy loop would install it from that directory [SOURCE: .skilled/scripts/install-git-hooks.sh:169], and the header documents exactly what it does — stamp the Commit-Id trailer and strip runtime attribution keys [SOURCE: .skilled/scripts/install-git-hooks.sh:10]. The consequence is operational, not cosmetic: the `commit-msg` gate in this checkout enforces the Commit-Id trailer (recorded as f-iter006-002), and with the stamper absent every commit here needs the trailer written by hand. This is the concrete reason the hook accept/reject question returns the same answer on every attempt.
- It is not a shipped defect: the roster is complete in `.skilled/scripts/git-hooks/`. It is a stale local link set relative to the shipped roster, which the `--status` command correctly reports — the one place in this cluster where the status output is accurate and the install is not.
- **verify** `ls -la .git/hooks/prepare-commit-msg` → No such file; `ls -la .skilled/scripts/git-hooks/prepare-commit-msg` → file present

### F21-03 — three ranked changes, by confirmed findings closed

Ranked by *distinct confirmed findings closed*, counted over the delta stream rather than guessed:

1. **Four named suite steps in the sk-git job — closes 4 findings (4 P1).** f-iter008-001, f-iter012-004, f-iter015-003, f-iter018-001 are four statements of one defect; all four close on the same edit. Touch `.github/workflows/sk-git-script-tests.yml:51`, replacing the single `run:` with one `run:` per suite in `.skilled/skills/sk-git/scripts/tests/`. Four lines of YAML for four P1s is the best ratio in this child, and it needs no code change.
2. **Widen the mirror roster — closes 3 findings (3 P1).** f-iter014-001 (`.pi/agents` has no body-parity check), f-iter015-005 (3 of 7 trees), f-iter016-002 (the opencode row is inert) all close by editing the three rows at `.skilled/bin/lib/mirror-sync-verify.cjs:51`–`:53`: add `pi` as required, add `cursor` and `devin` (their files are symlinks into `.claude/agents`, so they cost one row each), and either drop opencode to `required:false` or label it presence-only. f-iter015-006 (a mirror-only `Explore.md`) and f-iter014-004 (a normaliser that folds four trees into one token) survive this edit — the roster is not the whole mirror gap.
3. **Give the symlink engine an exit code — closes 2 findings (2 P1).** f-iter015-001 and f-iter012-003 are one defect: `return 0` at `.skilled/commands/doctor/scripts/symlink-engine.cjs:1801`. Return non-zero when any runtime status is not `ok`, with an explicit escape flag so the documented read-only inspection keeps working.

Near-tied fourth, worth recording because it is equally cheap but does not *close* its headline finding: one workflow step running `.skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` closes f-iter015-004 and f-iter013-002 (2 P1) and makes f-iter013-001 visible — but the canary stays red until the manifest is regenerated, so the finding stays open by design.
Fifth, one finding: canonicalise the readlink value in `.skilled/scripts/install-git-hooks.sh:99` (f-iter019-001).

### F21-04 — three releases carry no finding, and all three changed in-scope surfaces

- **type** drift · **severity** P2 · **release** v4.0.0.5, v4.0.0.6, v4.0.0.7 · **confidence** high
- `git rev-parse v4.0.0.{4,5,6,7,8}^{}` returns the single commit `4d8f403355`, so no tag diff separates them and attribution had to come from note text and dates. Every other v4.0.x.y release carries at least two findings; these three carry zero, and none is even named inside a finding label.
- They are not clean. v4.0.0.5 adds `/doctor:update check` — a read-only layout report inside the doctor command this child audits [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:36]. v4.0.0.6 changes the code agents' reporting and the repository rules [SOURCE: .skilled/changelog/skilled/v4.0.0.6.md:16], which is `.skilled/agents/**`, the runtime mirrors and `.skilled/repo-rules/**`. v4.0.0.7 adds the CI routing-drift gate [SOURCE: .skilled/changelog/skilled/v4.0.0.7.md:40] and removes two retired deep-loop modes from every runtime's agent directory — `.github/workflows` and the mirrors, both in scope.
- The honest statement is therefore "unattributed", not "verified unchanged": the one-commit alias makes per-release attribution impossible by diff, and this child spent its 21 iterations on surfaces those notes do not name. Treating the absence of findings as evidence of cleanliness would be the error this finding exists to prevent.
- **verify** `git rev-parse v4.0.0.4^{} v4.0.0.7^{} | sort -u` ; `grep -c v4.0.0.5` over the delta files → 0

### F21-05 — the delta stream carries a severity outside the run's own vocabulary

- **type** improvement · **severity** P2 · **release** v4.0.0.0 · **confidence** high
- f-iter014-004 is recorded at `severity: "P3"`. The run contract allows P0, P1 and P2 only, so any consumer that buckets by severity silently drops or mis-orders it. The finding itself is sound — three copies of "use only `<tree>/agents/*.md` as the canonical runtime path reference" with three different referents, invisible to a normaliser that folds `.skilled|opencode|claude|pi` into one token before comparing.
- Consequence for this run's own output: the P1 count this child reports is a lower bound only if a P3 exists that should have been P1 or P2. Reading the label, its impact is P2. This is a record-hygiene defect in the research artifact, not in the repository under audit — recorded so the child's own numbers are not read as exact.
- **verify** `grep -h '"severity":"P3"' specs/system-speckit/047-v4-release-line-research/005-doctor-git-ci-runtime/research/deltas/*.jsonl`

## Questions Answered

None. The single unchecked strategy question — whether the sk-git hooks behave as the v4.0.0.3, v4.0.0.10 and v4.0.0.15/v4.0.0.16 notes say, with a repro for any wrong accept or reject — is not closed by this iteration. F21-02 explains why the same answer keeps recurring (no stamper, so no automatic trailer, so the gate refuses), and F21-01 corrects the `--status` half, but neither is an accept/reject repro.

## Questions Remaining

- **The hooks accept/reject repro** — open since iteration 2, closed by nothing in 21 iterations. It needs a scratch repository with a `skgit.contractDir`, which every iteration's write bound excluded. The cheapest route remains the suites already on disk (`validate-message-git-timeout.test.mjs`, `commit-id-naming.test.sh`), not a hand-built repo.
- The `Commit-Id: 0000000` plus valid-id case; a pushed commit with no `Commit-Id`; the 20 s `gate:git-timeout`.
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`).
- **Q11** — command and skill *format* against sk-code / sk-doc canon. Unmeasured for a fifth iteration.
- Devin's 16,384-byte rule cut against the concatenated repo-rules size.

## Next Focus

None — this is iteration 21 of 21 for this child. The three ranked changes in F21-03 are the hand-off: rank 1 is four lines of YAML, rank 3 is one `return`, and both are CI-visible, so a follow-up packet can verify them in one run. The hooks question, the worktree behaviours and the canon comparison are unresolved and should be carried to a child that has scratch-repo write authority.

## SCOPE VIOLATIONS

None. Scratch repositories and output captures were created only under `/tmp`; every repository path was read only.
