# Iteration 006 - Frontier node F-1-006: security

## Dispatcher

- Lineage: opus (fan-out), iteration 6 of 24, dimension security, frontier node F-1-006 (depth 1 of 3)
- Stop check before dispatch: CONTINUE (noStopCandidate)
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Security of the docs, playbooks and agent definitions: tool permissions in the canonical agents and mirrors, and whether the 37 playbook scenarios this range added instruct destructive, unsandboxed or permission-bypassing commands.

## Files Reviewed

- `.skilled/agents/deep-review.md` and `.skilled/agents/deep-research.md` frontmatter `permission:` blocks; `.claude/agents/deep-review.md` and `.claude/agents/deep-research.md` `tools:` lines; `.codex/agents/deep-review.toml:5` (`sandbox_mode`)
- All 37 playbook files the range added under `deep-review/manual-testing-playbook`, `deep-research/manual-testing-playbook` and `runtime/manual-testing-playbook` (pattern scan)
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-expansive-review-two-node-frontier.md:25-60` (full read)
- `.skilled/commands/deep/assets/deep-review.yaml:926-1135` (where confirm mode pauses during init)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Both live two-node frontier playbooks tell the operator to wait for a confirm-mode stop before the frontier seed step, and the workflow has no such stop** -- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-expansive-review-two-node-frontier.md:49 -- Step 4 says "When the orchestrator reports the config written and stops before the frontier seed step", and step 5 then has the operator hand-write `frontier-seed.json` and "tell the orchestrator to seed that file unchanged". Under `:confirm` the only init pause is `gate_init_approval` (`deep-review.yaml:1104-1105`), which runs after `step_frontier_seed` (`:926-951`), and `step_frontier_seed` instructs the orchestrator to decompose the target and write the seed file itself. So the scenario passes only if the orchestrating model deviates from the workflow; a faithful run seeds its own sub-targets, and the operator's node questions, the two-node count and the pass criteria no longer apply. The research twin (`deep-research/manual-testing-playbook/entry-points-and-modes/live-expansive-research-two-node-frontier.md:30,49`) carries the same instruction.
   - Finding class: cross-consumer
   - Scope proof: `grep -rn "before the frontier seed\|hold the run before"` over the playbooks returns these two scenarios only; `grep -n "applies_to: confirm"` in the review YAML shows no gate between `step_create_config` and `step_frontier_seed`.
   - Affected surface hints: deep-review and deep-research live two-node frontier playbook scenarios; optionally a confirm gate before seeding in both YAMLs.
   - Case: an operator follows the playbook under `:confirm`; the orchestrator writes its own three to eight sub-targets and proceeds to the init approval gate, so step 5 has nothing to wait for.

## Traceability Checks

- `playbook_capability` (overlay): partial. The two live frontier scenarios depend on a pause the workflow does not provide (finding 1); the line-count claim `wc -l ... append-state-record.cjs` prints `121` holds today.

## Integration Evidence

- Agent permissions are unchanged in the range: the diffs of all ten agent files touch only body text. `deep-review` keeps `webfetch: deny`, `task: deny`; `.claude/agents/deep-review.md` lists `Read, Write, Edit, Bash, Grep, Glob`; `.codex/agents/deep-review.toml:5` keeps `sandbox_mode = "workspace-write"`.

## Edge Cases

- Seven of the new playbooks use `jq` with no stated prerequisite. It is a dependency, not a security issue; recorded for the maintainability visit.

## Confirmed-Clean Surfaces

- No new playbook contains `rm -rf`, `rm -f`, `git reset|checkout|push|clean`, `sudo`, `chmod`, `--dangerously*`, `bypassPermissions` or `danger-full-access` (pattern scan over all 37 files returned nothing).
- The live scenarios point every write at a `<fixture>` spec folder rather than a real packet.

## Ruled Out

- Permission widening in agent mirrors: no frontmatter change in range.
- Destructive or permission-bypassing playbook commands: none found.

## Operator Focus Coverage

- Overengineering: none in the permission surface.
- Operator UX: finding 1 makes two live scenarios unrunnable as written.
- Cross-CLI parity: mirror permissions unchanged; `.codex` keeps its workspace-write sandbox.

## Next Focus

- Dimension: traceability
- Focus area: next node per registry rotation (F-1-002 traceability: spec_code and checklist_evidence core protocols against the packet spec)
- Reason: registry.frontier rotation; core protocols not yet recorded in this run
- Rotation status: all three depth-1 nodes have correctness and security covered
- Required evidence: file:line on both spec and code sides

Review verdict: PASS
