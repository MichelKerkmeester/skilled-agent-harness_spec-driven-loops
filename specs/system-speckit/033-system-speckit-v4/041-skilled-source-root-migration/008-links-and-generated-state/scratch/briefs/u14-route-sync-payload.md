## Edit 1

File: `.skilled/bin/compiled-route-sync.cjs`

OLD:

~~~~text
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPECS_ROOT = fs.realpathSync(path.join(REPO_ROOT, '.opencode', 'specs'));
const IMPL_ROOT = path.join(
~~~~

NEW:

~~~~text
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPECS_ROOT = fs.realpathSync(path.join(REPO_ROOT, 'specs'));
const IMPL_ROOT = path.join(
~~~~

## Edit 2

File: `.skilled/bin/compiled-route-sync.cjs`

OLD:

~~~~text
const AUTHORED_RESOLVER = path.join(IMPL_ROOT, CURRENT_LAYOUT.resolver);
const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
const ACTIVATION_ROOT = activationRootFor(RUNTIME_ROOT);
~~~~

NEW:

~~~~text
const AUTHORED_RESOLVER = path.join(IMPL_ROOT, CURRENT_LAYOUT.resolver);
const RUNTIME_ROOT = path.join(REPO_ROOT, '.skilled', 'bin', 'lib', 'compiled-routing');
const ACTIVATION_ROOT = activationRootFor(RUNTIME_ROOT);
~~~~
