# Iteration 012 - Frontier node F-2-007: correctness

## Dispatcher

- Lineage: opus (fan-out), iteration 12 of 24, dimension correctness, frontier node F-2-007 (depth 2 of 3, child of F-1-002, admitted at iteration 1)
- Stop check before dispatch: CONTINUE (`frontierOpen`: F-2-007 is the last open node)
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Correctness of the node's question: does any workflow step give a commit-range review target its touched-file list before admission reads `reviewScopeFiles`, and do the range-token heuristics hold for the targets operators actually write?

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:583-644` (range detection and relevance), `:728-741,817-862` (seed and admit both run relevance)
- `.skilled/commands/deep/assets/deep-review.yaml:791-818,896,926-951` (scope discovery, config, seed order)
- Probe of `scopeInsideReviewTarget` with seven operator-style targets

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. The first half of the node's question is OPUS-F004-P1-001 (iteration 7): no workflow step produces the touched-file list.

### P2 Findings

1. **An open-ended git range (`main..`, `..HEAD`, `origin/main...`) is read as a path, so on a single-executor run the seed and every proposal are pruned as `relevance`** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:592 -- `isRevisionRangeToken` requires a non-dot, non-slash character on both sides of the dots (`/[^/.]\.\.\.?[^/.]/`). Git's open-ended spellings have nothing on one side, so they fall through to the plain-path branch, which normalizes `main..` to a path and admits only scopes under it (`:640-643`). Probe with `reviewScopeFiles` holding the real touched file: `main..`, `..HEAD` and `origin/main...` each returned `false` for that very file, while `HEAD~3..HEAD`, `@{u}..HEAD` and `abc123^..def456` returned `true`. On a single-executor run the config exists before `step_frontier_seed` (`deep-review.yaml:873-951`), and `seedNodes` routes every candidate through the same relevance check (`frontier-admit.cjs:862` into `:739`), so all seeds are pruned, the budget stays at the loop default, and `--depth-mode=expansive` silently does nothing. The catalog promises narrowing only for `base..tip` and `base...tip` (`frontier-admit-script.md:50`), so this is input outside the stated contract, hence P2.
   - Finding class: instance-only
   - Scope proof: `isRevisionRangeToken` is the only range detector (`frontier-admit.cjs:591-598`); seeds and proposals share `checkProposal`.
   - Affected surface hints: frontier-admit.cjs isRevisionRangeToken (accept a leading or trailing range operator next to a ref), frontier-admit-review.vitest.ts range cases, catalog relevance paragraph.
   - Case: `/deep:review "main.." :auto --depth-mode=expansive` on a feature branch: the seed prints zero admitted nodes, every candidate pruned as relevance.

## Traceability Checks

No protocol run this iteration (correctness pass).

## Integration Evidence

- Seed relevance applies only where a config exists at seed time: the single-executor seed runs after `step_create_config` (`deep-review.yaml:873,926`); the fan-out parent seeds before any config (`:334-361`), so `readTargetConfig` returns null and every scope is admitted there (`frontier-admit.cjs:738-740`). The same target therefore seeds on fan-out and seeds nothing on a single run.

## Edge Cases

- A file-list target whose label contains an ellipsis glued to a word (`src/a.ts src/b.ts (and so on...)`) reads as a range (`on...)` matches). With scope discovery listing those files the narrowing still lands on the same files, so the effect is benign.
- `HEAD~3..HEAD`, `@{u}..HEAD` and `abc123^..def456` are recognized correctly.

## Confirmed-Clean Surfaces

- Two-sided ranges with refs, reflog and parent suffixes.
- A label around a two-sided range (pinned by `frontier-admit-review.vitest.ts:521-531`).

## Ruled Out

- Climbing paths read as ranges: `(?:^|\/)\.\.(?:\/|$)` excludes them (`frontier-admit.cjs:592`), pinned by the test at `frontier-admit-review.vitest.ts:534`.

## Operator Focus Coverage

- Overengineering: the filesystem probe inside `isRevisionRangeToken` (`fs.existsSync(path.resolve(token))`) exists only to tell `docs/notes..v2.md` from a slashed range; it is cheap but makes relevance depend on the working directory, which the YAML pins to the repo root.
- Operator UX: an empty seed under expansive gives only a budget line; nothing tells the operator the target spelling caused it.
- Cross-CLI and OS parity: `path.resolve` against the cwd behaves the same on every OS; executors that change the cwd before calling the script would change the result, but every YAML call sets `working_directory: "{repo_root}"`.

## Next Focus

- Dimension: security
- Focus area: F-2-007 security (range target as filesystem probe input; touched-file list as trust input)
- Reason: node's next uncovered dimension
- Rotation status: F-2-007 correctness covered
- Required evidence: file:line

Review verdict: CONDITIONAL
