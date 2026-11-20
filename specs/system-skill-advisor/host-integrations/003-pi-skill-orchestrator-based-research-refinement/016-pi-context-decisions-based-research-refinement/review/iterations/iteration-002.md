# Iteration 002 - D2 Security

## Dispatcher

- Run: 2 of 5. Session `2026-11-19T04:18:26.591Z`, generation 1, lineageMode `new`.
- Dimension: security.
- Focus (from strategy Next Focus): the `route-receipt.ts` file store under a shared temp dir, the `skill-advisor-cli-fallback.ts` subprocess payload, the cost of the `PASTED_REPLY_CUE` and `TASK_MARKER` regexes on large input, and whether pasted text can be injected into routing.
- Iteration number: the state log holds 1 iteration record, so this is iteration 2. That matches the dispatch.
- Operator focus: the review covered all four shipped features from a security angle.
  - Strip: regex cost measured on the shipped `dist` build and on the real Python module, plus the injection direction.
  - Crash fallback: checked whether any error or stack text reaches the model.
  - Receipts: checked the store's ownership, symlink and permission handling.
  - Python parity: the Python strip carries the same regex cost and, unlike the TypeScript paths, has no input bound.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:245-271` (cue and marker regexes, the strip loop)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1009-1018, 4790-4833, 5347-5354` (Python strip, native bridge, stdin intake)
- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:1-331` (whole file)
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:225-300` (subprocess payload and spawn)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:182-215, 360-380, 620-660` (64 KiB cut, guard strip, crash fallback)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:465-500` (brief-builder strip)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:530-545` and `runtime/schemas/advisor-tool-schemas.ts:283,288` (MCP strip and its 10,000-char cap)
- `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` (range diff: clock rotation)
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts:225-252` (store hardening tests)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The task-marker regex backtracks quadratically on a long whitespace run that holds newlines, and the Python strip runs it on unbounded input** -- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:246 -- `TASK_MARKER = /(?:^|[.!?\n]\s*)(?:now|task)\s*:\s*/gi` is scanned with `matchAll` once `PASTED_REPLY_CUE` matches the start of the prompt. A newline both starts the `[.!?\n]` alternative and is consumed by the `\s*` that follows. At every newline in a whitespace run, the engine therefore scans `\s*` to the end of the run, fails `now|task`, and backtracks one character at a time. The cost is quadratic in the length of the run. Measured on the shipped build (`runtime/dist/runtime/lib/prompt-policy.js`, `stripLeadingPastedReply`), a prompt of `"You said:"` plus N newlines plus `"x"` takes 43 ms at 10,000 newlines and 1,767 ms at 65,526. A mixed `"\n \t"` run of 65K characters takes 590 ms. A run of `.` plus spaces, or of `. ` pairs, stays linear (0-1 ms at 64K), so only whitespace runs that contain newlines trigger it. The Python twin `_TASK_MARKER` (`runtime/scripts/skill_advisor.py:4807`), timed by importing the real module, takes 338 ms at 8K, 1,361 ms at 16K, 5,549 ms at 32K and 22,225 ms at 64K. That path has no bound: `recommend_with_native_advisor` strips before `_advisor_prompt_head` by design (`skill_advisor.py:1011-1016`), `analyze_request` strips the raw prompt (`:4845`), and single-prompt mode reads all of stdin (`:5350`). The bounds per path: the MCP handler is capped at 10,000 characters by the schema (`advisor-tool-schemas.ts:288`, about 43 ms, so not a concern there). The Claude hook cuts at 64 KiB (`user-prompt-submit.ts:183`) and then strips synchronously in the brief builder (`skill-advisor-brief.ts:478`), which a `setTimeout` budget cannot preempt. The Python batch modes split input on lines (`skill_advisor.py:5528`), so no single prompt in them carries a newline run. Impact is availability only: added latency, fail-open, no data exposure. The input is the user's own prompt, though that includes pasted third-party content.
   Finding class: regex_backtracking_cost
   Scope proof: the measured regexes are the ones this change shipped (`prompt-policy.ts:245-246`, `skill_advisor.py:4800-4807`). The timings come from the shipped dist function and the real Python module, not copies.
   Affected surface hints: `runtime/lib/prompt-policy.ts` TASK_MARKER (make it linear, for example by matching a marker only at a line or sentence start without a `\s*` that can consume newlines, or by collapsing whitespace runs before the scan); the twin `_TASK_MARKER` in `runtime/scripts/skill_advisor.py`, plus an input bound on the Python single-prompt path; a cost-regression test in `tests/legacy/advisor-prompt-policy.vitest.ts` and `tests/python/test_skill_advisor.py`. Ordering constraint: the regex must be made linear before R1-P2-001 is fixed. Stripping before the 64 KiB cut, as R1-P2-001 implies, removes the only bound on this scan in the TypeScript hook.
   Case: a prompt that begins "You said:" followed by about 64K consecutive newlines and then "x" spends about 1.8 s in the TypeScript strip and about 22 s in the Python strip.

   Escalation note (downgradeTrigger-style): raise to P1 if a named runtime pipes raw, unbounded prompts into single-prompt `skill_advisor.py`. This iteration names no such caller, so P2 stands under the review-core reach rule.

