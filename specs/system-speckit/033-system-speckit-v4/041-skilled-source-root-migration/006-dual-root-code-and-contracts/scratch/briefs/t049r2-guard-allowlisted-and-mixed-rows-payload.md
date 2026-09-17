## Edit 1

File: `.opencode/bin/compiled-routing-foundation.vitest.ts`

OLD:

~~~~text
      expect(result.stderr).toContain('hidden-spec-import.cjs');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
~~~~

NEW:

~~~~text
      expect(result.stderr).toContain('hidden-spec-import.cjs');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('exits 2 when every file the scan finds is allowlisted, so none was read', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-spec-import-allowlisted-'));
    try {
      copyFileSync(GUARD, join(root, 'check-no-spec-imports.cjs'));

      const result = spawnSync(process.execPath, [GUARD, root], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stdout).not.toContain('ok:');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.skipIf(process.getuid?.() === 0)('exits 2, not the violation code, when an unreadable file sits beside a violation', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-spec-import-mixed-'));
    try {
      const hidden = join(root, 'hidden-runtime.cjs');
      writeFileSync(join(root, 'seeded-spec-import.cjs'), "require('../../specs/seeded/target.cjs');\n");
      writeFileSync(hidden, 'module.exports = 1;\n');
      chmodSync(hidden, 0o000);

      const result = spawnSync(process.execPath, [GUARD, root], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('seeded-spec-import.cjs');
      expect(result.stderr).toContain('hidden-runtime.cjs');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
~~~~
