# Alignment run triage

Source: the `/local-skilled-alignment` run at `~/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/` (branch target, base `origin/main`, lanes `vibe-deepseek`, head `bd474396742`). It reported 40 findings: 2 P0, 19 P1 and 19 P2. Each finding is a hypothesis until a command here confirms it.

Operator decisions taken 2026-11-23 (AskUserQuestion):
- Release notes: "Were not releasing yet". The root release notes `v4.2.0.0.md` stay untouched, and origin/main is not merged into the branch.
- Routing: fix the hub routing vocabulary now, reopening phase 008 (D-02, D-03, D-05 and the probe misses).
- CI: add a workflow for the bots runtime tests, file and README rows approved through `/doctor:ci scaffold`.

## Duplicate groups

- Template: A-1, BAT-01, BAT-05 and CR-06 are one defect. The BOT.md template under `assets/` is machine-parsed, so doc frontmatter would break the parser and the doc validator wants an overview section.
- Skill graph: BAT-04 and D-01 are one defect, the compiled `skill-graph.json` missing the bots hub.
- BAT-02 is C-06. BAT-03 is C-01 plus the root README mode ids.

## Dispositions

| Finding | Severity | Verification | Disposition and evidence |
|---|---|---|---|
| A-1, BAT-01, BAT-05, CR-06 | P0 | `check-skill-doc-frontmatter.sh . --coverage` FAIL on `assets/bot-template.md` | Fixed. Renamed to `assets/bot-template.txt` (a `.txt` asset has precedent in `cli-orca/assets/computer-use.txt`) and updated every reference. Coverage now `violations=0`. Vitest 35 files / 372 tests and typecheck exit 0 after the rename |
| BAT-04, D-01 | P0 | `skill-graph-freshness.cjs --strict` exit 1, system-skilled-bots missing from the compiled graph | Fixed by regenerating `skill-graph.json` after the routing change. Evidence in the routing section below |
| C-02 | P1 | Manifest exists and the hub is in `DEFAULT_ON_HUBS`: confirmed | Fixed. Upgrade text now says the compiled router serves the hub and names the reinstall step for jobs installed before the state-root pin |
| B-02 | P1 | Zero playbook mentions of the post-commit leg: confirmed | Fixed. Added BOT-025 `request-queue/commit-enqueues-request.md`; its commands were dry-run end to end (one request keyed on the sha, none for the run marker or the off switch, no record). Playbook package validator PASS, 25 scenarios, 0 warnings |
| B-03 | P2 | Section 15 had no index: confirmed | Fixed. Section 15 now maps all 25 scenarios to their catalog entry and names the five entries with only vitest coverage |
| C-06, BAT-02 | P2 | `check_readme_references.py` unresolved `assets/bot-template.md`: confirmed | Fixed to `../assets/bot-template.txt`. Checker PASS |
| D-06 | P2 | `bots/status.md:21` says `--rebuild` is never run from the command: confirmed | Fixed in `.skilled/commands/README.txt` |
| D-07 | P2 | Partly refuted: `drain` is a reserved bot id (`installer.ts:83`, `:424`), so the sentence was true but read as a mistake | Reworded in the presentation and both workflow YAMLs to name the bot and the reserved `drain` id |
| A-2 | P2 | `secrets` is parsed and never enforced: confirmed. 001 T008 specified it as declared posture only | Template comment now says the value is recorded, not enforced. Enforcement recorded as a follow-up |
| C-03, C-04 | P1, P2 | Root README said 44 commands in six groups and 17 doctor commands: confirmed | Fixed. 49 commands in seven groups, a Bots group, 18 doctor commands and a `/doctor:bots` row. README reference check PASS |
| BAT-03 | P2 | Release coverage wants the hub and four mode ids in the release notes and root README | README half fixed: the four mode ids are named. Release-notes half left open by operator decision (not releasing yet) |
| C-01, CR-01 | P1 | `v4.2.0.0.md` names no bots feature, and line 300 still says OpenCode refuses read-only: confirmed | Not fixed, operator decision. Open for the release that ships this branch |
| C-05 | P2 | 16 skill folders with a SKILL.md: confirmed | Fixed counts in `.skilled/skills/README.txt` lines 3, 24 and 31 |
| C-07 | P2 | Kill switch missing from the three env documents: confirmed | Fixed in `.env.example`, `hook-flags.env.example` and `ENV-REFERENCE.md`. `env-reference-drift.vitest.ts` 5/5 |
| ENV-01 | P2 | Refuted as an operator setting: `SKILLED_BOT_RUN_ID` is set by the runner on the child (`dispatch.ts:341`) and is not operator-settable | Recorded, no `.env.example` row, so no operator sets the marker by hand |
| CR-02, CR-03, CR-04 | P1, P2 | Six docs still described the cli-opencode read-only refusal the epic removed and the old Vibe assertion: confirmed against `fanout-run.cjs:3739-3975`, `:4778` and `adapter-suite.ts:483-496` | Fixed in both loop protocols, the executor-selection catalog row, the fan-out catalog, the runtime scripts README, the OpenCode catalog entry and the Vibe EC-007 scenario |
| CR-05 | P2 | No deep-loop changelog for the read-only change: confirmed | The open, unreleased `system-deep-loop` v2.2.0.0 entry gained two Fan-Out sections, a breaking-change callout for the Vibe config rejection and two smaller fixes. Shape check PASS |
| A-3 | P2 | No workflow runs the bots suites: confirmed | Fixed. `.github/workflows/bots-runtime.yml` plus README rows. CI report: no drift flags. `check-gate-inputs.sh`: `RESULT: PASSED` |
| D-04 | P2 | Refuted by operator decision Q013 in `008-hub-wiring/decision-record.md` | No change |

