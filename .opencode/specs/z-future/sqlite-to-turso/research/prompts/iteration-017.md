You are one read-only research seat executing iteration 17 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6.

THIS ITERATION FOCUS: W6 closure: final per-gap verdict table and remaining checkboxes

This is the FINAL working iteration before synthesis. Produce the authoritative per-item verdict table that the synthesis will lift verbatim.

Questions (answer ALL):
- Q1: For each of the 16 gaps in research/"003 - gaps-and-workarounds-sqlite-to-turso.md", give ONE final verdict row: gap number + name | baseline severity | v0.7.0-pre.6 verdict (UNCHANGED|CHANGED-better|CHANGED-worse|REFUTED) | one-line evidence (with [SOURCE] or iteration reference) | revised workaround/severity. Use iterations 1-15 evidence (read research/iterations/*.md summaries as needed — especially 013-015 adversarial corrections: ATTACH experimental-gated incl. JS-SDK absence; wal_checkpoint(TRUNCATE) and synchronous=NORMAL both work; changes() reliable except triggers; window functions row_number-only).
- Q2: Verdicts for the non-gap baseline items: paths A/B/C re-score (iteration 7: A demoted, C-prime winner — adjust for the iteration-13 ATTACH discovery), P0-P4 ladder, and the three baseline open-question sets (001 §open questions, 002 §open questions, 003 §open questions) — answer or carry each with one line.
- Q3: List any strategy key-questions (C1a-C8a) that remain genuinely unresolved after iterations 1-16, each with: what is known, what is missing, and the concrete next action. Known carried items: gap 15 web status (HOST verified OPEN via research/host-web-evidence.md — incorporate it), post-vendor releases (HOST verified: vendored pre.6 IS latest).
- Q4: Confidence statement per cluster C1-C8 (high/medium/low + dominant evidence type: vendored-source / web / inference).

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/; prior iteration files in .opencode/specs/z_future/sqlite-to-turso/research/iterations/; host web evidence at .opencode/specs/z_future/sqlite-to-turso/research/host-web-evidence.md; the three skills under .opencode/skills/*/mcp_server/lib. No web access in your sandbox. Cite [SOURCE: path:line].

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 17: W6 closure: final per-gap verdict table and remaining checkboxes
## Focus
(one paragraph)
## Findings
(one bullet per finding/verdict-row; EACH starts with NEW|PARTIAL|KNOWN; tables allowed inside the section after the bullets)
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)

