TASK: write two new changelog entries with version bumps, and extend one unpublished entry.
READ FIRST: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md sections 5, 7, 8 and 9 and its assets/changelog-template.md (compact shape). Then specs/sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing/scratch/facts.md, the only evidence source. Read the newest entry in each folder for shape.
1. New .skilled/skills/system-skill-advisor/changelog/v0.18.3.0.md: a negated write ("don't write anything back") no longer pulls a prompt toward sk-doc, and routing accuracy rose (full corpus 157, holdout 50, ambiguity slice 20). Set `version: 0.18.3.0` in .skilled/skills/system-skill-advisor/SKILL.md, and in any JSON file in that skill root that carries "0.18.2.0" as its own version.
2. New .skilled/skills/sk-doc/changelog/v2.4.2.0.md: a request to review a design document for clarity now reaches the doc quality mode. Set "2.4.2.0" in .skilled/skills/sk-doc/SKILL.md, description.json, hub-router.json and mode-registry.json wherever they carry the hub's own "2.4.1.0".
3. Extend .skilled/skills/sk-design/changelog/v3.0.0.0.md (unpublished, edit in place): add one glance bullet that a request to review the chart colour system reaches the chart mode.
Identity phrases: "<name> v<version>" and "<name> <version>". Date 2026-11-05. Spec-folder line `> Spec folder: \`specs/sk-design/021-deprecate-fundamentals\` (Level 2)`.
RULES: plain declarative sentences. No em dash, no semicolon, no Oxford comma. No test counts beyond the accuracy numbers, no internal ids.
ALLOWED WRITE PATHS: the three changelog files and the version lines named above.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY and paste the output:
  for f in .skilled/skills/system-skill-advisor/changelog/v0.18.3.0.md .skilled/skills/sk-doc/changelog/v2.4.2.0.md .skilled/skills/sk-design/changelog/v3.0.0.0.md; do python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $f | tail -1; python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py $f | grep "hard blockers"; done
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc | tail -1
  grep -rn "0.18.2.0\|\"2.4.1.0\"" .skilled/skills/system-skill-advisor/SKILL.md .skilled/skills/sk-doc/SKILL.md .skilled/skills/sk-doc/*.json
