# Orchestrator rulings on design.md section 6 (2026-09-29)

1. Question 3 is NOT accepted as proposed. Parent D1 ("Jev first, else Deem") outranks the phase spec. With both switches, the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and regardless of the other's outcome. A failed gate prints its skip line and never runs the other backend in its place.
2. Questions 1, 2 and 4 to 7 are accepted as proposed.
3. Question 8: phases 021 and 032 change the sk-doc catalog index and build first, so every version and ID (changelog, catalog entry, catalog index, playbook ID, playbook index) is re-read at doc time and never taken from this design.
4. Step 19's draw is the session's: `--draw --seed 20260929` on the real tree, committed with the build. No model writes a label (parent D4), so the phase closes at its label-gate stop.
5. The code steps run on DeepSeek V4.1 Flash through Pi on Cline (parent D5), not Devin. The checks for Python files are `python3 -m py_compile`, never `node --check`.
6. Docs name only what the code prints. A `verdict` line is claimed nowhere unless a run printed it.
7. Tests run on a machine whose global git config sets `core.hooksPath`, and its commit-msg hook rejects a commit without a body. Every test that creates a git repository passes `-c core.hooksPath=/dev/null` (beside `-c commit.gpgsign=false`) to each `git commit` it runs, as `cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` line 48 does. Test code and the scripts never run the machine's hooks.
