# Orchestrator rulings on design.md section 6 (2026-09-29)

1. Every section 6 answer is accepted as proposed, including `changelog/v1.19.0.0.md` and `SKILL.md` `version: 1.19.0.0` (the next after 024's v1.18.0.0), scenario `MB-052` and the `lib/README.md` clause amendment.
2. Gate order (parent D1, "Jev first, else Deem"): with both switches, the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and regardless of the other's outcome. A failed gate prints its skip line and never runs the other backend in its place.
3. Docs name only what the code prints. A `verdict` line is claimed nowhere unless a run printed it.
4. Tests run on a machine whose global git config sets `core.hooksPath`, and its commit-msg hook rejects a commit without a body. Every test that creates a git repository passes `-c core.hooksPath=/dev/null` (beside `-c commit.gpgsign=false`) to each `git commit` it runs, as `cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` line 48 does. Test code and the scripts never run the machine's hooks.
