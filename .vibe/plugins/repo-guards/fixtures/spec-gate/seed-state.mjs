#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Spec Gate State Seeder
// ───────────────────────────────────────────────────────────────────
// Seeds the open gate state a classify pass would have written, so the payload
// fixtures can exercise the deny without a model turn. Writes only under the
// gitignored runtime state directory, keyed the way the core keys it.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../../lib/hook-io.mjs';

const SESSION_ID = 'vibe-spec-gate-fixture';
const stateDir = join(REPO_ROOT, '.skilled', 'skills', '.state', 'spec-gate');
const statePath = join(stateDir, `${Buffer.from(SESSION_ID, 'utf8').toString('hex')}.json`);

mkdirSync(stateDir, { recursive: true });
writeFileSync(statePath, `${JSON.stringify({ status: 'open', askedAtMs: Date.now() }, null, 2)}\n`, 'utf8');
process.stdout.write(`${statePath}\n`);
