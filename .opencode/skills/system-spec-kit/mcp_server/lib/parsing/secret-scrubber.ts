// ───────────────────────────────────────────────────────────────
// MODULE: Secret Scrubber (re-export)
// ───────────────────────────────────────────────────────────────
// The canonical scrubber lives in @spec-kit/shared so every write path —
// the MCP server AND the standalone CLI save lane — scrubs with the same
// single source of truth. The mcp_server package only exports its dist/api
// surface, so consumers outside it could never resolve this module at
// runtime; shared resolves everywhere. This re-export keeps every existing
// mcp_server import path working unchanged.

export * from '@spec-kit/shared/parsing/secret-scrubber';
