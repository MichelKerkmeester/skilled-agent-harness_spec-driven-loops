## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`

OLD:

~~~~text
        } catch (err) {
          pass(testName, `Unsupported: ${err.message.substring(0, 120)}`);
        }
~~~~

NEW:

~~~~text
        } catch (err) {
          fail(testName, `Threw instead of resolving to the canonical packet: ${err.message.substring(0, 120)}`);
        }
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`

OLD:

~~~~text
      fail(`T-FD10: ${layout} approved-root layout rows`, err.message);
    } finally {
~~~~

NEW:

~~~~text
      fail(`T-FD10: ${layout} approved-root layout rows`, err.message);
    } finally {
      CONFIG.PROJECT_ROOT = originalProjectRoot;
      fixture.cleanup();
    }
  }

  // A real .skilled/specs directory is no approved root where .opencode does not lead to
  // it, so the .skilled/specs spellings accepted above prove containment in the canonical
  // root rather than a third root. Under whole-link that directory is the legacy root
  // reached through .opencode, which the rows above accept.
  const plainFixture = R_FIXTURES.find((fixture) => fixture.id === 'R1');
  for (const layout of ['today', 'skilled-only']) {
    const testName = `T-FD10: ${layout} rejects a packet inside a real .skilled/specs directory`;
    const fixture = materializeRootFixture(plainFixture, layout);
    CONFIG.PROJECT_ROOT = fixture.workspaceDir;
    try {
      const decoyPacket = path.join(fixture.workspaceDir, '.skilled', 'specs', fixture.relativePacketId);
      fs.mkdirSync(decoyPacket, { recursive: true });
      fs.writeFileSync(path.join(decoyPacket, 'spec.md'), '# Decoy\n', 'utf8');
      if (TEST_HELPERS.isUnderApprovedSpecsRoots(decoyPacket)) {
        fail(testName, `Approved ${decoyPacket}`);
      } else {
        pass(testName, decoyPacket);
      }
    } catch (err) {
      fail(testName, err.message);
    } finally {
~~~~
