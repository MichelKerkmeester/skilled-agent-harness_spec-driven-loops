# Deep Review Iteration 010

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Focus: correctness — final adversarial stabilization/replay
- Budget profile: `verify`
- Stop reason after this pass: `maxIterationsReached`

## Files Reviewed

- Publication integrity: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356`, `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:204-234`
- Operational paths and phase state: `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-29`, `.opencode/skills/sk-design/styles/lib/database/README.md:69-87`, `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:51-74`
- Generated metadata: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:41-57`, `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json:41-64`, `.opencode/specs/sk-design/015-styles-database-evolution/004-growth/graph-metadata.json:35-55`
- Runtime boundaries: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-409,488-509`, `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49-62,81-98,213-252`, `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:103-141`
- Evidence claims: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:61-67`, `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:81-100`, `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:31-39,42-61,107-131`
- Counterevidence authorities: the 012/008, 015/001, 015/005, and 015/006 implementation summaries at their metadata/status anchors.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **P1-011 — Operator options with missing values silently target defaults** -- `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49` -- `optionValue` returns `null` for a present option with no value, and the dispatcher replaces a missing `--database` value with the default path. A read-only probe of `status --database` returned `ok:true` against the default database instead of rejecting malformed input. This supersedes `P1-007` solely to repair reducer identity; the defect is not fixed. [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:213-217`]
   - Finding class: class-of-bug
   - Scope proof: All operator commands source `--database` through the shared helper; the focused malformed-input probe reproduced default selection while existing tests cover only valued happy paths.
   - Affected surface hints: `operator parser`, `database targeting`, `invalid-input exits`, `status/build/cutover/rollback/repair`
   - Canonical content hash: `sha256:3d5cdfbcc2174fa2aeda6604407bc345c1d644f17246d935c12c380b593f0ec0`
   - Supersedes: `P1-007`

```json
{"findingId":"P1-011","type":"correctness","claim":"A present operator option without its required value is accepted and may silently select the default database.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52",".opencode/skills/sk-design/styles/lib/database/operator.mjs:213-217","read-only probe: runStyleDatabaseOperator(['status','--database']) returned ok:true against DEFAULT_STYLE_DATABASE_PATH"],"counterevidenceSought":"Reviewed command-specific required-value guards and ran the focused operator suite; guards exist for build/cutover operands but not generic missing values or unknown flags.","alternativeExplanation":"Null coalescing could be intended to make omitted --database equivalent to no option, but the README promises nonzero exit on invalid input and an explicitly present valueless flag is malformed.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Prove a documented contract that explicitly permits valueless options, or add generic parser rejection with focused missing-value and unknown-option tests."}
```

2. **P1-012 — Status throws when the database parent directory is absent** -- `.opencode/skills/sk-design/styles/lib/database/operator.mjs:61` -- `listGenerationPaths` calls `readdir` before `getStyleDatabaseStatus` can return its modeled `published:false` DTO. A read-only probe against an absent parent returned `ENOENT`, while only an already-existing empty directory reaches the unpublished result. This supersedes `P1-008` solely to repair reducer identity; the defect is not fixed. [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:58-62`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:81-94`]
   - Finding class: instance-only
   - Scope proof: The status path has one generation-directory enumerator; focused source review and an absent-parent probe reproduced the throw before pointer absence handling.
   - Affected surface hints: `operator status`, `clean-checkout diagnostics`, `unpublished DTO`, `CLI exits`
   - Canonical content hash: `sha256:e3da9a7031f43bb95ed798a490217a461b8324d0e02e718cc19f5c24e5f2caec`
   - Supersedes: `P1-008`

```json
{"findingId":"P1-012","type":"correctness","claim":"Status throws ENOENT instead of returning the modeled unpublished DTO when the database parent directory does not exist.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/operator.mjs:58-62",".opencode/skills/sk-design/styles/lib/database/operator.mjs:81-94","read-only probe: getStyleDatabaseStatus('/definitely-absent-sk-design-review/style.sqlite') returned ENOENT"],"counterevidenceSought":"Reviewed pointer-absence handling and ran the focused operator suite; an existing empty directory is handled, but the absent-parent branch is neither caught nor tested.","alternativeExplanation":"The operator may assume install-time creation of the database directory, but the packet and status DTO explicitly describe clean-checkout unpublished behavior.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Prove the parent directory is an enforced precondition before every status call, or make absent-parent status return published:false and protect it with a focused test."}
```

### P2 Findings

None.

## Traceability Checks

| Claim | Adversarial replay | Result |
|---|---|---|
| `P1-001` publication digest | Production open checks pointer generation only; digest verification remains optional in `resolveManifestArtifacts`. Counterevidence: pointer/generation containment is strong but does not authenticate bytes. | Confirmed P1 [SOURCE: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:212-234`] |
| `P1-002` playbook paths | Execution policy and DB-01..08 still name removed `_db`/`_engine` trees. Counterevidence: relocated suites pass, but that makes the documented commands stale rather than valid. | Confirmed P1 [SOURCE: `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-29`] |
| `P1-003` parent phase map | Parent marks 001/005/006 Planned while child authorities report completed/COMPLETE/IMPLEMENTED. | Confirmed P1 [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:54-74`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:38-53`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/005-library-restructure/implementation-summary.md:39-45`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:39-43`] |
| `P1-004` database README paths | All five operator examples still invoke `styles/_db/operator.mjs`; relocated implementation and passing tests do not make those commands executable. | Confirmed P1 [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:69-87`] |
| `P1-005` generated metadata | 012 remains `in_progress` against IMPLEMENTED authority; 001/004 retain `_db` entities after relocation. The generator owner is outside the frozen manifest, so no freshness pass can be inferred. | Confirmed P1 [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:41-57`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json:41-64`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/004-growth/graph-metadata.json:35-55`] |
| `P1-006` generation drift | All four consumers retain the warning but map post-query mismatch to `no-fit`; their builders already model mismatch as `requery-required`. Green tests stabilize current behavior but do not disprove the contract mismatch. | Confirmed P1 [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:374-409`] [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503-508`] |
| `P1-007` malformed options | Reproduced and still active; resolved only as an identity-repair supersession by `P1-011`. | Superseded, not fixed |
| `P1-008` absent-root status | Reproduced and still active; resolved only as an identity-repair supersession by `P1-012`. | Superseded, not fixed |
| `P1-009` shadow parity | Comparator projects selected card fields and explicitly tolerates generation/content hashes, score values, and ranking mode, while packet prose claims full facade DTO/drop-in parity. | Confirmed P1 [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:113-141`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:81-100`] |
| `P1-010` p95 evidence | Packet asserts p95 1150→53 ms; the executable harness is warmed median-of-three over one request and 20 synthetic styles. A possible uncommitted operator trace cannot satisfy the frozen target's reproducibility requirement. | Confirmed P1 [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:64-67`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:31-39,107-131`] |

