TASK: fix nine documentation findings from an alignment review. Each one is a stale description left behind when the sk-design-fundamentals mode was retired and its screen-value guidance (values, hierarchy and review, motion and interaction, tokens.css) moved into sk-code's frontend surface `sk-code-frontend`.
READ FIRST: specs/sk-design/021-deprecate-fundamentals/004-review-remediation/scratch/alignment-doc-findings.json. Each finding names its file, line, issue and evidence. Then read each named file before you edit it.

FIX EACH FINDING:
- B-01 and B-03 (sk-design-md-generator SKILL.md and its procedure-card inventory): value decisions and brief-only authoring now go to `sk-code-frontend` (via the sk-code hub), not to an sk-design authoring mode. sk-design has three modes: md-generator, chart, diagram.
- B-02 (.skilled/skills/sk-code/ROUTER.md section 4 Frontend Map): add prose rows for the intents WEB_VISUAL_VALUES, WEB_VISUAL_HIERARCHY and WEB_MOTION so the map matches the file's own RESOURCE_MAP, in the style of the existing rows.
- B-04 (.skilled/skills/sk-code/README.md, lines near 60 and 122): describe the frontend surface with visual values, visual hierarchy and review, motion and interaction, and the `tokens.css` starter tokens, matching sk-code SKILL.md line 44.
- B-05 (.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md, the @design row): the design agent decides values and behaviour through the sk-code-frontend visual references and measures surfaces with sk-design-md-generator.
- C-1 and C-2 (.skilled/skills/sk-code/sk-code-frontend/README.md lines 70 and 83): the playbook now has three scenarios, including the visual-values scenario. Say so.
- D-05 (.skilled/agents/README.txt line 25): match what .skilled/agents/design.md now says about the decide path.
- D-06 (.skilled/agents/design.md, the decide path near line 95): add one sentence that, when it applies sk-code-frontend guidance on its own, it hands the author gates to `sk-code-quality` before claiming completion, as sk-code-frontend/SKILL.md line 21 requires. Make the same edit in .claude/agents/design.md.

RULES: change only the stale sentences. Plain declarative sentences. No em dash, no semicolon, no Oxford comma. Never mention research sources or spec paths.
ALLOWED WRITE PATHS: the files named above.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY BEFORE YOU FINISH and paste the output:
  for f in .skilled/skills/sk-design/sk-design-md-generator/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/sk-code-frontend/README.md .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md .skilled/agents/design.md; do python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $f | tail -1; done
  bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh | tail -2
