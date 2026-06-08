# Review Resource Map - gpt55-5

## Evidence Map

| Finding | Evidence |
|---------|----------|
| F001 | `.opencode/bin/mk-spec-memory-launcher.cjs:469-480`; `.opencode/bin/mk-spec-memory-launcher.cjs:1482-1502` |
| F002 | `.opencode/bin/mk-spec-memory-launcher.cjs:1372-1383`; `.opencode/bin/mk-spec-memory-launcher.cjs:1482-1492`; `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:183-243` |
| F003 | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/spec.md:53-78`; `plan.md:48-49`; `tasks.md:53-67`; `checklist.md:50-64` |
| F004 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-62`; `:69-88` |

## Phase-5 Augmentation

- Novel logic gaps: stale owner-lease reclaim lacks a true exclusive mutation claim; fresh stale-reclaim lacks a live-secondary/adopt-before-reap gate.
- Documentation gaps: packet docs do not describe the concrete review scope.
- Test gaps: live durability suite splits secondary survival and fresh-session reap into separate cases, and helper shell commands interpolate temp paths.
