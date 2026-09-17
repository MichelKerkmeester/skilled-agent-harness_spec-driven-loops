// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Tool Descriptor Types
// ───────────────────────────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}
