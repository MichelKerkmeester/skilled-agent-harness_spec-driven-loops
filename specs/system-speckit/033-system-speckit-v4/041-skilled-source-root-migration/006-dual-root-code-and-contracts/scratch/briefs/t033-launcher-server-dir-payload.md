## Edit 1

File: `.opencode/bin/mcp-code-mode-launcher.cjs`

OLD:

~~~~text
const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');
const SERVER_DIRECTORY = path.join(
  REPOSITORY_ROOT,
  '.opencode',
  'skills',
~~~~

NEW:

~~~~text
const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');
// The launcher ships inside the source tree whose server it starts, and that tree sits
// under .skilled or .opencode. Node reports the real path of a script loaded through an
// .opencode link, so resolving from this directory finds the server under either name.
const SERVER_DIRECTORY = path.resolve(
  __dirname,
  '..',
  'skills',
~~~~
