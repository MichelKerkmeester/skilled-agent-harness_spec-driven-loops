## Edit 1

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts`

OLD:

~~~~text
function writeAllMirrors(options: { claudeBody?: string; omitClaude?: boolean } = {}): void {
  writeFile(`.skilled/agents/${AGENT_NAME}.md`, CANONICAL);
  if (!options.omitClaude) {
~~~~

NEW:

~~~~text
function writeAllMirrors(options: { claudeBody?: string; omitClaude?: boolean } = {}): void {
  writeFile(`.opencode/agents/${AGENT_NAME}.md`, CANONICAL);
  if (!options.omitClaude) {
~~~~
