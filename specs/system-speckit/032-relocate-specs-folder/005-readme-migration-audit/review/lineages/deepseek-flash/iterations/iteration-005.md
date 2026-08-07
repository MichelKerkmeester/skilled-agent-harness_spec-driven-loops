# Iteration 5: Symlink Correctness Verification (angle: correct-as-is cases)

## Focus

Broader angle after the 4 dimension passes: verify the remaining literal-hit READMEs (deep-alignment conformance-benchmark, sk-create-benchmark shared, styles/scripts, sk-doc durability-leak fixture) and establish the negative baseline — whether ANY live README correctly describes `.opencode/specs` as the compat symlink (correct-as-is case per spec.md risk table).

## Scorecard

- Dimensions covered: [correctness, security, traceability, maintainability]
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0 (no new P0/P1; one P2)

## Findings

### P2, Suggestion

- **F019**: No live (non-`specs/`, non-`z_archive`) README anywhere describes `.opencode/specs` as the compat symlink — the migration's "some may correctly describe it as the compat symlink" hypothesis has zero confirmations, repo-wide scan
  - Evidence: `rg -n 'symlink|compat|canonical' -g 'README.md' -g '!specs/**' .opencode` for lines mentioning specs returns only unrelated canonical-doc usages; the only `alias roots` mention is `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/006-sk-deep-research-review-folders/README.md:11,28` (historical). Every live literal-hit README either teaches `.opencode/specs` as the primary root (stale) or uses it as a working path without labeling it a legacy alias.
  - Recommendation: When fixing the stale READMEs, standardize on an explicit "`specs/` is canonical; `.opencode/specs` is a compat symlink" note so readers of any corrected README know the relationship.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | deep-alignment conformance-benchmark README:34,66; sk-create-benchmark shared README:23 | Pointer targets exist at canonical specs/; docs still use legacy alias without labeling it |
| checklist_evidence | notApplicable | hard | - | No checklist.md |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: [correctness, security, traceability, maintainability]
- Novelty justification: F019 is the negative baseline confirming the migration's "correct-as-is" hypothesis has no live confirmations; supports REQ-004 reporting.

## Ruled Out

- deep-alignment conformance-benchmark README:34 "Source specification: .opencode/specs/..." — pointer target EXISTS at canonical specs/system-deep-loop/035-command-surface-benchmark/ (verified). Stale alias usage, not a broken link — already covered by F011.
- sk-create-benchmark shared README:23 — same class, covered by F007.
- sk-doc durability-leak fixture README:7 — intentional negative-test fixture, ruled out in iteration 1.
- styles/scripts README:112 — pointer to spec packet, covered by F011.

## Dead Ends

- None.

## Recommended Next Focus

Historical specs/** README hits classification + prose-staleness deep scan beyond the literal string (REQ-004 hunt for diagram/directory-tree staleness).

## Claim Adjudication

(No new P0/P1 findings this iteration — no packet required.)

Review verdict: PASS
