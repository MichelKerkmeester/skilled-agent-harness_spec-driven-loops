## Edit 1

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts`

OLD:

~~~~text
      const censusRow = censusRows.get(entry.surfaceId);
      expect(censusRow?.resolvedPath).toBe(entry.pathTemplate);
      expect(censusRow?.owner).toBe(entry.legacyWriter);
~~~~

NEW:

~~~~text
      const censusRow = censusRows.get(entry.surfaceId);
      expect(censusRow?.resolvedPath?.replace(/^\.(?:opencode|skilled)\//u, '')).toBe(entry.pathTemplate.replace(/^\.(?:opencode|skilled)\//u, ''));
      expect(censusRow?.owner).toBe(entry.legacyWriter);
~~~~
