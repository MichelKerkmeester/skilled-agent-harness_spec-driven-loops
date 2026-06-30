# Iteration 003: Spec Kit Memory MCP Fit

## Focus

Determine whether Headroom can compress or augment Spec Kit Memory without breaking canonical continuity, metadata, or MCP tool contracts.

## Evidence

- Spec Kit canonical saves route continuity into packet docs; `implementation-summary.md` carries `_memory.continuity`, while recovery begins with `handover.md`, then continuity, then canonical docs. [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:317]
- Phase-parent save routing updates `graph-metadata.json` and uses atomic writes for generated metadata. [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:291]
- The canonical save router classifies chunks into exactly eight categories, including `research_finding`, `metadata_only`, and `drop`. [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:325]
- Indexed content sources include spec documents, constitutional rules, and graph metadata. [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:360]
- Generator hardening persists `graph-metadata` `source_fingerprint`, and generated-metadata integrity violations are hard strict errors unless explicitly grandfathered. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:133]
- Strict schema validation is on by default for MCP tool inputs. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:208]
- The context server validates input lengths and tool arguments before dispatch, then injects token-budget and auto-surface metadata into JSON envelopes. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1246] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1435]
- Headroom `compress()` defaults to compressing system messages unless disabled, but exposes `compress_system_messages=False` and protects the last four messages by default. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:100] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:111]

## Findings

Spec Kit Memory can benefit from Headroom only if compression is outside the canonical metadata and tool-envelope path. The safest fit is a host-owned shim that compresses copied, natural-language context chunks before they enter a prompt pack. Do not compress:

- `description.json`
- `graph-metadata.json`
- JSON tool request/response envelopes
- generated metadata fingerprints
- `_memory.continuity` frontmatter
- validator output

The library surface is viable because `compress_system_messages=False`, `compress_user_messages=False`, and `protect_recent` provide explicit guardrails. Proxy-level compression is not a clean fit for Spec Kit Memory because it observes broad provider traffic after the runtime has already assembled gate/hook context.

New information ratio: 0.78.

## Dead Ends / Ruled Out

- Compressing generated metadata is ruled out by strict generated-metadata integrity.
- Replacing Spec Kit Memory with Headroom memory is ruled out by the single-memory-system constitutional rule.
