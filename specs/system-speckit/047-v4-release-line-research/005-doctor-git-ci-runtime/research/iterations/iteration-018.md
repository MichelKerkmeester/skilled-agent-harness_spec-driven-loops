# Iteration 18 — CI workflow pass: what runs, what is skipped, and which suites never run at all

## Focus

Read every `.github/workflows` file this run had not yet cited (24 of 32) and record, per file, its trigger, the `SKILLED_CI*` switch it honours, the scripts it runs, and whether each script resolves. Then look for three classes the focus named: a step that cannot fail, a documented switch a workflow ignores, and a suite or checker on disk that no workflow runs.

## Actions Taken

1. Enumerated `.github/workflows` (32 `.yml` + `README.md`) and extracted, per file, the `on:` block, every `SKILLED_CI*` reference, every `continue-on-error`, every `|| true`, and every script path in a `run:` line. All exit-status-masking sites were then read in context.
2. Existence-checked 32 script paths named by workflows (including both `.skilled/` and `.opencode/` twins): all resolve. Checked `.opencode/commands` is a real directory, not a symlink, so the `.opencode/...` doctor runner is not a duplicate of the `.skilled/...` one.
3. Ran the doctor's CI report in its read-only form — `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh` — and read the per-workflow JSON: `workflowCount: 32`, `errors: []`, **0 workflows carrying any of the eight flags**.
4. Took the group tally from that JSON (`FRESHNESS 8, TESTS 17, REVIEW 3, REPORTS 2, MESSAGES 1` = 31, plus the exempt `dependabot-auto-merge.yml`) and diffed it against the README switch table.
5. Listed the on-disk `sk-git` and git-hook test suites and, for each filename, counted how many workflow files mention it.
6. Mapped the trigger-index rebuild commit: the files it stages, the commit message it writes, the token it pushes with, and which workflows read that commit's trailer.
7. `git log --diff-filter=A` / `git log -1` on the five sk-git artefacts and `git tag --contains` on the two defining commits, to attribute each claim to a release.

## Findings

### F18-01 — Four `sk-git` suites on disk are run by no workflow, including the one that proves the 20 s `git-timeout` block

**Type** bug (wiring gap) · **Severity** P1 · **Release** v4.0.0.13 introduced the workflow and left the gap; v4.0.0.16 added a fifth suite into it · **Confidence** 0.9

`.skilled/skills/sk-git/scripts/tests/` holds six tracked entries. The workflow named "sk-git script tests" runs exactly one of them — the worktree-naming suite — [SOURCE: .github/workflows/sk-git-script-tests.yml:51], under a job whose name promises the whole set [SOURCE: .github/workflows/sk-git-script-tests.yml:38]. Zero workflow files mention the other four:

- `commit-id-naming.test.sh` (148 lines, executable, tracked) — "Exercises the seven-digit validator, the history-derived scan, locked allocation (including concurrent), the deleted-cache rebuild path, the ceiling and rebuild-highwater" [SOURCE: .skilled/skills/sk-git/scripts/tests/commit-id-naming.test.sh:3]
- `stamp-branch.test.sh` (119 lines) — the dirty-worktree and non-ancestor refusals and a dry run that mints nothing [SOURCE: .skilled/skills/sk-git/scripts/tests/stamp-branch.test.sh:3]
- `migrate-legacy-branch-names.test.sh` (69 lines) — the colliding-name refusal in the dry-run plan [SOURCE: .skilled/skills/sk-git/scripts/tests/migrate-legacy-branch-names.test.sh:3]
- `validate-message-git-timeout.test.mjs` (137 lines) — "This suite wedges one call and proves the validator gives up on its own: a stub `git` sleeps on `rev-list`, and the run must end in the block path instead of hanging" [SOURCE: .skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs:7]

The last one is the whole answer to the open `gate:git-timeout` half of Q3/Q4: the behaviour is pinned by a test, and the test is the one thing CI never executes. Worth stating explicitly — the failure mode this creates is the repository's own definition of a bad check: a green "sk-git script tests" context that a regression in `commit-id-naming.sh`, `stamp-branch.sh` or the validator timeout cannot turn red.

