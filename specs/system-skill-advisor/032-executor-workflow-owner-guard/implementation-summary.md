---
title: "Implementation Summary"
description: "A prompt that names a deep-loop or spec-kit workflow plus an executor now keeps the workflow skill first; the ratchet and inventory failures are explained by their real causes."
trigger_phrases:
  - "executor workflow owner guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/039-executor-workflow-owner-guard"
    last_updated_at: "2026-10-28T07:17:16Z"
    last_updated_by: "claude"
    recent_action: "Recorded the Python guard port and the prefix-rule fix"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-039-executor-workflow-owner-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-executor-workflow-owner-guard |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Asking the advisor to "run a deep research loop with the cli-pi executor" now returns `system-deep-loop` first and the CLI hub directly under it, so the caller starts the workflow it named and runs the executor inside it. Before, the hub was lifted to 0.95 and took the route.

### Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test

`applyExecutorDelegationOverride` in `executor-delegation.ts` now looks for a passing `system-deep-loop` or `system-spec-kit` recommendation whose explicit-lane contribution scores at least 0.55 with phrase, author or explicit evidence. When it finds one, that recommendation stays first and the lifted hub follows with a confidence 0.001 below the owner's, still passing the threshold. Every other delegation prompt takes the old path and returns the same array as before.

The ratchet failure was not a scorer regression. Bisecting `lib/` across the ledger commit and the three scorer commits of the day, and the Python scorer back to the ledger commit, left `rr-iter3-066` and `rr-iter3-075` diverging every time. The operator shell exports `SPECKIT_PRIVATE_SKILL_ROOTS`, which lets the scan follow the `local-webflow` and `local-obsidian` links into the skills tree. Those skills sit outside the checkout and shift the Python scorer on the two prompts (sk-code 0.9 for the first, system-spec-kit 0.75 and so an abstention for the second). With the variable unset the ratchet passes 9 of 9. The ratchet and the ledger capture script now clear the variable, so the ledger keeps describing a clean checkout and no entry was added.

The same cause explains five more failures. `doctor-routing-slice`, `advisor-corpus-parity`, `python-ts-parity`, `holdout-independent` and `scorer-eval-baseline-ratchet` pin counts measured on a clean checkout (holdout top-1 46 against a baseline of 49, `doctor-control-10` ranking `local-webflow` above `sk-code`). Each now clears the variable for its run and restores it afterwards. None of them exists to cover private skills, so none was left alone; `advisor-graph-health` compares the live graph with discovery, needs the variable, and was not touched.

A follow-up closed the gap on `delegate this refactor to codex using gpt-6.1 terra`, which scored 0.82 because the cue `delegate to` does not match "delegate this refactor to" and the resolver returned null. `resolveExecutorDelegation` now also accepts "delegate <object> to <executor>" and "hand <object> off to <executor>": the executor noun must be the target of the `to` (optionally after "the", "a" or "an"), at most six object words may sit between the verb and it, and sentence punctuation or another "to" ends the object. The prompt now resolves `cli-codex` and reaches 0.95, and `run this task through opencode ...` is unchanged. "delegate the decision to the team", "hand off to QA" and an executor named only inside the object ("delegate the codex migration decision to the team") lift nothing. `codex` alone was not made an alias: the registry aliases for `cli-codex` are `codex cli`, `codex exec`, `delegate to codex`, `cli-codex` and `codex sandbox`, and the bare noun already enters the orchestrator-noun table from the packet name, so a bare alias would only fire `explain what codex is` and needed no metadata change. The Python scorer carries the same match so the two engines agree; the shared fixture gained two positive and two prose cases, which moves the delegation bucket from 9 to 13 in the baseline and in `advisor-validate`.

The release is recorded in `.skilled/skills/system-skill-advisor/changelog/v0.17.11.0.md`, with `SKILL.md` bumped to 0.17.11.0.

