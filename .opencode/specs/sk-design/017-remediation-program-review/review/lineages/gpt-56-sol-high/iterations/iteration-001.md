# Deep Review Iteration 001

## Dispatcher

- Mode: review
- Target agent: deep-review (LEAF)
- Dimension: correctness
- Focus: inventory and behavioral invariants across the interface-command rewrite, styles-library restructure, and persistent-database activation
- Budget profile: scan
- Pinned target: `7b9d3b6b71` over `5772e0bfd3..7b9d3b6b71`

## Files Reviewed

- Interface-command rewrite: `.opencode/commands/interface/{audit,design-reference,design,foundations,motion}.md`, `.opencode/skills/sk-design/shared/creation-contract.md`, and `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`.
- Styles-library restructure: `.opencode/skills/sk-design/styles/lib/paths.mjs`, selected engine producers/consumers (`style-library.mjs`, `manifest.mjs`, `hydrate.mjs`), `check-stable.test.mjs`, and packet 005 specification/summary evidence.
- Persistent-database activation: `persistent-adapter.mjs`, `operator.mjs`, `retrieval.mjs`, `generation-manifest.mjs`, adapter/operator tests, and packet 006 specification evidence.
- Scope authority: `.opencode/specs/sk-design/017-remediation-program-review/goal-file-manifest.txt` (118 unique entries).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code`: **partial**. The sampled command, relocation, and database seams match their observable packet claims: wrappers carry one canonical shared include [SOURCE: `.opencode/commands/interface/design.md:21`]; the path authority centralizes bundle, manifest, and database roots [SOURCE: `.opencode/skills/sk-design/styles/lib/paths.mjs:13-32`]; the facade keeps legacy as the default while routing explicit persistent requests [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-110`, `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:184-204`]. Full requirement replay remains for a later traceability pass.
- `checklist_evidence`: deferred to the dedicated traceability dimension; no pass is inferred.
- Pinned range: `HEAD` resolved to `7b9d3b6b71`. `git diff --check` reported one blank-line-at-EOF warning in `styles/tests/engine/fixtures.mjs`; it is carried as an out-of-dimension maintainability follow-up rather than converted into a correctness finding.

## Integration Evidence

- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`: 12/12 passed, exercising the five `/interface:*` wrappers, their presentation/workflow consumers, and shared creation contract.
- `.opencode/skills/sk-design/styles/tests/engine/index.mjs`: 20/20 passed, including relocation-sensitive manifest, ranking, hydration, and containment behavior.
- `.opencode/skills/sk-design/styles/tests/database/index.mjs`: 69/69 passed, including adapter parity, publication, rollback, generation validation, retrieval, and operator behavior.
- Structural-impact analysis was unavailable by dispatch contract (Code Graph unavailable); direct reads, exact pinned-range checks, and executable suites were used instead.

## Edge Cases

- The database packet intentionally retains `legacy` as the default; deferred cutover was not treated as a defect [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:103-110`].
- Persistent hydration deliberately reads authoritative flat artifacts after validating the database generation and artifact digest [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:183-205`, `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:229-270`]. This producer/consumer seam is the highest-risk security follow-up.
- `git diff --check` is not fully clean because `.opencode/skills/sk-design/styles/tests/engine/fixtures.mjs:144` has a new blank line at EOF. This does not alter runtime behavior, but maintainability review must adjudicate it.
- Bundle contents and concurrent system-deep-loop work were not inspected, per scope.

## Confirmed-Clean Surfaces

- All five command bodies resolve one stable `workflowMode`, include the shared creation contract exactly once, and preserve typed statuses; executable contract passed.
- The sampled styles path consumers import centralized defaults rather than reconstructing the relocated production paths [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:14-29`].
- Persistent reads fail closed on invalid or missing generation state, and the full database suite passed [SOURCE: `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs:296-323`].

## Ruled Out

- **Nested command dispatch regression:** ruled out in the sampled wrappers and executable adversarial contract (`interface-command-contract.test.mjs` 12/12).
- **Lazy query-time database build:** ruled out in sampled facade/adapter paths; query dispatch opens or queries a published database and contains no build call [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:144-165`].
- **Relocation default drift:** ruled out for sampled engine consumers by the centralized exports in `lib/paths.mjs` and passing engine suite.
- **Bundle-byte review:** not attempted; mechanically moved bundle contents are explicitly out of scope.

## Next Focus

- Dimension: security
- Focus area: persistent publication pointers and flat-artifact hydration trust boundaries
- Reason: these seams cross mutable database state, filesystem containment, generation identity, and authoritative flat-file reads.
- Rotation status: correctness inventory completed; rotate to the first unchecked dimension.
- Blocked/productive carry-forward: Code Graph remains unavailable; direct producer/consumer reads plus adversarial tests were productive.
- Required evidence: pointer parsing/open behavior, symlink and path-containment checks, digest/generation binding, rollback/cutover inputs, and counterevidence tests.

Review verdict: PASS
