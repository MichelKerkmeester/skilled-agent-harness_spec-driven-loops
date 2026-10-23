---

**VERDICT: PASS WITH FIXES**

The synthesis is directionally sound and most load-bearing numbers reproduce. Two recommendations are unsafe as written (P0), and several figures that drive the phase plan are overstated or misattributed (P1). The ranked order survives; the savings column and phase 002's implementation notes do not.

---

## FINDINGS (most severe first)

**P0-1 — Recommendation 6's "3x the median" timeout would fail runs that succeeded.**
Claim: "Add `timeout-minutes` to the 27 workflows without one, sized at about 3x the median" (research.md:252), justified by "where timeouts exist they are 4 to 12 times the median, which is the right failure mode to keep" (research.md:115).
Checked: every workflow's 40-run sample in `scratch/ci-run-data/per-workflow/*.json`, `startedAt`→`updatedAt` (queue excluded), against the six existing timeouts in `.github/workflows/`.
Actually true: the existing timeouts are 4–12x median precisely because 3x is too tight. Recorded **successful** runs exceed 3x median in at least seven workflows that have no timeout today: `markdown-link-integrity` 603 s vs a 210 s cap (`.github/workflows/markdown-link-integrity.yml:17-27`, no timeout), `skill-doc-frontmatter` 2,257 s vs 177 s, `prompt-card-sync` 285 s vs 174 s, `sk-code-script-tests` 435 s vs 321 s, `agent-mirror-sync` 340 s vs 282 s, `naming-standard-guard` 330 s vs 276 s, `chart-corpus` 321 s vs 312 s. Every one of those maxima concluded `success`. Implementing the rule literally turns main red on a slow-but-fine run.
Fix: size at `max(3x median, 2x observed p100)` per **job**, not per workflow, and state the observed maximum next to each proposed value. A 3x-median rule is only safe for the 20 workflows whose p100/median is under 2.1.

**P0-2 — Recommendation 8's narrowing silently deletes two test suites that no other job runs.**
Claim: "Narrow dispatch-enforcement-guard's vitest run to the dispatch suites" (research.md:254), with the include globs left as an open question (research.md:308).
Checked: `.skilled/hooks/vitest.config.ts:38` (`include: [hooks/**/*.{test,spec}.?(c|m)[jt]s?(x)]`), the seven vitest suites under `.skilled/hooks/`, and every workflow.
Actually true: `.github/workflows/dispatch-enforcement-guard.yml:66-67` is the **only** consumer of that config, and the workflow's own comment (lines 60-65) says the whole-tree run exists because those suites "ran in no job". Narrowing to `dispatch/**` keeps five suites and drops `.skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.test.ts:9` and `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:6` — both vitest (so excluded from the `node:test` runner), neither named in any workflow or `.github/scripts/`. The recommendation would recreate exactly the coverage hole the job was created to close.
Fix: close the open question with the actual glob, and scope the narrowing to "dispatch suites **plus** classifier-injection-screen and session-relaunch", or drop rec 8's narrowing and keep only its path-filter half. The saving is also smaller than implied: the `hooks-vitest` job is 69 s median (`summary.md`, median job seconds), so the ceiling is ~84 runner-min/day, not "tens" per workflow.

**P1-1 — Recommendation 1's edit is 8 entries per filter, not 4, or gate-inputs fails the PR that implements it.**
Claim: "ignore the four generated paths on the 13 downstream workflows" and "(9 `paths-ignore:`, 4 `!` negations)" (research.md:40, 90-93, 247).
Checked: `.github/scripts/check-gate-inputs.sh:107-121` (twin matching), `:336` (`twin-one` → `fail filter-twins`), `:369-372` (`paths-ignore` is parsed by the same rule), `:481-484` (scan loop). Ran the checker on the current tree: `files=45 … twin_pairs=311 failures=0 RESULT: PASSED`.
Actually true: every filter entry naming one source root must name the other **in the same filter group**, textually, whether or not the twin exists. `.github/workflows/repo-rules-corpus.yml:9-10` states the rule outright: "No .opencode/repo-rules tree exists; the gate-input check requires every source-root filter to name both roots, so this twin is required and inert." `.opencode` is a tree of tracked symlinks (`git ls-files -s .opencode` shows mode `120000` entries), so the `.opencode/...` twins are inert in GitHub's matcher but mandatory for the gate. A four-entry ignore list fails gate-inputs on the first push — and gate-inputs is itself one of the 13 workflows being edited.
Fix: specify 8 entries per workflow (4 `.skilled/` + 4 inert `.opencode/` twins), 104 entries total, and name gate-inputs' `filter-twins` as the acceptance test for phase 002. Effort is still low, but it is not "13 small edits" (research.md:272).

