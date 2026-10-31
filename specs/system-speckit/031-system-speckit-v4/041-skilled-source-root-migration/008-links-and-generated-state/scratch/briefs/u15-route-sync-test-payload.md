## Edit 1

File: `.skilled/bin/tests/compiled-route-manifest.test.cjs`

OLD:

~~~~text
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CLI_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route-manifest.cjs');
const ROUTE_CLI_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route.cjs');
const SYNC_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route-sync.cjs');
const SOURCE_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-code');
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-manifest-'));
~~~~

NEW:

~~~~text
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CLI_PATH = path.join(REPO_ROOT, '.skilled', 'bin', 'compiled-route-manifest.cjs');
const ROUTE_CLI_PATH = path.join(REPO_ROOT, '.skilled', 'bin', 'compiled-route.cjs');
const SYNC_PATH = path.join(REPO_ROOT, '.skilled', 'bin', 'compiled-route-sync.cjs');
const SOURCE_ROOT = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-code');
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-manifest-'));
~~~~

## Edit 2

File: `.skilled/bin/tests/compiled-route-manifest.test.cjs`

OLD:

~~~~text
    const source = fs.readFileSync(
      path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-route-manifest.cjs'),
      'utf8',
~~~~

NEW:

~~~~text
    const source = fs.readFileSync(
      path.join(REPO_ROOT, '.skilled', 'bin', 'lib', 'compiled-route-manifest.cjs'),
      'utf8',
~~~~
