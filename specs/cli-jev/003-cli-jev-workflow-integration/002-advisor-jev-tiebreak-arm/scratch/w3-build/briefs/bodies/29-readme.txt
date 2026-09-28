TASK: name the offline tie-break eval in the skill README's verification table. One literal edit in one file.
File: .skilled/skills/system-skill-advisor/README.md. Read it first.

In section 8 VERIFICATION, the last table row is (old):
| Validation battery | `node .skilled/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true}' --format json` reports within the dated bounded-delta gate in [`validation-baselines.md`](./references/scoring/validation-baselines.md) |
New (keep that row unchanged and add one row directly after it):
| Validation battery | `node .skilled/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true}' --format json` reports within the dated bounded-delta gate in [`validation-baselines.md`](./references/scoring/validation-baselines.md) |
| Offline tie-break eval | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` prints a zero-call census of the near-tie cluster with holdout top-1 at 53/70. It stays dormant unless `--jev` or `--deem` is passed, and each switch runs its model arm only when that backend's own checks pass |

Nothing else in the file changes, including its frontmatter.

VERIFY (repo root):
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-skill-advisor/README.md
  grep -c "score-jev-tiebreak.mjs" .skilled/skills/system-skill-advisor/README.md
Accept when: 1 file changed and nothing else; validate_document exits 0; the grep prints 1.

