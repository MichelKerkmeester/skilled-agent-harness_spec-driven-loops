#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: dispatch-preflight Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the runtime-neutral dispatch hard-rule engine.
// It refuses a shell call that dispatches an external CLI in a way that breaks
// the target CLI skill's blocking hard rules, and allows every other call.
// Advisory rules are reported on stderr, so they never change the verdict. A
// core error allows and is reported on stderr, so a guard bug never blocks a
// call it could not judge.

import { join } from 'node:path';

import { evaluateDispatch } from '../../../.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs';
import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import { allow, deny, readPayload, runGuard, sessionDirFor, toCoreCall, REPO_ROOT } from './lib/hook-io.mjs';

const SKILLS_ROOT = join(REPO_ROOT, '.skilled', 'skills');

// The rule checks read the folder the command runs in, which the payload carries.
// toCoreCall anchors file paths to the checkout, so its cwd is not the run folder.
// A relative cwd resolves the way every other Vibe hook resolves it; a payload
// with no cwd leaves the rule checks on their own default.
function ruleContext(payload) {
  const cwd = typeof payload?.cwd === 'string' && payload.cwd.trim() ? sessionDirFor(payload.cwd) : undefined;
  return cwd ? { repoRoot: REPO_ROOT, cwd } : { repoRoot: REPO_ROOT };
}

function reportAdvisories(verdicts) {
  const warnings = verdicts.flatMap(({ skill, violations }) => violations
    .filter((violation) => violation.severity === 'warn')
    .map((violation) => `${skill}: ${violation.message}`));
  if (warnings.length === 0) return;
  try {
    process.stderr.write(`dispatch-preflight advisory:\n${warnings.join('\n')}\n`);
  } catch {
    // A closed stderr must not change the verdict.
  }
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('dispatch-guard')) return allow();

  const call = toCoreCall(payload);
  if (call.tool !== 'bash') return allow();
  const command = call.input.command;
  if (typeof command !== 'string' || command.trim() === '') return allow();

  const verdicts = evaluateDispatch(command, SKILLS_ROOT, { context: ruleContext(payload) });
  reportAdvisories(verdicts);

  const blocking = verdicts.flatMap(({ skill, violations }) => violations
    .filter((violation) => violation.severity === 'block')
    .map((violation) => `[${skill}] ${violation.id}: ${violation.message}`));
  if (blocking.length === 0) return allow();
  return deny(`Dispatch blocked by a CLI skill's hard rule(s):\n${blocking.join('\n')}`);
}

await runGuard(main, 'dispatch-preflight');
