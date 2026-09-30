TASK: one literal text replacement in one README table row, so the doc matches the code: a model arm whose gate passes refuses to call without `--out`.
File: .skilled/skills/system-skill-advisor/README.md. Read it first.

Line 229 is the "Offline tie-break eval" table row. Inside it, replace exactly this text:
and each switch runs its model arm only when that backend's own checks pass |
with exactly:
and each switch runs its model arm only when that backend's own checks pass. An arm that will call needs `--out <dir>` for its call records, and exits 2 without it |

Keep every other character of line 229 and of the file unchanged, including the row's leading `|`, its first cell and its table structure.

VERIFY (repo root):
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-skill-advisor/README.md
  grep -c "An arm that will call needs \`--out <dir>\` for its call records, and exits 2 without it |" .skilled/skills/system-skill-advisor/README.md
Accept when: 1 file changed and nothing else; validate_document exits 0; the grep prints 1.

