TASK: create one manual testing playbook scenario whose full text the orchestrator already wrote and validated.
F = .skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md (new; the only file you create)
D = specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/offline-judge-census-stops-at-label-gate.md (read only; the literal text of F)
Read D in full first. D follows sk-doc's playbook scenario template and matches the other scenarios in F's folder.

STEP 1. Create F with exactly D's bytes: run `cp D F` from the repo root, then read F back. Do not reformat, reword or add anything.

Accept when: 1 file created (F), no other file changed, `cmp D F` prints nothing, and the validator prints `VALID`.
Checks you run, from the repo root:
- `cmp specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/offline-judge-census-stops-at-label-gate.md .skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` (expect no output, exit 0)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` (expect `VALID`, exit 0)