Not in the run, found while fixing: the hub and bots-status changelogs failed `check_changelog_shape.py` on sentence length before this packet touched them. Both rewritten; all five bots changelogs PASS.

## Second pass: this packet's own changes

The first pass left uncommitted fixes across the bots hub, the advisor, the deep-loop docs and CI. A second pass checked them. Five read-only lenses each looked for defects: routing engine, cross-surface docs, the Python advisor, the bots docs and the repository. A separate refuter then tried to disprove each finding, and only the reproduced ones were fixed and verified again. Fix log: `parallel-fix-log.txt`. Find and refute records: `parallel-verify-full.txt`.

| Finding | Severity | Verification | Disposition and evidence |
|---|---|---|---|
| ADV-1 | P1 | Reproduced. `advisor_recommend` ranks `command-bots-run` first, but `skill_advisor.py` drops it, because the free-text screen in `_sanitize_native_label` matches the word "run" inside the id. The screen predates this branch | Fixed. Structural ids (skill id, redirect ids, workflow mode) now pass an id grammar, and free text keeps the screen. `test_skill_advisor.py` 126 pass, 0 fail (was 125). Regression set 84 of 84. Compat vitest 15 of 15. Scorer frozen ok. The TYPED rows of `routing-replay.txt` show `command-bots-run` first in both advisors |
| ENG-1 | P1 | Reproduced. Ordered keywords fell back per mode, so "start a new bot" turned into an author+run bundle | Fixed in the hub-local `router.cjs`: ordered keywords count only when no plain keyword matched in any mode. Two gold cases. A 720-prompt corpus pass changed 10 decisions, all intended |
| ENG-2 | P2 | Reproduced. "pause michel's old triage bot" deferred, because the apostrophe split one word into two | Fixed in `promptWords`: curly apostrophes fold, and a possessive `'s` drops. Two gold cases |
| ENG-3 | P2 | Reproduced, latent. The compiler counted keyword words by whitespace, the router by non-letter characters | Fixed. The compiler counts with the router's `promptWords`, and `~run .` plus three similar keywords fail with `ORDERED_KEYWORD_INVALID` |
| ENG-4 | P2 | Reproduced. Plain "drain the bot" and "bot's schedule" matched inside "drain the bottleneck" and "the robot's schedule" | Fixed at stage two as `~drain bot` and `~bot schedule`. Both in-word prompts defer, with two gold cases. Side effect: a compound prompt collapses to one mode, recorded as Known Limitation 4 in `implementation-summary.md` |
| CD-1 | P1 | Reproduced. The `/deep:research` and `/deep:review` contracts still said cli-opencode refuses read-only and runs without `--agent` | Fixed in `research.md:119`, `review.md:112`, both presentation files and two YAML siblings the finding missed, `deep-research.yaml:1685` and `deep-review.yaml:1778`. Contracts recompiled. `check-contract-drift.cjs`: exit 2 with two `STALE_SOURCE_DIGEST` lines before, exit 0 `OK commands=2` after |
| CD-2 | P2 | Reproduced. cli-mistral-vibe `SKILL.md:190` and `README.md:195` said a lineage has no confinement | Fixed. Both now say a read-only lineage gets only `read_file` and `grep`, a compensating allowlist rather than an OS boundary. The cli-external-orchestration manifest was refreshed after the edit |
| CD-3 | P2 | Reproduced. The documented argv was `--enabled-tools read_file grep` | Fixed in `stress/sandbox-permission.md:31` and deep-loop `changelog/v2.2.0.0.md:151` as `--enabled-tools read_file --enabled-tools grep`. A grep for the old form finds nothing |
| CD-4 | P2 | Refuted for this packet. The stale comments sit in committed code this branch did not change | Recorded under adjacent defects below |
| Bots docs F1 | P1 | Reproduced. `~start bot` sent "start writing a bot" and "start building a bot" to run | Narrowed to `~start the bot` and `~launch the bot` with five canary cases, then closed by the authoring-verb guard with seven more. One residual, "start to write the bot", is recorded under Routing |
| Bots docs F2 | P2 | Reproduced. The upgrade note said a reinstall keeps the job's hold, but a bot stopped with `bots disable` refuses the reinstall | Fixed in `changelog/v1.0.0.0.md`. It names the `label-kill-switch` refusal and the enable, reinstall, disable order. `quick_validate.py` passes |
| Bots docs F3 | P2 | Reproduced. "needs-you inbox" has no bot word, but six docs said every keyword names a bot | Fixed in `README.md:32`, `SKILL.md:45`, `changelog/v1.0.0.0.md:26`, two catalog entries, the out-of-domain playbook scenario, `ROUTER.md:30` and the `graph-metadata.json` causal summary |
| Repo F1 | P1 | Reproduced. The workflows README said eight workflows under a seven-workflow count marker | Fixed. `check_derived_readme_counts.py`: `claims=1 failures=0` |
| Repo F2 | P1 | Reproduced. The `bots-runtime.yml` path filters missed files the suite loads | Fixed. Both path lists now hold the same 25 entries, each with its `.opencode` twin |
| Repo F3 | P2 | T011 and T012 were unchecked | Fixed in `tasks.md` |
| Repo F4 | P2 | `spec.md` still had the release notes and the run-id variable in scope | Fixed. The release-notes row reads Deferred, and the run-id mention is gone |
| Repo F5 | P2 | The packet docs disagreed on completion and kept scaffold continuity | Fixed. Status In Progress, Completed pending until AC-010 is Met, continuity filled |
| Repo F6 | P2 | The summary overstated what the CI workflow covers | Fixed. The sentence names the files that trigger the workflow |

