# Lead steering: deepseek

## Review of iteration 1

Verdict: **adequate**. The angle and the wave rule were honored, and there is real new ground. But the headline check is weaker than the tested reference, and two citations drifted.
- New and confirmed: the failure taxonomy (400, 413, `unsupported_option_count`, 404, 405, 500) and "the port binds only after the weights load" (`deem_server.py:1000`, after backend construction). Both hold in code.
- Defect: N-deepseek-01-1 passes on `backend != "stub"`, which is a denylist. The tested reference is an allowlist. `deem-ctl` `health_ok` (`~/.local/share/deem/bin/deem-ctl:59-66`) parses JSON and passes only `torch` or `ensemble:*` without `stub`. `EnsembleBackend` names itself `ensemble:...` (`deem_server.py:270`). The iteration never opened `deem-ctl`, although ALL-1 allowed it and the deepseek-01 refinement asked for it.
- Drift: the stub notice and `StubBackend()` are at `deem_server.py:979-984`, not `:972-977`, which is the ensemble branch. `serve_forever` is at `:1007`, not `:1003-1005`. `settings.json:103-116` and `:215-222` are correct, and so is `:845-846`.
- Open: angle question 4 is unanswered. How often does the probe run, is a result cached, and what happens when the server stops mid-session?
- Inferred, not confirmed: F10's preference rule (Jev for "gold-calibrated") and the 500 ms hook budget. No gold exists for either backend, so mark both inferred.
- Containment is clean: no `jev`, `curl` or server call is on record, and no write outside the lineage directory is attributable to it.

## Steering for next iterations

