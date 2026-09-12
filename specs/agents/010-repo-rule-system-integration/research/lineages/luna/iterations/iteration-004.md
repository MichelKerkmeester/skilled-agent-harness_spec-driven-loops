C1. **CONFIRMED.** `REPO RULES.md:15-17` and `AGENTS.md:125` state that every firing trigger loads and that three or four simultaneous triggers are normal.

C2. **CONFIRMED.** `AGENTS.md:121-125` limits Gate 5 to the first write; therefore it imposes no rule-file loading obligation on a read-only turn.

C3. **CONFIRMED.** `AGENTS.md:212-226` contains the table, while `repo-rules/prevent-overengineering.md:100-102` explicitly says it is not repeated there.

C4. **CONFIRMED.** `AGENTS.md:88-97` contains the bands, and `repo-rules/uncertainty-and-honesty.md:46-49` identifies that table as the sole copy.

C5. **CONFIRMED.** `repo-rules/` contains 11 files; `REPO RULES.md:40-50` has 11 trigger rows, and `REPO RULES.md:58-68` has 11 index rows.

C6. **CONFIRMED.** Comparing the trigger blocks beginning at line 4 in the 11 rule files found 194 phrases and zero duplicates; see `repo-rules/prevent-overengineering.md:4` and `repo-rules/uncertainty-and-honesty.md:4`.

C7. **CONFIRMED.** `AGENTS.md` is 501 lines, and `CLAUDE.md` is a symlink targeting `AGENTS.md` (`AGENTS.md:1`).

Judgement: Yes. The skill-advisor implementation details at `AGENTS.md:100-106` and the skill-owned workflow tiebreakers at `AGENTS.md:117-119` are candidates for compact pointers rather than full prose in an every-turn document.