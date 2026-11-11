// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard OpenCode Plugin
// ───────────────────────────────────────────────────────────────────
// OpenCode transport adapter over the runtime-neutral env-secret-guard core.
// On tool.execute.before it denies a file tool or shell command that would
// read or write a dotenv file, by throwing, which both OpenCode hosts treat as
// a refusal. It also registers three tools that inspect a dotenv file without
// returning any value: list keys, validate, and fingerprint.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { appendFileSync, copyFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { findRepoRoot, findSourceRoot } from '../skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

import { dualPlugin } from './lib/v2-bridge.js';
import { tool } from './lib/tool-identity.js';

const require = createRequire(import.meta.url);
// The policy is a .cjs core so the command hooks, Pi and DSH run the same rules.
const guardCore = require('../hooks/env-secret-guard/lib/env-secret-guard.cjs');
const guardWatch = require('../hooks/env-secret-guard/lib/env-secret-watch.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NATIVE_TOOLS_HINT = 'call env_secret_list_keys, env_secret_validate or env_secret_fingerprint';
const LOG_NAME = 'env-secret-guard.log';
const MAX_LOG_BYTES = 256 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Logs live under the source root of the checkout the project sits in. A
// project with no toolchain tree logs under its .opencode directory instead.
function logPathFor(projectDir) {
  const repoRoot = findRepoRoot(projectDir);
  return join(findSourceRoot(repoRoot) ?? join(repoRoot, '.opencode'), 'logs', LOG_NAME);
}

// OpenCode paints plugin stdout and stderr onto the prompt line, so a guard
// failure goes to a bounded, rotated log instead. A logging error is swallowed:
// it must never affect the call being judged.
function appendGuardLog(projectDir, detail) {
  try {
    const logPath = logPathFor(projectDir);
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= MAX_LOG_BYTES) {
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch {
      // A missing log is the normal first-write case.
    }
    appendFileSync(logPath, `${new Date().toISOString()} [env-secret-guard] ${detail}\n`, 'utf8');
  } catch {
    // Swallowed on purpose, see above.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

async function EnvSecretGuardPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const enabled = () => guardCore.isGuardEnabled();
  const answer = (result) => JSON.stringify(result);
  const disabledAnswer = answer({ ok: false, error: 'env-secret-guard is disabled.' });

  return {
    async 'tool.execute.before'(input, output) {
      if (!enabled()) return;
      let result;
      try {
        result = guardCore.evaluateToolCall({
          tool: input?.tool,
          input: output?.args,
          cwd: projectDir,
          hint: NATIVE_TOOLS_HINT,
        });
      } catch (error) {
        // Fail open, but leave a trace: a broken core would otherwise leave
        // every call unguarded in silence.
        const message = error instanceof Error ? error.message : String(error);
        appendGuardLog(projectDir, `allowing a call it could not judge: ${message}`);
        return;
      }
      if (result.decision === 'deny') throw new Error(result.reason);
      if (guardCore.SHELL_TOOLS.has(String(input?.tool || '').toLowerCase())) {
        try {
          guardWatch.snapshotDotenv(projectDir);
        } catch (error) {
          appendGuardLog(projectDir, `no dotenv record taken: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    },

    // After the call: undo a dotenv write and take a dotenv value out of the
    // output before the model reads it.
    async 'tool.execute.after'(input, output) {
      if (!enabled()) return;
      try {
        const review = guardWatch.reviewToolResult({ tool: input?.tool, output: output?.output, cwd: projectDir });
        if (!review.message || !output || typeof output !== 'object') return;
        const text = typeof output.output === 'string' ? review.redact(output.output) : '';
        output.output = `${text}${text ? '\n' : ''}${review.message}`;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        appendGuardLog(projectDir, `after-call check failed: ${message}`);
      }
    },

    tool: {
      env_secret_list_keys: tool({
        description: 'List the keys a dotenv file inside the project defines, without their values.',
        args: { filePath: tool.schema.string().describe('Dotenv file inside the current project') },
        async execute(args) {
          return enabled() ? answer(guardCore.listKeys(args.filePath, projectDir)) : disabledAnswer;
        },
      }),
      env_secret_validate: tool({
        description: 'Check dotenv syntax and return the line numbers that fail to parse, without any value.',
        args: { filePath: tool.schema.string().describe('Dotenv file inside the current project') },
        async execute(args) {
          return enabled() ? answer(guardCore.validate(args.filePath, projectDir)) : disabledAnswer;
        },
      }),
      env_secret_fingerprint: tool({
        description: 'Return an HMAC-SHA256 fingerprint of one dotenv value, keyed by ENV_SECRET_GUARD_PEPPER. '
          + 'The value is never returned.',
        args: {
          filePath: tool.schema.string().describe('Dotenv file inside the current project'),
          key: tool.schema.string().describe('Dotenv key to fingerprint'),
        },
        async execute(args) {
          return enabled() ? answer(guardCore.fingerprint(args.filePath, args.key, projectDir)) : disabledAnswer;
        },
      }),
    },
  };
}

export default dualPlugin('env-secret-guard', EnvSecretGuardPlugin);
