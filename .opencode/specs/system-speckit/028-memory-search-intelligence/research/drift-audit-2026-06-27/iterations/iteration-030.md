# Iteration 30 — mimo

**Angle:** Cross-check whether the CLI daemon front doors (.opencode/bin/spec-memory.cjs, code-index.cjs, skill-advisor.cjs) pass these undocumented envs to the daemon child, or whether CHILD_ENV_ALLOWLIST blocks them silently

**Findings:** 0 (PARSE FAILED — raw output captured)

```
Now let me understand the architecture. The key question is about the CLI front doors (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) which are distinct from the launchers. But let me also check the launchers' allowlist/blocklist patterns to find undocumented envs that could be silently dropped.

Let me check what env vars the skill-advisor daemon actually reads but that might not be in the allowlist:
Now let me check whether any of the NODE_* envs read by the skill-advisor daemon are blocked in the code-index launcher's approach:

```
