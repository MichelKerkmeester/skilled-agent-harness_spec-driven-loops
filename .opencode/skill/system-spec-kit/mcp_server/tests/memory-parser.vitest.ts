// ---------------------------------------------------------------
// MODULE: Memory Parser Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll } from 'vitest';
import * as memoryParser from '../lib/parsing/memory-parser';

/* ─────────────────────────────────────────────────────────────
   TESTS: MEMORY PARSER (T500)
──────────────────────────────────────────────────────────────── */

describe('Memory Parser Tests (T500)', () => {

  // ─── 5.1 FRONTMATTER PARSING (T500-01 through T500-05) ───

  describe('Frontmatter Parsing (T500-01 to T500-05)', () => {
    it('T500-01: Valid markdown with frontmatter parses correctly', () => {
      const content = `---
title: "Test Memory"
importanceTier: critical
contextType: implementation
---

# Test Memory

Some content here.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);
      const contextType = memoryParser.extractContextType(content);

      expect(title).toBe('Test Memory');
      expect(tier).toBe('critical');
      expect(contextType).toBe('implementation');
    });

    it('T500-02: Missing frontmatter handled gracefully', () => {
      const content = `# No Frontmatter Here

Just plain markdown content.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('No Frontmatter Here');
      expect(tier).toBe('normal');
    });

    it('T500-03: Empty file returns default/empty result', () => {
      const content = '';
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);
      const triggers = memoryParser.extractTriggerPhrases(content);

      expect(title).toBeNull();
      expect(tier).toBe('normal');
      expect(Array.isArray(triggers)).toBe(true);
      expect(triggers.length).toBe(0);
    });

    it('T500-04: Special characters in frontmatter preserved', () => {
      const content = `---
title: "Memory with special chars: <>&\\"'@#$%"
---

Content here.
`;
      const title = memoryParser.extractTitle(content);
      expect(title).toBeTruthy();
      expect(title).toContain('<>&');
    });

    it('T500-05: Nested frontmatter YAML values', () => {
      const content = `---
title: "Nested Test"
importanceTier: important
contextType: research
---

# Nested Test

Content.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('Nested Test');
      expect(tier).toBe('important');
    });
  });

  // ─── 5.2 TRIGGER PHRASE EXTRACTION (T500-06) ─────────────

  describe('Trigger Phrase Extraction (T500-06)', () => {
    it('T500-06a: Inline YAML trigger phrases extracted', () => {
      const contentInline = `---
triggerPhrases: ["save context", "memory save", "persist state"]
---

# Test
`;
      const triggersInline = memoryParser.extractTriggerPhrases(contentInline);

      expect(Array.isArray(triggersInline)).toBe(true);
      expect(triggersInline.length).toBe(3);
      expect(triggersInline).toContain('save context');
      expect(triggersInline).toContain('memory save');
      expect(triggersInline).toContain('persist state');
    });

    it('T500-06b: Multi-line YAML trigger phrases extracted', () => {
      const contentMultiLine = `---
triggerPhrases:
  - "debug workflow"
  - "fix issue"
  - "troubleshoot"
---

# Test
`;
      const triggersMulti = memoryParser.extractTriggerPhrases(contentMultiLine);

      expect(Array.isArray(triggersMulti)).toBe(true);
      expect(triggersMulti.length).toBe(3);
    });
  });

  // ─── 5.3 CONTENT HASH (T500-07 to T500-08) ──────────────

  describe('Content Hash (T500-07 to T500-08)', () => {
    it('T500-07: Content hash computation is consistent', () => {
      const content = 'Some test content for hashing.';
      const hash1 = memoryParser.computeContentHash(content);
      const hash2 = memoryParser.computeContentHash(content);

      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe('string');
      expect(hash1.length).toBe(64);
    });

    it('T500-08: Content hash changes when content changes', () => {
      const hash1 = memoryParser.computeContentHash('Content version 1');
      const hash2 = memoryParser.computeContentHash('Content version 2');

      expect(hash1).not.toBe(hash2);
    });
  });

  // ─── 5.4 ANCHOR DETECTION (T500-09) ──────────────────────

  describe('Anchor Detection (T500-09)', () => {
    it('T500-09: Anchor detection works', () => {
      const content = `Some intro text.

<!-- ANCHOR:decisions -->
Decision 1: Use SQLite for storage.
Decision 2: Use SHA-256 for hashing.
<!-- /ANCHOR:decisions -->

More text.

<!-- ANCHOR:next-steps -->
Step 1: Implement caching.
<!-- /ANCHOR:next-steps -->
`;
      const anchors = memoryParser.extractAnchors(content);
      const validation = memoryParser.validateAnchors(content);

      expect(anchors['decisions']).toBeTruthy();
      expect(anchors['next-steps']).toBeTruthy();
      expect(validation.valid).toBe(true);
    });

    it('T500-09b: Unclosed anchor detected', () => {
      const badContent = `<!-- ANCHOR:unclosed -->
Some text without closing tag.
`;
      const badValidation = memoryParser.validateAnchors(badContent);
      expect(badValidation.valid).toBe(false);
      expect(badValidation.unclosedAnchors).toContain('unclosed');
    });
  });

  // ─── 5.5 LARGE FILE HANDLING (T500-10) ───────────────────

  describe('Large File Handling (T500-10)', () => {
    it('T500-10: Large file handling (>10KB)', () => {
      const header = `---
title: "Large File Test"
---

# Large File Test

`;
      const largeBody = 'x'.repeat(15000); // >10KB
      const largeContent = header + largeBody;

      const title = memoryParser.extractTitle(largeContent);
      const hash = memoryParser.computeContentHash(largeContent);

      expect(title).toBe('Large File Test');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });
  });

  // ─── 5.6 ARRAY VALUES & MALFORMED YAML (T500-11 to T500-12) ──

  describe('Array Values & Malformed YAML (T500-11 to T500-12)', () => {
    it('T500-11: Array values in frontmatter', () => {
      const content = `---
triggerPhrases: ["alpha", "beta", "gamma"]
---

# Array Test
`;
      const triggers = memoryParser.extractTriggerPhrases(content);
      expect(Array.isArray(triggers)).toBe(true);
      expect(triggers.length).toBe(3);
    });

    it('T500-12: Malformed YAML frontmatter handled', () => {
      const content = `---
title: unclosed quote
importanceTier: [invalid
---

# Malformed
`;
      // Should not throw - should return defaults
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      // The parser is regex-based so it should still extract something or return defaults
      expect(typeof title === 'string' || title === null).toBe(true);
    });
  });

  // ─── 5.7 BODY-ONLY & FRONTMATTER-ONLY (T500-13 to T500-14) ──

  describe('Body-only & Frontmatter-only (T500-13 to T500-14)', () => {
    it('T500-13: File with only frontmatter (no body)', () => {
      const content = `---
title: "Frontmatter Only"
importanceTier: important
---
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('Frontmatter Only');
      expect(tier).toBe('important');
    });

    it('T500-14: File with only body (no frontmatter)', () => {
      const content = `# Just A Heading

Some body content without any frontmatter.

## Another Section

More content.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('Just A Heading');
      expect(tier).toBe('normal');
    });
  });

  // ─── 5.8 UNICODE CONTENT (T500-15) ───────────────────────

  describe('Unicode Content Handling (T500-15)', () => {
    it('T500-15: Unicode content handling', () => {
      const content = `---
title: "Memoire avec des accents francais"
---

# Memoire avec des accents francais

Contenu en francais: cafe, resume, naive, cliche.
Japanese: \u6771\u4EAC\u90FD
Chinese: \u4F60\u597D\u4E16\u754C
Emoji: Test content
`;
      const title = memoryParser.extractTitle(content);
      const hash = memoryParser.computeContentHash(content);

      expect(title).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });
  });

  describe('Skill Reference Classification (T500-16)', () => {
    it('T500-16a: checklists path maps to skill_checklist', () => {
      const filePath = '/workspace/.opencode/skill/sk-code--web/references/checklists/quality.md';
      const documentType = memoryParser.extractDocumentType(filePath);

      expect(documentType).toBe('skill_checklist');
    });

    it('T500-16b: references path maps to skill_reference', () => {
      const filePath = '/workspace/.opencode/skill/sk-code--web/references/patterns.md';
      const documentType = memoryParser.extractDocumentType(filePath);

      expect(documentType).toBe('skill_reference');
    });

    it('T500-16c: assets path maps to skill_asset', () => {
      const filePath = '/workspace/.opencode/skill/sk-code--web/assets/templates/component.md';
      const documentType = memoryParser.extractDocumentType(filePath);

      expect(documentType).toBe('skill_asset');
    });

    it('T500-16d: skill references resolve to skill spec folder', () => {
      const filePath = '/workspace/.opencode/skill/sk-code--web/references/checklists/quality.md';
      const specFolder = memoryParser.extractSpecFolder(filePath);

      expect(specFolder).toBe('skill:sk-code--web');
    });
  });
});
