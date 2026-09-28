TASK: update one existing skill README so it is byte-identical to literal text the orchestrator already wrote to sk-doc's rules for that doc type.
Source (read only, do not edit): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/readme.new.md
Target (replace its content): .skilled/skills/sk-doc/sk-create-goal/README.md

The source differs from the current target only here (read both first and confirm):
- section 6: a new "### The Advisory Criteria Lint" subsection after the checker paragraph
- section 8: "eight" becomes "nine" and one table row for lint-goal-criteria.md
- section 9: the tests row reads pass 40, a new Criteria lint row, scenarios=9
- section 10: the scripts/README.md and playbook rows

Step: make the target byte-identical to the source, for example with
  cp specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/readme.new.md .skilled/skills/sk-doc/sk-create-goal/README.md
Do not reword, reflow or reformat anything. Do not run any command the document lists. Change no other file.

VERIFY (repo root):
  cmp specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/content/readme.new.md .skilled/skills/sk-doc/sk-create-goal/README.md
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-goal/README.md
Accept when: 1 file changed and nothing else; cmp prints nothing and exits 0; validate_document exits 0.
