# Orchestrator rulings on design.md section 6 (2026-09-29)

1. Every section 6 answer is accepted as proposed, except the changelog version.
2. Changelog version: phase 022 creates `system-spec-kit/changelog/v4.4.0.0.md` and bumps `SKILL.md` to `version: 4.4.0.0`, and this build starts after 022's commit. So this phase writes `changelog/v4.5.0.0.md` and bumps `SKILL.md` `version:` from 4.4.0.0 to 4.5.0.0 in the same doc step as its SKILL.md sentence. Playbook ID 462, after 022's 461.
3. SKILL.md placement: a Quick Reference Commands row directly after the `Alignment suggestion measurement` row that 022 adds (itself after `Compaction recall census`).
4. Gate order (parent D1, "Jev first, else Deem"): with both switches, the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and regardless of the other's outcome. A failed gate prints its skip line and never runs the other backend in its place.
5. Docs name only what the code prints. A `verdict` line is claimed nowhere unless a run printed it.
6. Tests run on a machine whose global git config sets `core.hooksPath`, and its commit-msg hook rejects a commit without a body. Every test that creates a git repository passes `-c core.hooksPath=/dev/null` (beside `-c commit.gpgsign=false`) to each `git commit` it runs, as `cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` line 48 does. Test code and the scripts never run the machine's hooks.
