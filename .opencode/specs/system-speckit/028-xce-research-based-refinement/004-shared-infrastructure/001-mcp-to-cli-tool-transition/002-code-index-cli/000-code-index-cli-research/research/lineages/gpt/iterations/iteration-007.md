# Iteration 7: Hook Latency and Warm-Only Policy

## Focus

Determine whether a `code-index` CLI can fit session hooks and prompt-time helpers.

## Findings

1. Spec-memory closure measured empty Node p95 at 40.85ms and bridge-require p95 at 46.09ms; this is the best available local baseline for a warm Node CLI wrapper. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:187]
2. Code-index runtime configs already pin `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index`, avoiding macOS socket path limits for warm IPC. [SOURCE: file:.codex/config.toml:92] [SOURCE: file:opencode.json:73]
3. The shared bridge can use Unix socket or `tcp://` style socket paths, with `/tmp` allowed because macOS `sun_path` length can break deep workspace sockets. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:111]
4. `code_graph_status` is the hook-fit command; `code_graph_scan` and `code_graph_apply` should be startup/prewarm/cron/manual because they can scan, verify, mutate, and rollback.

## Sources Consulted

- Spec-memory total risk closure research
- Runtime config files
- Code-index IPC socket server
- Scan/apply handlers from earlier iterations

## Assessment

`newInfoRatio`: 0.55. This mostly transferred measured latency constraints to code-index.

Confidence: medium. The latency numbers are prior-art measurements, not freshly benchmarked for a new `code-index` CLI implementation.

## Reflection

Worked: warm-vs-cold distinction keeps hook guidance realistic.

Failed/ruled out: cold auto-spawn inside prompt-time hooks.

## Recommended Next Focus

Dual-stack coexistence and spawn races.
