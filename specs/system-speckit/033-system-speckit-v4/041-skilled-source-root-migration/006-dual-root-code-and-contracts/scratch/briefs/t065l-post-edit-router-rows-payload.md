## Edit 1

File: `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs`

OLD:

~~~~text
  assert.equal(entries[0].label, 'frontmatter-versions');
  assert.deepEqual(entries[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: placeholders fires for a spec-folder doc, scoped to the folder', () => {
~~~~

NEW:

~~~~text
  assert.equal(entries[0].label, 'frontmatter-versions');
  assert.deepEqual(entries[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: frontmatter-versions fires for a skill SKILL.md under a .skilled source root', () => {
  const entries = router.resolveDispatch('.skilled/skills/sk-doc/SKILL.md', '/tmp/proj');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'frontmatter-versions');
  assert.deepEqual(entries[0].args, ['--skill', 'sk-doc']);
});

test('resolveDispatch: wikilinks scopes to the skill directory under the source root the edit names', () => {
  const entries = router.resolveDispatch('.skilled/skills/sk-doc/notes.md', '/tmp/proj', {
    env: { SPECKIT_VALIDATE_LINKS: 'true' },
  });
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'wikilinks');
  assert.equal(entries[0].args[0], path.join('/tmp/proj', '.skilled/skills/sk-doc'));
});

test('resolveDispatch: placeholders fires for a spec-folder doc, scoped to the folder', () => {
~~~~