### Decisions taken in the second pass

- **Stage-one pins kept.** The hub's `graph-metadata.json` keeps "drain the bot" and "bot's schedule" through `intent_signals_keep`. Removing them changed no out-of-domain result: "drain the bottleneck in the pipeline" gets no recommendation either way, and "fix the robot's schedule" ties the hub at 0.82 either way. In-domain confidence dropped without them: "drain the bot" 0.8733 to 0.82, "Drain the bot request queue" 0.9275 to 0.8764 (the command row) and "Remove the bot's schedule and unload its launchd agent" 0.8708 to 0.82.
- **F1 narrowed, not closed.** See Routing.

### CI replay

Every pull-request workflow that the changed paths trigger (28 of them) was replayed locally from the final tree.

- Four failures came from this branch. `worktree-naming` failed because `.skilled/skills/system-skilled-bots/runtime` was missing from `sk-git/scripts/worktree-provision-paths.txt`. Fixed there and in both cache path lists and the cache key of `.github/actions/setup/action.yml`, after which it printed `PASS=174 FAIL=0`. The README durable manifest lacked the twelve new bots code folders, and `test_readme_manifest.py --write` fixed it (`manifest=reproducible`). `package_skill.py --check --strict` failed on the four bots modes and now passes for each: `### When to Use` headings, RELATED as the last section and a 125-character `bots-author` description. The doc version raise is applied when the final tree is staged.
- Group A passed. `dispatch-enforcement-guard` 66 of 66. Markdown link integrity found 0 broken links of 15788. Comment hygiene cleared 738 files. Changed-packet validation ran the parent and phases 001 to 009 with 0 errors and 0 warnings. `spec-kit-check` passed every job except one pre-existing failure, listed below.
- Group F passed. Bots runtime 35 files and 372 tests, typecheck clean, post-commit harness 28 passed. Deep-loop 222 files and 4041 tests.
- Group B passed except two failures that reproduce the same way on `origin/main`: the mcp-browser-use vocabulary drift and the routing-accuracy corpus pin drift. Its advisor suite passed 178 files and 2478 tests.
- Group E passed every blocking step. Two report-only steps failed: the trigger index is stale (32 new bots docs, rebuilt after merge by the trigger-index workflow) and an mcp launcher test needs a local install.

