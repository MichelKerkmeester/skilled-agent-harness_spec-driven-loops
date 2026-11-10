# Iteration 015 — Improvement, over-engineering and extension pass

## FOCUS

Convert each confirmed P1 in this child into one improvement row that names the file:line and the
behaviour after the fix; count the doctor/checker surface for over-engineering with `wc -l`
evidence; and name one cheap CI wiring that would have caught two or more of these findings.
Severity vocabulary restricted to P0/P1/P2. Every row attributed with `git log -S`.

## ACTIONS TAKEN

1. Read the `check` branch of the symlink engine end to end and enumerated every flag
   `parseArgs` accepts, to test whether drift can be signalled by exit code at all.
2. Read `checkHooks` in the git setup battery (lines 344-400) and ran a throwaway-repo repro of
   `git rev-parse --git-path hooks` under a global and a `-c` `core.hooksPath`, to see what the
   battery actually inspects.
3. Enumerated the sk-git test suites on disk against the single suite step in the CI workflow.
4. Grepped every workflow for the agents-md manifest checker; read the `--check` contract in its
   own usage block.
5. Diffed the canonical `.skilled/agents` roster against all seven runtime `agents/` directories
   with a node script (not `comm`, whose first attempt mis-parsed extensions and was discarded).
6. `ls -la` + `readlink` on the mirror-sync checker in both roots to test the duplication claim
   before asserting it; counted doctor routes, YAML assets, engines and libs with `wc -l`.
7. `git log -S` on each cited line, then `git tag --contains` to land each row on a release.

## FINDINGS

### F15-01 — P1 improvement — `/doctor:symlink --check` cannot fail

Type: improvement. Release: v4.0.1.0 (28b388e81b, "add /doctor:symlink and /doctor:install").
Confidence: high on the code path; the drift verdict itself was read, not run.

`[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1801]` is `return 0;` — the `check`
branch emits its report and returns success unconditionally, at
`[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1791]`. `inspect()` does compute a
per-runtime status of `missing`, `broken`, `foreign-link` or `source-missing`, so the information
exists and is thrown away. No flag rescues it: `parseArgs` accepts `--root --source --runtimes
--include --mode --ignore --plan-digest --run --link-instructions --dry-run --yes --json`
(`[SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:138]` ends the flag ladder) and none
of them is a strict or fail-on-drift switch.

Improvement: return 1 when any runtime detail carries one of those four statuses, and add
`--allow-drift` to restore the current 0. Behaviour after the fix: `/doctor:symlink --check`
becomes usable as a CI gate on the v4.0.2.0 install/symlink flow, and an operator's shell sees a
non-zero status when the tree is not linked as the manifest says.

Verify: `mkdir -p /tmp/empty && node .skilled/commands/doctor/scripts/symlink-engine.cjs check
--root /tmp/empty --source .skilled; echo rc=$?` — prints a report full of `missing` rows and
`rc=0` today.

### F15-02 — P1 bug — `checkHooks` grants PASS from the global hooks path

Type: bug. Release: v4.0.0.3-era doctor battery (pre-existing at the v4.0.0.0 baseline).
Confidence: high; repro run this iteration.

`checkHooks` resolves the hooks directory with
`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:367]` —
`git rev-parse --git-path hooks` — and that command honours `core.hooksPath`, including a
**global** one. Repro run in `/tmp`:

```
$ R=$(mktemp -d /tmp/chkhooks.XXXXXX) && git -C "$R" init -q
$ git -C "$R" rev-parse --git-path hooks
/Users/michelkerkmeester/.config/git/hooks
$ git -C "$R" -c core.hooksPath=<checkout>/.skilled/scripts/git-hooks rev-parse --git-path hooks
/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks
```

So for any inspected repository the loop compares names against `ownDir` itself: `accepted`
(`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:384]`) contains `ownDir`, and when
`hooksDir` *is* `ownDir` every name realpaths to itself, `accepted.includes()` is trivially true and
the battery reaches `[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:399]` —
`return pass(source)`. The inspected repository may have installed nothing at all.

Improvement: when `ownCheckout` is false, resolve the repository's own hooks with
`git rev-parse --git-common-dir` plus `/hooks` and ignore `core.hooksPath`; accept a
`core.hooksPath` match only when `git config --local core.hooksPath` names `ownDir`. Behaviour
after the fix: a foreign repository with no local hook reports FAIL and prints the repair line,
instead of PASS.

