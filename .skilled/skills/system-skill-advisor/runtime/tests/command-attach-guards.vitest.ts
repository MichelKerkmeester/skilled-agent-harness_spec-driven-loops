// ───────────────────────────────────────────────────────────────
// MODULE: Command attach guards
// ───────────────────────────────────────────────────────────────

// A hub route names the command that acts on the mode it picked, so it has to
// honour the same no-edit wording the scorer honours. A reader who rules out a
// change must not be handed a command that changes files.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  asksForLoopRun,
  attachCommand,
  commandOnlyMentioned,
  isNoEditRequest,
  isStuckRunComplaint,
  MODE_COMMANDS,
  NO_EDIT_REQUEST,
  typedCommandForTop,
  typedCommandIn,
  typedCommandsIn,
} from '../lib/command-attach.js';

// The only route shape that names a command unambiguously: one decision and one
// selected target.
function SINGLE(workflowMode: string): Record<string, unknown> {
  return { action: 'route', selectionKind: 'single', targets: [{ workflowMode }] };
}

// The endings a reader uses to rule out a change. One writes the contraction
// with a curly apostrophe, which is the form many keyboards produce.
const NOEDIT4 = [
  "don't change anything yet",
  'no changes yet',
  'don\u2019t touch any files',
  'make no changes',
];

// The prompts that name a command to refuse it or ask about it, the prompts that
// ask for the command, and the prompts that hold a refusal or question word and
// still ask for the command.
const REFUSE8: ReadonlyArray<readonly [string, string]> = [
  ['do not run /speckit:complete yet, just explain what it does', '/speckit:complete'],
  ['I never want to use /create:agent again, delete the agent file', '/create:agent'],
  ['someone ran /speckit:save by accident, how do I undo what it wrote', '/speckit:save'],
  ['please do not start /deep:research, I only want a two line summary of the readme', '/deep:research'],
  ['what does /create:readme do?', '/create:readme'],
  ['do not run it, just tell me what /doctor:update would change', '/doctor:update'],
  ['explain /deep:review to me', '/deep:review'],
  ['skip /create:readme, just append one line to the existing README', '/create:readme'],
];

const QUESTION2: ReadonlyArray<readonly [string, string]> = [
  ['is /speckit:complete overkill for a two line fix?', '/speckit:complete'],
  ['should I use /deep:research for this or just read the two files myself?', '/deep:research'],
];

const REQUEST6: ReadonlyArray<readonly [string, string]> = [
  ['run /speckit:complete for the rate limiter', '/speckit:complete'],
  ['/create:agent security-reviewer', '/create:agent'],
  ["don't forget to run /speckit:save", '/speckit:save'],
  ['explain the diff then run /speckit:save', '/speckit:save'],
  ['use /speckit:plan, not /speckit:complete', '/speckit:plan'],
  ['I ran /speckit:plan yesterday, now run /speckit:implement', '/speckit:implement'],
];

const CONTROL5: ReadonlyArray<readonly [string, string]> = [
  ['dont guess, run /speckit:plan', '/speckit:plan'],
  ['never mind just run /speckit:save', '/speckit:save'],
  ['not sure, use /create:readme', '/create:readme'],
  ['without asking, run /speckit:complete', '/speckit:complete'],
  ['can you run /speckit:plan?', '/speckit:plan'],
];

describe('command attach on a no-edit prompt', () => {
  it('offers no hub command when the prompt rules out a change', () => {
    const prompt = 'use sk-doc to create a skill called invoice-parser, do not change anything yet';
    expect(attachCommand('sk-doc', SINGLE('sk-create-skill'), prompt)).toBeUndefined();
  });

  it('offers the command when the same prompt asks for the change', () => {
    const prompt = 'use sk-doc to create a skill called invoice-parser';
    expect(attachCommand('sk-doc', SINGLE('sk-create-skill'), prompt)).toBe('/create:sk-skill');
  });

  it('reads the shared no-edit wording', () => {
    expect(NO_EDIT_REQUEST.test('just show me the plan')).toBe(true);
  });

  it.each(NOEDIT4)('offers no hub command when the prompt ends %s', (ending) => {
    const prompt = 'use sk-doc to create an agent called invoice-parser, ' + ending;
    expect(attachCommand('sk-doc', SINGLE('sk-create-agent'), prompt)).toBeUndefined();
  });

  it('offers the agent command when the prompt asks for the change', () => {
    const prompt = 'use sk-doc to create an agent called invoice-parser';
    expect(attachCommand('sk-doc', SINGLE('sk-create-agent'), prompt)).toBe('/create:agent');
  });

  it('reads a curly apostrophe as a straight one', () => {
    expect(isNoEditRequest('Don\u2019t touch any files')).toBe(true);
    expect(isNoEditRequest('touch the files')).toBe(false);
  });

  // A change request can say what must stay the same, and that is still a
  // request for the change.
  it.each([
    'refactor the parser so there are no changes to its public api',
    'fix the flaky test and make sure there are no changes in behaviour',
    'create an agent called invoice-parser with no changes to existing agents',
    "create an agent called invoice-parser, don't add tools",
    "refactor the parser, don't delete the old tests",
  ])('keeps a change request that limits its scope: %s', (prompt) => {
    expect(isNoEditRequest(prompt)).toBe(false);
  });

  // The phrase reads as no change whatever follows it. The first row is a real
  // no-edit request. The second is a change request that pays for the safe
  // reading by losing its command.
  it.each([
    "show me the plan, don't make any changes",
    'walk me through the fix, do not make changes',
    'list the stale docs, dont change anything',
    'use sk-doc to create an agent called invoice-parser, dont create it yet',
    "outline the readme, don't write anything",
  ])('reads a refusal to make changes as ruling out a change: %s', (prompt) => {
    expect(isNoEditRequest(prompt)).toBe(true);
  });

  it.each([
    'show me the plan and make no changes to the files',
    'refactor the parser and make no changes to its public api',
  ])('reads make no changes as ruling out a change: %s', (prompt) => {
    expect(isNoEditRequest(prompt)).toBe(true);
  });
});

