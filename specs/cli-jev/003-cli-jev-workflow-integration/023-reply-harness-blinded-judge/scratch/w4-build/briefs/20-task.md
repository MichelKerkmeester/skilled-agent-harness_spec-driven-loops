TASK: add the new offline judge scenario to the skill's manual testing playbook index, from a full copy the orchestrator already wrote and validated.
F = .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md (exists; the only file you change)
D = specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/playbook/manual-testing-playbook.md (read only; the literal new text of F)
Read F and D in full first. D is F with seven edits: a Python 3 note in section 2, the `node --test --test-name-pattern` filter in section 4, `COMM-011` in the wave 4 row of section 6, a `COMM-011` block at the end of section 10, a sentence exception and one row in section 11, and one row in section 12.

STEP 1. Run `shasum -a 256 F`. It must print `0da9968efcff48763d88072f956a418de5ee53cff78eae80c02b33263c54c953`. If it prints anything else, F changed since D was written: change nothing and hand back BLOCKED with the printed hash.
STEP 2. Run `cp D F` from the repo root, then read F back. Do not reformat, reword or add anything.

Accept when: 1 file changed (F), no other file changed, `cmp D F` prints nothing, `git diff --stat -- F` shows 15 insertions and 4 deletions, and the validator exits 0.
Checks you run, from the repo root:
- `cmp specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/playbook/manual-testing-playbook.md .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` (expect no output, exit 0)
- `git diff --stat -- .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` (expect exit 0)
