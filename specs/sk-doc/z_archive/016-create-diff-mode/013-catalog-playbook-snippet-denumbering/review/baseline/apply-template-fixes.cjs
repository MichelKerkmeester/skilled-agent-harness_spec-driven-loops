'use strict';

// Fix the sub-kind (b) template links: sk-doc-internal references to REAL files written with
// the wrong relative path (sibling templates, references/global/* standards, SKILL.md,
// nested_changelog, the commands/ typo). These resolve from the template's own location once
// corrected. Genuine fill-in placeholders (reference-name.md, SOURCE.md, ../scripts/, etc.)
// are intentionally NOT touched. Each new target is verified to exist. Dry-run; --apply to write.
const fs = require('fs');
const path = require('path');
const APPLY = process.argv.includes('--apply');
const A = '.opencode/skills/sk-doc/assets/';

const FIXES = [
  // changelog_template.md
  { f: A + 'changelog_template.md', old: './readme_template.md', new: './readme/readme_template.md' },
  { f: A + 'changelog_template.md', old: './install_guide_template.md', new: './readme/install_guide_template.md' },
  { f: A + 'changelog_template.md', old: '../../references/global/hvr_rules.md', new: '../references/global/hvr_rules.md' },
  { f: A + 'changelog_template.md', old: '../../references/global/core_standards.md', new: '../references/global/core_standards.md' },
  { f: A + 'changelog_template.md', old: '../../../../command/create/changelog.md', new: '../../../commands/create/changelog.md' },
  { f: A + 'changelog_template.md', old: '../../../system-spec-kit/references/workflows/nested_changelog.md', new: '../../system-spec-kit/references/workflows/nested_changelog.md' },
  // command_template.md
  { f: A + 'command_template.md', old: './skill_md_template.md', new: './skill/skill_md_template.md' },
  { f: A + 'command_template.md', old: '../../references/global/core_standards.md', new: '../references/global/core_standards.md' },
  { f: A + 'command_template.md', old: '../../references/global/validation.md', new: '../references/global/validation.md' },
  // frontmatter_templates.md
  { f: A + 'frontmatter_templates.md', old: '../skill/skill_md_template.md', new: './skill/skill_md_template.md' },
  { f: A + 'frontmatter_templates.md', old: '../command_template.md', new: './command_template.md' },
  { f: A + 'frontmatter_templates.md', old: '../../references/global/core_standards.md', new: '../references/global/core_standards.md' },
  { f: A + 'frontmatter_templates.md', old: '../../references/global/validation.md', new: '../references/global/validation.md' },
  // llmstxt_templates.md
  { f: A + 'llmstxt_templates.md', old: '../skill/skill_md_template.md', new: './skill/skill_md_template.md' },
  { f: A + 'llmstxt_templates.md', old: '../../references/global/core_standards.md', new: '../references/global/core_standards.md' },
  // readme/install_guide_template.md
  { f: A + 'readme/install_guide_template.md', old: './frontmatter_templates.md', new: '../frontmatter_templates.md' },
  // skill/skill_md_template.md (only the real-file ref; reference-name/template-name etc. are fill-ins → untouched)
  { f: A + 'skill/skill_md_template.md', old: 'frontmatter_templates.md', new: '../frontmatter_templates.md' },
  // testing_playbook/manual_testing_playbook_template.md
  { f: A + 'testing_playbook/manual_testing_playbook_template.md', old: '../../../references/global/core_standards.md', new: '../../references/global/core_standards.md' },
  { f: A + 'testing_playbook/manual_testing_playbook_template.md', old: '../../../SKILL.md', new: '../../SKILL.md' },
  { f: A + 'testing_playbook/manual_testing_playbook_template.md', old: '../../template_rules.json', new: '../template_rules.json' },
];

let applied = 0; const files = new Set(); const problems = [];
for (const { f, old, new: nw } of FIXES) {
  if (!fs.existsSync(f)) { problems.push('MISSING SOURCE: ' + f); continue; }
  const cand = [path.join(path.dirname(f), nw), path.join('.', nw)];
  if (!cand.some((c) => fs.existsSync(c))) { problems.push('NEW TARGET MISSING: ' + f.replace(A, '') + ' -> ' + nw); continue; }
  let c = fs.readFileSync(f, 'utf8');
  const needle = '](' + old + ')';
  if (!c.includes(needle)) { problems.push('OLD NEEDLE NOT FOUND: ' + f.replace(A, '') + ' ](' + old + ')'); continue; }
  const n = c.split(needle).length - 1;
  c = c.split(needle).join('](' + nw + ')');
  applied += n; files.add(f);
  console.log(`  ${f.replace(A, '')}  ${old} -> ${nw}  (x${n})  [target OK]`);
  if (APPLY) fs.writeFileSync(f, c);
}
console.log(`\n=== APPLY-TEMPLATE-FIXES (${APPLY ? 'APPLIED' : 'DRY-RUN'}) === ${applied} edits across ${files.size} files`);
if (problems.length) { console.log('PROBLEMS / SKIPPED:'); problems.forEach((p) => console.log('  ! ' + p)); }
