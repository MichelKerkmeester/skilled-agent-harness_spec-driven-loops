## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js`

OLD:

~~~~text
const fs = require('fs');
const __dirname = path.dirname(__filename);
~~~~

NEW:

~~~~text
const fs = require('fs');
const os = require('os');
const __dirname = path.dirname(__filename);
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js`

OLD:

~~~~text
      'T-003e: sanitizePath rejects path outside allowed directories');

    // Test 6: getPathBasename extracts filename
~~~~

NEW:

~~~~text
      'T-003e: sanitizePath rejects path outside allowed directories');

    // Test 5b: the default bases admit a consumer's source tree linked from outside its
    // working directory under either name, and still reject paths outside every base
    const consumerRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-sanitize-consumer-'));
    const skilledTree = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-sanitize-skilled-'));
    const opencodeTree = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-sanitize-opencode-'));
    fs.writeFileSync(path.join(skilledTree, 'SKILL.md'), '# fixture\n');
    fs.writeFileSync(path.join(opencodeTree, 'SKILL.md'), '# fixture\n');
    fs.symlinkSync(skilledTree, path.join(consumerRoot, '.skilled'));
    fs.symlinkSync(opencodeTree, path.join(consumerRoot, '.opencode'));
    const previousCwd = process.cwd();
    process.chdir(consumerRoot);
    try {
      assertDoesNotThrow(() => sanitizePath(path.join(consumerRoot, '.skilled', 'SKILL.md')),
        'T-003i: sanitizePath default bases accept a path inside a linked .skilled');
      assertDoesNotThrow(() => sanitizePath(path.join(consumerRoot, '.opencode', 'SKILL.md')),
        'T-003j: sanitizePath default bases accept a path inside a linked .opencode');
      assertThrows(() => sanitizePath('/etc/passwd'),
        'T-003k: sanitizePath default bases reject /etc/passwd');
      assertThrows(() => sanitizePath(`${consumerRoot}/.skilled/../../outside`),
        'T-003l: sanitizePath default bases reject a .. escape from a linked .skilled');
    } finally {
      process.chdir(previousCwd);
      for (const dir of [consumerRoot, skilledTree, opencodeTree]) fs.rmSync(dir, { recursive: true, force: true });
    }

    // Test 6: getPathBasename extracts filename
~~~~
