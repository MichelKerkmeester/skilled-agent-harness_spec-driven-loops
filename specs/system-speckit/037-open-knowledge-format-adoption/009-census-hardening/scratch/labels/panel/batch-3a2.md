
## Row 79 (ambiguous)
- Doc: `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/005-mcp-tool-schema-governance-audit/review-report.md:44`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`
- Candidates: `.pi/extensions/pi-cache-optimizer/index.ts`, `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`, `.skilled/skills/mcp-code-mode/mcp-server/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/authority-root/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts` and 61 more

```text
**Severity:** P1, schema drift / public tool fails closed.

…d dispatches to `handleCodeGraphVerify(parseArgs(args))` `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:77`. Central dispatch validates all code graph tools before calling their module dispatcher `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:79` and `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`. `TOOL_SCHEMAS` does not include `code_graph_verify` in the code graph block `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:632`, and `ALLOWED_PARAMETERS` jumps from `code_graph_context` to `detect_changes` w…

**Impact:** The tool does not silently accept unvalidated input; it fails closed before the handler. That still blocks release readiness because the canonical public registry advertises a tool that the strict validation layer cannot dispatch. It also violates the "every `TOOL_DEFINITIONS` entry has a matching Zod schema" requirement.
```

