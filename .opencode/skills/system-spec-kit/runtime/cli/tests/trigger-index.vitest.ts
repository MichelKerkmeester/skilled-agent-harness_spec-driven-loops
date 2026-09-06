import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { publishJson, stableStringify } from '../retrieval/lib/artifact.mjs';
import { canonicalRelativePath, IGNORED_PATHS, walkCorpus } from '../retrieval/lib/corpus.mjs';
import { CATEGORY, readTriggerPhrases } from '../retrieval/lib/frontmatter.mjs';
import {
  normalizeTriggerText,
  queryTokens,
  scorePhrase,
} from '../retrieval/lib/normalize.mjs';
import { buildIndex, generate } from '../retrieval/generate-trigger-index.mjs';
import { loadIndex, lookup, specFolderMatches,
  parseArgs,
} from '../retrieval/lookup-trigger-index.mjs';

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
  tempRoots.clear();
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(dir);
  return dir;
}

function writeDoc(root: string, relativePath: string, content: string): string {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, 'utf8');
  return absolute;
}

function frontmatter(phrases: string[], key = 'trigger_phrases'): string {
  return ['---', 'title: "Doc"', `${key}:`, ...phrases.map((p) => `  - "${p}"`), '---', '', '# Doc', ''].join('\n');
}

