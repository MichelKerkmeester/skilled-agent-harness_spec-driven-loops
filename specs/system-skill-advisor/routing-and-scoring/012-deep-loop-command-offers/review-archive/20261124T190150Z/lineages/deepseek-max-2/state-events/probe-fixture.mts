import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review';
const base = `${root}/.skilled/skills/system-skill-advisor/runtime`;
const ts = await import(pathToFileURL(`${base}/lib/command-attach.ts`).href);
const { attachCommand, asksForLoopRun, isStuckRunComplaint, isWritingAboutTopic } = ts;
const fixture = JSON.parse(readFileSync(`${base}/tests/fixtures/deep-loop-offer-cases.json`, 'utf8'));
const REVIEW = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const RESEARCH = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'research' }] };
const DEFER = { action: 'defer', selectionKind: 'none', targets: [] };
const LOOP_COMMANDS = { review: '/deep:review', research: '/deep:research' };

let bad = 0;
const note = (kind, id, expected, actual, prompt) => {
  bad += 1;
  console.log(`MISMATCH ${kind} id=${id} expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)} :: ${prompt}`);
};
for (const c of fixture.cases) {
  if (asksForLoopRun(c.prompt) !== c.asksForLoopRun) note('asksForLoopRun', c.id, c.asksForLoopRun, asksForLoopRun(c.prompt), c.prompt);
  if (c.stuckRun !== undefined && isStuckRunComplaint(c.prompt) !== c.stuckRun) note('stuckRun', c.id, c.stuckRun, isStuckRunComplaint(c.prompt), c.prompt);
  if (c.writingAbout !== undefined && isWritingAboutTopic(c.prompt) !== c.writingAbout) note('writingAbout', c.id, c.writingAbout, isWritingAboutTopic(c.prompt), c.prompt);
  if (c.typedReviewKept !== undefined) {
    const kept = attachCommand('system-deep-loop', REVIEW, c.prompt) === '/deep:review';
    if (kept !== c.typedReviewKept) note('typedReviewKept', c.id, c.typedReviewKept, kept, c.prompt);
  }
  if (c.typedRunsKept !== undefined) {
    const kept = [];
    for (const command of ['/deep:review', '/deep:research']) {
      const mode = command === '/deep:review' ? 'review' : 'research';
      if (attachCommand('system-deep-loop', mode === 'review' ? REVIEW : RESEARCH, c.prompt) === command) kept.push(command);
    }
    const want = [...c.typedRunsKept].sort();
    if (JSON.stringify(kept.sort()) !== JSON.stringify(want)) note('typedRunsKept', c.id, want, kept, c.prompt);
  }
  if (c.doctorWithheld !== undefined) {
    const kept = attachCommand('system-deep-loop', REVIEW, c.prompt) === '/doctor:deep-loop';
    if (kept !== !c.doctorWithheld) note('doctorWithheld', c.id, !c.doctorWithheld, kept, c.prompt);
  }
  if (c.servedRun !== undefined) {
    const got = attachCommand('system-deep-loop', DEFER, c.prompt) ?? null;
    const want = c.servedRun === null ? null : LOOP_COMMANDS[c.servedRun];
    if (got !== want) note('servedRun', c.id, want, got, c.prompt);
  }
}
console.log(`cases=${fixture.cases.length} mismatches=${bad}`);
