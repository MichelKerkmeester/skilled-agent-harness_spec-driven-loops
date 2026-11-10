// Read-only replay of the sk-code skill-advisor probe battery (manual-testing-playbook SA-001): 17 positives, 5 negatives.
// Run from the repository root. Prints one line per probe, then the aggregate line.
'use strict';
const { execFileSync } = require('node:child_process');
const ADVISOR = '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py';
const POS = [
  'Refactor the parseExecutorConfig function in .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.',
  'Implement a negative-trigger whitelist in gate-3-classifier.ts and run the targeted tests.',
  'Refactor skill_advisor.py to surface raw ambiguity counts in debug output.',
  'Write a Vitest covering classifyPrompt() for the resume deep review phrase.',
  'Configure .vscode/mcp.json to mirror the current codeGraph server inputs.',
  'Use the OpenCode standards route to clean up this CommonJS helper.',
  'Add a packet-local helper that formats Gate 3 confusion-matrix rows for the research summary.',
  'Generate a replacement gate3-baseline.json fixture for the first 100 prompts.',
  'Refactor the corpus scoring helper so it emits stable JSONL keys in sorted order.',
  'Build a tiny script that counts how many prompts mention /speckit:resume.',
  'Add set -euo pipefail and a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh to clean up the temp dir on exit.',
  'Add a Lenis smooth-scroll initializer to src/2_javascript/scroll.js and gate it behind an IntersectionObserver.',
  'Wire up a GSAP timeline that animates the hero section on page load with motion.dev fallback.',
  'Initialize an HLS.js video player on .video-hero with adaptive bitrate fallback.',
  'Add a --threshold flag to verify_alignment_drift.py that adjusts the failure threshold for missing module headers.',
  'Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention.',
  "Add a status column to the Obsidian plugin data layer and register the view with the plugin's onload in src/main.ts.",
];
const NEG = [
  'Update the sk-code SKILL.md headline section to clarify the two-axis routing model.',
  'Explain how skill_advisor.py computes uncertainty.',
  'Resume the deep-review iteration from the last save point.',
  'Reorganize the cli-opencode README into Quick Start, Architecture, and Reference sections.',
  'Investigate why the gate-3 classifier mis-categorizes resume prompts and report findings as a research summary.',
];
function top(prompt) {
  const out = execFileSync('python3', [ADVISOR, prompt, '--threshold', '0.8'], { encoding: 'utf8' });
  const rows = JSON.parse(out);
  return rows.length ? { skill: rows[0].skill, confidence: rows[0].confidence } : { skill: 'none', confidence: 0 };
}
let won = 0;
let fp = 0;
POS.forEach((p, i) => {
  const t = top(p);
  const ok = t.skill === 'sk-code' && t.confidence >= 0.8;
  if (ok) won += 1;
  console.log(`P${i + 1} ${ok ? 'WIN' : 'LOSS'} ${t.skill} ${t.confidence}`);
});
NEG.forEach((p, i) => {
  const t = top(p);
  const bad = t.skill === 'sk-code';
  if (bad) fp += 1;
  console.log(`N${i + 1} ${bad ? 'FALSE-POSITIVE' : 'OK'} ${t.skill} ${t.confidence}`);
});
console.log(`positives ${won}/${POS.length} negatives-false-positive ${fp}/${NEG.length}`);