function sha256File(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function generationPaths(root: string) {
  return {
    diagnosticsPath: path.join(root, 'out', 'generation-diagnostics.json'),
    // The shipped exemption list names a real repository document, so a temp
    // corpus starts with none: a test that cares supplies its own.
    ignoredPaths: [] as Array<{ path: string; reason: string }>,
    indexPath: path.join(root, 'out', 'trigger-index.json'),
    manifestPath: path.join(root, 'out', 'corpus-manifest.json'),
    repoRoot: root,
    variantsPath: path.join(root, 'out', 'phrase-variants.json'),
  };
}

/** Resolves a phrase posting back to the document paths it names. */
function ownersOf(index: any, phrase: string): string[] {
  return index.phrases[phrase].map((id: number) => index.paths[id]);
}

// ───────────────────────────────────────────────────────────────────
// Normalization
// ───────────────────────────────────────────────────────────────────

describe('normalizeTriggerText', () => {
  it('lowercases and folds separator runs into single spaces', () => {
    expect(normalizeTriggerText('  Spec-Folder__Question!! ')).toBe('spec folder question');
  });

  it('folds non-ASCII characters into separators rather than keeping them', () => {
    expect(normalizeTriggerText('café 日本 v2\r\nnext')).toBe('caf v2 next');
  });
});

describe('queryTokens', () => {
  it('drops tokens below the candidate floor and reports why', () => {
    const { discardedTokens, tokens } = queryTokens('a bc define');
    expect(tokens).toEqual(['define']);
    expect(discardedTokens).toEqual([
      { reason: 'below-min-token-length', token: 'a' },
      { reason: 'below-min-token-length', token: 'bc' },
    ]);
  });

  it('keeps the first eight eligible tokens and reports the overflow', () => {
    const { discardedTokens, tokens } = queryTokens('one two three four five six seven eight nine ten');
    expect(tokens).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
    expect(discardedTokens).toEqual([
      { reason: 'beyond-max-query-tokens', token: 'nine' },
      { reason: 'beyond-max-query-tokens', token: 'ten' },
    ]);
  });
});

describe('scorePhrase', () => {
  it('ranks the four scoring classes the way the trigger lane does', () => {
    const query = 'spec folder question';
    expect(scorePhrase(query, 'spec folder question')).toEqual({ matchClass: 'exact', score: 1 });
    expect(scorePhrase(query, 'the spec folder question gate'))
      .toEqual({ matchClass: 'phrase-containment', score: 0.94 });
    expect(scorePhrase(query, 'folder question'))
      .toEqual({ matchClass: 'query-containment', score: 0.88 });
    expect(scorePhrase(query, 'question of folder and spec'))
      .toEqual({ matchClass: 'token-overlap', score: 0.75 });
  });

  it('refuses a single-token phrase unless it equals the query exactly', () => {
    expect(scorePhrase('spec folder question', 'spec')).toBeNull();
    expect(scorePhrase('spec', 'spec')).toEqual({ matchClass: 'exact', score: 1 });
  });
});

describe('artifact encoding', () => {
  it('interns each owning path once and addresses it by integer id', () => {
    const root = makeTempDir('speckit-trigger-encoding-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['shared phrase', 'only in a']));
    writeDoc(root, 'specs/track/b.md', frontmatter(['shared phrase']));
    const options = generationPaths(root);
    generate(options);

    const index = JSON.parse(fs.readFileSync(options.indexPath, 'utf8'));

    expect(index.schemaVersion).toBe(2);
    expect(index.paths).toEqual(['specs/track/a.md', 'specs/track/b.md']);
    expect(index.phrases['shared phrase']).toEqual([0, 1]);
    expect(index.phrases['only in a']).toEqual([0]);
    expect(ownersOf(index, 'shared phrase')).toEqual(['specs/track/a.md', 'specs/track/b.md']);
  });

  it('carries no per-phrase token list, no raw spellings and no trigram postings', () => {
    const root = makeTempDir('speckit-trigger-slim-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['Spec Folder Question']));
    const options = generationPaths(root);
    generate(options);

    const index = JSON.parse(fs.readFileSync(options.indexPath, 'utf8'));

    expect(index.tokenTrigrams).toBeUndefined();
    expect(Object.keys(index).sort())
      .toEqual(['manifestHash', 'normalization', 'paths', 'phrases', 'schemaVersion']);
    expect(index.normalization.trigramSize).toBeUndefined();
    expect(Array.isArray(index.phrases['spec folder question'])).toBe(true);
  });

  it('moves the raw spellings to the variants sidecar rather than dropping them', () => {
    const root = makeTempDir('speckit-trigger-variants-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['Spec-Folder Question']));
    writeDoc(root, 'specs/track/b.md', frontmatter(['spec folder question!']));
    const options = generationPaths(root);
    generate(options);

    const variants = JSON.parse(fs.readFileSync(options.variantsPath, 'utf8'));
    const index = JSON.parse(fs.readFileSync(options.indexPath, 'utf8'));

    expect(variants.variants['spec folder question'])
      .toEqual(['Spec-Folder Question', 'spec folder question!']);
    expect(variants.manifestHash).toBe(index.manifestHash);
  });

  it('emits a canonically sorted encoding that survives a parse round trip', () => {
    const root = makeTempDir('speckit-trigger-canonical-');
    writeDoc(root, 'specs/track/b.md', frontmatter(['zebra phrase', 'alpha phrase']));
    writeDoc(root, 'specs/track/a.md', frontmatter(['alpha phrase']));
    const options = generationPaths(root);
    generate(options);

    const text = fs.readFileSync(options.indexPath, 'utf8');
    const index = JSON.parse(text);

    // publishJson refuses a non-canonical artifact, so a byte-for-byte match
    // here is what proves the sort survived serialization rather than the
    // in-memory object merely happening to be ordered.
    expect(`${stableStringify(index)}\n`).toBe(text);
    expect(Object.keys(index.phrases)).toEqual(['alpha phrase', 'zebra phrase']);
    expect(index.paths).toEqual(['specs/track/a.md', 'specs/track/b.md']);
    expect(index.phrases['alpha phrase']).toEqual([0, 1]);
  });
});

// ───────────────────────────────────────────────────────────────────
// Serialization
// ───────────────────────────────────────────────────────────────────

describe('stableStringify', () => {
  it('sorts integer-like keys lexicographically, unlike JSON.stringify', () => {
    const value = { b: 1, 123: 2, a: 3, '049': 4 };
    expect(stableStringify(value)).toBe('{\n  "049": 4,\n  "123": 2,\n  "a": 3,\n  "b": 1\n}');
    expect(JSON.stringify(value)).toBe('{"123":2,"b":1,"a":3,"049":4}');
  });

  it('round-trips through JSON.parse to identical text', () => {
    const value = { list: ['b', 'a'], nested: { z: [], y: {} } };
    const text = stableStringify(value);
    expect(stableStringify(JSON.parse(text))).toBe(text);
  });
});

// ───────────────────────────────────────────────────────────────────
// Frontmatter categories
// ───────────────────────────────────────────────────────────────────

describe('readTriggerPhrases', () => {
  it('reads a well-formed list', () => {
    const result = readTriggerPhrases(frontmatter(['Spec Folder Question', 'gate three']));
    expect(result.category).toBe(CATEGORY.OK);
    expect(result.phrases.map((p) => p.normalized)).toEqual(['spec folder question', 'gate three']);
    expect(result.phrases[0].line).toBe(4);
  });

  it('reads the alias spelling and reports it while still yielding phrases', () => {
    const result = readTriggerPhrases(frontmatter(['alias phrase'], 'triggerPhrases'));
    expect(result.category).toBe(CATEGORY.ALIAS);
    expect(result.alias).toBe(true);
    expect(result.rawKey).toBe('triggerPhrases');
    expect(result.phrases.map((p) => p.normalized)).toEqual(['alias phrase']);
  });

  it('separates a valid empty list from a missing key', () => {
    expect(readTriggerPhrases('---\ntitle: "D"\ntrigger_phrases: []\n---\n').category)
      .toBe(CATEGORY.VALID_EMPTY_LIST);
    expect(readTriggerPhrases('---\ntitle: "D"\n---\n').category)
      .toBe(CATEGORY.MISSING_FRONTMATTER);
    expect(readTriggerPhrases('# Just a document\n').category)
      .toBe(CATEGORY.MISSING_FRONTMATTER);
  });

  it('reports an unclosed frontmatter block by its opening line', () => {
    const result = readTriggerPhrases('---\ntitle: "D"\ntrigger_phrases:\n  - "a phrase"\n');
    expect(result.category).toBe(CATEGORY.MALFORMED_FRONTMATTER);
    expect(result.line).toBe(1);
  });

  it('reports a prose block between delimiters as non-YAML', () => {
    const result = readTriggerPhrases('---\n\n# Heading\n\nSome prose line.\n\n---\n');
    expect(result.category).toBe(CATEGORY.NON_YAML_FRONTMATTER);
  });

  it('accepts a YAML comment and a one-space indented sequence', () => {
    const result = readTriggerPhrases(
      '---\ntitle: "D"\n# SPECKIT_TEMPLATE_SOURCE: spec-core\ntrigger_phrases:\n - "one space indent"\n---\n',
    );
    expect(result.category).toBe(CATEGORY.OK);
    expect(result.phrases.map((p) => p.normalized)).toEqual(['one space indent']);
  });

  it('reports a scalar where a sequence belongs', () => {
    const result = readTriggerPhrases('---\ntitle: "D"\ntrigger_phrases: not a list\n---\n');
    expect(result.category).toBe(CATEGORY.WRONG_TRIGGER_LIST_TYPE);
    expect(result.line).toBe(3);
  });

  it('reports a non-string member instead of coercing it', () => {
    const result = readTriggerPhrases('---\ntitle: "D"\ntrigger_phrases:\n  - "ok phrase"\n  - true\n---\n');
    expect(result.category).toBe(CATEGORY.NON_STRING_MEMBER);
    expect(result.line).toBe(5);
    expect(result.reason).toContain('boolean');
  });

  it('reports a duplicate phrase once and keeps a single copy', () => {
    const result = readTriggerPhrases(frontmatter(['same phrase', 'Same  Phrase!']));
    expect(result.category).toBe(CATEGORY.DUPLICATE_PHRASE);
    expect(result.phrases).toHaveLength(1);
  });

  it('truncates an oversized phrase and reports it rather than dropping it', () => {
    const long = `long ${'x'.repeat(200)}`;
    const result = readTriggerPhrases(frontmatter([long]));
    expect(result.category).toBe(CATEGORY.OVERSIZED_PHRASE);
    expect(result.phrases).toHaveLength(1);
    expect(result.phrases[0].raw).toHaveLength(120);
    expect(result.phrases[0].truncated).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// Corpus walk
// ───────────────────────────────────────────────────────────────────

describe('walkCorpus', () => {
  it('walks both roots, prunes excluded trees, and ignores non-markdown files', () => {
    const root = makeTempDir('speckit-trigger-walk-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['a']));
    writeDoc(root, 'specs/track/notes.txt', 'ignored');
    writeDoc(root, 'specs/track/z_archive/old.md', frontmatter(['archived']));
    writeDoc(root, 'specs/track/scratch/tmp.md', frontmatter(['scratch']));
    writeDoc(root, 'specs/track/research/lineages/run/iter.md', frontmatter(['lineage']));
    writeDoc(root, 'specs/track/research/synthesis.md', frontmatter(['kept']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill']));
    writeDoc(root, '.opencode/skills/demo/node_modules/pkg/readme.md', frontmatter(['vendored']));

    const { files } = walkCorpus(root);

    expect(files).toEqual([
      '.opencode/skills/demo/SKILL.md',
      'specs/track/a.md',
      'specs/track/research/synthesis.md',
    ]);
  });

  it('refuses a symlinked document whose target is outside the repository', () => {
    const root = makeTempDir('speckit-trigger-outside-');
    const outside = makeTempDir('speckit-trigger-external-');
    fs.mkdirSync(path.join(root, 'specs/track'), { recursive: true });
    fs.writeFileSync(path.join(root, 'specs/track/a.md'), '---\ntitle: a\ntrigger_phrases:\n  - "inside phrase"\n---\n# a\n');
    fs.writeFileSync(path.join(outside, 'secret.md'), '---\ntitle: s\ntrigger_phrases:\n  - "external phrase"\n---\n# s\n');
    fs.symlinkSync(path.join(outside, 'secret.md'), path.join(root, 'specs/track/leak.md'), 'file');

    const { files, skipped } = walkCorpus(root);

    expect(files).toEqual(['specs/track/a.md']);
    expect(skipped).toContainEqual({ path: 'specs/track/leak.md', reason: 'symlink target outside the repository' });
  });

  it('never indexes one document twice through a symlink', () => {
    const root = makeTempDir('speckit-trigger-symlink-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['a']));
    fs.symlinkSync(path.join(root, 'specs/track'), path.join(root, 'specs/mirror'), 'dir');
    fs.symlinkSync(path.join(root, 'specs/track/a.md'), path.join(root, 'specs/copy.md'), 'file');

    const { files, skipped } = walkCorpus(root);

    expect(files).toEqual(['specs/track/a.md']);
    expect(skipped).toContainEqual({ path: 'specs/mirror', reason: 'symlinked directory' });
    expect(skipped).toContainEqual({
      path: 'specs/copy.md',
      reason: 'duplicate of an already-indexed document',
    });
  });

  it('also walks .opencode/install-guides, the widened corpus root', () => {
    const root = makeTempDir('speckit-trigger-install-guides-');
    writeDoc(root, '.opencode/install-guides/README.md', frontmatter(['install guides']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill']));

    const { files } = walkCorpus(root);

    expect(files).toEqual([
      '.opencode/install-guides/README.md',
      '.opencode/skills/demo/SKILL.md',
    ]);
  });

  it('folds the .opencode/specs alias onto its canonical path', () => {
    expect(canonicalRelativePath('.opencode/specs/track/a.md')).toBe('specs/track/a.md');
    expect(canonicalRelativePath('.opencode/skills/demo/SKILL.md')).toBe('.opencode/skills/demo/SKILL.md');
  });

  it('prunes fixture trees in the skills tree while keeping a spec packet named for fixtures', () => {
    const root = makeTempDir('speckit-trigger-fixtures-');
    writeDoc(root, '.opencode/skills/demo/tests/fixtures/broken.md', '---\ntrigger_phrases:\n');
    writeDoc(root, '.opencode/skills/demo/tests/fixtures/nested/also-broken.md', '---\ntrigger_phrases:\n');
    writeDoc(root, '.opencode/skills/demo/scripts/__fixtures__/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.opencode/skills/demo/test-fixtures/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.opencode/skills/demo/tests/advisor-fixtures/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill']));
    // A spec packet may legitimately be named for fixtures, or hold a folder of
    // them it documents. Those are documents, and pruning them would drop real
    // specifications out of retrieval.
    writeDoc(root, 'specs/track/002-contracts-and-fixtures/spec.md', frontmatter(['contracts']));
    writeDoc(root, 'specs/track/003-scaffold/fixtures/routing-parity.md', frontmatter(['routing parity']));

    const { files } = walkCorpus(root);

    expect(files).toEqual([
      '.opencode/skills/demo/SKILL.md',
      'specs/track/002-contracts-and-fixtures/spec.md',
      'specs/track/003-scaffold/fixtures/routing-parity.md',
    ]);
  });
});

// ───────────────────────────────────────────────────────────────────
// Generation
// ───────────────────────────────────────────────────────────────────

describe('generate', () => {
  it('produces a byte-identical artifact on a second run over the same corpus', () => {
    const root = makeTempDir('speckit-trigger-idempotent-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question', 'gate three']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill routing']));
    const options = generationPaths(root);

    const first = generate(options);
    const firstBytes = fs.readFileSync(options.indexPath);
    const firstManifest = fs.readFileSync(options.manifestPath);

    const second = generate(options);

    expect(first.published).toBe(true);
    expect(second.published).toBe(true);
    expect(second.indexSha256).toBe(first.indexSha256);
    expect(fs.readFileSync(options.indexPath).equals(firstBytes)).toBe(true);
    expect(fs.readFileSync(options.manifestPath).equals(firstManifest)).toBe(true);
  });

  it('emits a manifest that pins the corpus and leaves the prompt-set hash for the parity arm', () => {
    const root = makeTempDir('speckit-trigger-manifest-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question']));
    const options = generationPaths(root);

    const report = generate(options);
    const manifest = JSON.parse(fs.readFileSync(options.manifestPath, 'utf8'));
    const index = JSON.parse(fs.readFileSync(options.indexPath, 'utf8'));

    expect(manifest.includedPaths).toEqual(['specs/track/a.md']);
    expect(manifest.promptSetHash).toBeNull();
    expect(manifest.exclusions).toContain('**/z_archive/**');
    expect(manifest.manifestHash).toBe(report.manifestHash);
    expect(index.manifestHash).toBe(manifest.manifestHash);
    expect(index.schemaVersion).toBe(2);
    expect(manifest.ignoredPaths).toEqual([]);
  });

  it('leaves the previous index untouched when the corpus turns malformed', () => {
    const root = makeTempDir('speckit-trigger-failclosed-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question']));
    const options = generationPaths(root);

    const good = generate(options);
    const goodBytes = fs.readFileSync(options.indexPath);
    expect(good.published).toBe(true);

    writeDoc(root, 'specs/track/broken.md', '---\ntitle: "D"\ntrigger_phrases: scalar value\n---\n');
    const refused = generate(options);

    expect(refused.published).toBe(false);
    expect(refused.stats.malformedDocuments).toBe(1);
    expect(fs.readFileSync(options.indexPath).equals(goodBytes)).toBe(true);
    expect(fs.readdirSync(path.dirname(options.indexPath)).filter((n) => n.startsWith('.'))).toEqual([]);

    const diagnostics = JSON.parse(fs.readFileSync(options.diagnosticsPath, 'utf8'));
    expect(diagnostics.rows).toContainEqual(expect.objectContaining({
      category: CATEGORY.WRONG_TRIGGER_LIST_TYPE,
      path: 'specs/track/broken.md',
    }));
  });

  it('publishes when the only untrusted document is a listed ignored path', () => {
    const root = makeTempDir('speckit-trigger-ignored-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question']));
    writeDoc(root, 'specs/track/transcript.md', '---\n\n# Heading\n\nProse line.\n\n---\n');
    const options = generationPaths(root);

    expect(generate(options).published).toBe(false);

    const report = generate({
      ...options,
      ignoredPaths: [{ path: 'specs/track/transcript.md', reason: 'captured transcript' }],
    });

    expect(report.published).toBe(true);
    expect(report.stats.malformedDocuments).toBe(0);
    expect(report.stats.ignoredMalformedDocuments).toBe(1);

    // The exemption covers the refusal only: the defect is still reported.
    const diagnostics = JSON.parse(fs.readFileSync(options.diagnosticsPath, 'utf8'));
    expect(diagnostics.rows).toContainEqual(expect.objectContaining({
      category: CATEGORY.NON_YAML_FRONTMATTER,
      ignored: true,
      path: 'specs/track/transcript.md',
    }));
    expect(diagnostics.ignoredPathsUnmatched).toEqual([]);

    const manifest = JSON.parse(fs.readFileSync(options.manifestPath, 'utf8'));
    expect(manifest.ignoredPaths)
      .toEqual([{ path: 'specs/track/transcript.md', reason: 'captured transcript' }]);
  });

  it('still refuses an untrusted document that the ignored list does not name', () => {
    const root = makeTempDir('speckit-trigger-unignored-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question']));
    writeDoc(root, 'specs/track/listed.md', '---\n\n# Heading\n\nProse line.\n\n---\n');
    writeDoc(root, 'specs/track/unlisted.md', '---\ntitle: "D"\ntrigger_phrases: scalar value\n---\n');

    const report = generate({
      ...generationPaths(root),
      ignoredPaths: [{ path: 'specs/track/listed.md', reason: 'captured transcript' }],
    });

    expect(report.published).toBe(false);
    expect(report.stats.malformedDocuments).toBe(1);
    expect(report.stats.ignoredMalformedDocuments).toBe(1);
  });

  it('names a listed path that matched no document, so a dead exemption is visible', () => {
    const root = makeTempDir('speckit-trigger-deadignore-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question']));
    const options = generationPaths(root);

    generate({
      ...options,
      ignoredPaths: [{ path: 'specs/track/gone.md', reason: 'no longer present' }],
    });

    const diagnostics = JSON.parse(fs.readFileSync(options.diagnosticsPath, 'utf8'));
    expect(diagnostics.ignoredPathsUnmatched).toEqual(['specs/track/gone.md']);
  });

  it('ships an exemption list whose every entry carries a reason', () => {
    expect(IGNORED_PATHS.length).toBeGreaterThan(0);
    for (const entry of IGNORED_PATHS) {
      expect(entry.path).toEqual(expect.any(String));
      expect(entry.reason.length).toBeGreaterThan(0);
    }
  });

  it('publishes a malformed corpus only under the explicit override', () => {
    const root = makeTempDir('speckit-trigger-override-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question']));
    writeDoc(root, 'specs/track/broken.md', '---\ntitle: "D"\ntrigger_phrases: scalar value\n---\n');
    const options = generationPaths(root);

    expect(generate(options).published).toBe(false);
    expect(generate({ ...options, allowMalformed: true }).published).toBe(true);
  });

  it('counts every diagnostic category across one corpus', () => {
    const root = makeTempDir('speckit-trigger-categories-');
    writeDoc(root, 'specs/track/ok.md', frontmatter(['spec folder question']));
    writeDoc(root, 'specs/track/alias.md', frontmatter(['alias phrase'], 'triggerPhrases'));
    writeDoc(root, 'specs/track/empty.md', '---\ntitle: "D"\ntrigger_phrases: []\n---\n');
    writeDoc(root, 'specs/track/nokey.md', '---\ntitle: "D"\n---\n');
    writeDoc(root, 'specs/track/dup.md', frontmatter(['same phrase', 'Same Phrase']));
    writeDoc(root, 'specs/track/big.md', frontmatter([`long ${'x'.repeat(200)}`]));
    writeDoc(root, 'specs/track/unclosed.md', '---\ntitle: "D"\ntrigger_phrases:\n  - "x phrase"\n');
    writeDoc(root, 'specs/track/prose.md', '---\n\n# Heading\n\nProse line.\n\n---\n');
    writeDoc(root, 'specs/track/scalar.md', '---\ntitle: "D"\ntrigger_phrases: scalar\n---\n');
    writeDoc(root, 'specs/track/member.md', '---\ntitle: "D"\ntrigger_phrases:\n  - 42\n---\n');

    const built = buildIndex({ repoRoot: root });
    const counts = built.diagnostics.counts as Record<string, number>;

    expect(counts).toEqual({
      [CATEGORY.ALIAS]: 1,
      [CATEGORY.DUPLICATE_PHRASE]: 1,
      [CATEGORY.MALFORMED_FRONTMATTER]: 1,
      [CATEGORY.MISSING_FRONTMATTER]: 1,
      [CATEGORY.NON_STRING_MEMBER]: 1,
      [CATEGORY.NON_YAML_FRONTMATTER]: 1,
      [CATEGORY.OK]: 1,
      [CATEGORY.OVERSIZED_PHRASE]: 1,
      [CATEGORY.VALID_EMPTY_LIST]: 1,
      [CATEGORY.WRONG_TRIGGER_LIST_TYPE]: 1,
    });

    const rows = built.diagnostics.rows as Array<Record<string, unknown>>;
    expect(rows).toHaveLength(9);
    for (const row of rows) {
      expect(row.path).toEqual(expect.any(String));
      expect(row.line).toBeGreaterThanOrEqual(1);
      expect(row.category).toEqual(expect.any(String));
      expect(row.reason).toEqual(expect.any(String));
    }
  });
});