The overlap question was checked before this was written. `git-hook-gates.test.cjs` in the doctor suite (106 lines) contains no reference to `git-timeout`, `validate-message`, `commit-id`, `stamp-branch` or `migrate-legacy`, so the four suites are not shadowed by the doctor runner that `spec-kit-check.yml` does execute [SOURCE: .github/workflows/spec-kit-check.yml:257].

**Verify:** `grep -rn "scripts/tests" .github/workflows/*.yml | grep sk-git` (one hit, line 51) and `for f in .skilled/skills/sk-git/scripts/tests/*; do echo "$(grep -rl "$(basename $f)" .github/workflows | wc -l) $(basename $f)"; done` (four zeros).

### F18-02 — The rebuild commit skips the only status context the ruleset requires, which is exactly what `/doctor:ci` refuses to let an operator do

**Type** misalignment (invariant bypass) · **Severity** P2 · **Release** v4.0.0.16 · **Confidence** 0.7

The trigger-index rebuild commit carries `[skip ci]` in its body [SOURCE: .github/workflows/trigger-index-rebuild.yml:157] plus the repository's own trailer [SOURCE: .github/workflows/trigger-index-rebuild.yml:158]. `[skip ci]` suppresses every push- and pull_request-triggered workflow for that commit, and `message-contract.yml` triggers on `push: branches: ['**']` with no path filter — so the bot commit is the one commit in the repository that never reaches the message contract.

That collides with the rule the doctor enforces on humans twice over. The workflows README states the reason the check must run: "A job skipped by its condition reports Success, so a switched-off job that a ruleset requires stops blocking merges instead of failing" [SOURCE: .github/workflows/README.md:97]. The toggle's phase-2 refusal is built on the same sentence, refusing `SKILLED_CI_MESSAGES` and `SKILLED_CI` by name [SOURCE: .skilled/commands/doctor/assets/doctor-ci-toggle.yaml:70]. A `[skip ci]` commit produces precisely the state both refusals exist to prevent — required context absent, reported as Success — and nothing in the profile, the planner or the workflow names it.

This is not a claim that the rebuild is wrong. It is a claim that the invariant is stated as absolute by two documents and is not absolute in the code, so an operator reading `/doctor:ci`'s refusal gets a rule the repository itself does not follow. Also note the push token falls back to `github.token` when the secret is absent, and that path starts no workflow at all — the two mechanisms overlap and neither is documented as the authority.

**Verify:** `grep -n "skip ci\|Trigger-Index-Rebuild" .github/workflows/trigger-index-rebuild.yml`; `grep -n "reports Success" .github/workflows/README.md`; read the `on:` block of `.github/workflows/message-contract.yml` (push, `branches: ['**']`, no `paths:`).

### F18-03 — The v4.0.0.16 note counts 33 workflows; the repository has 32

**Type** drift (note vs code) · **Severity** P2 · **Release** v4.0.0.16 · **Confidence** 0.95

"The repository's 33 workflows used about 3,812 runner-minutes a day before this release" appears in the CI section of the v4.0.0.16 note. `ls .github/workflows/*.yml` is 32, and the doctor's own report agrees: `workflowCount: 32`. Either the note counts `.github/workflows/README.md` as a workflow or the count was taken before a merge and not updated. The cost claim hanging on it ("43 percent fewer runner-minutes", "636 runner-minutes" from the declined merge) is then measured against a set the reader cannot reconstruct — which is the same defect class as a check that reports Success without checking.

**Verify:** `ls .github/workflows/*.yml | wc -l`; `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh | jq .workflowCount`.

### F18-04 — The CI report has eight flags and none of them can see F18-01

**Type** extension · **Severity** P2 · **Release** v4.0.0.16 · **Confidence** 0.8

`ci-report` returned `errors: []` and zero flags across all 32 workflows while four tracked, executable suites sat unreferenced. The flag set is closed — `timeout-missing`, `permissions-missing`, `concurrency-missing`, `switch-missing`, `uses-unpinned`, `readme-row-missing`, `pull-request-target`, `event-in-run` — and the not-checked list names only `path-parity`, `shell-strict-mode` and `matrix-guidance`. Every one of the eight is a property of a single file read in isolation; none crosses from a workflow's `run:` lines to the tree, which is the only way to see a suite that runs nowhere.

