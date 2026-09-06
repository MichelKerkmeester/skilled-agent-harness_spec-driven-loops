// Script-style assertions for the retrieval trace contract, mirroring the
// colocated *.test.ts convention in shared/parsing. Run directly (tsx/node
// type stripping); throws on the first failing assertion.

import { addTraceEntry, createTrace } from './retrieval-trace.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

const trace = createTrace('find the save workflow', 'session-1', 'lookup');
assert(trace.query === 'find the save workflow' && trace.stages.length === 0, 'createTrace starts with no stages');
assert(typeof trace.traceId === 'string' && trace.traceId.length > 0, 'createTrace mints a trace id');

addTraceEntry(trace, 'candidate', 10, 3, 12);
assert(trace.stages.length === 1, 'addTraceEntry appends one stage');
assert(trace.totalDurationMs === 12, 'addTraceEntry accumulates duration');

process.stdout.write('retrieval trace ok\n');
