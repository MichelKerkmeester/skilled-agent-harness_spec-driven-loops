# Final review: CI workflow efficiency synthesis (053/001-research)

Scope: `specs/system-speckit/053-ci-workflow-efficiency/001-research/research/research.md` (all sections), its `iterations/`, `../scratch/ci-run-data/`, `.github/workflows/` (33 files plus README.md) and `.github/scripts/`, judged against the DeepSeek V4.1 Flash review in `review053/review.log`. Read-only: no repo file edited, no state-changing git or gh call. The only `gh` call was a read of the rulesets API.

Shorthand used below: "window" means the 23.5 h dataset window. "Per day" means window figures scaled by 24/23.5 (factor 1.021), which is how the synthesis and iteration 019 compute every per-day number.

## Verdict

PASS WITH FIXES. The synthesis points the right way and its biggest number holds: the rebuild fan-out is 2,073 runner-min/day, 54% of 3,812. Four things in it are wrong or unsafe as written and get fixed below:

- Rec 6's 3x-median timeout rule could clip real successful runs.
- Rec 8's narrowing of the dispatch guard would delete coverage for two vitest suites.
- Rec 4's saving is measured against the wrong interval, and after rec 1 it almost disappears on main.
- Recs 2, 3 and 5 double-count the run volume that rec 1 removes.

Most of the DeepSeek review stands. It has three errors of its own:

- It "corrects" the saving to 2,030, but that is the per-window figure, not per day.
- It undercounts how far rec 3 shrinks after rec 1: spec-kit-check falls to 15 runs per window, not 25.
- It double-counts `fileParallelism` sites through the `.opencode/skills` symlink.

Two of its missed recommendations do not hold up and are rejected.

The most useful new finding: a `[skip ci]` token in the rebuild commit message would remove the whole fan-out with one line. That would replace the 104 twin-matched filter entries the synthesis plan needs, along with the ordering conflict they cause. It is offered as decision D1.

## Finding-by-finding judgment of the DeepSeek review

### P0-1 (rec 6 timeouts at 3x median): accepted with correction

- I reproduced the run-level maxima from `scratch/ci-run-data/per-workflow/*.json`, measured from startedAt to updatedAt. Examples: markdown-link-integrity median 70 s, max 603 s; skill-doc-frontmatter 59 s and 2,257 s; prompt-card-sync 58 s and 285 s; sk-code-script-tests 107 s and 435 s; agent-mirror-sync 94 s and 340 s; naming-standard-guard 92 s and 330 s; chart-corpus 104 s and 321 s. Every one of those maxima concluded `success`.
- Correction: run-level wall time includes the wait for a runner and the gaps between jobs. `timeout-minutes` counts job execution only. So these maxima overstate what a timeout would actually see, and whether the 603 s and 2,257 s runs were execution or queueing is UNVERIFIED (the 5-run job samples do not include them).
- The conclusion still stands. A literal 3x-median rule, which for a 70 s job means about 4 minutes, has too little margin. Sizing must use job-level samples (see R24).
- Current state confirmed: 7 `timeout-minutes` lines across 6 workflows (`opencode-dual-version.yml:74,172`, `deep-loop-runtime.yml:36`, `hooks-node-tests.yml:46`, `opencode-plugin-tests.yml:54`, `skill-advisor-stress.yml:43`, `sk-doc-rename-harness.yml:31`), so 27 workflows have none.

### P0-2 (rec 8 narrowing drops two suites): accepted with correction

- `.skilled/hooks/vitest.config.ts:38` collects `.skilled/hooks/**/*.{test,spec}.*` and excludes any JS test that does not import vitest (`:17-23`).
- I enumerated the collected suites. Seven are vitest: five under `dispatch/` (`devin-dispatch-audit.test.mjs`, `codex-shell-tool.test.mjs`, `pi/dispatch-preflight-lint.test.ts`, `pi/directive-dedup.test.ts`, `lib/dispatch-audit.test.mjs`) and two outside it (`session-relaunch/pi/session-relaunch.test.ts`, `classifier-injection-screen/pi/classifier-injection-screen.test.ts`).
- The only workflow consumer is `dispatch-enforcement-guard.yml:67`. Its comment at `:57-60` says the whole-tree run exists because those suites "ran in no job".
- Correction: the review's "ceiling ~84 runner-min/day" is not derivable. The `hooks-vitest` job would still run, so narrowing it saves seconds of test time, probably zero billed minutes. The real lever in this workflow is the duplicate work described in N11 (R6).

### P1-1 (8 entries per filter): accepted with correction

- Confirmed twin rule: `check-gate-inputs.sh:107-121` matches twins within a group, `:336` raises `twin-one` as `filter-twins`, and `:369-372` parses `paths` and `paths-ignore` the same way, including `!` entries.
- `repo-rules-corpus.yml:9-10` states the inert-twin rule outright.
- Correction: this only applies under D1 option B. The ignore is needed only on the `push:` event, because the rebuild workflow is push-only (`trigger-index-rebuild.yml:6-9`). So the count is 8 entries times 13 workflows = 104, all under `push:`, and nothing under `pull_request:`.

### P1-2 (recs 2, 3, 5 double-count rec 1): accepted with correction

