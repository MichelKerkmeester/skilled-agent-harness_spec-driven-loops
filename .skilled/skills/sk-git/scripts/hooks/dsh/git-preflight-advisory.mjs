// ───────────────────────────────────────────────────────────────────
// MODULE: Git Preflight Advisory Adapter
// ───────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as dispatchRules from '../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs';
import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { createGitContext } from '../../lib/git-context.mjs';
import { GIT_CHECKS, GIT_SHAPE } from '../../lib/git-rule-checks.mjs';
import { loadDshLlm } from '../../../../../hooks/shared/dsh/dsh-llm.mjs';

// A dsh session can run outside the checkout, so repository rules come from this file's location.
const REPO_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));

const MAX_ADVISORIES = 3;

export const ERROR_POLICY = 'fail-open';

function resolveSuppression(env) {
  const isOff = /^(0|false|off)$/i.test(env.SKGIT_ADVISORY ?? '');
  const skipped = (env.SKGIT_ADVISORY_SKIP ?? '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
  return {
    isOff,
    isSilenced: (id) => skipped.some((token) => id === token || id.startsWith(`${token}-`)),
  };
}

function formatAdvisory(command, violations) {
  const shown = violations.slice(0, MAX_ADVISORIES);
  const omitted = violations.length - shown.length;
  const subcommand = (command.match(/git\s+(?:-C\s+\S+\s+)?([a-z-]+)/) ?? [])[1] ?? 'git';
  const lines = [
    `⚠ sk-git advisory: this \`git ${subcommand}\` may not do what it appears to:`,
    ...shown.map((violation) => `  • [${violation.id}] ${violation.message}`),
  ];
  if (omitted > 0) lines.push(`  • ${omitted} more advisories were omitted.`);
  lines.push('  Advisory only. Silence: SKGIT_ADVISORY_SKIP=<rule-id>');
  return lines.join('\n');
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards git-preflight-advisory: ${String(error)}`);
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

/** Register non-blocking git guidance on tool results. */
export function registerGitPreflightAdvisory(ctx, {
  core = { ...dispatchRules, GIT_SHAPE, GIT_CHECKS, createGitContext },
  isEnabled = isHookEnabled,
  env = process.env,
  cwd = process.cwd(),
  repoRoot = REPO_ROOT,
  createNotice = makeNotice,
} = {}) {
  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next();
    if (exec.name !== 'bash' || downstream.kind !== 'accept') return downstream;

    try {
      if (!isEnabled('git-preflight')) return downstream;
      const command = exec.arguments?.command;
      if (typeof command !== 'string' || !core.GIT_SHAPE.test(command)) return downstream;

      const suppression = resolveSuppression(env);
      if (suppression.isOff) return downstream;

      const projectDir = exec.agent?.session?.header?.cwd ?? exec.cwd ?? cwd;
      const skillPath = join(repoRoot, '.skilled', 'skills', 'sk-git', 'SKILL.md');
      const rules = core.readHardRules(skillPath)
        .filter((rule) => core.GIT_CHECKS[rule.check] && !suppression.isSilenced(rule.id));
      if (rules.length === 0) return downstream;

      const context = core.createGitContext(projectDir);
      if (typeof context?.isRepo !== 'function' || !context.isRepo()) return downstream;

      const violations = core.evaluate(command, rules, {
        checks: core.GIT_CHECKS,
        context,
      });
      if (violations.length === 0) return downstream;

      const notice = await createNotice(formatAdvisory(command, violations));
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
