## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts`

OLD:

~~~~text
  }
});
~~~~

NEW:

~~~~text
  }

  it('never treats .skilled/specs as a specs root, because the legacy alias keeps one spelling', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-skilled-alias-'));
    createdRoots.add(root);
    const specFolder = path.join(root, '.skilled', 'specs', 'system-spec-kit', '902-skilled-alias');
    const skillDir = path.join(root, '.skilled', 'skills', 'system-spec-kit');
    fs.mkdirSync(specFolder, { recursive: true });
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '# fixture\n');

    expect(graphMetadataParserTestables.resolveKeyFileCandidate(
      specFolder,
      'system-spec-kit/902-skilled-alias',
      '.skilled/skills/system-spec-kit/SKILL.md',
    )).toBeNull();
  });
});
~~~~
