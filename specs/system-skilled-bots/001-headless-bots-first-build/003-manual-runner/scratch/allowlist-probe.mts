import { buildExecutorDispatchEnv } from '../../../../../.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts';
import { parseExecutorConfig } from '../../../../../.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts';
const env = buildExecutorDispatchEnv(parseExecutorConfig({ kind: 'cli-codex' }), { PATH: '/usr/bin', SKILLED_BOT_RUN_ID: 'probe-run-1', AI_SESSION_CHILD: '1' });
console.log(JSON.stringify({ SKILLED_BOT_RUN_ID: env.SKILLED_BOT_RUN_ID ?? null, AI_SESSION_CHILD: env.AI_SESSION_CHILD ?? null }));
