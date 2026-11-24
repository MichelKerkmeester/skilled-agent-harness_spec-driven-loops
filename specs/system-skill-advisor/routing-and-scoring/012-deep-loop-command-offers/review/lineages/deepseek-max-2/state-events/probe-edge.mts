import { pathToFileURL } from 'node:url';
const base = '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime';
const ts = await import(pathToFileURL(`${base}/lib/command-attach.ts`).href);
const REVIEW = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const RESEARCH = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'research' }] };
const DEFER = { action: 'defer', selectionKind: 'none', targets: [] };
const rows = [
  ['E01', 'my deep review run is stuck, run 5 more iterations', DEFER],
  ['E02', 'the deep review run is stuck, run it again', DEFER],
  ['E03', 'my deep research run is stuck, don\'t change anything', RESEARCH],
  ['E04', 'my deep research run is stuck, don\'t touch the code', RESEARCH],
  ['E05', 'run a deep review on the parser, but don\'t run /deep:research', REVIEW],
  ['E06', 'run a deep review on the parser and then skip it', DEFER],
  ['E07', 'how many passes does the deep review do', DEFER],
  ['E08', 'deep research: how do vector databases handle hybrid search', DEFER],
  ['E09', 'my deep review run is stuck, /deep:review again', REVIEW],
  ['E10', 'review the parser; the deep review config is fine', DEFER],
  ['E11', "don't do a deep review, just answer", DEFER],
  ['E12', 'not asking for a deep review, just explain', DEFER],
  ['E13', 'without running deep research, summarize the cache', DEFER],
  ['E14', 'run a deep review of the parser but do not fix anything', REVIEW],
  ['E15', 'the deep research run is stuck; /deep:review the parser', REVIEW],
  ['E16', 'run 8 more review iterations on the parser', DEFER],
];
for (const [id, prompt, route] of rows) {
  const cmd = attachCommandSafe(route, prompt);
  console.log(`${id}\tcmd=${cmd}\task=${ts.asksForLoopRun(prompt)}\tstuck=${ts.isStuckRunComplaint(prompt)}\tmentionOnly=${ts.commandOnlyMentioned(prompt, '/doctor:deep-loop')}\t${prompt}`);
}
function attachCommandSafe(route, prompt) {
  try { return ts.attachCommand('system-deep-loop', route, prompt) ?? '-'; } catch (e) { return `ERR:${e.message}`; }
}
