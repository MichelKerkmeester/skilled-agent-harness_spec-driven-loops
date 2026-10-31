# Orchestrator rulings on design.md section 6 (2026-09-29)

1. Questions 1 to 6 are accepted as proposed.
2. Question 7 and step `d4`: phase 027 writes `runtime/changelog/v1.6.0.0.md` for its new script, and its doc steps run before this phase's. This phase's changelog is the next minor version after the newest file in `runtime/changelog/` at doc time (a new script, as 027 bumped), never `v1.5.0.2`. Catalog and playbook IDs and entry versions are read at doc time after 027's doc commit.
3. Step `d1`: the hub `SKILL.md` `version:` and the hub changelog stay unchanged, as in 027.
4. Column order (parent D1, "Jev first, else Deem"): where both model columns print, the `jev` column and its verdict print before the `deem` column. The script makes no model call in any column.
5. Docs name only what the code prints. A `verdict` line is claimed in a doc only for a column a run printed it for; the real run on 027's report stops at `stop: rater report has no confirmed gold`, the accepted end state.
6. Tests that create a git repository pass `-c core.hooksPath=/dev/null` and `-c commit.gpgsign=false` to each `git commit`. No test asserts a count read from the real repository.
