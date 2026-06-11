// ───────────────────────────────────────────────────────────────
// MODULE: Skill Doc Frontmatter Harvest Tests
// ───────────────────────────────────────────────────────────────
// Covers the doc-trigger harvest pipeline end to end: frontmatter
// parsing, file discovery, flag-gated sqlite ingestion, derived-lane
// scoring with the per-skill contribution cap, and matched-doc path
// sanitization. The flag-off invariance cases are the hard contract:
// with SPECKIT_ADVISOR_DOC_TRIGGERS unset, nothing about indexing or
// scoring may change.

import { mkdtempSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { matchedDocsFromContributions } from '../handlers/advisor-recommend.js';
import {
  docTierWeight,
  listSkillDocFiles,
  parseDocFrontmatter,
} from '../lib/skill-graph/doc-frontmatter.js';
import { closeDb, getDb, indexSkillMetadata, initDb } from '../lib/skill-graph/skill-graph-db.js';
import { scoreDerivedLane } from '../lib/scorer/lanes/derived.js';
import { createFixtureProjection } from '../lib/scorer/projection.js';
import type { SkillProjection } from '../lib/scorer/types.js';
import { writeGraphMetadata } from './fixtures/skill-graph-db.js';

const FLAG = 'SPECKIT_ADVISOR_DOC_TRIGGERS';

function docWithFrontmatter(phrases: readonly string[], tier = 'normal'): string {
  const phraseLines = phrases.map((phrase) => `  - "${phrase}"`).join('\n');
  return [
    '---',
    'title: "Fixture Reference"',
    'description: "Fixture doc for harvest tests."',
    'trigger_phrases:',
    phraseLines,
    `importance_tier: ${tier}`,
    'contextType: reference',
    '---',
    '',
    '# Fixture Reference',
    '',
    'Body content.',
    '',
  ].join('\n');
}

function writeDoc(skillRoot: string, skillId: string, relPath: string, content: string): string {
  const fullPath = join(skillRoot, skillId, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
  return fullPath;
}

function fixtureSkill(id: string, extra: Partial<SkillProjection> = {}): SkillProjection {
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
    ...extra,
  };
}

describe('doc frontmatter parsing', () => {
  it('parses block-list trigger phrases with tier and context type', () => {
    const parsed = parseDocFrontmatter(docWithFrontmatter(['coverage graph exit codes', 'script interface contract'], 'important'));
    expect(parsed).not.toBeNull();
    expect(parsed?.triggerPhrases).toEqual(['coverage graph exit codes', 'script interface contract']);
    expect(parsed?.importanceTier).toBe('important');
    expect(parsed?.contextType).toBe('reference');
    expect(parsed?.title).toBe('Fixture Reference');
  });

  it('parses inline-list trigger phrases', () => {
    const raw = '---\ntitle: "X"\ntrigger_phrases: ["alpha beta", "gamma delta"]\n---\n# X\n';
    expect(parseDocFrontmatter(raw)?.triggerPhrases).toEqual(['alpha beta', 'gamma delta']);
  });

  it('returns null without a frontmatter fence or without phrases', () => {
    expect(parseDocFrontmatter('# Plain doc\n')).toBeNull();
    expect(parseDocFrontmatter('---\ntitle: "X"\ndescription: "Y"\n---\n# X\n')).toBeNull();
  });

  it('maps unknown tiers to the normal-tier weight', () => {
    expect(docTierWeight('important')).toBeGreaterThan(docTierWeight('normal'));
    expect(docTierWeight('bogus')).toBe(docTierWeight('normal'));
    expect(docTierWeight(undefined)).toBe(docTierWeight('normal'));
  });
});

describe('doc file discovery', () => {
  it('lists nested references/assets markdown and excludes READMEs', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-doc-list-'));
    try {
      const skillDir = join(root, 'alpha');
      writeDoc(root, 'alpha', 'references/top.md', '# top');
      writeDoc(root, 'alpha', 'references/nested/deep.md', '# deep');
      writeDoc(root, 'alpha', 'assets/asset.md', '# asset');
      writeDoc(root, 'alpha', 'references/README.md', '# readme');
      writeDoc(root, 'alpha', 'references/notes.txt', 'not markdown');
      writeDoc(root, 'alpha', 'constitutional/rule.md', '# out of scope');

      const found = listSkillDocFiles(skillDir).map((path) => path.slice(skillDir.length + 1));
      expect(found).toEqual([
        'assets/asset.md',
        'references/nested/deep.md',
        'references/top.md',
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('flag-gated sqlite ingestion', () => {
  afterEach(() => {
    delete process.env[FLAG];
    closeDb();
  });

  it('flag off: indexes zero skill_docs rows and reports no docs counters', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-doc-db-'));
    try {
      initDb(join(root, 'db'));
      const skillRoot = join(root, 'skills');
      writeGraphMetadata(skillRoot, 'alpha');
      writeDoc(skillRoot, 'alpha', 'references/guide.md', docWithFrontmatter(['alpha doc phrase']));

      const result = indexSkillMetadata(skillRoot);

      expect(result.docs).toBeUndefined();
      expect(getDb().prepare('SELECT COUNT(*) AS count FROM skill_docs').get()).toEqual({ count: 0 });
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('flag on: harvests, skips unchanged, reindexes edits, and deletes stale rows', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-doc-db-'));
    process.env[FLAG] = 'true';
    try {
      initDb(join(root, 'db'));
      const skillRoot = join(root, 'skills');
      writeGraphMetadata(skillRoot, 'alpha');
      const guidePath = writeDoc(skillRoot, 'alpha', 'references/guide.md', docWithFrontmatter(['alpha doc phrase'], 'important'));
      writeDoc(skillRoot, 'alpha', 'assets/snippet.md', docWithFrontmatter(['alpha asset phrase']));
      writeDoc(skillRoot, 'alpha', 'references/plain.md', '# no frontmatter\n');

      const first = indexSkillMetadata(skillRoot);
      expect(first.docs).toEqual({ scannedDocs: 3, indexedDocs: 2, skippedDocs: 0, deletedDocs: 0 });
      const rows = getDb().prepare(
        'SELECT doc_path, importance_tier, context_type FROM skill_docs WHERE skill_id = ? ORDER BY doc_path',
      ).all('alpha');
      expect(rows).toEqual([
        { doc_path: 'assets/snippet.md', importance_tier: 'normal', context_type: 'reference' },
        { doc_path: 'references/guide.md', importance_tier: 'important', context_type: 'reference' },
      ]);

      const second = indexSkillMetadata(skillRoot);
      expect(second.docs).toEqual({ scannedDocs: 3, indexedDocs: 0, skippedDocs: 2, deletedDocs: 0 });

      writeFileSync(guidePath, docWithFrontmatter(['alpha doc phrase', 'extra phrase'], 'important'), 'utf8');
      const third = indexSkillMetadata(skillRoot);
      expect(third.docs?.indexedDocs).toBe(1);
      expect(third.docs?.skippedDocs).toBe(1);

      unlinkSync(guidePath);
      const fourth = indexSkillMetadata(skillRoot);
      expect(fourth.docs?.deletedDocs).toBe(1);
      expect(getDb().prepare('SELECT doc_path FROM skill_docs WHERE skill_id = ?').all('alpha')).toEqual([
        { doc_path: 'assets/snippet.md' },
      ]);
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('derived lane doc scoring', () => {
  it('adds doc evidence and caps the doc contribution per skill', () => {
    const manyDocs = Array.from({ length: 10 }, (_value, index) => ({
      docPath: `references/doc-${index}.md`,
      phrases: ['coverage graph exit codes'],
      tierWeight: 1,
    }));
    const projection = createFixtureProjection([
      fixtureSkill('doc-heavy', { docTriggers: manyDocs }),
      fixtureSkill('no-docs'),
    ]);

    const matches = scoreDerivedLane('how do coverage graph exit codes work?', projection);
    const docHeavy = matches.find((match) => match.skillId === 'doc-heavy');

    expect(docHeavy).toBeDefined();
    expect(docHeavy?.score).toBeLessThanOrEqual(0.45 + 1e-9);
    expect(docHeavy?.evidence.filter((entry) => entry.startsWith('doc:')).length).toBeLessThanOrEqual(3);
    expect(matches.find((match) => match.skillId === 'no-docs')).toBeUndefined();
  });

  it('keeps a skill\'s own curated trigger above a doc-only match at equal phrasing', () => {
    const projection = createFixtureProjection([
      fixtureSkill('curated', { derivedTriggers: ['coverage graph exit codes'] }),
      fixtureSkill('doc-only', {
        docTriggers: [{ docPath: 'references/x.md', phrases: ['coverage graph exit codes'], tierWeight: 1 }],
      }),
    ]);

    const matches = scoreDerivedLane('coverage graph exit codes', projection);
    const curated = matches.find((match) => match.skillId === 'curated');
    const docOnly = matches.find((match) => match.skillId === 'doc-only');

    expect(curated).toBeDefined();
    expect(docOnly).toBeDefined();
    expect(curated!.score).toBeGreaterThan(docOnly!.score);
  });

  it('is inert for projections without docTriggers (flag-off invariance)', () => {
    const skill = fixtureSkill('plain', { derivedTriggers: ['coverage graph exit codes'] });
    const withoutField = scoreDerivedLane('coverage graph exit codes', createFixtureProjection([skill]));
    const withEmptyField = scoreDerivedLane(
      'coverage graph exit codes',
      createFixtureProjection([{ ...skill, docTriggers: [] }]),
    );
    expect(withoutField).toEqual(withEmptyField);
  });
});

describe('matched doc sanitization', () => {
  it('keeps only safe skill-relative markdown paths, deduped, max three', () => {
    const docs = matchedDocsFromContributions({
      laneContributions: [
        {
          evidence: [
            'doc:references/foo.md',
            'doc:references/foo.md',
            'doc:../../etc/passwd',
            'doc:references/../secrets.md',
            'doc:assets/bar.md',
            'derived:not a doc',
            'doc:references/deep/nested.md',
            'doc:references/fourth.md',
          ],
        },
      ],
    });
    expect(docs).toEqual(['references/foo.md', 'assets/bar.md', 'references/deep/nested.md']);
  });
});