describe('a command the prompt only mentions', () => {
  it.each(REFUSE8)('reads %s as a mention of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it.each(QUESTION2)('reads the question %s as a mention of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it.each(REQUEST6)('reads %s as a request for %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(false);
  });

  it.each(CONTROL5)('reads %s as a request for %s beside a refusal word', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(false);
  });

  it.each([
    ['do not run /create:agent or /create:readme', '/create:readme'],
    ['never use /create:readme or /create:feature-catalog', '/create:feature-catalog'],
    ['do not run /deep:review, or /deep:research', '/deep:research'],
    ['skip /create:agent or /create:readme', '/create:readme'],
    ['do not run /speckit:plan or /speckit:implement or /speckit:complete', '/speckit:complete'],
    ['do not run /create:agent or the /create:readme command', '/create:readme'],
    ['do not run /create:agent, or the /create:readme command', '/create:readme'],
    ['skip /create:agent or the /create:readme command', '/create:readme'],
    ['never use the /create:readme command or the /create:feature-catalog command', '/create:feature-catalog'],
    ['do not run /doctor:ci report or /create:readme', '/create:readme'],
    ['do not run /doctor:ci report or /doctor:ci scaffold', '/doctor:ci scaffold'],
    ['never use /doctor:git hooks or /doctor:skill-advisor tune', '/doctor:skill-advisor tune'],
  ])('reads %s as a refusal of %s through an or-list', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  // Chat wraps a command name in code, quote or bold marks, and a renamed command
  // is still typed under its old name. Neither may change what the naming reads
  // as, so every fixture must read the same wrapped or retired as it does plain.
  const WRAPPERS: ReadonlyArray<readonly [string, string]> = [
    ['`', '`'], ["'", "'"], ['"', '"'], ['\u201c', '\u201d'], ['\u2018', '\u2019'], ['**', '**'],
    ['[', ']'], ['(', ')'], ['~~', '~~'], ['<code>', '</code>'], ['\u00ab', '\u00bb'], ['\u2032', '\u2032'],
  ];
  const PLAIN_ROWS = [...REFUSE8, ...QUESTION2, ...REQUEST6, ...CONTROL5,
    ['do not run /create:agent or /create:readme', '/create:readme'],
    ['skip /create:agent or the /create:readme command', '/create:readme'],
  ] as const;

  it.each(WRAPPERS)('reads every fixture wrapped in %s the same as plain', (open, close) => {
    for (const [prompt, command] of PLAIN_ROWS) {
      const wrapped = prompt.replace(/\/[a-z][a-z-]*:[a-z][a-z-]*/g, (name) => `${open}${name}${close}`);
      expect(commandOnlyMentioned(wrapped, command), wrapped).toBe(commandOnlyMentioned(prompt, command));
    }
  });

  it('reads every fixture under the retired name the same as under the current one', () => {
    for (const [prompt, command] of PLAIN_ROWS) {
      const plain = prompt.split(command).join('/create:sk-skill');
      const retired = prompt.split(command).join('/create:skill');
      expect(commandOnlyMentioned(retired, '/create:sk-skill'), retired)
        .toBe(commandOnlyMentioned(plain, '/create:sk-skill'));
    }
  });

  // A refusal can follow the name it refuses, so the words after a naming are
  // read for a refusal of "it" as well as for a request.
  it.each([
    ['/create:readme is not what I want, do not run it', '/create:readme'],
    ['run /doctor:git setup but do not actually run it', '/doctor:git setup'],
    ["/speckit:complete came up, but please don't start it", '/speckit:complete'],
  ])('reads the later refusal in %s as a mention of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it.each([
    ["run /speckit:save and don't skip it", '/speckit:save'],
    ["run /speckit:save and don't run it twice", '/speckit:save'],
    ['run /deep:review but never run it without a budget', '/deep:review'],
    ['open the /deep:review command file, then run it', '/deep:review'],
    ['read the /deep:review docs, then do a thorough review of this diff', '/deep:review'],
  ])('still reads %s as a request for %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(false);
  });

  // A command named as a document is being read about, not run.
  it.each([
    ['read the /create:readme document and tell me what it does', '/create:readme'],
    ['open the /deep:review command file and summarize it', '/deep:review'],
  ])('reads %s as a mention of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it('still reads a typed command whose argument is a file as a request', () => {
    expect(commandOnlyMentioned('/create:diff file a.md b.md', '/create:diff')).toBe(false);
  });

  // A run command acts without asking, so an unled naming of it needs a use verb
  // or the name opening a sentence before it counts as a request.
  it.each([
    ['no need for /doctor:deep-loop, I will handle it myself', '/doctor:deep-loop', true],
    ['the /doctor:speckit output looked odd yesterday', '/doctor:speckit', true],
    ['/doctor:deep-loop', '/doctor:deep-loop', false],
    ['please run /doctor:deep-loop on this packet', '/doctor:deep-loop', false],
    ['the loop stalled. /doctor:deep-loop now', '/doctor:deep-loop', false],
    ['can you kick off /doctor:speckit for me', '/doctor:speckit', false],
    ['/doctor:install - is it safe?', '/doctor:install', true],
    ['/doctor:speckit, cancel that', '/doctor:speckit', true],
    ['run /doctor:deep-loop, on second thought do not', '/doctor:deep-loop', true],
    ['/doctor:deep-loop on this packet please', '/doctor:deep-loop', false],
  ])('reads the run command naming %s as a mention: %s', (prompt, command, mentioned) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(mentioned);
  });

  // A doc path that holds the name is a file, not a naming, so it cannot undo the
  // refusal of the command itself.
  it('reads a led refusal beside a doc path of the same command as a mention', () => {
    expect(commandOnlyMentioned('do not run /create:readme, read /create:readme.md', '/create:readme')).toBe(true);
  });

  // Markup around the name must not hide the lead before it.
  it.each([
    ['do not run `/create:readme`, just tell me what it covers', '/create:readme'],
    ['what does `/create:readme` do?', '/create:readme'],
    ['never use **/deep:review** here', '/deep:review'],
    ['do not run "/create:readme" yet', '/create:readme'],
    ["do not run '/create:readme' yet", '/create:readme'],
    ["what's '/create:readme' for?", '/create:readme'],
    ['never use ‘/deep:review’ here', '/deep:review'],
    ['do not run “/create:readme” yet', '/create:readme'],
  ])('reads the marked-up %s as a mention of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it('still reads a marked-up request as a request', () => {
    expect(commandOnlyMentioned('run `/create:readme` for the advisor skill', '/create:readme')).toBe(false);
    expect(commandOnlyMentioned("run '/create:readme' for the advisor skill", '/create:readme')).toBe(false);
    expect(commandOnlyMentioned("don't skip '/create:readme', run it", '/create:readme')).toBe(false);
  });

  it.each([
    ["do not run '/create:agent' or '/create:readme'", '/create:readme'],
    ["do not run '/doctor:ci report' or '/create:readme'", '/create:readme'],
  ])('reads the quoted or-list %s as a refusal of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  // A retired name maps to the command that replaced it, so refusing the old
  // spelling refuses the new command too.
  it('reads a refusal of a retired name as a refusal of its replacement', () => {
    expect(commandOnlyMentioned('do not run /create:skill', '/create:sk-skill')).toBe(true);
    expect(commandOnlyMentioned('what does /create:skill do?', '/create:sk-skill')).toBe(true);
    expect(commandOnlyMentioned('run /create:skill for my new helper', '/create:sk-skill')).toBe(false);
  });

  it.each([
    ['use /create:agent or /create:readme', '/create:agent'],
    ['use /create:agent or /create:readme', '/create:readme'],
    ['use /speckit:plan, not /speckit:complete', '/speckit:plan'],
    ['do not run /speckit:complete, run /speckit:plan or /speckit:implement', '/speckit:plan'],
    ['do not run /speckit:complete, run /speckit:plan or /speckit:implement', '/speckit:implement'],
    ['do not run /speckit:complete or run /speckit:plan', '/speckit:plan'],
    ['use /create:agent or the /create:readme command', '/create:readme'],
    ['the next step is /create:agent or /create:readme', '/create:readme'],
    ['use /doctor:ci report or /create:readme', '/create:readme'],
  ])('still reads %s as a request for %s beside an or-list', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(false);
  });

  // A bare lead opens a statement as often as a question, so it marks a mention
  // only before a question. One led occurrence does not make a request either
  // when a later occurrence of the same command is not led.
  it.each([
    ['the next step is /speckit:implement', '/speckit:implement'],
    ['the next step is the /speckit:implement command', '/speckit:implement'],
    ['is this right? run /speckit:plan', '/speckit:plan'],
    ['the next step is /speckit:implement\nany questions?', '/speckit:implement'],
    ['what does /speckit:save do? ok now run /speckit:save', '/speckit:save'],
    ['the plan is /speckit:plan then tests', '/speckit:plan'],
  ])('reads %s as a request for %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(false);
  });

  // A chat question often leaves the question mark off, so a bare ask word that
  // opens a sentence still marks the command as the subject.
  it.each([
    ['is /speckit:resume safe to run twice', '/speckit:resume'],
    ['does /doctor:git change files or just report problems', '/doctor:git'],
    ['can /prompt:improve make a vague request easier to follow', '/prompt:improve'],
    ['ok. is /speckit:plan enough here', '/speckit:plan'],
    ['quick question? is /speckit:resume safe to run twice', '/speckit:resume'],
    ['Is the /doctor:update command safe?', '/doctor:update'],
  ])('reads %s as a question about %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it.each([
    ['should I run /create:agent or /create:readme?', '/create:readme'],
    ['is /create:agent or /create:readme better?', '/create:readme'],
    ['what does /create:agent or /create:readme do?', '/create:readme'],
  ])('reads %s as a question about %s through an or-list', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it('reads each command of a two-command prompt on its own', () => {
    expect(commandOnlyMentioned('use /speckit:plan, not /speckit:complete', '/speckit:complete')).toBe(true);
  });

  it('reads a curly apostrophe as a straight one', () => {
    expect(commandOnlyMentioned('don\u2019t run /speckit:save', '/speckit:save')).toBe(true);
  });

  it('reads no need to run as a refusal of the command', () => {
    expect(commandOnlyMentioned('no need to run /doctor:setup, the hooks are fine', '/doctor:setup')).toBe(true);
  });

  it('still reads a request after no need to ask', () => {
    expect(commandOnlyMentioned('no need to ask, run /speckit:save', '/speckit:save')).toBe(false);
  });

  it('reads stop using as a refusal of the command', () => {
    expect(commandOnlyMentioned('stop using /create:changelog for this, write the changelog entry by hand', '/create:changelog')).toBe(true);
  });

  it('still reads a request after stop and', () => {
    expect(commandOnlyMentioned('stop and run /speckit:plan', '/speckit:plan')).toBe(false);
  });

  it('reads why not use as a request for the command', () => {
    expect(commandOnlyMentioned('why not use /create:agent for this? go ahead and make a security reviewer agent', '/create:agent')).toBe(false);
  });

  it.each([
    ['I have not run /speckit:plan yet, please start it for the login feature', '/speckit:plan'],
    ['I already ran /create:readme but the output was wrong, run it again for the hooks folder', '/create:readme'],
    ['not run /speckit:plan yet, write notes to /tmp/notes.md, then run it', '/speckit:plan'],
    ['not run /speckit:plan yet, read https://example.com/spec first, then run it', '/speckit:plan'],
  ])('reads %s as a request for %s made by a later clause', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(false);
  });

  it.each([
    ['do not run /speckit:complete, I will run it myself later', '/speckit:complete'],
    ['do not use /create:agent, use that other one', '/create:agent'],
    ['do not run /speckit:complete, run /speckit:plan for the rate limiter instead', '/speckit:complete'],
    ['do not run /speckit:complete, run /speckit:plan, then run it for the auth module', '/speckit:complete'],
  ])('still reads %s as a mention of %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it('does not read a longer command name as the shorter one', () => {
    expect(commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')).toBe(false);
  });

  it.each([
    'what does /create:readme do?',
    'skip /create:readme, just append one line to the existing README',
    'do not run /create:agent or /create:readme',
  ])('offers no hub command for %s', (prompt) => {
    expect(attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)).toBeUndefined();
  });

  it('offers no deep-loop command the prompt refuses', () => {
    const deepLoopModes = MODE_COMMANDS['system-deep-loop'];
    const mode = Object.keys(deepLoopModes).find((key) => deepLoopModes[key] === '/deep:research');
    expect(mode, 'the generated table names the research mode').toBeDefined();
    expect(attachCommand('system-deep-loop', SINGLE(mode!), 'please do not start /deep:research, I only want a two line summary of the readme')).toBeUndefined();
  });

  it('still offers the hub command a plain request routes to', () => {
    expect(attachCommand('sk-doc', SINGLE('sk-create-readme'), 'write a readme for the doctor scripts folder')).toBe('/create:readme');
  });
});

