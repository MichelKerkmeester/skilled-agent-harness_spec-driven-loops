# Iteration 002: Runtime, Proxy, Wrap, and CLI Fit

## Focus

Evaluate Claude, Codex, OpenCode, and cli-* runtime compatibility.

## Evidence

- Headroom documents `headroom wrap claude|codex|cursor|aider|copilot|opencode`, plus proxy and MCP-native install paths. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:191]
- `headroom wrap` explicitly supports Claude, Codex, and OpenCode in its usage block. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/wrap.py:1]
- The wrapper sets `ENABLE_TOOL_SEARCH` for Claude Code because a custom `ANTHROPIC_BASE_URL` can disable tool deferral if unset. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/wrap.py:137]
- OpenCode support can inject a `headroom` provider, remote MCP server, and native plugin through `OPENCODE_CONFIG_CONTENT`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/providers/opencode/runtime.py:17]
- The OpenCode plugin installs transport interception and exposes `headroom_retrieve`; it also publishes `HEADROOM_ACTIVE`, `HEADROOM_PROXY_URL`, and project identity into shell env. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/plugins/opencode/src/plugin.ts:28]
- The OpenCode transport wraps `fetch`, HTTP, HTTP2, and child-process APIs, routing non-loopback provider traffic through the proxy. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/plugins/opencode/src/transport.ts:112]
- `cli-codex`, `cli-claude-code`, and `cli-opencode` all prohibit self-invocation and define themselves as cross-AI delegation tools. [SOURCE: .opencode/skills/cli-codex/SKILL.md:12] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:12] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:12]
- `cli-opencode` says OpenCode dispatch is useful for full plugin/skill/MCP runtime, but only from external dispatch or explicit parallel-detached cases. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:24]

## Findings

Headroom integrates technically with all three runtimes, but broad wrap/proxy integration is high blast-radius in this stack. The proxy and OpenCode plugin alter provider routing and environment at process scope. That can be useful for isolated evaluation, but it is a poor default under our CLI self-invocation rules and hook-critical prompt routing.

Runtime verdict:

- Claude Code: technically fits, needs shim/opt-in because `ANTHROPIC_BASE_URL` changes runtime behavior.
- Codex: technically fits, needs shim/opt-in; avoid self-invoking `cli-codex` from Codex and avoid altering hook context.
- OpenCode: strongest native Headroom support, but also broadest interception surface.

New information ratio: 0.86.

## Dead Ends / Ruled Out

- Running every cli-* executor through `headroom wrap` by default is too broad.
- Using the proxy as the first adoption path is unnecessary when the library and MCP surfaces can be tested in isolation.
