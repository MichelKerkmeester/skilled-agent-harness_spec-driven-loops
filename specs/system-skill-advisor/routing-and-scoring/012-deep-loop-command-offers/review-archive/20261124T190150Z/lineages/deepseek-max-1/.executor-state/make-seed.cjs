const fs = require('fs');
const L = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1';
const files = fs.readFileSync(L + '/review-scope-files.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const slices = [
  { id: 'slice-advisor-gate', label: 'Advisor gate, handlers and schemas', re: /^\.skilled\/skills\/system-skill-advisor\/runtime\/(lib|handlers|schemas)\// },
  { id: 'slice-advisor-tests', label: 'Advisor tests and fixture', re: /^\.skilled\/skills\/system-skill-advisor\/runtime\/tests\// },
  { id: 'slice-advisor-cli', label: 'Advisor CLI, subprocess and Python copy', re: /runtime\/(skill-advisor-cli\.ts|scripts\/skill_advisor\.py|lib\/subprocess\.ts)/ },
  { id: 'slice-deep-commands', label: 'Deep command documents', re: /^\.skilled\/commands\/deep\// },
  { id: 'slice-deep-loop-runtime', label: 'Deep-loop reducer and closeout', re: /^\.skilled\/skills\/system-deep-loop\// },
  { id: 'slice-packet-docs', label: 'Packet 012 closure documents', re: /012-deep-loop-command-offers\/[a-z-]+\.md$/ },
  { id: 'slice-packet-013', label: 'Packet 013 documents', re: /013-deep-loop-offer-in-hint\// },
  { id: 'slice-changelog-hooks', label: 'Changelog and hook contract', re: /^(\.skilled\/changelog\/|\.skilled\/hooks\/)/ },
];
const slug = (f) => f.replace(/[^a-zA-Z0-9]+/g, '-');
const nodes = [];
const edges = [];
for (const slice of slices) {
  nodes.push({ id: slice.id, kind: 'SLICE', label: slice.label, seedSource: 'scope_discovery', seedConfidence: 0.5 });
  for (const f of files.filter((x) => slice.re.test(x))) {
    edges.push({ id: 'covers-' + slice.id + '-' + slug(f).slice(-70), source: slice.id, target: 'file-' + slug(f), relation: 'COVERS' });
  }
}
for (const f of files) nodes.push({ id: 'file-' + slug(f), kind: 'FILE', label: f, seedSource: 'scope_discovery', seedConfidence: 0.5 });
fs.writeFileSync(L + '/.executor-state/seed-nodes.json', JSON.stringify(nodes));
fs.writeFileSync(L + '/.executor-state/seed-edges.json', JSON.stringify(edges));
console.log('nodes', nodes.length, 'edges', edges.length);
