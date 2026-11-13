// Throwaway review probe. Reads the source under review; writes nothing.
const ROOT = 'file:///Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/lib';
const { isNoEditRequest, attachCommand } = await import(`${ROOT}/command-attach.ts`);

const probes = [
  ['newline before to', 'refactor the parser and make no changes\nto its public api'],
  ['double space', 'refactor the parser and make no changes  to its public api'],
  ['tab', 'refactor the parser and make no changes\tto its public api'],
  ['colon', 'refactor the parser and make no changes: to its public api'],
  ['comma', 'refactor the parser and make no changes, to its public api'],
  ['dash', 'refactor the parser and make no changes - to its public api'],
  ['to the tests bare', 'make no changes to the tests'],
];

const route = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-agent' }] };
for (const [label, prompt] of probes) {
  process.stdout.write(`${JSON.stringify({
    label, prompt, noEdit: isNoEditRequest(prompt),
    attached: attachCommand('sk-doc', route, prompt) ?? null,
  })}\n`);
}
