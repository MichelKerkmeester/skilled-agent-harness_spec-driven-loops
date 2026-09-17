## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`

OLD:

~~~~text
  log('\n🔬 REGRESSION: Approved spec roots under each source-root layout');

  const { CONFIG } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const { materializeRootFixture, R_FIXTURES } = require(path.join(SCRIPTS_DIR, 'core', 'spec-root-fixtures'));
~~~~

NEW:

~~~~text
  log('\n🔬 REGRESSION: Approved spec roots under each source-root layout');

  const { CONFIG, getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const { materializeRootFixture, R_FIXTURES } = require(path.join(SCRIPTS_DIR, 'core', 'spec-root-fixtures'));
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`

OLD:

~~~~text
      fixture.cleanup();
    }
  }
}

/* ─────────────────────────────────────────────────────────────
~~~~

NEW:

~~~~text
      fixture.cleanup();
    }
  }

  // Root listing and auto-detection name spec roots by the canonical name and the legacy
  // alias only. A packet in a real .skilled/specs directory becomes a candidate only when
  // the .opencode link reaches it, and then under the legacy spelling.
  for (const layout of ['today', 'skilled-only', 'whole-link']) {
    const testName = `T-FD10: ${layout} auto-detection never lists a packet by a .skilled/specs path`;
    const fixture = materializeRootFixture(plainFixture, layout);
    CONFIG.PROJECT_ROOT = fixture.workspaceDir;
    try {
      const decoyPacket = path.join(fixture.workspaceDir, '.skilled', 'specs', 'system-speckit', '903-skilled-decoy');
      fs.mkdirSync(decoyPacket, { recursive: true });
      fs.writeFileSync(path.join(decoyPacket, 'spec.md'), '# Decoy\n', 'utf8');
      const specsDirs = getSpecsDirectories();
      const candidates = await TEST_HELPERS.collectAutoDetectCandidates(specsDirs.filter((dir) => fs.existsSync(dir)));
      const skilledSpelled = [...specsDirs, ...candidates.map((candidate) => candidate.path)]
        .filter((entry) => entry.split(path.sep).join('/').includes('/.skilled/specs'));
      const decoyListed = candidates.some((candidate) => candidate.folderName === '903-skilled-decoy');
      if (skilledSpelled.length === 0 && decoyListed === (layout === 'whole-link')) {
        pass(testName, `${candidates.length} candidate(s), decoy listed: ${decoyListed}`);
      } else {
        fail(testName, `.skilled/specs entries: ${skilledSpelled.join(', ') || 'none'}, decoy listed: ${decoyListed}`);
      }
    } catch (err) {
      fail(testName, err.message);
    } finally {
      CONFIG.PROJECT_ROOT = originalProjectRoot;
      fixture.cleanup();
    }
  }
}

/* ─────────────────────────────────────────────────────────────
~~~~
