# Iteration 4 - maintainability

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: maintainability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: this pass runs the repo's hard comment-hygiene gate over every in-scope code file and checks that the packet's central safety net — the two-copy drift guard — covers the vocabulary it claims, which is the follow-on-change cost the traceability focus depends on.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:321` (durable-why comment above the loop rule)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:476` (comment on why `thorough` is not read)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098` (fold docstring)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` (`VOCABULARY_PAIRS`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (`PATTERNS_NOT_COMPARED`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (`$comment` header)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:217` (documented dialect tolerance)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` (`stripReviewVerdict` comment)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2400` (`replaceAnchorSection` docstring)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2370` (`MIN_BLOCKED_ATTEMPTS` comment)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:198` (twelfth-round rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:279` (`CHK-011`, the comment gate)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` — partial. This pass added the maintainability evidence for REQ-031 (the drift guard lists) and REQ-046/REQ-048 (reducer section writers). The REQ-001 to REQ-034 map from iteration 3 stands; REQ-035 to REQ-053 are still unmapped.
- `checklist_evidence` — partial. `CHK-011` (the comment gate) and `CHK-041` (durable why in comments) were read against the tree in this pass; the rest of the task checklist is scheduled next.

## Integration Evidence

- Repo rule surface: the comment-hygiene gate lives in the root `AGENTS.md` directive list, and `CHK-011` restates it for this packet at `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:279`. The scan below is the check that gate names, run over the in-scope files rather than the diff.
- Drift-guard surface: `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` is the one place a pattern that cannot be compared is listed with its reason, so a future Python-only pattern fails a test instead of drifting silently.

## Edge Cases

- A scan for ephemeral labels must distinguish a code comment from a test label string. The python suite prints assertion labels such as `T243-SA-LOAD`, which are runtime strings, not comments; filtering to lines whose first non-space characters open a comment (`//`, `#`, `*`, `/*`) leaves 0 hits, while an unfiltered scan reports 232 lines. The distinction is recorded here so a later pass does not read those labels as a violation.
- `SMALL_EDIT_WORDING` is exported beside the compared lists but has no Python twin, because the small-edit rule exists in one copy only. It is outside the drift guard by design, and `PATTERNS_NOT_COMPARED` and the requirement text say so, so its absence is not a coverage gap.
- The reducer reads two heading dialects and two legacy section names. Both fallbacks are documented at the function that owns them, so a new iteration template that omits one name degrades to the other rather than to silence.

## Confirmed-Clean Surfaces

- In-scope code comments carry no ephemeral artifact label. Over the 44 in-scope `.ts`, `.py`, `.cjs` and `.mjs` files, a filtered scan of comment lines found 0 occurrences of `ADR-###`, `REQ-###`, `AC-###`, `CHK-###`, a bare `T###`, or a `specs/system-skill-advisor` path; the durable-why comments at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:321` and `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:476` are the shape the rule asks for.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` — `PATTERNS_NOT_COMPARED` holds 38 two-field rows, every one a pattern name plus a reason, so REQ-051's "lists each pattern it cannot compare with its reason" holds.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` — `VOCABULARY_PAIRS` holds 24 rows, one per exported list, and the numeric pairs sit beside them, so a one-sided word edit fails the suite.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` — the `$comment` header names which layer each typed column pins, which is the fixture-header clause of REQ-034.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2400` — `replaceAnchorSection` carries a docstring for its numbered-heading behaviour and a comment for the heading-first dialect, so the next change to the writer has a stated contract.

## Ruled Out

- Comment-hygiene violation in the test files: ruled out for comments. The 232 pattern-bearing lines in the in-scope code are assertion labels and fixture strings, not comments; none of them is a comment line.
- Drift-guard coverage gap: ruled out for the lists the requirement names. Each exported list is either a `VOCABULARY_PAIRS` row, a pattern pair, or a listed non-compared pattern with a reason.
- Reducer readability as a follow-on-change hazard: not reported. The dialect fallbacks and the finding-id handling are documented where they are implemented, and a clearer shape would be a refactor outside this review's scope rather than a defect.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` — the ticked tasks and every `Met` acceptance row checked against evidence that exists in the tree, including the twelfth round (T112 to T114).
- Reason: two dimensions are covered; the operator focus makes checklist evidence the second core protocol, and the acceptance file's 61 rows are the largest unchecked evidence surface.
- Rotation status: correctness, security, traceability, maintainability all started; traceability protocols unfinished.
- Blocked/productive carry-forward: productive — the citation check used in iteration 1 can be extended to the task rows.
- Required evidence: one row-level verdict per acceptance status class, and the checklist counts the Verification Summary claims.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS
