// Apply the verified REPOINT fix-map from the 113-residual triage (clean files only —
// the 3 files staged by a concurrent session are deferred). Each fix is `](old)` -> `](new)`;
// the new target is verified to resolve from the source dir before/after. Dry-run by default; --apply.
const fs = require('fs');
const path = require('path');
const APPLY = process.argv.includes('--apply');
const S = '.opencode/skills/';

// {file, old, new} — old/new are the link targets (the part inside ](...)).
const FIXES = [
  // sk-code webflow surface-marker (reference doc) — verification only (debugging/implementation are dirty → deferred)
  { f: S + 'sk-code/references/webflow/verification/verification_workflows.md', old: '../../assets/checklists/verification_checklist.md', new: '../../../assets/webflow/checklists/verification_checklist.md' },
  // motion_dev off-by-one depth
  { f: S + 'sk-code/assets/webflow/checklists/code_quality_checklist.md', old: '../../references/motion_dev/', new: '../../../references/motion_dev/' },
  // skill-advisor freshness_contract category dirs (off-by-one depth)
  { f: S + 'system-skill-advisor/references/runtime/freshness_contract.md', old: '../feature_catalog/01--daemon-and-freshness/', new: '../../feature_catalog/01--daemon-and-freshness/' },
  { f: S + 'system-skill-advisor/references/runtime/freshness_contract.md', old: '../manual_testing_playbook/05--auto-update-daemon/', new: '../../manual_testing_playbook/05--auto-update-daemon/' },
  // mcp_server READMEs
  { f: S + 'system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md', old: '../../skill_advisor/tests/README.md', new: '../../tests/README.md' },
  { f: S + 'system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md', old: '../../skill_advisor/lib/README.md', new: '../../lib/README.md' },
  { f: S + 'system-spec-kit/mcp_server/lib/providers/README.md', old: '../contracts/README.md', new: '../interfaces/README.md' },
  { f: S + 'system-spec-kit/mcp_server/lib/enrichment/README.md', old: '../../code_graph/README.md', new: '../../../../system-code-graph/mcp_server/README.md' },
  { f: S + 'system-spec-kit/mcp_server/plugin_bridges/README.md', old: '../skill_advisor/README.md', new: '../../../system-skill-advisor/mcp_server/README.md' },
  // relocated spec packet (3 snippets, same old->new)
  ...['cli-driven-slug', 'create-sh-fallback', 'remediation-rule'].map((s) => ({
    f: S + `system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-${s}.md`,
    old: '../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/',
    new: '../../../../specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/',
  })),
  // benchmark FORMAT.md consolidated into sk-doc
  { f: S + 'system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md', old: '../FORMAT.md', new: '../../../../sk-doc/references/benchmark_creation.md' },
  // resource-map logical token -> manifest template
  { f: S + 'system-spec-kit/scripts/resource-map/README.md', old: '../../templates/level_contract_optional_resource-map.md', new: '../../templates/manifest/resource-map.md.tmpl' },
];

let applied = 0, files = new Set(), problems = [];
for (const { f, old, new: nw } of FIXES) {
  if (!fs.existsSync(f)) { problems.push(`MISSING SOURCE: ${f}`); continue; }
  // verify the corrected target resolves from the source dir OR repo root
  const cand = [path.join(path.dirname(f), nw.replace(/\/$/, '')), path.join('.', nw.replace(/\/$/, ''))];
  const resolves = cand.some((c) => fs.existsSync(c));
  if (!resolves) { problems.push(`NEW TARGET DOES NOT RESOLVE: ${f}  -> ${nw}`); continue; }
  let content = fs.readFileSync(f, 'utf8');
  const needle = '](' + old + ')';
  if (!content.includes(needle)) { problems.push(`OLD NEEDLE NOT FOUND: ${f}  ](${old})`); continue; }
  const n = content.split(needle).length - 1;
  content = content.split(needle).join('](' + nw + ')');
  applied += n; files.add(f);
  console.log(`  ${f.replace(S, '')}  ${old} -> ${nw}  (x${n})  [target OK]`);
  if (APPLY) fs.writeFileSync(f, content);
}
console.log(`\n=== APPLY-REPOINTS (${APPLY ? 'APPLIED' : 'DRY-RUN'}) === ${applied} edits across ${files.size} files`);
if (problems.length) { console.log('PROBLEMS:'); problems.forEach((p) => console.log('  ! ' + p)); }
