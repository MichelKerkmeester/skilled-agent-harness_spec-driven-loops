---
title: "Implementation Summary"
description: "Eight of the nine review P2 findings are fixed: seven behind a test that failed first and the dead crash arm with the crash tests still green. One is accepted with its fixture row. A 64K whitespace paste no longer stalls the strip, a pasted reply no longer steers the fire gate or the 64 KiB cut, and a route receipt now waits for the host to take the output."
trigger_phrases:
  - "review p2 fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/014-review-p2-fixes"
    last_updated_at: "2026-11-19T09:31:09Z"
    last_updated_by: "generate-context"
    recent_action: "Merged the review fixes to main as c8404904544 with every check green"
    next_safe_action: "Decide whether to open follow-ups for the DSH receipt and Python flag gaps"
    packet_purpose: "Purpose: Every review finding is either fixed with a test that failed before the fix, or recorded as accepted with the operator's reason, and the strip fixture's 24 rows still pass in both languages."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts"
    session_dedup:
      fingerprint: "sha256:b176ec60db32c15e527a3f563ba139523c53d7d1fd57e9587401ff1a63a7ed78"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-19T09:31:09Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-review-p2-fixes |
| **Completed** | 2026-11-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor now strips a 64K run of spaces and newlines in 1 ms instead of 1.5 s, and the local scorer in 2 ms instead of 12 s. A pasted earlier reply no longer decides whether the advisor fires or pushes the task past the hook's 64 KiB cut. A route receipt is kept only once the host has taken the output.

### Phase 14: review-p2-fixes

Each behavior fix landed behind a test that failed on the parent commit. The marker regex stops its post-boundary whitespace at a newline, in both languages, so the strip output is unchanged. The Claude hook strips before it cuts, and the shared fire gate `skippedAdvisorResultFor` reads stripped text, so `Claude replied: I used sk-doc ... Now: thanks` is skipped while `Update the README with sk-doc conventions` still fires. The hook holds its route receipt change for the same commit as the directive receipt when the host confirms its write, on repeat turns too. Its weak follow-up guard lets a startup, resume or compact turn through. The subprocess parser keeps `confidenceFloored`, and the crash catch lost its unreachable arm.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/prompt-policy.ts` | Modified | Linear `TASK_MARKER` |
| `runtime/scripts/skill_advisor.py` | Modified | Linear `_TASK_MARKER`, the same set as the TypeScript one |
| `hooks/claude/user-prompt-submit.ts` | Modified | Strip before the cut, deferred route receipt, lifecycle guard, dead crash arm removed |
| `runtime/lib/skill-advisor-brief.ts` | Modified | Fire gate reads stripped text |
| `runtime/lib/subprocess.ts` | Modified | Parser keeps `confidenceFloored` |
| `runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Modified | Timing case and two marker guards |
| `runtime/tests/python/test_skill_advisor.py` | Modified | The same three checks in the Python harness |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | Three receipt cases and four paste cases |
| `runtime/tests/legacy/advisor-brief-producer.vitest.ts` | Modified | Paste skip and plain-task fire cases |
| `runtime/tests/subprocess-output-cap.vitest.ts` | Modified | Floor flag kept and not added |

### Follow-ups

The reopened phase closed both known limitations and the open findings of the two alignment runs. DSH and Vibe now defer the handler's receipts and commit them only once a brief is delivered. The Python bridge keeps `confidenceFloored`, so the subprocess parser finally has a producer. The launcher forwards both routing thresholds to the daemon. The docs that misdescribed the strip, the weak follow-up hold, the crash fallback, the cold-start window and the state dir now match the code. The routing corpus pin is recaptured, and the skill is released as 1.1.1.0.

