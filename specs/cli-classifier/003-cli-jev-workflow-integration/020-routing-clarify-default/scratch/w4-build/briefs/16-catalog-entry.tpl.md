@@PREAMBLE_MD@@

TASK: create the sk-doc hub feature catalog entry for the clarify census script. The orchestrator already wrote the full text to sk-doc's template for this document type and checked it with `validate_document.py` and the HVR scanner. Place it byte for byte.

FILE (create): .skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md

STEP 1. Read the source file `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/clarify-default-measurement.md` in full.
STEP 2. Run `cp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/clarify-default-measurement.md .skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md`. Do not retype or reformat the text.
STEP 3. Run `cmp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/clarify-default-measurement.md .skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` and confirm it prints nothing and exits 0.

Accept when: 1 file changed (.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md), `cmp` exits 0 and the checks below pass.

@@TAIL@@

Checks to run: `cmp specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/drafts/clarify-default-measurement.md .skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` (exit 0), and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