The skill-root inventory test failed because commit `c02124d0ff` added `outsideSurfaces()` to `router-replay-lib.cjs`, a `readdirSync` of the skills root with no `local-*` rule. Another agent added a rule comment and listed the file as `include`. Commit `cbf4aeb5cf` on main then replaced that comment with the advisor's trusted-root rule and the same `include` ruling, so the local edit was dropped in favour of it. The inventory test passes on that version; this packet only records it.

An alignment run against this work found three prompts that still routed wrong, and a catalog gap. "packet-local changelog", sk-doc's own declared phrase, and "Document a packet-local changelog." ranked system-spec-kit first, because the corpus-study rule in `fusion.ts` read `packet-local` as study vocabulary whenever no write or create verb governed the changelog. `packet-local` now counts as study vocabulary only when it qualifies something other than a changelog, so both prompts rank sk-doc first and the sk-doc router vocabulary reach check passes, while the packet-local prompt-template, helper and iteration prompts keep their routes. "Review this change iteratively using cli-opencode as the executor." ranked the CLI hub first, because the research-loop and review-loop checks in `explicit.ts` knew `iterative` and `iterations` but not the adverb, so the workflow-owner guard found no deep-loop owner. The adverb now counts, the guard keeps `system-deep-loop` first with the hub just below, and the Python fallback's deep-mode loop words read it as they read `iterate`. "how do I turn off the automatic worktree cleanup at session start" tied sk-git with two skills at the floor. sk-git's `graph-metadata.json` now declares `worktree cleanup`, `worktree reaper` and `numbered worktree sweep`, plus `session-start worktree cleanup` as a trigger phrase, and the prompt ranks sk-git first with no tie. The feature catalog gained an executor delegation entry covering the resolver, split handoffs and the guard. The release is `changelog/v0.17.18.0.md`.

### Mirror the guard in the Python fallback, and stop the prefix rule from crediting compounds

A second alignment pass closed the two gaps the first one left open. The Python fallback now runs the workflow-owner guard after its final sort, in `_apply_workflow_owner_guard`. With no explicit lane to read, it treats a passing `system-deep-loop` or `system-spec-kit` recommendation as the owner when one of its own matches is a declared signal, phrase, keyword or name match, the local counterparts of the native phrase, author and explicit evidence. It also runs the native research-loop and review-loop checks, and when either fires it lifts `system-deep-loop` to 0.82, the native direct-score floor that the same evidence earns there. The owner then goes first and the hub directly below it at the owner's confidence minus 0.001. All four workflow-owner prompts now rank the same on both engines, with matching confidences: `system-spec-kit` 0.95 then the hub 0.949 on the spec-folder prompt, and `system-deep-loop` 0.82 then 0.819 on the iteratively phrased review. A plain delegation keeps the hub first. The shared fixture gained the four cases under a `workflow-owner` branch, so the delegation bucket moved from 13 to 17.

