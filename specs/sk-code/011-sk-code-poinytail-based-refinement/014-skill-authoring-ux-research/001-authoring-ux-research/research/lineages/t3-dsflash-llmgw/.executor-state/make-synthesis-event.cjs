// Build the canonical synthesis_committed event from the synthesis artifacts (read-only).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dir = process.argv[2];
const sid = process.argv[3];
const sha = (v) => crypto.createHash('sha256').update(v).digest('hex');
const research = fs.readFileSync(path.join(dir, 'research.md'));
const registry = JSON.parse(fs.readFileSync(path.join(dir, 'findings-registry.json'), 'utf8'));
const ids = (registry.keyFindings || []).map((f) => f.id).sort();
const bracketRe = /\[SOURCE:\s*([^\]]+)\]/g;
const tags = new Set();
let m;
while ((m = bracketRe.exec(research.toString('utf8'))) !== null) {
  const pairRe = /((?:\.skilled|specs|\.github)\/[^\s'\`,;]+?):(\d+)(?:-(\d+))?/g;
  let p;
  while ((p = pairRe.exec(m[1])) !== null) {
    const file = p[1].replace(/[`'"]/g, '');
    if (fs.existsSync(file)) tags.add(`${file}:${p[2]}${p[3] ? '-' + p[3] : ''}`);
  }
}
const event = {
  stem: "deep_research.synthesis_committed",
  scope: { runId: sid, lineageId: sid },
  data: {
    admittedLedgerRevision: "research.md@iteration-10",
    selectedClaimVersionSetDigest: sha(Buffer.from(ids.join('\n'))),
    synthesisPolicyDigest: sha(Buffer.from("synthesis-policy@1:fanout-lineage")),
    reportRevision: "research.md@iteration-10",
    unresolvedClaimIds: [],
    contestedClaimIds: [],
    reportDigest: sha(research),
    citationEventIds: [...tags].sort(),
    synthesisReceiptRef: "synthesis:t3-dsflash-llmgw:research.md",
  },
};
fs.writeFileSync(path.join(dir, '.executor-state', 'synthesis-event.json'), JSON.stringify(event), 'utf8');
console.log(`event prepared: citations=${tags.size} reportDigest=${sha(research).slice(0, 12)}`);
