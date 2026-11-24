// ───────────────────────────────────────────────────────────────
// MODULE: advisor_validate Tool Descriptor
// ───────────────────────────────────────────────────────────────

import type { ToolDefinition } from './types.js';
import { ADVISOR_RUNTIME_VALUES } from '../lib/advisor-runtime-values.js';
// The descriptor's `properties` record is typed by
// ADVISOR_VALIDATE_PARAMETER_KEYS, so a key added here without the tuple, or
// dropped from here while the tuple keeps it, fails the type check. The Zod
// input schema does not read the tuple.
import { ADVISOR_VALIDATE_PARAMETER_KEYS } from './advisor-contract-keys.js';

const properties: Record<(typeof ADVISOR_VALIDATE_PARAMETER_KEYS)[number], Record<string, unknown>> = {
  confirmHeavyRun: { type: 'boolean', const: true, description: 'Required acknowledgement that this call runs the heavier advisor validation bundle.' },
  workspaceRoot: { type: 'string', minLength: 1, description: 'Optional workspace root used to locate advisor corpus and telemetry artifacts.' },
  skillSlug: { type: ['string', 'null'], minLength: 1, description: 'Optional skill slug to validate; null or omitted validates all skills.' },
  outcomeEvents: {
    type: 'array',
    description: 'Prompt-free outcome telemetry to persist before validation totals are computed.',
    items: {
      type: 'object',
      additionalProperties: false,
      properties: {
        runtime: { type: 'string', enum: [...ADVISOR_RUNTIME_VALUES] },
        outcome: { type: 'string', enum: ['accepted', 'corrected', 'ignored'] },
        skillId: { type: 'string', minLength: 1 },
        correctedSkillId: { type: 'string', minLength: 1 },
        timestamp: { type: 'string', format: 'date-time' },
      },
      required: ['runtime', 'outcome', 'skillId'],
    },
  },
};

export const advisorValidateTool: ToolDefinition = {
  name: 'advisor_validate',
  description: '[L8:Skill Advisor] Run the native advisor regression bundle and return prompt-safe corpus, holdout, parity, safety, and latency slices. Requires confirmHeavyRun=true because this executes heavier validation work. Accepts an optional skillSlug filter; null or omitted validates all skills.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties,
    required: ['confirmHeavyRun'],
  },
};
