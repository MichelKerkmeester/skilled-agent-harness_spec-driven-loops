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
    last_updated_at: "2026-10-27T19:44:35Z"
    last_updated_by: "claude"
    recent_action: "Recorded the guard, the ratchet cause and the inventory fix"
    next_safe_action: "None; the five private-skill suites are the operator's call"
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
| **Completed** | 2026-10-27 |
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
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first: the whole advisor suite, then the new tests written before the code and run against the old module, where the two workflow tests failed. The guard went in, `npm run typecheck` and `npm run build` ran, and the live CLI was read for both prompts through a fresh socket directory because the shared daemon still held the old build; it served the new order a few minutes later. The ratchet cause came from swapping `lib/` and `skill_advisor.py` from earlier commits into place and restoring them after each run. Nothing is staged or committed.

The follow-up wrote the new tests first and ran them on the module as it stood, then on `HEAD`'s module, then built the match in TypeScript and Python.

A second follow-up fixed the calendar drift in the scorer baseline. The derived lane multiplies each skill's score by `0.5 ^ (age / 90 days)`, floored at 0.1, where age runs from the skill's `derived.generated_at` to the scoring clock. A capture on a different day therefore moves the numbers with no scorer change: scoring at `2027-03-05` gave full corpus 154 and ambiguity 17 against 155 and 19 at `2026-10-11`. The capture script already pinned the clock to midnight UTC of the capture day, but took that day from the wall clock, so each recapture re-measured the calendar. It now reads the date from `SPECKIT_EVAL_BASELINE_SCORING_DATE`, else from the `capturedAt` already recorded in the baseline, and exits 2 for an invalid date or when neither exists. The ratchet and the three other readers already replay `capturedAt` at midnight UTC, so they needed no change. The script also clears `SPECKIT_PRIVATE_SKILL_ROOTS`, the same environment hole the ratchet closed, so a recapture on the operator's shell cannot see private skills. The baseline was then recaptured with `--write`, replacing the earlier hand edit: only `capturedAtSha` and the delegation bucket (9 to 13) moved.
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Split handoffs are bounded, not free text.** "delegate" or "hand" must reach the executor through a `to` within six object words and no sentence punctuation. A phrasing like "get codex to take this refactor" still depends on the older cue or alias paths.
2. **The guard names two owners.** A third workflow-owning skill would need adding to `WORKFLOW_OWNER_SKILL_IDS`.
3. **Daemon and dist freshness.** `advisor_rebuild` refused while the status was live, and a stale shared daemon kept the old order until it restarted. Touching any runtime source, even to restore identical content, marks `dist/` stale and makes the CLI tests report `daemon launcher exited with code 1` until `npm run build` runs again.
4. **Moving the scoring date is manual.** The pinned date stays `2026-10-11` until someone exports `SPECKIT_EVAL_BASELINE_SCORING_DATE` for a capture; the baseline then measures the derived lane's age haircut at that date, and the prose in `references/scoring/validation-baselines.md` (dated 2026-07-30) is a separate snapshot this packet did not touch.
<!-- /ANCHOR:limitations -->

---