Concrete extension: a ninth flag, `suite-unwired`, built from the profile's existing source roots. For each `*.test.{cjs,mjs,sh}`, `test_*.py` and `*.vitest.ts` under `.skilled/skills/**/scripts/tests/` and `.skilled/commands/*/scripts/tests/`, grep every workflow's `run:` text for the basename; report the ones with no hit. This is the check the run-all.sh comment already claims for the doctor folder — "no suite exists that nothing executes" — generalised to the rest of the tree, and it would have turned F18-01 red on the day it landed. It needs no new profile field and no new dependency.

**Verify:** `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh | jq '.workflows[] | select((.flags|length)>0)'` (empty) contrasted with the F18-01 verify.

### F18-05 — "sk-git script tests" is a plural name over a single suite

**Type** ux · **Severity** P2 · **Release** v4.0.0.13 · **Confidence** 0.9

The job name is a claim about coverage and the step underneath it names one suite [SOURCE: .github/workflows/sk-git-script-tests.yml:38]. For the operator scanning a PR's checks, "sk-git script tests ✓" reads as "sk-git is tested"; for the AI user deciding whether a hook change is safe to land, it is worse than no check, because an absent check invites inspection and a green one does not. Renaming the job to the suite it runs costs nothing and removes the false assurance; the real fix is F18-01.

**Verify:** read lines 38 and 51 of the workflow.

## Questions Answered

None of the two outstanding key questions close this iteration. The `gate:git-timeout` half of Q3 moved from "unreproducible" to "reproduced by an existing test that CI never runs" (F18-01), which is a change of status rather than an answer — the 20 s block still has no live repro in this run.

## Questions Remaining

- **Q3/Q4 (hooks), still dominant.** F18-01 relocates it: the repro exists on disk. The next pass that has `/tmp` write authority should run `bash .skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs` and `commit-id-naming.test.sh` and report whether they pass at HEAD — that answers the timeout question without inducing it by hand, and it is the cheapest remaining P1.
- Does any other `*.test.*` suite in the tree share F18-01's state? The four found are `sk-git`'s; the generalisation (F18-04's `suite-unwired` flag) was designed but not run across the tree.
- **Q10 (friction).** F18-05 is friction input: a green check whose name overstates it. F18-02 is friction of the opposite kind, a rule stated as absolute that the repository does not obey.
- **Q11** — command and skill format against sk-code / sk-doc canon. Untouched again.
- Carried: the v4.0.0.15/v4.0.0.16 worktree behaviours; `Commit-Id: 0000000` plus a valid id; a pushed commit with no `Commit-Id`; Devin's 16,384-byte rule cut.

## Ruled Out This Iteration

- **A missing script path.** All 32 workflow-named script paths resolve, twins included. The scripts are not the problem; the wiring is.
- **A step that cannot fail.** Every `continue-on-error` and `exit 0` site was read: `advisory-checks.yml`'s three are advisory by design with the reason written beside them; `strict-pass-freshness-report.yml`'s is on a repair step; the `exit 0` sites in `agent-mirror-sync`, `changed-packet-validation`, `strict-pass-freshness-report` and `trigger-index-rebuild` are skip/no-op branches, not masked failures. No `|| true` is attached to a checker invocation anywhere in `.github/workflows`.
- **A switch the workflows ignore.** The README's five group rows match the code exactly: 8 FRESHNESS, 17 TESTS, 3 REVIEW, 2 REPORTS, 1 MESSAGES, plus the profile's `exempt` entry. `dependabot-auto-merge.yml` is the only file without a switch and it is named exempt in the profile. `.env.example` documents no `SKILLED_CI*` name, so there is no documented-but-unread switch.
- **A protected workflow switched off without friction.** `trigger-index-rebuild.yml` is protected and sits under `SKILLED_CI_REPORTS`, which the README invites turning off — but the toggle's protected path asks for a second named confirmation, so this is designed behaviour, not a bypass.

## Next Focus

Iteration 19 should run the two `sk-git` suites that F18-01 names, from a `/tmp` copy of the repository if write authority allows, and report pass/fail at HEAD — closing the `gate:git-timeout` question with a test rather than an induced timeout. If `/tmp` is still out of bounds, the fallback is the `suite-unwired` sweep across the whole tree, which is pure grep and would size F18-01's population.
