// ───────────────────────────────────────────────────────────────
// MODULE: advisor_recommend Descriptor ↔ Handler Schema Parity Tests
// ───────────────────────────────────────────────────────────────
// The CLI manifest parity suite only proves descriptor == manifest. That left
// a gap where the handler Zod schema accepted option keys the JSON-Schema
// descriptor rejected, so a CLI caller passing those keys hit a schema
// validation error (exit 64) even though the in-process handler would have
// honored them. These tests pin the JSON-Schema descriptor, the CLI manifest,
// and the handler's Zod schema to the SAME set of option keys.

import { describe, expect, it } from 'vitest';

import { advisorRecommendTool } from '../../tools/advisor-recommend.js';
import { SKILL_ADVISOR_CLI_TOOL_MANIFEST } from '../../skill-advisor-cli-manifest.js';
import { AdvisorRecommendInputSchema } from '../../schemas/advisor-tool-schemas.js';

function jsonSchemaOptionKeys(inputSchema: Record<string, unknown>): string[] {
  const properties = inputSchema.properties as Record<string, unknown> | undefined;
  const options = properties?.options as Record<string, unknown> | undefined;
  const optionProperties = options?.properties as Record<string, unknown> | undefined;
  return Object.keys(optionProperties ?? {}).sort();
}

function handlerOptionKeys(): string[] {
  const optionsField = AdvisorRecommendInputSchema.shape.options;
  const inner = optionsField.unwrap();
  return Object.keys(inner.shape).sort();
}

describe('advisor_recommend descriptor ↔ handler schema parity', () => {
  it('descriptor option keys match the handler Zod schema exactly', () => {
    expect(jsonSchemaOptionKeys(advisorRecommendTool.inputSchema)).toEqual(handlerOptionKeys());
  });

  it('CLI manifest option keys match the handler Zod schema exactly', () => {
    const manifestTool = SKILL_ADVISOR_CLI_TOOL_MANIFEST.find((tool) => tool.name === 'advisor_recommend');
    expect(manifestTool).toBeDefined();
    expect(jsonSchemaOptionKeys(manifestTool!.inputSchema)).toEqual(handlerOptionKeys());
  });

  it('handler validation preserves caller-supplied confidence/uncertainty thresholds', () => {
    const parsed = AdvisorRecommendInputSchema.parse({
      prompt: 'route this prompt',
      options: { confidenceThreshold: 0.9, uncertaintyThreshold: 0.12 },
    });
    expect(parsed.options?.confidenceThreshold).toBe(0.9);
    expect(parsed.options?.uncertaintyThreshold).toBe(0.12);
  });

  it('handler rejects an option key outside the shared contract', () => {
    expect(() => AdvisorRecommendInputSchema.parse({
      prompt: 'route this prompt',
      options: { notARealOption: true } as Record<string, unknown>,
    })).toThrow();
  });
});