- **deepseek-02 (lifecycle):**
  - Audit `deem-ctl` line by line (start, `wait_healthy`, update, rollback exit 3) and the plist `com.skilled.deem-update`. Cite `deem-ctl:line`, and never execute it.
  - Answer who restarts a stopped server, and what a hook sees during the restart window of an update (connection refused for about 10 s, per iteration 1's bind-after-load).
  - The model id does not identify the weights. `/health` reports only the id string (`deem_server.py:772-777`), which stays `deem-0.8-v1` across a Hugging Face commit change. Find where the commit is readable (the `models/current` link, and `deem-ctl status`) and say how a keep rule records it.
- **Any gate reuse:** restate the check as `deem-ctl`'s allowlist plus the model-id pin, or argue for the denylist with code. Name `deem-ctl`'s `curl -m 2` against your hook budget.
- **deepseek-03 (validators):** the angle already names BASE2 rows 61 and 62 (`check-goal.cjs` is frozen). New ground is the per-rule map across all of `SSK/runtime/cli/rules/` with the judgment residue. Count the rule scripts with `ls` or `rg` and do not sample them. Never run a rule.
- **deepseek-04 (hook deadlines):** the Claude hooks are already Node processes, so a loopback `fetch` costs a connect, not a spawn. Only a shell-out to the Python `jev-cli` spawns. Split the hook budget into those two paths from the hook source.
- **Stop:** restating BASE2 section 11's Jev half. Cite it by line and move on.

## Review of iteration 2

Verdict: **strong**. It took angle deepseek-02 and audited `deem-ctl` as built, and every `deem-ctl` line I opened resolves. It began before this file existed, so it read no steer. Even so, it fixed iteration 1's denylist on its own (N-deepseek-02-2).
- STRONG-FINDING: an update run while the server is stopped skips the smoke decision. `smoke_decision` runs only under `was_running` (`deem-ctl:160-167`), and a plain start checks only `wait_healthy` (`deem-ctl:119`). A bad checkpoint can therefore become the served one unseen.
- STRONG-FINDING: `/health` has no commit. The model and source pair exists only in `deem-ctl status` (`deem-ctl:195-198`), so every Deem measurement must carry that pair (N-deepseek-02-3).
- STRONG-FINDING: `stop_server` sends one `kill` and never waits for the process to exit (`deem-ctl:123-128`). Marked inferred as a race, which is correct.
- DEFECT (lead's, not the iteration's): the rollback restart swallows its own failure (`start_server >/dev/null || true`, `deem-ctl:171`). Exit 3 then prints "restored" even if the old version never came back. F4 and F5 describe the rollback as restoring service, which is unverified.
- WEAK-CLAIM: F6 and N-deepseek-02-5 say the smoke "proves the weights can answer". It only greps for `"choice"` in a 2xx body (`deem-ctl:84`), which proves the call did not error, not that the answer is sane.
- WEAK-CLAIM: F6 assumes the 6-hourly launchd job runs `update`. The plist was not opened, so this is inferred from `LOCAL:70` alone.
- WEAK-CLAIM: F11's arithmetic contradicts itself. `LOCAL:28`'s 2.1 GB is the whole install with one 1.4 GB model, so two retained models come to about 3.5 GB, not "2.8 GB plus 2.1 GB total".
- DRIFTED-CITE:
  - The vendor `DEEM_HOST=0.0.0.0` is at `README.md:226`, not `:222`.
  - The 1.5 s idle failsafe is at `hf-model-server.cjs:52`, not inside `:29-40`.
  - The `KeyboardInterrupt` handler is at `deem_server.py:1006-1008`, not `:1003-1005`.
- Containment: clean. Nothing was executed, and the plist was left unopened as ALL-1 requires.

## Steering for next iterations

- Record commits in future arms by reading the `models/current` link, not by calling `deem-ctl status`. The status command hits `/health`, which is a server call.
- deepseek-04 and deepseek-08: use the restart window (`deem-ctl:162-167` plus about 10 s of loading) as the cold case a hook must skip.
- Stop re-deriving LOCAL's figures. Cite them by line.

## Review of iteration 3

Verdict: **strong**. It took angle deepseek-03 and mapped all 40 registry rules. **It did not read `steer.md`, although the file existed when it started.** No steer is named in its Actions, and the word "steer" appears in no lineage file other than this one. It did follow two of iteration 1's steering points, full coverage and no rule execution, but only because the angle already asked for both.
- STRONG-FINDING: the full rule map holds. There are 40 rows (`jq length` prints 40), and the row lines resolve (`validator-registry.json:3`, `:15`, `:69`, `:133`). Six of the rules check a pattern that stands in for meaning, and none of them reads meaning.
- STRONG-FINDING: `AC_COVERAGE` only checks that a `file:line` is present in the row. Its awk pass (`check-ac-coverage.sh:280-382`) counts rows, covered rows and malformed rows, and never checks that the cited file exists. N-deepseek-03-3 is a deterministic fix that needs no model.
- STRONG-FINDING: the forbidden seats are backed by code. `mapShellRuleStatus` maps a failed rule to `error` unless its severity is warn or info (`orchestrator.ts:278-289`), and `validate.sh:7-10` refuses a second answer to the same question.
- DEFECT: F8's gate still says "stub refusal + model pin", which is iteration 1's check with only `stub` excluded. It misses iteration 2's amendment N-deepseek-02-2, which accepts only `torch` or an `ensemble:` name without `stub`.
- DEFECT: N-deepseek-03-3's verdict "build-now (next, ...)" gives two verdicts at once. It also uses no classifier, so the synthesis should treat it as a spin-off for spec-kit rather than a classifier recommendation.
- WEAK-CLAIM: F3 lists the six proxy rules, then describes their weaknesses in a different order ("the first misses inconsistent statuses" refers to the second rule).
- DRIFTED-CITE: the `AC_COVERAGE` contract, including the "one in five" line, is at `validation-rules.md:95-110`, not `:110-135`, which covers `CONTINUITY_FRESHNESS`. The `check-goal.cjs` exit codes are at `:666` and `:673-674`, not `:660-671`.
- GAP: the coverage table assigns `sk-doc/scripts/frontmatter-version.mjs` and `check-frontmatter-versions.sh` to this angle, and neither was opened.
- Containment is clean: nothing was executed and no counts were invented. It states plainly that no counts were produced.

## Steering for next iterations

- Read this file first. It holds the corrected gate: `backend` must be `torch`, or an `ensemble:` name without `stub`, plus the model-id pin and the commit pair.
- deepseek-04 (the Node `fetch` against the Python spawn split still stands) and deepseek-06 (the field gap, refinement in section 7 of the angles file).

## Review of iteration 4

Verdict: **strong**. It took angle deepseek-04. **It read `steer.md`**: the section "Corrections carried from `steer.md`" (iteration lines 12-21) takes all six corrections and re-checks each in code. It does not edit iterations 1 to 3, whose file times are unchanged.
- Wave 2: its sibling reads are correct. When it started, the newest files were grok 006 (grok 003 was also read) and swe 001, since swe 002 landed during the run. mimo and glm had no files and it says so. It quotes grok's count as grok's own. It confirms swe-01's Node `fetch` client shape from code it opened itself, and no repeated finding counts as corroboration.
- STRONG-FINDING: the advisor budget chain, confirmed line by line:
  - the hook timeout is 3 s (`settings.json:110`)
  - the shim runs `spawnSync` with `CHILD_TIMEOUT_MS` 2,500 and `SIGKILL`, and gives the child 2,200 ms (`SSK/runtime/hooks/claude/user-prompt-submit.ts:22-24`, `:105-117`)
  - every failure path returns `{}` (`:118-145`)
- STRONG-FINDING: PreCompact takes a deadline of `HOOK_TIMEOUT_MS` 1,800 ms at entry (`shared.ts:12`, `compact-inject.ts:494`).
- STRONG-FINDING: the routing seams (`compiled-route.cjs`, `lookup-trigger-index.mjs`) are CLIs with no hook deadline. This is new against BASE1 and BASE2.
- DEFECT: F9 says the probe runs "once per session, cached in-process". A hook is a fresh process on every invocation: `settings.json` runs `node .../user-prompt-submit.js`, and the shim spawns a new child per prompt (`user-prompt-submit.ts:109`). An in-process cache therefore lasts one prompt. A live form either probes every prompt, and that cost belongs in N-deepseek-04-1's budget, or needs the file cache that F9 itself forbids.
- WEAK-CLAIM: F6 row 1's claim that ">2.1 s is left" ignores the advisor's own spend inside 2,200 ms. The source says the 300 ms margin "covers measured startup overhead" (`user-prompt-submit.ts:23`). N-deepseek-04-3 states the rule correctly; F6's table overstates it.
- DRIFTED-CITE: none in five checks (`shim:22-24`, `:105-117`, `shared.ts:11-12`, `compact-inject.ts:494`, `settings.json:193-210`).
- Containment: clean.

## Steering for next iterations

- deepseek-05: check the partial flip of rows 1 and 5 against the per-prompt probe cost above, and count the advisor's own spend from its code or mark it UNKNOWN.
- deepseek-06: the field gap (refinement in section 7 of the angles file). Also check whether `jev auth status --provider custom` passes with a placeholder key, which would make the Jev check pass for a Deem setup.

## Review of iteration 5

Verdict: **adequate**. It took angle deepseek-05, and its contract map is real new ground. Its sibling reads are stale, and it overstates the test pins.
- On `steer.md`: the iteration says only that "the steer corrections from iteration 4 remain in force". My iteration-4 review landed at 08:43:44, after it started (iteration 4's file is timed 08:42:46 and iteration 5's 08:44:38). It could not have acted on the per-prompt probe defect, and it did not.
- Wave 2 slip: its Sibling check repeats iteration 4's list (grok 004 and 006, swe 001). When it started, the newest files were grok 010 (08:42:36) and swe 002 (08:41:45), and neither was read. The grok 006 and swe 001 rows add nothing new.
- STRONG-FINDING: `002/spec.md:92` already excludes "any live, served or hook-time Jev call in the advisor", so a flip means amending that line.
- STRONG-FINDING: the advisor budget is not idle. The hook runs the `skill-advisor.cjs advisor_recommend` CLI within that budget (`skill-advisor-hook.md:38`), and `enrichCompiledRoutes()` shells out to `compiled-route.cjs` (`advisor-recommend.md:33`, `:47`). That makes nested spawns before any Deem call, so iteration 4's ">2.1 s" is only an upper bound.
- STRONG-FINDING, a contest that counts: grok-04's spawn-included bar is the wrong measure for a Node `fetch`, so the right one is connect plus call. It agrees there is no revival tonight, which fits grok's lead summary: "rows 1 and 5 are unknown pending a spawn-included p95" (`grok/steer.md:163`). The two lineages refine the measure; they do not conflict.
- WEAK-CLAIM: F1 and F2 say the 2,500 ms constant is "test-pinned on three surfaces". Only `.opencode/plugins/tests/system-skill-advisor.test.cjs:580` asserts `= 2500`.
  - `user-prompt-submit-shim.vitest.ts:9` is only the env-var name.
  - `claude-user-prompt-submit-hook.vitest.ts:11` and `:123` import the constant and pass it on. They do not assert its value.
- DRIFTED-CITE: `002/spec.md:87` is the R21 calibration line, not the census's `--jev` switch.
- Containment: clean. It confirmed `.skilled/hooks/skill-advisor/pi/prompt-advisor.ts` exists and executed nothing.

## Steering for next iterations

- Before each W2 or W3 iteration, list the sibling directories and read the highest-numbered file in each. Do not reuse the previous iteration's sibling list.
- The iteration-4 defect still stands: a hook is a fresh process on every prompt, so a live Deem form probes every prompt. deepseek-08 and deepseek-09 must price that probe.

## Review of iteration 6

Verdict: **strong**. It took angle deepseek-06. Every citation I opened resolves, and the wire verdict rests on recorded evidence, not on inference alone.
- On `steer.md`: the iteration never names it. My iteration-5 review landed at 08:45:56, while it was running (08:44:38 to 08:46:31). F4 answers my iteration-4 point about `auth status --provider custom`, but angle question 4 asks the same thing. Whether it read `steer.md` is **undetermined**.
- Wave 2 slip, again: the Sibling check says "`glm/`: no iteration file yet", but `glm/iterations/iteration-001.md` existed from 08:44:11, before this iteration started. The newest grok (010) and swe (002) files were not read. Reading grok 002 fits the wire question, but it is not the newest-file rule.
- STRONG-FINDING: no guard refuses a loopback or plain-HTTP endpoint. `jev-custom-endpoint-required` checks only that an endpoint is present (`dispatch-rule-checks.mjs:280-283`). A recorded probe reached `http://127.0.0.1:9` and exited 4 (`probe-matrix.txt:147-151`).
- STRONG-FINDING: the Python `jev-cli` exit map against Deem holds line by line:
  - a 400 or 413 exits 1, and a 500 exits 4 (`__init__.py:296`)
  - a refused connection exits 4 (`:298-299`)
  - the `KeyError` from `--value` exits 1 (`:438-440`)
  - `CliError` defaults to exit 2 (`:47`)
- STRONG-FINDING: `jev auth status --provider custom` exits 0 with a key and opens no socket (`__init__.py:419-422`). It must never serve as the Deem check (N-deepseek-06-2).
- DEFECT: F3 says "no path returns a default score or verdict". Its own stub row contradicts that. A stub server answers `noul` 0.5 and uniform `choice` and `score` with exit 0 (`deem_server.py:137-154`), and the answer body carries no `backend` field. That is a default value delivered as a success, and only the `/health` probe refuses it. N-deepseek-06-1 must say the client probes before every run and never trusts an answer body alone.
- WEAK-CLAIM: F3's row "`choice` with `--value` → exit 0" assumes a request that has already been translated. Through the untranslated Python `jev-cli`, `choice` returns 400 and exits 1 (F5).
- ALL-7 audit (dedupe token usage by `message.id`, but count `tool_use` blocks across all records): iterations 1 to 6 contain no transcript counts. No deepseek number rests on the old rule, so there is no DEFECT to flag.
- Containment: clean. No `jev` or Deem call was made, and the probe matrix is quoted as a recorded artifact.

## Steering for next iterations

- deepseek-07: count the `cli-jev` references by kind with `rg -c`, and name the command. Include `.hermes/skills/cli-jev/SKILL.md` and the dispatch guard file.
- Any future transcript count: dedupe usage by `message.id`, but count `tool_use` blocks across every record.

## Review of iteration 7

Verdict: **adequate**. It took angle deepseek-07. The headline count reproduces, but the source-and-reference split and three `mode-registry.json` citations are wrong.
- On `steer.md`: **it read it.** The Sibling check answers my iteration-2 WEAK-CLAIM about the launchd plist by quoting glm's read of it. My iteration-6 review landed at 08:47:46, after it started, which is expected.
- Wave 3 siblings: **correct this time.** It read the newest file of each sibling: grok 010, mimo 001, swe 002 and glm 001. It no longer claims glm or mimo have no file, and it quotes sibling counts as the siblings' own.
- STRONG-FINDING: the blast radius reproduces exactly. `rg -l 'cli-jev' .skilled .claude .hermes .pi` finds 92 files, and `rg -o` finds 927 occurrences. `.claude/skills` and `.opencode/skills` are links to `.skilled/skills`, so leaving out `.opencode` loses nothing.
- STRONG-FINDING: the literals a move must change resolve. They are `compiled-route-guard.cjs:47` in the `HUBS` list, `compiled-routing-flag.ts:19` and `:37`, and `dispatch-audit.mjs:46` (`packetPath: 'cli-jev/cli-usage'`).
- STRONG-FINDING: an alias cannot keep a `metadata` hub routable (F4). The move therefore means updating the literals, regenerating, and verifying the new hub before the old one goes.
- DEFECT: F1 says 53 files are hub source, and F7 says "53 source files and 39 referencing files". The directory `.skilled/skills/cli-jev/` holds 81 files, of which 47 mention `cli-jev`, and 45 referencing files sit outside it (47 + 45 = 92). The move relocates 81 files and touches 45 outside files.
- DRIFTED-CITE: `mode-registry.json` is 60 lines, so `:113-119`, `:110-119` and `:70-90` point past the end. `transport-axis` and `enforcedBy` are at `:53-57`, `mutatesWorkspace: false` is at `:29`, and `routingClass: "metadata"` is at `:47`.
- WEAK-CLAIM: F2 says `compiled-route-guard.cjs:40-50` holds "seven ids". The `HUBS` array starts at `:45`, and the count was not shown.
- Containment: clean. It moved nothing and ran no git write.

## Steering for next iterations

- For any file count, print the exact command and its raw number. Split the count into files inside and outside the moving directory.
- deepseek-08: price the per-prompt probe (the iteration-4 DEFECT), and use glm's plist read (update every 6 hours, `RunAtLoad`) for the restart window.

## Review of iteration 8

Verdict: **adequate**. It took angle deepseek-08. Its new ground is narrow: the precompute contract and the kill lines. F1 and F4 mostly restate LOCAL and iterations 1, 2 and 4. The iteration ran for about 70 s (08:49:21 to 08:50:31).
- On `steer.md`: **it read it.** Its Actions item 5 says "per the steer: no re-derivation". My iteration-7 review landed at 08:50:04, during the run.
- Siblings: no sibling file appeared after iteration 7's reads (the newest are still grok 010, mimo 001, swe 002 and glm 001), so reusing that list is acceptable here. It makes no false "no file" claim.
- STRONG-FINDING: the `precompute` trigger's contract resolves. The result "is kept for the compaction that comes, if the conversation it ran over still leads" (`claude-code.d.ts:7282-7283`), and on a skip "nothing is computed or kept" (`:7265`). That gives a staleness rule a background pass can copy.
- STRONG-FINDING: a home for off-path work exists in this repository. The `Stop` hooks already run with `"async": true` and a 10 s timeout (`settings.json:169-170`, `:175-176`), and no `session.compact` registration exists.
- WEAK-CLAIM: F2 calls the host's precompute route "real". Its only source is the type file vendored with the npm `jevctl` plugin, which is a vendor description of an early-access function-hook API, and F3 finds no route to it here. Label it a vendor claim.
- DEFECT, carried and still open: a live form probes on every prompt, because hooks are fresh processes (iteration-4 review). F4's row "server stopped mid-session after a cached pass" still assumes a cache that spans prompts, and N-deepseek-08-1 does not price its probe plus call on every async `Stop` turn.
- DEFECT, new from the lead:
  - The server serializes forward passes behind one `threading.Lock` (`deem_server.py:201`) and applies no length cap before `_forward` (`:203-211`).
  - A background pass on transcript-sized state and a live hook will queue behind each other.
  - LOCAL measured one client on short synthetic inputs (`LOCAL:32`). The p95 under contention, and on long state, is UNKNOWN, so kill line (a) cannot be pre-registered from LOCAL.
- Containment: clean. Nothing was started, stopped or called.

## Steering for next iterations

- deepseek-09: include the per-prompt probe, lock contention and long-state latency in the failure table as rows, each marked measured or UNKNOWN.
- deepseek-10: carry the two-probe rule, the allowlist-plus-pin check, the commit pair and the "no command-hook live form" rule into the 002, 003, 005 and 006 amendments, with `file:line` for each existing Jev-only line.

## Steering for iteration 10 (deepseek-10), most important first

1. Open `spec.md`, `plan.md` and `tasks.md` for 002, 003, 005 and 006, and quote every line that gates on Jev alone by its `file:line`. `002/spec.md:92` is already known. Write the replacement text beside each line, and do not paraphrase.
2. The Deem check in every amendment has four parts:
   - `GET /health` parsed as JSON
   - `backend` equal to `torch`, or an `ensemble:` name without `stub` (`deem-ctl:59-66`)
   - `model` equal to `deem-0.8-v1`
   - a timeout that fits the seam's budget
   Jev keeps its three checks. Never use `jev auth status --provider custom` as a Deem check (`__init__.py:419-422`).
3. Run the check before every run, and before every prompt for a live form. A stub server answers a `noul` of 0.5 and uniform `choice` and `score` with exit 0 (`deem_server.py:137-154`). Only `/health` exposes that, so an answer body alone must never be trusted.
4. Every Deem number carries its model and source commit pair, read from the `models/current` link without calling the server. A changed pair means the number must be measured again. It is not a kill, because the launchd agent updates every 6 hours.
5. The server serializes passes behind one lock (`deem_server.py:201`) and applies no length cap. Latency under contention and on long state is UNKNOWN, so no amendment may pre-register a latency kill from `LOCAL`.
6. No Deem feature ranks above later unless its first slice makes no calls or a labeled accuracy set exists.

## Review of iteration 9

Verdict: **adequate**. It took angle deepseek-09. The Jev half and the disagreement rule are sound, but it assembles earlier findings more than it breaks new ground, and three defects from earlier reviews are missing.
- On `steer.md`: **no evidence it was read.** The word "steer" never appears. It ran from 08:50:31 to 08:51:40, and my iteration-8 review landed at 08:51:29. But reviews 2, 4 and 6 were available, and their defects are absent.
- Siblings: correct for when it started. swe 003 landed at 08:51:29, during the run.
- STRONG-FINDING: F5's disagreement rule: nothing is averaged, nothing fails over to the other backend, and each answer keeps its backend and commit. Dropping automatic failover is well argued.
- STRONG-FINDING: F2's fixture with no backend adds a check that no file time changes, on top of byte-identical output.
- DEFECT: F1 says "no row writes a default score". The stub row contradicts that, as in the iteration-6 review: exit 0 with 0.5 or uniform answers, refused only by `/health`.
- DEFECT: the table has no row for a failed rollback restart. `deem-ctl:171` (`|| true`) exits 3 and prints "restored" while the server may be down (iteration-2 review).
- DEFECT: it has no row for the per-prompt check, lock contention (`deem_server.py:201`) or long-state latency either.
- WEAK-CLAIM: F4 treats a changed commit pair as a kill line. It is a trigger to measure again (see steering point 4).
- DRIFTED-CITE: none new. It opened few new lines and relies on its own earlier iterations.
- Containment: clean.

## Review of iteration 10

Verdict: **adequate**. It took angle deepseek-10, and the `spec.md` lines it maps resolve (`002/spec.md:3`, `:49`, `:86`, `:92`; `003/spec.md:48`, `:124`; `005/spec.md:91`; `006/spec.md:43`, `:108`). But it opened `spec.md` only, not the `plan.md` and `tasks.md` the angle names first. My iteration-10 steering landed at 08:52:35, 9 s before it finished, so it did not read it.
- STRONG-FINDING: a line-level amendment map for the four phases, plus one gate text covering both backends (F2) that already uses the allowlist and the pin.
- STRONG-FINDING: under Deem, a calibration must be fit locally, because the model is uncalibrated at temperature 1.0 (`LOCAL:27`). The 005 fallback bar becomes the Deem skip rate.
- DEFECT: the amendment map covers `spec.md` only. `grep -ci jev` counts Jev lines still unmapped in plan and tasks: 002 has 32 and 24, 003 has 26 and 14, 005 has 12 and 3, and 006 has 12 and 6.
- DEFECT: F2's gate text repeats "no path returns a default score", which the stub answer contradicts. It also omits the check before every run or prompt, and the commit pair read from `models/current`.
- DRIFTED-CITE: F3's "per-call latency record (`002/spec.md:35`)" points at the Handoff Criteria row, not a latency record.
- WEAK-CLAIM: "the SWE lineage is at iteration 2". `swe/iterations/iteration-003.md` existed from 08:51:29, before this iteration started at 08:51:40.

## Lineage summary for the synthesis

State log at review time: 12 records, the last is iteration 10 with **no `stopReason`**, the lineage was still running and had no `research.md`. `maxIterationsReached` is **unconfirmed**, so recheck it.
**Top findings (lead-verified):**
1. The Deem check: `/health` parsed as JSON, `backend` equal to `torch` or an `ensemble:` name without `stub` (`deem-ctl:59-66`, `deem_server.py:270`), and `model` equal to `deem-0.8-v1`. The id is not the weights (`:772-777`), so each number records the commit pair.
2. The port opens only after the weights load (`deem_server.py:1000`), so loading, restarting and updating all read as "refused". An update while the server is stopped skips the smoke test (`deem-ctl:160-167`, `:119`).
3. `custom` is no Deem transport. The guard checks only that an endpoint is present (`dispatch-rule-checks.mjs:280-283`), a bearer key is mandatory (`jev_cli/__init__.py:280`, `:90-108`), and `auth status` opens no socket (`:419-422`). Deem needs a separate client.
4. The advisor chain is 3 s, then a 2,500 ms `SIGKILL`, then 2,200 ms, with `{}` on every failure (`SSK/runtime/hooks/claude/user-prompt-submit.ts:22-24`, `:105-145`). It already runs `skill-advisor.cjs` and `compiled-route.cjs` inside that budget (`skill-advisor-hook.md:38`, `advisor-recommend.md:33`). PreCompact has 1,800 ms (`shared.ts:12`).
5. `AC_COVERAGE` checks that a `file:line` is present, never that the file exists (`check-ac-coverage.sh:280-382`), so a zero-call fix exists. The 40-rule map is `validator-registry.json:3-411`.
**Do not repeat:** the stub returns 0.5 or uniform answers with exit 0, which is a default only `/health` refuses (`deem_server.py:137-154`); the rollback restart hides its failure (`deem-ctl:171`); every prompt is a fresh hook process, so the check runs per prompt (`user-prompt-submit.ts:109`); one lock serializes passes with no length cap (`deem_server.py:201-211`), so latency under load is UNKNOWN; the move is 81 files plus 45 outside, not 53 and 39.
**Contested:** grok contests the build-now `cli-deem` client (`grok/steer.md:170`), which hits N-deepseek-06-1; grok's "update has no pin or hold" (`grok/steer.md:158`) weakens N-deepseek-02-1; deepseek-05 contests grok-04's spawn-included measure; grok adopted deepseek's check after cross-reading, which counts as steered, not corroboration; mimo, swe and glm had no contest on file at review time.
