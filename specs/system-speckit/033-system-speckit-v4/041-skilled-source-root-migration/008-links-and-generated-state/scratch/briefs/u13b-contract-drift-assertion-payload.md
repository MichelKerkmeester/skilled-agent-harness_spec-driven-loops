## Edit 1

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`

OLD:

~~~~text
      expect(failure).toBeDefined();
      expect(failure?.reason).toContain(sourcePath);
    });
~~~~

NEW:

~~~~text
      expect(failure).toBeDefined();
      // The reason names the source as the command documents spell it, under either root name.
      expect(failure?.reason).toContain(sourcePath.replace(/^\.skilled\//, ''));
    });
~~~~