- Confirmed shares from `runs-last-1000.json`: spec-kit-check has 35 rebuild runs out of 50, and hooks-node-tests and opencode-plugin-tests each have 35 out of 61.
- Correction: after rec 1, spec-kit-check runs **15** times per window, not about 25. Rec 3 therefore drops to about 9 x 15 x 1.021 = **~138/day**, not ~225.
- Rec 2: about 74/day after rec 1. The calculation is hooks and plugin at 26.6 runs/day, -1 billed minute each, plus dual-version's -21.
- Rec 5: about 53/day after rec 1 alone, and about 27/day after recs 1 and 2.

### P1-3 (35 of 73, exactly 14 runs): accepted with correction

- Reproduced: 985 push runs on main, 73 distinct SHAs, 35 of them rebuild SHAs. Every rebuild SHA has exactly 14 runs: 13 downstream workflows plus the rebuild workflow itself.
- Correction: the saving does not fall to 2,030. 2,030 is the per-window figure (58 billed min per rebuild SHA x 35). The per-day figure is 2,073, which is what `iteration-019.md:23-29` computes (spec-kit-check 35 x 25 x 1.021 = 895). 2,073 / 3,812 = 54%. The synthesis's 54% stands; only "36" and "14 to 17" (`research.md:35,324`) are wrong.

### P1-4 (advisory-checks reads the committed index): accepted

- Confirmed at `advisory-checks.yml:66-68`: `generate-trigger-index.mjs --check` runs against the committed checkout.
- The step is report-only (`:55`, `|| echo` at `:68`), and the rebuild job already compares every output byte for byte against a fresh generation before committing (`trigger-index-rebuild.yml:92` onward, `verify_outputs`). Skipping it on the bot commit loses nothing that gates.
- spec-kit-check does not load the content. My grep found only `out/`-generated fixtures (`trigger-index.vitest.ts:74-85`) and path-only uses of `DEFAULT_INDEX_PATH` (`:708-710`). This is inferred from grep, not from a full read.

### P1-5 (message-contract question already answered): accepted with correction

- Confirmed: the push uses `secrets.TRIGGER_INDEX_PUSH_TOKEN`, described as owned by a ruleset bypass actor (`trigger-index-rebuild.yml:273-274`).
- The ruleset API returns `bypass_actors: RepositoryRole 5, bypass_mode always` and one required context.
- Correction: the review says the ruleset has no `conditions`. It does: `conditions.ref_name.include: ["~DEFAULT_BRANCH"]`.
- The generated-only-PR deadlock it names is real only if the ignore is applied to `pull_request:`. Applying it to `push:` only, or using D1 option A, removes that risk. The open question at `research.md:306` is closed.

### P1-6 (rec 4 attribution and interval): accepted with correction

- Reproduced: 206 pairs, all push events. The 535 wall-min is time spent before the newer run started; the reclaimable time (newer start to older end) is 817 wall-min.
- Additional correction, both reports missed it: most of those pairs are a human-commit run overtaken by its own rebuild commit's run.
  - Excluding the rebuild workflow's own deliberate queue: 177 pairs, 792 reclaimable min.
  - Dropping rebuild runs to simulate the state after rec 1: **23 pairs, 89 reclaimable wall-min per window**.
- So after rec 1, cancel-in-progress on main is worth almost nothing, and the PR half rests on policy, since PR volume is unmeasured.

### P1-7 (composite action leaves the scan surface): accepted

- Confirmed: `check-gate-inputs.sh:481-484` scans `.github/workflows/*.yml|*.yaml` only, and `:486-490` adds dependabot.
- `.github/actions/` does not exist today.

### P1-8 (fetch-depth lever unowned): accepted with correction

- The ten `fetch-depth: 0` sites are confirmed.
- Correction: `comment-hygiene.yml:25,39` and `agent-mirror-sync.yml:35,40` both run `git diff "$BASE" "$HEAD"` against the PR base, so they do read history. `deep-loop-runtime.yml:38-39` needs the parent commit.
- That leaves `rule-canary-sync.yml:15` and `repo-rules-corpus.yml:33` as clean candidates. A grep found no git invocation in their checkers. Inferred; confirm by reading the checkers in full.
- Measured from the job samples: a depth-0 checkout step takes a median of about 72 s, against about 50 s at default depth. So the lever is about 20 s per job, not the whole checkout. The 26.6% checkout share is UNVERIFIED by me.

### P1-9 (always-run workflows with narrow inputs): accepted with correction

- command-tree-parity: accepted, but the filter the review proposes (commands, agents, Hermes) is too narrow. The `hermes-mirror` job reads every skill's `SKILL.md` and `.skilled/agents` (`sync-skills-hermes.cjs:20,27,61,212-221`) and every command (`sync-prompts-hermes.cjs:21`).
  - The workflow says in so many words that it is unfiltered on purpose (`command-tree-parity.yml:46-50`), so this needs operator decision D3.
  - Classifying the 38 human push SHAs with `git diff-tree`: a correct filter fires on 8 of 38.
- changed-packet-validation: rejected as a meaningful saving. 33 of the 38 human pushes touch `specs/`, so a filter saves about 5 runs per window, about 10 runner-min/day.

### P2-1 (fileParallelism count): accepted with correction

- `.opencode/skills` is a symlink to `../.skilled/skills` (`ls -la .opencode`). There are therefore **5 distinct sites in 4 files**: `system-spec-kit/vitest.config.ts:50,67` (the root and cli projects, `:53,:70`), `system-spec-kit/runtime/vitest.config.ts:38`, `system-skill-advisor/runtime/vitest.config.ts:39` and `system-deep-loop/runtime/vitest.config.ts:20`.
- The review's "10" counts each file twice through the symlink, and the synthesis's citation of the `.skilled/` path is not wrong. The synthesis's "seven" is wrong.

