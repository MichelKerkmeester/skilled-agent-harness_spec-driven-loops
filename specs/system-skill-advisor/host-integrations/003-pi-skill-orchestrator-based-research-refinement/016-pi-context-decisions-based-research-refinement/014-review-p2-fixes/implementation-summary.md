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
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran in worktree `475-advisor-review-p2-fixes`. GPT-6 Luna `xhigh` `fast` leaves made every edit from literal briefs. Six leaves wrote the tests first, and the conductor confirmed each new case red for its own reason before the matching fix brief went out. Eight fix leaves followed, with the four hook edits run one after another, then three comment leaves for the review findings. The conductor ran every check and made seven commits: `5f1bfa57c2d` parser flag, `520c67809f5` TypeScript marker, `cfad0401138` fire gate and cut, `1333eba31bd` Python marker, `71c920f7948` route receipts and lifecycle guard, `afd90f64e1e` crash arm, `a7964556816` guard comment and test title. One H4 dispatch stopped on a wrong acceptance check in its brief and was re-sent with the check fixed. No leaf fell back to Vibe.
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The route receipt waits only under the Claude CLI entry.** Only `main()` sets `deferDirectiveReceipt`. The DSH extension `hooks/dsh/prompt-advisor.mjs` calls the handler without it, so a DSH turn whose notice is never added, because `deliveredContext` returns nothing or `createNotice` throws, still writes a receipt, as it did before this phase. The fix is a follow-up outside this phase's file list: pass `deferDirectiveReceipt: true` there and commit the output's receipt after the notice is appended.
2. **The parser flag has no producer yet.** `parseRecommendations` now keeps `confidenceFloored`, but `_legacy_recommendations_from_native` in `skill_advisor.py` drops it, so the subprocess path never carries it today. The Claude hook's live path, the CLI fallback, already copies the flag, so no route is misread now. The first commit's message overstates the old effect on the hook. A follow-up can copy the flag in that Python function with one parity case.
3. **One brief ran long.** The route receipt brief was 124 lines against the strategy's 90, because the new functions had to be pasted whole. Luna applied it verbatim.
<!-- /ANCHOR:limitations -->

---