**P1-2 — Recommendations 2, 3 and 5 double-count the run volume that recommendation 1 removes.**
Claim: rec 3 "~9 runner-min per run (~450/day)" (research.md:249), rec 2 "~145 runner-min/day" (research.md:248), rec 5 "62 runner-min/day (124 standalone)" (research.md:251); phase 003 "~227-247 runner-min/day" and phase 008 "~450 runner-min/day" (research.md:273, 278).
Checked: rebuild attribution per workflow from `runs-last-1000.json` — `spec-kit-check` 50 runs/day of which 35 are rebuild SHAs (70%); `hooks-node-tests` 61 runs of which 35 (57%); `opencode-plugin-tests` 61 of which 35 (57%).
Actually true: rec 1 removes those runs. After it, spec-kit-check runs ~25/day, so rec 3's saving is ~225/day, not ~450. Rec 2's 145/day and rec 5's 62/day are measured on workflows that lose 57% of their runs to rec 1, so they shrink to roughly 60-70 and ~27. The synthesis explicitly flags non-additivity for the cache/merge pair (research.md:76) and for consolidation (research.md:260), but not for this, which is the largest overlap in the document.
Fix: recompute recs 2/3/5 on the post-002 run volume, or state each saving twice ("standalone" and "after 002"). Phase 008's expected saving should read ~225/day, and its ranking against rec 4 changes.

**P1-3 — "36 of 73" and "14 to 17 runs per rebuild SHA" are not in the dataset.**
Claim: "Of 73 distinct push SHAs on main in the window, 36 are … rebuild commits. Each of them re-runs … (14 to 17 workflow runs per rebuild SHA)" (research.md:35), restated as independently re-checked at research.md:324.
Checked: `runs-last-1000.json` grouped by `headSha`: 985 push-main runs, 73 distinct SHAs, **35** rebuild SHAs, 38 human; every rebuild SHA has **exactly 14** runs (min = max = 14), 490 runs total, 14 distinct workflow names.
Actually true: 35 of 73, and exactly 14 runs each — 13 downstream plus the rebuild itself. The cited source agrees with the dataset, not with the synthesis: `iterations/iteration-019.md:27` says "the 35 rebuild SHAs in the 73-SHA window". The addendum's "one-commit window-edge difference" (research.md:324) is not visible in the committed data; the earliest SHA in the file is a full 14-run SHA at the window boundary, so nothing was truncated.
Fix: 35 of 73, "exactly 14 runs each". The saving is unaffected (2,030 vs 2,073, see P1-4).

**P1-4 — "No downstream job reads the committed index content" is false, and it is the justification for 895 of the 2,073 minutes.**
Claim: research.md:35 and research.md:63-66 (via iteration-019 F19-2).
Checked: `.github/workflows/advisory-checks.yml:58-66`, where the "Trigger index freshness" step runs `generate-trigger-index.mjs --check` against the committed index, and the step's own comment says "this compares the committed index with the corpus it should describe".
Actually true: advisory-checks reads it. The synthesis contradicts itself nine lines later: "Its index-freshness step races the rebuild workflow that repairs the same file" (research.md:122). The narrower claim that survives is that **spec-kit-check** does not load the committed index — I confirmed the only spec-kit test naming the path generates into `out/` (`.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:82`) and the rebuild-workflow test reads the YAML, not the file (`.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:35,57`).
Fix: say advisory-checks is the one reader, and either keep it unfiltered (costing 35 min/day of the 2,030) or state that the rebuild job's byte-for-byte re-generation (`.github/workflows/trigger-index-rebuild.yml:89-105`) supersedes it.

