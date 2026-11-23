# Iteration 001 - Correctness

## Dispatcher

- Iteration 1 of 5, generation 3, sessionId 2026-11-23T09:35:31.105Z, lineageMode restart (config). JSONL held zero iteration records, so the derived number is 1 and matches dispatch.
- Dimension: correctness. Operator focus addressed by starting at phase 028's fixes (stdin guard, curly-apostrophe fold, ITERATION_COUNT comment) and then the offer gate's question exception, the exclusion reload stamp, both runtimes' fixture parity.

## Dimension

D1 Correctness.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:211-317` (runSpawnAttempt, stdin guard)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:375-410, 455-508, 715-745` (stuck-run, past-run, asksForLoopRun, LOOP_QUESTION, ITERATION_COUNT, both offer paths)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4479-4625` (Python offer gate)
- `.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:82-126` (reload stamp)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`, `tests/deep-loop-offer-cases.vitest.ts`, `tests/legacy/advisor-subprocess.vitest.ts`, `tests/subprocess-output-cap.vitest.ts` (diff), `tests/python/test_skill_advisor.py:2854-2878`
- `028-second-epic-review-fixes/implementation-summary.md` (claims only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A negated loop question is read as a request for the loop in both offer gates** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:492 -- `LOOP_QUESTION` only accepts `(?:how|why|when|what) (?:does|do|is|are|did|makes)`, so a question opened by a negated auxiliary is not a loop question, and the stuck-run symptom `(?:doesn't|won't|...) (?:converg\w*|...)` needs the negation directly before the verb, so the inverted question order escapes it too. `LOOP_REQUEST` then matches the bare `deep review` wording and `asksForLoopRun` returns true, which lets `/deep:review` be offered on a diagnostic question. The Python copy has the same shape at .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4546 and agrees, so parity holds and the gap is shared. Probed: Python `asks_for_loop_run` returns True, `is_stuck_run_complaint` False for "why doesn’t the deep review converge", "why doesn't my deep review converge" and "why won't the deep review stop"; the built native gate (`dist/runtime/lib/command-attach.js`) returned the same. The same thought in declarative form, "the deep review isn’t converging", is correctly held back (stuck True, asks False).
   Finding class: recall gap in a shared heuristic (both runtimes)
   Scope proof: the deep-loop offer gate shipped in the epic's third-round fixes; the shared fixture `tests/fixtures/deep-loop-offer-cases.json` has no negated-question case, so neither suite catches it.
   Affected surface hints: `command-attach.ts` LOOP_QUESTION and LOOP_RUN_SYMPTOM, `skill_advisor.py` _LOOP_QUESTION_RE and _LOOP_RUN_SYMPTOM_RE, the shared fixture.
   Case: the prompt "why doesn't my deep review converge" gets a /deep:review run offer instead of being treated as a question about an existing run.

## Traceability Checks

- spec_code (partial, this iteration only the 028 claims): stdin guard present at subprocess.ts:249 and exercised by a real-process EPIPE test in subprocess-output-cap.vitest.ts; curly fold present in `asksForLoopRun` (command-attach.ts:478) and `_fold_quotes` (skill_advisor.py:4559) with fixture case `want-research-loop-curly-apostrophe`; ITERATION_COUNT comment (command-attach.ts:495-501) now matches behavior: probe gives false for "why does the deep review stop after ten iterations" and true for "why does it stop after ten iterations". Children 007-010 statuses, catalog sources and 027 AC-006 are left for the traceability pass.
- checklist_evidence: not run this iteration.

## Integration Evidence

- Tests run: `vitest run tests/deep-loop-offer-cases.vitest.ts tests/legacy/advisor-subprocess.vitest.ts tests/route-exclusions.vitest.ts tests/hooks/route-receipt.vitest.ts` -> 4 files, 93 tests passed, exit 0. Python fixture parity replayed directly: 0 mismatches across 30 cases.
- Note: the 028 fixes are uncommitted working-tree modifications (`git status` shows lib/command-attach.ts, lib/subprocess.ts, scripts/skill_advisor.py, the fixture and two tests modified). The `dist/` build used for the native probe may predate them; the negated-question result does not depend on the 028 changes (straight-apostrophe form gives the same result), and the Python probe ran on the working-tree source.

## Edge Cases

- Ambiguity: the native probe ran on a built `dist/` file because no TS runner (`tsx`) is installed; Python ran on source. Severity rests on the source regex read plus the Python run.
- Process note: while looking for a TS runner I created and immediately removed an empty directory `runtime/tests/__scratch_probe` inside the review target. Net change is none (git status confirms no new path), but it is recorded here as a deviation from the read-only rule.

## Confirmed-Clean Surfaces

- `runSpawnAttempt` stdin guard: listener attached before write; error is swallowed and the close handler reports the exit code (subprocess.ts:246-252, 296-316).
- Busy-marker scan across chunk boundaries with a 64-char carry (subprocess.ts:262-272).
- Route-exclusion reload: stamp is path+size+mtime of the winning file, falls through local override then committed file, and the cache reloads on any stamp change (route-exclusions.ts:94-115).
- Python gate `_apply_deep_loop_offer_gate` keeps a typed command even on a stuck complaint, matching the native `typesThisCommand` bypass (skill_advisor.py:4607-4625 vs command-attach.ts:721-724).

## Ruled Out

- R2-P2-001 (stdin write without error listener): fixed at HEAD working tree.
- R4-P2-001 (curly apostrophe defeats loop-run ask): fixed in both runtimes.
- R4-P2-002 (ITERATION_COUNT comment contradicts behavior): comment now matches probed behavior.
- Native/Python drift on the 30 shared offer cases: none.

## Next Focus

- Dimension: security
- Focus area: route-receipt.ts hook input handling, pasted-reply strip in prompt-policy.ts, launcher env passthrough (bridge env parity), residue tool and doctor cleanup file deletion paths.
- Reason: planned rotation; correctness pass left these unread.
- Rotation status: 1/4 dimensions covered.
- Carry-forward: offer-gate fixture probing was productive; keep probe-by-prompt for the Python side.
- Required evidence: file:line for any path or env handling.

Review verdict: PASS
