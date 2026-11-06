// ───────────────────────────────────────────────────────────────────
// MODULE: Goal Context Adapter
// ───────────────────────────────────────────────────────────────────

import goalCore from '../../../../.skilled/hooks/goal/lib/goal-core.cjs';
import { loadDshLlm } from './dsh-llm.mjs';

export const ERROR_POLICY = 'fail-open';

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards goal-context: ${String(error)}`);
  } catch {
    return undefined;
  }
  return undefined;
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

/** Register the packet goal projection on agent creation. */
export function registerGoalContext(ctx, {
  core = goalCore,
  env = process.env,
  cwd = process.cwd(),
  createNotice = makeNotice,
} = {}) {
  ctx.on('agent/created', async ({ agent }) => {
    try {
      const packetPath = env.DSH_SPEC_FOLDER;
      if (typeof packetPath !== 'string' || !packetPath.trim()) return undefined;

      const projectDir = agent?.session?.header?.cwd ?? cwd;
      const packet = core.describePacketGoal(packetPath, { workspace: projectDir });
      if (typeof packet?.chatSlice !== 'string' || !packet.chatSlice) return undefined;

      agent.inject(await createNotice(packet.chatSlice));
    } catch (error) {
      logFailure(ctx, error);
    }
    return undefined;
  });
}