Verify: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo "$R" --json | grep -i hooks`
on the scratch repo above.

### F15-03 — P1 improvement — the sk-git CI job runs 1 of 5 suites

Type: improvement. Release: v4.0.0.13 (ca571debab, "run the pi extension, sk-git and two sk-doc
suites where a failure blocks"). Confidence: high.

`[SOURCE: .github/workflows/sk-git-script-tests.yml:51]` is the only suite step:
`bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`. On disk
`.skilled/skills/sk-git/scripts/tests/` holds five: `commit-id-naming.test.sh`,
`migrate-legacy-branch-names.test.sh`, `stamp-branch.test.sh`, `worktree-naming.test.sh` and
`validate-message-git-timeout.test.mjs`. The commit that added the job names suites in the plural
and wires one.

Improvement: replace the single step with five named steps (or a loop with the suite name in the
step label) in the same job, which already guards on
`[SOURCE: .github/workflows/sk-git-script-tests.yml:39]`. Behaviour after the fix: the v4.0.0.10
Commit-Id stamper, the v4.0.0.3 message contract and the v4.0.0.15/v4.0.0.16 worktree allocator all
gain a merge-blocking guard, and a regression names its suite in the job log.

### F15-04 — P1 improvement — the agents-md manifest freshness gate has no caller in CI

Type: improvement. Release: v4.0.0.8-era agents-md surface. Confidence: high.

`[SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:37]` states the contract:
`--check` compares `derived` with the root documents and the authored rows. Its only references
are the route doc `[SOURCE: .skilled/commands/doctor/agents-md.md:28]`, the feature catalog and its
own test; `grep -rln "agents-md" .github/workflows/` returns nothing.

Improvement: one step in an existing workflow —
`node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check`. It needs no build and no
package install, so it costs seconds. Behaviour after the fix: a hand-edited AGENTS.md section that
desyncs `derived` fails CI instead of surfacing only when an operator happens to run
`/doctor:agents-md`.

### F15-05 — P1 drift — the mirror parity gate covers 3 of 7 runtime trees

Type: drift. Release: v4.0.0.10 (d93100d57b, "remove the agent-improvement and model-benchmark
modes"). Confidence: high.

`[SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:50]` opens `RUNTIME_MIRRORS` with exactly three
entries: `opencode`, `claude` (both `required: true`) and `codex` (`required: false`). The
repository ships seven: `.claude/agents` 13 files, `.opencode/agents` 12, and 11 each in
`.codex`, `.cursor`, `.pi`, `.devin`, `.dsh`. Nothing in the list mentions `pi`, `cursor`,
`devin` or `dsh`, so an edit to `.pi/agents/code.md` that desyncs from canonical passes
`agent-mirror-sync.yml` unseen — and `.pi` is the runtime this audit is running inside.

Improvement: add `{ runtime: 'pi', template: '.pi/agents/{name}.md', format: 'markdown', required: true }`
and the `cursor`/`devin` equivalents; `dsh` needs a `patch-yml` format value because its files are
`{name}.patch.yml`. Behaviour after the fix: four more trees fail closed on drift.

### F15-06 — P1 drift — two canonical agent roots, and `.claude/agents/Explore.md` lives in only one

Type: drift. Release: present at the v4.0.0.0 baseline. Confidence: high.

`[SOURCE: .skilled/agents/README.txt:9]` sets the inventory rule: "if an agent file is not present
in this directory, it is not a live runtime surface here". Measured roster: canonical 11 agent
definitions; `.claude/agents` holds 13 files = those 11 + `Explore.md` + `README.txt`, while
`.opencode/agents` holds 12 = 11 + `README.txt` and the other five trees hold exactly 11.
`[SOURCE: .claude/agents/Explore.md:1]` is a live agent — `name: Explore`, `model: haiku`,
`tools: Read, Grep, Glob, Bash`, 15 lines — with no canonical definition, so the rule in the README
and the tree disagree.

The parity gate cannot see it either: `mirror-sync-verify.cjs` compares *tokens inside* a file
(`unexpectedTokens`, line 245) over names drawn from canonical, so a mirror-only file is never
enumerated.

Improvement: add the reverse roster direction — every file in a covered `agents/` directory that has
no canonical source is a FAIL, with `README*` allowlisted — or adopt `Explore.md` into
`.skilled/agents`. Behaviour after the fix: the two roots cannot disagree silently.

### F15-07 — P2 over-engineering — the parity gate runs a copy of itself

Type: over-engineering. Release: v4.0.0.9-era agent mirror gate. Confidence: high.

`[SOURCE: .github/workflows/agent-mirror-sync.yml:57]` sets
`CHECKER=".opencode/bin/check-agent-mirror-sync.cjs"` — the mirror copy, not
`[SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:2]`, the canonical one. `ls -la` shows both are
regular files of 8,227 bytes; `readlink` on the `.opencode` path prints nothing, so it is a copy,
not a symlink. Nothing checks that the two agree — the roster checker compares agent *files*, and
`command-catalog-mirror-check.cjs` is about the command catalog.

What breaks if the duplicate goes: nothing. The canonical path exists in every checkout, and the job
already builds the shared package the checker loads
(`[SOURCE: .github/workflows/agent-mirror-sync.yml:46]`).

Improvement: point `CHECKER` at `.skilled/bin/check-agent-mirror-sync.cjs`. Behaviour after the
fix: the gate cannot be silently weakened by editing the copy that CI runs.

### F15-08 — P2 over-engineering — three doctor checkers answer "is the tree mirrored"

Type: over-engineering. Release: accumulated. Confidence: medium (the overlap is measured; the
exact row wiring of each checker was not re-read this iteration).

`wc -l` evidence: 17 route documents in `.skilled/commands/doctor/*.md`, 41 YAML assets in
`.skilled/commands/doctor/assets/`, 24 engine scripts totalling 24,679 lines and 15 libs totalling
5,416 lines — 30,095 lines behind one command family. Within that, the mirror question is answered
three times: `agent-roster-mirror-check.cjs` (228 lines,
`[SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:3]`), the bin pair
`check-agent-mirror-sync.cjs` + `lib/mirror-sync-verify.cjs`, and the roster rows inside
`command-catalog-mirror-check.cjs` (460 lines). Only the bin pair has a CI caller.

What breaks if the doctor roster checker is removed: the `/doctor:runtime-mirrors` roster row loses
its implementation — nothing else, since no workflow calls it.

Improvement: have that doctor row shell out to `node .skilled/bin/check-agent-mirror-sync.cjs --json`
and delete the second implementation. Behaviour after the fix: one roster truth, and the doctor
reports what CI enforces.

### F15-09 — P2 extension — one cheap wiring that catches F15-03 and F15-04 together

Type: extension. Release: n/a (proposal). Confidence: high.

Both gaps are pure-node, build-free checks. Extending the existing
`[SOURCE: .github/workflows/sk-git-script-tests.yml:51]` job with (a) the four missing suites and
(b) `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` costs one file and no new
workflow. Behaviour after the fix: two of this iteration's P1s have a merge-blocking guard, and the
existing `vars.SKILLED_CI_TESTS` switch already controls the whole job.

### F15-10 — P2 ux — the printed hooks repair reproduces the false PASS

Type: ux. Release: v4.0.0.3-era. Confidence: high.

`[SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:366]` prints
`git config core.hooksPath <ownDir>` for a foreign repository. An operator who runs it with
`--global` — the natural reading, since the failure was reported in a repository they do not own —
makes *every* repository on the machine pass F15-02's check. The repair is correct for one repo and
harmful when generalized, and nothing in the line says which.

Improvement: print `git config --local core.hooksPath <ownDir>` and, when a global `core.hooksPath`
is detected, add a second detail line naming it. Behaviour after the fix: the repair cannot be
generalized into the condition it hides.

## QUESTIONS ANSWERED

None fully. Q3 and Q10 are narrowed, not closed — see below.

## QUESTIONS REMAINING

- **Q3 (hooks half)** — still open, and now the dominant one. F15-02 shows the *doctor* verdict on
  hooks is unsound, but the hook scripts themselves (`commit-msg`, `pre-commit`, `pre-push`) were
  not exercised: running the five suites writes throwaway repositories, outside this iteration's
  read-only bound. The v4.0.0.10 Commit-Id and v4.0.0.15/v4.0.0.16 worktree behaviours stay
  unverified against their notes.
- **Q10 (friction)** — narrowed again. Doctor-output friction now has a hard example (a check that
  cannot fail, F15-01, and a verdict granted by global config, F15-02) and CI friction has one
  (a green job that runs one of five suites, F15-03). Hook-rejection friction is still unmeasured.
- Open from earlier: Devin's 16,384-byte rule cut; the 20 s `gate:git-timeout`; a pushed commit
  with no `Commit-Id`; a message carrying both `Commit-Id: 0000000` and a valid id.

## NEXT FOCUS

Iteration 16 (final): close Q3 or declare it closed-by-bound. The cheapest honest path is to read
the three hook scripts for their gate order and reject paths and report the suites as a named
residual rather than imply they were run. Then hand the ten rows above to the synthesis step with
their release attributions intact.

## SCOPE VIOLATIONS

None. Every write landed in the run directory; the repro ran in `/tmp/chkhooks.XXXXXX`, and no
repository file was modified, staged or committed.
