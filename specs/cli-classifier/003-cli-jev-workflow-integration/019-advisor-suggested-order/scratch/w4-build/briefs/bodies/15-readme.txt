TASK: add one verification row for the new script to the skill README. One literal insert in one file.
F = .skilled/skills/system-skill-advisor/README.md. Read lines 220-232 first.

Directly after line 229, the table row that starts with `| Offline tie-break eval |`, insert this one new line:
| Offline suggested-order eval | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` prints the same census with holdout top-1 at 53/70, then times the advisor alone inside a child like the prompt hook's and prints a no-headroom stop or the planned calls. It makes no model call unless `--jev` or `--deem` is passed, each switch needs `--out <dir>` and exits 2 without it, and each arm runs only when that backend's own checks pass |

VERIFY (repo root):
  grep -c "^| Offline suggested-order eval |" .skilled/skills/system-skill-advisor/README.md
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-skill-advisor/README.md | tail -3
Accept when: only F changed (+1 line); grep prints 1; the validator exits 0.
