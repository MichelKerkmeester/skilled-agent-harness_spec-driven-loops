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
  attachCommand,
  commandOnlyMentioned,
  isNoEditRequest,
  MODE_COMMANDS,
  NO_EDIT_REQUEST,
  typedCommandForTop,
  typedCommandIn,
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

  // A bare lead opens a statement as often as a question, so it marks a mention
  // only before a question. One led occurrence does not make a request either
  // when a later occurrence of the same command is not led.
  it.each([
    ['the next step is /speckit:implement', '/speckit:implement'],
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
  ])('reads %s as a question about %s', (prompt, command) => {
    expect(commandOnlyMentioned(prompt, command)).toBe(true);
  });

  it('reads each command of a two-command prompt on its own', () => {
    expect(commandOnlyMentioned('use /speckit:plan, not /speckit:complete', '/speckit:complete')).toBe(true);
  });

  it('reads a curly apostrophe as a straight one', () => {
    expect(commandOnlyMentioned('don\u2019t run /speckit:save', '/speckit:save')).toBe(true);
  });

  it('does not read a longer command name as the shorter one', () => {
    expect(commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')).toBe(false);
  });

  it.each([
    'what does /create:readme do?',
    'skip /create:readme, just append one line to the existing README',
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

  it('offers the review command when the prompt asks for depth', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'review the parser in depth')).toBe('/deep:review');
  });
});

describe('typed command boundaries', () => {
  it('does not read a file name with an extension as a typed command', () => {
    expect(typedCommandIn('see /create:sk-skill.md for details')).toBeUndefined();
  });

  it('does not read a path segment as a typed command', () => {
    expect(typedCommandIn('open /create:readme/notes.txt')).toBeUndefined();
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
  });

  it('does not read a command followed by an unknown suffix', () => {
    expect(typedCommandIn('/deep:review:automation notes')).toBeUndefined();
    expect(typedCommandIn('/create:readme:draft')).toBeUndefined();
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
