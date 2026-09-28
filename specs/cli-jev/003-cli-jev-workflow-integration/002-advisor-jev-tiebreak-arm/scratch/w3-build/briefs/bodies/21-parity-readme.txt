TASK: add the new eval test file to the parity tests README. Two literal edits in one file.
File: .skilled/skills/system-skill-advisor/runtime/tests/parity/README.md. Read it first.

Edit 1, lines 31-32 (inside the ```text tree block). Old:
+-- python-ts-parity.vitest.ts  # Python to TypeScript scorer parity gates
`-- README.md
New:
+-- python-ts-parity.vitest.ts  # Python to TypeScript scorer parity gates
+-- score-jev-tiebreak.vitest.ts  # Offline tie-break eval checks with stub binaries and a fake Deem server
`-- README.md

Edit 2, line 41. Old:
| `python-ts-parity.vitest.ts` | Runs corpus parity checks, holdout accuracy checks and lexical ablation assertions. |
New:
| `python-ts-parity.vitest.ts` | Runs corpus parity checks, holdout accuracy checks and lexical ablation assertions. |
| `score-jev-tiebreak.vitest.ts` | Pins the tie-break eval's census, keep rule, gates, exit handling, calibration and report with stub `jev` and `cli-deem` binaries and a fake Deem server. It makes no model call. |

Nothing else in the file changes.

VERIFY (repo root):
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
  grep -c "score-jev-tiebreak.vitest.ts" .skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
Accept when: 1 file changed and nothing else; validate_document exits 0; the grep prints 2.

