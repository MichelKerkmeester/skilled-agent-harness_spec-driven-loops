# Deep Review — Iteration 004

**Dimension**: security
**Scope**: all changed .cjs (cli dispatch, recursion guard, sandbox, temp/atomic, secrets, injection)
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only)
**Raw output**: /tmp/dr-r4.out

## Findings

- **[P1] R4-1** `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:320`
  - Issue: cli-opencode is spawned with --dangerously-skip-permissions and the lineage write boundary is prompt-enforced only
  - Impact: a compromised or prompt-injected executor can write outside lineageDir
  - Fix: enforce the boundary with a sandbox/temp worktree or the permissions-matrix, or fail closed
  - Note: PRE-EXISTING (not introduced this session); governed by cli-opencode RM-8 four-layer mitigation
- **[P1] R4-2** `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:452`
  - Issue: subprocess dispatch builds a recursion-stack env but never calls the recursion guard before spawning
  - Impact: same-kind recursive CLI fanout can still start, enabling runaway nested dispatch / resource exhaustion
  - Fix: call validateExecutorDispatchAllowed before spawn and reject/log blocked lineages
  - Note: INTRODUCED this session (the env-stamp was added but the enforcement call was not)
- **[P2] R4-3** `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:397`
  - Issue: baseArtifactDir is accepted raw and used for artifact/log/summary writes
  - Impact: crafted absolute or traversal paths can move fanout artifacts outside the intended spec root
  - Fix: resolve and constrain baseArtifactDir to the expected artifact root with realpath/path-relative checks
  - Note: PRE-EXISTING
- **[P2] R4-4** `.opencode/skills/deep-context/scripts/reduce-state.cjs:202`
  - Issue: corrupt JSONL warnings persist raw line prefixes
  - Impact: malformed state containing credentials can be copied into registries/stdout
  - Fix: store line number, hash, and parse error only, or redact secret patterns before persistence
- **[P2] R4-5** `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:150`
  - Issue: corrupt JSONL warnings persist raw line prefixes
  - Impact: malformed state containing credentials can be copied into generated registry output
  - Fix: store line number, hash, and parse error only, or redact before persistence
- **[P2] R4-6** `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:192`
  - Issue: corrupt journal parse warnings print raw line prefixes to stderr
  - Impact: credentials embedded in malformed JSONL can leak into logs
  - Fix: omit raw content or redact before logging
