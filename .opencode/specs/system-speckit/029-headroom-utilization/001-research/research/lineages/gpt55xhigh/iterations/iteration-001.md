# Iteration 001: Headroom Surface Inventory

## Focus

Inventory Headroom's usable surfaces before judging fit.

## Evidence

- Headroom's top-level inventory names eight public surfaces: library, proxy, agent wrap, MCP server, cross-agent memory, `headroom learn`, output token reduction, and CCR retrieval. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:49]
- The local-first architecture diagram places CacheAligner, ContentRouter, SmartCrusher, CodeCompressor, Kompress, CCR, memory, learn, and MCP inside a local Headroom box before provider dispatch. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:60]
- Headroom documents multiple integration modes beyond wrappers: Python/TypeScript library, SDK wrappers, LiteLLM, LangChain, Agno, ASGI middleware, SharedContext, and MCP clients. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:252]
- The pipeline internals section says one lifecycle spans `compress()`, SDK, and proxy: setup, input received, input routed, input compressed, input remembered, pre-send, post-send, response received. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:285]
- `compress()` is a direct library surface with explicit config for system/user messages, recent-message protection, and target ratio. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:77]
- The MCP server exposes `headroom_compress`, `headroom_retrieve`, and `headroom_stats`, with optional `headroom_read` behind `HEADROOM_MCP_READ`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:1]
- CCR can inject retrieval tools and system instructions when compressed content markers are present. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/tool_injection.py:1]
- Output shaping is request-side mutation: verbosity steering appends a block to the system prompt and effort routing lowers explicit thinking effort on mechanical continuations. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:1]

## Findings

The relevant surfaces are:

1. `compress()` library.
2. OpenAI/Anthropic-compatible proxy.
3. MCP server.
4. `headroom wrap`.
5. `headroom learn`.
6. Bundled RTK / optional lean-ctx shell-output path.
7. CacheAligner.
8. Output-shaper.
9. Cross-agent SQLite/vector memory.

New information ratio: 1.00.

## Dead Ends / Ruled Out

- Treating Headroom as only a proxy is wrong; the library and MCP surfaces have much lower blast radius.
- Treating CCR as purely lossless is too broad; reversible retrieval exists, but the model must choose to retrieve missing originals.
