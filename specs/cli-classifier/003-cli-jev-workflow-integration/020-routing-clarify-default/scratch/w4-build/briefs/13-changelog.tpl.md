@@PREAMBLE_MD@@

TASK: create the create-skill changelog entry for the new clarify census script. The orchestrator already wrote the full text to sk-doc's template for this document type and checked it with `validate_document.py` and the HVR scanner. Place it byte for byte.

FILE (create): .skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md

STEP 1. Read the source file `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/v1.4.0.0.md` in full.
STEP 2. Run `cp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/v1.4.0.0.md .skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md`. Do not retype or reformat the text.
STEP 3. Run `cmp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/v1.4.0.0.md .skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md` and confirm it prints nothing and exits 0.

Accept when: 1 file changed (.skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md), `cmp` exits 0 and the checks below pass.

@@TAIL@@

Checks to run: `cmp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/v1.4.0.0.md .skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md` (exit 0), and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