describe('publishJson', () => {
  it('leaves the target and no temporary file behind when validation rejects', () => {
    const root = makeTempDir('speckit-trigger-publish-');
    const target = path.join(root, 'artifact.json');
    publishJson(target, { a: 1 });
    const before = sha256File(target);

    expect(() => publishJson(target, { a: 2 }, () => {
      throw new Error('rejected by validation');
    })).toThrow('rejected by validation');

    expect(sha256File(target)).toBe(before);
    expect(fs.readdirSync(root)).toEqual(['artifact.json']);
  });
});

// ───────────────────────────────────────────────────────────────────
// Lookup
// ───────────────────────────────────────────────────────────────────

describe('lookup', () => {
  function buildFixtureIndex(): ReturnType<typeof loadIndex> {
    const root = makeTempDir('speckit-trigger-lookup-');
    writeDoc(root, 'specs/track/exact.md', frontmatter(['Spec Folder Question']));
    writeDoc(root, 'specs/track/inner.md', frontmatter(['the spec folder question gate']));
    writeDoc(root, 'specs/track/outer.md', frontmatter(['folder question']));
    writeDoc(root, 'specs/track/overlap.md', frontmatter(['question of folder and spec']));
    writeDoc(root, 'specs/other/partial.md', frontmatter(['specification workbench']));
    writeDoc(root, 'specs/other/midword.md', frontmatter(['unspecified behaviour drift']));
    const options = generationPaths(root);
    generate(options);
    return loadIndex(options.indexPath);
  }

  it('returns the score classes best first with ties broken by path', () => {
    const answer = lookup(buildFixtureIndex(), 'Spec folder question');

    expect(answer.normalizedQuery).toBe('spec folder question');
    expect(answer.tokens).toEqual(['spec', 'folder', 'question']);
    expect(answer.results.map((r) => [r.matchClass, r.path])).toEqual([
      ['exact', 'specs/track/exact.md'],
      ['phrase-containment', 'specs/track/inner.md'],
      ['query-containment', 'specs/track/outer.md'],
      ['token-overlap', 'specs/track/overlap.md'],
      ['partial', 'specs/other/midword.md'],
      ['partial', 'specs/other/partial.md'],
    ]);
    expect(answer.indexHash).toMatch(/^[0-9a-f]{64}$/);
    expect(answer.manifestHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('admits a mid-word substring by scanning the phrase keys', () => {
    const loaded = buildFixtureIndex();

    // "cified" sits mid-token inside "unspecified". No stored posting reaches
    // that phrase now, so this is the case the key scan has to answer on its
    // own; on its own the phrase scores as containment.
    const alone = lookup(loaded, 'cified');
    expect(alone.candidatePhraseCount).toBe(1);
    expect(alone.results.map((r) => [r.matchClass, r.path]))
      .toEqual([['phrase-containment', 'specs/other/midword.md']]);

    // Widening the query keeps the same substring-only candidate but drops it
    // below every scoring class, which is the partial class the SQL gate admits.
    const widened = lookup(loaded, 'cified drift zone');
    expect(widened.results.map((r) => [r.matchClass, r.path]))
      .toEqual([['partial', 'specs/other/midword.md']]);

    // A substring landing at a token's tail is the case a leading-window
    // posting list could serve but a naive prefix index could not.
    const tail = lookup(loaded, 'bench');
    expect(tail.results.map((r) => r.path)).toEqual(['specs/other/partial.md']);
  });

  it('returns nothing when every query token falls below the candidate floor', () => {
    const answer = lookup(buildFixtureIndex(), 'a of');

    expect(answer.tokens).toEqual([]);
    expect(answer.results).toEqual([]);
    expect(answer.discardedTokens).toHaveLength(2);
  });

  it('scopes results to a spec folder and its descendants', () => {
    const loaded = buildFixtureIndex();

    const unscoped = lookup(loaded, 'spec folder question').results;
    const scoped = lookup(loaded, 'spec folder question', { specFolder: 'specs/track' }).results;

    expect(scoped.every((r) => r.path.startsWith('specs/track/'))).toBe(true);
    expect(scoped.length).toBeLessThan(unscoped.length);
    expect(lookup(loaded, 'spec folder question', { specFolder: 'specs' }).results)
      .toHaveLength(unscoped.length);
    expect(lookup(loaded, 'spec folder question', { specFolder: 'specs/missing' }).results).toEqual([]);
  });

  it('matches a spec folder exactly or as a prefix, like the SQL scope filter', () => {
    expect(specFolderMatches('specs/track/a.md', 'specs/track')).toBe(true);
    expect(specFolderMatches('specs/track/child/a.md', 'specs/track')).toBe(true);
    expect(specFolderMatches('specs/tracking/a.md', 'specs/track')).toBe(false);
  });
});

describe('loadIndex fails closed on a malformed artifact', () => {
  function corrupted(mutate: (index: any) => void): string {
    const root = makeTempDir('speckit-trigger-corrupt-');
    writeDoc(root, 'specs/track/a.md', frontmatter(['shared phrase', 'only in a']));
    writeDoc(root, 'specs/track/b.md', frontmatter(['shared phrase']));
    const options = generationPaths(root);
    generate(options);
    const index = JSON.parse(fs.readFileSync(options.indexPath, 'utf8'));
    mutate(index);
    fs.writeFileSync(options.indexPath, JSON.stringify(index), 'utf8');
    return options.indexPath;
  }

  it('refuses a posting that is not an array instead of skipping the phrase', () => {
    const indexPath = corrupted((index) => { index.phrases['shared phrase'] = 0; });
    expect(() => loadIndex(indexPath)).toThrow(/posting is not an array/);
  });

  it('refuses a path id outside the path table instead of dropping the document', () => {
    const indexPath = corrupted((index) => { index.phrases['only in a'] = [7]; });
    expect(() => loadIndex(indexPath)).toThrow(/outside the table/);
  });

  it('refuses an artifact written at another schema version', () => {
    const indexPath = corrupted((index) => { index.schemaVersion = 1; });
    expect(() => loadIndex(indexPath)).toThrow(/schemaVersion is 1/);
  });

  it('still loads the artifact the generator published', () => {
    const indexPath = corrupted(() => {});
    expect(loadIndex(indexPath).schemaVersion).toBe(2);
  });
});

describe('lookup CLI limit contract', () => {
  it('accepts only whole non-negative decimal integers for --limit', () => {
    expect(parseArgs(['prompt', '--limit', '5']).limit).toBe(5);
    expect(parseArgs(['prompt', '--limit', '0']).limit).toBe(0);
    for (const bad of ['2junk', '1.9', '-1', '1e3', '', ' 3']) {
      expect(() => parseArgs(['prompt', '--limit', bad])).toThrow(/non-negative integer/);
    }
  });
});