describe('command attach on a small edit', () => {
  it.each([
    'update the README typo in line 3',
    'fix the typo in the README',
    'correct the spelling in the hooks readme',
    'fix the broken link in the install guide readme',
  ])('offers no creation command for %s', (prompt) => {
    expect(attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)).toBeUndefined();
  });

  it.each([
    'write a readme for the doctor scripts folder',
    'create a readme for the payments module, check it for typos when done',
  ])('still offers the creation command for %s', (prompt) => {
    expect(attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)).toBe('/create:readme');
  });

  it.each([
    ['sk-doc', 'sk-create-agent', 'build an agent that fixes typos in our docs'],
    ['sk-doc', 'sk-create-readme', 'writing a readme for the grammar module'],
    ['sk-doc', 'sk-create-readme', 'add a readme for the spelling package'],
    ['sk-doc', 'sk-create-changelog', 'add a changelog entry for the typo fixes in the cli help'],
  ])('still offers the creation command on %s %s for %s', (skill, mode, prompt) => {
    expect(attachCommand(skill, SINGLE(mode), prompt)).toBe(MODE_COMMANDS[skill][mode]);
  });

  it('leaves the wording commands outside the gate', () => {
    const docModes = MODE_COMMANDS['sk-doc'];
    const mode = Object.keys(docModes).find((key) => docModes[key] === '/create:with-human-voice');
    expect(mode, 'the generated table names the human voice mode').toBeDefined();
    expect(attachCommand('sk-doc', SINGLE(mode!), 'humanize the wording in the onboarding guide')).toBe('/create:with-human-voice');
  });

  it.each([
    ['sk-create-changelog', 'changelog for v2.1, it fixes the broken link checker and spelling errors'],
    ['sk-create-changelog', 'log the spelling fixes in the changelog'],
    ['sk-create-readme', 'document the cli in a readme, each flag gets a one line description'],
    ['sk-create-readme', 'readme for the spelling package'],
    ['sk-create-agent', 'an agent that fixes typos'],
  ])('keeps the creation command for %s on %s', (mode, prompt) => {
    expect(attachCommand('sk-doc', SINGLE(mode), prompt)).toBe(MODE_COMMANDS['sk-doc'][mode]);
  });

  it('keeps the goal command when the goal is about fixes', () => {
    const docModes = MODE_COMMANDS['sk-doc'];
    const mode = Object.keys(docModes).find((key) => docModes[key] === '/create:goal');
    expect(mode, 'the generated table names the goal mode').toBeDefined();
    expect(attachCommand('sk-doc', SINGLE(mode!), 'set a goal to fix all the typos in the docs')).toBe('/create:goal');
  });

  it.each([
    'fix the broken links in the install guide readme',
    'fix the dead links in the hooks readme',
  ])('offers no creation command for %s', (prompt) => {
    expect(attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)).toBeUndefined();
  });

  it('leaves a command outside the create namespace alone', () => {
    const deepLoopModes = MODE_COMMANDS['system-deep-loop'];
    const mode = Object.keys(deepLoopModes).find((key) => deepLoopModes[key] === '/deep:review');
    expect(mode, 'the generated table names the review mode').toBeDefined();
    expect(attachCommand('system-deep-loop', SINGLE(mode!), 'do a thorough deep review of the typo handling')).toBe('/deep:review');
  });

  it.each([
    ['sk-create-agent', 'an agent to fix typos'],
    ['sk-create-agent', 'give me an agent to fix broken links in the docs'],
    ['sk-create-agent', 'I want an agent to correct spelling in pull requests'],
  ])('keeps the creation command for %s on %s', (mode, prompt) => {
    expect(attachCommand('sk-doc', SINGLE(mode), prompt)).toBe(MODE_COMMANDS['sk-doc'][mode]);
  });

  // A skill or a command names its own purpose, so a correction word inside that
  // purpose is the reason the artifact exists and not a request to edit one.
  it.each([
    ['/create:sk-skill', 'a skill to correct spelling in markdown'],
    ['/create:command', "I'd like a command to fix dead links"],
  ])('keeps the command %s on %s', (command, prompt) => {
    const docModes = MODE_COMMANDS['sk-doc'];
    const mode = Object.keys(docModes).find((key) => docModes[key] === command);
    expect(mode, 'the generated table names the ' + command + ' mode').toBeDefined();
    expect(attachCommand('sk-doc', SINGLE(mode!), prompt)).toBe(command);
  });

  // A repo rule or a benchmark also names its purpose the way an agent does, so
  // the correction word belongs to what the artifact is for rather than to an
  // edit of a document that already exists.
  it.each([
    'I want a repo rule that says fix typos in the same commit',
    'repo rule: always fix typos in the same commit',
  ])('keeps the repo-rule command on %s', (prompt) => {
    const docModes = MODE_COMMANDS['sk-doc'];
    const mode = Object.keys(docModes).find((key) => docModes[key] === '/create:repo-rule');
    expect(mode, 'the generated table names the repo rule mode').toBeDefined();
    expect(attachCommand('sk-doc', SINGLE(mode!), prompt)).toBe('/create:repo-rule');
  });

  it('keeps the benchmark command on benchmark how fast we fix typos', () => {
    const docModes = MODE_COMMANDS['sk-doc'];
    const mode = Object.keys(docModes).find((key) => docModes[key] === '/create:benchmark');
    expect(mode, 'the generated table names the benchmark mode').toBeDefined();
    expect(attachCommand('sk-doc', SINGLE(mode!), 'benchmark how fast we fix typos')).toBe('/create:benchmark');
  });
});

