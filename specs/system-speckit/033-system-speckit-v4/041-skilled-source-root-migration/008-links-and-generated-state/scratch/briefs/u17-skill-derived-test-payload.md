## Edit 1

File: `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`

OLD:

~~~~text
  input.redirect_to = 'sk-code';
  input.key_files = [...input.key_files, '.opencode/skills/sk-git/DOES-NOT-EXIST.md']; // forces a repair
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
~~~~

NEW:

~~~~text
  input.redirect_to = 'sk-code';
  input.key_files = [...input.key_files, '.skilled/skills/sk-git/DOES-NOT-EXIST.md']; // forces a repair
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
~~~~

## Edit 2

File: `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`

OLD:

~~~~text
  const input = clone(SK_GIT_DERIVED);
  input.key_files = [...input.key_files, '.opencode/skills/sk-git/GHOST.md'];
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(!derived.key_files.includes('.opencode/skills/sk-git/GHOST.md'), 'ghost path pruned');
  assert.equal(regen.derivedChanged(input, derived), true, 'a pruned dead reference is a real change');
~~~~

NEW:

~~~~text
  const input = clone(SK_GIT_DERIVED);
  input.key_files = [...input.key_files, '.skilled/skills/sk-git/GHOST.md'];
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(!derived.key_files.includes('.skilled/skills/sk-git/GHOST.md'), 'ghost path pruned');
  assert.equal(regen.derivedChanged(input, derived), true, 'a pruned dead reference is a real change');
~~~~

## Edit 3

File: `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`

OLD:

~~~~text
  derived.source_docs = ['references/a.md'];
  derived.key_files = ['.opencode/skills/sk-git/SKILL.md', '.opencode/skills/sk-git/GHOST.md'];
  fs.writeFileSync(path.join(demo, 'graph-metadata.json'), JSON.stringify({ schema_version: 2, derived }, null, 2));
~~~~

NEW:

~~~~text
  derived.source_docs = ['references/a.md'];
  derived.key_files = ['.skilled/skills/sk-git/SKILL.md', '.skilled/skills/sk-git/GHOST.md'];
  fs.writeFileSync(path.join(demo, 'graph-metadata.json'), JSON.stringify({ schema_version: 2, derived }, null, 2));
~~~~
