# Iteration 2: Nested Lifecycle and Resume Safety

## Focus
Audit lifecycle metadata across `019 → 020 → 007 → 015`, including parent `children_ids`, `derived.last_active_child_id`, the duplicate `012-*` prefix, and the claimed 14-child `015` sub-parent. Historical/frozen research, benchmark, lineage, output, log, and run-record artifacts were excluded as defect candidates.

## Findings
1. **P1 · PRE-EXISTING — Automatic resume loses the active descendant at both `020` and `007`.** The root correctly points to `020`, but `020` has seven declared children and a null `last_active_child_id`; `007` has sixteen declared children and the same null pointer. The live classifier treats a blank pointer as absent, while phase-parent scaffold resolution rejects a phase parent without one, so a root resume can reach `020` but cannot deterministically descend to `007` or its active descendants. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:122-123] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:6-14] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:109-110] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:6-24] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:111-112] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:504-516] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:631-641]
2. **P2 · PRE-EXISTING — The duplicate `012-*` phase number is ambiguous for numeric/prefix-only selection, but canonical full-ID resume is not ambiguous.** `007` deliberately has both `012-cutover-hardening` and `012-default-on-decision`, and its phase map assigns both the number 12. The resolver first tests the complete normalized child ID under the spec root and parent, then falls back to the complete basename; it does not select by three-digit prefix. Therefore a stored canonical full ID resolves safely, while an operator or caller supplying only `012` has no unique documented target and cannot be made resume-safe by the current null parent pointer. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:44-50] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:19-20] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:519-535]
3. **P1 · PRE-EXISTING — The `015` “14 children” claim matches metadata count but its Phase Documentation Map exposes only 12 of them.** Metadata lists 14 children, including `013-compiled-coverage-buildout` and `016-review-remediation`, while the canonical phase map ends at `012-p3-canonical-minter-foundation`. The count is truthful, but the navigation surface is stale and hides the two later children, making map-driven selection incomplete. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:48-50] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6-20] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/spec.md:30-45]
4. **P1 · PRE-EXISTING — `015` resumes to stale child `011`, not its later `013`/`016` work.** Its pointer names `011-activation-cutover-p4` with `last_active_at` on July 21, but `013` was created July 21 and saved July 23, and `016` was created July 22 and saved July 23. Because the resolver honors the stored full ID before any freshness comparison, this valid pointer is deterministic but stale; it bypasses both later children. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:154-169] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/graph-metadata.json:208-233] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation/graph-metadata.json:196-217] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:519-535]

## Ruled Out
- A mismatch between the claimed and actual `015` child count: both metadata and the filesystem expose 14 children; the defect is the 12-row canonical map, not the count.
- Ambiguity when a complete canonical `last_active_child_id` is stored: exact full-path and basename resolution distinguish both `012-*` siblings.
- Classification as NEW from `140266be3e`: `git cat-file -e 140266be3e^:<path>` confirmed all three audited parent metadata files existed before that commit.
- Historical/frozen `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, and run-record artifacts were not considered defect candidates.

## Dead Ends
None. Broad recursive validation was not retried; narrow metadata, canonical phase maps, and resolver source gave direct evidence.

## Edge Cases
- Ambiguous input: numeric phase `012` has two reasonable targets; only canonical full IDs disambiguate it.
- Contradictory evidence: `015` says “14 children” and metadata confirms 14, but its canonical map contains only 12 rows; the count is resolved as correct and the map as stale.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:6-28,122-123`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:6-14,109-110`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:6-24,111-112`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:30-50`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6-20,154-169`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/spec.md:30-45`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/graph-metadata.json:208-233`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation/graph-metadata.json:196-217`
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:504-535`
- `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:631-641`

## Assessment
- New information ratio: 1.0
- Novelty justification: All four lifecycle/topology findings are new to this lineage, although every defect or risk predates commit `140266be3e`.
- Questions addressed: q5 lifecycle and nested topology truthfulness; q6 resume safety.
- Questions answered: q5 nested `019/020/007/015` scope; q6 basename/prefix and stale-pointer scope.

## Reflection
- What worked and why: Narrow reads of the four parent metadata files, canonical phase maps, and the live resolver established both stored topology and actual resolution behavior without frozen-artifact noise.
- What did not work and why: A broad grep under `015` returned frozen research matches, which were useful only as discovery context and were excluded from defect evidence per scope.
- What I would do differently: Query only canonical parent files and resolver functions from the outset; use child metadata timestamps solely to test pointer freshness.

## Recommended Next Focus
Audit parent routing references against the live compiled-routing runtime and all seven hub routing surfaces. Continue through iteration 10 regardless of convergence telemetry, per max-iterations policy.
