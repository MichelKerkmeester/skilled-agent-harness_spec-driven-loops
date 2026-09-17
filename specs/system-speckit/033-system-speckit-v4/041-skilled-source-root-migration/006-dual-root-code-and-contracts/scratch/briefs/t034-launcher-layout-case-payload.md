## Edit 1

File: `.opencode/bin/mcp-code-mode-launcher.test.cjs`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. SOURCE-ROOT LAYOUTS
// ─────────────────────────────────────────────────────────────────────────────

// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
// .opencode linked to it, and Node loads a script through that link by its real path.
const SOURCE_ROOT_LAYOUTS = [
  { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
  { name: 'skilled-only', realRoot: '.skilled', linked: false, entries: ['.skilled'] },
  { name: 'whole-link', realRoot: '.skilled', linked: true, entries: ['.opencode', '.skilled'] },
];

function buildLayoutFixture(layout) {
  const repositoryRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-code-mode-layout-')));
  const binDirectory = path.join(repositoryRoot, layout.realRoot, 'bin');
  const serverDirectory = path.join(repositoryRoot, layout.realRoot, 'skills', 'mcp-code-mode', 'mcp-server');
  fs.mkdirSync(path.join(binDirectory, 'lib'), { recursive: true });
  fs.mkdirSync(path.join(serverDirectory, 'dist'), { recursive: true });
  fs.copyFileSync(LAUNCHER_PATH, path.join(binDirectory, 'mcp-code-mode-launcher.cjs'));
  fs.copyFileSync(
    path.join(__dirname, 'lib', 'node-engine-resolver.cjs'),
    path.join(binDirectory, 'lib', 'node-engine-resolver.cjs'),
  );
  // The running interpreter satisfies its own major version, so resolution succeeds
  // only when the launcher reads this manifest.
  fs.writeFileSync(
    path.join(serverDirectory, 'package.json'),
    JSON.stringify({ engines: { node: process.versions.node.split('.')[0] } }),
  );
  fs.writeFileSync(path.join(serverDirectory, 'dist', 'index.js'), '');
  if (layout.linked) fs.symlinkSync('.skilled', path.join(repositoryRoot, '.opencode'));
  return { repositoryRoot, serverDirectory };
}

describe('mcp code mode launcher source-root layouts', () => {
  for (const layout of SOURCE_ROOT_LAYOUTS) {
    for (const entry of layout.entries) {
      test(`${layout.name} through ${entry}/bin starts the server under the real source root`, async () => {
        const { repositoryRoot, serverDirectory } = buildLayoutFixture(layout);
        try {
          const launcher = require(path.join(repositoryRoot, entry, 'bin', 'mcp-code-mode-launcher.cjs'));
          let resolution;
          let invocation;
          const exitCode = await launcher.main({
            resolveInterpreter: (options) => {
              resolution = resolveNodeInterpreter(options);
              return resolution;
            },
            spawnProcess: (nodePath, argumentsList) => {
              invocation = { nodePath, argumentsList };
              return createClosingChild(0);
            },
            serverArguments: [],
            terminateOnSignal: false,
          });

          assert.equal(launcher.REPOSITORY_ROOT, repositoryRoot);
          assert.equal(launcher.SERVER_MANIFEST_PATH, path.join(serverDirectory, 'package.json'));
          assert.equal(launcher.SERVER_ENTRYPOINT_PATH, path.join(serverDirectory, 'dist', 'index.js'));
          assert.equal(resolution.reason, null);
          assert.equal(exitCode, 0);
          assert.equal(invocation.argumentsList[0], launcher.SERVER_ENTRYPOINT_PATH);
        } finally {
          fs.rmSync(repositoryRoot, { recursive: true, force: true });
        }
      });
    }
  }
});
~~~~
