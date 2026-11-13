// Throwaway review probe. Reads the source under review; writes nothing.
const ROOT = 'file:///Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/lib';
const { isNoEditRequest, attachCommand } = await import(`${ROOT}/command-attach.ts`);
const { isReadOnlyExplainer } = await import(`${ROOT}/scorer/text.ts`);
const { commandMeaningEligible } = await import(`${ROOT}/scorer/fusion.ts`);

const probes = [
  // The fixed case from the commit and its new tests.
  ['fixed: scope limit to', 'refactor the parser and make no changes to its public api'],
  ['fixed: scope limit in', 'rename the helper but make no changes in the tests'],
  // Genuine no-edit requests phrased with the same preposition pair.
  ['no-edit: to any files', 'make no changes to any files, just tell me why the advisor ranks code above docs'],
  ['no-edit: to the repo', 'make no changes to the repo, only report the riskiest file'],
  ['no-edit: in the source', 'make no changes in the source, just explain the ranking'],
  ['no-edit: to it', 'make no changes to it and just list the callers'],
  // Controls that must keep working.
  ['control: yet', 'make no changes yet, just show the plan'],
  ['control: change request', 'add a flag and do not change the output'],
  ['control: bare', 'make no changes'],
];

for (const [label, prompt] of probes) {
  process.stdout.write(`${JSON.stringify({ label, prompt, noEdit: isNoEditRequest(prompt) })}\n`);
}

const route = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-agent' }] };
for (const [, prompt] of probes) {
  process.stdout.write(`${JSON.stringify({ prompt, attached: attachCommand('sk-doc', route, prompt) })}\n`);
}

const mutating = {
  id: 'sk-doc', kind: 'command', readOnly: false,
  keywords: ['create an agent'],
};
for (const [, prompt] of probes) {
  const lower = prompt.toLowerCase();
  const explainer = isReadOnlyExplainer(lower);
  process.stdout.write(`${JSON.stringify({
    prompt,
    readOnlyExplainer: explainer,
    mutatingCommandEligible: commandMeaningEligible(lower, explainer, mutating),
  })}\n`);
}
