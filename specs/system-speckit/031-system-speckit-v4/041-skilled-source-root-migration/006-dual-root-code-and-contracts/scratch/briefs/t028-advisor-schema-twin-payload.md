## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
//
// Repo root is detected by walking up from process.cwd() looking for the
// .opencode/skill sentinel — same shape as findAdvisorWorkspaceRoot but
// inlined here to avoid a circular import between schemas/ and lib/.
function detectRepoRoot(): string {
  // Use the same SKILL.md sentinel that
~~~~

NEW:

~~~~text
//
// Directory names the source tree may sit under. A checkout may link one to the
// other, so both mark the same tree.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];

// Repo root is detected by walking up from process.cwd() looking for the
// system-spec-kit SKILL.md sentinel — same shape as findAdvisorWorkspaceRoot but
// inlined here to avoid a circular import between schemas/ and lib/. The start
// directory is a parameter so the lockstep test can feed both resolvers one tree.
export function detectRepoRoot(start: string = process.cwd()): string {
  // Use the same SKILL.md sentinel that
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
  // A bare `.opencode/skill` sentinel can match nested mock directories
  // created by other workflows (e.g. runtime/.opencode/skill).
  const sentinel = '.opencode/skills/system-spec-kit/SKILL.md';
  let current = resolve(process.cwd());
  for (let index = 0; index < 14; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
~~~~

NEW:

~~~~text
  // A bare `.opencode/skill` sentinel can match nested mock directories
  // created by other workflows (e.g. runtime/.opencode/skill). The source tree
  // sits under `.skilled` or `.opencode`, so the sentinel is tested under both.
  const sentinels = SOURCE_ROOT_NAMES.map((name) => `${name}/skills/system-spec-kit/SKILL.md`);
  let current = resolve(start);
  for (let index = 0; index < 14; index += 1) {
    if (sentinels.some((sentinel) => existsSync(resolve(current, sentinel)))) return current;
    const parent = resolve(current, '..');
~~~~

## Edit 3

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
  // Lockstep with findAdvisorWorkspaceRoot: when the sentinel is unreachable,
  // never anchor the allowlist on a directory inside an .opencode tree — hoist
  // above the outermost .opencode segment so caller-supplied workspaceRoots are
  // bounded to the real root, not a nested subdir.
  return hoistAboveOpencodeTree(process.cwd()) ?? resolve(process.cwd());
}
~~~~

NEW:

~~~~text
  // Lockstep with findAdvisorWorkspaceRoot: when the sentinel is unreachable,
  // never anchor the allowlist on a directory inside a source tree — take the
  // nearest source-root parent that holds the sentinel, else hoist above the
  // outermost source-root segment, so caller-supplied workspaceRoots are
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
  for (let index = parts.length - 1; index >= 1; index -= 1) {
    if (!SOURCE_ROOT_NAMES.includes(parts[index])) continue;
    const parent = parts.slice(0, index).join(sep) || sep;
    if (sentinels.some((sentinel) => existsSync(resolve(parent, sentinel)))) return parent;
  }
  return null;
}
~~~~

## Edit 4

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
// lockstep so the schema allowlist and the handler agree on the workspace root.
// An .opencode directory is by definition a child of the workspace root, so
// hoisting above the OUTERMOST one yields the real root and can never return a
// path inside an .opencode tree (the earlier specs-only shape missed sibling
// subtrees like skills/).
~~~~

NEW:

~~~~text
// lockstep so the schema allowlist and the handler agree on the workspace root.
// A `.skilled` or `.opencode` directory is by definition a child of the workspace
// root, so hoisting above the OUTERMOST one yields the real root and can never
// return a path inside a source tree (the earlier specs-only shape missed sibling
// subtrees like skills/).
~~~~

## Edit 5

File: `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`

OLD:

~~~~text
  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index] === '.opencode') {
      return parts.slice(0, index).join(sep) || sep;
~~~~

NEW:

~~~~text
  for (let index = 1; index < parts.length; index += 1) {
    if (SOURCE_ROOT_NAMES.includes(parts[index])) {
      return parts.slice(0, index).join(sep) || sep;
~~~~
