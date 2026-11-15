#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe journal check
// ───────────────────────────────────────────────────────────────────
// Reads every session journal under a Vibe home's unified session log and
// answers one question per call, so a live scenario judges hook output from
// ordered records, not from loose text matches. A journal repeats a hook's
// text in later model inputs, so a plain grep cannot tie it to one tool call.
//   model <alias>             the session config pinned that model alias
//   compaction                an automatic compaction checkpoint was recorded
//   reinjection               a post_tool_call result after that checkpoint
//                             carries the restored-context block
//   post-tool-has <text> <present>
//                             the latest post_tool_call result carrying <text>
//                             also carries <present>
//   post-tool-lacks <text> <absent>
//                             the latest post_tool_call result carrying <text>
//                             does not carry <absent>
// Each post-tool question judges one tool call's own result, never a count:
// a model may repeat a call, and Vibe moves older records into a snapshot
// generation as a session grows.
// Prints one result line and exits 0 when the answer is yes, 1 when it is no.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RESTORED_HEADING = 'Context restored after a compaction.';

/**
 * List the session folders under a unified log root.
 *
 * @param {string} root - `$VIBE_HOME/logs/session/unified`.
 * @returns {string[]} Session folder paths.
 */
function sessionFolders(root) {
  try {
    return fs.readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(root, entry.name));
  } catch {
    return [];
  }
}

/**
 * Read a session's journal records in sequence order.
 *
 * @param {string} folder - Session folder.
 * @returns {Object[]} Parsed records.
 */
function journalRecords(folder) {
  const dir = path.join(folder, 'journal');
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((name) => name.endsWith('.jsonl')).sort();
  } catch {
    return [];
  }
  const records = [];
  for (const name of files) {
    for (const line of fs.readFileSync(path.join(dir, name), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try {
        records.push(JSON.parse(line));
      } catch {
        // A torn last line while the session is writing is skipped.
      }
    }
  }
  return records.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
}

/**
 * Find the first automatic compaction checkpoint's sequence.
 *
 * @param {Object[]} records - Journal records.
 * @returns {number|null} Sequence, or null when none was recorded.
 */
function compactionSequence(records) {
  for (const record of records) {
    const delta = record.payload && Array.isArray(record.payload.delta) ? record.payload.delta : [];
    if (delta.some((op) => op && op.entry && op.entry.kind === 'compaction')) return record.sequence;
  }
  return null;
}

/**
 * Find the first post_tool_call result after a sequence that carries the restored block.
 *
 * @param {Object[]} records - Journal records.
 * @param {number} after - Compaction sequence.
 * @returns {number|null} Sequence, or null when no such result exists.
 */
function reinjectionSequence(records, after) {
  for (const record of records) {
    if (record.sequence <= after || record.type !== 'action_result') continue;
    const inner = record.payload && record.payload.result && record.payload.result.result;
    if (!inner || inner.hook !== 'post_tool_call') continue;
    if (JSON.stringify(inner.output || {}).includes(RESTORED_HEADING)) return record.sequence;
  }
  return null;
}

/**
 * Collect the output text of every post_tool_call result.
 *
 * @param {Object[]} records - Journal records.
 * @returns {string[]} One serialized output per result.
 */
function postToolOutputs(records) {
  const outputs = [];
  for (const record of records) {
    if (record.type !== 'action_result') continue;
    const inner = record.payload && record.payload.result && record.payload.result.result;
    if (inner && inner.hook === 'post_tool_call') outputs.push(JSON.stringify(inner.output || {}));
  }
  return outputs;
}

/**
 * Read the model alias a session's config pinned.
 *
 * @param {string} folder - Session folder.
 * @returns {string|null} Alias, or null when the meta file is missing.
 */
function activeModel(folder) {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(folder, 'meta.json'), 'utf8'));
    return (meta.config && meta.config.active_model) || null;
  } catch {
    return null;
  }
}

/**
 * Answer the requested question across every session under the root.
 *
 * @param {string[]} argv - Command-line arguments after the script.
 * @returns {number} Exit status.
 */
function main(argv) {
  const [root, question, value, other] = argv;
  const postTool = ['post-tool-has', 'post-tool-lacks'];
  const known = ['model', 'compaction', 'reinjection', ...postTool];
  if (
    !root
    || !known.includes(question)
    || (question === 'model' && !value)
    || (postTool.includes(question) && (!value || !other))
  ) {
    process.stdout.write('usage: journal-check.cjs <unified-root> model <alias>|compaction|reinjection|post-tool-has <text> <present>|post-tool-lacks <text> <absent>\n');
    return 2;
  }
  const folders = sessionFolders(root);
  if (postTool.includes(question)) {
    const matches = folders
      .flatMap((folder) => postToolOutputs(journalRecords(folder)))
      .filter((output) => output.includes(value));
    if (matches.length === 0) {
      process.stdout.write('no post_tool_call result carries the text\n');
      return 1;
    }
    const carries = matches[matches.length - 1].includes(other);
    const yes = question === 'post-tool-has' ? carries : !carries;
    process.stdout.write(`latest matching post_tool_call result ${carries ? 'carries' : 'does not carry'} the second text\n`);
    return yes ? 0 : 1;
  }
  if (question === 'model') {
    const models = folders.map(activeModel).filter(Boolean);
    const hit = models.includes(value);
    process.stdout.write(hit ? `active-model ${value}\n` : `active model is ${models.join(',') || 'unknown'}, not ${value}\n`);
    return hit ? 0 : 1;
  }
  for (const folder of folders) {
    const records = journalRecords(folder);
    const compaction = compactionSequence(records);
    if (compaction === null) continue;
    if (question === 'compaction') {
      process.stdout.write(`compaction-checkpoint at sequence ${compaction}\n`);
      return 0;
    }
    const reinjection = reinjectionSequence(records, compaction);
    if (reinjection !== null) {
      process.stdout.write(`reinjection in post_tool_call at sequence ${reinjection}, after compaction at ${compaction}\n`);
      return 0;
    }
  }
  process.stdout.write(question === 'compaction' ? 'no compaction checkpoint\n' : 'no post_tool_call re-injection after a compaction\n');
  return 1;
}

process.exitCode = main(process.argv.slice(2));
