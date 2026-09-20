'use strict';

// Build a scoped RCAF prompt for one deep-review iteration dispatched to DeepSeek-v4-pro
// (cli-opencode, --pure, read-only). Triage iterations embed the deterministic baseline
// findings for their slice; hunt iterations point DeepSeek at a reference class the
// markdown-link regex cannot see. Usage: node build-prompt.cjs <iteration-number>
const fs = require('fs');
const path = require('path');

const REVIEW_DIR = path.resolve(__dirname, '..');
const baseline = require(path.join(__dirname, 'baseline-findings.json'));

// 10 iteration slices: 1-6 triage the baseline, 7-10 hunt regex-missed classes.
const SLICES = [
  { n: 1, label: 'sk-code checklists → references', mode: 'triage',
    filter: (b) => b.file.startsWith('.opencode/skills/sk-code/') },
  { n: 2, label: 'sk-doc assets & templates', mode: 'triage',
    filter: (b) => b.file.startsWith('.opencode/skills/sk-doc/') },
  { n: 3, label: 'other sk-* skills + deep-* skills', mode: 'triage',
    filter: (b) => (b.area === 'skill:sk' && !b.file.startsWith('.opencode/skills/sk-code/') && !b.file.startsWith('.opencode/skills/sk-doc/')) || b.area === 'skill:deep' },
  { n: 4, label: 'system-spec-kit manual_testing_playbook', mode: 'triage',
    filter: (b) => b.file.includes('system-spec-kit/manual_testing_playbook/') },
  { n: 5, label: 'cli-* + remaining catalog/playbook roots', mode: 'triage',
    filter: (b) => b.area === 'catalog-playbook' && !b.file.includes('system-spec-kit/manual_testing_playbook/') },
  { n: 6, label: 'skill:system non-playbook refs', mode: 'triage',
    filter: (b) => b.area === 'skill:system' },
  { n: 7, label: 'agents frontmatter + body path refs', mode: 'hunt',
    scope: 'Every agent definition under .opencode/agents/, .claude/agents/, .codex/agents/ (and .agents/ if present). Check frontmatter fields that name paths (allowed-tools is NOT a path; look for any model/template/skill path fields), plus body references to skills, commands, scripts, and other agents.' },
  { n: 8, label: 'commands frontmatter + body path refs', mode: 'hunt',
    scope: 'Every command under .opencode/commands/ (and .claude/commands/, .codex/commands/ if present). Verify each path the command names actually exists: the SKILL.md it loads, the YAML asset it executes, scripts it calls, and templates it copies. Commands are the highest-blast-radius path consumers.' },
  { n: 9, label: 'SKILL.md structured paths (scripts/assets/refs)', mode: 'hunt',
    scope: 'SKILL.md files for cli-*, mcp-*, deep-*, system-* skills. Restrict to STRUCTURED path references only: (a) frontmatter path fields, (b) backtick/inline paths naming a script (.cjs/.js/.ts/.sh/.py), (c) asset/template paths (.yaml/.tmpl/.json), (d) sibling reference docs (references/**/*.md). Resolve each against both bases; report only broken or wrong-file. Do NOT chase every prose sentence — structured paths only. This is the class that breaks runtime, so prioritize scripts/assets named in frontmatter and "Scripts:" / "References:" sections.' },
  { n: 10, label: 'cross-skill references (skill A → skill B)', mode: 'hunt',
    scope: 'Cross-skill references only: a doc inside one skill that points into a DIFFERENT skill\'s files (e.g. cli-opencode referencing ../sk-prompt-models/..., or an agent/command referencing .opencode/skills/<other>/...). For each, confirm the target file exists AND is the intended file (not just any file with that basename). Report broken targets and wrong-file (slug-drift) targets. Concentrate on the cli-*, deep-*, and system-* skills plus .opencode/agents and .opencode/commands, which have the densest cross-skill wiring.' },
];

const iterN = parseInt(process.argv[2], 10);
const slice = SLICES.find((s) => s.n === iterN);
if (!slice) { console.error('unknown iteration', iterN); process.exit(1); }

const NNN = String(iterN).padStart(3, '0');
const deltaPath = `.opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/deltas/iter-${NNN}.jsonl`;

