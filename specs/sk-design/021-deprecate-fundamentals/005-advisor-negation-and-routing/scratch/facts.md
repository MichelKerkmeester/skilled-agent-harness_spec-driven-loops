# Phase 005 facts: advisor negation fix, borderline routing, release notes

Created 2026-11-05. Branch `worktrees/316-deprecate-design-fundamentals`. Level 2. Priority P1.
Operator decisions (2026-11-05): fix the scorer negation rather than record the regression, optimize the two
borderline routes with a fresh Opus agent at medium effort, update the v4.0.1.0 release notes and republish
its tag, commit and push.

## 1. Advisor negation fix (orchestrator)

Problem: labeled corpus case rr-iter3-146 "Review the routing taxonomy only; don’t write anything back yet."
(gold sk-code) lost to sk-doc (0.8445 vs 0.8377). The explicit lane in
`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` gave sk-doc a 0.7
`write-doc-surface` boost whenever a write verb and a doc word (here "taxonomy") co-occurred, even when the
verb was negated. The case used to win only through a duplicate sk-design to sk-code graph edge from the
retired mode.
Fix: a `NEGATED_WRITE` pattern (don't / don’t / do not / never / without, up to two words, then a write-verb
stem) and an `affirmedWriteText()` helper that blanks negated write phrases before the three write-surface
tests. No other lane changed.
Test: new `tests/scorer/negated-write-surface.vitest.ts`, 3 affirmed prompts anchor sk-doc and 4 negated
prompts do not (both apostrophe forms, "do not edit", "without changing").
Results after `npm run build` of the runtime:
- python-ts-parity: tsAlsoCorrect 103 -> 104, regression list no longer has rr-iter3-146 (accepted list and
  ledger entry removed, ledger 75 -> 74).
- scorer eval baseline recaptured: full corpus 155 -> 157 (0.8051), holdout 49 -> 50, ambiguity 19 -> 20.
- legacy advisor-corpus-parity 108 -> 109, the same as main (its pinned 110 is unreached on main too).
- full advisor suite: 1371 passed, 1 failed (the same legacy pin as main), 8 skipped.
- live advisor: rr-iter3-146 -> sk-code 0.8377 first.

## 2. Borderline routes (fresh Opus agent, medium effort)

- "Review this design document for clarity." was sk-code 0.9451 (and bundled sk-code-frontend). Now sk-doc
  0.949 first, hub route single sk-create-quality-control. Change: "document for clarity" added to sk-doc
  graph-metadata intent_signals and derived.trigger_phrases, the create-quality-control-aliases class in
  sk-doc hub-router.json, and the DOC_QUALITY intent in sk-doc ROUTER.md.
- "review the chart colour system" was sk-code 0.9159. Now sk-design 0.9268 first, hub route single
  sk-design-chart. Change: "chart color system" and "chart colour system" added to sk-design graph-metadata
  derived.trigger_phrases.
- Protected routes unchanged: design review findings, review this design, review this screen (surfaceBundle
  review + frontend), code review (single review), what padding should this have (single frontend).
- Gates: intent signals missing=0 orphans=0, compiled-route guard fresh, sync 55/55, vocabulary reach PASSED,
  parent-skill-check OK on sk-doc and sk-design, Hermes 65/65, advisor parity unchanged.
- Margins are thin (0.007 and 0.020). sk-doc's derived.trigger_phrases still list chart phrases (create a
  chart, chart catalog, heatmap and others); they predate this change and are left as is.

## 3. Release notes

v4.0.1.0 is tagged at 10474a9567 and published as a GitHub release (2026-11-05T05:39:47Z). Its Frontend
Surface section still says "Open Design Values Go to `sk-design-fundamentals`", which this branch retires.
The operator chose to update the entry and republish the tag.

## 4. Release republished

- main fast-forwarded 10474a9567 -> d1c57bb81d and pushed. The push bypassed the branch protection rules
  for a pull request and signed commits.
- The old release body was saved, and the same strip of the changelog's frontmatter and H1 reproduced it
  apart from edge blank lines.
- The release and the tag were deleted, then the annotated tag was recreated on d1c57bb81d and the release
  created from the stripped entry. `git ls-remote` prints `refs/tags/v4.0.1.0^{}` at d1c57bb81d, the
  release is Latest, not a draft, and its body carries the two new sections.
