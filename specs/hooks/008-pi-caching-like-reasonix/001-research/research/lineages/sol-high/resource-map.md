# SOL High Research Resource Map

## Local Inputs

- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md` — uncited claim source.
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/001-research/spec.md` — research questions and acceptance criteria.

## Provider Primary Sources

- `https://api-docs.deepseek.com/guides/kv_cache` — automatic prefix caching, persistence, usage fields, best-effort limits.
- `https://api-docs.deepseek.com/news/news0802/` — original context-caching announcement, isolation, pricing relationship.
- `https://platform.claude.com/docs/en/build-with-claude/prompt-caching` — cache-control modes, TTLs, ordering, lookback, concurrency, pricing.

## Reasonix Project Sources

- `https://github.com/esengine/DeepSeek-Reasonix` — current README and published workload claim.
- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md` — historical cache-first invariants.
- `https://github.com/esengine/DeepSeek-Reasonix/blob/main-v2/docs/SPEC.md` — current provider/plugin/session direction.
- `https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/reasonix.md` — DeepSeek-curated integration description.

## Pi Project Sources

- `https://pi.dev/docs/latest` — core design and customization surface.
- `https://pi.dev/docs/latest/usage` — intentional core omissions.
- `https://pi.dev/docs/latest/models` — cache/provider compatibility flags.
- `https://pi.dev/docs/latest/extensions` — extension hooks and prompt/provider surface.
- `https://pi.dev/docs/latest/sessions` — persistence, branching, rewind.
- `https://pi.dev/docs/latest/session-format` — session data model and APIs.
- `https://pi.dev/docs/latest/compaction` — context lifecycle and cache-aware summarization.
- `https://pi.dev/docs/latest/rpc` — normalized usage and cost telemetry.

## Community Package Sources

- `https://pi.dev/packages/pi-cache-optimizer` — metadata, behavior, safety, compatibility.
- `https://github.com/jiangge/pi-cache-optimizer` — source repository and release history.
- `https://pi.dev/packages/pi-mcp-adapter` — MCP package capability evidence.

## Coverage

- RQ1 Reasonix claims: covered.
- RQ2 Pi caching and optimizer existence: covered.
- RQ3 alleged feature gaps: covered.
- RQ4 feasibility, risk, effort, and proof plan: covered.
