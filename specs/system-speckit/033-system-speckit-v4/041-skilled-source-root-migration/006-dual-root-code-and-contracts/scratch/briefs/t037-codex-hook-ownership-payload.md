## Edit 1

File: `.opencode/bin/install-codex-hooks.mjs`

OLD:

~~~~text
}

function collectSourceIdentities(source) {
  const identities = new Set();
  for (const [event, groups] of Object.entries(source.hooks || {})) {
~~~~

NEW:

~~~~text
}

// The source tree sits under .skilled or .opencode, and a checkout may link one name to
// the other, so an adapter path spelled under either name is the same hook. An installed
// entry written under the old name must be replaced, never kept beside the new one.
const SOURCE_ROOT_NAMES = ['.skilled', '.opencode'];

function sourceRootRelative(identity) {
  const name = SOURCE_ROOT_NAMES.find((candidate) => identity.startsWith(`${candidate}/`));
  return name ? identity.slice(name.length + 1) : null;
}

// Keys spell the source tree one way so both names compare equal.
function ownershipKey(identity) {
  const relative = sourceRootRelative(identity);
  return relative === null ? identity : `.opencode/${relative}`;
}

function collectSourceIdentities(source) {
  const identities = new Map();
  for (const [event, groups] of Object.entries(source.hooks || {})) {
~~~~

## Edit 2

File: `.opencode/bin/install-codex-hooks.mjs`

OLD:

~~~~text
        const identity = hookIdentity(hook.command);
        if (identities.has(identity)) {
          throw new Error(`Source hook identity is duplicated: ${event}:${identity}`);
        }
        identities.add(identity);
      }
~~~~

NEW:

~~~~text
        const identity = hookIdentity(hook.command);
        const key = ownershipKey(identity);
        if (identities.has(key)) {
          throw new Error(`Source hook identity is duplicated: ${event}:${identity}`);
        }
        identities.set(key, identity);
      }
~~~~

## Edit 3

File: `.opencode/bin/install-codex-hooks.mjs`

OLD:

~~~~text
}

// Ownership follows the .opencode namespace, not the exact path. Identity is the
// adapter path, so renaming a script orphans its installed entry: it no longer
// matches source, and the preserve-third-party rule would keep a command that can
// never run. Anything under .opencode that is missing on disk is our own orphan.
function isRepoOrphan(identity, repoAbs) {
  if (typeof identity !== 'string' || !identity.startsWith('.opencode/')) return false;
  return !fs.existsSync(path.join(repoAbs, identity));
~~~~

NEW:

~~~~text
}

// Ownership follows the source-root namespace, not the exact path. Identity is the
// adapter path, so renaming a script orphans its installed entry: it no longer
// matches source, and the preserve-third-party rule would keep a command that can
// never run. Anything under .skilled or .opencode that is missing on disk is our own
// orphan.
function isRepoOrphan(identity, repoAbs) {
  if (typeof identity !== 'string' || sourceRootRelative(identity) === null) return false;
  return !fs.existsSync(path.join(repoAbs, identity));
~~~~

## Edit 4

File: `.opencode/bin/install-codex-hooks.mjs`

OLD:

~~~~text
        const identity = typeof hook.command === 'string' ? hookIdentity(hook.command) : null;
        if (identity && ownedIdentities.has(identity)) {
          removed.push(hookLabel(event, hook));
~~~~

NEW:

~~~~text
        const identity = typeof hook.command === 'string' ? hookIdentity(hook.command) : null;
        if (identity && ownedIdentities.has(ownershipKey(identity))) {
          removed.push(hookLabel(event, hook));
~~~~

## Edit 5

File: `.opencode/bin/install-codex-hooks.mjs`

OLD:

~~~~text
        if (typeof hook.command !== 'string') continue;
        const identity = hookIdentity(hook.command);
        if (!ownedIdentities.has(identity)) continue;
        if (!occurrences.has(identity)) occurrences.set(identity, []);
        occurrences.get(identity).push({ command: hook.command, event });
      }
~~~~

NEW:

~~~~text
        if (typeof hook.command !== 'string') continue;
        const key = ownershipKey(hookIdentity(hook.command));
        if (!ownedIdentities.has(key)) continue;
        if (!occurrences.has(key)) occurrences.set(key, []);
        occurrences.get(key).push({ command: hook.command, event });
      }
~~~~

## Edit 6

File: `.opencode/bin/install-codex-hooks.mjs`

OLD:

~~~~text
  };

  for (const identity of reconciliation.ownedIdentities) {
    const actual = targetOccurrences.get(identity) || [];
    const expected = canonicalOccurrences.get(identity)?.[0];
    if (actual.length === 0) drift.missing.push(identity);
~~~~

NEW:

~~~~text
  };

  for (const [key, identity] of reconciliation.ownedIdentities) {
    const actual = targetOccurrences.get(key) || [];
    const expected = canonicalOccurrences.get(key)?.[0];
    if (actual.length === 0) drift.missing.push(identity);
~~~~
