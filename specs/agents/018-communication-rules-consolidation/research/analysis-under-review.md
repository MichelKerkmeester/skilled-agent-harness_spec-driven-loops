# Analysis under review: the communication repo rules

Files: .skilled/repo-rules/communication.md, communication-prose.md, communication-decisions.md, communication-handoff.md, answer-the-actual-request.md. Loaded by AGENTS.md Gate 6 (communication + prose before every reply; decisions, handoff, answer-the-actual-request conditionally). The two-register material lives in .skilled/repo-rules/uncertainty-and-honesty.md section 6.

## Headline
Delivery, not wording, is the weak point. measure-rule-compliance.py over 34 Claude Code sessions (2026-09-23..10-07): in 86.8% of compaction windows the first substantive reply came with neither file read (communication.md missing 85.5%, communication-prose.md 87.8%). Semicolons appear in 36.8% of replies after delivery, rising from 12% (replies 1-3) to 47.5% (reply 31+); unknown whether the detector excludes code. Tables 12.9%. Em dash ~1%, empty opener 0%, label first line ~2%. Codex loads far more reliably (14 sessions, small sample).
Proposal: ship a ~1 KB always-delivered reply card (UserPromptSubmit hook injection, or AGENTS.md section 4 "Reply Rules and Mandates") before restructuring.

## Merge proposals (five files to three)
1. "Lead with the answer" is said three times: communication.md s5 (first line), s9 (outcome in two lines), communication-decisions.md s1 (verdict first). Make it one section.
2. communication-handoff.md fires on every turn end, so effectively every reply. Move its core (name the operator's action, show the work, what is still running) into communication.md and its question-asking parts (s4, s5) into communication-decisions.md. Dissolve the file.
3. communication-prose.md s1 "atomic paragraphs stand alone" and communication.md s6 "each paragraph carries the reader forward" pull opposite ways from two files. Put them in one place.
4. The working/boundary registers live in uncertainty-and-honesty.md s6, an honesty rule. Move them into communication.md, keep "qualify only when it changes what the reader does" in the honesty rule.
5. Vague warnings are covered twice: communication.md s3 and answer-the-actual-request.md s1.

## Conflicts and rule changes
1. communication-decisions.md s3 ASK step (restate the request) conflicts with communication.md s3 "restated summaries" filler and s5 first-line payload. Drop the ASK step, keep "triage the reader".
2. communication-decisions.md s4 requires a concrete time estimate before every long stretch; conflicts in spirit with answer-the-actual-request.md s5 and AI estimates are unreliable. Make it on request only.
3. communication.md s4 plain re-render procedure is long and rarely used but loads every reply. Move to the sk-create-with-human-voice skill, leave a two-line pointer.
4. communication-handoff.md s5 runtime question-tool table is routing detail (repo-rule scope test excludes routing). Move to CLI orchestration docs.
5. communication-handoff.md s6 allows a table for in-flight work, against the no-table rule and the operator's preference. Use a list.
6. answer-the-actual-request.md contains two em dashes, which communication-prose.md s3 bans.

## Changelog-style insights to add (from .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md sections 3-4)
- Choose content by reader impact before writing; drop how the work was done unless it changes trust.
- Name an identifier only where the reader acts on it.
- One job per section, each fact said once.
- No metrics soup; a usual length beside each ceiling.
Tension: evidence-and-proof.md and handoff s1 require receipts (command + exit status). Resolution proposed: outcome first, receipts in one compact block at the end.

## answer-the-actual-request: join the communication family?
By load mechanism it already belongs (Gate 6 loads it). By content it is split: s1-s2 reply shape, s3/s4/s6 honesty. Proposal: rename to communication-request.md, merge s1 into communication.md, keep the rest. The shorter name saves bytes in the AGENTS.md Gate 6 line, which sits in Devin's 16 KB prefix (11 bytes of margin today, enforced by check-rule-copies.js).
