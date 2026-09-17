import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import promptAdvisor from '../../../hooks/pi/prompt-advisor.js';

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

const ORIGINAL_DISABLED = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;

describe('Pi prompt advisor bridge', () => {
  afterEach(() => {
    if (ORIGINAL_DISABLED === undefined) {
      delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    } else {
      process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = ORIGINAL_DISABLED;
    }
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

  it('keeps the shared renderer pi-agnostic', () => {
    const renderSource = readFileSync(join(import.meta.dirname, '../../lib/render.ts'), 'utf8');

    expect(renderSource).not.toContain('Pi subagent dispatch [DEFAULT]');
  });
});
