C1. CONFIRMED. `REPO RULES.md:15-17` and `AGENTS.md:125` both state that every firing trigger loads, with three or four simultaneous triggers described as normal.

C2. CONFIRMED. `AGENTS.md:121-122` limits Gate 5 to the first write and excludes read-only turns; therefore it imposes no rule-file loading obligation on a read-only turn.

C3. CONFIRMED. `AGENTS.md:212-220` contains the Restraint Signals table, while `repo-rules/prevent-overengineering.md:100-102` explicitly says it binds and is not repeated.

C4. CONFIRMED. `AGENTS.md:88-97` contains the bands, and `repo-rules/uncertainty-and-honesty.md:46-49` identifies that table as the sole copy.

C5. CONFIRMED. The scoped `repo-rules/` listing contains 11 files; `REPO RULES.md:40-50` has 11 trigger rows and `REPO RULES.md:58-68` has 11 index rows.

C6. CONFIRMED. Exact comparison of the `trigger_phrases` blocks, including `repo-rules/prevent-overengineering.md:4-24` and `repo-rules/uncertainty-and-honesty.md:4-20`, found no phrase shared by two different files.

C7. CONFIRMED. `AGENTS.md` is 501 lines, and filesystem metadata for `CLAUDE.md` shows `-> AGENTS.md`, making it a symlink rather than a separate copy.

JUDGEMENT. Yes. `AGENTS.md:112-114` contains specialized advisor-metadata and hub-routing detail; `AGENTS.md:116-119` contains specialized deep-loop/CLI tie-breakers; and `AGENTS.md:123-129` repeats detailed Gate 5 mechanics already covered in `REPO RULES.md:10-18` and `29-32`.