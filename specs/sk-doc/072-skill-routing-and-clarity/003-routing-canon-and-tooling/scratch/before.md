# Before: phase 003 gates and suites before any edit

Recorded 2026-10-28 on `fca978fd29`, before the first edit of this phase.

## Gate set

The full gate set, run through `.scratch-dc90/072-003/gates.sh`, is in `baseline.md` in this folder: every gate exits 0. That table is the "before" column for the gate rerun in `after.md`.

## Suites this phase touches, outside the gate set

| Suite | Command | Exit | Result |
|---|---|---|---|
| sk-doc Python tests | `/usr/bin/python3 -m pytest -q -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/` | 0 | `247 passed, 1 warning` |
| parent-skill-check tests | `node --test` over the four `parent-skill-check-*.test.cjs` files | 0 | `tests 112, pass 112, fail 0` |
| sk-create-skill node tests | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` | 1 | `tests 71, pass 70, fail 1` |
| package_skill --strict, every mode packet | one run per packet named by a hub `mode-registry.json` | - | 41 PASS, 1 FAIL |

Two failures predate this phase:

1. **`create-journey-proof.test.cjs` fails.** A fresh `/create:skill-parent` scaffold fails `parent-skill-check` check 3j: `hub SKILL.md grants tool(s) no mode declares: ["[Read, Glob]"]`. The hub scaffold writes `allowed-tools: "{{ALLOWED_TOOLS}}"`, and the quotes turn the tool list into one string. Reproduced by hand with both `python3` and `/usr/bin/python3` in `.scratch-dc90/072-003/repro/`. This blocks AC-004 ("parent-skill-check.cjs passes for the parent"), so this phase fixes it at the scaffold.
2. **`sk-code/sk-code-review` fails `package_skill --strict`** with `SKILL.md exceeds word limit (5676 words, max: 5000)`. It is not in the gate set, which runs only the 14 roots. Its size is phase 005's work; this phase leaves it alone.

Logs: `.scratch-dc90/072-003/before-extra/`.
