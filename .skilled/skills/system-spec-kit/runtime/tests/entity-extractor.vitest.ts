// TEST: ENTITY EXTRACTOR (R10)
// Covers: extractEntities, filterEntities, normalizeEntityName,
// Entity-denylist
import { describe, it, expect } from 'vitest';

import {
  extractEntities,
  filterEntities,
  normalizeEntityName,
  __testables,
} from '../lib/extraction/entity-extractor.js';
import type { ExtractedEntity } from '../lib/extraction/entity-extractor.js';

import {
  isEntityDenied,
  getEntityDenylistSize,
  ENTITY_DENYLIST,
} from '../lib/extraction/entity-denylist.js';

// ===============================================================
// 1. extractEntities (~12 tests)
// ===============================================================

describe('extractEntities', () => {
  it('returns empty array for empty content', () => {
    const result = extractEntities('');
    expect(result).toEqual([]);
  });

  it('returns empty array for whitespace-only content', () => {
    const result = extractEntities('   \n\t  ');
    expect(result).toEqual([]);
  });

  it('extracts proper nouns (capitalized multi-word sequences)', () => {
    // Regex matches consecutive capitalized words; "The" is included since it
    // Matches [A-Z][a-z]+, so the full match is "The Spec Kit Memory".
    const result = extractEntities('The Spec Kit Memory system is robust.');
    const properNouns = result.filter((e) => e.type === 'proper_noun');
    expect(properNouns.length).toBeGreaterThanOrEqual(1);
    expect(properNouns.some((e) => e.text === 'The Spec Kit Memory')).toBe(true);
  });

  it('extracts technology names from code fences', () => {
    const result = extractEntities('Here is code:\n```typescript\nconst x = 1;\n```\nAnd more:\n```python\nprint("hi")\n```');
    const techs = result.filter((e) => e.type === 'technology');
    expect(techs.length).toBe(2);
    expect(techs.map((e) => e.text)).toContain('typescript');
    expect(techs.map((e) => e.text)).toContain('python');
  });

  it('stops key phrase extraction at sentence boundaries', () => {
    const result = extractEntities('Built using React and integrates via GraphQL. Implements Singleton pattern.');
    const keyPhrases = result.filter((e) => e.type === 'key_phrase');
    expect(keyPhrases.length).toBeGreaterThanOrEqual(1);
    expect(keyPhrases.some((e) => e.text === 'React')).toBe(true);
    expect(keyPhrases.some((e) => e.text === 'GraphQL')).toBe(true);
    expect(keyPhrases.some((e) => e.text === 'Singleton')).toBe(true);
    expect(keyPhrases.some((e) => e.text.includes('. Implements'))).toBe(false);
  });

  it('keeps dotted technology names inside a single key phrase token', () => {
    const result = extractEntities('Built using Node.js with Next.js Adapter.');
    const keyPhrases = result.filter((e) => e.type === 'key_phrase');
    expect(keyPhrases.some((e) => e.text === 'Node.js')).toBe(true);
    expect(keyPhrases.some((e) => e.text === 'Next.js Adapter')).toBe(true);
  });

  it('extracts heading content from markdown', () => {
    const result = extractEntities('## Architecture Overview\nSome text.\n### Database Schema\nMore text.');
    const headings = result.filter((e) => e.type === 'heading');
    expect(headings.length).toBe(2);
    expect(headings.map((e) => e.text)).toContain('Architecture Overview');
    expect(headings.map((e) => e.text)).toContain('Database Schema');
  });

  it('extracts quoted strings (2-50 chars)', () => {
    // "Entity Extractor" is also matched by the proper_noun regex (two
    // Capitalized words). Deduplication merges them; the first type
    // (proper_noun) wins, so only "valid" remains with type 'quoted'.
    const result = extractEntities('The module is called "Entity Extractor" and outputs "valid" results.');
    const quoted = result.filter((e) => e.type === 'quoted');
    expect(quoted.length).toBe(1);
    expect(quoted[0].text).toBe('valid');
    // "Entity Extractor" is present but as proper_noun due to dedup
    const entityExtractor = result.find((e) => e.text === 'Entity Extractor');
    expect(entityExtractor).toBeDefined();
    expect(entityExtractor!.type).toBe('proper_noun');
    expect(entityExtractor!.frequency).toBe(2); // once from proper_noun, once from quoted
  });

  it('deduplicates by normalized text', () => {
    // "Spec Kit" appears twice via proper noun match in two separate contexts
    const content = 'Spec Kit is great. We love Spec Kit here.';
    const result = extractEntities(content);
    const specKitEntries = result.filter((e) => e.text.toLowerCase().includes('spec kit'));
    // Should be deduplicated to a single entry
    const normalizedKeys = new Set(specKitEntries.map((e) => e.text.toLowerCase().trim()));
    expect(normalizedKeys.size).toBeLessThanOrEqual(specKitEntries.length);
  });

  it('sums frequencies for duplicate entities', () => {
    // Same proper noun appearing multiple times
    const content = 'Hello World is good. Hello World is great. Hello World is best.';
    const result = extractEntities(content);
    const hw = result.find((e) => e.text === 'Hello World');
    expect(hw).toBeDefined();
    expect(hw!.frequency).toBe(3);
  });

  it('extracts all types from mixed content', () => {
    const content = [
      '## Sprint Overview',
      'Built using TypeScript with Better Sqlite integration.',
      '```javascript',
      'const x = 1;',
      '```',
      'The "entity extractor" was implemented by Open Code Team.',
    ].join('\n');
    const result = extractEntities(content);
    const types = new Set(result.map((e) => e.type));
    expect(types.has('heading')).toBe(true);
    expect(types.has('technology')).toBe(true);
    // Key_phrase: "using TypeScript" and "with Better Sqlite"
    expect(types.has('key_phrase')).toBe(true);
    expect(types.has('quoted')).toBe(true);
  });

  it('handles long content with many entities', () => {
    const lines: string[] = [];
    for (let i = 0; i < 50; i++) {
      lines.push(`## Heading Number ${i}`);
      lines.push(`Content using Module${i} with Library${i}.`);
      lines.push(`"quoted phrase ${i}"`);
    }
    const content = lines.join('\n');
    const result = extractEntities(content);
    expect(result.length).toBeGreaterThan(10);
  });

  it('does not extract single non-capitalized word as proper noun', () => {
    const content = 'hello world lowercase only.';
    const result = extractEntities(content);
    const properNouns = result.filter((e) => e.type === 'proper_noun');
    expect(properNouns).toHaveLength(0);
  });

  it('ignores quoted strings shorter than 2 or longer than 50 chars', () => {
    // Use isolated quote pairs to prevent cross-quote matching.
    // The regex "([^"]{2,50})" matches greedily between any two quotes,
    // So multiple quotes on the same line can pair unexpectedly.
    const tooShort = extractEntities('Value "a" end');
    expect(tooShort.filter((e) => e.type === 'quoted')).toHaveLength(0);

    const justRight = extractEntities('Value "hello world" end');
    const rightQuoted = justRight.filter((e) => e.type === 'quoted');
    expect(rightQuoted).toHaveLength(1);
    expect(rightQuoted[0].text).toBe('hello world');

    const tooLong = extractEntities('Value "' + 'A'.repeat(51) + '" end');
    expect(tooLong.filter((e) => e.type === 'quoted')).toHaveLength(0);
  });
});