describe('command attach on a deep-loop prompt', () => {
  it('withholds the review command when another deep-loop command is named', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'what did /deep:ai-council decide')).toBeUndefined();
  });

  it('withholds the review command when an unknown deep-loop command is named', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'what did /deep:reviw decide')).toBeUndefined();
  });

  it('offers the review command when it is the command typed', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'run /deep:review now')).toBe('/deep:review');
  });

  // Depth wording asks for care inside one pass, so only wording that names the
  // loop itself opens the gate.
  it.each([
    'review the parser in depth',
    'do a thorough review of the parser',
    'find out everything you can about the parser',
    'give me a final verdict on the parser',
    'review the parser thoroughly',
    'do an exhaustive review of the parser',
    'do a deep dive review of the parser',
  ])('withholds the review command on depth wording alone: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), prompt)).toBeUndefined();
  });

  // A loop's name with no use verb asks about the loop rather than for a run.
  it.each([
    'how does the research loop decide when it has enough',
  ])('withholds the research command on a loop name with no use verb: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE('research'), prompt)).toBeUndefined();
  });

  // A request to read what a past run produced asks for its output, not a run.
  it.each([
    ['research', 'summarize the findings.md from yesterday\'s deep research run'],
    ['review', 'give me a recap of the previous deep review report'],
    ['research', 'explain what the earlier deep research concluded about retries'],
  ])('withholds the %s command on a request to read a past run: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBeUndefined();
  });

  it.each([
    ['review', 'extend the previous deep review by 2 iterations', '/deep:review'],
    ['research', 'run deep research on log shipping, then summarize it', '/deep:research'],
  ])('keeps the %s command when the run is asked for again: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  // Writing a piece about a loop method names the loop as a topic.
  it.each([
    ['research', 'draft a blog post about iterative research for designers'],
    ['review', 'write an essay on why multi-pass review finds more bugs'],
  ])('withholds the %s command on writing about the loop: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
  });

  // A stuck run is diagnosed, not rerun, whichever mode the route picked.
  it.each([
    ['research', 'my research loop stopped converging and I cannot see why'],
    ['review', 'the deep review is stuck and keeps repeating the same findings'],
    ['research', 'the coverage graph of my deep research looks empty after 6 iterations'],
  ])('offers the doctor on a stuck %s run: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe('/doctor:deep-loop');
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBe('/doctor:deep-loop');
  });

  it.each([
    ['research', 'run deep research on why websocket connections hang', '/deep:research'],
    ['review', 'the deep review hit max iterations, keep going for a few more', '/deep:review'],
  ])('keeps the %s run command when a symptom word is the topic or the ask is more: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  it('withholds the doctor on a stuck run when the reader rules out a change', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'the deep review is stuck, make no changes')).toBeUndefined();
  });

  it.each([
    ['review', 'run an iterative review loop over the hooks folder until findings stop changing', '/deep:review'],
    ['review', 'run an iterative review loop on skill:sk-doc', '/deep:review'],
    ['research', 'start a research loop on caching strategies', '/deep:research'],
    ['review', 'review the parser in several passes', '/deep:review'],
  ])('offers the %s command on loop wording: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  it.each([
    ['run 5 iterations with cli-opencode on the caching research', '/deep:research'],
    ['run 8 more review iterations with cli-codex on the advisor runtime', '/deep:review'],
    ['investigate iteratively how the hook pipeline orders its adapters', '/deep:research'],
    ['check the billing service for bugs in several passes', '/deep:review'],
    ['inspect the importer for regressions iteratively', '/deep:review'],
  ])('names the mode a deferred route leaves open when one cue names it: %s', (prompt, command) => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBe(command);
  });

  it.each([
    'run a deep loop on the routing code',
    'run 5 iterations of research and review on the parser',
    'how does the deep loop decide to stop?',
    'do a thorough review of the release packet',
    "don't run /deep:review for 5 iterations, just summarize the report",
    'check that the build passes in several environments',
    'check the boarding passes page for bugs',
  ])('leaves a deferred route without a command: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBeUndefined();
  });

  it.each([
    ['review', 'how does the deep review decide that it has converged'],
    ['research', 'why does deep research stop after ten iterations?'],
    ['review', 'explain what the review loop does between passes'],
  ])('offers no %s run on a question about how the loop works: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
  });

  it.each([
    ['review', 'how does deep review handle this? run a deep review on the parser', '/deep:review'],
    ['research', 'what is the best cache policy? do 5 research iterations on it', '/deep:research'],
    ['research', 'deep research: how do vector databases handle hybrid search', '/deep:research'],
  ])('still offers the %s run when a question also asks for it: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  // A spelled-out count, rounds, and a loop name behind a want verb ask for the
  // loop as a digit count and a use verb do.
  it.each([
    ['research', "I'd like a research loop on vector database pricing", '/deep:research'],
    ['review', 'I want a review loop over the payments module', '/deep:review'],
    ['research', 'can you set up a research loop on CRDT sync strategies', '/deep:research'],
    ['review', 'review the auth service for ten rounds', '/deep:review'],
    ['review', 'do a dozen passes of review on the importer', '/deep:review'],
  ])('offers the %s command on a wanted loop or a spelled count: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  it('names the mode a deferred route leaves open on a hyphenated spelled count', () => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, 'run a twelve-iteration research pass on edge caching')).toBe('/deep:research');
  });

  it.each([
    ['review', 'write ten tips about review loops'],
    ['review', 'how many rounds does the review loop run'],
    ['review', 'how many passes does the review loop make'],
    ['review', "I'd like to know what a review loop is"],
    ['review', 'review the five changes in this pull request'],
    ['review', 'do one pass of review on the parser'],
    ['review', 'review why 3 tests pass locally but fail in CI'],
    ['research', 'research the 3 funding rounds Acme raised'],
    ['research', 'investigate several rounds of layoffs at the company'],
  ])('withholds the %s command when no loop run is asked for: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
  });

  // The run can be named as an audit loop or as the run the reader started.
  it.each([
    ['review', 'my audit loop keeps spinning and never converges'],
    ['review', 'the code audit loop I launched has stalled'],
    ['review', 'the review I started is stuck on iteration 4'],
    ['research', 'the research run keeps spinning without converging'],
    ['research', 'the research I launched yesterday never converges'],
  ])('offers the doctor on a stuck %s run named in other words: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe('/doctor:deep-loop');
  });

  it.each([
    'my build keeps spinning',
    'the CI job is stuck',
    'the test runner I started has stalled',
    'my event loop keeps spinning at full CPU',
    'review why the retry loop in the scheduler never converges',
  ])('withholds the doctor when the stuck thing is no deep run: %s', (prompt) => {
    expect(isStuckRunComplaint(prompt)).toBe(false);
  });

  // Convergence and a coverage graph name a deep run only beside its noun.
  it.each([
    'my k-means convergence is stuck, help me debug the code',
    'why is the coverage graph empty in my jest report',
  ])('withholds the doctor when convergence or a coverage graph names no deep run: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBeUndefined();
  });

  it.each([
    ['review', 'resume the review loop on the auth module', '/deep:review'],
    ['research', 'extend the research loop on cache eviction', '/deep:research'],
    ['research', 'run deep research to explain why the last CI run failed', '/deep:research'],
    ['research', 'run 10 research iterations on LLM caching so I can write an article about it', '/deep:research'],
    ['review', 'what is a deep review? run one on the auth module', '/deep:review'],
  ])('offers the %s command on a continued run or an explicit run beside another reading: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  it.each([
    ['run 5 research iterations on review tooling', '/deep:research'],
    ['I would like a deep loop reviewing the session store', '/deep:review'],
  ])('names the mode the loop unit or an -ing cue names on a deferred route: %s', (prompt, command) => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBe(command);
  });

  it.each([
    ['review', 'audit the first 2 iterations for drift'],
    ['review', 'review this PR in one iteration'],
    ['review', 'review why the build failed after 3 iterations'],
    ['research', 'research 3 rounds of the clinical trial results'],
    ['research', 'research why the model needed more iterations to converge'],
    ['review', 'set up a review loop for PR approvals in GitHub'],
    ['review', 'run tests until the review loop passes'],
    ['review', 'write a blog post about how to run a deep review'],
  ])('withholds the %s command on a count, a loop name or a run ask that asks for no run: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
  });

  // A refusal spelled out in words withholds the run the way a refused typed
  // command does, whether it leads the loop name or follows it.
  it.each([
    ['research', "don't do deep research, just answer quickly"],
    ['research', 'never run deep research on this'],
    ['review', 'no need to run a deep review here'],
    ['review', "I'm not asking for a deep review, just explain the bug"],
    ['review', 'no deep review, please; explain the bug'],
    ['review', 'a deep review is not needed, just check the diff'],
  ])('withholds the %s command on a refused run: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBeUndefined();
  });

  it.each([
    'do a deep review of the parser',
    'why not run a deep review of the parser',
    'no, run a deep review of the parser',
  ])('keeps the review command when nothing refuses the run: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), prompt)).toBe('/deep:review');
  });

  it.each([
    ['research', 'how many iterations does deep research run by default?'],
    ['review', 'how many passes does the deep review do'],
  ])('offers no %s run on a question about how long the loop runs: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
  });

  it.each([
    ['review', 'run a deep-review of the auth module', '/deep:review'],
    ['research', 'I’d like a research loop on cache eviction policies', '/deep:research'],
    ['research', 'the deep research run is not stuck, run 5 more iterations', '/deep:research'],
  ])('offers the %s command on a hyphen, a curly apostrophe or a denied symptom: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBe(command);
  });

  it('reads a hyphenated loop name inside a path as a file name', () => {
    expect(asksForLoopRun('update the wording in deep-review.md and system-deep-review/SKILL.md')).toBe(false);
  });

  // A loop name about the loop's own code or results, and a count that
  // describes a subject, name what the request is about rather than a run.
  it.each([
    ['research', 'refactor the deep research scorer'],
    ['review', 'fix the bugs the deep review found'],
    ['review', 'open the review loop config'],
    ['review', 'we need a review loop for every PR'],
    ['review', 'I want a review loop that approves PRs automatically'],
    ['review', 'compare 10 iterations of the model and review the results'],
    ['research', 'research three-pass vs two-pass compilers'],
    ['review', 'several passes of the linter failed, review the config'],
    ['review', 'review our multi-pass compiler'],
  ])('withholds the %s command when the loop is the subject: %s', (mode, prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBeUndefined();
  });

  it.each([
    ['review', 'run a deep review on the parser', '/deep:review'],
    ['research', 'do 5 research iterations on caching', '/deep:research'],
    ['review', 'review the parser in several passes', '/deep:review'],
    ['review', 'do a multi-pass review of the parser', '/deep:review'],
    ['review', 'fix the parser with a deep review', '/deep:review'],
  ])('keeps the %s command when the loop measures the work: %s', (mode, prompt, command) => {
    expect(attachCommand('system-deep-loop', SINGLE(mode), prompt)).toBe(command);
  });

  it('reads no deferred mode for a hub other than the deep loop', () => {
    expect(attachCommand('sk-doc', { action: 'defer' }, 'run 5 iterations of review')).toBeUndefined();
  });
});

