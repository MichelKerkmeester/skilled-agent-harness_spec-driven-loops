// MODULE: Deep-Loop Prompt Pack Renderer

import { readFileSync } from 'node:fs';
import { z } from '../../../system-spec-kit/mcp_server/node_modules/zod/index.js';

// ───── TYPE DEFINITIONS ─────

export type PromptPackVariables = Record<string, string | number>;

// ───── CONSTANTS ─────

const PROMPT_PACK_TOKEN_PATTERN = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
const promptPackVariableNameSchema = z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/);

// ───── DOMAIN ERRORS ─────

export class PromptPackError extends Error {
  missingVariables: string[];

  constructor(missingVariables: string[]) {
    super(`Missing prompt pack variables: ${missingVariables.join(', ')}`);
    this.name = 'PromptPackError';
    this.missingVariables = missingVariables;
  }
}

// ───── HELPERS ─────

function extractTemplateTokens(template: string): string[] {
  const tokens = new Set<string>();

  for (const match of template.matchAll(PROMPT_PACK_TOKEN_PATTERN)) {
    const tokenName = match[1];
    if (promptPackVariableNameSchema.safeParse(tokenName).success) {
      tokens.add(tokenName);
    }
  }

  return [...tokens];
}

// ───── EXPORTS ─────

/**
 * Render a prompt pack template by substituting variables.
 *
 * Reads the template file and replaces all `{variableName}` tokens
 * with values from the variables map.
 *
 * @param templatePath - Path to the prompt pack template file.
 * @param variables - Mapping of variable names to replacement values.
 * @returns Rendered template string with all variables substituted.
 * @throws {@link PromptPackError} If any required variables are missing.
 */
export function renderPromptPack(templatePath: string, variables: PromptPackVariables): string {
  const template = readFileSync(templatePath, 'utf8');
  const missingVariables = new Set<string>();

  const rendered = template.replace(PROMPT_PACK_TOKEN_PATTERN, (_, tokenName: string) => {
    if (!(tokenName in variables)) {
      missingVariables.add(tokenName);
      return `{${tokenName}}`;
    }

    return String(variables[tokenName]);
  });

  if (missingVariables.size > 0) {
    throw new PromptPackError([...missingVariables]);
  }

  return rendered;
}

/**
 * Validate that a prompt pack template contains expected variables.
 *
 * @param templatePath - Path to the prompt pack template file.
 * @param expectedVariables - Variable names that should be present.
 * @returns Report with present, missing, and extra variables.
 */
export function validatePromptPackTemplate(
  templatePath: string,
  expectedVariables: string[],
): { present: string[]; missing: string[]; extra: string[] } {
  const template = readFileSync(templatePath, 'utf8');
  const templateTokens = extractTemplateTokens(template);
  const templateTokenSet = new Set(templateTokens);
  const expectedTokenSet = new Set(expectedVariables.filter((token) => promptPackVariableNameSchema.safeParse(token).success));

  return {
    present: expectedVariables.filter((token) => expectedTokenSet.has(token) && templateTokenSet.has(token)),
    missing: expectedVariables.filter((token) => expectedTokenSet.has(token) && !templateTokenSet.has(token)),
    extra: templateTokens.filter((token) => !expectedTokenSet.has(token)),
  };
}
