// Run from the repository root: node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Calls the attach path, the scorer's command gate and the explainer test on the
// reviewer's no-edit wordings, and shows what a widened pattern with curly
// apostrophes normalised would answer. Reads source files only.
import { resolve } from 'node:path';
const ca = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts'));
const tx = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts'));
const fu = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts'));
const single = (mode: string) => ({ action: 'route', selectionKind: 'single', targets: [{ workflowMode: mode }] });
const PROPOSED = /\b(no edits?|no changes|without making changes|(?:do not|don't) (change|edit|modify|touch)|read-only only|no edits yet|only; do not|just show|just list)\b/;
const normalised = (text: string) => text.toLowerCase().replace(/[‘’]/g, "'");
const base = 'use sk-doc to create an agent called invoice-parser, ';
const endings = ['do not change anything yet', "don't change anything yet", 'no changes yet', 'don’t touch any files', 'make no changes'];
for (const ending of endings) {
  const prompt = base + ending;
  const helper = typeof ca.isNoEditRequest === 'function' ? ca.isNoEditRequest(prompt) : 'absent';
  console.log(`attach "${ending}" -> ${JSON.stringify(ca.attachCommand('sk-doc', single('sk-create-agent'), prompt))} | shared pattern ${ca.NO_EDIT_REQUEST.test(prompt.toLowerCase())} | isNoEditRequest ${helper} | proposed ${PROPOSED.test(normalised(prompt))}`);
}
const explainers = [
  'please show me the parser config, do not change anything yet',
  "please show me the parser config, don't change anything yet",
  'please show me the parser config so i can update it later, no changes yet',
  'please show me what the fix would be, don’t touch any files',
  'please show me the parser config and what to edit, make no changes',
];
for (const ending of endings) {
  console.log(`scorer commandMeaningEligible "${ending}" -> ${fu.commandMeaningEligible((base + ending).toLowerCase(), false, undefined)}`);
}
for (const prompt of explainers) {
  console.log(`isReadOnlyExplainer "${prompt}" -> ${tx.isReadOnlyExplainer(prompt.toLowerCase())}`);
}
const INJECTED = { 'sk-doc': { 'sk-create-readme': '/injected:readme' } };
const PLAIN = 'how does the routing table pick a skill';
console.log(`attach(sk-doc, sk-create-benchmark, plain, injected table) -> ${JSON.stringify(ca.attachCommand('sk-doc', single('sk-create-benchmark'), PLAIN, INJECTED))}`);
console.log(`attach(sk-doc, sk-create-benchmark, plain, generated table) -> ${JSON.stringify(ca.attachCommand('sk-doc', single('sk-create-benchmark'), PLAIN))}`);
console.log(`'sk-create-benchmark' in injected sk-doc row -> ${'sk-create-benchmark' in INJECTED['sk-doc']}`);
