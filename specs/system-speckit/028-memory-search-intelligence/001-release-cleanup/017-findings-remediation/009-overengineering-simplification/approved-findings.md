# Approved finding set

3 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-01:F19` | CAT-6 | `sed -n '54,202p' .opencode/skills/sk-git/SKILL.md` | Lines 54-202 = 149 lines of Python defining 5 intents (WORKSPACE_SETUP, COMMIT, FINISH, GITKRAKEN_MCP, SHARED_PATTERNS) with weighted scoring and conditional loading. |
| `fanout:SOL-04` | CAT-6 | `cat .opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts` | Stub is 12 lines: `isSpeckitMetricsEnabled()` returns `false`, `speckitMetrics` has no-op `incrementCounter`/`recordHistogram`. `grep -rl "isSpeckitMetricsEnabled\ |
| `fanout:SOL-05` | CAT-6 | `wc -l .opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts .opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adap` | 1241 + 3426 = 4667 lines exactly; `grep -rl "resume-adapter\ |
