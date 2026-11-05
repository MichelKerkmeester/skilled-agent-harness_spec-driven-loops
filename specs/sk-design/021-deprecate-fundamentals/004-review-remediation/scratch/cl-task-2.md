TASK: create two new patch changelog entries and bump each packet's version.
READ FIRST:
1. .skilled/skills/sk-doc/sk-create-changelog/SKILL.md sections 5, 7, 8 and 9, and .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md. They own the format and voice. Use the compact shape.
2. The newest existing entry in each target folder, for shape and frontmatter style.
3. `git -c core.fsmonitor=false diff 10474a9567 -- <file>` for each changed file named below. That diff is the only evidence of what changed.

ENTRY 1:
- File: .skilled/skills/sk-design/sk-design-md-generator/changelog/v1.1.12.0.md
- Change: references/design-knowledge/numeric-design-laws.md now hands value decisions to sk-code's frontend surface, because the design values mode was retired.
- Then set `version: 1.1.12.0` in .skilled/skills/sk-design/sk-design-md-generator/SKILL.md frontmatter.
- Identity phrases: "sk-design-md-generator v1.1.12.0" and "sk-design-md-generator 1.1.12.0".
ENTRY 2:
- File: .skilled/skills/sk-doc/sk-create-skill/changelog/v1.11.2.0.md
- Change: assets/skill/skill-procedure-template.md, references/parent-skill/parent-skills-nested-packets.md and references/skill/examples-and-maintenance.md now describe the sk-design hub with three modes instead of four.
- Then set `version: 1.11.2.0` in .skilled/skills/sk-doc/sk-create-skill/SKILL.md frontmatter.
- Identity phrases: "sk-create-skill v1.11.2.0" and "sk-create-skill 1.11.2.0".
Both entries: date 2026-11-05, spec-folder line `> Spec folder: \`specs/sk-design/021-deprecate-fundamentals\` (Level 2)`.

RULES: plain declarative sentences. No em dash, no semicolon, no Oxford comma. No file inventories or internal ids.
ALLOWED WRITE PATHS: the two new changelog files and the two SKILL.md files (version line only).
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY BEFORE YOU FINISH and paste the output:
  for f in .skilled/skills/sk-design/sk-design-md-generator/changelog/v1.1.12.0.md .skilled/skills/sk-doc/sk-create-skill/changelog/v1.11.2.0.md; do python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $f | tail -1; python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py $f | tail -3; done
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design | tail -1
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc | tail -1
