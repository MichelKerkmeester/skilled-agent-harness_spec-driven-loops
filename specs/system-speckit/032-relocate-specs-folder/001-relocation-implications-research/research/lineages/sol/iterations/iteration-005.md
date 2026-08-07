# Iteration 5: Migration scale, sequencing, and proof gates

## Focus

Estimate the executable and documentary blast radius, identify reusable migration safeguards, and derive the safest root-inversion sequence, rollback boundary, and objective verification plan.

## Actions Taken

1. Counted files containing `.opencode/specs` across the active Spec Kit, command, agent, CI, and root-policy surfaces.
2. Classified the count into source, tests, and documentation/configuration rather than treating every hit as executable coupling.
3. Read the migration, manifest, collision, write-guard, validation-matrix, and fault-injection implementation surfaces.
4. Inspected CI roots and the runtime no-spec-import guard.
5. Combined all prior findings into a staged cutover and rollback model.

## Findings

1. The sampled active surfaces contain 300 files with `.opencode/specs`: 54 source files, 87 tests/fixtures, and 159 documentation/configuration files. This is an upper bound, not 300 required code edits; changelogs, historical packets, examples, and negative-test fixtures must be classified rather than rewritten. [SOURCE: command `rg -l "\\.opencode/specs" .opencode/skills/system-spec-kit .opencode/commands .opencode/agents .github AGENTS.md PUBLIC-RELEASE.md`] [SOURCE: classification command output `total=300 source=54 tests=87 docs_config=159`]
2. The maintained root registry reduces discovery risk by naming 21 resolver groups and their precedence contracts. It does not cover every literal writer, CI path, policy document, or generated mirror, so registry inversion is necessary but insufficient. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:24] [INFERENCE: combined registry scope with iteration-5 literal inventory]
3. Existing migration infrastructure is substantial but points in the opposite direction: it defines `.opencode/specs` as canonical, moves legacy-only packets from `specs`, creates deterministic packet hashes, rejects divergent duplicates, freezes writers, quarantines before move, and supports verified rollback. The machinery should be parameterized or directionally inverted rather than discarded. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-migration.ts:219] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-migration-manifest.ts:105] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-write-guard.ts:15]
4. The validation matrix covers ten physical-root states and the spec-root suite contains 61 declared test cases, including same-inode aliases, byte-identical and divergent duplicates, broken links, external links, cross-device moves, writer freeze, quarantine, and rollback. These fixtures provide a strong base, but their expected canonical direction must be inverted and augmented with Git-index and Memory MCP assertions. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/spec-root-validation-matrix.vitest.ts:27] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/spec-root-fault-injection.vitest.ts:130] [SOURCE: command counting `describe|it|test` in `spec-root-*.vitest.ts`]
5. CI has explicit old-root coupling: the strict-pass freshness workflow passes `--roots .opencode/specs`, while the sweep implementation itself can accept multiple roots and defaults to both existing roots. Current policy text in `AGENTS.md` also calls `.opencode/specs` tracked/canonical. Executable CI and policy are P1 cutover items, not cleanup. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:55] [SOURCE: .opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts:83] [SOURCE: AGENTS.md:265]
6. The safe sequence is transactional: freeze writers; snapshot Git and Memory MCP baselines; build and approve a collision manifest; materialize a real top-level `specs/` tree; replace the old root with the relative reverse alias `.opencode/specs -> ../specs`; invert writer defaults and resolver policy; reindex and deduplicate Memory MCP; update CI/ignore/downstream contracts; then retire the alias only after executable old-root consumers reach zero. [INFERENCE: combined iterations 1-5 evidence and existing migration safeguards]
7. Rollback is time-sensitive. Before any post-cutover canonical writes, verified quarantine plus the old index/symlink state can restore the original topology. After writers emit new data under top-level `specs`, a symlink flip alone is unsafe; rollback must freeze writers again and migrate the new tree and indexed paths as one transaction. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-migration.ts:254] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/spec-root-fault-injection.vitest.ts:96] [INFERENCE: new writes change the authoritative dataset]

## Questions Answered

- Answered: reference scale, coupling classification, migration sequence, rollback boundary, and verification gates.

## Questions Remaining

- Product-policy decision: downstream project-local specs should either be tracked by each downstream repository with explicit negation, or remain shared framework data hidden by global ignores. The migration cannot safely infer ownership.

## Ruled Out

- Repository-wide blind replacement of all 300 file hits.
- Rebuilding migration safety from scratch.
- Retiring the reverse alias in the same atomic step as the root inversion.
- Treating a clean filesystem move as proof that Memory MCP and Git identity migrated.
- Rolling back after new writes by changing symlinks only.

## Dead Ends

- The existing migration suite was not executed because it writes temporary fixtures outside the lineage directory; its source and assertions were inspected instead.

## Edge Cases

- Ambiguous input: historical references can be correct descriptions of past topology and should not all become current-path claims.
- Contradictory evidence: the runtime no-spec-import guard mentions `.opencode/specs`, but its durable intent is to prohibit imports from any mutable specs tree; the guard semantics should generalize while its fixtures retain deliberate positives.
- Missing dependencies: no isolated Git worktree or Memory MCP database was authorized inside this lineage.
- Partial success: the reference upper bound is measured, while exact edit count depends on implementation-time classification.

## Objective Verification Gates

1. Baseline packet counts, byte hashes, Git index mode/payload, strict validation results, Memory MCP row counts, distinct `spec_folder` values, and duplicate canonical paths.
2. Dry-run migration manifest reports no unresolved divergent duplicate and has a recorded rollback/quarantine location.
3. `create.sh`, generate-description, graph backfill, resume, memory save, and explicit indexing all choose top-level `specs/` for unqualified writes or lookups.
4. Both explicit roots validate during compatibility, but a single realpath-backed packet is indexed once with unchanged root-relative `spec_folder` identity.
5. Git records `specs/` as a tree and `.opencode/specs` as the relative reverse link; source-repository negations expose both while downstream global-ignore behavior matches the chosen ownership policy.
6. Runtime mirror checks remain green; no runtime-specific specs links appear; CI strict sweep runs against `specs`.
7. All 21 registry contracts and the spec-root fixture matrix are updated; executable old-root-only scans return zero before alias retirement.
8. Full final gate reruns from the migrated state, then a rollback rehearsal proves byte- and identity-preserving recovery before production cutover.

## Sources Consulted

- Literal path inventory across Spec Kit, commands, agents, CI, and root policies
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts`
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration.ts`
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration-manifest.ts`
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-write-guard.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/spec-root-validation-matrix.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/spec-root-fault-injection.vitest.ts`
- `.github/workflows/strict-pass-freshness-sweep.yml`
- `.github/workflows/runtime-no-spec-import.yml`
- `AGENTS.md`

## Assessment

- New information ratio: 0.55
- Novelty justification: three findings were new measurements or infrastructure discoveries; four synthesized prior evidence into migration and rollback constraints.
- Confidence: high for measured active-surface counts and existing safeguards; medium for exact implementation edit count and downstream ownership policy.

## Reflection

- What worked and why: separating executable source, tests, and documents prevented the raw count from becoming a false effort estimate.
- What did not work and why: test execution was incompatible with the lineage-only write boundary.
- What I would do differently: run the inverted fixture matrix, Git object transition, and isolated Memory MCP reindex together in the implementation packet.

## Recommended Next Focus

Synthesize the five passes into the lineage research report, resource map, convergence report, and terminal state.
