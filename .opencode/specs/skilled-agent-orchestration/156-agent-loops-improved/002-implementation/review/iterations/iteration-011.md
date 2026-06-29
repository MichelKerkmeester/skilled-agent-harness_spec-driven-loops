# Dimension

security: path-traversal & state-dir resolution, command injection in spawned codex/opencode

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:1` - full file, CLI bootstrap, namespace validation, graph DB access, snapshot writes.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:1` - full file, pool settlement, ledger append, retry/orphan handling.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1` - full file, fanout config parsing, base artifact resolution, lineage state dirs, spawned CLI argv/env.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:1` - full file, stdout recovery, state log and iteration file writes.
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:1` - full file, namespace validation and graph status reads.
- `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:1` - full file, namespace validation, event file reads, graph writes.
- Coupled surfaces inspected: `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:83`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:34`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:542`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:202`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:475`, `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:103`, `.opencode/commands/deep/assets/deep_context_auto.yaml:461`.

# Findings by Severity

## P0

None.

## P1

### R11-P1-001 - Same-kind fanout replicas still share real CLI homes and lockfiles

- Evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1038`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1045`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1048`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:86`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:552`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:475`.
- Why: `fanout-run.cjs` creates per-lineage `.executor-state` directories and passes `SPECKIT_<KIND>_STATE_DIR`, but its own comment says native CLIs read `CODEX_HOME`, `OPENCODE_HOME`, or Claude home envs instead. `buildExecutorDispatchEnv()` preserves parent `CODEX_`, `OPENCODE_`, and `CLAUDE_` variables, so same-kind replicas can still share the real CLI state directory and lockfiles under normal `count > 1` fanout. The tests assert distinct `SPECKIT_CODEX_STATE_DIR` values, not distinct effective CLI homes.
- Suggested fix direction: Either give each spawned CLI an effective per-lineage home/state root that the CLI actually honors, or serialize same-kind replicas behind a per-kind lock when real home relocation is not safe. Add a regression that checks the effective `CODEX_HOME`/`OPENCODE_HOME`/Claude home behavior or proves same-kind concurrent dispatch is blocked.

### R11-P1-002 - `baseArtifactDir` can relocate fanout artifacts outside the canonical review tree

- Evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:866`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:891`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1010`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:615`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:831`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:837`.
- Why: `baseArtifactDir` rejects only literal `..` segments. Absolute paths without `..` pass, and the script derives `lineagesDir`, ledger, summary, checkpoint, state dirs, and log writes from that value. `buildLoopPrompt()` then tells child agents to write all outputs to the resulting lineage directory, while the opencode branch runs with `--dangerously-skip-permissions`. A malformed or injected base artifact path can therefore move fanout state and child writes outside the expected packet/artifact root.
- Suggested fix direction: Resolve `baseArtifactDir` to an absolute path and require it to stay under the canonical artifact root for the resolved spec folder or another explicit allowlisted root. Reject null bytes, traversal, absolute escapes, and symlink escapes before creating directories or spawning child CLIs.

### R11-P1-003 - `cli-claude-code` `configDir` accepts arbitrary traversal/absolute paths into `CLAUDE_CONFIG_DIR`

- Evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:37`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:103`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:242`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:361`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1049`.
- Why: `configDir` is validated only as a non-empty string. `fanout-run.cjs` expands `~`/`~/` but otherwise passes the value unchanged into `CLAUDE_CONFIG_DIR`. A fanout config such as `../../somewhere` or `/tmp/attacker-claude` passes validation and steers the spawned Claude process at an arbitrary config root, which can switch credentials/account state or load attacker-controlled config.
- Suggested fix direction: Restrict `configDir` to a safe home-relative account directory pattern, or resolve it and require it to stay inside `HOME` or an explicit allowlist. Reject `..`, null bytes, and absolute escapes. Add negative tests for traversal and absolute paths.

## P2

None.

# Verdict

CONDITIONAL

# Notes

No shell-command injection finding survived review: spawned CLIs use `spawn()` with argv arrays, lineage labels are directory-safe, and `specFolder`/`sessionId` pass `validateNamespaceValue()`. The remaining issues are path/state isolation defects: the effective CLI homes are not isolated, and two accepted path inputs can steer spawned CLI state or artifact writes outside the intended boundary.
