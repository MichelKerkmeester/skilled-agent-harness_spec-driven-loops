## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-extractors-loaders.js`

OLD:

~~~~text
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
~~~~

NEW:

~~~~text
const fs = require('fs');
const os = require('os');

/* ─────────────────────────────────────────────────────────────
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-extractors-loaders.js`

OLD:

~~~~text
    }

  } catch (error) {
    fail('LOAD: Module load/test', error.message);
~~~~

NEW:

~~~~text
    }

    // A data file inside a consumer's linked .skilled tree passes the path check. TMPDIR
    // points at the consumer while the loader runs, so the loader's temporary-directory
    // base does not admit the linked tree.
    const consumerRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-loader-consumer-'));
    const skilledTree = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-loader-skilled-'));
    fs.writeFileSync(path.join(skilledTree, 'linked-session.json'), JSON.stringify(MOCK_COLLECTED_DATA));
    fs.symlinkSync(skilledTree, path.join(consumerRoot, '.skilled'));
    const previousCwd = process.cwd();
    const previousTmpdir = process.env.TMPDIR;
    process.chdir(consumerRoot);
    process.env.TMPDIR = consumerRoot;
    try {
      const linked = await loadCollectedData({ dataFile: path.join(consumerRoot, '.skilled', 'linked-session.json'), specFolderArg: null });
      assertEqual(linked._source, 'file', 'LOAD-003: loadCollectedData reads a data file inside a linked .skilled');
    } catch (linkedError) {
      fail('LOAD-003: loadCollectedData reads a data file inside a linked .skilled', linkedError.message.substring(0, 120));
    } finally {
      process.chdir(previousCwd);
      if (previousTmpdir === undefined) delete process.env.TMPDIR;
      else process.env.TMPDIR = previousTmpdir;
      fs.rmSync(consumerRoot, { recursive: true, force: true });
      fs.rmSync(skilledTree, { recursive: true, force: true });
    }

  } catch (error) {
    fail('LOAD: Module load/test', error.message);
~~~~