### P2-2 (227-247 unexplained): accepted with correction

- The figure is explained, just not in research.md: `iteration-020.md:119` gives it as 145 + 62 + 20-40, with the 20-40 for npm dedupe from `iteration-019.md:139`.
- All three parts shrink after rec 1 (see R14 to R16).

### P2-3 (phase 008 depends on 002, not 003): accepted

- Fixed in the phase plan.

### P2-4 (phase 002 violates ordering rule 2): accepted

- Resolved two ways. D1 option A introduces no new YAML pattern. Under option B, rule 2 is amended: a pattern can land first with its own assertion test, and the standard records it afterwards.

### P2-5 (README rows): accepted

- The line numbers in the current file are `README.md:58` (rebuild row), `:64-75` (push/PR table) and `:68` (gate-inputs row).

### P2-6 (advisory-checks has no filter list): accepted

- Its node runner walks the whole tree (`advisory-checks.yml:30,38`), so there should be no narrow filter. Only rec 1 and the suppression fix apply.

### P2-7 (ignore-assertion test has no host): accepted with correction

- Under option A, the natural host is the existing `trigger-index-rebuild-workflow.vitest.ts`, which already pins the subject and trailer (`:83-84`).
- That test runs in spec-kit-check, and spec-kit-check does not trigger on `.github/workflows/trigger-index-rebuild.yml` (`spec-kit-check.yml:9,37` name only its own file). That gap exists today (N5).
- Under option B, the host is `check-gate-inputs.sh` plus its fixture test, as the review says.

### P2-8 (citation nits): accepted with correction

- `parent-skill-check.cjs:682` is indeed the `checkSurfaceMode` header; the mutatesWorkspace check is at `:693-694`.
- The "25 of 230" job count is UNVERIFIED by me.
- The sub-claim that `permissions: {}` should not count as a declaration is rejected: an empty block is an explicit declaration, so 21 stands.

### Missed rec: path filters on changed-packet-validation and command-tree-parity: accepted with correction

- Same as P1-9: command-tree-parity is worth doing (decision D3); changed-packet-validation is not (about 10/day).

### Missed rec: fetch-depth reduction: accepted with correction

- Same as P1-8: two clean candidates, one candidate for depth 2, and two that need the PR base.

### Missed rec: skill-doc-frontmatter push filter narrower than PR: rejected

- The push-run job is coverage mode, which checks only reference and asset docs (`skill-doc-frontmatter.yml:41-45`).
- The `*.md` entries (`:12-14`) exist for the PR-only `doc-version-raise` job (`:48-52`). The asymmetry is correct.
- A different gap exists: neither filter names the guard script or the workflow file (N14).

### Missed rec: gate-inputs to scan `.github/actions/**`: accepted

- Same as P1-7.

### Missed rec: repo-rules-corpus failures: rejected

- Both failures are dated 2026-09-18, the first runs in its sample, and the 17 runs since have all succeeded.
- It is kept only as a confirm-stale line inside R21.

## New findings

- **N1: the per-day versus per-window mix-up.** 2,073/day is the correctly scaled figure, and the review's 2,030 is per window. Every saving in this document is per day.
- **N2: the main-branch supersession is almost entirely self-inflicted by the rebuild.**
  - Before rec 1: 177 pairs and 792 reclaimable wall-min per window, excluding the rebuild workflow.
  - After rec 1: 23 pairs and 89 min.
  - Recommendation: cancel-in-progress on PRs only; on main, make it decision D2 and recommend no cancel.
- **N3: spec-kit-check after rec 1 runs 15 times per window** (50 total minus 35 rebuild runs). Rec 3's real saving after rec 1 is about 138/day. The wall-clock gain of about 525 s per run is unaffected.
- **N4: a one-line alternative to rec 1.**
  - Add `[skip ci]` to the body of the rebuild commit message (`trigger-index-rebuild.yml:148-150`). GitHub documents that this skips every push- and pull_request-triggered workflow for that commit.
  - It needs no filter entries, no gate-inputs twin churn and no new YAML pattern, and it also removes the 35 skipped rebuild-workflow run rows.
  - It loses the same things the paths-ignore approach loses: the report-only freshness recheck and message-contract's check of a fixed bot message.
  - Documented, not exercised. Whether it holds for pushes made with the bypass-actor PAT is UNVERIFIED and is proved by R1's acceptance check.
