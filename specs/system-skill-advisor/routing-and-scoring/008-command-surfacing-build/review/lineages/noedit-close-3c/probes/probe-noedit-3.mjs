// Throwaway probe 3: a no-edit instruction that is not a read-only explainer,
// so the scorer keeps the route and the hub-attach path is the reachable one.
const ROOT = 'file:///Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/lib';
const { isNoEditRequest, attachCommand } = await import(`${ROOT}/command-attach.ts`);
const { isReadOnlyExplainer } = await import(`${ROOT}/scorer/text.ts`);
const SINGLE = (m) => ({ action: 'route', selectionKind: 'single', targets: [{ workflowMode: m }] });
const cases = [
  ['create-not-covered', 'use sk-doc to plan the changelog, don\'t create it yet', 'sk-create-changelog'],
  ['write-not-covered', 'use sk-doc to plan the changelog, don\'t write the file yet', 'sk-create-changelog'],
  ['control-change', 'use sk-doc to plan the changelog, don\'t change anything yet', 'sk-create-changelog'],
  ['agent-create-not-covered', 'use sk-doc to plan the agent, don\'t create the file yet', 'sk-create-agent'],
];
for (const [label, prompt, mode] of cases) {
  process.stdout.write(`${JSON.stringify({
    label,
    prompt,
    noEdit: isNoEditRequest(prompt),
    readOnlyExplainer: isReadOnlyExplainer(prompt),
    attached: attachCommand('sk-doc', SINGLE(mode), prompt),
  })}\n`);
}
