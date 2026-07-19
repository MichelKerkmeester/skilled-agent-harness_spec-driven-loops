// TEST: Tool Contract Parity (public ListTools schema vs Zod validation schema)
//
// Guards against silent drift between the two independent validation sources:
//   - PUBLIC: TOOL_DEFINITIONS[x].inputSchema.properties served by ListTools.
//   - ZOD:    TOOL_SCHEMAS[x] used by runtime dispatch (validateToolArgs).
// When a parameter is accepted at runtime but hidden from the public schema (or
// vice versa), callers cannot discover it and additionalProperties:false would
// reject it under a public validator. This test fails on that divergence.
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { TOOL_DEFINITIONS } from '../tool-schemas';
import { TOOL_SCHEMAS } from '../schemas/tool-input-schemas';

// Scoped to the contract-parity cluster's four tools. Not all ~37 tools — only
// the ones whose public/Zod alignment this packet repairs and must keep aligned.
const PARITY_TOOLS = [
  'memory_embedding_reconcile',
  'memory_index_scan',
  'memory_ingest_start',
  'memory_causal_stats',
] as const;

function publicPropertyKeys(toolName: string): string[] {
  const def = TOOL_DEFINITIONS.find((entry) => entry.name === toolName);
  if (!def) {
    throw new Error(`No TOOL_DEFINITIONS entry for ${toolName}`);
  }
  const inputSchema = def.inputSchema as { properties?: Record<string, unknown> };
  return Object.keys(inputSchema.properties ?? {});
}

function zodShapeKeys(toolName: string): string[] {
  const schema = TOOL_SCHEMAS[toolName];
  if (!schema) {
    throw new Error(`No TOOL_SCHEMAS entry for ${toolName}`);
  }
  // TOOL_SCHEMAS values are getSchema() ZodObjects cast to a generic ZodType.
  // Recover the shape to compare top-level parameter keys.
  const asObject = schema as unknown as z.ZodObject<z.ZodRawShape>;
  return Object.keys(asObject.shape);
}

describe('tool contract parity: public schema vs Zod schema', () => {
  for (const toolName of PARITY_TOOLS) {
    it(`${toolName}: public property keys equal Zod shape keys`, () => {
      const publicKeys = publicPropertyKeys(toolName).sort();
      const zodKeys = zodShapeKeys(toolName).sort();

      const onlyPublic = publicKeys.filter((k) => !zodKeys.includes(k));
      const onlyZod = zodKeys.filter((k) => !publicKeys.includes(k));

      expect(
        { onlyPublic, onlyZod },
        `parity mismatch for ${toolName}: keys only in public=${JSON.stringify(onlyPublic)}, only in Zod=${JSON.stringify(onlyZod)}`,
      ).toEqual({ onlyPublic: [], onlyZod: [] });

      expect(publicKeys).toEqual(zodKeys);
    });
  }
});
