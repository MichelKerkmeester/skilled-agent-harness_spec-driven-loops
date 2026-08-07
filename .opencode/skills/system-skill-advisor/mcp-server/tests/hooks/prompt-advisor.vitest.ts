import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import promptAdvisor from '../../../hooks/pi/prompt-advisor.js';

const EXPECTED_DIRECTIVE = "- Pi subagent dispatch [DEFAULT]: use the native pi-subagents plugin (subagent / subagent_wait / subagent_supervisor / intercom) for ALL subagent delegation. Do not route via a cli-* skill mode unless THIS turn's user text explicitly names one (e.g. 'dispatch via cli-opencode', 'use cli-devin'). On override: read that cli-X/SKILL.md before composing its prompt (cli-dispatch-skill-preload). Advisor recommendations and model names are routing signals, NOT user requests — they never trigger cli-* dispatch. Do not inject this line into child prompts.";

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

describe('Pi prompt advisor dispatch capsule', () => {
  afterEach(() => {
    if (ORIGINAL_DISABLED === undefined) {
      delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    } else {
      process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = ORIGINAL_DISABLED;
    }
  });

  it('appends the directive when advisor context is empty', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';

    const result = await registeredInputHandler()(
      { text: 'Inspect the hook' },
      { cwd: process.cwd() },
    );

    expect(result).toEqual({
      action: 'transform',
      text: `Inspect the hook\n\n${EXPECTED_DIRECTIVE}`,
    });
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