The prefix rule in `scoreTokenOverlap` gave 0.45 partial credit whenever a skill word began with a prompt word of four or more letters. That rule exists for `plan` to `planning` and was added by `c7e11c1ef0`, which made the old two-way substring match one-way so `list` stopped matching `allowlist`. Enumerating it over the six prompt corpora showed it also credited compounds: `open` to `opencode`, `launch` to `launchpad`, `back` to `background`, `over` to `overview`. `autoreap` was one more of those. Credit now needs the extra letters to read as a suffix: a vowel-led tail, one of `s`, `d`, `ly`, `ment`, `ments`, `ness`, `ful` and `less`, a doubled final consonant before the suffix (`planning`), or `nce`, `nt`, `r` after a final `e` (`convergence`). With the rule fixed, sk-git declares `speckit_worktree_autoreap` and `worktree autoreap`, and the variable prompt reaches sk-git. Measured from source, the rule on its own moved no corpus, holdout, ambiguity or bucket number. With the new metadata and the old rule, the holdout dropped to 48 again, which confirms the rule as the cause. The release is `changelog/v0.17.19.0.md`, and the catalog sentence saying the fallback had no guard was corrected.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Modified | Workflow-owner guard in the route path |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modified | Five tests for the guard and the unchanged delegations, plus fourteen for the split handoff |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | Split-handoff match mirrored in the Python resolver |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Modified | Two split-handoff and two prose cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-validate.vitest.ts` | Modified | Delegation bucket total 9 to 13 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | Recaptured with `--write`: delegation bucket 9 of 9 to 13 of 13 and the commit hash, nothing else |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` | Modified | Scoring date pinned and recorded instead of read from the wall clock; private skill roots cleared |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-capture-date.vitest.ts` | Added | Two captures under different injected days are identical; an invalid date is rejected |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modified | Hermetic against private skill roots |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | Modified | Same variable cleared on capture |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts`, `tests/legacy/advisor-corpus-parity.vitest.ts`, `tests/parity/python-ts-parity.vitest.ts`, `tests/parity/holdout-independent.vitest.ts`, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Modified | Same private-skill hermetic setup |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Superseded by `cbf4aeb5cf` | Trusted-root rule for `local-*` links in `outsideSurfaces()` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | Superseded by `cbf4aeb5cf` | File listed in `RULED` as `include` |
| `.env.example` | Modified | Lists `SPECKIT_PRIVATE_SKILL_ROOTS`, which the launcher forwards but the file never named |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | `packet-local` is study vocabulary only when it does not qualify a changelog |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | `iteratively` counts in the research-loop and review-loop checks |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | `iteratively` read like `iterate` in the deep-mode loop words |
| `.skilled/skills/sk-git/graph-metadata.json` | Modified | Worktree cleanup vocabulary in `intent_signals` and `derived.trigger_phrases` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` | Modified | Two golden rows for the worktree cleanup phrasings |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts`, `tests/scorer/executor-delegation.vitest.ts`, `tests/routing-parity-deep-skills.vitest.ts` | Modified | Loop-word cases, the iteratively executor prompt and the Python deep-mode case |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/packet-local-changelog.vitest.ts`, `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts` | Added | The short changelog prompts, and the worktree cleanup prompts with a session-state control |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/executor-delegation.md`, `feature-catalog/feature-catalog.md` | Added, Modified | Executor delegation entry and its root row, counts 44 to 45 and 7 to 8 |
| `.skilled/skills/system-skill-advisor/leaf-manifest.json`, `leaf-aliases.json` | Regenerated | The new catalog leaf |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.18.0.md`, `SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Added, Modified, Regenerated | Release 0.17.18.0 and its Hermes copy |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | Workflow-owner guard after the final sort, with a match-evidence flag and the loop checks |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Modified | Four `workflow-owner` cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modified | Python order test, spec-kit owner case, `workflow-owner` branch required |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-validate.vitest.ts`, `scripts/routing-accuracy/scorer-eval-baseline.json` | Modified, Recaptured | Delegation bucket 13 to 17 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` | Modified | Partial credit only for a suffix extension |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/lexical-candidate-dedup.vitest.ts`, `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts` | Modified | Suffix and compound cases; the variable prompts and the auto review control |
| `.skilled/skills/sk-git/graph-metadata.json` | Modified | `speckit_worktree_autoreap` and `worktree autoreap` |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/executor-delegation.md` | Modified | Python guard sentence and source row |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.19.0.md`, `SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Added, Modified, Regenerated | Release 0.17.19.0 and its Hermes copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first: the whole advisor suite, then the new tests written before the code and run against the old module, where the two workflow tests failed. The guard went in, `npm run typecheck` and `npm run build` ran, and the live CLI was read for both prompts through a fresh socket directory because the shared daemon still held the old build; it served the new order a few minutes later. The ratchet cause came from swapping `lib/` and `skill_advisor.py` from earlier commits into place and restoring them after each run. Nothing is staged or committed.