| File | Action | Purpose |
|------|--------|---------|
| `hooks/dsh/prompt-advisor.mjs` | Modified | Defer receipts, `commitDelivery`, commit after the notice is appended |
| `hooks/vibe/prompt-advisor.mjs` | Modified | Defer receipts, commit only when a brief is returned |
| `hooks/tests/dsh-prompt-advisor.test.mjs` | Modified | Defer flag asserted; commit only after the notice |
| `runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modified | Commit on a delivered turn, none on a repeat |
| `runtime/scripts/skill_advisor.py` | Modified | Bridge copies `confidenceFloored` |
| `runtime/tests/python/test_skill_advisor.py` | Modified | `BRIDGE-FLOOR` case |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | Both thresholds on `CHILD_ENV_ALLOWLIST` |
| `.skilled/bin/launcher-threshold-env.vitest.ts` | Created | Both thresholds reach the child env |
| `graph-metadata.json`, `SKILL.md` | Modified | Routing terms for the new features; version 1.1.1.0 |
| 013-drift-guard-repairs `baseline/` | Modified | Corpus pins and metrics recaptured |
| Skill, spec-kit and root docs, `changelog/v1.1.1.0.md`, `v4.1.0.0.md` | Modified or created | The doc findings below |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran in worktree `475-advisor-review-p2-fixes`. GPT-6 Luna `xhigh` `fast` leaves made every edit from literal briefs. Six leaves wrote the tests first, and the conductor confirmed each new case red for its own reason before the matching fix brief went out. Eight fix leaves followed, with the four hook edits run one after another, then three comment leaves for the review findings. The conductor ran every check and made seven commits: `5f1bfa57c2d` parser flag, `520c67809f5` TypeScript marker, `cfad0401138` fire gate and cut, `1333eba31bd` Python marker, `71c920f7948` route receipts and lifecycle guard, `afd90f64e1e` crash arm, `a7964556816` guard comment and test title. One H4 dispatch stopped on a wrong acceptance check in its brief and was re-sent with the check fixed. No leaf fell back to Vibe.

The follow-ups ran in worktree `478-advisor-review-follow-ups`. Four Luna leaves wrote the red tests, and the conductor confirmed each red for its own reason: the DSH defer flag `undefined` and no commit, Vibe `[]` commits, the Python row without the flag, and the launcher child env `undefined`. Four fix leaves followed. The DSH and Vibe leaves dropped the brief's two-line comment in `runAdvisor` without saying so, and two one-line leaves restored it. `apply-fixes.cjs` applied the 17 literal fixes. The remaining doc findings went to Luna as finding-plus-fact briefs rather than literal old and new text, because no literal fix existed for them. The conductor checked each added claim against the code before committing. The conductor tuned the routing terms against the probes itself and recaptured the corpus pin with the packet's own capture scripts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| R1-P2-004 accepted: the last task marker still wins, as fixture row `two-markers-in-user-task` records | A pasted reply can hold its own `Task:` line, and cutting at the first marker would keep the reply's skill names in the scored text |
| Defer the route receipt on every turn of a host that confirms its write, not only on turns with a directive commit | The directive store returns a commit only on full delivery, so the plan's "at once when no commit is deferred" would still write before stdout on every reduced repeat turn. The extra test `keeps the earlier route receipt when a reduced repeat turn fails to write` covers it |
| Read the receipt clock when the turn is scored, and defer only the write | The receipt carries the same clock it carried before, so the next turn's guard compares like with like |
| The TypeScript marker fix landed before the hook's strip-before-cut | After that change the strip runs on uncut input, and the old pattern would have spent seconds on a large paste |
| Keep the 50 ms bound on the TypeScript timing test, which @review suggested raising to 500 ms | REQ-001 names 50 ms. The fixed strip measured 1 ms and the parent 1.5 to 3.2 s, so the bound leaves wide room on both sides |
| T016's check narrowed to the ternary arm | `return { effectiveEmitted: emitted };` at the end of `applyDirectiveLifecycle` is live fallback code. The first H4 leaf stopped on that conflict and changed nothing |
| Drop the `weak follow-up routing` signal after adding it | The lexical lane matches prompt tokens as substrings, so `up` in "Set up" hit `follow-up`. A harder-corpus `sk-git` prompt then routed natively to the advisor and the divergence ratchet failed. `route receipt` already names the feature |
| Add `outage line` and `lifecycle clock` as well as the advisor-prefixed forms | The explicit lane matches exact phrases, and probe P03 says "the outage line" with no "advisor" |
| P04 left with the CLI hub | `executor-delegation.ts:55` lifts a prompt that names an executor CLI such as `dsh` to 0.95 by design. Metadata cannot outrank it, and changing that scorer policy is outside this phase's file list. See limitation 4 |
| Three files outside the spec's list were changed | `leaf-manifest.json`: the skill-authoring commit hook blocks a new catalog or playbook file until the manifest is regenerated. `tests/manual-testing-playbook.vitest.ts`: it pins the scenario count, which the two new scenarios raised. The five 013 `baseline/` files: the spec named `routing-accuracy/*` for the pins, but the gate reads them from the 013 baseline |
| Recapture the corpus pin in the 013 packet's `baseline/` | The CI gate reads its pins from there, and the last recapture, `6f59f51b022`, set the precedent of updating it in place from the work that moved the corpus |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 baseline | First run in the fresh worktree: `VT` 480 passed, 8 failed, 1 skipped, `PY` pass=116 fail=1, because the worktree had no skill graph. After `skill-advisor.cjs advisor_rebuild --trusted --force true`: `VT` 488 passed, 1 skipped, `PY` pass=117 fail=0 |
| T002 build | `npm run build` exit 0 |
| Red before each fix | TypeScript timing 3,222 ms against 50; Python 11,447 ms against 500; floor flag `undefined`; producer paste `ok` not `skipped`; hook: receipt written on a failed write, `sk-git` replacing `sk-doc` on a failed repeat, compact turn skipped, paste over the cap sent cut, `sk-doc` paste fired |
| T017 suites | Build exit 0. `VT` exit 0, 500 passed, 1 skipped. `PY` exit 0, pass=120, fail=0. `advisor-brief-producer.vitest.ts` 23 passed. Rerun after the review commits: build exit 0, `VT` plus the producer file 523 passed, 1 skipped, `PY` pass=120, fail=0 |
| T018 measured behavior | TypeScript strip 1 ms, Python 2 ms, two markers `"commit it"` in both, built `skippedAdvisorResultFor` gives `skipped` for the `sk-doc` paste and `null` for the plain task |
| T019 parent criterion 1 | The pasted README prompt in the worktree lists `sk-code` first, 0.82 |
| T016 | `rg -n ': \{ effectiveEmitted: emitted \};'` on the hook prints nothing |
| @review, post_execution gate | PASS, APPROVED, no P0 or P1, advisory 91/100. It ran the new tests against the parent commit: all eight behavior tests fail there on assertions. A 200,000-case fuzz of the old and new marker regex and a 20,000-case TypeScript-to-Python strip fuzz each found 0 differences. Four P2: the stale guard comment and the hook test title were fixed. The timing bound was kept, see Key Decisions, and the inert parser flag is limitation 2 |
| Luna refutation pass, read-only | Fixes 1, 2, 3, 5 and 6 hold. Fix 4 was refuted for the DSH runtime only, which calls the shared handler without deferral. That file is not in this phase's scope and behaves as it did on the parent, see limitation 1 |
| Follow-up baseline, worktree 478 | After `advisor_rebuild`: `VT` plus producer and launcher-bootstrap 544 passed, 1 skipped; `PY` pass=120 fail=0; DSH 15 passed; bin tests 77 passed; full runtime suite on main 2531 passed, 8 skipped |
| Follow-up red before each fix | DSH `[['dsh', undefined]]` against `[['dsh', true]]`, commits `[]`; Vibe commits `[]`; Python `BRIDGE-FLOOR` row without the flag, pass=120 fail=1; launcher `expected undefined to be '0.7'` and `'0.4'` |
| T035 final suites, after both review passes | Build exit 0. The criterion-1 `VT` set 502 passed, 1 skipped. `PY` pass=122 fail=0. DSH 18 passed. Vibe 15 passed. Bin tests 79 passed. Corpus gate `overall_pass` true, advisor 0.5816. Full runtime suite: 2533 passed, 8 skipped, 190 files, against 2531 on main. One run before that reported one failed test, which was not captured and did not recur in three later runs, so it is recorded as an unidentified flake. The first full run after the playbook commit failed on `manual-testing-playbook.vitest.ts`, which pinned 53 scenarios. That test now pins 55 |
| T033 corpus gate | The pin check prints `corpus matches the pinned baseline hashes`. `score-routing-corpus.py` with the workflow floors exits 0: advisor 0.5816, gate3 f1 0.9844, TT 111, FT 3, FF 1. The divergence ratchet and holdout independence pass 15 of 15 |
| T032 probes | P01 `system-skill-advisor` 0.86. P02 `system-skill-advisor` 0.82 tied with `sk-code`. P03 `system-skill-advisor` 0.82. P05 `sk-code` 0.84, accepted by the operator. P06 `system-skill-advisor` 0.82. P04 `cli-external-orchestration` 0.95, with the advisor second |
| Follow-up @review | First verdict CHANGES REQUESTED, advisory 87/100, one P1 and four P2. P1: DSH stored its own directive receipt inside `deliveredContext`, before `createNotice`, so a failed notice left the next turn with the head alone. Fixed with a `remember` step run after the notice, behind a test that got `Advisor: route sk-code` instead of the full brief before the fix; DSH 17 passed. P2-3: the Python deep routing layer raised a floored row and kept the flag. Fixed behind `DEEP-FLOOR`, which failed first; `PY` pass=122. P2-5: five probes with `line`, `pipeline`, `reply`, `strip` and `clock` pulled none to the advisor, and the ratchet and corpus numbers did not move, so no change. P2-2 and P2-4 are limitations 6 and 7 |
| Follow-up Luna refutation pass, read-only | C2 (Vibe commits only on a returned brief) and C4 (launcher forwards both thresholds, read in `compat/contract.ts`) hold. C1 was refuted for a host reply whose `messages` is not an array: the spread threw after the receipts were stored. The message list is now built before any receipt is stored, behind a test. C3 was refuted for a row at 0.896 that rounds to 0.90 against a 0.89 deep score and keeps its flag. No change, by the conductor's judgment: the rise comes from rounding, not from deep-routing evidence, so the flag is still true. C5 found no test of Vibe swallowing a failed commit; one was added |

### Follow-up Requirements

| Requirement | Evidence |
|-------------|----------|
| REQ-010 | DSH and Vibe tests: no commit on an undelivered turn, one on a delivered turn; DSH also keeps its own directive receipt until the notice exists. DSH 18 and Vibe 15 passed |
| REQ-011 | `BRIDGE-FLOOR` and `DEEP-FLOOR` pass; `PY` pass=122 fail=0 |
| REQ-012 | `launcher-threshold-env.vitest.ts` passes both cases; bin tests 79 passed |
| REQ-013 | The Alignment Findings table below names every 015 and 016 finding id |
| REQ-014 | Pins match, corpus gate passes; P01 and P03 reach the advisor; P04 accepted on the CLI hub by the operator |
| REQ-015 | `SKILL.md` `version: 1.1.1.0`, `changelog/v1.1.1.0.md`, v4.1.0.0 Skill Advisor subsection, commit `210d50871f7` |

### Alignment Findings

| Finding | Result | Evidence |
|---------|--------|----------|
| L1-2, L1-3, L1-4, L2-1, L2-2, L2-4, L2-5, L3-1, L4-2, L4-3, N1, N2, N3, N4, N6 | Fixed with the doc run's literal text | `0c4dc99b608`, applied=15 skipped=0 |
| C-01, C-05 | Fixed with the skilled run's literal text; C-01 reworded again to name the shim failure and the handler crash apart | `0c4dc99b608`, then the hook reference commit |
| D-01 | Already fixed by T009; left out | The fire gate reads stripped text |
| B-01 | Hook reference names the strip and the hold, lists `route-receipt.ts` and its test; scorer reference names the strip | `skill-advisor-hook.md`, `advisor-scorer.md` |
| B-02 | Bench README names the follow-up and receipt measures | `runtime/bench/README.md` |
| B-03 | Catalog entries SC-006 and CL-011, counts 48 features, Claude hook entry names the crash fallback | `feature-catalog/` |
| B-04 | Playbook scenario names the crash fallback and gains SC-006 and CL-011 scenarios | `manual-testing-playbook/` |
| C-02 | Skill README names the strip, the hold and `confidenceFloored` | `system-skill-advisor/README.md` |
| C-03 | Root README qualifies the 0.8 rule | `README.md` Skill Routing |
| C-04, BAT-01 | `readme-check` note added; the count checker passes | `check_derived_readme_counts.py` SUMMARY pass=1 |
| C-06 | Appended to the v4.1.0.0 Skill Advisor section | `v4.1.0.0.md` |
| C-07 | `SKILL.md` 1.1.1.0 and `changelog/v1.1.1.0.md` | `210d50871f7` |
| X-01, L4-1 | ENV-REFERENCE names the route-receipt store and the skipped outcome | `ENV-REFERENCE.md` |
| L3-2 | Fail-open playbook runs the hook through `gtimeout`, `timeout` or plain `node` | `cli-hook-transport-down-fail-open.md` |
| L2-3 | Warm-only entry states when the 5-second cap applies | `cli-runtime-warm-only-fallbacks.md` |
| L4-4 | Fixed in code: the launcher forwards both thresholds | `66dba4840eb` |
| N5 | Recheck confirmed the last recorded run, 51.3% and 42.5%, missed the 80.5% and 77.5% slices; the catalog says so | `native-validate-slices.md:430-436` |
| X-02, BAT-02 | No longer reproduce: the 016 parent validates with 0 errors | `validate.sh --strict --no-recursive` |
| D-02 | Routing terms added | See T032 probes |
| PRB-01, PRB-02, PRB-04, PRB-05 | Met: P02, P03 and P06 reach the advisor; P05 stays `sk-code`, accepted | T032 probes |
| PRB-03 | Accepted by the operator: P04 stays with the CLI hub | Limitation 4 |
| A1 | Both pins recaptured; the gate passes | T033 |
| A3, A4 | Accepted by the operator | The 015 triage |
| A2, D-03, P11, L1-1 | No action: A2, D-03 and P11 needed none, L1-1 was refuted | The 015 and 016 triage |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Closed by the follow-ups: the route receipt now waits on DSH and Vibe too.** Both extensions pass `deferDirectiveReceipt: true` and commit after delivery. Pi sends no session id, so it writes no receipt and needed no change.
2. **Closed by the follow-ups: the parser flag has its producer.** `_legacy_recommendations_from_native` copies `confidenceFloored`. The first commit's message still overstates the old effect on the hook.
3. **One brief ran long.** The route receipt brief was 124 lines against the strategy's 90, because the new functions had to be pasted whole. Luna applied it verbatim.
4. **Probe P04 still routes to the CLI hub.** "rotate the session lifecycle clock when dsh starts an agent or finishes compaction" names the `dsh` executor, and `executor-delegation.ts` lifts a named executor to 0.95 (`ROUTE_CONFIDENCE`, line 55). The advisor ranks second with a higher raw score, 0.525 against 0.439. The fix would add `system-skill-advisor` to the module's workflow-owner skills, the ones a named executor never outranks. That is a scorer-policy change outside this phase's files. The operator accepted P04 on the CLI hub, because naming an executor is a deliberate routing signal.
5. **The routing corpus pin lives in another packet.** The CI gate reads `013-drift-guard-repairs/baseline/routing-baseline.json`, so any change to the labeled or holdout corpus has to recapture it there, as this phase did.
6. **Vibe commits before the composer writes stdout.** `buildAdvisorPart` commits as soon as it has a brief, and `turn-start.mjs` writes its output later, under one 20-second timeout. A kill or failed write in that window leaves receipts for text the model never got. This is narrower than before, when the handler committed even earlier. The fix would return the commit with the text and run it in the composer's write callback, in `turn-start.mjs`, which is outside this phase's files.
7. **Other advisor variables are still stripped by the launcher.** @review listed scorer flags such as `SPECKIT_ADVISOR_RRF_FUSION`, prompt-policy keys and skill-graph watcher keys that are not on `CHILD_ENV_ALLOWLIST`. Some are read only in the hook process, where stripping them is harmless. It has not been settled key by key which process reads each one, so this phase forwarded only the two documented thresholds.
<!-- /ANCHOR:limitations -->

---
