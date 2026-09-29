@@PREAMBLE_MD@@

TASK: update the create-skill playbook index for scenario SKL-007: version, overview counts, the PARENT HUB range, the SKL-007 block, one automated-test row and one index row. The edited file is prepared as a whole so the index stays consistent. The orchestrator already wrote the full text to sk-doc's template for this document type and checked it with `validate_document.py` and the HVR scanner. Place it byte for byte.

FILE (overwrite): .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md

STEP 1. Read the source file `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/playbook-index.after.md` in full.
STEP 2. Run `cp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/playbook-index.after.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md`. Do not retype or reformat the text.
STEP 3. Run `cmp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/playbook-index.after.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` and confirm it prints nothing and exits 0.
STEP 4. Run `git diff --stat -- .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` and report its line.

Accept when: 1 file changed (.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md), `cmp` exits 0 and the checks below pass.

@@TAIL@@

Checks to run: `cmp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/playbook-index.after.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` (exit 0), and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md --type playbook` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