### Pre-existing, recorded

- `spec-kit-check`: `runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts:97` expects the completed-session text not to contain "extend", and `deep-review.yaml:736` says "rerun with --extend=N". The YAML line is the same on the merge base and on `origin/main`, where the assertion fails the same way.
- Hub-wide vocabulary source fails only on mcp-browser-use.
- Hub-wide vocabulary reach: sk-code outranks sk-doc on "audit the docs" (0.9277 against 0.9268) and "which json files does a skill need" (0.9099 against 0.9000). Same on a `bd474396742` copy and on the merge-base copy, which has no bots hub. No workflow runs this check.
- `check_readme_references.py` fails on `.skilled/skills/README.txt:144`, a `my-new-skill/` placeholder. No workflow runs that checker.
- The committed trigger index does not list the new bots docs until the trigger-index rebuild runs.

### Adjacent defects, not fixed here

- `system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1327` and `:1440` say cli-opencode refuses read-only. `executor-config.ts:290-291` and `:307-309` name only the edit, shell and subagent tools, while the policy is a catch-all deny with read, grep, glob and list allowed. Committed code outside this packet.
- A session-handover adapter test that sets `SESSION_HANDOVER_REPO_ROOT=relative-repo` (`tests/claude-adapters.test.cjs:1148`, `tests/codex-adapters.test.cjs:928` or `pi/session-handover.test.ts:865`) left an empty `relative-repo/` tree at the worktree root during the CI replay. UNKNOWN which of the three, because the replay logs do not say. The tree was removed before commit.

## Routing (D-02, D-03, D-05, PRB-04 to PRB-13)

Baseline replay before any change, stage two through `compiled-route.cjs --hub system-skilled-bots` and stage one through `advisor_recommend`:

| Probe | Stage two | Stage one top |
|---|---|---|
| P04 Run the release-notes bot now against this repository | defer | sk-doc (bots third) |
| P05 Queue a bot run for the triage bot from the new-issue event | defer | system-skilled-bots |
| P06 Drain the bot request queue | defer | system-skilled-bots |
| P08 Put the nightly bot on a launchd schedule | defer | system-skilled-bots |
| P09 Pause the triage bot until Monday | defer | none |
| P10 Remove the bot's schedule and unload its launchd agent | defer | system-skilled-bots |
| P11 Show me which bots are installed and when each last ran | route status | none |
| P12 Read the needs-you inbox for the bots | defer | system-skilled-bots |
| P13 Check whether the bot's schedule needs a reinstall | defer | none |

P01 to P03 and P07 pass: their expected mode ids are author, run, schedule and status.

After the fix, replayed through both stages at policy `93ebae9de124` (full receipt: `routing-replay.txt` beside this file, earlier agent log: `routing-fix-log.txt`):

| Probe | Stage two | Stage one top |
|---|---|---|
| P04 | route run | sk-doc `/create:changelog` 0.82, hub third |
| P05 | route run | system-skilled-bots 0.8482 |
| P06 | route run | system-skilled-bots 0.9275 |
| P08 | route schedule | system-skilled-bots 0.9439 |
| P09 | route schedule | none |
| P10 | route schedule | system-skilled-bots 0.8708 |
| P11 | route status | `command-bots-status` 0.82 |
| P12 | route status | system-skilled-bots 0.9437 |
| P13 | route status | system-skilled-bots 0.852 |
| start the bot | route run | `command-bots-run` 0.8632 |
| launch the triage bot | route run | none |
| start a new bot for triage | route author | system-skilled-bots 0.82 |
| run the triage bot to write a summary | route run | sk-doc 0.82, hub second |
| launch the build bot | route run | system-skilled-bots 0.82 |

Stage two routes all 14 in-domain probes to their mode and routes none of the 34 out-of-domain and 16 adjacent prompts. Stage one ranks the hub first for 10 of the 14. The stage-one leaks are listed in `implementation-summary.md` Known Limitation 3, and stage two defers every one of them.

