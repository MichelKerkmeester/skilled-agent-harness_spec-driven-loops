import { afterEach, describe, expect, it, vi } from 'vitest';

const ownerLoad = vi.hoisted(() => ({
  mode: 'real' as 'real' | 'throw' | 'no-export',
  layout: 'source' as 'source' | 'dist',
  requireBase: '',
}));

vi.mock('node:module', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:module')>();
  return {
    ...actual,
    createRequire: (url: string | URL) => {
      const requireUrl = ownerLoad.layout === 'dist' && String(url).endsWith('/lib/policy-plan.ts')
        ? new URL('../dist/runtime/lib/policy-plan.js', url)
        : url;
      ownerLoad.requireBase = String(requireUrl);
      const realRequire = actual.createRequire(requireUrl);
      return Object.assign((id: string) => {
        if (id.endsWith('spec-gate-core.mjs') && ownerLoad.mode === 'throw') {
          throw Object.assign(new Error('Cannot find module ' + id), { code: 'MODULE_NOT_FOUND' });
        }
        if (id.endsWith('spec-gate-core.mjs') && ownerLoad.mode === 'no-export') return {};
        return realRequire(id);
      }, realRequire);
    },
  };
});

async function loadQuestion(
  layout: 'source' | 'dist',
  mode: 'real' | 'throw' | 'no-export' = 'real',
): Promise<string | undefined> {
  ownerLoad.layout = layout;
  ownerLoad.mode = mode;
  vi.resetModules();
  const { GATE_SPEC_FOLDER_QUESTION_ID, POLICY_BLOCK_REGISTRY } = await import('../lib/policy-plan.js');
  return POLICY_BLOCK_REGISTRY.find((block) => block.id === GATE_SPEC_FOLDER_QUESTION_ID)?.content();
}

afterEach(() => {
  ownerLoad.mode = 'real';
  ownerLoad.layout = 'source';
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('policy planner Gate question owner loading', () => {
  it.each(['source', 'dist'] as const)('loads the question from the %s module layout', async (layout) => {
    const content = await loadQuestion(layout);

    expect(content).toContain('SPEC FOLDER QUESTION: this turn looks like it will mutate a file.');
    expect(ownerLoad.requireBase).toMatch(layout === 'dist'
      ? /\/dist\/runtime\/lib\/policy-plan\.js$/
      : /\/runtime\/lib\/policy-plan\.ts$/);
  });

  it('warns when the Gate question owner cannot be loaded', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(await loadQuestion('source', 'throw')).toBeUndefined();
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0]?.[0]).toMatch(
      /^\[policy-plan\].*spec-gate-core\.mjs.*Cannot find module/,
    );
  });

  it('stays silent when the loaded owner has no question export', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(await loadQuestion('source', 'no-export')).toBeUndefined();
    expect(warning).not.toHaveBeenCalled();
  });
});
