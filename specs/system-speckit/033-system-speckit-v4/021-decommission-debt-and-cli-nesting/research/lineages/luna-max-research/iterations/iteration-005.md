# Iteration 5: Tests, fixtures, skips, and weakened coverage

## Focus

Audit active test configuration and explicit test files for coverage that no longer exercises the decommission-sensitive behavior. The distinction for this pass is between a test that asserts a current contract, a test that is disabled because its fixtures are stale, and a functional runner that turns an unavailable retired dependency into a green result.

## Findings

1. **LUNA-020 — The complete auto-detection fixes suite is disabled, including live workflow and folder-promotion paths. P1. CONFIRMED.** A TODO immediately precedes `describe.skip.sequential`, and the skipped block contains the end-to-end `runWorkflow` case plus parent-activity and child-activity detector cases. The suite therefore cannot catch a regression in the detector's current wrapper/metadata contract; the comment also says its assertions still target old packet-shape sections. Smallest fix: port the fixtures and assertions to the current successor packet shape, then remove the suite-level skip; retain a narrow compatibility test only if the old shape is intentionally supported. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:244-245] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:350-415]

2. **LUNA-021 — Canonical-save integration is represented by an empty skipped test, so active tests do not prove `runWorkflow` writes the required metadata. P1. CONFIRMED.** The file describes a full-workflow harness as skip-pending, places the entire suite under `describe.skip`, and its only test body is intentionally empty. Unit tests above it can pass while the actual plan-only/full-auto save path stops updating `description.json` or graph metadata. Smallest fix: land the compact-wrapper fixture and assert both modes end-to-end, or remove the placeholder from the active suite and replace it with a current, executable integration contract. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:6-23] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:267-281]

3. **LUNA-022 — Folder-detector functional checks can report green when the database dependency or real database is unavailable. P1. CONFIRMED.** The runner increments a skipped counter without incrementing failures when `better-sqlite3` cannot load, temporary DB setup fails, or the real DB file is absent. Its main function runs those checks and exits nonzero only when `results.failed > 0`; a run in which every DB-backed check is skipped can therefore exit zero without testing the retired database fallback or its failure behavior. Smallest fix: make required DB checks fail closed in CI, or replace them with explicit successor-path tests and publish skipped counts as a gate failure when the database contract is no longer supported. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:162-175] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:789-840] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:1279-1346]

4. **LUNA-023 — Profile-keyed database filename coverage is entirely skipped while the resolver still collapses to the legacy singleton. P1. CONFIRMED.** The profile test file states that the resolver collapses to `context-index.sqlite` and marks the whole suite skipped, although the skipped assertions define provider/model/dimension/dtype-specific filenames and explicitly reject the singleton. The shared Vitest setup independently confirms that this legacy default remains the resolver's derived path and must be isolated from production state. Smallest fix: decide whether profile-keyed DBs are a supported successor; then either activate and satisfy this contract or delete the abandoned contract and its legacy resolver/test setup together. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/local-llm-features/profile-db-filename.vitest.ts:23-24] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/local-llm-features/profile-db-filename.vitest.ts:46-84] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-59]

5. **LUNA-024 — `/memory:learn` documentation parity is a known-failure/skip pair rather than an enforced migration check. P2. CONFIRMED.** The first parity assertion uses `it.fails.skip`, which deliberately ignores an expected contradiction, and the second workspace-wide alignment assertion is also skipped. A green test run therefore provides no evidence that the command docs, README files, and successor wording agree. Smallest fix: update the assertions to the intended successor wording and make both checks active; if `/memory:learn` is intentionally retired, assert its removal/redirect instead of preserving a skipped legacy contract. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts:14-26] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts:27-58]

6. **LUNA-025 — Export and naming tests encode `memory-*` handler files as required contracts, which can preserve retired surface names during a rename. P2. INFERRED.** The export-contract test's required handler list includes `memory-context.ts`, `memory-crud.ts`, `memory-index.ts`, `memory-save.ts`, and `memory-search.ts`; the naming-migration test also grants a large cross-reference mismatch budget to memory handlers and `memory-parser.ts`. These files may still be intentionally supported, but the tests do not show a successor mapping or a retirement boundary, so deleting or renaming the surface is treated as a regression rather than a completed migration. Smallest fix: replace the list/budget with the successor API contract, or mark each retained memory handler as an explicit compatibility owner with an expiry test. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-export-contracts.js:162-175] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:27-84]

## Ruled Out

- The runtime test setup is not itself an unsafe production write: it creates a scratch DB when no override is present and refuses explicit production paths. It is evidence that the legacy default still exists, not proof that the setup leaks writes. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:41-59]
- The active runtime Vitest configuration includes the runtime and scripts test trees; this pass therefore attributes the coverage gaps to the explicit skips and excluded suites, not to an unverified claim that no tests are discovered. [SOURCE: .opencode/skills/system-spec-kit/runtime/vitest.config.ts:15-28]

## Dead Ends

- Filename-only matching of `memory` is not sufficient to classify a test as obsolete: the profile resolver and folder detector expose concrete database behavior, while some memory handlers remain active until an explicit successor owner is established. The finding threshold was therefore disabled behavior or an unbounded old contract, not a name alone. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-59] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-export-contracts.js:165-175]

## Edge Cases

- `describe.skip` can be an intentional temporary fixture quarantine, but the current comments give no active CI gate or expiration mechanism. The risk is the absence of an executable replacement, not the mere existence of a TODO.
- The functional folder-detector runner may be intended for environments without native modules; that portability goal does not justify treating all required database coverage as a passing result.
- The profile filename contract may be obsolete rather than broken. Its status still needs an explicit owner decision because the test setup and resolver retain the legacy singleton name.

## Questions Remaining

- Q4 is partially answered: several decommission-sensitive contracts are disabled or can pass with all DB checks skipped; the active successor test boundary still needs mapping.
- Q1-Q3 and Q5-Q7 remain open. Next focus: documentation and runtime mirror parity across `.opencode`, `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi`.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:244-245,350-415]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:6-23,267-281]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95,162-175,789-840,1279-1346]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/local-llm-features/profile-db-filename.vitest.ts:23-24,46-84]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-59]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts:14-58]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-export-contracts.js:162-175]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:27-84]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/vitest.config.ts:15-28]

## Assessment

- New information ratio: 0.84
- Questions addressed: Q4 tests, fixtures, skips, and weakened coverage
- Questions answered: Q4 = partial; disabled integration, skip-green DB checks, and a skipped profile contract are confirmed.
- Confidence: high for skip behavior and runner exit semantics; medium for whether each old handler contract is intentionally retained, so LUNA-025 is explicitly inferred.

## Reflection

- What worked and why: reading skip declarations together with the runner's final exit condition distinguished an ordinary portability skip from a green result that omits the required branch.
- What did not work and why: treating every `memory-*` test name as obsolete would have conflated active compatibility code with decommission residue.
- What I would do differently: map each skipped suite to its current successor entrypoint before the final synthesis so the remediation queue can separate deletion from reactivation.

## Recommended Next Focus

Angle 5: documentation and runtime mirror parity, including statements and launch/config examples that still describe the retired memory database, mcp-server, zvec, or system-plugins surface.
