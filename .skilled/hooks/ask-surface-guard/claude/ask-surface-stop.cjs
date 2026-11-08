#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Ask Surface Stop Guard
// ───────────────────────────────────────────────────────────────────
// Synchronous on purpose: only a Stop hook that runs before the turn closes
// can return {decision:"block"}, and that is the one seam that makes Claude
// re-ask a prose menu through AskUserQuestion. Subagents never fire Stop, so
// a session without the tool never reaches this file.
'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { readFileSync } = require('node:fs');

const core = require('../lib/ask-surface-core.cjs');

let isHookEnabled = () => true;
try { isHookEnabled = require('../../shared/hook-flags.cjs').isHookEnabled; } catch {}

// ───────────────────────────────────────────────────────────────────
// 2. TRANSCRIPT
// ───────────────────────────────────────────────────────────────────

function transcriptEntries(transcriptPath) {
  if (typeof transcriptPath !== 'string' || !transcriptPath) return [];
  const entries = [];
  for (const line of readFileSync(transcriptPath, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === 'object' && parsed.isSidechain !== true) entries.push(parsed);
    } catch {
      // A torn final line is normal while Claude is still writing.
    }
  }
  return entries;
}

function blocksOf(entry) {
  const content = entry?.message?.content;
  return Array.isArray(content) ? content.filter((block) => block && typeof block === 'object') : [];
}

// A typed operator prompt opens a turn. Tool results and harness notes also
// arrive as user entries, so they do not. A slash command is typed too, but
// it is stored wrapped in tags, so its command-name tag marks it.
function isOperatorText(text) {
  return typeof text === 'string' && (!text.startsWith('<') || text.includes('<command-name>'));
}

function isTypedPrompt(entry) {
  if (entry?.type !== 'user' || entry.isMeta === true || entry.isCompactSummary === true) return false;
  const content = entry?.message?.content;
  if (typeof content === 'string') return isOperatorText(content);
  return blocksOf(entry).some((block) => block.type === 'text' && isOperatorText(block.text));
}

function readTurn(entries) {
  let start = 0;
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    if (isTypedPrompt(entries[index])) { start = index + 1; break; }
  }
  let askToolCalled = false;
  let lastText = '';
  for (const entry of entries.slice(start)) {
    if (entry?.type !== 'assistant') continue;
    for (const block of blocksOf(entry)) {
      if (block.type === 'tool_use' && core.QUESTION_TOOLS.claude.includes(block.name)) askToolCalled = true;
      if (block.type === 'text' && typeof block.text === 'string' && block.text.trim()) lastText = block.text;
    }
  }
  return { askToolCalled, lastText };
}

// ───────────────────────────────────────────────────────────────────
// 3. MAIN
// ───────────────────────────────────────────────────────────────────

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function evaluate(payload) {
  if (!payload || typeof payload !== 'object') return null;
  // A turn already sent back once ends normally, whatever it says.
  if (payload.stop_hook_active === true) return null;

  let turn = { askToolCalled: false, lastText: '' };
  try {
    turn = readTurn(transcriptEntries(payload.transcript_path));
  } catch {
    // No readable transcript: judge the message alone.
  }
  const lastMessage = typeof payload.last_assistant_message === 'string' && payload.last_assistant_message.trim()
    ? payload.last_assistant_message
    : turn.lastText;

  const result = core.evaluateTurn({ lastMessage, askToolCalled: turn.askToolCalled });
  if (result.verdict !== 'fire') return null;
  core.recordFire(typeof payload.cwd === 'string' && payload.cwd ? payload.cwd : process.cwd(), { runtime: 'claude', mode: 'reprompt' });
  return { decision: 'block', reason: core.repromptFor('claude') };
}

function main() {
  if (isHookEnabled(core.CONCERN) === false) return;
  let payload;
  try {
    payload = JSON.parse(readStdin());
  } catch {
    return;
  }
  const envelope = evaluate(payload);
  if (envelope) process.stdout.write(`${JSON.stringify(envelope)}\n`);
}

// ───────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  try {
    main();
  } catch (error) {
    // A guard failure must end the turn normally, never block it.
    process.stderr.write(`ask-surface-stop: ${error instanceof Error ? error.message : String(error)}\n`);
  }
  process.exitCode = 0;
}

module.exports = { evaluate, readTurn };
