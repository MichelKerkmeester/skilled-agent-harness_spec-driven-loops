#!/usr/bin/env node
'use strict';

// Stands in for an executor CLI on the driver's agent lane. It hands the rendered
// rewrite brief to the orchestrator as a file, waits for the dispatched subagent's
// handback file and prints it, so the driver's gates, fact check and retries treat
// the subagent like any other executor.
//
// usage: agent-wait.cjs <last-message-file> <prompt>

const fs = require('fs');
const path = require('path');

const [lastMessageFile, prompt] = process.argv.slice(2);
if (!lastMessageFile || !prompt) {
  console.error('usage: agent-wait.cjs <last-message-file> <prompt>');
  process.exit(2);
}
const dir = path.join(__dirname, 'agent-queue');
fs.mkdirSync(dir, { recursive: true });
// A retry of the same attempt number reuses the driver's tag, so a stamp keeps each
// dispatch's brief distinct for the watcher that hands it to a subagent.
const tag = `${path.basename(lastMessageFile).replace(/\.last\.txt$/, '')}.${Date.now().toString(36)}`;
const promptFile = path.join(dir, `${tag}.prompt.md`);
const replyFile = path.join(dir, `${tag}.reply.txt`);

fs.rmSync(replyFile, { force: true });
// The rename publishes the brief whole, so a watcher never reads half of it.
fs.writeFileSync(`${promptFile}.tmp`, prompt);
fs.renameSync(`${promptFile}.tmp`, promptFile);

// A wait the driver kills marks its brief expired, so no late dispatch starts on a
// file the driver has already restored.
process.on('SIGTERM', () => {
  try { fs.renameSync(promptFile, `${promptFile}.expired`); } catch {}
  process.exit(1);
});

const timer = setInterval(() => {
  if (!fs.existsSync(replyFile)) return;
  clearInterval(timer);
  const reply = fs.readFileSync(replyFile, 'utf8');
  fs.writeFileSync(lastMessageFile, reply);
  try { fs.renameSync(promptFile, `${promptFile}.done`); } catch {}
  process.stdout.write(reply);
  process.exit(0);
}, 3000);
