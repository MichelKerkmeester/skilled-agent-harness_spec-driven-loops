import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import promptAdvisor, {
  ADVISOR_HOOK_FALLBACK_MODULE,
  ADVISOR_HOOK_MODULE,
  formatPiAdvisorDebug,
} from '../../../hooks/pi/prompt-advisor.js';

type InputHandler = (
  event: { text: string },
  ctx: { cwd: string },
) => Promise<unknown>;

function registeredInputHandler(): InputHandler {
  let handler: InputHandler | undefined;
  promptAdvisor({
    on(_event: string, callback: InputHandler) {
      handler = callback;
    },
  } as never);
  if (!handler) {
    throw new Error('prompt advisor did not register an input handler');
  }
  return handler;
}

function findRepositoryRoot(): string {
  let currentDirectory = import.meta.dirname;
  while (true) {
    if (existsSync(join(currentDirectory, '.pi')) && existsSync(join(currentDirectory, '.skilled'))) {
      return currentDirectory;
    }
    const parentDirectory = dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      throw new Error('could not find repository root containing .pi and .skilled');
    }
    currentDirectory = parentDirectory;
  }
}

const ORIGINAL_DISABLED = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
const ORIGINAL_TIMEOUT = process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS;

describe('Pi prompt advisor bridge', () => {
  afterEach(() => {
    if (ORIGINAL_DISABLED === undefined) {
      delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    } else {
      process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = ORIGINAL_DISABLED;
    }
    if (ORIGINAL_TIMEOUT === undefined) {
      delete process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS;
    } else {
      process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS = ORIGINAL_TIMEOUT;
    }
    vi.doUnmock('../../dist/hooks/claude/user-prompt-submit.js');
  });

  it.each([
    {
      context: `Advisor: outage (<status>); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json\nDirectives:\n- x`,
      brief: 'fallback(outage)',
    },
    {
      context: 'Advisor: no skill matched.\nDirectives:\n- x',
      brief: 'fallback(no-match)',
    },
    {
      context: 'Advisor: prompt skipped.\nDirectives:\n- x',
      brief: 'fallback(skipped)',
    },
    {
      context: 'Directives:\n- x',
      brief: 'fallback(headless)',
    },
    {
      context: 'Advisor: live; use sk-code 0.95/0.20 pass.\nDirectives:\n- x',
      brief: 'head(live)',
    },
  ])('classifies advisor debug context as $brief', ({ context, brief }) => {
    expect(formatPiAdvisorDebug(context, false, 10)).toContain(`brief=${brief}`);
  });

  it('leaves the input untouched when the advisor returns no context', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';

    const result = await registeredInputHandler()(
      { text: 'Inspect the hook' },
      { cwd: process.cwd() },
    );

    expect(result).toBeUndefined();
  });

  it('does not transform blank input', async () => {
    const result = await registeredInputHandler()(
      { text: ' \n\t' },
      { cwd: process.cwd() },
    );

    expect(result).toBeUndefined();
  });

  it('bounds a hung advisor call and appends the Pi fallback directives', async () => {
    process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS = '50';
    const handleClaudeUserPromptSubmit = vi.fn(() => new Promise<never>(() => {}));
    vi.doMock('../../dist/hooks/claude/user-prompt-submit.js', () => ({
      handleClaudeUserPromptSubmit,
      renderAdvisorFallbackDirective: () => 'Directives:\n- stub',
    }));

    const handler = registeredInputHandler();
    let guard: ReturnType<typeof setTimeout> | undefined;
    const result = await Promise.race([
      handler({ text: 'Inspect the hook' }, { cwd: process.cwd() }),
      new Promise<never>((_resolve, reject) => {
        guard = setTimeout(() => reject(new Error('input handler exceeded 1,000 ms')), 1_000);
      }),
    ]).finally(() => {
      if (guard) clearTimeout(guard);
    });

    expect(result).toMatchObject({ action: 'transform' });
    expect((result as { text: string }).text).toContain('Directives:\n- stub');
    expect(handleClaudeUserPromptSubmit).toHaveBeenCalledWith(
      {
        prompt: 'Inspect the hook',
        cwd: process.cwd(),
        hook_event_name: 'UserPromptSubmit',
      },
      { runtime: 'pi' },
    );
  });

  it('resolves and imports the advisor hook from both Pi extension locations', async () => {
    const repositoryRoot = findRepositoryRoot();
    const extensionUrl = pathToFileURL(join(repositoryRoot, '.pi/extensions/prompt-advisor.ts'));
    const sourceUrl = pathToFileURL(
      join(repositoryRoot, '.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts'),
    );
    const resolvedModuleUrls = [
      new URL(ADVISOR_HOOK_MODULE, extensionUrl),
      new URL(ADVISOR_HOOK_FALLBACK_MODULE, sourceUrl),
    ];

    for (const moduleUrl of resolvedModuleUrls) {
      expect(existsSync(fileURLToPath(moduleUrl))).toBe(true);
      const advisorModule = (await import(moduleUrl.href)) as {
        handleClaudeUserPromptSubmit?: unknown;
      };
      expect(typeof advisorModule.handleClaudeUserPromptSubmit).toBe('function');
    }
  });

  it('keeps the shared renderer pi-agnostic', () => {
    const renderSource = readFileSync(join(import.meta.dirname, '../../lib/render.ts'), 'utf8');

    expect(renderSource).not.toContain('Pi subagent dispatch [DEFAULT]');
  });
});
