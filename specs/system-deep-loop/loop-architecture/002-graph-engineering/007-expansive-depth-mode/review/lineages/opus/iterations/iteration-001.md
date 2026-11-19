# Iteration 001 - Frontier node F-1-002: correctness

## Dispatcher

- Lineage: opus (fan-out), session fanout-opus-1795113418367-pvzn7z, generation 1
- Iteration 1 of 24, dimension correctness, frontier node F-1-002 (depth 1 of 3)
- Sources read: config, registry, strategy, frontier-nodes.jsonl; steer.md absent
- Doctrine: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` (severity and reach rules)

## Dimension

Correctness of the frontier admission engine: seed, admit, close, block and budget commands, the six admission checks, band budgets, the derived iteration budget and the commit-range relevance test.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:1-1300` (whole file, added in range)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts:420-610` (root cap and commit-range scope tests)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts:170-345` (dedupe and check-order tests)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:760-800` (cross-lineage node id qualification, context)
- `.skilled/commands/deep/assets/deep-review.yaml:791-818` (scope discovery), `:926-973` (seed and budget steps)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **dedupeKey drops every non-ASCII letter, so a non-Latin question is pruned as a duplicate and accented questions collide** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:248 -- `dedupeKey` lowercases and then replaces `[^a-z0-9]+` with a space. A question written in a non-Latin script reduces to `''`, and `checkProposal` returns `dedupe` for an empty key (`:678`), so the node is pruned with a reason that says it repeats known work when it repeats nothing. Accented letters are also erased, so `Prüfung` and `Präfung` share the key `pr fung`. Probe: `dedupeKey("検証は正しいか")` returns `""`; `dedupeKey("Ist die Prüfung übermäßig?")` returns `"ist die pr fung berm ig"`.
   - Finding class: instance-only
   - Scope proof: the only key producer is `dedupeKey` (`frontier-admit.cjs:240-253`); `nodeDedupeKey` and the known-texts loop both route through it.
   - Affected surface hints: frontier-admit.cjs dedupeKey and checkProposal step 2; frontier-admit.vitest.ts dedupe tests (no non-ASCII case).
   - Case: a leaf writes a frontier_proposal whose question is in Japanese or another non-Latin script.

2. **A commit-range review target with no touched-file list admits every scope, including absolute and out-of-repo paths, and no workflow step records that list** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:618 -- `scopeInsideReviewTarget` routes any target holding a range token to `scopeInsideTouchedFiles`, which returns `true` when `reviewScopeFiles` is empty. The pathspec written after `--` is never consulted on that path. The review YAML's `step_scope_discovery` `files` branch (`deep-review.yaml:815-818`) only expands globs and validates that files exist; it has no rule that turns a commit range into its touched files, so whether relevance narrows at all depends on the orchestrating model inventing that list. Probe: `scopeInsideReviewTarget(["/etc/passwd"], {reviewTargetType:"files", reviewTarget:"a..b -- .skilled/skills"})` returns `true`, while the plain-path target `.skilled/skills` returns `false`. The unit test at `frontier-admit-review.vitest.ts:516` pins the admit-all fallback as intended, so this is a contract gap between engine and workflow, not an engine bug.
   - Finding class: cross-consumer
   - Scope proof: producers of `reviewScopeFiles` are `step_create_config` (`deep-review.yaml:896`) from `step_scope_discovery`; no other writer found by `grep -n reviewScopeFiles` over the YAML and review.md.
   - Affected surface hints: frontier-admit.cjs scopeInsideReviewTarget/scopeInsideTouchedFiles; deep-review.yaml step_scope_discovery files branch; review.md flag table.
   - Case: an operator runs `/deep:review` on `base..tip -- some/dir` and the init step records the literal target words rather than `git diff --name-only` output, so a leaf proposal scoped to `/etc` or `../other-repo` is admitted.

## Traceability Checks

No protocol run this iteration (correctness pass). Core protocols are scheduled for this node's traceability visit.

## Integration Evidence

- `fanout-merge.cjs:761-763` qualifies every lineage node id as `<label>:<nodeId>`, so two lineages that both allocate `F-2-008` (serials are per-lineage, `frontier-admit.cjs:258-265`) do not collide in the merged frontier.

## Edge Cases

- The frontier registry reports `depth3.allotted` 12 at seed time while `depth2` is 8.4. This is the documented roll-down (`frontier-admit.cjs:370-371`): an empty depth-2 band carries its share down. Not a defect.
- Config `reviewScopeFiles` was recorded by this lineage's init as the 232 files `git diff --name-only` lists for the range and pathspec, so this lineage's own admission narrows correctly.

## Confirmed-Clean Surfaces

- `closeNode` settled-status guard (`:895-900`): a pruned node cannot be revived and a settled node cannot move.
- `readNodeStore` treats an unreadable existing store as an error rather than an empty frontier (`:284-291`).
- `nextNodeSerial` counts from the highest serial, so a torn line cannot hand its id to a successor (`:258-265`).
- `writeSeedBudget` writes the config through a temp file and rename (`:524-527`).
- `normalizeTargetPath` plus `isInsidePath` reject `..` climbs for plain path targets (`:543-554`).

## Ruled Out

- Cross-lineage node id collision: ruled out by merge-time qualification (`fanout-merge.cjs:761`).
- Band budget roll-up: `carry` only flows to a later band (`:361-373`), never up.
- Over-engineering of `checkCycle`: ids are fresh and parents must exist, so a cycle needs a hand-edited store; the check is part of the spec's six-check contract, so it is kept as a cheap guard rather than flagged.

## Operator Focus Coverage

- Overengineering: the six checks are one function in fixed order; `checkCycle` is the only guard with near-zero reach and is spec-mandated (ruled out above).
- Operator UX: the `dedupe` reason is misleading for non-ASCII text (finding 1); prune reasons are otherwise named and stable.
- Cross-CLI and OS parity: pure Node `fs`/`path.posix`; `isRevisionRangeToken` resolves against the process cwd, which the YAML pins to `{repo_root}`. No shell or BSD/GNU dependence in this file.

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-002 (frontier-admit.cjs) trust boundary: leaf-written proposal text, scope paths and the `--input`/`--known-texts`/`--output` file arguments
- Reason: the node's next uncovered dimension per registry.frontier
- Rotation status: correctness covered for F-1-002
- Required evidence: file:line for every path handling branch

Review verdict: PASS
