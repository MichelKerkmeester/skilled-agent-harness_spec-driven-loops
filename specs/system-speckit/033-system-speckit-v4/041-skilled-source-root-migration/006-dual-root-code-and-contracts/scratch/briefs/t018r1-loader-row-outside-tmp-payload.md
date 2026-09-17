## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-extractors-loaders.js`

OLD:

~~~~text
    }

    // A data file inside a consumer's linked .skilled tree passes the path check. TMPDIR
    // points at the consumer while the loader runs, so the loader's temporary-directory
    // base does not admit the linked tree.
    const consumerRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-loader-consumer-'));
    const skilledTree = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-loader-skilled-'));
    fs.writeFileSync(path.join(skilledTree, 'linked-session.json'), JSON.stringify(MOCK_COLLECTED_DATA));
~~~~

NEW:

~~~~text
    }

    // A data file inside a consumer's linked .skilled tree passes the path check. The
    // loader also admits TMPDIR, /tmp and /private/tmp, so the linked tree lives in
    // /var/tmp, which is none of them, and TMPDIR points at the consumer while it runs.
    const consumerRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-loader-consumer-'));
    const skilledTree = fs.mkdtempSync(path.join('/var/tmp', 'speckit-loader-skilled-'));
    fs.writeFileSync(path.join(skilledTree, 'linked-session.json'), JSON.stringify(MOCK_COLLECTED_DATA));
~~~~
