## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts`

OLD:

~~~~text
      const skilledEntry = path.join(fixture.workspaceDir, '.skilled', 'specs');
      // A workspace with no .opencode path hides the legacy entry from every resolver,
      // so each fixture reads as canonical-only there.
      const expected = layout === 'skilled-only' ? EXPECTED_RESULTS.R1 : EXPECTED_RESULTS[rootFixture.id];
~~~~

NEW:

~~~~text
      const skilledEntry = path.join(fixture.workspaceDir, '.skilled', 'specs');
      // Root enumeration finds no legacy root in a workspace with no .opencode path, so
      // each fixture classifies as canonical-only there.
      const expected = layout === 'skilled-only' ? EXPECTED_RESULTS.R1 : EXPECTED_RESULTS[rootFixture.id];
~~~~
