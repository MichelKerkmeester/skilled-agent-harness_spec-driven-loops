// ───────────────────────────────────────────────────────────────────
// MODULE: Post Edit Quality Adapter
// ───────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import qualityCore from '../../../../.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs';
import { isHookEnabled } from '../../../../.skilled/hooks/shared/hook-flags.mjs';
import { loadDshLlm } from './dsh-llm.mjs';

export const ERROR_POLICY = 'fail-open';

const FILE_TOOLS = new Set(['write', 'edit', 'apply_patch']);

function formatFindings(findings) {
  return findings.map((finding) => {
    if (!finding || typeof finding !== 'object') return String(finding);
    return `[${String(finding.label || 'quality')}]\n${String(finding.stdout || '')}`.trim();
  }).join('\n\n');
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards post-edit-quality: ${String(error)}`);
  } catch {
    // A logging failure must not affect the completed file operation.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

export function registerPostEditQuality(ctx, {
  core = qualityCore,
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled('post-edit-quality')) return;

  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next();
    if (!FILE_TOOLS.has(exec.name)) return downstream;
    const rawPath = exec.arguments?.path ?? exec.arguments?.file_path ?? exec.arguments?.filePath;
    if (typeof rawPath !== 'string' || !rawPath) return downstream;
    const projectDir = exec.agent?.session?.header?.cwd ?? cwd;
    const filePath = resolve(projectDir, rawPath);
    if (!existsSync(filePath)) return downstream;

    try {
      const entries = core.resolveDispatch(filePath, projectDir);
      const findings = core.runChecks(entries, core.CLAUDE_HOOK_BUDGET_MS, {
        perChildTimeoutMs: core.CLAUDE_CHECKER_TIMEOUT_MS,
        minCheckerMs: core.CLAUDE_MIN_CHECKER_MS,
      });
      const notices = findings.length > 0 ? [formatFindings(findings)] : [];
      const banner = core.runDistStalenessCheck(filePath, projectDir, {
        timeoutMs: core.CLAUDE_CHECKER_TIMEOUT_MS,
      });
      if (banner) notices.push(banner);
      if (notices.length === 0 || downstream.kind !== 'accept') return downstream;

      const notice = await createNotice(notices.join('\n\n'));
      return {
        ...downstream,
        additionalContexts: [...(downstream.additionalContexts ?? []), notice],
      };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });
}