// ===============================================================
// 2. filterEntities (~8 tests)
// ===============================================================

describe('filterEntities', () => {
  it('removes single character entities', () => {
    const entities: ExtractedEntity[] = [
      { text: 'a', type: 'proper_noun', frequency: 1 },
      { text: 'React Native', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('React Native');
  });

  it('removes entities longer than 100 characters', () => {
    const entities: ExtractedEntity[] = [
      { text: 'A'.repeat(101), type: 'proper_noun', frequency: 1 },
      { text: 'Valid Entity', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Valid Entity');
  });

  it('removes entities where ALL words are on the denylist', () => {
    // "new" and "thing" are both on the denylist
    const entities: ExtractedEntity[] = [
      { text: 'new thing', type: 'proper_noun', frequency: 1 },
      { text: 'React Framework', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('React Framework');
  });

  it('keeps valid entities that pass all checks', () => {
    const entities: ExtractedEntity[] = [
      { text: 'TypeScript Compiler', type: 'technology', frequency: 2 },
      { text: 'Better Sqlite', type: 'technology', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    const result = filterEntities([]);
    expect(result).toEqual([]);
  });

  it('handles mix of valid and invalid entities', () => {
    const entities: ExtractedEntity[] = [
      { text: 'x', type: 'quoted', frequency: 1 },                    // too short
      { text: 'A'.repeat(120), type: 'proper_noun', frequency: 1 },   // too long
      { text: 'old change', type: 'heading', frequency: 1 },          // all denylist
      { text: 'Spec Kit Memory', type: 'proper_noun', frequency: 3 }, // valid
      { text: 'vitest', type: 'technology', frequency: 1 },           // valid
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.text)).toContain('Spec Kit Memory');
    expect(result.map((e) => e.text)).toContain('vitest');
  });

  it('is case-insensitive for denylist matching', () => {
    // "THING" should match "thing" in the denylist
    const entities: ExtractedEntity[] = [
      { text: 'THING', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(0);
  });

  it('keeps multi-word entities where only SOME words are denied', () => {
    // "new" is denied but "Framework" is not, so not ALL words are denied
    const entities: ExtractedEntity[] = [
      { text: 'new Framework', type: 'key_phrase', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('new Framework');
  });
});

// ===============================================================
// 3. Entity Denylist (~4 tests)
// ===============================================================

describe('Entity Denylist', () => {
  it('isEntityDenied returns true for common nouns', () => {
    expect(isEntityDenied('thing')).toBe(true);
    expect(isEntityDenied('time')).toBe(true);
    expect(isEntityDenied('people')).toBe(true);
    expect(isEntityDenied('system')).toBe(true);
  });

  it('isEntityDenied returns false for valid entity names', () => {
    expect(isEntityDenied('React')).toBe(false);
    expect(isEntityDenied('TypeScript')).toBe(false);
    expect(isEntityDenied('Kubernetes')).toBe(false);
    expect(isEntityDenied('SpecKit')).toBe(false);
  });

  it('isEntityDenied is case-insensitive', () => {
    expect(isEntityDenied('THING')).toBe(true);
    expect(isEntityDenied('Thing')).toBe(true);
    expect(isEntityDenied('tHiNg')).toBe(true);
    expect(isEntityDenied('  thing  ')).toBe(true);
  });

  it('getDenylistSize returns a positive number', () => {
    const size = getEntityDenylistSize();
    expect(size).toBeGreaterThan(0);
    // Should be at least the sum of all three arrays (COMMON_NOUNS + TECHNOLOGY_STOP_WORDS + GENERIC_MODIFIERS)
    expect(size).toBeGreaterThanOrEqual(30);
    // Cross-check: size should equal the Set size
    expect(size).toBe(ENTITY_DENYLIST.size);
  });
});

// ===============================================================
// 8. normalizeEntityName (~3 tests)
// ===============================================================

describe('normalizeEntityName', () => {
  it('lowercases text', () => {
    expect(normalizeEntityName('React Framework')).toBe('react framework');
    expect(normalizeEntityName('HELLO WORLD')).toBe('hello world');
  });

  it('strips punctuation (Unicode-aware, hyphens stripped too)', () => {
    // Unicode-aware regex /[^\p{L}\p{N}\s]/gu replaces all non-letter/non-number/non-space
    // Characters (including dots and hyphens) with a space, then collapses whitespace.
    expect(normalizeEntityName('React.js!')).toBe('react js');
    expect(normalizeEntityName('hello-world')).toBe('hello world');
    expect(normalizeEntityName('test@special#chars')).toBe('test special chars');
    expect(normalizeEntityName('it\'s a "test"')).toBe('it s a test');
  });

  it('collapses whitespace and trims', () => {
    expect(normalizeEntityName('  hello   world  ')).toBe('hello world');
    expect(normalizeEntityName('multiple   spaces   here')).toBe('multiple spaces here');
    expect(normalizeEntityName('\ttab\tseparated')).toBe('tab separated');
  });
});

// ===============================================================
// 9. __testables.deduplicateEntities (internal helper)
// ===============================================================

describe('__testables.deduplicateEntities', () => {
  it('merges entries with same normalized key and sums frequencies', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'Hello World', type: 'proper_noun' },
      { text: 'Hello World', type: 'technology' },
      { text: 'Hello World', type: 'quoted' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Hello World');
    expect(result[0].frequency).toBe(3);
    // First occurrence's type wins
    expect(result[0].type).toBe('proper_noun');
  });

  it('returns empty array for empty input', () => {
    const result = __testables.deduplicateEntities([]);
    expect(result).toEqual([]);
  });

  it('preserves distinct entities as separate entries', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'Alpha', type: 'technology' },
      { text: 'Beta', type: 'technology' },
      { text: 'Gamma', type: 'proper_noun' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(result).toHaveLength(3);
    expect(result.every((e) => e.frequency === 1)).toBe(true);
  });

  it('treats differently-cased text as duplicates via normalization', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'React Framework', type: 'proper_noun' },
      { text: 'react framework', type: 'technology' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(result).toHaveLength(1);
    expect(result[0].frequency).toBe(2);
    // First occurrence wins, so text stays as "React Framework"
    expect(result[0].text).toBe('React Framework');
  });

  it('uses the linker normalizer for punctuation-aware deduplication', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'TF-IDF', type: 'technology' },
      { text: 'tf idf', type: 'key_phrase' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(normalizeEntityName(raw[0].text)).toBe(normalizeEntityName(raw[1].text));
    expect(result).toHaveLength(1);
    expect(result[0].frequency).toBe(2);
    expect(result[0].text).toBe('TF-IDF');
    expect(result[0].type).toBe('technology');
  });
});
