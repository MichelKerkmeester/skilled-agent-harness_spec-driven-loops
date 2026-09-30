TASK: record the new offline judge measurement in the skill's entry point and move its version to the new release.
F = .skilled/skills/sk-communication/SKILL.md (exists; the only file you edit)
Read F in full first. Apply the two edits exactly, character for character. Every other line stays byte-identical.

EDIT 1. F:5 reads `version: 1.3.0.0`. Change it to `version: 1.4.0.0`.

EDIT 2. In section `## 5. REFERENCES AND RELATED RESOURCES`, under `### Core`, the second bullet starts with "- `.skilled/skills/sk-communication/cli-communication-projection/docs/`" (F:226). Insert this one line directly below it:
```
- `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`: an offline measurement of whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores, calling no model unless `--deem` or `--jev` is set and never feeding the release gate.
```

Accept when: 1 file changed (F), `git diff --stat -- F` shows 2 insertions and 1 deletion, and the validator prints `VALID`.
Checks you run, from the repo root:
- `git diff --stat -- .skilled/skills/sk-communication/SKILL.md`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/SKILL.md` (expect `VALID`, exit 0)
