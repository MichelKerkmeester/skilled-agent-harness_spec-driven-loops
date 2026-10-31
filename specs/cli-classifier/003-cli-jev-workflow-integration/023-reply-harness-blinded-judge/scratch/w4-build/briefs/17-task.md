TASK: create one feature-catalog entry whose full text the orchestrator already wrote and validated.
F = .skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md (new; the only file you create)
D = specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/offline-judge-agreement.md (read only; the literal text of F)
Read D in full first. D follows sk-doc's feature-catalog template and matches the other entries in F's folder.

STEP 1. Create F with exactly D's bytes: run `cp D F` from the repo root, then read F back. Do not reformat, reword or add anything.

Accept when: 1 file created (F), no other file changed, `cmp D F` prints nothing, and the validator prints `VALID`.
Checks you run, from the repo root:
- `cmp specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/offline-judge-agreement.md .skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md` (expect no output, exit 0)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md` (expect `VALID`, exit 0)
