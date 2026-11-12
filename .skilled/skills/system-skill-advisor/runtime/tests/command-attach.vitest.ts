// ───────────────────────────────────────────────────────────────
// MODULE: Command attach for a hub recommendation
// ───────────────────────────────────────────────────────────────

// The advisor names the workflow mode a hub would route a prompt to, and
// `attachCommand()` turns that mode into the slash command a reader can type.
// The table it reads is generated from each hub's own command files, so these
// tests assert the properties the generator has to keep — an own-key lookup on
// both levels, and a real command file behind every row — rather than restating
// today's rows, which would drift from the generator instead of catching it.
//
// The deep-loop gate is asserted on its own, because a command offered for a
// prompt that never asked for that effort commits the reader to a long run they
// did not request, and the prompt is the only thing that can tell the two apart.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { attachCommand, DEPTH_WORDING, MODE_COMMANDS } from '../lib/command-attach.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import { AdvisorRecommendationSchema } from '../schemas/advisor-tool-schemas.js';

type ModeCommands = Readonly<Record<string, Readonly<Record<string, string>>>>;

const REPO_ROOT = findAdvisorWorkspaceRoot(import.meta.dirname);

// A slash command spelling that also names the file behind it, so a generated row
// can be checked against the command tree rather than against a second copy of
// itself.
const COMMAND_ID = /^\/([a-z][a-z0-9-]*):([a-z0-9-]+)$/;

// The only route shape that can name a command unambiguously: one decision, one
// selected target, so the target's mode is the answer.
function singleRoute(workflowMode: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { action: 'route', selectionKind: 'single', targets: [{ workflowMode }], ...overrides };
}

// Distinct from what the generated table holds for the same hub and mode, so a
// passing assertion proves the injected table was read rather than the real one.
const INJECTED_COMMAND = '/injected:readme';
const INJECTED: ModeCommands = { 'sk-doc': { 'sk-create-readme': INJECTED_COMMAND } };
const OTHER_HUB: ModeCommands = { 'made-up-hub': { 'made-up-mode': '/made-up:command' } };

// Wording that names a topic without asking for effort: no phrase in the effort
// vocabulary, and no typed slash command.
const PLAIN_PROMPT = 'how does the routing table pick a skill';

