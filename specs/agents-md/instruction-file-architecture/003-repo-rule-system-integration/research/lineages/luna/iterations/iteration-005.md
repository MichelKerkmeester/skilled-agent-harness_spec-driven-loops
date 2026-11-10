C1. CONFIRMED. `REPO RULES.md:15-17` and `AGENTS.md:125` state that every firing trigger loads and that three or four simultaneous triggers are normal.

C2. CONFIRMED. `AGENTS.md:122` limits Gate 5 to the first write and excludes read-only turns; consequently, no rule file loads on a read-only turn (`AGENTS.md:240`).

C3. CONFIRMED. `AGENTS.md:212-220` carries the Restraint Signals table, while `repo-rules/prevent-overengineering.md:100-102` explicitly says it is not repeated there.

C4. CONFIRMED. `AGENTS.md:88-97` contains the bands, and `repo-rules/uncertainty-and-honesty.md:46-49` explicitly says there is exactly one copy.

C5. CONFIRMED. `repo-rules/` contains 11 files; section 2 has 11 trigger rows from `REPO RULES.md:40` through `:50`, and section 3 has 11 index rows from `REPO RULES.md:58` through `:68`.

C6. CONFIRMED. A case-folded scan of all 11 frontmatter blocks found no duplicate trigger phrase; the blocks begin at `repo-rules/blast-radius.md:4` and `repo-rules/uncertainty-and-honesty.md:4`.

C7. CONFIRMED. `AGENTS.md` has 502 numbered lines (`AGENTS.md:502`), and filesystem metadata shows `CLAUDE.md -> AGENTS.md`.

JUDGEMENT. Yes. Candidates are the specialized advisor-metadata detail at `AGENTS.md:112`, deep-loop/CLI tiebreakers at `AGENTS.md:117-119`, and the tool-response self-check at `AGENTS.md:300-307`.