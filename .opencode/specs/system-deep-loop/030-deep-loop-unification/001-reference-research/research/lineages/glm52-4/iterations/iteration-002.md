# Iteration 002 - Bidirectional Path-Coupling Repair And Inventory Gaps

## Focus

Check the 002 Class A (forward: runtime→workflows) and Class B (reverse: workflows→runtime) repair tables against the real `require()` inventory, and verify the directional path math.

## Findings

1. The directional rules in 002 are correct, verified by path arithmetic. Forward seam `render-command-contract.cjs:11` is at `runtime/scripts/` with `require('../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs')` (2 hops → workflows). After nesting, `runtime/scripts/` reaches `shared/` in `system-deep-loop/` in 2 hops too (`../`→runtime, `../../`→system-deep-loop), so the 002 after-value `require('../../shared/rollout/resolve-injection-mode.cjs')` resolves correctly. Same hop-count, delete segment — matches the Class A rule. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:11] [SOURCE: 002/plan.md Class A table]

2. The reverse rule (minus one hop + rename) is also correct for both depth tiers: `scripts/` at 3 hops (`../../../deep-loop-runtime`) becomes 2 hops (`../../runtime`); `scripts/tests/` at 4 hops becomes 3 hops. Spot-checked against `deep-ai-council/scripts/orchestrate-topic.cjs:14-18` (3 hops) and `deep-ai-council/scripts/tests/orchestrate-topic.vitest.ts:9` (4 hops). [SOURCE: orchestrate-topic.cjs:14-18] [SOURCE: 002/plan.md Class B table]

3. NEW P1 — the Class B inventory is INCOMPLETE. The table explicitly names `orchestrate-topic.cjs` but NOT its sibling `orchestrate-session.cjs`, which carries 3 parallel council-lib requires (`round-state-jsonl`, `cost-guards`, `session-state-hierarchy` at lines 16-18). The full distinct-file reverse require inventory is 11 files; the table's "All 12 files" appears to count requires, not files, and still omits: `deep-ai-council/scripts/orchestrate-session.cjs`, `deep-review/scripts/reduce-state.cjs`, `deep-review/scripts/runtime-capabilities.cjs`, and `deep-research/scripts/runtime-capabilities.cjs`. [SOURCE: orchestrate-session.cjs:16-18] [SOURCE: rg require deep-loop-runtime in deep-loop-workflows — 11 distinct files]

4. NEW P1 — `replay-graph-from-artifacts.cjs` uses an ABSOLUTE path, not a relative require, so it is a separate repair class. Lines 56 and 65 resolve `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` via `path.join(repoRoot,'.opencode','skills','deep-loop-runtime',...)`. This must be renamed to `system-deep-loop/runtime/scripts/upsert.cjs`; it will NOT be caught by a relative-require grep. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:56] [SOURCE: replay-graph-from-artifacts.cjs:65]

## Ruled Out

- Treating "All 12 files follow this pattern" as a complete inventory — it conflates requires with files and misses non-require absolute-path forms.
- A pure relative-require grep as the Stage-3a checklist — it misses `replay-graph-from-artifacts.cjs`'s absolute-path form.

## Next Focus

Iteration 3: Validate the system-spec-kit tooling-borrow repair (package.json/tsconfig) and confirm whether `artifact-root.cjs`'s OWN internal `path.join` survives the 002 Stage-3b table.
