#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PermissionRequest Policy
// ───────────────────────────────────────────────────────────────────
// STATUS: registered live in .devin/hooks.v1.json's PermissionRequest array,
// replacing the prior empty-array registration that silently rejected every
// approval-needing tool call under non-interactive `devin -p` sessions.
//
// Composes two existing shared cores rather than reimplementing policy: write-class
// calls delegate to spec-gate-core's isExemptTargetPath, exec-class calls delegate
// to dispatch-rule-checks' hard-rule evaluator. Any tool_name/shape matching neither
// class denies -- the opposite fail-direction from the rest of the Devin adapter
// suite, deliberate because a PermissionRequest denial is the safe default.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { fileURLToPath } from 'node:url';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';
import { evaluate, readHardRules } from '../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WRITE_TOOL_NAMES = new Set([
  'apply-patch',
  'apply_patch',
  'edit',
  'multiedit',
  'patch',
  'write',
]);

const EXEC_TOOL_NAMES = new Set(['bash', 'exec', 'run-command', 'run_command']);
const REQUIRED_IDENTITY_FIELDS = ['hook_event_name', 'tool_name', 'tool_use_id', 'session_id', 'prompt_id'];
const DISPATCH_SKILL_PATH = fileURLToPath(new URL(
  '../../../../cli-external-orchestration/cli-opencode/SKILL.md',
  import.meta.url,
));

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isNonBlankString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function firstNonBlankString(...candidates) {
  for (const candidate of candidates) {
    if (isNonBlankString(candidate)) return candidate;
  }
  return null;
}

function readFilePath(toolInput) {
  if (!toolInput || typeof toolInput !== 'object' || Array.isArray(toolInput)) return null;
  return firstNonBlankString(toolInput.file_path, toolInput.filePath, toolInput.path);
}

function readCommand(toolInput) {
  if (!toolInput || typeof toolInput !== 'object' || Array.isArray(toolInput)) return null;
  return firstNonBlankString(toolInput.command);
}

function resolveProjectDir(payload) {
  return firstNonBlankString(payload.cwd, process.env.DEVIN_PROJECT_DIR, process.cwd());
}

function toolClass(toolName) {
  const normalizedName = toolName.trim().toLowerCase();
  if (WRITE_TOOL_NAMES.has(normalizedName)) return 'write';
  if (EXEC_TOOL_NAMES.has(normalizedName)) return 'exec';
  return null;
}

function hasRequiredIdentity(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  if (payload.hook_event_name !== 'PermissionRequest') return false;
  return REQUIRED_IDENTITY_FIELDS.every((field) => isNonBlankString(payload[field]));
}

function decisionEnvelope(decision, reason) {
  const approved = decision === 'allow';
  return {
    decision: approved ? 'approve' : 'block',
    reason,
    hookSpecificOutput: {
      hookEventName: 'PermissionRequest',
      permissionDecision: decision,
      permissionDecisionReason: reason,
    },
  };
}

function emitDecision(decision, reason) {
  process.stdout.write(JSON.stringify(decisionEnvelope(decision, reason)));
}

function deny(reason) {
  return { decision: 'deny', reason };
}

function allow(reason) {
  return { decision: 'allow', reason };
}

function evaluateWrite(toolInput, projectDir) {
  const filePath = readFilePath(toolInput);
  if (!filePath) return deny('Permission denied: write target is missing or invalid.');

  return guardCore.isExemptTargetPath(filePath, projectDir)
    ? allow('Permission approved by the shared write-target policy.')
    : deny('Permission denied by the shared write-target policy.');
}

function evaluateExec(toolInput) {
  const command = readCommand(toolInput);
  if (!command) return deny('Permission denied: executable command is missing or invalid.');

  const violations = evaluate(command, readHardRules(DISPATCH_SKILL_PATH));
  if (violations.length > 0) {
    const ruleIds = violations.map((violation) => violation.id).join(', ');
    return deny(`Permission denied by dispatch hard rule(s): ${ruleIds}.`);
  }
  return allow('Permission approved by the shared dispatch hard-rule policy.');
}

function evaluatePermission(payload) {
  if (!hasRequiredIdentity(payload)) return deny('Permission denied: malformed or incomplete request identity.');

  const classification = toolClass(payload.tool_name);
  if (classification === 'write') return evaluateWrite(payload.tool_input, resolveProjectDir(payload));
  if (classification === 'exec') return evaluateExec(payload.tool_input);
  return deny('Permission denied: tool is not covered by a known policy class.');
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return emitDecision('deny', 'Permission denied: request payload is not valid JSON.');
  }

  try {
    const result = evaluatePermission(payload);
    return emitDecision(result.decision, result.reason);
  } catch {
    return emitDecision('deny', 'Permission denied: policy evaluation failed closed.');
  }
}

main().catch(() => emitDecision('deny', 'Permission denied: policy evaluation failed closed.'));

