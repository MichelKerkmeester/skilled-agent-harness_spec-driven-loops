C1. CONFIRMED — `REPO RULES.md:15-17` and `AGENTS.md:121-125` explicitly state that every firing trigger loads and that three or four firing together is normal.

C2. CONFIRMED — `AGENTS.md:121-122` says Gate 5 triggers on the first write and never on read-only turns. Consequently, no rule file loads on a read-only turn (`AGENTS.md:240`).

C3. CONFIRMED — `AGENTS.md:212-226` contains the table; `repo-rules/prevent-overengineering.md:100-108` explicitly says it is not repeated.

C4. CONFIRMED — `AGENTS.md:88-97` contains the bands; `repo-rules/uncertainty-and-honesty.md:46-49` says there is exactly one copy.

C5. CONFIRMED — `repo-rules/` contains 11 files; `REPO RULES.md:40-50` has 11 trigger rows and `REPO RULES.md:58-68` has 11 index rows.

C6. CONFIRMED — The complete frontmatter blocks beginning at `repo-rules/*.md:4` contain no repeated trigger phrase across files.

C7. CONFIRMED — `AGENTS.md` is 501 lines, and filesystem metadata shows `CLAUDE.md -> AGENTS.md`.

Judgement: Yes. Candidates are the specialized Gate 4 tiebreakers (`AGENTS.md:116-119`) and advisor-metadata routing detail (`AGENTS.md:112-114`); both are conditional workflow material rather than universal guidance.