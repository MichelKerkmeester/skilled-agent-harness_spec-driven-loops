---
title: "Implementation Summary"
description: "Stored route receipts in the shared advisor hook: a weak floored follow-up that routes away from the session's last confident route now shows the skipped head. The bench measures H_after 0 of 5, the false-carry prompt keeps its route and the corpus is unchanged."
trigger_phrases:
  - "route receipts build implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/011-route-receipts-build"
    last_updated_at: "2026-11-18T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the route receipt guard"
    next_safe_action: "Commit the phase, then start phase 013"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "97f740db-2b93-4d81-90e7-2befc9f2e28c"
      parent_session_id: null
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
| **Spec Folder** | 011-route-receipts-build |
| **Completed** | 2026-11-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared advisor hook now remembers the skill it last delivered on its own evidence in a session. A later weak follow-up such as "fix that too", whose top route is floored at 0.82 and points at another skill, shows `Advisor: prompt skipped.` instead of steering the model away from the session's task. A prompt with no stored route renders exactly as before.

### Phase 11: route-receipts-build

The guard suppresses only when five things hold: a current receipt exists, the stripped prompt reads as work intent, its top route is floored, that route differs from the receipt, and the prompt is a weak follow-up (a back-reference word and at most 3 content words; additive words such as "also" do not count as back-references). A receipt expires when the lifecycle clock moves or the transcript shrinks. DSH now rotates that clock on its own session start and compaction, which it did not before.

### Files Changed

Paths are relative to `.skilled/skills/system-skill-advisor/`.

| File | Action | Purpose |
|------|--------|---------|
| `hooks/lib/route-receipt.ts` | Created | Receipt type, in-memory and file stores, `isWeakFollowUp`, `decideRouteReceiptGuard` |
| `runtime/lib/prompt-policy.ts` | Modified | Exports `promptPolicyTokens`, so the weak-follow-up count uses the policy's own word sets |
| `hooks/claude/user-prompt-submit.ts` | Modified | `routeReceiptStore` dependency, the guard after the result build and the receipt write after the render, each in its own try |
| `runtime/lib/skill-advisor-brief.ts` | Modified | Exports `skippedWeakFollowUpResult`, policy reason `weak_follow_up_receipt` |
| `runtime/schemas/advisor-tool-schemas.ts` | Modified | Optional `confidenceFloored: true` on the strict recommendation schema |
| `runtime/handlers/advisor-recommend.ts` | Modified | `publicRecommendation` copies the flag |
| `runtime/lib/subprocess.ts` | Modified | The flag on `AdvisorRecommendation` |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Modified | `recommendationFromCli` keeps the flag |
| `hooks/dsh/prompt-advisor.mjs` | Modified | `advanceBoundary`, called on `agent/created` and a clean `compaction/end`, a no-op without a session id |
| `hooks/tests/dsh-prompt-advisor.test.mjs` | Modified | Four boundary cases and one against the real file lifecycle store |
| `runtime/bench/scorer-calibration.bench.ts` | Modified | The `advisor-follow-up-receipts` line |
| `runtime/tests/hooks/route-receipt.vitest.ts` | Created | 40 unit cases: separator, predicates, expiry, file store, folder owner and mode, writers overlapping in separate processes |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | Eleven hook-replay cases, three of them on unconfirmed or ambiguous session identities |
| `runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modified | The CLI row keeps the flag |
| `runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modified | Route, guard, guard, route |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

T001 applied phase 010's design with six corrections, listed in `spec.md` under Design Corrections. The largest: research section 8's DSH call passed an object where the boundary function takes a session id string, which would have reset every session. A conductor probe from `dist/` fixed the weak-follow-up word rule before any test was written.

Twenty Luna `xhigh` `fast` leaves through cli-codex built the code in four waves, each applying conductor-prepared text, which the conductor checked with `cmp` or a block diff. Every failing test landed and ran red for its stated reason before its fix: the receipt tests on the missing module, the envelope case on the dropped flag, the three hook-replay suppress cases and the three DSH boundary cases on the missing wiring. One extra leaf tightened the two-writer test after T005's handback noted it never counted receipt files.

T026's read-only Luna pass returned five findings, and the conductor checked each against the code before acting. Three were fixed through six more leaves applying prepared text, tests first: the three test files ran red on exactly the eight new behaviour cases, then the module and hook changes turned them green. The overlapping-writer test runs its writers as child processes, which load the built module, so the suite needs a build first, as `DSH` already does. The conductor ran every typecheck, build, test, bench and probe, and restarted only this worktree's daemon after the build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Suppress, never reuse the earlier route | A false carry under suppress withholds a route the earlier brief already gave; under reuse it pushes the wrong one (research section 3) |
| Clock-bound expiry with no age limit | The clock spawn measured p95 48.8 ms over 20 calls (p50 33.6, max 82.4), under the 150 ms bound T004 set before measuring |
| Export a token helper from the prompt policy | The stop-word and work-verb sets can be overridden through `SPECKIT_ADVISOR_PROMPT_POLICY_PATH`, so a copy in the receipt module would drift from the reason the guard reads |
| One decision function with the clock as a callback | The bench calls the shipped guard with a fixed clock, and a hook turn that is not a weak follow-up pays no clock spawn |
| Pi and OpenCode out | Pi passes no session id and no boundary reaches the file-store clock; OpenCode never runs the shared handler (research section 6) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All runs from `.skilled/skills/system-skill-advisor/runtime` at the final state unless named otherwise. Baselines were taken at `e02523f92b1` before any edit.