describe('command attach for a single routed mode', () => {
  it('names the command the routed mode maps to', () => {
    // Any generated hub except the gated one, read at test time so the case
    // follows a regenerated table instead of pinning one of its rows.
    const generated = Object.entries(MODE_COMMANDS).find(([hub]) => hub !== 'system-deep-loop');
    expect(generated, 'the generated table names a hub outside the depth gate').toBeDefined();
    const [hub, modes] = generated as [string, Readonly<Record<string, string>>];
    const [mode, command] = Object.entries(modes)[0] as [string, string];
    expect(command).toBeTypeOf('string');

    expect(attachCommand(hub, singleRoute(mode), 'add a readme')).toBe(command);

    expect(attachCommand('sk-doc', singleRoute('sk-create-readme'), 'anything', INJECTED)).toBe(INJECTED_COMMAND);
    expect(attachCommand('made-up-hub', singleRoute('made-up-mode'), 'anything', OTHER_HUB)).toBe('/made-up:command');
  });

  it('offers no command unless the route names exactly one mode the table holds', () => {
    const rows: Array<[string, string, unknown]> = [
      ['a multi-selection route', 'sk-doc', {
        action: 'route', selectionKind: 'multi', targets: [{ workflowMode: 'sk-create-readme' }],
      }],
      ['an ask decision', 'sk-doc', {
        action: 'ask', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-readme' }],
      }],
      ['a route with two targets', 'sk-doc', {
        action: 'route',
        selectionKind: 'single',
        targets: [{ workflowMode: 'sk-create-readme' }, { workflowMode: 'sk-create-benchmark' }],
      }],
      ['a mode the table does not hold', 'sk-doc', singleRoute('sk-create-benchmark')],
      ['a hub the table does not hold', 'sk-git', singleRoute('sk-create-readme')],
      ['no route at all', 'sk-doc', null],
      ['a route that is an array', 'sk-doc', [singleRoute('sk-create-readme')]],
      // An inherited name such as `constructor` is never a command the hub
      // declared, so the lookup must read own keys at both levels.
      ['a mode named after an inherited key', 'sk-doc', singleRoute('constructor')],
      ['a hub named after an inherited key', 'constructor', singleRoute('sk-create-readme')],
    ];

    for (const [label, skillId, compiledRoute] of rows) {
      expect(attachCommand(skillId, compiledRoute, PLAIN_PROMPT, INJECTED), label).toBeUndefined();
    }
    expect(attachCommand('constructor', singleRoute('constructor'), PLAIN_PROMPT), 'both levels inherited').toBeUndefined();
  });

  it('offers a deep-loop command only when the prompt asks for that effort', () => {
    const plainIsQuiet = DEPTH_WORDING.every((phrase) => !PLAIN_PROMPT.toLowerCase().includes(phrase));
    expect(plainIsQuiet, 'the effort-free probe prompt mentions no effort wording').toBe(true);

    const modes = Object.entries(MODE_COMMANDS['system-deep-loop']);
    expect(modes.length).toBeGreaterThan(0);
    const [effortPhrase] = DEPTH_WORDING;
    expect(effortPhrase).toBeTruthy();

    for (const [mode, command] of modes) {
      const route = singleRoute(mode);
      expect(attachCommand('system-deep-loop', route, PLAIN_PROMPT), mode).toBeUndefined();
      expect(attachCommand('system-deep-loop', route, `explain the scorer ${effortPhrase}`), mode).toBe(command);
      expect(attachCommand('system-deep-loop', route, `run ${command} for me`), mode).toBe(command);
    }

    // The gate belongs to the deep-loop hub alone: every other hub answers the
    // same effort-free prompt with its command.
    expect(attachCommand('sk-doc', singleRoute('sk-create-benchmark'), PLAIN_PROMPT, INJECTED)).toBeUndefined();
    expect(attachCommand('sk-doc', singleRoute('sk-create-readme'), PLAIN_PROMPT, INJECTED)).toBe(INJECTED_COMMAND);
  });

  it('stays quiet when a prompt only names a deep-loop mode by its topic', () => {
    const topicOnly: ReadonlyArray<readonly [string, string]> = [
      ['ai-council', 'What does the AI council mode do?'],
      ['research', 'what is research mode?'],
      ['review', 'how does the review mode work?'],
    ];
    for (const [mode, prompt] of topicOnly) {
      expect(MODE_COMMANDS['system-deep-loop'], mode).toHaveProperty(mode);
      expect(attachCommand('system-deep-loop', singleRoute(mode), prompt), prompt).toBeUndefined();
    }
    expect(attachCommand('system-deep-loop', singleRoute('ai-council'), 'ask the council whether to split billing'))
      .toBe(MODE_COMMANDS['system-deep-loop']['ai-council']);
  });

  it('names a real command file behind every generated row', () => {
    const hubs = Object.keys(MODE_COMMANDS);
    expect(hubs.length).toBeGreaterThan(0);

    for (const hub of hubs) {
      const modes = Object.entries(MODE_COMMANDS[hub]);
      expect(modes.length, hub).toBeGreaterThan(0);
      for (const [mode, command] of modes) {
        const label = `${hub} ${mode}: ${command}`;
        const match = command.match(COMMAND_ID);
        expect(match, label).not.toBeNull();
        const [, namespace, name] = match as RegExpMatchArray;
        expect(existsSync(join(REPO_ROOT, '.skilled', 'commands', namespace, `${name}.md`)), label).toBe(true);
      }
    }
  });

  it('accepts a named command on a recommendation and refuses an empty one', () => {
    // Only the schema's required keys, so the object proves the command field is
    // the one under test rather than something an unrelated field satisfied.
    const minimal = {
      skillId: 'sk-create-readme',
      score: 1,
      confidence: 0.9,
      uncertainty: 0.1,
      dominantLane: null,
    };

    expect(AdvisorRecommendationSchema.safeParse(minimal).success).toBe(true);
    expect(AdvisorRecommendationSchema.safeParse({ ...minimal, command: '/create:readme' }).success).toBe(true);
    expect(AdvisorRecommendationSchema.safeParse({ ...minimal, command: '' }).success).toBe(false);
  });
});
