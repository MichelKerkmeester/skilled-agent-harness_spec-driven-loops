## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/hermes/tests/sync-skills-hermes.test.mjs`

OLD:

~~~~text
    assert.match(copy, /^---\nname: mode-a\n/);
    assert.match(copy, /Canonical source: `\.opencode\/skills\/hub\/mode-a\/`/);
    assert.match(copy, /# Mode A/);
~~~~

NEW:

~~~~text
    assert.match(copy, /^---\nname: mode-a\n/);
    assert.match(copy, /Canonical source: `\.skilled\/skills\/hub\/mode-a\/`/);
    assert.match(copy, /# Mode A/);
~~~~
