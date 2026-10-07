// ───────────────────────────────────────────────────────────────────
// MODULE: Create.sh Root Numbering
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  AC_TEMPLATE_DEFAULT_PHRASES,
  IMPLEMENTATION_SUMMARY_TEMPLATE_DEFAULT_PHRASES,
  PLAN_TEMPLATE_DEFAULT_PHRASES,
  TASKS_TEMPLATE_DEFAULT_PHRASES,
  TEMPLATE_DEFAULT_PHRASES,
} from '../retrieval/lib/phrase-judge.mjs';
import { DESCRIPTION_STOP_WORDS } from '../spec/template-phrase-cleanup.mjs';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// Inside a git repository and without --track, create.sh numbered a packet by
// counting only the folders and branches that share its short name, so every
// differently named packet in one specs root started at 001. These run in a
// throwaway repository, which is what puts create.sh on that path.
let workspace: string;
let createScript: string;

beforeEach(() => {
  workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'create-root-numbering-')));
  execFileSync('git', ['init', '--quiet'], { cwd: workspace });
  const fixtureCli = path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  for (const dir of ['spec', 'lib', 'templates']) {
    fs.mkdirSync(path.join(fixtureCli, dir), { recursive: true });
  }
  fs.copyFileSync(path.join(CLI_DIR, 'spec', 'create.sh'), path.join(fixtureCli, 'spec', 'create.sh'));
  for (const library of ['shell-common.sh', 'git-branch.sh', 'template-utils.sh']) {
    fs.copyFileSync(path.join(CLI_DIR, 'lib', library), path.join(fixtureCli, 'lib', library));
  }
  fs.copyFileSync(
    path.join(CLI_DIR, 'templates', 'inline-gate-renderer.sh'),
    path.join(fixtureCli, 'templates', 'inline-gate-renderer.sh'),
  );
  fs.cpSync(
    path.join(SKILL_ROOT, 'templates'),
    path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'templates'),
    { recursive: true },
  );
  createScript = path.join(fixtureCli, 'spec', 'create.sh');
});

afterEach(() => {
  fs.rmSync(workspace, { recursive: true, force: true });
});

function create(args: string[]): string {
  const result = spawnSync('bash', [createScript, '--json', '--skip-branch', ...args], {
    cwd: workspace,
    encoding: 'utf8',
  });
  expect(result.status, result.stderr).toBe(0);
  return path.basename(path.dirname((JSON.parse(result.stdout) as { SPEC_FILE: string }).SPEC_FILE));
}

describe('create.sh numbering at the specs root', () => {
  it('gives a second, differently named packet the next number', () => {
    expect(create(['--short-name', 'first-packet', 'First'])).toBe('001-first-packet');
    expect(create(['--short-name', 'second-packet', 'Second'])).toBe('002-second-packet');
  });

  it('numbers after the highest folder already in the root', () => {
    fs.mkdirSync(path.join(workspace, 'specs', '007-existing-packet'), { recursive: true });
    expect(create(['--short-name', 'next-packet', 'Next'])).toBe('008-next-packet');
  });

  it('numbers after the highest numbered branch', () => {
    commit();
    execFileSync('git', ['branch', '012-other-work'], { cwd: workspace });
    expect(create(['--short-name', 'after-branch', 'After'])).toBe('013-after-branch');
  });

  // A packet branch is three digits and a hyphen. A date-shaped name also starts
  // with digits and a hyphen, and must not push the root's numbering to 2027.
  it('ignores a branch that only starts with digits, such as a date', () => {
    commit();
    execFileSync('git', ['branch', '2026-09-24-hotfix'], { cwd: workspace });
    expect(create(['--short-name', 'after-date', 'After date'])).toBe('001-after-date');
  });

  // Numbering reads the refs git already has and fetches nothing, so a scaffold
  // needs no network and never prunes a remote-tracking ref the remote dropped.
  it('counts a remote-tracking ref it already has and leaves it in place', () => {
    const remote = path.join(workspace, 'remote.git');
    execFileSync('git', ['init', '--quiet', '--bare', remote]);
    execFileSync('git', ['remote', 'add', 'origin', remote], { cwd: workspace });
    commit();
    execFileSync('git', ['update-ref', 'refs/remotes/origin/020-remote-work', 'HEAD'], { cwd: workspace });

    expect(create(['--short-name', 'after-remote', 'After remote'])).toBe('021-after-remote');
    const kept = spawnSync('git', ['show-ref', '--verify', '--quiet', 'refs/remotes/origin/020-remote-work'], { cwd: workspace });
    expect(kept.status).toBe(0);
  });
});

