TASK: name the new offline judge script in the skill's human-facing README.
F = .skilled/skills/sk-communication/README.md (exists; the only file you edit)
Read F in full first. Apply the one edit exactly, character for character. Every other line stays byte-identical.

EDIT 1. In section `## 5. PACKAGE MAP AND DEEPER DOCS`, the last bullet starts with "- `.skilled/skills/sk-communication/cli-communication-projection/docs/`" (F:74). Insert this one line directly below it:
```
- `benchmark/reply-harness/judge-agreement.mjs`: measures offline whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores. It calls no model by default, and `--deem` or `--jev` each need their own passing check and `--out <dir>`.
```

Accept when: 1 file changed (F), `git diff --stat -- F` shows 1 insertion and 0 deletions, and the validator exits 0.
Checks you run, from the repo root:
- `git diff --stat -- .skilled/skills/sk-communication/README.md`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/README.md` (expect exit 0; its one existing warning about section numbering stays)