// A refusal verb close before the loop name withholds the run as a negation
// does, while "skip straight to" and a negation four words back still ask.
describe('command attach on a refusal verb', () => {
  it.each([
    'skip the deep review and just answer',
    'avoid deep research; answer from memory',
    'there is no need for a deep review',
    'instead of a deep review, just explain the bug',
    'I refuse a deep review here',
    'do not even think about running a deep review',
  ])('gives no command on "%s"', (prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), prompt)).toBeUndefined();
  });

  it.each([
    'skip straight to the deep review of the parser',
    "don't hesitate to run a deep review",
    "don't forget to run a deep review on the parser",
  ])('keeps /deep:review on "%s"', (prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), prompt)).toBe('/deep:review');
  });
});

describe('typed command boundaries', () => {
  it('does not read a file name with an extension as a typed command', () => {
    expect(typedCommandIn('see /create:sk-skill.md for details')).toBeUndefined();
  });

  it('does not read a path segment as a typed command', () => {
    expect(typedCommandIn('open /create:readme/notes.txt')).toBeUndefined();
  });

  it.each([
    ['run **/deep:review** now', '/deep:review'],
    ['run [/deep:review] now', '/deep:review'],
    ['run \u201c/deep:review\u201d now', '/deep:review'],
    ['run <code>/deep:review</code> now', '/deep:review'],
  ])('finds the command wrapped in %s', (prompt, command) => {
    expect(typedCommandIn(prompt)).toBe(command);
  });

  it('reads a command that ends a sentence', () => {
    expect(typedCommandIn('run /create:sk-skill.')).toBe('/create:sk-skill');
  });

  it('reads a command followed by a comma', () => {
    expect(typedCommandIn('run /create:sk-skill, then stop')).toBe('/create:sk-skill');
  });

  it('reads the longest command when a prefix also matches', () => {
    expect(typedCommandIn('/create:skill-parent now')).toBe('/create:skill-parent');
  });

  it('reads a command typed with its mode suffix', () => {
    expect(typedCommandIn('/deep:review:auto review the diff')).toBe('/deep:review');
    expect(typedCommandIn('/speckit:plan:confirm add a login page')).toBe('/speckit:plan');
    expect(typedCommandIn('/speckit:implement:autopilot')).toBe('/speckit:implement');
    expect(typedCommandIn('/speckit:implement:unattended the login spec')).toBe('/speckit:implement');
  });

  it('reads a command typed with a with-modifier or a chain of suffixes', () => {
    expect(typedCommandIn('/speckit:complete:with-research the login spec')).toBe('/speckit:complete');
    expect(typedCommandIn('/speckit:complete:with-context the login spec')).toBe('/speckit:complete');
    expect(typedCommandIn('/speckit:complete:auto:with-research the login spec')).toBe('/speckit:complete');
    expect(typedCommandIn('/speckit:plan:with-phases a login page')).toBe('/speckit:plan');
  });

  // The suffix rule is shared by every tracked command, so a modifier typed on a
  // command whose hint does not list it still names that command.
  it('reads a with-modifier on a command whose hint does not list it as that command', () => {
    expect(typedCommandIn('/deep:review:with-research the diff')).toBe('/deep:review');
  });

  it('does not read a command followed by an unknown suffix', () => {
    expect(typedCommandIn('/deep:review:automation notes')).toBeUndefined();
    expect(typedCommandIn('/create:readme:draft')).toBeUndefined();
    expect(typedCommandIn('/speckit:complete:with-everything now')).toBeUndefined();
    expect(typedCommandIn('/speckit:complete:auto:draft now')).toBeUndefined();
    // The chain must abut the name, so a known suffix after an unknown one is refused.
    expect(typedCommandIn('/speckit:complete:draft:auto now')).toBeUndefined();
  });

  it('attaches the deep-loop command typed with its mode suffix', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), '/deep:review:auto review the diff')).toBe('/deep:review');
  });

  it('reads a retired command name as the command that replaced it', () => {
    expect(typedCommandIn('/create:skill')).toBe('/create:sk-skill');
    expect(typedCommandIn('/create:skill make a linting skill')).toBe('/create:sk-skill');
    expect(typedCommandForTop('sk-doc', '/create:skill')).toEqual({
      command: '/create:sk-skill',
      policy: 'start',
      ownerSkillId: 'sk-doc',
    });
  });

  it('does not read a retired name inside a path', () => {
    expect(typedCommandIn('open docs/create:skill.md')).toBeUndefined();
  });

  it('carries no command when the prompt only names a file', () => {
    expect(typedCommandForTop('sk-doc', 'open /create:readme.md and summarise it')).toBeUndefined();
  });

  it('delivers no typed command the prompt refuses', () => {
    expect(typedCommandForTop('system-spec-kit', 'do not run /speckit:complete yet, just explain what it does')).toBeUndefined();
  });

  it('still delivers a typed command the prompt asks for', () => {
    expect(typedCommandForTop('system-spec-kit', 'run /speckit:complete for the rate limiter')?.command).toBe('/speckit:complete');
  });
});