**P1-5 — The message-contract open question is already answered in the workflow; the real hazard is the one nobody named.**
Claim: "the rebuild commit must still satisfy that one context, or message-contract keeps running on it" (research.md:94); "Phase 002 decides" between keeping it unfiltered or verifying the message (research.md:306); phase 002 lists "handle message-contract's required context first" as a prerequisite (research.md:247, 272).
Checked: `.github/workflows/trigger-index-rebuild.yml:271-274` and `:310`; ruleset `message-contract-required` via `gh api` (one required context, `bypass_actors: RepositoryRole id 5, bypass_mode: always`).
Actually true: the push step uses `secrets.TRIGGER_INDEX_PUSH_TOKEN`, documented as "a fine-grained token owned by a ruleset bypass actor", and the failure message repeats it. The rebuild push therefore bypasses the required check today, so filtering message-contract cannot endanger the rebuild. The genuine hazard is the reverse case: a PR that changes **only** the four generated files would leave the required context absent and deadlock the merge, because a path-filtered workflow never reports it (the same mechanism research.md:164 relies on).
Fix: state the bypass fact, delete the open question, and keep message-contract unfiltered on PRs — or accept and document the generated-only-PR deadlock. Either way, phase 002 loses a prerequisite, and the 71 min/day stays booked only if you filter message-contract's push event while leaving its `pull_request` event intact, which `paths-ignore` under `push:` alone already does.

**P1-6 — Recommendation 4's saving is attributed to the wrong half of the trigger set, and 534 is the wrong interval.**
Claim: "Up to 534 wall-min/day of superseded work, part of it on PRs" (research.md:250), from "206 push runs … about 534 wall-minutes of exposure" (research.md:102).
Checked: reproduced the pairing from `runs-last-1000.json` (same workflow, same branch, older run still in flight when a newer SHA started). I get **206 pairs exactly**, with the per-workflow counts matching `iteration-006.md:39` line for line (Spec-Kit 29, sk-doc 38, Rebuild 29, Hook 28, OpenCode 16, CPV 12, Gate 9, Rule Canary 9).
Actually true: all 206 are `push` events on main — the filter is `event === "push"`, and the window contains 985 push-main runs against 15 non-push runs. **None of the 534 is on PRs.** And the interval measured is the time each older run had already spent *before* supersession (550 min by my recomputation), which `cancel-in-progress` cannot recover; the reclaimable amount is the time from the newer run's start to the older run's end — **818 min**. So the figure is both mis-attributed and mis-defined, and it is labelled an upper bound (research.md:102) when it is a lower one.
Fix: "206 superseded push-to-main runs, 818 reclaimable wall-minutes; PR exposure unmeasured because the window has no PR sample." Rec 4's PR half then rests on policy, not measurement, which the synthesis already half-admits at research.md:104.

**P1-7 — The composite action (rec 2) moves path references out of the only machine-enforced rule's scan surface.**
Claim: rec 2 puts install/provision commands in `.github/actions/…/action.yml` (research.md:248, iteration-012 F4), while research.md:216 says `.skilled/`/`.opencode/` parity is "gate-inputs.yml, the only machine-enforced workflow rule".
Checked: `.github/scripts/check-gate-inputs.sh:481-484` loops `.github/workflows/*.yml` only; `:486-490` adds `.github/dependabot.yml`; nothing reads `.github/actions/**` (grep for `github/actions` and `action.yml` returns nothing).
Actually true: after rec 2, the `npm --prefix .skilled/...` / `.opencode/...` pairs live in a file no gate reads. The invariant does not break — it stops being checked. Iteration-012's action snippet also lists only `.skilled/...` cache paths, which would fail the twin rule the day anyone extends the gate.
Fix: add `.github/actions/**/action.yml` to `check-gate-inputs.sh`'s scan loop as part of phase 003 (or 004's rule set), before the action lands.

