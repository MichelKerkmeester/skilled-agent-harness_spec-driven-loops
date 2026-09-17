## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
  // bounded to the real root, not a nested subdir.
  return sourceTreeParentWithSentinel(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}

// Inlined twin of lib/utils/workspace-root.ts:sourceTreeParentWithSentinel, kept
// local for the same reason as the hoist below. A capped walk misses the sentinel,
// yet the root is still the parent of one source-root segment in the start path, so
// testing those parents nearest first keeps a repository that sits under a
// directory named .skilled or .opencode.
function sourceTreeParentWithSentinel(dir: string, sentinels: readonly string[]): string | null {
  const parts = resolve(dir).split(sep);
~~~~

NEW:

~~~~text
  // bounded to the real root, not a nested subdir.
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}

// Inlined twin of lib/utils/workspace-root.ts:nearestSentinelHolder, kept local for
// the same reason as the hoist below. A capped walk misses the sentinel, yet the root
// is still the start or the parent of one source-root segment in the start path, so
// testing the start and then those parents nearest first keeps a repository that
// sits under a directory named .skilled or .opencode.
function nearestSentinelHolder(dir: string, sentinels: readonly string[]): string | null {
  const holdsSentinel = (candidate: string): boolean => sentinels.some((sentinel) => existsSync(resolve(candidate, sentinel)));
  if (holdsSentinel(dir)) return resolve(dir);
  const parts = resolve(dir).split(sep);
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
    const parent = parts.slice(0, index).join(sep) || sep;
    if (sentinels.some((sentinel) => existsSync(resolve(parent, sentinel)))) return parent;
  }
~~~~

NEW:

~~~~text
    const parent = parts.slice(0, index).join(sep) || sep;
    if (holdsSentinel(parent)) return parent;
  }
~~~~