// A prompt can type two workflows. The longest typed name is not the only one
// asked for, so a gate that asks whether its own command was typed reads every
// typed command, and a deferred route reads its mode past a loop name that is
// only the subject of the request.
describe('more than one typed command', () => {
  it('lists every typed command in the order it was typed', () => {
    expect(typedCommandsIn('run /deep:review on the parser, then /create:changelog')).toEqual(['/deep:review', '/create:changelog']);
  });

  it('reads one command where two names start at the same place, and maps a retired name', () => {
    expect(typedCommandsIn('/create:skill-parent for the hub, then /create:skill for a leaf')).toEqual(['/create:skill-parent', '/create:sk-skill']);
    expect(typedCommandIn('/create:skill-parent for the hub, then /create:skill for a leaf')).toBe('/create:skill-parent');
  });

  it.each([
    'run /deep:review on the parser, then /create:changelog',
    '/deep:review the parser and then /doctor:deep-loop',
  ])('keeps a typed deep command beside a longer typed command: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), prompt)).toBe('/deep:review');
  });

  it('offers no deep command beside a typed command when the loop is neither typed nor asked for', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'look at the parser, then /create:changelog')).toBeUndefined();
  });

  it('delivers the typed command the leading skill owns when a longer one belongs to another skill', () => {
    const prompt = 'run /deep:review on the parser, then /create:changelog';
    expect(typedCommandForTop('system-deep-loop', prompt)?.command).toBe('/deep:review');
    expect(typedCommandForTop('sk-doc', prompt)?.command).toBe('/create:changelog');
    expect(typedCommandForTop('mcp-tooling', prompt)).toBeUndefined();
  });

  it('skips a refused typed command and delivers the next one the leading skill owns', () => {
    expect(typedCommandForTop('sk-doc', "don't run /create:skill-parent, run /create:changelog")?.command).toBe('/create:changelog');
  });

  it('keeps a typed doctor on a stuck run beside a longer typed command', () => {
    const prompt = "my deep research run is stuck, don't fix anything, just run /doctor:deep-loop and later /create:manual-testing-playbook";
    expect(attachCommand('system-deep-loop', SINGLE('review'), prompt)).toBe('/doctor:deep-loop');
  });

  it.each([
    'run a deep loop to review the research loop config',
    'run a deep loop checking the parser for bugs',
  ])('names the review mode on a deferred route: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBe('/deep:review');
  });

  it.each([
    'run a deep loop to fix the research loop config',
    'run a deep loop checking that the build passes',
  ])('leaves a deferred route without a command when only a subject or no defect is named: %s', (prompt) => {
    expect(attachCommand('system-deep-loop', { action: 'defer' }, prompt)).toBeUndefined();
  });
});