// A phase appended to a parent is numbered after the children already there, and
// the scaffold text that names it must carry that number, not its position in the
// one invocation that created it.
describe('create.sh numbering of an appended phase', () => {
  it('names a phase appended after two others Phase 3', () => {
    const parent = path.join('specs', '001-parent-work');
    for (const child of ['001-first-step', '002-second-step']) {
      fs.mkdirSync(path.join(workspace, parent, child), { recursive: true });
    }
    fs.writeFileSync(path.join(workspace, parent, 'spec.md'), '# Parent work\n');

    const result = spawnSync(
      'bash',
      [
        createScript, '--json', '--skip-branch', '--phase', '--parent', parent,
        '--phases', '1', '--phase-names', 'third-step', 'Parent work',
      ],
      { cwd: workspace, encoding: 'utf8' },
    );
    expect(result.status, result.stderr).toBe(0);

    const graphPath = path.join(workspace, parent, '003-third-step', 'graph-metadata.json');
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8')) as { derived: { causal_summary: string } };
    expect(graph.derived.causal_summary).toBe('Phase 3: third-step');
  });
});

// The four trigger phrases the spec template ships name no topic, so a packet
// that keeps them cannot be found by what it is about. A scaffold seeds phrases
// from the folder slug and the description instead.
describe('create.sh seeds trigger phrases', () => {
  it('replaces the template defaults with the packet slug and description', () => {
    const folder = create(['--short-name', 'seeded-phrases', 'Seed trigger phrases for new packets']);
    const spec = fs.readFileSync(path.join(workspace, 'specs', folder, 'spec.md'), 'utf8');

    expect(spec).toContain('  - "seeded phrases"');
    expect(spec).toContain('  - "seed trigger phrases for new packets"');
    expect(spec).not.toContain('  - "feature specification"');
    expect(spec).not.toContain('  - "problem statement"');
    expect(spec).not.toContain('  - "requirements and scope"');
    expect(spec).not.toContain('  - "success criteria"');
  });

  it('replaces AC template defaults with the slug phrase in Level 2 packets', () => {
    const folder = create([
      '--level', '2',
      '--short-name', 'seeded-phrases',
      'Seed trigger phrases for new packets',
    ]);
    const acceptanceCriteria = fs.readFileSync(
      path.join(workspace, 'specs', folder, 'acceptance-criteria.md'),
      'utf8',
    );

    expect(acceptanceCriteria).not.toContain('  - "closure gate"');
    expect(acceptanceCriteria).toContain('  - "seeded phrases acceptance criteria"');
  });

  it('seeds plan, tasks, and implementation-summary defaults with slug phrases', () => {
    const folder = create([
      '--level', '2',
      '--short-name', 'seeded-phrases',
      'Seed trigger phrases for new packets',
    ]);
    const seededDocuments = [
      {
        filename: 'plan.md',
        phrase: 'seeded phrases plan',
        defaults: PLAN_TEMPLATE_DEFAULT_PHRASES,
      },
      {
        filename: 'tasks.md',
        phrase: 'seeded phrases tasks',
        defaults: TASKS_TEMPLATE_DEFAULT_PHRASES,
      },
      {
        filename: 'implementation-summary.md',
        phrase: 'seeded phrases implementation summary',
        defaults: IMPLEMENTATION_SUMMARY_TEMPLATE_DEFAULT_PHRASES,
      },
    ];

    for (const { filename, phrase, defaults } of seededDocuments) {
      const document = fs.readFileSync(path.join(workspace, 'specs', folder, filename), 'utf8');
      expect(document).toContain(`  - "${phrase}"`);
      for (const defaultPhrase of defaults) {
        expect(document).not.toContain(`  - "${defaultPhrase}"`);
      }
    }
  });

  it('turns punctuation in the description into word breaks', () => {
    const folder = create(['--short-name', 'punctuated-phrase', 'Fix the write-recipe step, once.']);
    const spec = fs.readFileSync(path.join(workspace, 'specs', folder, 'spec.md'), 'utf8');

    expect(spec).toContain('  - "fix the write recipe step once"');
  });

  it('trims a description that ends on stop words before seeding it', () => {
    const folder = create(['--short-name', 'stop-word-seed', 'Fix the parser so that']);
    const spec = fs.readFileSync(path.join(workspace, 'specs', folder, 'spec.md'), 'utf8');

    expect(spec).toContain('  - "fix the parser"');
    expect(spec).not.toContain('  - "fix the parser so that"');
  });

  it('pins the description stop words in create.sh to the cleanup tool list', () => {
    const createSource = fs.readFileSync(path.join(CLI_DIR, 'spec', 'create.sh'), 'utf8');
    const shellList = createSource.match(
      /local -a description_stop_words=\(\r?\n([\s\S]*?)\r?\n[ \t]*\)/,
    );
    if (!shellList) {
      throw new Error('create.sh has no description stop-word list');
    }
    const shellWords = shellList[1].split(/\s+/).filter(Boolean);
    expect(shellWords).toEqual([...DESCRIPTION_STOP_WORDS]);
  });

  it('pins the template default phrases to their judge sets and shell lists', () => {
    const templatePath = process.env.SPECKIT_TEST_CORE_SPEC_TEMPLATE_PATH
      ?? path.join(SKILL_ROOT, 'templates', 'core', 'spec.md.tmpl');
    const template = fs.readFileSync(templatePath, 'utf8');
    const templateBlock = template.match(
      /^trigger_phrases:\r?\n((?:[ \t]*-[ \t]*"[^"]*"[ \t]*\r?\n?)+)/m,
    );
    if (!templateBlock) {
      throw new Error('Core spec template has no quoted trigger_phrases block');
    }
    const templatePhrases = Array.from(
      templateBlock[1].matchAll(/^[ \t]*-[ \t]*"([^"]*)"[ \t]*\r?$/gm),
      ([, phrase]) => phrase,
    );
    expect(templatePhrases).toEqual([...TEMPLATE_DEFAULT_PHRASES]);

    const createSource = fs.readFileSync(path.join(CLI_DIR, 'spec', 'create.sh'), 'utf8');
    const shellPhraseList = createSource.match(
      /local -a template_default_phrases=\(\r?\n([\s\S]*?)\r?\n[ \t]*\)/,
    );
    if (!shellPhraseList) {
      throw new Error('create.sh has no local default trigger phrase list');
    }
    const shellPhrases = Array.from(
      shellPhraseList[1].matchAll(/^[ \t]*"([^"]+)"[ \t]*\r?$/gm),
      ([, phrase]) => phrase,
    );
    expect(templatePhrases).toEqual(shellPhrases);

    const acTemplatePath = path.join(
      SKILL_ROOT,
      'templates',
      'addons',
      'acceptance-criteria.md.tmpl',
    );
    const acTemplate = fs.readFileSync(acTemplatePath, 'utf8');
    const acTemplateBlock = acTemplate.match(
      /^trigger_phrases:\r?\n((?:[ \t]*-[ \t]*"[^"]*"[ \t]*\r?\n?)+)/m,
    );
    if (!acTemplateBlock) {
      throw new Error('Acceptance-criteria template has no quoted trigger_phrases block');
    }
    const acTemplatePhrases = Array.from(
      acTemplateBlock[1].matchAll(/^[ \t]*-[ \t]*"([^"]*)"[ \t]*\r?$/gm),
      ([, phrase]) => phrase,
    );
    expect(acTemplatePhrases).toEqual([...AC_TEMPLATE_DEFAULT_PHRASES]);

    const acShellPhraseList = createSource.match(
      /local -a ac_template_default_phrases=\(\r?\n([\s\S]*?)\r?\n[ \t]*\)/,
    );
    if (!acShellPhraseList) {
      throw new Error('create.sh has no AC template default trigger phrase list');
    }
    const acShellPhrases = Array.from(
      acShellPhraseList[1].matchAll(/^[ \t]*"([^"]+)"[ \t]*\r?$/gm),
      ([, phrase]) => phrase,
    );
    expect(acTemplatePhrases).toEqual(acShellPhrases);

    const additionalTemplatePins = [
      {
        templatePath: 'core/plan.md.tmpl',
        shellListName: 'plan_template_default_phrases',
        defaultPhrases: PLAN_TEMPLATE_DEFAULT_PHRASES,
      },
      {
        templatePath: 'core/tasks.md.tmpl',
        shellListName: 'tasks_template_default_phrases',
        defaultPhrases: TASKS_TEMPLATE_DEFAULT_PHRASES,
      },
      {
        templatePath: 'core/implementation-summary.md.tmpl',
        shellListName: 'implementation_summary_template_default_phrases',
        defaultPhrases: IMPLEMENTATION_SUMMARY_TEMPLATE_DEFAULT_PHRASES,
      },
    ];

    for (const pin of additionalTemplatePins) {
      const template = fs.readFileSync(
        path.join(SKILL_ROOT, 'templates', pin.templatePath),
        'utf8',
      );
      const block = template.match(
        /^trigger_phrases:\r?\n((?:[ \t]*-[ \t]*"[^"]*"[ \t]*\r?\n?)+)/m,
      );
      if (!block) {
        throw new Error(`${pin.templatePath} has no quoted trigger_phrases block`);
      }
      const phrases = Array.from(
        block[1].matchAll(/^[ \t]*-[ \t]*"([^"]*)"[ \t]*\r?$/gm),
        ([, phrase]) => phrase,
      );
      expect(phrases).toEqual([...pin.defaultPhrases]);

      const shellList = createSource.match(new RegExp(
        `local -a ${pin.shellListName}=\\(\\r?\\n([\\s\\S]*?)\\r?\\n[ \\t]*\\)`,
      ));
      if (!shellList) {
        throw new Error(`create.sh has no ${pin.shellListName} list`);
      }
      const shellPhrases = Array.from(
        shellList[1].matchAll(/^[ \t]*"([^"]+)"[ \t]*\r?$/gm),
        ([, phrase]) => phrase,
      );
      expect(phrases).toEqual(shellPhrases);
    }
  });
});

// The fixture commit runs no hooks: a global core.hooksPath would otherwise
// apply the host repository's commit gates to this throwaway one.
function commit() {
  execFileSync(
    'git',
    [
      '-c', 'core.hooksPath=/dev/null',
      '-c', 'user.email=test@example.com',
      '-c', 'user.name=test',
      'commit', '--quiet', '--allow-empty', '-m', 'root',
    ],
    { cwd: workspace },
  );
}
