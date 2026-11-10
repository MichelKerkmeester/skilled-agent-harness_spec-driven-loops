## Edit 1

File: `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`

OLD:

~~~~text
const SOURCE_ROOT_NAMES = ['.opencode', '.skilled'];

// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
// .opencode linked to it. The orphan test reads the adapter from disk, so each layout
// changes which spellings exist.
~~~~

NEW:

~~~~text
const SOURCE_ROOT_NAMES = ['.opencode', '.skilled'];

// Git reads GIT_DIR and its siblings before any path argument, so a run started from a git
// hook would aim git init and the installer's checkout probe at the enclosing repository.
const GIT_FREE_ENV = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')));

// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
// .opencode linked to it. The orphan rows read the adapter from disk, so each layout
// changes which spellings exist.
~~~~

## Edit 2

File: `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`

OLD:

~~~~text
];

function hookCommand(sourceRootName) {
  return 'bash -c \'cd "' + PROJECT_ANCHOR + '" && node ' + sourceRootName + '/hooks/probe-hook.js\'';
}
~~~~

NEW:

~~~~text
];

function hookCommand(sourceRootName, adapter = 'probe-hook.js') {
  return 'bash -c \'cd "' + PROJECT_ANCHOR + '" && node ' + sourceRootName + '/hooks/' + adapter + '\'';
}
~~~~

## Edit 3

File: `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`

OLD:

~~~~text
  if (layout.linked) fs.symlinkSync('.skilled', path.join(repo, '.opencode'));
  execFileSync('git', ['init', '-q', repo], { stdio: 'ignore' });

  const sourcePath = path.join(repo, '.codex', 'hooks.json');
~~~~

NEW:

~~~~text
  if (layout.linked) fs.symlinkSync('.skilled', path.join(repo, '.opencode'));
  execFileSync('git', ['init', '-q', repo], { stdio: 'ignore', env: GIT_FREE_ENV });

  const sourcePath = path.join(repo, '.codex', 'hooks.json');
~~~~

## Edit 4

File: `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`

OLD:

~~~~text
    [INSTALLER_PATH, '--repo', fixture.repo, '--source', fixture.sourcePath, '--target', fixture.targetPath, ...extraArguments],
    { encoding: 'utf8', env: { ...process.env, HOME: path.join(fixture.root, 'home') } },
  );
~~~~

NEW:

~~~~text
    [INSTALLER_PATH, '--repo', fixture.repo, '--source', fixture.sourcePath, '--target', fixture.targetPath, ...extraArguments],
    { encoding: 'utf8', env: { ...GIT_FREE_ENV, HOME: path.join(fixture.root, 'home') } },
  );
~~~~

## Edit 5

File: `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`

OLD:

~~~~text
// ─────────────────────────────────────────────────────────────────────────────

describe('install-codex-hooks treats .skilled and .opencode adapter paths as one owned hook', () => {
~~~~

NEW:

~~~~text
// ─────────────────────────────────────────────────────────────────────────────

// Rows that spell both sides alike are controls. The mixed rows are the ones an exact-path
// ownership check fails, by keeping the old entry beside the new one.
describe('install-codex-hooks treats .skilled and .opencode adapter paths as one owned hook', () => {
~~~~

## Edit 6

File: `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`

OLD:

~~~~text
  }
});
~~~~

NEW:

~~~~text
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ORPHANS UNDER EITHER NAME
// ─────────────────────────────────────────────────────────────────────────────

// An installed entry under either name whose adapter is gone from disk and absent from the
// source is ours, so an install removes it. Its label keeps the spelling it was installed with.
describe('install-codex-hooks removes an orphaned hook spelled under either source-root name', () => {
  for (const layout of LAYOUTS) {
    for (const orphanName of SOURCE_ROOT_NAMES) {
      test(`${layout.name}: orphan installed under ${orphanName}`, () => {
        const fixture = buildFixture(layout, layout.realRoot, layout.realRoot);
        try {
          const target = JSON.parse(fs.readFileSync(fixture.targetPath, 'utf8'));
          const orphanCommand = hookCommand(orphanName, 'retired-hook.js').replaceAll(PROJECT_ANCHOR, fixture.repo);
          target.hooks.SessionStart.push({ hooks: [{ type: 'command', command: orphanCommand, timeout: 3 }] });
          fs.writeFileSync(fixture.targetPath, `${JSON.stringify(target, null, 2)}\n`);

          const install = runInstaller(fixture, []);
          assert.equal(install.status, 0, install.stderr);
          assert.deepEqual(JSON.parse(install.stdout).orphaned, [`SessionStart:${orphanName}/hooks/retired-hook.js`]);

          const commands = installedCommands(fixture.targetPath);
          assert.equal(commands.includes(orphanCommand), false);
          assert.equal(commands.filter((command) => command === THIRD_PARTY_COMMAND).length, 1);
        } finally {
          fs.rmSync(fixture.root, { recursive: true, force: true });
        }
      });
    }
  }
});
~~~~
