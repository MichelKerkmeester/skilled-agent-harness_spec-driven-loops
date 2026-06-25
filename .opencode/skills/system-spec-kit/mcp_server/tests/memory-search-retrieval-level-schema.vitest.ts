import { afterEach, describe, expect, it, vi } from 'vitest';

describe('memory_search retrievalLevel schema wiring', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  async function loadValidator(): Promise<typeof import('../schemas/tool-input-schemas')> {
    vi.resetModules();
    vi.stubEnv('SPECKIT_STRICT_SCHEMAS', 'true');
    return import('../schemas/tool-input-schemas');
  }

  it.each(['local', 'global', 'auto'] as const)('accepts retrievalLevel %s', async (retrievalLevel) => {
    const { validateToolArgs } = await loadValidator();

    expect(validateToolArgs('memory_search', {
      query: 'retrieval level acceptance',
      retrievalLevel,
    })).toMatchObject({ retrievalLevel });
  });

  it('rejects an invalid retrievalLevel value', async () => {
    const { ToolSchemaValidationError, validateToolArgs } = await loadValidator();

    expect(() => validateToolArgs('memory_search', {
      query: 'retrieval level rejection',
      retrievalLevel: 'regional',
    })).toThrow(ToolSchemaValidationError);
  });
});
