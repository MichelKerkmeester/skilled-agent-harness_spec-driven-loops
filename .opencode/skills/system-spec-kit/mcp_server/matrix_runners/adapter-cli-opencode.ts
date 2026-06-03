// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner OpenCode Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter } from './adapter-common.js';

import type { AdapterInput, AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_OPENCODE_MODEL ?? 'opencode-go/deepseek-v4-pro';
const DEFAULT_VARIANT = process.env.MATRIX_OPENCODE_VARIANT ?? 'high';
const DEFAULT_AGENT = process.env.MATRIX_OPENCODE_AGENT ?? 'general';

/** Run a matrix cell through the OpenCode CLI adapter. */
export async function adapterCliOpencode(input: AdapterInput): Promise<AdapterResult> {
  // Omit --agent when the value is "general": opencode treats `general` as a
  // subagent name and rejects it at the top level. The default agent is already
  // in effect without the flag, so we only forward it for explicit non-general agents.
  const agentArgs: string[] = DEFAULT_AGENT && DEFAULT_AGENT !== 'general'
    ? ['--agent', DEFAULT_AGENT]
    : [];

  return runCliAdapter({
    adapterName: 'cli-opencode',
    input,
    invocation: {
      command: 'opencode',
      args: [
        'run',
        '--model',
        DEFAULT_MODEL,
        ...agentArgs,
        '--variant',
        DEFAULT_VARIANT,
        '--format',
        'json',
        '--dir',
        input.workingDir,
        input.promptTemplate,
      ],
    },
  });
}
