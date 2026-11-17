import { pathToFileURL } from 'node:url';
const mod = await import(pathToFileURL(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts').href);
const route = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-agent' }] };
const prompts = [
  "use sk-doc to create an agent called invoice-parser, don't make any changes yet",
  "use sk-doc to create an agent called invoice-parser, don't make any changes to the files",
  "use sk-doc to create an agent called invoice-parser, do not make any changes",
  "use sk-doc to create an agent called invoice-parser, don't make changes until I review",
  "use sk-doc to create an agent called invoice-parser, without changing anything yet",
  "use sk-doc to create an agent called invoice-parser, don't change anything yet",
  "use sk-doc to create an agent called invoice-parser, make no changes to existing agents",
  "use sk-doc to create an agent called invoice-parser",
];
for (const p of prompts) {
  console.log(JSON.stringify({ prompt: p, isNoEdit: mod.isNoEditRequest(p), attach: mod.attachCommand('sk-doc', route, p) ?? null }));
}