## Traceability Checks

- No traceability protocol was run this iteration. This was the security pass, and the phase `spec.md` files are still unread, so `spec_code` stays `partial` from iteration 1 and is not recorded here.

## Integration Evidence

- `skill-advisor-cli-fallback.ts:233,250-277`: the hook spawns `process.execPath` on the `advisor_recommend` CLI and sends the prompt as JSON on stdin, never in argv. stderr is ignored, and a timeout kills the whole process group.
- `hooks/dsh/prompt-advisor.mjs` (range diff): `rotateSessionClock` only logs a failure through `logFailure`, and `advanceBoundary` refuses an empty session id, so no shared-store generation bump happens.

## Edge Cases

- Inference, unverified: on a single Claude turn the strip can run up to three times. It runs in the brief builder (`skill-advisor-brief.ts:478`), in the receipt guard (`user-prompt-submit.ts:372`, only when a receipt exists and the top pick is floored), and in the CLI fallback (`skill-advisor-cli-fallback.ts:233`, fallback path only). That would multiply the worst case to about 5 s. Each call re-scans until nothing changes. A pathological prompt has no marker, so each call scans once. Not measured end to end.
- Cross-finding interaction: R1-P2-001's natural fix, stripping before the 64 KiB cut, would make R2-P2-001 unbounded in the TypeScript hook too. This is recorded as an ordering constraint, not a refinement.

## Confirmed-Clean Surfaces

- Receipt store `route-receipt.ts:283-292`: the base and the folder must both be non-symlink directories owned by the current uid with no group or other bits. Writes go through a `wx` temp file with mode 0600 and a rename (`:249-251`). Reads stop at 4,096 bytes and check `sessionId` on parse (`:117`). Tests `route-receipt.vitest.ts:230,242,251` cover a symlinked folder, a world-writable base and a 0755 folder.
- Crash fallback `user-prompt-submit.ts:624-657`: the diagnostic carries the fixed string `'Unhandled UserPromptSubmit hook exception'` and the model sees only the rendered timeout or fallback directive. No error message or stack reaches `additionalContext`.
- CLI fallback payload: the prompt goes on stdin, not argv (`skill-advisor-cli-fallback.ts:270-273`).

## Ruled Out

- Pasted-text routing injection: `PASTED_REPLY_CUE` is anchored at `^`, so a paste can only drop text that comes before its last marker in a prompt that starts with the cue. The user's own text above a paste is never dropped, and the brief carries skill names, not prompt text.
- Another local user pre-creating the shared temp base: `ownedFolder` rejects it, and the store then fails open to deliver, which is the pre-receipt behavior.
- Receipt file-name collisions: the name is 64 bits of sha256 and the `sessionId` is rechecked on parse.
- DSH clock rotation as an error or secret leak: it only logs.
- MCP handler regex cost: capped at 10,000 characters, about 43 ms.

## Next Focus

- Dimension: traceability.
- Focus area: read the phase `spec.md` files and check the strip, crash fallback, receipt and Python-parity behaviors against them. Confirm or rule out R1-P2-002 reach, that is, whether any UserPromptSubmit producer sets `lifecycle_event`.
- Reason: security is covered; the `spec_code` core protocol is still partial.
- Rotation status: correctness and security covered; traceability and maintainability remain.
- Blocked/productive carry-forward: timing the shipped dist function and the real Python module was productive; do not retry crash-path double dedup or receipt cross-session leak.
- Required evidence: file:line in the phase `spec.md` files and in the code for each traceability result.

Review verdict: PASS
