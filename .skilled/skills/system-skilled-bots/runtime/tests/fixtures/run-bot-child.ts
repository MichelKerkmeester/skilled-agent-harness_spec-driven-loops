// ───────────────────────────────────────────────────────────────────
// MODULE: Run-Bot Child Driver
// ───────────────────────────────────────────────────────────────────
//
// Runs one bot in its own process, so a test can hold two runs alive at
// once or kill one outright. It calls the runner directly instead of the
// bots CLI, so these tests depend only on the runner. The input is one JSON
// argument; the outcome is printed as one JSON line.

import { runBot } from '../../lib/runner.js';

import type { RunBotInput } from '../../lib/runner.js';

const input = JSON.parse(process.argv[2] ?? '{}') as RunBotInput;
const outcome = await runBot({ ...input, guard: { ancestryCmdlines: [], statePaths: [] }, senders: {} });
process.stdout.write(`${JSON.stringify(outcome)}\n`);
