import { pathToFileURL } from 'node:url';

const base = '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime';
const ts = await import(pathToFileURL(`${base}/lib/command-attach.ts`).href);
const { attachCommand, asksForLoopRun, isStuckRunComplaint, isRunRefused, isNoEditRequest, typedCommandIn } = ts;

const reviewRoute = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const researchRoute = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'research' }] };
const deferRoute = { action: 'defer', selectionKind: 'none', targets: [] };

const cases = [
  ['R23a', 'skip the deep review and just answer', deferRoute],
  ['R23b', 'avoid deep research; answer from memory', deferRoute],
  ['R23c', 'there is no need for a deep review', reviewRoute],
  ['R23d', 'instead of a deep review, just explain the bug', reviewRoute],
  ['R23e', 'I refuse a deep review here', reviewRoute],
  ['R23f', 'do not even think about running a deep review', reviewRoute],
  ['R23g', 'skip straight to the deep review of the parser', reviewRoute],
  ['R23h', "don't hesitate to run a deep review", reviewRoute],
  ['R23i', "don't forget to run a deep review on the parser", reviewRoute],
  ['R24a', "the deep research run is stuck. please don't run anything", researchRoute],
  ['R24b', "my deep research run is stuck and I don't want a fix", researchRoute],
  ['R24c', 'my deep research run is stuck', researchRoute],
  ['R25a', 'run /deep:review on the parser, then /create:changelog', reviewRoute],
  ['R25b', '/deep:review the parser and then /doctor:deep-loop', reviewRoute],
  ['R26a', 'run a deep loop to review the research loop config', deferRoute],
  ['R26b', 'run a deep loop checking the parser for bugs', deferRoute],
  ['R27a', 'several passes of the linter failed, review the config', deferRoute],
  ['R27b', 'review the parser in several passes', deferRoute],
  ['R35a', 'run deep reviews on the parser and the scheduler', deferRoute],
  ['R35b', 'do two deep reviews of the auth module', deferRoute],
  ['R35c', 'run two deep-reviews on the parser', deferRoute],
  ['R35d', 'run two deep researches on vector indexes', deferRoute],
  ['R35e', 'run two deep-researches on vector indexes', deferRoute],
  ['R35f', 'run two research loops on the cache and pick the better one', deferRoute],
  ['R35g', 'run two review loops of the importer', deferRoute],
  ['R35h', 'my deep reviews are stuck after three passes', deferRoute],
  ['R35i', 'the deep reviews ran overnight', deferRoute],
  ['R35j', 'summarize the deep reviews from last week', deferRoute],
  ['R35k', 'how many deep reviews ran yesterday?', deferRoute],
  ['R35l', 'explain how the deep reviews decide to stop', deferRoute],
  ['R35m', 'run two deep loops on the cache layer', deferRoute],
  ['R36a', 'how do I run a deep review on this?', deferRoute],
  ['R36b', 'how can a deep research loop stop early?', deferRoute],
  ['R36c', 'how do I run a deep review? then run a deep review on the parser', deferRoute],
  ['R37a', 'the deep review loop is too slow', deferRoute],
  ['R37b', 'deep research runs cost too much', deferRoute],
  ['R37c', 'the deep review takes too long', deferRoute],
  ['R37d', 'improve the deep review', deferRoute],
  ['R37e', 'optimise the deep review', deferRoute],
  ['R37f', 'run a fast deep review on the parser', deferRoute],
  ['R37g', 'run a deep review slower', deferRoute],
  ['R37h', 'a deep review slower please', deferRoute],
  ['R37i', 'the deep review takes longer than the last one', deferRoute],
  ['R40a', "run a deep review of the parser but don't change anything", reviewRoute],
  ['R40b', 'run a deep review of the parser and make no changes', reviewRoute],
  ['R40c', 'run a deep research on cache eviction, read-only only', researchRoute],
  ['R41a', 'run deep reviews on the parser, but skip the deep research', deferRoute],
  ['R41b', 'skip the deep research, run a deep review on the parser', deferRoute],
  ['R41c', 'no deep research, run a deep review on the parser', deferRoute],
  ['R41d', 'run deep research on the parser, but skip the deep review', deferRoute],
  ['R42a', 'run a deep loop to review the research loop config', researchRoute],
  ['R43a', "the deep review didn't finish, run it again", deferRoute],
  ['R43b', 'my deep review run is stuck, rerun it', deferRoute],
  ['R43c', 'run it again to reproduce the crash', deferRoute],
  ['R43d', 'summarize the deep reviews from last week', deferRoute],
  ['R43e', 'give me a summary of the last deep review', deferRoute],
  ['R44a', 'run a deep review longer than the last one on the parser', deferRoute],
  ['R44b', 'the deep research run is stuck, /doctor:deep-loop', researchRoute],
  ['R44c', 'my research run is stuck; /doctor:deep-loop please', researchRoute],
  ['R44d', 'the loop stalled. /doctor:deep-loop now', researchRoute],
];

for (const [id, prompt, route] of cases) {
  let cmd = '-';
  try {
    cmd = attachCommand('system-deep-loop', route, prompt) ?? '-';
  } catch (error) {
    cmd = `ERROR:${error instanceof Error ? error.message : String(error)}`;
  }
  const ask = asksForLoopRun(prompt);
  const stuck = isStuckRunComplaint(prompt);
  const refused = isRunRefused(prompt);
  const noEdit = isNoEditRequest(prompt);
  const typed = typedCommandIn(prompt) ?? '-';
  console.log(`${id}\tcmd=${cmd}\task=${ask}\tstuck=${stuck}\trefused=${refused}\tnoEdit=${noEdit}\ttyped=${typed}\t${prompt}`);
}
