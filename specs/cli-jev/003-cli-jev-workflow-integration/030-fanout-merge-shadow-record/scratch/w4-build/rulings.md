# Orchestrator rulings on design.md section 6 (2026-09-29)

1. Every section 6 answer is accepted as proposed, including `reader=none named` on every verdict line while no reader of a shadow record is named.
2. Phases 027, 028 and 029 share `runtime/changelog/`, the runtime catalog and the runtime playbook, and build before this phase. Each doc step re-reads the folder and the indexes at doc time and takes the next version and the next IDs present then. Index counts are read at doc time, never taken from this design.
3. Step D7 (the version pass) runs only if `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` reports `13b-version` after D1 to D6. The release note lives in `runtime/changelog/`, not the hub's `changelog/`, so the hub `SKILL.md` version stays as it is, as phase 029's design also rules.
4. The code steps C1 to C9 run on DeepSeek V4.1 Flash through Pi on Cline (parent D5), not Devin.
5. Gate order (parent D1, "Jev first, else Deem"): with both switches, the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and regardless of the other's outcome. A failed gate prints its skip line and never runs the other backend in its place.
6. Docs name only what the code prints. A `verdict` line is claimed nowhere unless a run printed it.
7. Tests run on a machine whose global git config sets `core.hooksPath`, and its commit-msg hook rejects a commit without a body. Every test that creates a git repository passes `-c core.hooksPath=/dev/null` (beside `-c commit.gpgsign=false`) to each `git commit` it runs, as `cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` line 48 does. Test code and the scripts never run the machine's hooks.
