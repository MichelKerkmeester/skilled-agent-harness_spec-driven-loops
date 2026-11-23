# Iteration 5 - Stabilization Pass (traceability)

## Dispatcher

- Iteration 5 of 5, the last under the cap. Native `@deep-review` leaf at HEAD `ea73ab54056`.
- Dimension: traceability, run as a cross-dimension stabilization pass, because all four dimensions were covered in iterations 1 to 4.
- Jobs: finish the core protocol `checklist_evidence`, recheck the six open P2 findings at HEAD, then run an off-fixture differential of the pasted-reply strip (`prompt-policy.ts` against `skill_advisor.py`).
- Operator focus: the operator asked for the epic to be judged from code and tests. This pass reran each carried finding's evidence at HEAD (greps, reads and live probes of both runtimes) instead of trusting the earlier narratives. It also fuzzed the pasted-reply strip directly, which is the one shipped surface earlier passes left unprobed.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:225-250`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:276-279`
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:14-41`
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:33`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:438-500`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4545-4600, 5020-5063`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:243-274`
- Child `spec.md` and `graph-metadata.json` for 007, 008, 009 and 010
- All seven child `acceptance-criteria.md` files, all child `tasks.md` files, and `003-follow-up-routing-benchmark/implementation-summary.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The six carried P2s were all rechecked, and all six are confirmed at HEAD (see the recheck below).

## Prior Finding Recheck (HEAD ea73ab54056)

| ID | Outcome | Evidence at HEAD |
|----|---------|------------------|
| R2-P2-001 | Confirmed | `child.stdin?.write(args.prompt)` still has no stdin `error` listener [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:248], while the sibling spawn guards it [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:278]. Severity unchanged: the trigger stays narrow and is inferred, not reproduced. |
| R3-P2-001 | Confirmed | Status is still `Planned` in the spec.md of 007, 008, 009 and 010 (lines 25, 25, 26 and 25) [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/spec.md:25]. Their `graph-metadata.json` still reads `"status": "planned"` (lines 38, 38, 39 and 39). |
| R3-P2-002 | Confirmed, slightly wider | The overview still says "The Claude hook holds back" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:16], and the Source Files tables still list no DSH file [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:34-41]. The Vibe adapter loads the compiled Claude handler [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:33], so Vibe also reaches the guard without being named. Codex reach is unverified, because `hooks/` has no codex directory. This is recorded as a recheck note, not a new finding. |
| R3-P2-003 | Confirmed | `git grep -n score-outcome-rerank -- ':!specs'` exits 0 and prints `.skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md:32`. The AC row still records "The grep exited 1" [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59]. |
| R4-P2-001 | Confirmed | `asksForLoopRun` still only lowercases [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:476], and so does `asks_for_loop_run` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4597]. Live probe in both copies: the straight-quote form returns true and the curly `I’d like a research loop on cache eviction` returns false. |
| R4-P2-002 | Confirmed | The comment still says the spelled-count question "stays the question it was" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494]. Live probe: `why does it stop after ten iterations` returns true in TS and Python. The control `how many passes does it run` returns false in both. |

None was downgraded and none was a false positive.

## Traceability Checks

- `checklist_evidence` (core, final): **partial**.
  - All 117 AC data rows across the seven AC files read Met. The non-Met rows a grep counted are the header rows (line 52 or 54 of each file).
  - The six unchecked rows in 003 (T009 to T014, `003-follow-up-routing-benchmark/tasks.md:70-80`) are all marked "Only on ship". The phase closed with a no-ship decision [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/implementation-summary.md:78], so leaving them unchecked is correct.
  - No child carries a `checklist.md`.
  - One residual keeps this at partial: AC-006's evidence cell cannot be reproduced by its own command (R3-P2-003, `027-epic-review-fixes/acceptance-criteria.md:59`). Partial is the honest final status for this protocol in this run.

## Integration Evidence

- Vibe adapter to the shared Claude handler: `hooks/vibe/prompt-advisor.mjs:33` imports `runtime/dist/hooks/claude/user-prompt-submit.js`.
- Route-receipt users at HEAD: `hooks/claude/user-prompt-submit.ts`, `hooks/dsh/prompt-advisor.mjs` and `hooks/lib/route-receipt.ts` (exact grep over `hooks/` and `runtime/`).

## Edge Cases

- Module load limit: `prompt-policy.ts` cannot be imported under Node type stripping, because `./shared/unicode-normalization.js` does not resolve without a build and `runtime/dist/lib/prompt-policy.js` is absent. The differential therefore ran a verbatim slice of `prompt-policy.ts:243-274`. That slice is self-contained, since it uses only its two regexes. This proves the two strip functions agree. It does not prove both call sites pass the same text. The call-site check (the fusion.ts strip site against `skill_advisor.py:1050-1052`) was not run in this pass.
- Iteration number: 4 iteration records were in the state log, so this is 5, which matches the dispatch.

## Confirmed-Clean Surfaces

- Pasted-reply strip mirror: 14,013 probes produced 0 TS/Python diffs, 1,223 of which changed the text. The probes were 6,013 random token mixes plus 8,000 cue-anchored mixes. They covered NBSP, U+2028/2029, U+0085, U+FEFF, U+200B, U+180E, U+3000, `ſ`, the Kelvin sign, astral characters, CRLF, repeated `Task:` markers and nested cues [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:243-273] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5029-5063].

## Ruled Out

- TS/Python pasted-reply strip drift on off-fixture input: 0 diffs over 14,013 probes.
- Unchecked 003 tasks hiding missing evidence: they are conditional on a ship decision that was not taken.

## Next Focus

- Dimension: none, the rotation is complete (5 of 5 iterations).
- Focus area: synthesis. Six P2s are active and no P0 or P1.
- Reason: the iteration cap has been reached, and every carried finding was confirmed at HEAD.
- Carry-forward: `checklist_evidence` final partial (AC-006); `feature_catalog_code` partial (R3-P2-002); the strip call-site parity check was not run.
- Required evidence: none further for this run.

Review verdict: PASS
