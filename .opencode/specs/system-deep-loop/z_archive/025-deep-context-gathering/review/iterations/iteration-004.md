# Iteration 4: context-pool

**Dimensions**: correctness, consistency
**Files reviewed**: .opencode/commands/deep/start-context-loop.md
**Findings**: P0=0 P1=2 P2=2

## Findings
### [P1] Default path still described as heterogeneous/multi-model (S04-001)
- **Dimension**: consistency | **Class**: cross-consumer
- **Location**: `.opencode/commands/deep/start-context-loop.md:270`
- **Evidence**: The setup policy says no explicit pool defaults to the native-only pool of 2 @deep-context seats at line 143, but the command still says it gathers "multi-model" context and that each iteration is a "parallel heterogeneous sweep" at line 270; the same stale default framing also appears in the frontmatter description at line 2 and purpose text at line 302.
- **Recommendation**: Rephrase global/default prose to "shared-scope parallel pool, native-only by default" and reserve "heterogeneous"/"multi-model" wording for explicit custom CLI or combined pools.
- **Scope proof**: Bounded to start-context-loop.md; consulted the referenced default config only to confirm the stated native-only default.

### [P1] Reply example includes a convergence value that setup never asks for or parses (S04-002)
- **Dimension**: correctness | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-context-loop.md:238`
- **Evidence**: The compact reply example includes `0.10` before the pool choice (`"realtime client reconnection, B, A, 8, 0.10, A"`), but the prompt only asks Q3 for max iterations and Q-Pool for the executor pool, while the parse step says `convergenceThreshold` comes only from a flag or the default at line 248.
- **Recommendation**: Either remove `0.10` from the compact reply example or add an explicit convergence-threshold question and parse rule before Q-Pool.
- **Scope proof**: Checked the setup prompt, reply examples, and parse/store bullets within start-context-loop.md.

### [P2] Argument hint omits supported --reasoning-effort flag (S04-003)
- **Dimension**: completeness | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-context-loop.md:3`
- **Evidence**: The command argument hint lists `--model`, `--prompt-framework`, and `--label` for `--executor`, but the parser contract at line 166 supports `--reasoning-effort` and the custom heterogeneous example uses `--reasoning-effort=high` at line 440.
- **Recommendation**: Add `[--reasoning-effort=Y]` to the frontmatter argument-hint executor group.
- **Scope proof**: Compared only the frontmatter hint, parser contract, and local examples in start-context-loop.md.

### [P2] PRE-BOUND concurrency label still says CLI-pool-only (S04-004)
- **Dimension**: consistency | **Class**: instance-only
- **Location**: `.opencode/commands/deep/start-context-loop.md:123`
- **Evidence**: The PRE-BOUND schema labels `concurrency` as a `CLI-pool concurrency cap`, but the default pool is native-only and the setup table/policy apply concurrency to the shared executor pool generally.
- **Recommendation**: Rename the comment to `executor-pool concurrency cap` or `max parallel seats in the shared-scope pool`.
- **Scope proof**: Checked the PRE-BOUND marker and default-pool policy in start-context-loop.md; no support-file findings were filed.

## Status
complete
