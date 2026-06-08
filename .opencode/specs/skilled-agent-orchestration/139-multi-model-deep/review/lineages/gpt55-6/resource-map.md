# Review Evidence Resource Map: gpt55-6

## Scope Files

- `.opencode/bin/mk-spec-memory-launcher.cjs` - owner lease, stale reclaim, reap-before-respawn, launch path. Findings: F001, F002.
- `.opencode/bin/lib/model-server-supervision.cjs` - shared liveness and process-tree helpers. No active finding.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` - bridge and deep liveness probe behavior. No active finding.
- `.opencode/bin/lib/launcher-session-proxy.cjs` - reconnecting proxy behavior. No active finding.
- `.opencode/bin/mk-code-index-launcher.cjs` - code-index launcher parity surface. No active finding.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` - live launcher test matrix and shell helper hardening. Finding: F003.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` - release-vs-kill integration contract. No active finding.
- `.opencode/scripts/session-cleanup.sh` - cleanup portability/safety. No active finding.
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` - hygiene enforcement surface. No active finding.
- `.claude/settings.local.json` - Claude hook portability config. No active finding.
- `.codex/hooks.json` - Codex hook portability config. No active finding.
- `.devin/hooks.v1.json` - Devin hook portability config. No active finding.

## Finding Evidence

| Finding | Evidence |
|---------|----------|
| F001 | `.opencode/bin/mk-spec-memory-launcher.cjs:359-374`; `.opencode/bin/mk-spec-memory-launcher.cjs:443-480`; `.opencode/bin/mk-spec-memory-launcher.cjs:1476-1502`; `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311` |
| F002 | `.opencode/bin/mk-spec-memory-launcher.cjs:691-726`; `.opencode/bin/mk-spec-memory-launcher.cjs:1491-1500`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/spec.md:143-145` |
| F003 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-62`; `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:69-88` |

## Phase-5 Augmentation

- Novel logic gaps: stale-owner takeover needs an atomic-claim regression; post-SIGKILL reap needs a still-live regression.
- Untouched entries expected-by-scope: proxy/bridge/model-supervision/hook configs were read and lightly validated but did not receive behavior-deep tests in this max-1 lineage.
- Implementation paths absent from packet resource map: not applicable, because packet 139 had no `resource-map.md` at init.
