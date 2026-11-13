// Throwaway closing-round probe. Reads the shipped modules; writes nothing.
const ROOT = 'file:///Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/lib';
const { isNoEditRequest, attachCommand } = await import(`${ROOT}/command-attach.ts`);
const { isReadOnlyExplainer } = await import(`${ROOT}/scorer/text.ts`);
const { commandMeaningEligible } = await import(`${ROOT}/scorer/fusion.ts`);

const SINGLE = (workflowMode) => ({ action: 'route', selectionKind: 'single', targets: [{ workflowMode }] });

const prompts = [
  // Settled control: must be true, must not be reported again.
  ['settled', 'refactor the parser and make no changes to its public api'],
  // Genuine no-edit requests whose verb is outside the pattern's four verbs.
  ['no-edit: dont create yet', "show me the agent file you would create for invoice-parser, don't create it yet"],
  ['no-edit: dont write', 'show me how the changelog is generated, do not write any files'],
  ['no-edit: dont save', 'tell me what the release notes should say, do not save them yet'],
  ['no-edit: no modifications', 'review the diff and describe it, no modifications'],
  // Controls: the same request phrased with a covered verb.
  ['control: dont change yet', "show me the agent file you would create for invoice-parser, don't change it yet"],
  ['control: dont edit', 'show me the changelog draft, do not edit any files'],
  // Two-step request where the first step is read-only.
  ['two-step: just show then fix', 'just show me the failing test, then fix it'],
  ['two-step: show then fix', 'show me the failing test, then fix it'],
  ['two-step: just list then update', 'just list the stale files, then update them'],
];

for (const [label, prompt] of prompts) {
  process.stdout.write(`${JSON.stringify({
    label,
    prompt,
    noEdit: isNoEditRequest(prompt),
    readOnlyExplainer: isReadOnlyExplainer(prompt),
    meaningMutating: commandMeaningEligible(prompt, false, undefined),
  })}\n`);
}

process.stdout.write('--- attachCommand with a single-mode create route ---\n');
for (const [label, prompt] of prompts) {
  process.stdout.write(`${JSON.stringify({
    label,
    prompt,
    attached: attachCommand('sk-doc', SINGLE('sk-create-agent'), prompt),
  })}\n`);
}

process.stdout.write('--- attachCommand with a single-mode changelog route ---\n');
for (const [label, prompt] of prompts) {
  process.stdout.write(`${JSON.stringify({
    label,
    prompt,
    attached: attachCommand('sk-doc', SINGLE('sk-create-changelog'), prompt),
  })}\n`);
}
