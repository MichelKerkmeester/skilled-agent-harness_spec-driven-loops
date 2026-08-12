# Install and verify

Use Node.js 22 or newer and npm 10 or newer. Install only a reviewed, exact
package version or tarball; do not install a moving tag in a release workflow.

From this package directory, create and inspect the release artifact:

```sh
npm ci
npm run check
mkdir -p /tmp/communication-projection-pack
npm pack --pack-destination /tmp/communication-projection-pack
npm pack --dry-run
```

In a clean consumer project, install the exact artifact and exercise every
public entry point:

```sh
export PACKAGE_TARBALL=/tmp/communication-projection-pack/portable-cli-communication-projection-0.1.0.tgz
npm install --save-exact "$PACKAGE_TARBALL"
node --input-type=module <<'NODE'
const paths = [
  '', '/contracts', '/versioning', '/doctor', '/release', '/providers',
  '/runtimes', '/privacy', '/evaluation', '/observability',
];
for (const path of paths) {
  const loaded = await import(`@portable-cli/communication-projection${path}`);
  if (Object.keys(loaded).length === 0) throw new Error(`Empty public module: ${path || '.'}`);
}
NODE
```

Run the content-free compatibility doctor described in
[configuration.md](./configuration.md) before enabling a route.

## Upgrade and downgrade

Keep both exact tarballs until the release is accepted:

```sh
export PREVIOUS_PACKAGE_TARBALL=/srv/releases/portable-cli-communication-projection-0.0.9.tgz
export NEXT_PACKAGE_TARBALL=/srv/releases/portable-cli-communication-projection-0.1.0.tgz
npm install --save-exact "$NEXT_PACKAGE_TARBALL"
node ./operator/run-communication-projection-doctor.mjs
npm install --save-exact "$PREVIOUS_PACKAGE_TARBALL"
node ./operator/run-communication-projection-doctor.mjs
```

The operator wrapper is the fully specified doctor input shown in
[configuration.md](./configuration.md). A downgrade must retain original-only
mode and must not require provider or network access.
