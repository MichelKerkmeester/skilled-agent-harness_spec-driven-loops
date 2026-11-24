# Iteration 003 — Traceability

## Dispatcher
- Executor: cli-claude-code (claude-opus-5-5, medium), inline lineage opus-medium-1
- Sources read: steer.md (absent), strategy, registry, iterations 001-002

## Dimension
traceability, checking spec REQs and acceptance-criteria rows against the shipped gate and its evidence. Focus: the REQ-020 typed-command parity between `command-attach.ts` and `skill_advisor.py`, and packet 013's typed head.

## Files Reviewed
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (AC-001..AC-029)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:216-219, 249`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:205-240`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:20-32` (context evidence)
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md:94-104`
- `.skilled/hooks/injection-contract.md:56`
- `.skilled/changelog/skilled/v4.2.0.0.md:212-214`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (typed cases)

## How this iteration addressed the review focus
I traced REQ-020 (Python typed check agrees with TS) and SC-005 (every REQ-015..020 prompt gives its stated result through the prompt hook) to the packet's own hook capture. I also checked that packet 013's typed head matches the injection contract and the changelog.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None. R1-P1-001 is refined down to P2 below.

### P2 Findings
1. **The typed-on-stuck exception is accepted in prose, but REQ-020, SC-005 and AC-027 still state parity, and the hook output contradicts them** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1` -- `implementation-summary.md:228` records that the operator confirmed on 2026-11-23 that a typed command outranks the stuck diagnosis. That rules out the "wrong offer" reading in R1-P1-001, so this refinement drops it to P2. What remains is a contract gap. REQ-020 (`spec.md:218`) lists "my deep review run is stuck, /deep:review again" among the prompts whose Python result must equal `attachCommand`. SC-005 (`spec.md:249`) says each such prompt gives its stated result through the prompt hook. The packet's own hook capture prints `system-deep-loop → /deep:review (ask)` for that prompt (`scratch/probes/fresh-review-hook.txt:28`), while the Python gate gives no run row. AC-027 is marked Met on the `attachCommand` layer only, and the fixture's `typedReviewKept: false` describes a layer the brief never shows. The native hook and the Python fallback therefore still disagree on this prompt, and no requirement names the exception.
   Finding class: spec/evidence drift on an accepted exception
   Scope proof: implementation-summary.md:228 (accepted), fresh-review-hook.txt:28 (`/deep:review (ask)`), spec.md:218-219 and 249 (parity stated), deep-loop-offer-cases.vitest.ts:65-67 (attachCommand-only assertion)
   Affected surface hints: spec.md REQ-020/SC-005; acceptance-criteria.md AC-027/AC-028; deep-loop-offer-cases.json typed-stuck; skill_advisor.py _apply_deep_loop_offer_gate
   Case: "my deep review run is stuck, /deep:review again" through the native hook gives `/deep:review (ask)`, and through the Python fallback it gives no run row, although REQ-020 and SC-005 say the two agree.

## Traceability Checks
- spec_code (partial): REQ-001..REQ-007 map to the gate (`command-attach.ts:572-640`, `:886-889`) and the presentation-file section. REQ-020 holds at the `attachCommand` layer but not at the hook layer.
- checklist_evidence (partial): AC rows cite observed evidence; AC-027 cites a layer narrower than SC-005 asks for.
- playbook_capability (notApplicable): no manual testing playbook is in scope.
- feature_catalog_code (notApplicable): no feature catalog entry is in scope.

## Integration Evidence
- The packet 013 typed head is consistent across `render.ts:248-252`, `injection-contract.md:56`, `v4.2.0.0.md:212-213` and 013 REQ-006 (`013 spec.md:104`).
- The Python fallback (`analyze_request`) emits rows with no `command` or `typed` field (probe `probes/py-typed.py`), so the hook head in fallback mode depends on `commandRowFor` alone.

## Edge Cases
- The Python probe printed "SQLite unavailable; JSON export ignored", so the fallback ranked legacy ids (`deep-review`, `deep-research`). It never ranked the `command-spec-kit-deep-*` run rows, which means the typed-stuck drop was not exercised live here.

## Confirmed-Clean Surfaces
- 013 spec, injection contract and changelog agree on the `(Recommended)` marker and on the plain typed `(ask)`.
- The AC-008 waiver is recorded with ADR-003, as AC-029 requires.

## Ruled Out
- Typed head showing options in Python-fallback mode: the fallback carries no deep command row on these prompts, so no options render.

## Next Focus
- Dimension: maintainability
- Focus area: duplication between the TS gate and the Python copy (hand-mirrored regexes), how the drift guards work, and how readable the regex vocabulary is
- Reason: rotation (3/4 done)
- Required evidence: concrete divergence between the two copies, or a test that cannot catch one

Review verdict: PASS
