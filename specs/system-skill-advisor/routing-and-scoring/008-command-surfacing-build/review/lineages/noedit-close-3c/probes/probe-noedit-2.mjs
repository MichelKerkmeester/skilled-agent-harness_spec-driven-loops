// Throwaway probe 2: the two-step "just show ... then create" form.
const ROOT = 'file:///Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/lib';
const { isNoEditRequest, attachCommand } = await import(`${ROOT}/command-attach.ts`);
const SINGLE = (m) => ({ action: 'route', selectionKind: 'single', targets: [{ workflowMode: m }] });
const cases = [
  ['just show + then create', 'just show me the changelog draft, then create it'],
  ['show + then create', 'show me the changelog draft, then create it'],
  ['just show + and then create', 'just show me the changelog draft and then create it'],
];
for (const [label, prompt] of cases) {
  process.stdout.write(`${JSON.stringify({
    label,
    prompt,
    noEdit: isNoEditRequest(prompt),
    attached: attachCommand('sk-doc', SINGLE('sk-create-changelog'), prompt),
  })}\n`);
}
