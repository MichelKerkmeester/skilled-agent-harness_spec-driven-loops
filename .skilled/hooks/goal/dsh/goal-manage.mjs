// ───────────────────────────────────────────────────────────────────
// MODULE: Goal Manage Adapter
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import path from 'node:path';

import goalCore from '../lib/goal-core.cjs';
import { loadDshLlm, loadDshTools } from '../../shared/dsh/dsh-llm.mjs';
import { isLineageLeaf } from '../../shared/dsh/session-role.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'dsh';
const RUNTIME_LABEL = 'DSH';
const MANAGE_CLI_RELATIVE_PATH = '.skilled/hooks/goal/bin/goal.cjs';
const CLI_TIMEOUT_MS = 10_000;

export const ERROR_POLICY = 'fail-open';
export const GOAL_COMMAND_NAME = 'goal-dsh';
export const GOAL_TOOL_NAME = 'dsh_goal';
// The same action set the OpenCode goal tool exposes, all served by the shared manage CLI.
export const GOAL_ACTIONS = Object.freeze([
  'set', 'bind', 'unbind', 'resent', 'log', 'packet', 'show', 'clear', 'complete', 'pause', 'history', 'resume', 'doctor', 'health',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// The manage CLI splits a log row on `|`, so a field may not carry one of its own.
function logField(value) {
  return String(value ?? '').replaceAll('|', '/').trim();
}

function withBudget(argv, tokenBudget) {
  return Number.isInteger(tokenBudget) ? [...argv, '--budget', String(tokenBudget)] : argv;
}

function runManageCli(argv, { cwd }) {
  return spawnSync(process.execPath, [path.join(cwd, MANAGE_CLI_RELATIVE_PATH), ...argv], {
    cwd,
    encoding: 'utf8',
    timeout: CLI_TIMEOUT_MS,
  });
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

async function loadDefineTool() {
  return (await loadDshTools()).defineTool;
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards goal-manage: ${String(error)}`);
  } catch {
    // A logging failure must not alter the turn.
  }
}

function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.filter((item) => item?.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text).join('\n');
}

// A step's messages are the ones claimed from the inbox, in no fixed order. Only a
// step that claims a message the operator typed opens a turn; notices ride along.
function isOperatorTurn(messages) {
  return Array.isArray(messages)
    && messages.some((message) => message?.role === 'user' && message.source?.kind === 'user');
}

// The verifier judges the tail of its evidence, so tool output comes first and the
// turn's own conclusion last, the order Pi uses.
function turnEvidence(agent, turn) {
  const events = agent?.session?.snapshotEvents?.() ?? [];
  const tools = [];
  const replies = [];
  for (const event of events) {
    if (event?.data?.turn !== turn) continue;
    if (event.type === 'tool/result') tools.push(contentText(event.data.message?.content));
    if (event.type === 'assistant/message') replies.push(contentText(event.data.message?.content));
  }
  const assistantText = replies.filter(Boolean).join('\n');
  return { transcriptText: [...tools, assistantText].filter(Boolean).join('\n'), assistantText };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map one goal tool call onto the manage CLI's positional grammar.
 *
 * @param {Object} input - Tool arguments: an action and the fields it reads.
 * @returns {string[]} CLI arguments before the scope flags.
 * @throws {Error} For an action the CLI does not own.
 */
export function goalCliArgs({ action, objective, packetPath, item, state, evidence, reason, tokenBudget } = {}) {
  if (!GOAL_ACTIONS.includes(action)) throw new Error(`Unknown goal action: ${String(action)}`);
  switch (action) {
    case 'set': return withBudget(objective ? ['set', objective] : ['set'], tokenBudget);
    case 'bind': return withBudget(packetPath ? ['bind', packetPath] : ['bind'], tokenBudget);
    case 'packet': return packetPath ? ['packet', packetPath] : ['packet'];
    case 'log': return ['log', [item, state, evidence].map(logField).join(' | ')];
    case 'pause': return reason ? ['pause', reason] : ['pause'];
    default: return [action];
  }
}

/**
 * The interactive goal surface: the `/goal-dsh` command, the `dsh_goal` tool, the
 * per-turn brief with its resend reminder, and the heuristic verify note.
 *
 * Every write goes through the shared manage CLI and core, scoped to this DSH
 * session. A fan-out leaf gets none of it: its goal is the packet slice the
 * goal-context adapter injects, and it must never write the operator's goal record.
 *
 * @param {Object} ctx - dsh plugin context with `on`, `commands` and `logger`.
 * @param {Object} [options] - Core, CLI runner and switches for deterministic tests.
 */
export function registerGoalManage(ctx, {
  core = goalCore,
  runCli = runManageCli,
  defineTool = loadDefineTool,
  createNotice = makeNotice,
  isLeaf = isLineageLeaf,
  cwd = process.cwd(),
} = {}) {
  if (core.isPluginDisabled()) return;

  const scopeOf = (agent) => {
    const workspace = core.resolveRepoRoot(agent?.session?.header?.cwd ?? cwd);
    return { workspace, runtime: RUNTIME, sessionId: agent?.session?.id ?? '' };
  };

  const manage = (agent, argv) => {
    const scope = scopeOf(agent);
    const result = runCli(
      [...argv, '--runtime', scope.runtime, '--session', scope.sessionId, '--workspace', scope.workspace],
      { cwd: scope.workspace },
    );
    const output = String(result?.stdout || result?.stderr || '').trim();
    return output || 'STATUS=FAIL ACTION=show ERROR="Goal manage CLI returned no output"\ncode=GOAL_CLI_EMPTY';
  };

  if (typeof ctx.commands?.register === 'function') {
    ctx.commands.register({
      name: GOAL_COMMAND_NAME,
      description: 'Manage the goal for this DSH session: bind <packet>, show, resent, log, packet <path>, set, pause, clear, complete',
      input: { hint: '[bind <packet> | show | resent | log <item> | <state> | <evidence> | set <objective> | pause | clear | complete]' },
      handler: ({ agent, rawInput } = {}) => {
        if (isLeaf()) return { kind: 'error', text: 'The goal surface is off in a fan-out leaf.' };
        try {
          const words = String(rawInput ?? '').trim().split(/\s+/).filter(Boolean);
          const text = manage(agent, words.length > 0 ? words : ['show']);
          return { kind: text.startsWith('STATUS=OK') ? 'success' : 'error', text };
        } catch (error) {
          logFailure(ctx, error);
          return { kind: 'error', text: 'STATUS=FAIL ACTION=show ERROR="Goal manage CLI is unavailable"\ncode=GOAL_CLI_UNAVAILABLE' };
        }
      },
    });
  }

  ctx.on('agent/created', async ({ agent } = {}) => {
    if (isLeaf()) return undefined;
    try {
      const define = await defineTool();
      agent.ctx.tools.register(define({
        name: GOAL_TOOL_NAME,
        description: 'Manage the goal for this session through the shared goal record. '
          + 'Actions: set (objective), bind (packetPath), unbind, resent, log (item, state, evidence), packet (packetPath), '
          + 'show, clear, complete, pause (reason), history, resume, doctor, health.',
        parameters: {
          action: { type: 'string', enum: [...GOAL_ACTIONS], required: true, description: 'The goal action to run.' },
          objective: { type: 'string', description: 'Objective text for set.' },
          packetPath: { type: 'string', description: 'Spec packet path for bind or packet.' },
          item: { type: 'string', description: 'Log row item.' },
          state: { type: 'string', description: 'Log row state.' },
          evidence: { type: 'string', description: 'Log row evidence.' },
          reason: { type: 'string', description: 'Pause reason.' },
          tokenBudget: { type: 'integer', description: 'Token budget for set or bind.' },
        },
        output: {
          schema: { type: 'string' },
          render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: async (args, exec) => manage(exec?.agent ?? agent, goalCliArgs(args)),
      }));
    } catch (error) {
      logFailure(ctx, error);
    }
    return undefined;
  });

  ctx.on('agent/pre-step', async (payload, next) => {
    const downstream = await next();
    if (downstream?.kind !== 'enter' || isLeaf() || !isOperatorTurn(payload.messages)) return downstream;
    try {
      const scope = scopeOf(payload.agent);
      const goal = core.readGoalRecord({ cwd: scope.workspace, scope });
      const brief = core.renderGoalBrief({ goal, runtimeLabel: RUNTIME_LABEL, workspace: scope.workspace });
      if (!brief) return downstream;
      const reminder = core.renderResendReminder(goal, scope.workspace, { recordCommand: `/${GOAL_COMMAND_NAME} resent` });
      const notice = await createNotice(reminder ? `${brief}\n${reminder}` : brief);
      return { ...downstream, messages: [...(downstream.messages ?? []), notice] };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });

  // Steering a stopping turn would run another step, so the verify note waits for
  // idle and rides with the operator's next prompt, as Pi's next-turn delivery does.
  const pendingNotes = new Map();

  ctx.on('agent/turn-stopping', ({ agent, turn } = {}) => {
    if (isLeaf()) return undefined;
    try {
      const scope = scopeOf(agent);
      const options = { cwd: scope.workspace, scope };
      const goal = core.readGoalRecord(options);
      if (!goal || goal.status !== 'active') return undefined;
      const verdict = core.verifyGoalHeuristic({ goal, ...turnEvidence(agent, turn) });
      core.recordTurn({}, options);
      if (verdict.verdict !== 'met') {
        pendingNotes.set(scope.sessionId, `[goal_verify] verdict=${verdict.verdict}; reason=${verdict.reason}`);
      }
    } catch (error) {
      logFailure(ctx, error);
    }
    return undefined;
  });

  ctx.on('agent/status', async ({ agent, status } = {}) => {
    if (status !== 'idle') return;
    const sessionId = agent?.session?.id;
    const note = pendingNotes.get(sessionId);
    if (!note) return;
    pendingNotes.delete(sessionId);
    try {
      agent.inject(await createNotice(note));
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
