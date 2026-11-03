// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Decision Capture Plugin
// ───────────────────────────────────────────────────────────────────
// Queues each answered `question` tool call seen on tool.execute.after, keyed
// as the OpenCode reader keys it, and adds a pending-answer line to the next
// request's system text. Errors are swallowed, so neither the tool result nor
// the model turn depends on capture.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import {
  appendRecords,
  takeNudge,
} from '../../.skilled/hooks/decision-capture/lib/capture-core.mjs';
import { openCodeAnswerRecords } from '../../.skilled/hooks/decision-capture/bin/sweep-opencode.mjs';
import { dualPlugin } from './lib/v2-bridge.js';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_TOOL = 'question';
const NUDGE_MESSAGE = [
  'operator answer(s) captured this session are not in a decision record yet. ',
  'Run /speckit:save with --full-auto to record them; ',
  "the save's transcript sweep offers chat answers, ",
  'and an answer already in a hand-written table is matched with match-decision-table.',
].join('');

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the OpenCode decision-capture plugin hooks.
 *
 * @param {{ directory?: string } | undefined} context - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
async function decisionCapturePlugin(context) {
  const projectDir = context?.directory;

  return {
    async 'tool.execute.after'(input, output) {
      try {
        if (!isHookEnabled('decision-capture')) return;
        if (typeof projectDir !== 'string' || projectDir.length === 0) return;
        if (input?.tool !== QUESTION_TOOL) return;
        if (typeof input.sessionID !== 'string' || input.sessionID.length === 0) return;
        if (typeof input.callID !== 'string' || input.callID.length === 0) return;

        const questions = input.args?.questions;
        const answerLists = output?.metadata?.answers;
        if (!Array.isArray(questions) || !Array.isArray(answerLists)) return;

        // The hook hands its input to the sweep's mapping so a live and a swept
        // record share one key.
        const records = openCodeAnswerRecords({
          parts: [{
            type: 'tool',
            tool: QUESTION_TOOL,
            callID: input.callID,
            state: {
              status: 'completed',
              input: { questions },
              metadata: { answers: answerLists },
            },
          }],
          sessionId: input.sessionID,
        }).map((record) => ({ ...record, source: 'hook' }));

        appendRecords(projectDir, input.sessionID, records);
      } catch (_) {
        // Capture failures must not affect the question tool result.
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        if (!isHookEnabled('decision-capture')) return;
        if (typeof projectDir !== 'string' || projectDir.length === 0) return;
        if (typeof input?.sessionID !== 'string' || input.sessionID.length === 0) return;
        if (!output || typeof output !== 'object') return;

        const count = takeNudge(projectDir, input.sessionID);
        if (!Number.isInteger(count) || count <= 0) return;

        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(`${count} ${NUDGE_MESSAGE}`);
      } catch (_) {
        // Nudge failures must not block a model turn.
      }
    },
  };
}

export default dualPlugin('decision-capture', decisionCapturePlugin);