The follow-up wrote the new tests first and ran them on the module as it stood, then on `HEAD`'s module, then built the match in TypeScript and Python.

A second follow-up fixed the calendar drift in the scorer baseline. The derived lane multiplies each skill's score by `0.5 ^ (age / 90 days)`, floored at 0.1, where age runs from the skill's `derived.generated_at` to the scoring clock. A capture on a different day therefore moves the numbers with no scorer change: scoring at `2027-03-05` gave full corpus 154 and ambiguity 17 against 155 and 19 at `2026-10-11`. The capture script already pinned the clock to midnight UTC of the capture day, but took that day from the wall clock, so each recapture re-measured the calendar. It now reads the date from `SPECKIT_EVAL_BASELINE_SCORING_DATE`, else from the `capturedAt` already recorded in the baseline, and exits 2 for an invalid date or when neither exists. The ratchet and the three other readers already replay `capturedAt` at midnight UTC, so they needed no change. The script also clears `SPECKIT_PRIVATE_SKILL_ROOTS`, the same environment hole the ratchet closed, so a recapture on the operator's shell cannot see private skills. The baseline was then recaptured with `--write`, replacing the earlier hand edit: only `capturedAtSha` and the delegation bucket (9 to 13) moved.
The alignment follow-up wrote its tests first and ran them on the unchanged scorer, where eight failed. The first full run after the fix dropped holdout top-1 from 49 to 48. Removing one new sk-git phrase at a time showed that only `speckit_worktree_autoreap` caused it: `phraseVariants` derives a spaced form, its token `autoreap` starts with `auto`, and the lexical prefix rule then gave sk-git a partial hit on "auto review this PR". The phrase was dropped rather than the baseline recaptured, since that row is not an intended change. The same run showed `prompt-policy-gold-replay` declining the two short changelog prompts as below the prompt-time floor, so they moved from the golden fixture into a scorer test.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard sits in the route path of the override, not in `fusion.ts` | The override already owns the lift, and `fusion.ts` imports this module, so a shared helper would be circular. |
| Owner must pass the threshold and carry explicit-lane evidence | A side mention of "research" or "plan" must not demote an executor request that never asked for the workflow. |
| Hub confidence is owner minus 0.001 | The order is strict, the hub still passes the 0.8 threshold, and the gap does not read as a second tie in the ambiguity check. |
| Ratchet cleared of private skills, ledger left alone | The two prompts agree on a clean checkout, so a ledger entry would record a divergence only this machine has. |
| `packet-local` excluded only before `changelog` | The study prompts that carry it (a prompt template, a helper, an iteration) keep the bonus, and the authoring-verb exception still covers verb-led changelog requests. |
| `SPECKIT_WORKTREE_AUTOREAP` not declared on sk-git (first alignment pass) | Every declared form yields the token `autoreap`, which costs the holdout one row through the shared prefix rule; changing that rule is scorer work outside a vocabulary fix. Reversed by the second pass, which fixed the rule. |
| Prefix credit decided by the shape of the tail, not a word list | A dictionary of compounds would need upkeep; English suffixes start with a vowel or are a short closed set, while the compounds that leaked (`autoreap`, `opencode`, `launchpad`) add a consonant-led word. |
| Python owner evidence read from its own match labels | The fallback has no explicit lane, so the guard reads the `(signal)`, `(phrase)`, `(keyword)` and `(explicit)` labels its scorer already writes, the counterparts of the native evidence kinds. |
| Python lifts the loop owner to 0.82 only inside the guard | A global loop boost would move the plain "Review this change iteratively." prompt, which both engines send to sk-code; scoping the lift to delegation prompts keeps every other prompt unchanged. |
| The explain phrasing left abstaining | The read-only explainer floor is advisor-wide and pinned by `read-only-explainer.vitest.ts`; lifting it for one skill would be the scorer special case the brief ruled out. |
| Fast-mode mapping prompt left as is | Both phrasings tie three skills at the 0.82 floor and report `ambiguous`, so the advisor already declines to pick. The change is TypeScript in a Pi extension, which is sk-code's surface, while the model roster it maps is cli-external-orchestration's knowledge, and no skill's metadata names the extension. Picking one by tuning would claim an owner nobody has declared. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite baseline (`vitest run`) | 7 failed, 1246 passed, 8 skipped of 1261 tests; 7 of 150 files failed; exit 1 |
| Advisor suite after the ratchet fix only | 5 failed, 1253 passed, 8 skipped of 1266 tests; exit 1 |
| Advisor suite final, variable exported | 0 failed, 1258 passed, 8 skipped of 1266 tests; 150 of 150 files passed; exit 0 |
| Advisor suite final, variable unset | 0 failed, 1258 passed, 8 skipped of 1266 tests; 150 of 150 files passed; exit 0 |
| Drift guard plus both deep parity suites | Baseline 21 passed, final 21 passed, exit 0 both times |
| `delegate this refactor to codex using gpt-6.1 terra` on old and new module | Both 0.82 before the follow-up; 0.95 with target `cli-codex` after it |
| Follow-up: `tests/scorer/executor-delegation.vitest.ts` | 28 of 28 pass; on `HEAD`'s module 8 fail, 20 pass |
| Follow-up: whole advisor suite, variable exported | 0 failed, 1272 passed, 8 skipped of 1280 tests; 150 of 150 files passed; exit 0 (was 1258 of 1266) |
| Second follow-up: capture under injected days `2026-10-27` and `2027-03-05` | Byte-identical; moving the scoring date to `2027-03-05` prints 154 and 17 as a control |
| Second follow-up: whole advisor suite | 0 failed, 1274 passed, 8 skipped of 1282 tests; 151 of 151 files passed; `tests/parity` 62 of 62; 21 of 21 routing parity |
| Follow-up: live CLI for `delegate the decision to the team` and `hand off to QA` | No recommendations, as before |
| `tests/scorer/executor-delegation.vitest.ts` | 14 of 14 pass; on the old module 2 fail, 12 pass |
| `tests/parity/local-native-divergence-ratchet.vitest.ts` | Baseline 1 failed of 9, final 9 of 9 |
| Typecheck and build of the advisor runtime | Both exit 0 |
| `node --test` for sk-create-skill and sk-code-skilled | 70 of 70 and 32 of 32, exit 0 |
| `validate.sh specs/system-skill-advisor/039-executor-workflow-owner-guard --strict` | `RESULT: PASSED` |
| Alignment follow-up baseline, whole advisor suite | 1 failed, 1325 passed, 8 skipped of 1334; 153 of 154 files; the failure was a capture-date race with another session's commit |
| Alignment follow-up final, whole advisor suite | 0 failed, 1339 passed, 8 skipped of 1347; 156 of 156 files; exit 0 |
| New tests on the unchanged scorer | 8 failed, 73 passed of 81 across the four edited files; the two later test files failed 2 of 2 and 3 of 4 on `HEAD`'s `fusion.ts` and sk-git metadata |
| `ci-router-vocabulary-reach.cjs --hub sk-doc` | Before `outranked=  1`, `RESULT: FAILED`; after `outranked=  0`, `RESULT: PASSED` |
| `validate_catalog_package.py --package system-skill-advisor` | `PASS: 0 violations` |
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0` |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `python3 tests/python/test_skill_advisor.py` | `pass=89, fail=0` (run after the change only) |
| Second pass baseline, whole advisor suite | 1 failed, 1338 passed, 8 skipped of 1347; 155 of 156 files; the failure was the capture-date test reading two commit hashes because another session committed mid-run, and it passed alone |
| Second pass, Python harness before and after | `pass=89, fail=0` both times |
| Second pass, new tests on the unchanged code | delegation `Tests  2 failed, 28 passed (30)`, prefix `1 failed, 5 passed (6)`, sk-git `1 failed, 5 passed (6)` |
| Second pass, negative control (new metadata, old rule) | `holdout top-1 regressed: live=48/66 baseline=49`; "auto review this PR" ranked sk-git |
| Second pass, baseline recapture from a fresh build | Only `capturedAtSha` and delegation 13 to 17 moved; holdout 49 |
| Second pass, `ci-router-vocabulary-reach.cjs` for all seven hubs | `RESULT: PASSED`, `outranked=  0` each |
| Second pass, catalog, skill-root metadata and Hermes | `PASS: 0 violations`; `checked=14 passed=14 failed=0`; `PASS: 67 Hermes skill copies in sync` |
| Second pass final, whole advisor suite | 0 failed, 1345 passed, 8 skipped of 1353; 156 of 156 files; exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Split handoffs are bounded, not free text.** "delegate" or "hand" must reach the executor through a `to` within six object words and no sentence punctuation. A phrasing like "get codex to take this refactor" still depends on the older cue or alias paths. Accepted: the bound is what keeps "delegate the decision to the team" and an executor named only inside the object from reading as a handoff (`runtime/lib/scorer/executor-delegation.ts:94-101`).
2. **The guard names two owners.** A third workflow-owning skill would need adding to `WORKFLOW_OWNER_SKILL_IDS`. Accepted: adding an owner is a one-entry change to the set at `runtime/lib/scorer/executor-delegation.ts:62`.
3. **Daemon and dist freshness.** `advisor_rebuild` refused while the status was live, and a stale shared daemon kept the old order until it restarted. Touching any runtime source, even to restore identical content, marks `dist/` stale and makes the CLI tests report `daemon launcher exited with code 1` until `npm run build` runs again.
4. **Moving the scoring date is manual.** The pinned date stays `2026-10-11` until someone exports `SPECKIT_EVAL_BASELINE_SCORING_DATE` for a capture; the baseline then measures the derived lane's age haircut at that date, and the prose in `references/scoring/validation-baselines.md` (dated 2026-07-30) is a separate snapshot this packet did not touch. Accepted: the fixed date is deliberate, so a recapture on a later day does not move the numbers through the age discount (`changelog/v0.17.11.0.md:27`).
5. **The variable name abstains on the Python fallback.** The native scorer routes "how do I set SPECKIT_WORKTREE_AUTOREAP=0" to sk-git at 0.82. The Python fallback ranks sk-git first at 0.71, below its 0.8 threshold, so a strict degraded answer returns nothing. A single-word signal earns too small a boost there, and lifting it would need sk-git keywords outside `graph-metadata.json`.
6. **An explain-led question abstains.** "Explain how to disable the periodic session-start worktree cleanup." stays at the read-only explainer floor (`runtime/lib/scorer/text.ts:151`), as every explain-led question does for every skill.
7. **The iteratively executor prompt is flagged ambiguous.** `system-deep-loop` leads at 0.82 and the hub follows at 0.819, while `sk-code` keeps 0.88 in third place, exactly as the shipped "over several iterations" phrasing ranks. The guard orders by ownership, not confidence, so a caller reading confidence alone sees sk-code higher.
8. **The Python guard's evidence is coarser than the native one.** It has no explicit-lane score, so it does not apply the native 0.55 floor, and it does not read the native skill-specific or `write-` evidence. Any declared signal or keyword on a passing owner counts (`runtime/scripts/skill_advisor.py:4376`).
9. **A vowel-led compound still earns prefix credit.** `open` to `openai` and `stand` to `standalone` keep the 0.45 partial hit, because their second word starts with a vowel the way a suffix does (`runtime/lib/scorer/text.ts:106`).
10. **The Python fallback's partial-word rule still matches both ways.** `analyze_request` credits `term in corpus_word or corpus_word in term`, so it never took the one-way fix either; the holdout and the ratchets score the native rule.
<!-- /ANCHOR:limitations -->

---


