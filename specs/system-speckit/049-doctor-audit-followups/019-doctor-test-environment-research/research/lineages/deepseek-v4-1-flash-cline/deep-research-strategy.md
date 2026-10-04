# Deep Research Strategy — fanout-deepseek-v4-1-flash-cline

## Research Topic
Research connected contract gaps and a persistent local test environment for doctor commands: corpus-pollution semantics in `/doctor:speckit`; unknown-flag handling in `/doctor:mcp`; a long-lived `/doctor:update` worktree with representative unit classifications; and exact doctor manual-playbook changes for reuse of that environment.

## Known Context
- Target packet: `specs/system-speckit/049-doctor-audit-followups/019-doctor-test-environment-research`. `resource-map.md` was absent at initialization; the coverage gate was skipped.
- The lineage directory is the complete write surface. Source, packet, playbook and Git data were read-only. No checkout, tag creation, updater mutation, test run, or repo tooling write was performed and no doctor command was executed.
- Local release tags `v4.0.0.0`, `v4.0.0.1`, `v4.0.0.2` exist in this checkout. The Barter snapshot is absent, so its exact file overlap is UNKNOWN.
- Execution mode: this session was the executor for every iteration; iterations ran inline and wrote directly into the lineage.

## Key Questions (remaining)
- [x] What should `/doctor:speckit` do with non-zero phraseQuality diagnostics, given lookup ranking, and how should DOC-349/DOC-350 and tests change?
- [x] What unknown-flag error should `/doctor:mcp` add, and how do the other doctor command contracts handle unknown arguments today?
- [x] How can a long-lived local `/doctor:update` environment exercise customized, conflict, removed and local-only units across record-base/check/align/apply/rollback, including release-tag and worktree constraints?
- [x] Which other doctor-command playbooks should reuse that environment, which exact scenario files change, and what new scenarios are added?

## Answered Questions
- **Speckit quality:** Make phrase quality an advisory outside `staleness_signals`/`severity_max`; keep counts and share; align the status enum; DOC-349 becomes fresh-index `STATUS_OK`, DOC-350 keeps stale-only severity; add doctor contract tests.
- **MCP flags:** Add a dedicated `unknown_flag` rejection for a flag in neither schema, before YAML load, naming the sub-action and valid flags; keep `cross_sub_action_flag_injection`; add DOC-379.
- **Updater environment:** Numbered named worktree at `v4.0.0.0` with `--no-provision`, current updater overlay, four committed fixtures (webflow edit, Barter sk-git + conflict anchor, web-dev packet, local prerelease tag deleting obsidian), offline `record-base` with `--trust-release`, apply reset via `rollback --run`.
- **Shared suites:** Six commands gain; DOC-370 stays on a disposable clone; 23 scenario files + 4 READMEs change; new DOC-379 and DOC-380.

## What Worked
- Direct source inspection of the doctor contracts, the retrieval scoring path, the release-update engine and the sk-git allocator produced line-level evidence for every claim.
- Read-only Git tree/diff/tag comparisons pinned the fixture inputs (identical webflow SKILL.md, release-changed changelogs and sk-git paths, no stock unit removals).
- Per-file grep of the 34 doctor scenarios made the playbook surface exact rather than estimated.

## What Failed
- Nothing. No approach was exhausted; the only gap is the absent Barter snapshot, which is an external input.

## Exhausted Approaches
(none)

## Ruled-Out Directions
- Raw share threshold for phrase quality; bulk corpus clean-up as a gate; generator filtering of flagged phrases.
- Stripping sk-code modes to create fixture units; detached HEAD for the long-lived fixture; linked-worktree use for `/doctor:git` hooks scenarios.

## Next Focus
Synthesis complete. The configured three-iteration cap was reached with all four questions answered; no additional iteration is planned. The terminal synthesis record carries `stopReason=maxIterationsReached`.

## Research Boundaries
- Maximum iterations: 3; convergence threshold: 0.05 (telemetry only); stop policy: max-iterations.
- Executor: inline in this session; no nested iteration dispatch.
- Write surface: this lineage directory only.