**P1-8 — The second-largest fixed cost is identified and then dropped.**
Claim: "Checkout is the larger fixed cost … Shallow checkout where history is not read is the lever caching cannot buy" (research.md:85), "10 workflows request full history" (research.md:85).
Checked: `fetch-depth: 0` in 10 workflows (agent-mirror-sync:13, changed-packet-validation:19, comment-hygiene:13, deep-loop-runtime:42, message-contract:23, naming-standard-guard:20, repo-rules-corpus:33, rule-canary-sync:15, sk-doc-script-tests:82, skill-doc-frontmatter:58); checkout share measured from the 165 sampled run files: 10,775 s of 40,521 job-seconds = **26.6%**, and checkout+install = **36.5%** (reproducing research.md:36's 36%).
Actually true: the lever is real and no recommendation and no phase owns it. Rec 2 explicitly says it cannot buy it (research.md:85), and the phase table has no row for it.
Fix: add it to phase 003 with the per-workflow "does anything read history" check. Several do need it (`message-contract` uses `git cat-file`/`rev-list`, `changed-packet-validation` and `sk-doc-script-tests` use a merge base, `skill-doc-frontmatter`'s `doc-version-raise` needs a base), but `deep-loop-runtime`, `repo-rules-corpus`, `rule-canary-sync`, `comment-hygiene` and `agent-mirror-sync` do not appear to.

**P1-9 — The nine always-run workflows are never asked whether they need to run on every human push.**
Claim: rec 1 removes the 13 downstream workflows from rebuild commits only; the consolidation analysis (research.md:259-261) only considers merging them into one job.
Checked: `changed-packet-validation.yml:3-5` (no `paths:`, job named "Spec packets touched by this PR validate clean", `summary.md` 149 min/day) and `command-tree-parity.yml:3-9` (no `paths:`, checks command trees and Hermes copies, 299 min/day). Both run on every push to main.
Actually true: these two have narrow, statable inputs and a real push `paths:` filter would remove them from nearly every human push — not just rebuild commits. Combined 448 min/day, of which rec 1 only takes the rebuild half (~245). `sk-doc-script-tests`, `playbook-operator-contract` and `gate-inputs` genuinely cannot be narrowly filtered (whole-tree citation walk, documented cross-tree contract, documented move guard), so the opportunity is specific, not general.
Fix: add "path-filter the always-run workflows that have narrow inputs" as a recommendation, with `changed-packet-validation` → `specs/**` and `command-tree-parity` → commands/agents/Hermes as the two named cases. This is cheaper than rec 3 and larger after rec 1.

**P2-1 — `fileParallelism` is 10 sites in 5 files, not 7, and the citation points at the wrong root.**
research.md:116 and :326 say seven sites. Measured: 5 occurrences per source root (`.skilled/skills/system-spec-kit/vitest.config.ts:50,67`, `runtime/vitest.config.ts:38`, `system-deep-loop/runtime/vitest.config.ts:20`, `system-skill-advisor/runtime/vitest.config.ts:39`) and the same five in `.opencode/` = 10. Rec 3 cites `.skilled/skills/system-spec-kit/vitest.config.ts:67` (research.md:37, 249) but CI runs `--config ../../vitest.config.ts` from `.opencode/skills/system-spec-kit/runtime/cli` (`.github/workflows/spec-kit-check.yml:124-128`), i.e. the `.opencode/` copy. The behaviour is identical because they mirror; the citation is not.

**P2-2 — Phase 003's 227-247 is unexplained.** Rec 2 (145) + rec 5 (62) = 207. The extra 20-40 is presumably the npm dedupe across multi-install workflows, but no line says so (research.md:273).

**P2-3 — Phase 008's dependency is misattributed.** It depends on "003 (stable baseline)" (research.md:278), but 003 is caching and does not change spec-kit-check's run count. Phase **002** does — it halves it. As written, phase 008 would measure its baseline after 003 and then discover 002 changed it.

**P2-4 — Phase 002 breaks the synthesis's own ordering rule 2.** "A phase that introduces a new YAML pattern waits for the standard that governs it" (research.md:267). `paths-ignore` appears nowhere in the repo today (grep: zero hits outside `check-gate-inputs.sh`'s parser), and sk-code-ci is the standard that "carries the rebuild-path ignore rule" (research.md:226) — yet 002 runs before 004.

**P2-5 — Phase 002 needs two README amendments, not just the playbook comment.** `.github/workflows/README.md:68` says `gate-inputs.yml` is "yes, no path filter" on both events; after 002 that is false. The 13 rows in the push/PR coverage table (README.md:62-80) also change from "yes" to "yes, path-filtered". research.md:95 only names the playbook comment.

**P2-6 — advisory-checks is in both rec 1 and rec 8 with no filter list.** Rec 1 ignores four generated paths on it (research.md:91); rec 8 path-filters it (research.md:254). No filter set is given for the second, and its only unique value is the corpus-wide freshness walk, which a narrow filter would stop running.

**P2-7 — The "ignore-assertion test" has no host.** research.md:247 says "ship a test that asserts the ignore". If it lands in spec-kit-check, it will not run when someone edits a different workflow's `on:` block, because spec-kit-check triggers only on its own workflow file plus spec-kit paths (`.github/workflows/spec-kit-check.yml:4-6`). The natural host is `check-gate-inputs.sh`, which already parses path filters and runs unfiltered (`.github/workflows/gate-inputs.yml:2-4`).

**P2-8 — Minor citation and count nits.** `parent-skill-check.cjs:682` is the `checkSurfaceMode` function header; the Write/Edit ban is asserted about eight lines later. "25 of 230 sampled jobs" (research.md:64) vs 219 non-skipped jobs across 165 run files (1,937 steps) in `scratch/ci-run-data/jobs/`. "21 declare one" (research.md:134) counts `permissions: {}` in trigger-index-rebuild.yml:12 as a declaration.

---

## RECOMMENDATIONS 1–10

1. **Overstated / incomplete.** Magnitude holds (2,030 by the dataset's own medians, 53% of 3,812, not 2,073/54%), but 35 of 73 not 36, exactly 14 runs not 14–17, and the edit is 8 entries per filter or gate-inputs fails it.
2. **Supported in direction, size UNVERIFIED.** The synthesis says so itself (research.md:86). The 145/day will not survive rec 1 (~60-70), and the Node-version/ABI assumption is hidden in the key literal (`node22`) while 13 workflows run Node 20.
3. **Overstated.** ~450/day is ~225 after rec 1. The wall-clock half (~525 s off a 1,215 s job) is confirmed from run 39909844384 (CLI vitest step 791 s).
4. **Wrong attribution.** 206/534 are all push-to-main; no PR exposure exists in the window. Reclaimable wall is 818 min, not 534.
5. **Supported in shape, overstated in size.** Identical trigger sets confirmed (61 runs each, same 40 SHAs); 62/day becomes ~27 after rec 1.
6. **Wrong as specified.** 3x median clips successful runs in 7+ workflows. Resize per job at 2x observed p100.
7. **Supported.** 21/33 declare permissions, the 12 without are all read-only, and dependabot-auto-merge holds `contents: write` + `pull-requests: write` around a third-party action (`.github/workflows/dependabot-auto-merge.yml:10-12,24-27`).
8. **Unsafe as specified.** The narrowing drops classifier-injection-screen and session-relaunch, which run nowhere else; ceiling ~84 min/day.
9. **Supported.** `vars.*` unset → empty → not `'off'`, job-level skip reports Success, one required context. Note "32 workflows" means every job in each multi-job workflow.
10. **Supported at the contract level.** Registry contract and the read-only surface check hold; citation nits only (P2-8).

---

## MISSED RECOMMENDATIONS

- **Real path filters on the two filterable always-run workflows.** `changed-packet-validation.yml:3-5` (149 min/day) and `command-tree-parity.yml:3-9` (299 min/day) run on every push with no filter despite narrow inputs. Rec 1 only removes their rebuild-commit runs.
- **`fetch-depth: 0` reduction.** 10 workflows request full history; checkout is 26.6% of job seconds and 36.5% with install. Identified at research.md:85, owned by no recommendation and no phase.
- **`skill-doc-frontmatter`'s push filter is narrower than its PR filter.** `.github/workflows/skill-doc-frontmatter.yml:15-21` omits the `'.opencode/skills/**/*.md'` / `'.skilled/skills/**/*.md'` patterns that lines 5-12 have, so a direct release-line push that changes only skill Markdown never runs the coverage job. The `doc-version-raise` job is PR-only by design (line 50), but the coverage job is not, and the repo's documented flow pushes release lines directly (`.github/workflows/README.md:62-63`).
- **Extend gate-inputs to `.github/actions/**`** before the composite action lands, so rec 2 does not create an unread home for single-root paths.
- **`repo-rules-corpus` is absent from phase 008.** `summary.md` records 2 failures in 19 push runs (~10%), which is a higher rate than `opencode-dual-version`, `routing-registry-drift` or `chart-corpus`, all of which the flakiness section ignores too.

**UNVERIFIED:** whether GitHub actually leaves a required check absent (rather than neutral) for a generated-files-only PR — documented behaviour, not exercised here; whether `message-contract-required` carries branch `conditions` limiting it to main (the ruleset payload returned no `conditions`); the exact 2,073 composition — my reconstruction from the summary's rounded medians gives 2,030, and the 43-minute gap cannot be pinned without iteration 019's per-run samples.
