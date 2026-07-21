# Deep Review Iteration 007 — Traceability Evidence Quality

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `verify`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct manifest-scoped reads, exact assertion searches, and focused executable tests were used.

## Files Reviewed

- `.opencode/skills/sk-design/styles/lib/database/schema.mjs`
- `.opencode/skills/sk-design/styles/tests/database/manifest.test.mjs`
- `.opencode/skills/sk-design/styles/tests/database/schema.test.mjs`
- `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md`
- `.opencode/skills/sk-design/styles/lib/database/README.md`
- `.opencode/specs/sk-design/015-styles-database-evolution/spec.md`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json`
- `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json`
- `.opencode/specs/sk-design/015-styles-database-evolution/004-growth/graph-metadata.json`
- The four manifest-listed corpus consumers and their four test files.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **P1-006 — Refinement: green concurrency tests preserve no-fit instead of requiring requery** -- `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503` -- The current production branch still passes `no-fit` after detecting a post-query generation mismatch, although its proof builder maps `generation-mismatch` to `requery-required`. Exact search found the same mismatch warning in all four corpus consumers. The concurrent-change tests pass but either explicitly expect `no-fit` or validate only the warning/result shape, so 60 green corpus tests stabilize the defect rather than prove stale-generation recovery [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-410`] [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503-508`] [SOURCE: `.opencode/skills/sk-design/design-foundations/corpus/__tests__/relationship-blueprint.test.mjs:183-201`] [SOURCE: `.opencode/skills/sk-design/design-interface/corpus/__tests__/relational-exemplar.test.mjs:253-267`] [SOURCE: `.opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:223-238`].
   - Finding class: cross-consumer
   - Scope proof: A manifest-restricted search of 21 test files found generation-mismatch coverage but no `requery-required` assertion; the four concurrent-change cases passed in the 75-test focused run, while exact production search found the mismatch warning at all four manifest-listed consumers.
   - Affected surface hints: audit comparison fallback; foundations relationship fallback; interface exemplar fallback; motion evidence fallback; stale-generation requery assertions
   - Content hash: `sha256:54c9b28c7c7df7e2a62a55b1b90ec639a833e2b1a651a9419dae19ce12bfccf4`
   - Recommendation: Change all four post-query mismatch branches to emit `generation-mismatch` and add direct `requery-required` proof assertions while retaining no-source-influence containment.

```json
{"findingId":"P1-006","type":"trust-boundary-classification","claim":"All four corpus consumers suppress their modeled requery-required state by classifying post-query generation drift as no-fit, and the green concurrent-change tests do not assert the required recovery contract.","evidenceRefs":[".opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-410",".opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503-508",".opencode/skills/sk-design/design-audit/corpus/__tests__/comparison-lane.test.mjs:248-262",".opencode/skills/sk-design/design-foundations/corpus/__tests__/relationship-blueprint.test.mjs:183-201",".opencode/skills/sk-design/design-interface/corpus/__tests__/relational-exemplar.test.mjs:253-267",".opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:223-238"],"counterevidenceSought":"Re-read the primary production mismatch branch, searched all 21 manifest-listed tests for generation-mismatch/requery-required/corpus-changing assertions, and reran the four corpus suites. Existing mismatch-plan tests prove no stale hydration, but concurrent-change tests do not require requery-required.","alternativeExplanation":"No-fit could be an intentional safe continuation because the code blocks stale source influence and retains a mismatch warning.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade only if a governing contract explicitly defines post-query drift as no-fit and executable caller tests prove that no recovery path depends on requery-required."}
```

### P2 Findings

None.

## Traceability Checks

| Finding | Executable assertion closure | Status |
|---|---|---|
| `P1-001` | Manifest tests prove optional digest verification and reject tampering, but production open tests assert only generation-pointer identity; `openPublishedStyleDatabase` does not invoke digest verification [SOURCE: `.opencode/skills/sk-design/styles/tests/database/manifest.test.mjs:97-118`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/schema.test.mjs:126-138`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356`]. | Missing production assertion |
| `P1-002` | Exact search across 21 manifest-listed tests found no playbook/path assertion; the mandatory scenarios still point at removed `_db`/`_engine` trees [SOURCE: `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-29`]. | Missing coverage |
| `P1-003` | No manifest-listed test checks the parent phase map against child lifecycle state; the parent still reports 001, 005, and 006 as Planned [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:54-74`]. | Missing coverage |
| `P1-004` | No manifest-listed test executes or validates database README commands; all five examples still target `_db/operator.mjs` [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:69-87`]. | Missing coverage |
| `P1-005` | No manifest-listed test checks graph metadata freshness. The stale status/path evidence remains, while the named `generate-context.js` regeneration owner is outside the frozen manifest [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:41-57`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json:41-64`]. | Blocked by scope plus missing coverage |
| `P1-006` | Four concurrent-change tests pass, but two explicitly expect `no-fit` and the other two validate only result/warning shape; none asserts `requery-required`. | Covered current defect; required assertion missing |

- `spec_code`: **fail** — green tests do not close production digest binding or stale-generation requery semantics.
- `checklist_evidence`: **partial** — this pass mapped active claims to test evidence but did not retry the exhausted out-of-manifest 001 checklist.
- `playbook_capability`: **fail** — no executable test protects the operational paths.
- `feature_catalog_code`: **notApplicable** — unchanged; no feature catalog is in the manifest.

## Integration Evidence

- Pinned Git evidence: `HEAD` resolved to `7b9d3b6b71`.
- Executable evidence: manifest/schema plus four corpus suites passed 75/75.
- Assertion inventory: 21 manifest-listed test files searched; production-digest helper had five hits, stale-generation had 19 hits, and operational docs, parent status, and generated metadata had zero hits.
- Blocked execution: `.opencode/skills/sk-design/design-md-generator/backend/node_modules/.bin/vitest` does not exist, so the md-generator TypeScript suite remains blocked by absent dependencies rather than counted as missing assertions.

## Edge Cases

- Green counts are behavior evidence, not claim closure: the corpus suites intentionally accept the current post-query `no-fit` behavior.
- Generated-metadata remediation ownership cannot be inspected without leaving the frozen manifest; this is a scope blocker, not a pass.
- One exact grep was accidentally rooted at the wider `sk-design` tree. All four returned hits were checked against the manifest, no out-of-manifest evidence was consumed, and subsequent assertion inventory was manifest-restricted.
- The first manifest-restricted search script had a regex syntax error; it produced no evidence and was corrected and rerun successfully.
- Code Graph remained unavailable; structural-impact analysis is unavailable.

## Confirmed-Clean Surfaces

- The optional manifest digest verifier is executable and rejects tampered artifacts [SOURCE: `.opencode/skills/sk-design/styles/tests/database/manifest.test.mjs:102-118`].
- Published-open tests enforce pointer/database generation identity [SOURCE: `.opencode/skills/sk-design/styles/tests/database/schema.test.mjs:126-138`].
- Mismatch-plan tests prevent hydration of the observed stale generation across the corpus consumers; this is containment evidence, not requery-contract evidence.

## Ruled Out

- Treating 75/75 focused green tests as proof that all six active P1 claims are covered.
- Creating a new finding for missing tests: the coverage gaps refine remediation completeness for the existing stable findings.
- Escalating P1-006 to P0: tests and direct reads still prove no stale source influence.
- Treating absent md-generator dependencies as a failed product test.

## Next Focus

- Dimension: maintainability (second-pass parity)
- Focus area: operator/API contract parity across implementation options, emitted JSON fields, and current documentation semantics
- Reason: iteration 007 closed the test-to-claim map; a distinct parity pass can detect semantic drift beyond already-exhausted stale-path checks
- Rotation status: traceability second-pass complete; rotate to maintainability without repeating path-existence or generated-state discovery
- Blocked/productive carry-forward: Code Graph and md-generator Vitest remain unavailable; direct operator parsing, output-schema reads, and manifest-listed documentation are productive
- Required evidence: compare supported operator flags, defaults, error exits, and output fields against README/playbook claims; record unchanged stale paths only as carried findings

Review verdict: CONDITIONAL
