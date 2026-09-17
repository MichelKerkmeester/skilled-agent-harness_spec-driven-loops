## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
export function detectRepoRoot(start: string = process.cwd()): string {
  // Use the same SKILL.md sentinel that
  // findAdvisorWorkspaceRoot uses in advisor-validate.ts so the schema
  // and the handler agree on which directory is the workspace root.
  // A bare `.opencode/skill` sentinel can match nested mock directories
  // created by other workflows (e.g. runtime/.opencode/skill). The source tree
  // sits under `.skilled` or `.opencode`, so the sentinel is tested under both.
  const sentinels = SOURCE_ROOT_NAMES.map((name) => `${name}/skills/system-spec-kit/SKILL.md`);
~~~~

NEW:

~~~~text
export function detectRepoRoot(start: string = process.cwd()): string {
  // Use the same SKILL.md file sentinel as findAdvisorWorkspaceRoot so the schema
  // and the handler agree on which directory is the workspace root. A bare
  // directory sentinel would match the nested mock trees other workflows create.
  // The source tree sits under `.skilled` or `.opencode`, so the sentinel is
  // tested under both.
  const sentinels = SOURCE_ROOT_NAMES.map((name) => `${name}/skills/system-spec-kit/SKILL.md`);
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
  }
  // Lockstep with findAdvisorWorkspaceRoot: when the sentinel is unreachable,
  // never anchor the allowlist on a directory inside a source tree — take the
  // nearest source-root parent that holds the sentinel, else hoist above the
  // outermost source-root segment, so caller-supplied workspaceRoots are
  // bounded to the real root, not a nested subdir.
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
~~~~

NEW:

~~~~text
  }
  // Lockstep with findAdvisorWorkspaceRoot: when the walk misses the sentinel,
  // never anchor the allowlist on a directory inside a source tree. Take the start
  // or the nearest source-root parent that holds the sentinel, else hoist above the
  // outermost source-root segment, so caller-supplied workspaceRoots are bounded
  // to the real root, not a nested subdir.
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
~~~~
