# Review Iteration 005

## Dimension

Correctness, broadened to the deferred transform edge cases, upgrade reversibility, the repo-era report and anchor integrity/nesting checks. The seven active findings from prior iterations were not repeated.

## Files Reviewed

- .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:344
- .skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts:381
- .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:53
- .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-repair-sample.vitest.ts:186
- .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:451
- .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:101
- .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:142
- .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts:63
- .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup-hardening.vitest.ts:49
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:810
- .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:911
- .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:343
- .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:100

The review read the transform functions and the focused test cases. The test suites were inspected but not executed.

## Findings by Severity

### P0

None.

### P1

#### R5-P1-001 [P1] Phrase cleanup can rewrite authored eight-token spec triggers

- File: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:300]
- Claim: The cleanup can alter a user-authored trigger phrase when it has eight normalized words and ends in a configured stop word.
- Evidence: descriptionStopWordEdits selects entries by word count and final stop word only at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:300] and [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:304]. It does not compare the entry with a current description or a known generated seed. planDocumentChange applies the trim to every spec list at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:374], including when the template cleanup path found no base change. runCleanup writes the result when --apply is set at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:456] and [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:507]. The transform can therefore remove a matching entry or rewrite it as lowercased, punctuation-stripped text.
- Finding class: class-of-bug.
- Scope proof: The predicate covers every spec trigger phrase with this shape, and the caller runs it across walked spec documents. It does not require provenance from the historical seeder.
- Affected surface hints: spec trigger_phrases; template-phrase-cleanup --apply.
- Counterevidence sought: The cleanup is opt-in, and its report previews the exact old and new blocks. The integration test covers reseeding after a restored template block at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts:63]. The inspected tests do not cover preserving an authored eight-word phrase ending in a stop word.
- Alternative explanation: The eight-word signature may intentionally approximate prior generated seed residue. That signature is not unique to generated content.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if the intended contract explicitly treats every matching phrase as generated residue and a documented safeguard prevents authored phrases from entering that class.
- Recommendation: Restrict the trim to phrases matched to a known prior generated seed, or require explicit per-file selection. Add a regression case that preserves an authored matching phrase.

### P2

None.

## Traceability Checks

- Core spec-to-code: deferred. This iteration focused on behavior inside transforms, not catalog/spec alignment.
- Core checklist evidence: deferred. Acceptance evidence and historical commands were not rerun.
- Overlay skill-agent parity: deferred.
- Overlay cross-runtime agent parity: deferred.
- Overlay feature-catalog alignment: deferred.
- Overlay playbook capability: deferred.

## Search Coverage

- Covered: trigger phrase data preservation. One P1 was confirmed.
- Ruled out: the inspected anchor-pairing and nesting branches, lane-mode ambiguity guards, upgrade manifest reversibility cases and repo-era report tallies.
- Deferred: runtime execution of the focused test suites. The tests were inspected, not run.
- Graph coverage mode: graphless fallback; no resource map was present.
- New findings ratio: 1.0. The new finding is distinct from the seven active findings carried from earlier iterations.
- Omitted from this slice: remaining CI/workflow and release-control files in the 229-file manifest.

## Verdict

CONDITIONAL. This iteration found one P1 correctness issue and no P0 issue. Prior findings remain cumulative and were not repeated.

## Next Dimension

All four dimensions are covered. Continue under the max-iterations policy with a correctness follow-up on phrase preservation and any remaining transform edge cases.

Review verdict: CONDITIONAL
