# Review: Claude Opus 5.5, xhigh effort (read-only subagent)

Verdict: most of the merge direction is sound, but the headline diagnosis is wrong for semicolons, and one of the two proposed homes for the reply card breaks Devin's 16 KB prefix.

P0
1. The headline "delivery, not wording" is wrong for semicolons. Claude rates are 40.4% before delivery, 36.8% after and 38.7% never. Codex loads more reliably but keeps semicolons in most replies. The rule version moves the rate more than delivery: 19.9% to 61.9% after the prose edit that added the terse-register paragraph, then 32.6%. Fix: restate the headline, add "join with a full stop, never a semicolon" beside that paragraph and rerun the by-version split. That this line caused the rise is inference.
2. AGENTS.md section 4 cannot hold a 1 KB card: Blast-Radius ends at byte 16,373 of 16,384. Better mechanisms: the post-compaction session prime, which delivers once per window, or AGENTS.md section 8, which sits after the prefix, though moving content back there needs the operator's yes.

P1
3. The measure cannot judge a card as written: a window counts as a miss when either file is missing, an injected rule counts only if its H1 appears, and the replies-since-delivery counter does not reset at compaction. Code blocks are already excluded.
4. Moving handoff section 5 reverses a recorded operator override (REPO RULES.md, the ask-surface carve-out).
5. Dissolving handoff loses its load path, since Gate 6 loads decisions only before a recommendation. Fold the whole file or leave it.
6. "Receipts at the end" conflicts with handoff's "before any interpretation". Order: outcome, receipts, handback last, and amend handoff.

P2
7. communication.md "restated summaries" bans repeating your own words, not restating the request. Keep a paraphrase for ambiguous requests only, after the first line.
8. The estimate rule is already reconciled in answer-the-actual-request.md section 7.
9. The paragraph rules are layered on purpose. The real tension is "every sentence opens with a connective" against "vary the rhythm".
10. Missed duplicates: lead-with-the-verdict also in uncertainty-and-honesty.md, communication.md sections 5 and 9 disagree, and Gate 6 never loads uncertainty-and-honesty.md.
11. More punctuation breaches: semicolons and serial commas in answer-the-actual-request.md, serial commas in communication.md, communication-decisions.md and communication-handoff.md.

Question 4: do not rename answer-the-actual-request.md. Fold its section 1 into communication.md section 3 and keep the rest as its own narrow rule.
Question 5: add "no metrics soup" and "name an identifier only where the reader acts on it" to communication-prose.md section 2.

UNKNOWN: drift in the miss rate between runs, the Codex session count, whether mid-turn text counts as a reply, independence of replies in long sessions, and whether the human-voice skill's triggers catch "say that more plainly".
