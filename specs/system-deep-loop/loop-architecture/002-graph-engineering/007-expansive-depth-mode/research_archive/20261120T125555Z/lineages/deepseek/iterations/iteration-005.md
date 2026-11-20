# Iteration 5: Frontier node F-1-004 (second pass) — single-executor parity and the collapse

## Focus

Frontier node F-1-004, second pass: verify the single-executor dispatch path against the fan-out adapter table, and confirm the six duplicated YAML branches can collapse into one.

## Findings

1. **The claude single-executor path disagrees with itself by loop type: a review hardcodes `--permission-mode acceptEdits`, a research run resolves the mode from `sandboxMode`.** `dispatch-iteration.cjs:373` passes the literal `acceptEdits` in the review branch, while the research branch at `:423` calls `resolveClaudePermissionMode(executor.sandboxMode)`. The fan-out adapter maps `danger-full-access` to `bypassPermissions` for both loops, and `fanout-run.cjs:1255` already warns that acceptEdits cannot run Bash non-interactively, so a `--sandbox-mode=danger-full-access` claude review silently cannot run the append gateway. One concrete change: replace the literal with `resolveClaudePermissionMode(executor.sandboxMode)` in the review branch. Value: the same flag behaves the same way in both loops. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:373] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:423] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1255]

2. **The six-branch collapse is verified: `dispatch-iteration.cjs` already reads `--executor` as a value and validates it against `EXECUTOR_KINDS`.** `:55-61` parses the raw flag and refuses an unknown kind before any module loads; `:214-229` adds only the claude `--claude-config-dir` and dsh `--spec-folder` constraints. So one `if_cli` branch with `--executor "{config.executor.kind}"` covers claude-code, cursor, devin, pi, opencode and codex in both YAMLs; the per-kind notes (`deep-research.yaml:1772-1776`, `:1819-1824`) restate the `EXECUTOR_KIND_FLAG_SUPPORT` matrix and can be deleted with them. Value: roughly 60 lines plus 40 lines of notes removed per YAML, one place to add the next kind. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:55] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:214] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1772] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1819]

3. **The Flash top-tier effort pin is implemented twice, verbatim.** `executor-config.ts:328-337` exports `isFlashMaxPinnedModel` and `pinReasoningEffortForModel`, and `fanout-run.cjs:2650-2668` re-implements both with a "Mirrors …" comment so the synchronous builders do not wait on the TS loader. `fanout-run.cjs` already imports several helpers from `executor-config.ts` at load time, so the copy can be replaced by the import. One concrete change: import the two functions and delete the local pair. Value: one rule for which models are pinned to `max`. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:328] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2650]

4. **`runLineageBuiltin` forces `workspace-write` for cursor, devin and pi, so a configured `read-only` request is silently upgraded to a writable run.** `dispatch-iteration.cjs:459-468` sets `const sandboxMode = 'workspace-write'` and passes it to `buildLineageCommand` for all three kinds, discarding `context.sandboxMode`. The fan-out path resolves the requested sandbox and fails closed when a kind cannot honor it (`fanout-run.cjs:3963-3966`, `:2501-2506`). One concrete change: pass the configured sandbox and let `buildLineageCommand` refuse an unhonorable request, as it already does for `cli-opencode`. Value: a confinement request is never silently widened. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:459] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2501]

## Ruled Out

- Claiming the six YAML branches need different arguments: only claude (config dir) and dsh (spec folder) add a flag, and both are already optional in the shared script.
- Treating the forced `workspace-write` as a bug in the builder: the builder honors what it is given; the silent narrowing happens in the caller.

## Dead Ends

- Looking for a review-specific claude builder in the fan-out path: there is one builder for both loops, which is exactly why the single-executor branch diverged unnoticed.

## Edge Cases

- Ambiguous input: "failure classes" could mean the summary's counts or the per-kind tolerances. Read as both; the summary counts are already uniform, and the tolerances are the adapter-table finding from iteration 2.
- Contradictory evidence: none.
- Missing dependencies: no live claude review run was dispatched; the mismatch is read from the two argument builders.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:55,214,373,423,459`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1255,2501,2650,3963`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:328`
- `.skilled/commands/deep/assets/deep-research.yaml:1772,1819`

## Assessment

- New information ratio: 1.0
- Questions addressed: cross-CLI parity (frontier node F-1-004), second pass
- Questions answered: the parity node is answered: permissions diverge by loop type, the YAML duplicates are collapsible, the effort pin is duplicated, and the write sandbox is silently widened for three kinds.

## Reflection

- What worked and why: comparing the two claude branches line by line found the permission mismatch, which no matrix could reveal because both branches claim to honor `sandboxMode`.
- What did not work and why: the failure-class pass found no new class beyond iteration 2, so the finding was folded into the adapter-table recommendation instead of restated.
- What I would do differently: diff the single-executor and fan-out builders for every kind, not only claude; the same drift may exist elsewhere.

## Recommended Next Focus

Close F-1-004 as answered. Next: F-1-006 receipt verification, then the design questions and restraint pass.
