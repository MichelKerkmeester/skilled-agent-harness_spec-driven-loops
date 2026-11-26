# Iteration 001 - Correctness

## Dispatcher

- Run: 1 of 5, generation 2, lineage `restart`, session `2026-11-23T05:51:03.170Z`.
- Dimension: correctness (D1).
- Iteration number derived from the state log: zero prior `type:"iteration"` records, so this is iteration 1, matching the dispatch.
- Operator focus: covered the third-round fixes (deep-loop offer gate in TS and Python, exclusion-file reload), pasted-reply stripping and route receipts, judged from code and tests rather than packet verdict tables. Crash fallback, the Ollama and embedding lane removal residue tool, the doctor cleanup and bridge env parity are left for later iterations (budget).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (ITERATIVE_ASK, MULTI_PASS, LOOP_COUNT, LOOP_REQUEST, asksForLoopRun, attachCommand, deferredLoopCommand; lines 277-520, 640-762)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (loop-ask regex mirror and `_apply_deep_loop_offer_gate`; lines 4470-4530, 4600-4630; strip mirror at 5029-5076)
- `.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts` (whole file)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py` (exclusion loading, lines 401-418)
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts` (pasted-reply strip, lines 243-274) and its callers in `skill-advisor-brief.ts:424,480`, `scorer/fusion.ts:1089`, `handlers/advisor-recommend.ts:529`, `hooks/lib/skill-advisor-cli-fallback.ts:233`, `hooks/claude/user-prompt-submit.ts:202,378`
- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts` (whole file)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` (receipt guard and receipt write, lines 339-436)
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:71-106` and `directive-lifecycle.ts:88,227` (clock semantics)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json` (25 cases)

Test runs (output and exit read): `npx vitest run` over deep-loop-offer-cases, route-exclusions, hooks/route-receipt, legacy/advisor-prompt-policy, subprocess-output-cap, hooks/skill-advisor-cli-fallback-no-match: 6 files, 127 tests passed. `python3 -m pytest runtime/tests/python/test_skill_advisor.py`: 18 passed.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

Severity doctrine was not needed for a call this iteration because no finding was raised; it loads before the first severity call in a later iteration.

## Traceability Checks

- `spec_code` (partial): the third-round claims checked against code. Exclusion reload is real: `getRouteExcludedSkillIds` re-stats the winning file and reloads on a changed stamp [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94-116]. The deep-loop offer gate exists in both runtimes and reads the same pattern set [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:464-479] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4504-4513]. Bridge env parity not yet checked, so the protocol stays partial.

## Integration Evidence

- Strip call sites named above all route through the one idempotent `stripLeadingPastedReply`, so the hook, the CLI fallback, the handler and the scorer see the same text for one prompt.
- Python one-shot CLI reads exclusions fresh per call [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:416-418], so only the TS daemon needed the reload.

## Edge Cases

- Ambiguity: the LOOP_WORDING list in TS is spliced from an array [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:277-281] while Python hardcodes `deep research|deep review|multi-pass` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4508]. They agree today; parity is held by the shared `deep-loop-offer-cases.json` fixture, not by a single source. Not a finding (no wrong output found), noted for maintainability.
- Known, documented limitation: the last task marker wins in the strip, so a user task that itself holds a later `Now:` line keeps only the tail. The fixture records it as `expected` beside an `ideal` (`two-markers-in-user-task`, `user-task-before-follow-up-marker`), so it is an accepted trade-off, not a new defect.
- The comment at `hooks/claude/user-prompt-submit.ts:419` says the clock is read "before this turn's directive delivery moves it". The clock fields only change on `advance-generation` / `advance-session` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:75-81], and the end-to-end receipt tests suppress across turns with real stores, so the receipt is not invalidated by delivery. Inference only on whether `evaluate` ever moves the clock; not raised.

## Confirmed-Clean Surfaces

- Route-exclusion reload: stamp covers which file wins plus size and mtime; a missing or malformed file resolves to an empty set; a local override fully replaces the committed list.
- Route-receipt guard: suppresses only a floored, work-intent, weak follow-up whose top skill differs from a current receipt; a shrunk transcript or a moved clock delivers; file store checks ownership, mode 0o077, symlinks, size cap, and writes via temp plus rename.
- Receipt write: floored or degraded routes only expire a differing held receipt, never write one [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:414-419].
- Deep-loop command attach: stuck-run complaints route to the doctor command; deferred routes offer a command only for exactly one mode cue; a typed other deep-loop command does not unlock this one.

## Ruled Out

- Strip non-idempotence between hook and scorer: ruled out, the function loops to a fixed point [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267-273].
- Receipt store permission failure on an existing base dir: the live `$TMPDIR/speckit-advisor` tree is 0700 and owned by the user, and `mkdirSync` creates it 0700.
- TS/Python offer-gate drift: 127 TS tests and 18 Python tests pass over the shared fixtures.

## Next Focus

- Dimension: D2 security.
- Focus area: `.skilled/bin/system-skill-advisor-launcher.cjs` bridge env forwarding (what env is passed to the child), `runtime/lib/subprocess.ts` output cap, `hooks/lib/skill-advisor-cli-fallback.ts` crash fallback, the Ollama/embedding residue tool, and receipt file trust boundary.
- Reason: correctness pass on the third-round logic came back clean; the remaining risk sits at process and filesystem boundaries.
- Rotation status: D1 done, D2 to D4 pending.
- Carry-forward: bridge env parity and crash fallback still unchecked for correctness too.
- Required evidence: file:line on each env key forwarded or dropped.

Review verdict: PASS
