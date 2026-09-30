TASK: update one existing code-folder README so it is byte-identical to literal text the orchestrator already wrote to sk-doc's rules for that doc type.
Source (read only, do not edit): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/scripts-readme.new.md
Target (replace its content): .skilled/skills/sk-doc/sk-create-goal/scripts/README.md

The source differs from the current target only here (read both first and confirm):
- frontmatter title, description and two trigger phrases; the H1
- section 1: five checks, not four, a lint paragraph and two state bullets
- section 2: four tree lines; section 3: five key-file rows
- section 4: a lint paragraph and flow block; section 5: the corrected --all exit rule and the lint and scorer commands

Step: make the target byte-identical to the source, for example with
  cp specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/scripts-readme.new.md .skilled/skills/sk-doc/sk-create-goal/scripts/README.md
Do not reword, reflow or reformat anything. Do not run any command the document lists. Change no other file.

VERIFY (repo root):
  cmp specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/scripts-readme.new.md .skilled/skills/sk-doc/sk-create-goal/scripts/README.md
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-goal/scripts/README.md
Accept when: 1 file changed and nothing else; cmp prints nothing and exits 0; validate_document exits 0.
