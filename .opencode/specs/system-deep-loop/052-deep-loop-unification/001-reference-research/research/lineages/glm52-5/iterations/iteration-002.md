# Iteration 002 - Bidirectional Path-Coupling Repair Inventory

## Focus

Validate child 002's Class A (forward) + Class B (reverse) path-repair tables against the actual executable import inventory, and surface silently-breaking seams.

## Findings

1. The plan's directional repair RULE is correct for relative-hop requires, but its Class B inventory is materially incomplete. Confirmed in-tree reverse requires omitted from the table: `deep-review/scripts/reduce-state.cjs:14` (`resolveArtifactRoot`, 3-ups), `deep-review/scripts/runtime-capabilities.cjs:18` (`createRuntimeCapabilities`, 3-ups), `deep-research/scripts/runtime-capabilities.cjs:18` (same shim), and the SECOND require in `deep-research/scripts/reduce-state.cjs:20` (`continuity-thread.cjs`) — the table only lists the artifact-root require at line 15. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:14] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:15-20] [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:80-86]

2. `deep-ai-council/scripts/orchestrate-session.cjs` is a SEPARATE file from the enumerated `orchestrate-topic.cjs`, carrying 3 of its own runtime requires (lines 16-18: `round-state-jsonl`, `cost-guards`, `session-state-hierarchy`). The plan's Class B line item "deep-ai-council/scripts/orchestrate-topic.cjs:14-18 (5 requires)" does not cover it. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs:16-18]

3. **NEW — a THIRD path-repair class the Class A/B framing does not model: repo-root ABSOLUTE path construction.** `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` does not use relative `require()` hops; it builds repo-root-anchored paths. `findRepoRoot()` (lines 51-61) locates the repo root by probing `fs.existsSync(path.join(current,'.opencode','skills','deep-loop-runtime','scripts','upsert.cjs'))` (line 56), and `runtimeUpsertScript()` (lines 63-66) returns `repoRoot/.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` (line 65). After the rename the existence probe at line 56 NEVER matches, so `findRepoRoot` silently falls through to `path.resolve(startDir)` and `runtimeUpsertScript` returns a path to a non-existent script — a silent runtime failure, not a load-time crash. Neither Class A (same-hop delete segment) nor Class B (minus-one-hop rename) describes this; it is a repo-root-absolute existence-probe that must be rewritten to probe `system-deep-loop/runtime/scripts/upsert.cjs`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51-66]

4. **Prose/test-data vs code-path distinction — protect council test fixtures from blind find/replace.** Several council test files embed the token `deep-loop-runtime` as NARRATIVE test data, not path references: `findings-registry.vitest.ts:43` ("Extend deep-loop-runtime with council primitives" as a council claim), `persist-artifacts.vitest.ts:60,93,117` (assertions on a council recommendation string), `orchestrate-topic.vitest.ts:28,131` (`recommended_option: 'extend-deep-loop-runtime'`). These are semantic fixtures exercising the council domain, not references to the skill location. Blind Stage-F/Stage-J residual-grep replacement would alter test semantics and break assertions that intentionally reference "extending the runtime" as a concept. Child 003's category-scoped (not global) rewrite is the right guard; this nuance should be in the residual-grep allowlist rationale. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/findings-registry.vitest.ts:43] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/persist-artifacts.vitest.ts:60] [SOURCE: 003-external-reference-migration/plan.md:66-67]

## Ruled Out

- Treating `replay-graph-from-artifacts.cjs` as a Class B relative-hop site — it constructs repo-root absolute paths via an existence probe, a different repair shape that needs its own inventory row.
- Global find/replace of `deep-loop-runtime` across council test files — many hits are semantic test data, not skill-location references.

## Next Focus

Stress the `system-spec-kit` tooling-borrow (Stage 3b), the `artifact-root.cjs` re-export depth, and the remaining advisor-corpus/test-fixture migration edges.