| Check | Result |
|-------|--------|
| Typecheck and build | Both exit 0 |
| Bench receipt line, precondition first | `receiptWritten` true for pairs 1, 3, 5, 6 and 9. `"N":9,"H":5,"H_after":0`. Pairs 1, 3, 5, 6 and 9 `suppress`; pairs 7 and 8 and controls 2 and 4 `deliver`; false carry `sk-doc` receipt, `sk-code` follow-up, `deliver` |
| `npx vitest run tests/hooks tests/schemas tests/handlers` | Exit 0, 27 files, 369 passed, 1 skipped. Baseline 26 files, 316 passed, 1 skipped; the 53 added are exactly the new cases, 9 of them from T026 |
| `npx vitest run tests/hooks tests/parity tests/handlers` (parent criterion 2) | Exit 0, 34 files, 413 passed, 1 skipped. Baseline 360 passed, 1 skipped |
| Corpus gates | Exit 0, 11 files, 67 passed, same as baseline. Bench `collateral` 19, as at baseline. `git diff --stat` on the corpus folder and the calibration baseline prints nothing |
| DSH, `node --test hooks/tests/dsh-prompt-advisor.test.mjs` from the skill root after the build | Exit 0, 13 of 13 |
| Scorer isolation, `rg -n 'route-receipt|routeReceipt|weak_follow_up' runtime/lib/scorer/` | Prints nothing |
| Live flag | Worktree daemon 95088, started 21:21:58 after the 21:21 build. `advisor_recommend --prompt 'fix that too'` shows `sk-code`, `sk-doc` and `mcp-tooling` at 0.82, each `"confidenceFloored": true` |
| Local-scorer path | `source: local-scorer`, `degraded: true`: one `sk-code` row at 0.95 with no flag. The Python scorer has no floor; see Known Limitations |
| Diff scope and comment hygiene | `git status` lists exactly the 15 files of the Files to Change table. The hygiene `rg` prints nothing |
| False-carry negative control (T021) | Run on the final module. With predicate (e) removed, `route-receipt.vitest.ts` exits 1: "delivers a floored topic change that names its own work" and "reads the clock only after every cheaper check holds" fail, 38 pass. Restored from the prepared file, `cmp` exits 0 and all 40 pass |
| Read-only Luna refutation pass (T026) | Five findings, each checked against the code. (a) Fixed: a probe from `dist/` read "Also, create a birthday party plan", "Create a birthday party plan too" and "Write a deploy script as well" as weak; `also`, `too` and `well` left the back-reference list. (b) Fixed: an unconfirmed or ambiguous session id wrote and read receipts; receipts now follow the lifecycle's confirmed-identity rule. (c) Accepted, Known Limitation 5. (d) Fixed differently from the proposal: rejecting every symlinked parent would disable the default macOS path under `/var`, so the store now refuses a base or receipt folder another user owns or can open, as the lifecycle store does. (e) Fixed: a reader and three writers overlap as separate processes, and DSH runs `advanceBoundary` on a real file store. The eight new behaviour cases ran red before the fix. After it the bench is unchanged (`H_after` 0, the same receipts, the false carry delivers), `GATES` 67 of 67 and `collateral` 19 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The local-scorer fallback never guards.** When the daemon is unreachable the CLI uses the Python scorer, which has no confidence floor, so it sets no flag and every turn delivers as it did before this phase. REQ-011 was amended to say so.
2. **Pi and OpenCode are not covered.** Pi would need three changes: pass `sessionIdFromContext(ctx)` and add a boundary call in both reset handlers. OpenCode runs its own plugin and never reaches the shared handler.
3. **Injected test doubles are not guarded.** The T017 and T018 handbacks noted that a custom `directiveLifecycleStore` with a side-effecting `clock`, or a custom `core.advanceBoundary` with no id check, could misbehave. Both are test-only seams. The shipped defaults read the clock without side effects and refuse an empty id.
4. **The write path adds one clock spawn per delivered, unfloored turn.** Measured p95 48.8 ms against a 2500 ms hook budget.
5. **A receipt is written before the host acknowledges delivery.** The directive receipt defers its commit to the stdout callback; the route receipt does not, because that deferral exists only when the lifecycle defers. If the hook process dies between the write and the output, the next weak follow-up that floors to another skill shows `Advisor: prompt skipped.` against a brief the model never saw. The cost is one low-confidence route withheld, and only after a hook crash or timeout.
6. **The owner check needs `process.getuid`.** On a runtime without it, only the mode bits are checked. The lifecycle store's helper calls `os.getuid` unconditionally, so it does not run there at all.
7. **A real back-reference with few words still reads as weak, and so do some short work prompts.** "do the same for the tests" is weak by design. The phase 012 review probe on the built module also read `Check that the build passes` and `Fix this: the export button is broken` as weak (`isWeakFollowUp` returned `true` for both), though each names new work. The guard still needs a floored top route that differs from a current receipt before it suppresses, and since phase 012 a floored route the model was shown clears a receipt for a different skill.
8. **A receipt written before the directive-lifecycle switch was turned off can apply again after it is turned back on.** Since phase 012 no receipt is read or written while the switch is off, because the lifecycle clock does not move then. A receipt from before keeps the clock it was stamped with, so it matches again once the switch is back on. The transcript-shrink check still expires it after a compaction.
<!-- /ANCHOR:limitations -->

---