- **N5: an existing gap.** `trigger-index-rebuild-workflow.vitest.ts` does not run when `trigger-index-rebuild.yml` changes, because spec-kit-check's filters omit that file (`spec-kit-check.yml:4-9,32-37`).
- **N6: the rebuild ignore is a push-only concern.** The rebuild workflow never runs on PRs (`trigger-index-rebuild.yml:6-9`, `README.md:75`). Leaving `pull_request:` untouched avoids the required-check deadlock for a PR that changes only generated files.
- **N7: changed-packet-validation is not worth filtering.** 33 of 38 human pushes touch `specs/`.
- **N8: the command-tree-parity filter must cover more.** It needs `.skilled/skills/**/SKILL.md`, `.skilled/agents/**`, `.skilled/commands/**`, `.hermes/**`, the `.claude/commands` tree, the checkers and the spec-kit shared package and lockfile, each with its `.opencode/` twin where the root is a source root.
- **N9: fetch-depth delta measured at about 20 s per job.** comment-hygiene and agent-mirror-sync need the PR base. `rule-canary-sync`'s 78 s median job could drop under 60 s and bill 1 minute instead of 2 (inferred).
- **N10: the `fileParallelism` site count is 5 sites in 4 files** (symlink).
- **N11: duplicate work in dispatch-enforcement-guard.** It runs `dispatch-audit.test.mjs` twice per run: explicitly at `dispatch-enforcement-guard.yml:50`, and again through the whole-tree vitest run at `:67`, whose include collects it. Both of its jobs pay a checkout plus `npm --prefix .skilled ci` (`:44`, `:61`).
- **N12: the ruleset has conditions.** It applies to `~DEFAULT_BRANCH` only, bypass RepositoryRole 5, mode `always`. So rulesets do not apply to `skilled/**` pushes at all.
- **N13: pip installs run in four workflows, not three.** `naming-standard-guard.yml:28`, `sk-doc-rename-harness.yml:46`, `sk-doc-script-tests.yml:37`, `spec-kit-check.yml:208`. All are one or two pinned packages, so the saving is negligible.
- **N14: skill-doc-frontmatter filter gap.** Its filters (`skill-doc-frontmatter.yml:5-23`) omit its own guard, `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh` (`:34`), and the workflow file. A change to either does not run the gate.
- **N15: failure recency changes the flakiness work.** The 10 newest diagram-corpus runs read success then nine failures (newest first), so the newest run passed. skill-advisor-stress's newest three passed. deep-loop-runtime has 1 failure in its last 10. Phase 008's real-failure work starts with a re-check, not an assumption that they are still red.
- **N16: timeouts must be sized on job time.** Run-level wall includes queueing (see P0-1).
- **N17: the main tip loses its statuses after rec 1.** Under option B the bot commit carries only the rebuild workflow's skipped row; under option A, no runs at all. Any tool that reads statuses on main's HEAD, including the planned `/doctor:ci report`, must resolve the newest non-rebuild SHA. Inferred risk; I found no current consumer.
- **N18: Node version split.** `setup-node` uses 20 on 13 lines and 22 on 22 lines, so any cache key must include the Node major (supports the review's ABI note).

## Final recommendation list (R-ids)

Savings are runner-min/day. "Standalone" means measured on today's volume. "After R1" means on the volume left once R1 lands.

### R1 (P0): stop the CI fan-out on trigger-index rebuild commits

- Covers original rec 1, P1-1, P1-3, P1-4, P1-5, P2-4 and P2-5.
- Change, option A (recommended, decision D1):
  - Append `[skip ci]` to the body line of the rebuild commit (`trigger-index-rebuild.yml:148-150`), keeping `Trigger-Index-Rebuild: ci` as the final line so the loop guard at `:33` still matches.
  - Update the README rebuild row (`README.md:58`) and the push/PR row (`:75`).
- Change, option B:
  - Add a `push:`-only `paths-ignore:` to the 9 unfiltered workflows, and `!` negations after the positive entries on the 4 path-filtered ones. That is 8 entries each (4 `.skilled/` paths and 4 inert `.opencode/` twins), 104 in total.
  - Amend `playbook-operator-contract.yml:3-5`, `README.md:64-75` (the gate-inputs row at `:68` becomes "push ignores generated index paths") and the 13 coverage rows.
  - Leave message-contract's `pull_request:` untouched.
- Acceptance check:
  - The next three rebuild SHAs on main show 0 workflow runs under A, or exactly 1 (the rebuild workflow) under B, by `gh run list --commit <sha>`.
  - Under B, `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
  - A 24 h run-data re-snapshot shows the push total down by about 2,000.
- Saving: ~2,073 standalone. Under option B with message-contract kept unfiltered, ~2,002.
- Risk: low under A; low-medium under B, which touches 13 files under the twin gate. Main HEAD statuses go empty (N17).
- Dependencies: D1.

### R2 (P1): assert the R1 skip and run that assertion when the workflow changes

- Covers P2-7 and N5.
- Change:
  - Under A, add a case to `trigger-index-rebuild-workflow.vitest.ts` asserting that the commit step's message contains the skip token and still ends with the trailer.
  - Add `.github/workflows/trigger-index-rebuild.yml` to both spec-kit-check filters (`spec-kit-check.yml:9,37`).
  - Under B, add the ignore assertion to `check-gate-inputs.sh` with a fixture in `.github/scripts/tests/check-gate-inputs.test.sh`.
- Acceptance check: removing the token, or one ignore entry, locally makes the test fail, and restoring it makes it pass. A PR touching only the rebuild workflow triggers spec-kit-check.
- Saving: 0. It protects R1.
- Risk: low.
- Dependencies: R1.

### R3 (P1): concurrency groups with cancel-in-progress on pull requests

- Covers original rec 4 and P1-6.
- Change:
  - Add `concurrency: group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` with `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` to every PR-triggered workflow.
  - Exclude trigger-index-rebuild (it keeps its own group, `:21-23`) and dependabot-auto-merge.
  - Main policy per D2.
- Acceptance check: two quick pushes to a test PR show the older run `cancelled`, and message-contract's required context reports on the newest head.
- Saving:
  - PR side: unmeasured; there are no PR runs in the window.
  - Main side, if D2 says cancel: 817 reclaimable wall-min per window standalone, ~89 after R1.
- Risk: low on PRs. On main it trades per-commit verdicts for speed.
- Dependencies: R1, for the baseline. D2.

### R4 (P2): real path filter on command-tree-parity

- Covers P1-9 and N8.
- Change:
  - Add `paths:` on both events: the command trees (`.skilled/commands/**`, `.opencode/commands/**`, `.claude/commands/**`), `.skilled/agents/**` plus its twin, `.skilled/skills/**/SKILL.md` plus its twin, `.hermes/**`, both checkers, the spec-kit shared package and lockfile (with twins) and the workflow file.
  - Rewrite the comment at `command-tree-parity.yml:46-50`.
  - Before writing the filter, read `sync-skills-hermes.cjs` and `sync-prompts-hermes.cjs` in full and confirm their inputs. The SKILL.md-only reading rests on `:61`.
- Acceptance check:
  - gate-inputs passes.
  - A test PR changing only a nested `SKILL.md` triggers both jobs; a specs-only PR triggers neither.
- Saving: ~265 standalone, ~123 after R1 (30 of 38 human pushes skip).
- Risk: medium; a missed input lets a stale Hermes copy land green.
- Dependencies: R1, D3.

### R5 (P3): optional path filter on changed-packet-validation

- Covers P1-9 (corrected).
- Change: `paths:` with `specs/**`, `.skilled/skills/system-spec-kit/**` plus its twin, and the workflow file.
- Acceptance check: gate-inputs passes, and a push touching only `.github/` skips the workflow.
- Saving: ~10 after R1.
- Risk: low.
- Dependencies: R1, D10. Recommended default: do not do it.

### R6 (P2): dispatch-enforcement-guard keeps the whole-tree vitest run and drops duplicate work

- Covers original rec 8 (dispatch half, corrected), P0-2 and N11.
- Change:
  - Do NOT narrow `hooks-vitest`.
  - Either merge the two jobs into one (node:test rule suite, then `npm --prefix .skilled ci` once, then the whole-tree vitest run, which already includes `dispatch-audit.test.mjs`), or keep two jobs and drop the duplicate explicit `dispatch-audit` step at `:46-50`.
  - Keep the fail-closed guard at `:31-35`.
  - Close the open question at `research.md:308`: seven vitest suites, two of them outside `dispatch/`.
- Acceptance check:
  - All seven vitest suites still appear in the run log.
  - Deleting `dispatch-rule-checks.test.mjs` on a test branch still fails the job.
- Saving: inferred ~1-2 billed min per run if merged, about 75-150 standalone and 39-78 after R1. Re-measure.
- Risk: medium. This is a protected guard (`research.md:187`), and its check names change.
- Dependencies: R1, D4.

### R7 (P2): remove the double suppression in report-only workflows

- Covers original rec 8 (advisory half), the strict-pass-freshness-report body rec and P2-6.
- Change:
  - In `advisory-checks.yml:38,52,68`, drop the inner `|| true` and `|| echo`. `continue-on-error: true` (`:27,41,55`) keeps the job green while a failing step shows as failed.
  - Make the same change in `strict-pass-freshness-report.yml:165,172`.
  - No narrow path filter on advisory-checks.
- Acceptance check: a deliberately broken input makes the step show failed while the job concludes success.
- Saving: 0. Restores the signal.
- Risk: low.
- Dependencies: none.

### R8 (P2): shallow checkout where history is unread

- Covers P1-8 and N9.
- Change:
  - Remove `fetch-depth: 0` from `rule-canary-sync.yml:15` and `repo-rules-corpus.yml:33`, after a full read confirms neither checker shells out to git.
  - Set `deep-loop-runtime.yml:42` to `fetch-depth: 2` only if its mode-event suites need nothing older than the parent (decision D7).
  - Keep depth 0 in message-contract, changed-packet-validation, naming-standard-guard, sk-doc-script-tests and skill-doc-frontmatter, and in comment-hygiene and agent-mirror-sync, which diff against the PR base.
- Acceptance check: each changed workflow passes on a test branch, and its checkout step drops by about 20 s.
- Saving: inferred ~39 after R1 (rule-canary-sync drops from 2 billed minutes to 1), plus about 20 s of wall per job.
- Risk: low.
- Dependencies: R1.

### R9 (P3): path filters on the PR-only review-time checks

- Covers original rec 8 (review half).
- Change: on `agent-mirror-sync.yml`, filter to the agent trees of every runtime (with twins). Leave comment-hygiene unfiltered, because it scans changed code files of any type. Filter prompt-card-sync only after its inputs are read.
- Acceptance check: gate-inputs passes, and a specs-only PR skips agent-mirror-sync.
- Saving: PR-only, unmeasured.
- Risk: low.
- Dependencies: none.

### R10 (P3): skill-doc-frontmatter filters name their own guard and workflow

- Covers N14 and replaces the rejected missed rec.
- Change: add `check-skill-doc-frontmatter.sh` (both roots) and `.github/workflows/skill-doc-frontmatter.yml` to both filter lists (`skill-doc-frontmatter.yml:5-23`).
- Acceptance check: gate-inputs passes, and a PR touching only the guard triggers the workflow.
- Saving: 0. Correctness.
- Risk: low.
- Dependencies: none.

### R11 (P3, probe): inventory CI jobs that duplicate pre-commit hooks

- Covers the open question at `research.md:309`.
- Change: list every pre-commit checker in `.skilled/hooks/git/pre-commit` against every workflow step. `README.md:71` already names prompt-card-sync alongside the two the synthesis found.
- Acceptance check: a written list, attached to the 003 packet, that names each duplicated checker and says to keep it (fork or `--no-verify` backstop) or drop it.
- Saving: unknown.
- Risk: none.
- Dependencies: none.

### R12 (P1): gate-inputs scans `.github/actions/**`

- Covers P1-7.
- Change: add `.github/actions/**/action.yml|action.yaml` to the scan loop in `check-gate-inputs.sh:481-484`, using the workflow parser, with a fixture case in `check-gate-inputs.test.sh`.
- Acceptance check: a fixture action naming only a `.skilled/` path fails with `filter-twins` or `parser-miss`, and the real tree still prints `RESULT: PASSED`.
- Saving: 0.
- Risk: low.
- Dependencies: none. Must land before R14.

### R13 (P1, probe): measure cache size, restore throughput and staleness

- Covers the open question at `research.md:307`.
- Change: a throwaway branch run saves and restores the provisioned trees and the npm download cache. Record the compressed size, restore seconds and the cold versus warm job times.
- Acceptance check: the numbers recorded, and a go/no-go against the 10 GB repo cache limit.
- Saving: 0.
- Risk: none.
- Dependencies: none. Gates R14.

### R14 (P1): composite setup action with cache, pinned bun setup and cold-path verification

- Covers original rec 2 and the cold-install body rec.
- Change:
  - `.github/actions/setup/action.yml` restores the cache, provisions, then saves.
  - Key on every lockfile glob plus the Node major (N18), with no `restore-keys`.
  - Keep `provision_worktree` running on a hit as the verification walk.
  - Add a weekly scheduled or dispatchable run that bypasses the cache to exercise the cold path.
  - Replace `npm install --no-save ... bun@1.3.9` (`hooks-node-tests.yml:60`, `opencode-dual-version.yml:101,184`) with a SHA-pinned bun setup.
  - Adopt the action in hooks-node-tests, opencode-plugin-tests and opencode-dual-version.
- Acceptance check:
  - gate-inputs passes with R12 in place.
  - A warm run shows the job down by about 40 s.
  - The cold-path run passes.
- Saving: ~145 standalone, ~74 after R1. UNVERIFIED until R13.
- Risk: medium. A stale cache could mask a broken cold install, which the cold-path run guards against.
- Dependencies: R12, R13, R1 (baseline).

### R15 (P2): merge hooks-node-tests into opencode-plugin-tests

- Covers original rec 5.
- Change:
  - One workflow, one job, one provision.
  - The trigger is the union of both path sets: hooks-node-tests adds `.hermes/**` and `.env.example` (`hooks-node-tests.yml:12-24`).
  - Carry over hooks-node-tests' rationale comment (`:3-10`) and `README.md:37`.
- Acceptance check: every node:test hook suite and the installer test still run in the merged job's log.
- Saving: 124 standalone, ~53 after R1, ~27 after R1 and R14.
- Risk: medium. The check name changes, but it is not required.
- Dependencies: R14, D5.

### R16 (P2): npm install dedupe in the multi-install workflows

- Covers the 20-40 component of phase 003.
- Change: route repeated `npm ci` calls within the 11 multi-install workflows through the composite action's cache. Start with routing-registry-drift (88 s install and build) and spec-kit-check (9 installs).
- Acceptance check: the job install-step seconds drop on a warm run, and all suites still pass.
- Saving: 20-40 standalone (`iteration-019.md:139`), smaller after R1. Re-measure.
- Risk: low-medium.
- Dependencies: R14.

### R17 (P3): pip cache, only through the composite action

- Covers the pip body rec and N13.
- Change: if R14 lands, add `cache: pip` through a pinned `setup-python` in the four pip workflows. Otherwise leave them as they are.
- Acceptance check: the pip step seconds drop.
- Saving: negligible.
- Risk: low.
- Dependencies: R14.

### R18 (P3, probe): partial or sparse checkout for light workflows

- Neither report covered this. A default-depth checkout is still about 50 s per job in the samples.
- Change: on one light workflow (rule-canary-sync), trial `filter: blob:none` or sparse checkout. Mind that `.opencode` is a tree of symlinks.
- Acceptance check: the checkout seconds before and after, and the suite passes.
- Saving: unknown.
- Risk: medium. gate-inputs and the citation walkers need the whole tree, so this is never for them.
- Dependencies: R8.

### R19 (P1, probe): spec-kit CLI tests under `fileParallelism: true`

- Covers the open question at `research.md:304`.
- Change: run the cli project locally with `fileParallelism: true` (the `.skilled/skills/system-spec-kit/vitest.config.ts:67` cli project) three times, and record failures and duration.
- Acceptance check: three green runs choose parallelism; any fixture collision chooses `--shard`.
- Saving: 0.
- Risk: none.
- Dependencies: none.

### R20 (P1): make spec-kit-check's CLI vitest project parallel, or shard it

- Covers original rec 3, P1-2, P2-1 and N3.
- Change: set `fileParallelism` to true for the cli project at `vitest.config.ts:67` with a stated reason. If R19 failed, use a two-way `--shard` inside the single job (`spec-kit-check.yml:124-128`).
- Acceptance check: the CLI vitest step drops from about 791 s to under 400 s on CI, and 5 consecutive green runs.
- Saving: ~460 standalone, ~138 after R1, plus about 525 s of wall on the slowest job.
- Risk: medium (fixture collisions).
- Dependencies: R19, R1 (baseline).

### R21 (P2): re-check and root-cause the real failures

- Covers the deep-loop-runtime, diagram-corpus and skill-advisor-stress body recs, plus the repo-rules-corpus item.
- Change:
  - Re-pull the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress (N15). For each workflow still failing, find the root cause and fix it. No retries (`research.md:113`).
  - Confirm that the single old failures in repo-rules-corpus (2026-09-18), chart-corpus, opencode-dual-version, routing-registry-drift and strict-pass-freshness-report are stale, and record them closed.
- Acceptance check: 10 consecutive green runs for each of the three workflows, or a filed root cause for each that stays red.
- Saving: signal, not minutes.
- Risk: medium.
- Dependencies: none.

### R22 (P2): sk-code-ci surface packet

- Covers original rec 10a.
- Change: create the read-only surface packet in the sk-code hub, with the full registration list from `research.md:228-235`. The rule data includes:
  - the twin rule, with the 8-entry form and inert `.opencode/` twins;
  - the rebuild-skip rule (D1's chosen form);
  - push-only scope for generated-path rules;
  - the timeout sizing rule (R24);
  - least privilege;
  - the concurrency template;
  - the composite action rule (R12 and R14);
  - the switch `if:` shape;
  - the protected set;
  - the scaffold templates.
- Acceptance check: the hub's parent-skill check, compiled-route test, canary fixture and `validate.sh --strict` on the packet all pass.
- Saving: 0.
- Risk: low.
- Dependencies: R1 and R14 landed, so it records real patterns. It can be drafted alongside.

### R23 (P3): record message-contract's every-branch push trigger as intentional

- Covers the message-contract body rec.
- Change: no YAML change. Add the rationale (`message-contract.yml:2-9`, `README.md:73`: branch names and commits are checked on every pushed branch) to sk-code-ci's rule data as a documented exception to the "push to main and skilled only" norm.
- Acceptance check: the exception appears in the R22 rule data, and `/doctor:ci report` does not flag it.
- Saving: 0.
- Risk: none.
- Dependencies: R22.

### R24 (P2): per-job timeouts sized on job execution samples

- Covers original rec 6, P0-1 and N16.
- Change:
  - Pull at least 40 runs of job-level timings per workflow (`gh run view --json jobs`).
  - Set `timeout-minutes` per job = max(10, ceil(3 x job p50 minutes), ceil(2 x job p100 minutes)) on the 27 workflows without one.
  - State the observed job p100 next to each value in the commit or packet.
- Acceptance check: no successful job in the sample exceeds 50% of its new timeout, and gate-inputs passes.
- Saving: caps a hang at minutes instead of 360.
- Risk: low.
- Dependencies: R22 (rule), and R6, R15 and R20, so the job shapes are final.

### R25 (P2): least-privilege permissions and the dependabot split

- Covers original rec 7.
- Change:
  - Add `permissions: contents: read` to the 12 workflows that declare none.
  - Split `dependabot-auto-merge.yml` into a read-only job that runs `dependabot/fetch-metadata` (`:22`) and a write-scoped merge job. The write scopes are now at `:10-12`.
- Acceptance check: every workflow declares permissions (grep count 33 of 33), and a Dependabot test PR still auto-merges.
- Saving: 0. Security.
- Risk: low.
- Dependencies: R22.

### R26 (P2): CI on/off switches

- Covers original rec 9.
- Change:
  - Add `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_<GROUP> != 'off'` on every job except dependabot-auto-merge, ANDed onto any existing `if:` (for example `trigger-index-rebuild.yml:33`, `skill-doc-frontmatter.yml:52`).
  - Add a README section listing the variable names and stating that `off` is the only disable token.
- Acceptance check:
  - With `SKILLED_CI_REPORTS=off` set on a fork or test repo, the report jobs show skipped/success.
  - Unset, everything runs.
  - message-contract is never switchable off while its context is required (`research.md:189`).
- Saving: 0 for this repo.
- Risk: low.
- Dependencies: R22, and every job rewrite (R6, R14, R15, R20).

### R27 (P3): job consolidation decision gate

- Covers the consolidation item at `research.md:259-261`.
- Change: re-measure the always-run workflows after R1, R4, R6, R8, R14 and R15, then decide whether to merge any of them into one switch group.
- Acceptance check: a decision record with the before and after numbers.
- Saving: upper bound 1,241-1,606 at today's volume; far less after R1 (inferred, since most of the bound is checkout and rounding on rebuild commits).
- Risk: high if merged; per-check signal is lost.
- Dependencies: phases 002 to 007. D8.

### R28 (P2, probe): can the owner's token write repository variables?

- Covers the open question at `research.md:305`.
- Change: with operator approval, `gh variable set SKILLED_CI_PROBE --body x`, then `gh variable delete SKILLED_CI_PROBE`, and read the state back. This changes repository settings, so it is a stop-for-yes step.
- Acceptance check: the exit codes and the read-back recorded.
- Saving: 0.
- Risk: low.
- Dependencies: none. Gates R29's toggle.

### R29 (P2): `/doctor:ci` command

- Covers original rec 10b.
- Change:
  - `.skilled/commands/doctor/ci.md` with a read-only `report` route and a confirmed, mutating `scaffold` route; toggle as a third route or as printed commands, per R28.
  - `_routes.yaml` registration, advisor bridges, and a `/doctor:setup` row.
  - The report resolves the newest non-rebuild SHA (N17).
- Acceptance check: `route-validate.sh` (K1), the bridge deriver and `doctor-phrase-reach.cjs` pass, and report output lists all 33 workflows with switch state.
- Saving: 0.
- Risk: medium.
- Dependencies: R22, R26 (variable names), R28.

### R30 (P3): fifth stack-detection surface value for workflow diffs

- Covers the stack-detection body rec.
- Change: add the CI surface to `.skilled/skills/sk-code/shared/references/stack-detection.md:37` and to sk-code-review's surface selection (`sk-code-review/SKILL.md:234`), with regression tests for the three existing surfaces.
- Acceptance check: a `.github/workflows` diff reviews with sk-code-ci loaded, and the existing surface fixtures are unchanged.
- Saving: 0.
- Risk: medium (detection regression).
- Dependencies: R22. It goes last.

## Phase plan

Each R-id maps to exactly one phase. The ordering fixes from the brief are applied:

- Slow tests depend on 002, not on caching.
- The paths-ignore standard conflict is resolved by D1 option A, or by amended rule 2.
- The gate-inputs scan (R12) precedes the composite action (R14) inside phase 004.

### Phase 002: Rebuild fan-out removal

- R-ids: R1, R2.
- Depends on: D1 only.
- Acceptance gate:
  - Three consecutive rebuild SHAs show 0 runs (A) or 1 run (B).
  - gate-inputs `RESULT: PASSED`.
  - spec-kit-check green.
  - A fresh 24 h run-data snapshot recorded as the new baseline for every later phase.

### Phase 003: Trigger and job hygiene

- R-ids: R3, R4, R5, R6, R7, R8, R9, R10, R11.
- Depends on: 002 (baseline). D2, D3, D4, D7 and D10 decided first.
- Acceptance gate:
  - gate-inputs passes.
  - Every newly filtered workflow has one recorded positive and one negative trigger probe.
  - All seven hooks vitest suites still run.
  - The README push/PR table matches the YAML.

### Phase 004: Setup, caching and provisioning

- R-ids: R12, R13, R14, R15, R16, R17, R18. Internal order: R12, R13, R14, then R15 and R16, then R17 and R18.
- Depends on: 002.
- Acceptance gate:
  - gate-inputs, with the actions scan, passes.
  - The cold-path run passes.
  - Warm-run job seconds recorded against the 002 baseline.

### Phase 005: Slow and failing tests

- R-ids: R19, R20, R21.
- Depends on: 002 (baseline only). It can run in parallel with 003 and 004.
- Acceptance gate:
  - The spec-kit CLI step is under 400 s with 5 green runs.
  - deep-loop-runtime, diagram-corpus and skill-advisor-stress have 10 green runs each, or a filed root cause each.

### Phase 006: sk-code-ci standards surface

- R-ids: R22, R23.
- Depends on: 002 and 004 for the final pattern content. It may be drafted from the start.
- Acceptance gate: hub parent-skill check, compiled-route test and canary pass, and the packet passes `validate.sh --strict` with `RESULT: PASSED`.

### Phase 007: Workflow hygiene and the on/off control

- R-ids: R24, R25, R26.
- Depends on: 003, 004, 005 (final job shapes) and 006 (rules).
- Acceptance gate:
  - The grep shows 33 of 33 with permissions, and every job with a timeout or a documented exemption.
  - The switch probe on a test repo behaves as specified.
  - gate-inputs passes.

### Phase 008: Job consolidation decision gate

- R-ids: R27.
- Depends on: 002 through 007.
- Acceptance gate: a decision record with re-measured numbers, and a merge carried out only if the operator approves D8.

### Phase 009: `/doctor:ci` and review wiring

- R-ids: R28, R29, R30. Internal order: R28, then R29, then R30.
- Depends on: 006, and 007 for the variable names.
- Acceptance gate:
  - `route-validate.sh`, the bridge deriver and `doctor-phrase-reach.cjs` pass.
  - The stack-detection regression tests are green.
  - The packet passes `validate.sh --strict` with `RESULT: PASSED`.

## Open decisions for the operator

- **D1 (gates phase 002): how rebuild commits skip CI.**
  - Option A: a `[skip ci]` token in the commit body. One line; no twin entries; no new YAML pattern.
  - Option B: push-only `paths-ignore` and `!` negations, 104 twin-matched entries across 13 files, plus amended ordering rule 2.
  - Recommendation: A. It is documented by GitHub but not exercised here, and R1's acceptance check proves it on the first three rebuilds.
- **D2: cancel-in-progress on main.** After R1 it reclaims about 89 wall-min per window (23 pairs) and costs per-commit verdicts. Recommendation: PRs only.
- **D3: command-tree-parity path filter.** The workflow comment (`command-tree-parity.yml:46-50`) says it is unfiltered on purpose. Approve R4 (about 123/day after R1) or keep it as it is.
- **D4: dispatch-enforcement-guard shape.** Merge its two jobs, or only drop the duplicate dispatch-audit step. It is a protected guard, and check names change if merged.
- **D5: the hooks-node-tests merge (R15) renames a check.** Not required, but the README and any bookmarks change.
- **D6: timeout floor.** 10 minutes is proposed for R24. A lower floor tightens hang detection and raises the false-kill risk.
- **D7: deep-loop-runtime `fetch-depth: 2`.** Proceed only if its suites need only the parent commit (`deep-loop-runtime.yml:38-39`).
- **D8: job consolidation after re-measurement** (phase 008).
- **D9: `/doctor:ci` toggle writes variables or prints the command.** Decided by the R28 probe, which itself needs a yes because it changes repository settings.
- **D10: changed-packet-validation filter (R5).** About 10/day. Recommended default: skip it.
- Closed by this review, needing no decision:
  - The message-contract required-context question: the bypass actor is confirmed, and the ruleset applies only to `~DEFAULT_BRANCH`.
  - The hooks vitest include globs: seven suites, two of them outside `dispatch/`.
