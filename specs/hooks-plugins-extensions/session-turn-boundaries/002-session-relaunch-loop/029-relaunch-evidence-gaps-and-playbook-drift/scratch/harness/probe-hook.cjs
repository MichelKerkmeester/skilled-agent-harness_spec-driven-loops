'use strict';
// Read-only probe registered through a --settings overlay beside the repository hooks.
// It records what the context-nudge hook can see at the same moment: the transcript's
// latest main-chain assistant usage and the session's nudge state file.
const fs = require('node:fs');
const path = require('node:path');

const hooksRoot = process.env.PROBE_HOOKS_ROOT;
const logPath = process.env.PROBE_LOG;
const chunks = [];
process.stdin.on('data', (chunk) => chunks.push(chunk));
process.stdin.on('end', () => {
  let payload = {};
  try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch {}
  const rec = {
    ts: new Date().toISOString(),
    ev: payload.hook_event_name,
    tool: payload.tool_name,
    transcript: payload.transcript_path,
    prompt: typeof payload.prompt === 'string' ? payload.prompt.slice(0, 48) : undefined,
  };
  try {
    const usage = require(path.join(hooksRoot, 'lib', 'context-usage.cjs'));
    const fill = usage.readClaudeFill(payload.transcript_path);
    rec.fill = fill ? fill.fillTokens : null;
    const lines = fs.readFileSync(payload.transcript_path, 'utf8').split('\n').filter(Boolean);
    rec.transcriptLines = lines.length;
    let assistants = 0;
    let lastAssistant = null;
    for (const line of lines) {
      let entry;
      try { entry = JSON.parse(line); } catch { continue; }
      if (entry.type === 'assistant' && entry.isSidechain !== true) {
        assistants += 1;
        lastAssistant = entry;
      }
    }
    rec.assistantEntries = assistants;
    if (lastAssistant) {
      const u = lastAssistant.message?.usage || {};
      rec.lastAssistant = {
        ts: lastAssistant.timestamp,
        stop: lastAssistant.message?.stop_reason ?? null,
        in: u.input_tokens, cacheRead: u.cache_read_input_tokens, cacheCreate: u.cache_creation_input_tokens, out: u.output_tokens,
        blocks: (lastAssistant.message?.content || []).map((b) => b.type).join(','),
      };
    }
    const lastLine = lines.length ? JSON.parse(lines[lines.length - 1]) : null;
    rec.lastEntryType = lastLine ? lastLine.type : null;
  } catch (error) { rec.err = String(error.message).slice(0, 120); }
  try {
    const stateRoot = process.env.XDG_RUNTIME_DIR
      ? path.join(process.env.XDG_RUNTIME_DIR, 'skilled-relaunch')
      : null;
    if (stateRoot && payload.session_id) {
      rec.nudge = fs.readFileSync(path.join(stateRoot, `nudge-${payload.session_id}.json`), 'utf8').trim();
    }
  } catch { rec.nudge = null; }
  try { fs.appendFileSync(logPath, `${JSON.stringify(rec)}\n`); } catch {}
  process.exit(0);
});
