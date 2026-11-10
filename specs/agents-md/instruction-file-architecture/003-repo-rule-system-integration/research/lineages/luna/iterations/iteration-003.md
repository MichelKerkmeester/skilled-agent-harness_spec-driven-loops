C1. CONFIRMED — `REPO RULES.md:15-17` and `AGENTS.md:125` state that every firing trigger loads and three or four simultaneous triggers are normal.

C2. CONFIRMED — `AGENTS.md:121-122` limits Gate 5 to the first write and excludes read-only turns, so it does not load a repo-rules file on a read-only turn.

C3. CONFIRMED — `AGENTS.md:212-226` contains the Restraint Signals table; `repo-rules/prevent-overengineering.md:100-107` explicitly says it is not repeated and lists only two additional signals.

C4. CONFIRMED — `AGENTS.md:88-97` contains the bands, while `repo-rules/uncertainty-and-honesty.md:46-49` calls it the single scale and says there is no second copy.

C5. CONFIRMED — The directory contains 11 direct rule files, matching the 11 index entries at `REPO RULES.md:58-68`; its trigger rows are exactly the 11 rows at `REPO RULES.md:40-50`.

C6. CONFIRMED — The inspected trigger blocks contain no cross-file duplicate: `repo-rules/prevent-overengineering.md:4-24`, `scope-discipline.md:4-22`, `evidence-and-proof.md:4-21`, `delegation-and-orchestration.md:4-24`, `blast-radius.md:4-20`, `root-cause-and-debugging.md:4-21`, `uncertainty-and-honesty.md:4-20`, `communication.md:4-21`, `presenting-decisions.md:4-22`, `handoff-and-questions.md:4-22`, and `skill-hub-routing.md:4-21`.

C7. CONFIRMED — `AGENTS.md` ends at line 501, and filesystem metadata identifies `CLAUDE.md` as a symlink to `AGENTS.md` (`CLAUDE.md:1`).

Judgement: Yes. Candidates for conditional loading are `AGENTS.md:116-119` (deep-loop tiebreakers), `AGENTS.md:159-167` (action-specific blast-radius detail), and `AGENTS.md:487-494` (dispatch-only rules). The Restraint Signals and Confidence Thresholds are not candidates because the inspected rule files explicitly designate them as the single copies.