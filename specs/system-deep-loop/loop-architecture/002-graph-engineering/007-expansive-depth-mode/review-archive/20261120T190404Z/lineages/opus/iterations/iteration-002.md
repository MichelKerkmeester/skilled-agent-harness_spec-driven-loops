# Iteration 002 - Frontier node F-1-004: correctness

## Dispatcher

- Lineage: opus (fan-out), iteration 2 of 24, dimension correctness, frontier node F-1-004 (depth 1 of 3)
- Stop check before dispatch: convergence.cjs returned CONTINUE (noStopCandidate)
- Sources read: config, registry (activeNodeId F-1-004), strategy; steer.md absent

## Dimension

Correctness of the operator command surface for `/deep:review` and `/deep:research`: the flag table, `--extend`, `--depth-mode=expansive`, the frontier cap flags, setup resolution and the YAML steps that run them, checked against the code they describe.

## Files Reviewed

- `.skilled/commands/deep/review.md:1-140` (argument hint, mode routing, Workflow Flag Surface)
- `.skilled/commands/deep/research.md:3,41-43,107-117` (parity of the same flags)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:39-47,79-86,129-138,245-253,444`
- `.skilled/commands/deep/assets/deep-review.yaml:311-333,413-430,514-623,926-973`
- `.skilled/commands/deep/assets/deep-research.yaml:68-77,334-348,431-432,486-514`
- Context: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224-1237`, `convergence.cjs:1165-1184`, `fanout-run.cjs:370-389`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The review presentation still counts the four canonical dimensions in the expansive budget and node universe after the universe was narrowed** -- .skilled/commands/deep/assets/deep-review-presentation.txt:83 -- The `maxIterations` row says the derived budget uses "c the four canonical dimensions plus any custom name", and `:444` says "under `--depth-mode=expansive` a frontier node needs evidence for those four plus any custom names". The code builds the universe without traceability when the configured `reviewDimensions` list leaves it out (`reduce-state.cjs:1225-1227`), and `review.md:100` plus the YAML `step_frontier_budget` note (`deep-review.yaml:958-961`) already say "less traceability". The last two commits in the range (`edf0ed89`, `de32abbb`) aligned other docs to the narrowed universe and missed these two presentation lines.
   - Finding class: cross-consumer
   - Scope proof: `grep -n "four canonical" .skilled/commands/deep/assets/deep-review-presentation.txt` lists `:83` and `:444` as the only stale statements; review.md and the YAML carry the narrowed wording.
   - Affected surface hints: deep-review-presentation.txt setup table maxIterations row and the dimensions section.
   - Case: an operator runs `--depth-mode=expansive` with dimensions `correctness,performance` and reads that a node needs five dimensions and a budget sized by five; the code sizes and closes nodes on four (correctness, security, maintainability, performance).

2. **The `--extend` warning names only `all_dimensions_clean`, but an expansive run whose frontier drained re-stops at once on `frontier_drained` too** -- .skilled/commands/deep/assets/deep-review.yaml:599 -- The extension warning text and the `--extend` row (`review.md:116`) explain the immediate re-stop only through `all_dimensions_clean`. An expansive run completes when every node is closed and one is answered; extending it leaves that frontier unchanged, so `convergence.cjs:1169-1183` forms the `frontier_drained` hard-stop candidate on the first check and the extension spends nothing. The operator is told the wrong cause and has no hint that a drained frontier, not dimension coverage, is what stops it.
   - Finding class: instance-only
   - Scope proof: the warning is built in one place (`deep-review.yaml:595-602`); research has its own inbox-based wording.
   - Affected surface hints: deep-review.yaml step_extend_completed_run warning; review.md `--extend` row.
   - Case: `/deep:review :auto --extend=4` on a completed `--depth-mode=expansive` run created with the default stop policy and convergence mode.

## Traceability Checks

No protocol run this iteration (correctness pass on this node).

## Integration Evidence

- `fanout-run.cjs:378-389` sizes a lineage budget with `expansiveBudget` and no `dimensions` argument, so D defaults to four; `review.md:100` states D is fixed at the canonical four for a lineage. Consistent.
- Both commands list `--frontier-max-depth`, `--frontier-max-nodes` and `--extend` in the argument hint (`review.md:3`, `research.md:3`) and refuse the caps and `--extend` with fan-out before spawn (`deep-review.yaml:311-333`, `deep-research.yaml:334-348`). Parity holds.

## Edge Cases

- The extension node script treats an unexpanded `{extend_minutes}` placeholder as unset (`deep-review.yaml:538,555`), so an absent flag never reaches the config as text.
- `mktemp -d "${TMPDIR:-/tmp}/...XXXXXX"` in the extend step works on BSD and GNU mktemp.

## Confirmed-Clean Surfaces

- Budget formula in `review.md:100` matches `frontier-admit.cjs:448-455` (floor = configured default, ceiling 24, `2 x D x (S + maxDepth - 1)`).
- Preflight usage errors for the cap flags name the flag and the rule (`deep-review.yaml:426`), mirrored in research (`deep-research.yaml:432`).
- `--extend` arithmetic: `newMaxIterations = distinct iteration count + N`, duration `max(prior, elapsed) + M` (`deep-review.yaml:551-565`), matching `review.md:116-117`.

## Ruled Out

- Lineage default budget mismatch (12 native, 7 CLI): code at `fanout-run.cjs:386,720` matches the doc.
- Extend arithmetic double-counting redispatched runs: it counts distinct iteration numbers.

## Operator Focus Coverage

- Overengineering: the `--depth-mode` flag cell in `review.md:100` is one table cell of roughly 600 words that restates the budget formula, band split, caps, admission order and stop rules also stated in the presentation and YAML. Carried to this node's maintainability visit.
- Operator UX: finding 2 (wrong cause in the extension warning); the cap flags have clear usage-error ids.
- Cross-CLI parity: research and review flag tables, hints and fan-out refusals match.

## Next Focus

- Dimension: correctness
- Focus area: frontier node F-1-006 (skill docs, playbooks, catalogs, agent mirrors), per registry rotation
- Reason: registry.frontier active node rotation
- Rotation status: F-1-002 and F-1-004 have correctness covered
- Required evidence: file:line for every doc claim checked against code

Review verdict: PASS