describe('generated command table', () => {
  it('holds no separate policy table', async () => {
    expect('COMMAND_POLICIES' in await import('../lib/command-attach.js')).toBe(false);
  });

  it('the command-bridges README names every command row field', () => {
    const source = readFileSync(join(import.meta.dirname, '../lib/command-attach.ts'), 'utf8');
    const readme = readFileSync(join(import.meta.dirname, '../scripts/command-bridges/README.md'), 'utf8');
    const interfaceBlock = /export interface CommandRow \{([\s\S]*?)\n\}/.exec(source)?.[1] ?? '';
    const fields = [...interfaceBlock.matchAll(/readonly (\w+)\??:/g)].map((match) => match[1]);
    expect(fields).toEqual(['command', 'policy', 'mutating', 'ownerSkillId']);
    const sentence = /Each row carries [^\n]*/.exec(readme)?.[0] ?? '';
    for (const field of fields) {
      expect(sentence).toContain('`' + field + '`');
    }
  });
});

// A pasted prompt can repeat a refusal or a loop name thousands of times. The
// gate reads the words before each naming on a bounded window, so such a prompt
// costs time linear in its length and keeps the answer a short prompt gets. The
// ceilings are generous on purpose: they catch the quadratic cost, which ran to
// seconds, not a slow machine.
describe('long prompts', () => {
  const REFUSALS = 'do not run /deep:review. '.repeat(400);
  const NO_LOOP = 'no deep review '.repeat(667);

  it('reads a 10,000-character repeated refusal as a refusal, in bounded time', () => {
    expect(REFUSALS.length).toBe(10_000);
    const started = performance.now();
    expect(commandOnlyMentioned(REFUSALS, '/deep:review')).toBe(true);
    expect(attachCommand('system-deep-loop', SINGLE('review'), REFUSALS)).toBeUndefined();
    expect(performance.now() - started).toBeLessThan(1_000);
  });

  it('reads a 10,000-character repeated "no deep review" as no loop ask', () => {
    expect(asksForLoopRun(NO_LOOP)).toBe(false);
  });

  it('still reads a request that follows the repeated refusals', () => {
    expect(commandOnlyMentioned(`${REFUSALS}now run /deep:review on the parser`, '/deep:review')).toBe(false);
    expect(asksForLoopRun(`${NO_LOOP}but run a deep review on the parser`)).toBe(true);
  });

  it('reads a refusal whose lead sits just before the name after a long prompt', () => {
    const padding = 'the parser and the lexer were refactored last week. '.repeat(200);
    expect(commandOnlyMentioned(`${padding}do not run /deep:review`, '/deep:review')).toBe(true);
    expect(asksForLoopRun(`${padding}skip the deep review`)).toBe(false);
  });
});
