## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
  });
});

describe('graph metadata key files under either source-root name', () => {
  for (const layout of ['skilled-only', 'whole-link'] as const) {
    it(`${layout}: resolves a repository-relative key file for a packet under the canonical specs root`, () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-source-root-'));
      createdRoots.add(root);
      const specFolder = path.join(root, 'specs', 'system-spec-kit', '901-source-root');
      const skillDir = path.join(root, '.skilled', 'skills', 'system-spec-kit');
      fs.mkdirSync(specFolder, { recursive: true });
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '# fixture\n');
      if (layout === 'whole-link') fs.symlinkSync('.skilled', path.join(root, '.opencode'));

      expect(graphMetadataParserTestables.resolveKeyFileCandidate(
        specFolder,
        'system-spec-kit/901-source-root',
        '.skilled/skills/system-spec-kit/SKILL.md',
      )).toBe('.skilled/skills/system-spec-kit/SKILL.md');
    });
  }
});
~~~~
