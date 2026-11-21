# Iteration 005 - Frontier node F-1-004: security

## Dispatcher

- Lineage: opus (fan-out), iteration 5 of 24, dimension security, frontier node F-1-004 (depth 1 of 3)
- Stop check before dispatch: CONTINUE (noStopCandidate)
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Security of the command surface: every shell command the range added to `deep-review.yaml` and `deep-research.yaml`, checked for operator or leaf text that reaches a shell argument unvalidated, plus the dry-run boundaries of the new state-mutating steps.

## Files Reviewed

- `git diff 21c4b325b5a..de32abbb74d -- .skilled/commands/deep/assets/deep-review.yaml .skilled/commands/deep/assets/deep-research.yaml`, every added line holding a `{placeholder}` inside a command, bash or node string
- `.skilled/commands/deep/assets/deep-review.yaml:311-411` (fan-out refusals, seed, spawn), `:417-427` (preflight), `:514-623` (extend), `:926-973` (seed, budget), `:1714-1722` (activate), `:2039-2056` (admit)
- `.skilled/commands/deep/assets/deep-research.yaml` added commands at the seed, budget, stuck-close, admit and graph steps

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

No protocol run this iteration (security pass).

## Integration Evidence

- `step_fanout_spawn` writes the focus, target and fan-out config to files with the file-write tool and passes only the file paths to `fanout-run.cjs` (`deep-review.yaml:368-374,395-399`), so operator text never enters a shell argument there.
- The research free-text recipe writes the topic to a pattern file and calls `rg -f` (`deep-research.yaml`, `pattern_file`), the same file-not-argument rule.

## Edge Cases

- `{extend}` and `{extend_minutes}` are interpolated inside double quotes in the extend step (`deep-review.yaml:604`). That is safe only because `step_preflight_contract` validates both as digit strings first (`:425`), and phase order runs preflight before `step_extend_completed_run`. The node script re-checks with the same regex (`:535-540`). Safe today; the safety depends on step order.
- `{optional_claude_config_dir_flag}` carries an operator `--config-dir=PATH` into a shell argument. It is the operator's own value in the operator's own shell, so it is not a trust boundary.
- Node ids (`{active_frontier_node}`, `{active_frontier_node_id}`) come from the registry, which only holds ids `frontier-admit.cjs` minted in the `F-<d>-<NNN>` form (`frontier-admit.cjs:751`).

## Confirmed-Clean Surfaces

- Every new state-mutating step carries a `dry_run_boundary`: fan-out seed (`:337`), config-time seed (`:930`), budget (`:957`), seed reduce (`:1092`), activate (`:1717`), admit (`:2042`), extend (`:517`), snapshot (`:627`).
- The fan-out refusals for `--extend` and the cap flags halt before spawn with named usage errors (`:311-333`).

## Ruled Out

- Shell injection through review focus, review target or fan-out config: passed by file since this range.
- Shell injection through `--extend`/`--extend-minutes`: digit-validated before the step.
- Shell injection through frontier node ids: minted by the engine.

## Operator Focus Coverage

- Overengineering: none in the shell surface; each new step is one command.
- Operator UX: usage-error ids (`extend-with-fanout`, `frontier-caps-with-fanout`, `frontier-cap-value`, `frontier-cap-without-expansive`) are stable and greppable.
- Cross-CLI and OS parity: commands use POSIX `sh` constructs, `mktemp` with an explicit template and `${TMPDIR:-/tmp}`, which behave the same under BSD and GNU userlands.

## Next Focus

- Dimension: security
- Focus area: F-1-006 security per registry rotation (agent permissions in mirrors, playbook commands that write outside a sandbox)
- Reason: registry.frontier rotation
- Rotation status: F-1-004 has correctness and security covered
- Required evidence: file:line

Review verdict: PASS