F1, authoring prompts reaching run. The operator chose on 2026-11-24 to close it with an authoring-verb guard. `hub-router.json` now declares `orderedKeywordBlockers` ("authoring", "building", "creating", "writing"), and ordered keywords do not count in a prompt that holds one. The compiler rejects a blocker that is not one router word with `ORDERED_KEYWORD_BLOCKER_INVALID`. Seven canary cases were added (62 to 69), and the 62 existing cases keep their decisions. A 730-prompt corpus pass against the `f593220659f4` engine changed exactly six decisions, each an authoring prompt that now defers instead of routing: "start writing the bot", "start building the bot", "how do I start building the bot", "launch the bot I'm writing", "pause the triage bot I'm building" and "launch the bot that is writing the report". No other score moved. Residual: "start to write the bot" still routes run, because "write" is not a blocker. Listing it would also defer "run the triage bot to write a summary", which asks for a run. "build" stays off the list so "launch the build bot" keeps routing run.

What changed:
- Stage-two vocabulary gained six narrow plain phrases and seven ordered-word keywords. An ordered keyword starts with `~` and matches its words in order on whole-word boundaries with at most three words between them. It counts only for a mode no plain keyword matched. The engine change is hub-local: this hub's `router.cjs` and `registry-compiler.cjs`, authored and runtime copies. Operator approved it 2026-11-23.
- The four `/bots:*` bridges are active in `scoring-compatibility.json` (D-02). A typed `/bots:author ...` now returns `command-bots-author`.
- Canary gold grew from 20 to 48 cases by insertion. All earlier cases keep their decisions.
- Out-of-domain prompts at stage two all defer: "pause the video", "launch the app", "start the server", "run the tests", "run the release script now", "pause the build until Monday", "enable the chatbot widget" and "run the tests on the robot branch".

Gates rerun after the F1 guard, each with exit 0: `compiled-route-sync.cjs --check` "all 67 served copies match their authored files", the guard "All hubs fresh or excused", `compiled-route-admission.cjs --all` "Every hub passes the admission check." (bots 8 pass), `node --test compiled-route-*.test.cjs` 117 of 117, foundation vitest 37 of 37, `parent-skill-check.cjs` "all hard invariants passed, 0 warnings", vocabulary source and reach for the hub `RESULT: PASSED`, intent signals `missing=0, orphans=0`, bridge drift `"changed": []`, leaf manifest OK, derived freshness 16 fresh, root metadata 16 passed and the doctor suite 1674 of 1674. The earlier agent log holds the advisor suite (178 files, 2478 passed).

Still open, recorded as follow-ups:
- Stage one misses P04, P09, "launch the triage bot" and "run the triage bot to write a summary". The advisor's lexical scoring is a shared-scorer change outside this hub.
- "start to write the bot" routes run at stage two (see F1 above).
- Opus review P2s R-07, R-08, R-10, R-11, R-12 and R-15. The shared executor's timeout kill. `secrets` posture enforcement. The Devin lane permission mode in `run-lanes.cjs:570`. Any bot job installed before this branch needs `bots schedule install` once.
- `command-bridges/README.md` §5 should say a hub command needs a full hand row (name, keywords, domains, intentSignals, slashMarkers), as `create:agent` has. The four-field shape there is the doctor-route rule, and the deriver throws on it for any other command.
- `command-contract.json`'s coverage note does not list the bots family. No routing code reads it.

## Recheck

`/local-skilled-alignment --recheck` of the original run, from the final staged tree on 2026-11-24 (report: `~/.local/state/local-skilled-alignment/system-skilled-bots/20261124T065827Z/recheck.md`). `recheck.cjs` exited 1, which means something is still open: 5 resolved, 3 still open, 0 new and 33 needing review.

- Resolved: battery rows S5 readme references, S7 skill-graph freshness and S15 frontmatter coverage (both P0 rows now pass), and findings C-05 and D-06.
- Still open, each by a recorded decision. S2 validates `assets/bot-template.md`, which the rename to `bot-template.txt` removed, so the new battery no longer produces that row. S6 reports the release notes missing the hub and its four modes, which the operator deferred ("Were not releasing yet"). S13 reports `SKILLED_BOT_RUN_ID` unlisted in `.env.example`, which ENV-01 settled: the runner sets it on the child, and no operator sets it.
- Needs review: the 33 judgment findings the recheck cannot settle mechanically. Each has a disposition in the tables above.
- The prune step exited 2 on `ENOTEMPTY` for the original run's lane scratch under the system temp folder. The workflow records a prune failure and never fails the run on it. Both run folders are kept.
- The S13 battery row runs `check-env-tokens.cjs` through a path relative to the original run's working directory, `../../../MEGA/Development/Skilled/...`, so the recheck ran the primary checkout's copy of that script. Recorded as an adjacent defect in the recheck tool.
