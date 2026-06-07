# Deep Review — Iteration 001

**Dimension**: correctness
**Scope**: deep-context: reduce-state.cjs, loop-lock.cjs
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only)
**Raw output**: /tmp/dr-r1.out

## Findings

- **[P0] R1-1** `.opencode/skills/deep-context/scripts/reduce-state.cjs:661`
  - Issue: passes 'context' into resolveArtifactRoot(), whose mode tables only define research/review; child-phase specs throw ERR_INVALID_ARG_TYPE before reducing
  - Impact: deep-context cannot resolve/reduce child-phase artifact directories on resume/existing content
  - Fix: add 'context' support to resolveArtifactRoot mode tables (MODE_CONFIG_FILE/MODE_STATE_FILE) or use a context-specific resolver
- **[P1] R1-2** `.opencode/skills/deep-context/scripts/loop-lock.cjs:70`
  - Issue: omitted --owner falls back to the short-lived wrapper process pid, which exits immediately after acquire
  - Impact: runtime stale detection treats the lock owner as dead, so a concurrent session can reclaim the lock and race the original writer
  - Fix: require a host-provided live owner for acquire, or document the advisory (not hard-mutex) semantics for transient CLI owners
