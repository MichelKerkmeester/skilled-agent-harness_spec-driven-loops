## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs`

OLD:

~~~~text
const DIST = resolve(HERE, '../../dist/runtime');

function findWorkspaceRoot(start) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, '.opencode/skills/system-spec-kit/SKILL.md'))) return current;
    current = dirname(current);
~~~~

NEW:

~~~~text
const DIST = resolve(HERE, '../../dist/runtime');

// The source tree sits under .skilled or .opencode, and a checkout may link one name to
// the other, so the sentinel counts under either name.
function findWorkspaceRoot(start) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    const root = current;
    if (['.skilled', '.opencode'].some((name) => existsSync(join(root, name, 'skills/system-spec-kit/SKILL.md')))) return current;
    current = dirname(current);
~~~~
