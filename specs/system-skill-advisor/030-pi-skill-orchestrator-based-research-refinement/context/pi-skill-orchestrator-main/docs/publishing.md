# Publishing to npm and GitHub

[Back to the main README](../README.md) · [Documentation index](README.md)

## Before a release

Confirm the working tree contains the intended version.

Update these files together:

```text
package.json
VERSION
CHANGELOG.md
README.md
```

Then run:

```bash
npm run check
npm run pack:check
```

Run a real Pi smoke test:

```bash
pi -e ./src/index.ts
```

## Build the npm package

Run:

```bash
npm pack
```

This creates a file such as:

```text
pi-skill-orchestrator-0.1.26.tgz
```

Inspect it:

```bash
tar -tzf pi-skill-orchestrator-0.1.26.tgz
```

The npm package should contain production source, detailed docs, the README, the changelog, version file, and license. It should not contain tests, local configuration, credentials, or generated development files.

## Dry-run npm publication

Run:

```bash
npm publish --dry-run --access public
```

Read the file list carefully before a real publish.

## First manual npm publish

Authenticate with npm using your normal npm account workflow.

Confirm the active account:

```bash
npm whoami
```

Publish:

```bash
npm publish --access public
```

The package name is:

```text
pi-skill-orchestrator
```

After publication, test installation in Pi:

```bash
pi install npm:pi-skill-orchestrator
```

## GitHub release

Create a Git tag that matches the package version:

```bash
git tag v0.1.26
git push origin v0.1.26
```

Create a GitHub release from that tag. Use the matching section from `CHANGELOG.md` as the release notes.

## GitHub Actions npm publication

The repository includes `.github/workflows/npm-publish.yml`.

The workflow runs when a GitHub release is published. It verifies the release tag, runs the release checks, checks whether the version already exists on npm, and then publishes through npm trusted publishing.

The workflow does not require an `NPM_TOKEN` repository secret. It uses GitHub OIDC with `id-token: write`.

After the first manual npm publish, configure a trusted publisher for `pi-skill-orchestrator` in the npm package settings. Use these values:

```text
GitHub owner: badgids
Repository: pi-skill-orchestrator
Workflow: npm-publish.yml
```

Do not add an npm access token to the repository when trusted publishing is configured.

## Release order

Use this order:

1. update version and changelog;
2. run all checks;
3. run the Pi smoke test;
4. commit the release;
5. push the commit;
6. create and push the version tag;
7. for the first release, publish to npm manually and configure the npm trusted publisher;
8. publish the GitHub release;
9. for later releases, confirm the npm workflow succeeds;
10. install the published npm package with Pi and run one final smoke test.
