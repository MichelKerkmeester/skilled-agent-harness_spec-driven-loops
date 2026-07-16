# Iteration 3: System-Spec-Kit Tooling-Borrow And Hidden Seams

## Focus

This iteration validated whether child 002's `system-spec-kit` tooling-borrow repair is complete enough for post-move verification gates, including hidden runtime seams and cross-package tests.

## Findings

1. The four planned `system-spec-kit` tooling-borrow edits are necessary and correctly scoped to phase 002. Runtime's typecheck script currently borrows `../system-spec-kit/node_modules/.bin/tsc` [SOURCE: .opencode/skills/deep-loop-runtime/package.json:10-12], runtime's `typeRoots` points at `../system-spec-kit/node_modules/@types` [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12-14], `test:council` includes two deep-loop-runtime integration tests [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:27-32], and the shared vitest config includes `../deep-loop-runtime/tests/**/*` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18-21]. These break after runtime nests unless rewritten.
2. `artifact-root.cjs` is a hidden load-bearing seam and should be included in phase 002, not deferred. It re-exports `system-spec-kit/shared/review-research-paths.cjs` through a depth-sensitive relative path [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16-19], and research/review reducers consume it through runtime rather than reaching directly into system-spec-kit [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:13-15]. After nesting under `system-deep-loop/runtime/lib/deep-loop/`, the re-export needs one more `..`.
3. The artifact-root test must move with the seam. `artifact-root.vitest.ts` compares runtime's re-export to the original system-spec-kit shared resolver via `../../../system-spec-kit/shared/review-research-paths.cjs` [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10-25]. If the implementation path changes but this test does not, the runtime suite can fail before validating artifact topology.
4. `council-playbook-anchor-integrity.vitest.ts` is a `test:council` blocker that child 002 should handle if `test:council` runs before child 003. It hardcodes `PLAYBOOK_ROOT` under `deep-loop-workflows` and `DEEP_LOOP_RUNTIME_TEST_ROOT` under `deep-loop-runtime` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:7-13], and its regexes only recognize `.opencode/skills/deep-loop-runtime/tests/...` as a deep-loop runtime test reference [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:27-30] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:49-67].
5. The plan's "fix paths only, do not decouple" decision is correct. Runtime now has its own dependencies, and a self-containment guard rejects production `lib/` and `scripts/` reach-ins into `system-spec-kit/**/node_modules` [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:37-52] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:66-82]. The remaining typecheck/typeRoots borrow is tooling convenience, not production dependency coupling, so decoupling it in the merge would add unnecessary failure modes.
6. Other `system-spec-kit` references should be classified by gate ownership. `memory-runtime-retention.vitest.ts` imports runtime loop-lock directly [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:5-13], and `deep-review-auto-restart-contract.vitest.ts` reads `fanout-run.cjs` from the old runtime path [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts:14-20]. These are not in child 002's named gates unless phase 002 chooses to run broader system-spec-kit suites, but they must be included in child 003 external reference migration or a broader pre-merge residual sweep.

## Ruled Out

- Fully decoupling runtime from all `system-spec-kit` tooling during the merge: ruled out because production dependency self-containment is already guarded and decoupling compiler/test tooling would conflate merge failures with tooling split failures.
- Treating the four-row Stage 3b table as complete: ruled out because artifact-root and `test:council` anchor fixtures are load-bearing for the stated validation gates.

## Dead Ends

- Grepping all of `system-spec-kit` returns many manual testing playbook and README references. Those matter for child 003/reference migration, but they are not all phase 002 blockers.

## Edge Cases

- Ambiguous input: "tooling-borrow" could mean only package manager/compiler paths; evidence shows it also includes artifact-topology re-export and gate-specific tests.
- Contradictory evidence: The runtime package description says it is self-contained [SOURCE: .opencode/skills/deep-loop-runtime/package.json:4], yet its typecheck and typeRoots still borrow system-spec-kit tooling [SOURCE: .opencode/skills/deep-loop-runtime/package.json:10-12] [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12-14]. The contradiction resolves as production self-containment plus tooling borrow, not a required decoupling.
- Missing dependencies: None.
- Partial success: Did not classify every system-spec-kit documentation hit; this iteration scoped to validation gates and executable/test seams.

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/package.json:10-12`
- `.opencode/skills/deep-loop-runtime/tsconfig.json:12-14`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:27-32`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18-21`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16-19`
- `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10-25`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:7-13`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:27-30`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:49-67`
- `.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:37-52`
- `.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:66-82`
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:5-13`
- `.opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts:14-20`

## Assessment

- New information ratio: 0.58
- Novelty justification: The four planned edits were known, but artifact-root, council anchor fixtures, and gate ownership classification add material corrections.
- Questions addressed: system-spec-kit tooling-borrow repair.
- Questions answered: Is the system-spec-kit tooling-borrow repair complete, including hidden runtime seams and tests beyond the obvious package and tsconfig files?
- Confidence: High for the required phase 002 additions around artifact-root and `test:council`; medium for broader child 003 reference inventory until a full residual sweep runs.

## Reflection

- What worked and why: Reading the exact gate files connected the abstract borrow to concrete failing paths.
- What did not work and why: Whole-tree grep was too broad to separate phase 002 blockers from child 003 documentation debt.
- What I would do differently: Implementation should maintain two checklists: phase 002 validation-gate blockers and child 003 reference-corpus migration.

## Recommended Next Focus

Classify reference migration across commands, agents, READMEs, graph metadata, advisor corpus, model profiles, doctor routes, and intentionally stable command/agent names.