`spec_code` remains **fail**, `checklist_evidence` remains **partial**, `playbook_capability` remains **fail**, and `feature_catalog_code` remains **notApplicable**. No active claim was downgraded, disproved, or substantively merged.

## Integration Evidence

- `node --test` over the operator, adapter, and four corpus consumer suites: **64 passed, 0 failed, 0 skipped**.
- Read-only malformed option probe: `status --database` returned `ok:true` against the default path.
- Read-only absent-root probe: status returned `ENOENT` before the unpublished DTO.
- Code Graph was unavailable by dispatch contract; structural-impact analysis remains unavailable, and direct reads/exact anchors are the evidence authority.

## Edge Cases

- `P1-007` and `P1-008` are marked resolved only because first-seen iteration 008 assigned the same reducer identity. `P1-011` and `P1-012` preserve the two live defects with distinct canonical hashes.
- Green focused tests are counterevidence against broad regressions, not against missing malformed-input and absent-parent cases.
- The review stayed inside the frozen manifest; generator/runtime consumers outside it were not used to infer a pass.
- The implementation still defaults to `legacy`, and cutover remains human-gated; these facts contain impact and keep all claims below P0.

## Confirmed-Clean Surfaces

- The six focused suites remain green (64/64).
- Generation mismatch paths retain `no-source-influence`; no stale source material is consumed.
- Default mode remains `legacy`; no autonomous cutover or destructive data-loss path was found.

## Ruled Out

- P0 escalation: default/cutover containment and absence of destructive or security-critical activation remain proven.
- Downgrading the two operator defects because happy-path tests pass: direct probes reproduce both uncovered boundary failures.
- Treating outside-manifest traces or generated-state consumers as counterevidence: the frozen target requires in-scope, reproducible evidence.

## Next Focus

- Dimension: synthesis
- Focus area: synthesize the ten active P1 claims, including the `P1-007`→`P1-011` and `P1-008`→`P1-012` identity-repair transitions
- Reason: iteration 10 reached the configured maximum with every substantive claim still supported
- Rotation status: all review dimensions and final stabilization are complete; no further LEAF iteration is authorized
- Blocked/productive carry-forward: Code Graph remains unavailable; lineage artifacts, direct anchors, and focused-test receipts remain productive for synthesis
- Required evidence: iteration 010 narrative/delta/state agreement, ten active P1 identities, two identity-only resolutions, and `maxIterationsReached`

Review verdict: CONDITIONAL
