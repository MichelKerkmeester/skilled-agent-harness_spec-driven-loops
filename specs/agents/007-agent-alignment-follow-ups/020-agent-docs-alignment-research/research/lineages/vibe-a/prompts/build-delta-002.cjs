const fs = require('node:fs');
const path = require('node:path');
const L = process.argv[2];
const record = JSON.parse(fs.readFileSync(path.join(L, 'prompts', 'iteration-002-record.json'), 'utf8'));
const findings = [
  { id: 'f-iter002-001', label: '.skilled/skills/system-deep-loop/deep-research/SKILL.md:15 names only OpenCode/Copilot and Claude for runtime agent path resolution, omitting six of the eight runtime agent trees and naming a Copilot tree that does not exist.', sources: ['.skilled/skills/system-deep-loop/deep-research/SKILL.md:15', '.codex/agents/', '.vibe/agents/', '.dsh/agents/'] },
  { id: 'f-iter002-002', label: '.skilled/skills/system-deep-loop/deep-review/SKILL.md:14-16 repeats the same two-runtime resolution list and the same six-tree omission.', sources: ['.skilled/skills/system-deep-loop/deep-review/SKILL.md:14', '.pi/agents/', '.cursor/agents/'] },
  { id: 'f-iter002-003', label: '.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247 claims an 11-agent three-class split but names only nine project agents, pads the count with the Claude built-ins general and plan, and omits code and design.', sources: ['.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247', '.skilled/agents/agent-registry.json:1', '.skilled/agents/code.md:1', '.skilled/agents/design.md:1'] },
  { id: 'f-iter002-004', label: 'claude-tools.md:247 classifies prompt-improver as command-owned and dispatched only by its parent /deep:* command, but its registry dispatchers are /prompt:improve and orchestrate.', sources: ['.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247', '.skilled/agents/agent-registry.json:1'] },
  { id: 'f-iter002-005', label: 'claude-tools.md:247 says ai-council is routed via --agent orchestrate and never direct, contradicting the registry dispatchers /speckit:ai-council and operator and system-deep-loop/SKILL.md:33.', sources: ['.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247', '.skilled/agents/agent-registry.json:1', '.skilled/skills/system-deep-loop/SKILL.md:33'] },
  { id: 'f-iter002-006', label: 'deep-review SKILL.md:262 and loop-state-and-gates.md:76 give a five-value status enum that omits thought, which .skilled/agents/deep-review.md:236 allows.', sources: ['.skilled/skills/system-deep-loop/deep-review/SKILL.md:262', '.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:76', '.skilled/agents/deep-review.md:236'] },
  { id: 'f-iter002-007', label: 'deep-research README.md:28 understates the LEAF agent tool set as Read, WebFetch, Grep and Glob, omitting write, edit and bash that the permission map grants and that the same README line 88 depends on.', sources: ['.skilled/skills/system-deep-loop/deep-research/README.md:28', '.skilled/skills/system-deep-loop/deep-research/README.md:88', '.skilled/agents/deep-research.md:6'] },
];
const lines = [JSON.stringify(record)];
for (const f of findings) lines.push(JSON.stringify({ type: 'finding', id: f.id, severity: 'P2', label: f.label, iteration: 2, sources: f.sources }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'Treating ai-council task: allow as a LEAF violation', reason: 'ai-council.md:38-47 defines a Depth 0 operator-invocation exception and a Depth 1 refusal, so the permission matches its own contract', iteration: 2 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'Treating review bash: allow as contradicting its read-only claim', reason: 'review.md:110 scopes Bash to git diff, git log and gh pr view', iteration: 2 }));
lines.push(JSON.stringify({ type: 'observation', id: 'obs-iter002-001', packet: '020', classification: 'real', iteration: 2 }));
fs.writeFileSync(path.join(L, 'deltas', 'iter-002.jsonl'), lines.join('\n') + '\n');
console.log('delta lines:', lines.length, 'findings:', findings.length);
