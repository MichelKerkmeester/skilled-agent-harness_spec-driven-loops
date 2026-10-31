## Edit 1

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts`

OLD:

~~~~text
function buildAgentPacket(opts: { driftClaudeBody?: string } = {}) {
  const target = path.join(work, `.skilled/agents/${AGENT_NAME}.md`);
  const candidate = path.join(work, 'staged-candidate.md');
~~~~

NEW:

~~~~text
function buildAgentPacket(opts: { driftClaudeBody?: string } = {}) {
  const target = path.join(work, `.opencode/agents/${AGENT_NAME}.md`);
  const candidate = path.join(work, 'staged-candidate.md');
~~~~

## Edit 2

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts`

OLD:

~~~~text
  // Canonical target = the opencode mirror (current in-sync body).
  writeFile(`.skilled/agents/${AGENT_NAME}.md`, canonicalMd(CURRENT_BODY));
  // Claude mirror: in-sync by default, or a drifted body when requested.
~~~~

NEW:

~~~~text
  // Canonical target = the opencode mirror (current in-sync body).
  writeFile(`.opencode/agents/${AGENT_NAME}.md`, canonicalMd(CURRENT_BODY));
  // Claude mirror: in-sync by default, or a drifted body when requested.
~~~~
