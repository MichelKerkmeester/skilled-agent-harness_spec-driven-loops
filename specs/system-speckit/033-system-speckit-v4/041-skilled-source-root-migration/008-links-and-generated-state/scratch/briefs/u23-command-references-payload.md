## Edit 1

File: `.skilled/commands/scripts/validate-command-references.cjs`

OLD:

~~~~text
function commandSourceInventory(rootDir = REPO_ROOT) {
  const commandsRoot = path.join(rootDir, '.opencode', 'commands');
  if (!fs.existsSync(commandsRoot)) return [];
  const sources = [];
~~~~

NEW:

~~~~text
function commandSourceInventory(rootDir = REPO_ROOT) {
  // The command tree sits under .skilled, or under .opencode in a checkout that predates
  // the move, and each source path keeps the spelling of the root it was found under.
  const commandsRoot = ['.skilled', '.opencode']
    .map((rootName) => path.join(rootDir, rootName, 'commands'))
    .find((candidate) => fs.existsSync(candidate));
  if (!commandsRoot) return [];
  const sources = [];
~~~~

## Edit 2

File: `.skilled/commands/scripts/validate-command-references.cjs`

OLD:

~~~~text
function mirrorRelativeForSource(sourceRelative) {
  const commandRelative = sourceRelative.replace(/^\.opencode\/commands\//, '');
  const flatName = commandRelative.replace(/\.md$/, '').split('/').join('-');
~~~~

NEW:

~~~~text
function mirrorRelativeForSource(sourceRelative) {
  const commandRelative = sourceRelative.replace(/^\.(?:skilled|opencode)\/commands\//, '');
  const flatName = commandRelative.replace(/\.md$/, '').split('/').join('-');
~~~~

## Edit 3

File: `.skilled/commands/scripts/validate-command-references.cjs`

OLD:

~~~~text
      const mirrorText = fs.readFileSync(path.join(mirrorRoot, entry.name), 'utf8');
      const pointer = mirrorText.match(/`(\.opencode\/commands\/[^`]+\.md)`/);
      const owner = sources[0] || null;
~~~~

NEW:

~~~~text
      const mirrorText = fs.readFileSync(path.join(mirrorRoot, entry.name), 'utf8');
      const pointer = mirrorText.match(/`(\.(?:skilled|opencode)\/commands\/[^`]+\.md)`/);
      const owner = sources[0] || null;
~~~~