let body;
if (slice.mode === 'triage') {
  const hits = baseline.broken.filter(slice.filter);
  const lines = hits.map((h, i) => `${i + 1}. [${h.area}] ${h.file}\n     link target: ${h.ref}`).join('\n');
  body = `# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(\`NN--category/NNN-name.md\` → \`NN--category/name.md\`); category FOLDERS kept their
\`NN--\` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **${slice.label}** — it flagged these ${hits.length} broken markdown links (target
resolves under NEITHER base):

${lines || '(none in this slice)'}

# ROLE

You are a meticulous path-reference auditor. You verify against the real files on disk —
never guess. You distinguish a genuine broken reference from an intentional template
placeholder or example.

# ACTION

For EACH flagged link above:
1. Read the source file around the link to understand intent.
2. Check the target tree (Grep/Glob/Read) for the real file — it may exist under a slightly
   different slug, a different directory, or not at all.
3. Classify it:
   - severity: P0 (a command/agent/loadable path that breaks runtime), P1 (a real broken
     doc cross-reference a human or tool would follow), or P2 (cosmetic / template example /
     intentional placeholder).
   - classification: REAL_BROKEN | TEMPLATE_EXAMPLE | WRONG_SLUG_TARGET_EXISTS | TARGET_DELETED | FALSE_POSITIVE
   - is_133_caused: true only if the breakage was introduced by the de-numbering migration
     (e.g. the link still points at a numbered path and the de-numbered file exists).
   - if WRONG_SLUG_TARGET_EXISTS, give the correct target path.
4. Then briefly hunt the SAME files for any broken reference the markdown-link regex would
   miss (frontmatter paths, real backtick paths, links that resolve to the WRONG file).

# OUTPUT FORMAT

Return ONLY a single fenced \`\`\`json block, no prose before or after, with this shape:

\`\`\`json
{
  "iteration": ${iterN},
  "slice": "${slice.label}",
  "verdict": "PASS | CONDITIONAL | FAIL",
  "findings": [
    {"ref":"<link target>","source_file":"<path>","severity":"P0|P1|P2",
     "classification":"REAL_BROKEN|TEMPLATE_EXAMPLE|WRONG_SLUG_TARGET_EXISTS|TARGET_DELETED|FALSE_POSITIVE",
     "is_133_caused":false,"correct_target":"<path or null>","evidence":"<file:line or grep result>",
     "recommendation":"<one line>"}
  ],
  "missed_by_regex": [
    {"ref":"<path>","source_file":"<path>","severity":"P0|P1|P2","evidence":"<file:line>","recommendation":"<one line>"}
  ],
  "summary": "<2-3 sentences: how many real vs noise, any systemic pattern>"
}
\`\`\`

verdict mapping: FAIL if any P0; CONDITIONAL if any P1 (no P0); PASS otherwise.`;
} else {
  body = `# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES (category folders kept \`NN--\` numbers). A deterministic markdown-link
checker already covered ordinary \`](target.md)\` links across the surface and found 295
broken (mostly pre-existing). Your job is the references that regex CANNOT see.

Link conventions: a relative path may resolve against the source file's directory OR the
repo root. Both are valid — only flag a reference if it resolves under NEITHER.

# ROLE

You are a meticulous path-reference auditor. Verify against real files on disk — never guess.

# ACTION — HUNT SCOPE

${slice.scope}

Use Grep/Glob/Read. Be systematic: enumerate the files in scope, extract the path-like
references, resolve each against both bases, and report only the ones that resolve to nothing
(or to the wrong file). Prefer precision over volume — every finding must cite file:line and
name the missing/wrong target.

TIME-BOX (critical): finish within ~9 minutes. A grep-driven sweep beats reading every file
end-to-end — use Grep to extract candidate path strings, then Read only to confirm. If the
scope is larger than you can finish, examine a representative set and report the count in
"files_examined". ALWAYS emit the final JSON block before you stop — partial findings inside
valid JSON are far more useful than exhaustive work with no parseable output.

# OUTPUT FORMAT

Return ONLY a single fenced \`\`\`json block, no prose before or after:

\`\`\`json
{
  "iteration": ${iterN},
  "slice": "${slice.label}",
  "verdict": "PASS | CONDITIONAL | FAIL",
  "findings": [
    {"ref":"<path referenced>","source_file":"<path>","severity":"P0|P1|P2",
     "classification":"REAL_BROKEN|WRONG_SLUG_TARGET_EXISTS|TARGET_DELETED|BROKEN_ANCHOR",
     "is_133_caused":false,"correct_target":"<path or null>","evidence":"<file:line>",
     "recommendation":"<one line>"}
  ],
  "files_examined": <integer>,
  "summary": "<2-3 sentences: coverage + any systemic pattern>"
}
\`\`\`

verdict mapping: FAIL if any P0; CONDITIONAL if any P1 (no P0); PASS otherwise.`;
}

const header = `When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes ${deltaPath}.\n\n`;

const promptPath = path.join(REVIEW_DIR, 'prompts', `iteration-${NNN}.md`);
fs.writeFileSync(promptPath, header + body);
console.log('wrote', promptPath, '(' + (header + body).length + ' chars, mode=' + slice.mode + ')');
