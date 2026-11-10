## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`

OLD:

~~~~text
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN TEST RUNNER
~~~~

NEW:

~~~~text
}

async function testApprovedRootsAcrossSourceRootLayouts() {
  log('\n🔬 REGRESSION: Approved spec roots under each source-root layout');

  const { CONFIG } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const { materializeRootFixture, R_FIXTURES } = require(path.join(SCRIPTS_DIR, 'core', 'spec-root-fixtures'));
  const { detectSpecFolder, TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
  const aliasFixture = R_FIXTURES.find((fixture) => fixture.id === 'R3');
  const originalProjectRoot = CONFIG.PROJECT_ROOT;
  // Each layout lists the spellings that reach the packet on disk. The legacy alias keeps
  // its one .opencode/specs spelling, and a .skilled/specs path is accepted only because
  // it resolves into the canonical root.
  const spellingsByLayout = {
    today: ['specs', '.opencode/specs'],
    'skilled-only': ['specs', '.skilled/specs'],
    'whole-link': ['specs', '.opencode/specs', '.skilled/specs'],
  };

  for (const [layout, spellings] of Object.entries(spellingsByLayout)) {
    const fixture = materializeRootFixture(aliasFixture, layout);
    const canonicalRoot = path.join(fixture.workspaceDir, 'specs');
    CONFIG.PROJECT_ROOT = fixture.workspaceDir;
    try {
      for (const spelling of spellings) {
        const testName = `T-FD10: ${layout} accepts an absolute packet path through ${spelling}`;
        const packetPath = path.join(fixture.workspaceDir, spelling, fixture.relativePacketId);
        if (TEST_HELPERS.isUnderApprovedSpecsRoots(packetPath)) {
          pass(testName, packetPath);
        } else {
          fail(testName, `Rejected ${packetPath}`);
        }
      }

      if (layout !== 'today') {
        const testName = `T-FD10: ${layout} never resolves a relative .skilled/specs argument to a .skilled/specs path`;
        try {
          const resolved = await detectSpecFolder(null, { specFolderArg: `.skilled/specs/${fixture.relativePacketId}` });
          if (resolved === path.join(canonicalRoot, fixture.relativePacketId)) {
            pass(testName, `Resolved to the canonical packet: ${resolved}`);
          } else {
            fail(testName, `Resolved somewhere other than the canonical packet: ${resolved}`);
          }
        } catch (err) {
          pass(testName, `Unsupported: ${err.message.substring(0, 120)}`);
        }
      }
    } catch (err) {
      fail(`T-FD10: ${layout} approved-root layout rows`, err.message);
    } finally {
      CONFIG.PROJECT_ROOT = originalProjectRoot;
      fixture.cleanup();
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN TEST RUNNER
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`

OLD:

~~~~text
  await testApprovedRootContainmentRejectsSymlinkEscape();

  // Results summary
~~~~

NEW:

~~~~text
  await testApprovedRootContainmentRejectsSymlinkEscape();
  await testApprovedRootsAcrossSourceRootLayouts();

  // Results summary
~~~~
