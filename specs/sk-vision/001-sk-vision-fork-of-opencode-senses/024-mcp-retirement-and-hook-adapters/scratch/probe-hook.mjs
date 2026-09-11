#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Event Delivery Probe
// ───────────────────────────────────────────────────────────────────
// Throwaway probe. Records that an event fired, then allows unconditionally.
// The event name arrives as argv[2] so one file can serve every registration.

import { appendFileSync } from 'node:fs';

const event = process.argv[2] ?? 'unknown';
const log = process.env.SK_PROBE_LOG ?? '/tmp/sk-cursor-probe.log';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const raw = await readStdin().catch(() => '');
appendFileSync(log, `FIRED ${event} bytes=${raw.length}\n`);
process.stdout.write(JSON.stringify({ permission: 'allow' }));
