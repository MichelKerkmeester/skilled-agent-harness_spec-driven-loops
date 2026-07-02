DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 8 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- keep broadening). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL
  - Iteration 7 (`review/iterations/iteration-7.md`), especially its "Next Focus for iteration 8" section: it found commit `8405ba4f57`'s author message references "a concurrent session" performing a rename, and that commit's trailer includes `Claude-Session: https://claude.ai/code/session_01MaduKvU39V7TZ4qrdB8b5k`. Iteration 7 flagged this as a "concrete handle" worth checking for uniqueness.

## Objective

**Critical sanity check the git-commit-template hypothesis.** Claude Code's own commit-message instructions (visible in this very session's system prompt, and presumably in every Claude Code session operating in this repo) include a FIXED example trailer text block for HOW to format a commit message, which itself contains the literal placeholder string `Claude-Session: https://claude.ai/code/session_01MaduKvU39V7TZ4qrdB8b5k`. If different, unrelated Claude Code sessions commit using that exact same literal example/placeholder value verbatim (rather than a dynamically-generated per-session id), then this "handle" has ZERO evidentiary value for distinguishing one session from another -- it would just be templated boilerplate, not a unique fingerprint.

1. Run `git log --all -p | grep -c "Claude-Session: https://claude.ai/code/session_01MaduKvU39V7TZ4qrdB8b5k"` (and a non-piped variant to see actual commit hashes: `git log --all --format="%H %s" -S "session_01MaduKvU39V7TZ4qrdB8b5k" --pickaxe-regex`) to determine: does this EXACT session id string appear on ONE commit only, or on MANY commits across the repo's history (which would prove it is generic/non-unique template text, not a real distinguishing session handle)?
2. If it appears on many commits spanning clearly-unrelated work (different packets, different dates, different authors/topics), revise iteration 7's finding: state explicitly that the "Claude-Session:" trailer is NOT usable as session-attribution evidence in this repo, and that iteration 7's optimistic reading of it as "a concrete handle" was likely an error worth correcting (self-correction is a legitimate and expected outcome of adversarial re-review -- do not be reluctant to downgrade a very recent finding if the evidence demands it).
3. Regardless of the outcome of #1-2, the PROSE of commit `8405ba4f57`'s message ("already renamed... by a concurrent session") is separate evidence from the trailer URL -- re-assess whether that prose claim alone (without relying on the URL as a fingerprint) still supports iteration 7's "past-tense concurrent session existed" reading at ~0.90 confidence, or whether that confidence should also be revised downward now that the URL-based corroboration may be invalidated.
4. Also sweep `Co-Authored-By:` trailers the same way, for the same uniqueness question.
5. Do NOT modify anything under the 009 phase folder outside `review/`.

## Style

Evidence-cited counts and exact commit hashes. Be willing to explicitly correct iteration 7 if the data demands it -- self-correction strengthens the audit's credibility.

## Tone

Terse, adversarial toward iteration 7's own optimism.

## Audience

A senior engineer who needs to know exactly how much weight the "Claude-Session:" evidence can bear.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-8.md` (headings: Session-Handle Uniqueness Check, Co-Authored-By Uniqueness Check, Revised D2 Assessment, Findings by Severity, Verdict, Next Focus for iteration 9).
2. Append one `"type":"iteration"` line (iteration:8, focus:"D2-session-handle-uniqueness-sanity-check", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-008.jsonl`.

Update `review/deep-review-strategy.md` and `review/deep-review-findings-registry.json` in place (correcting/downgrading iteration 7's finding if warranted -- findings registries must reflect the CURRENT best understanding, not preserve a superseded claim uncorrected). ALLOWED WRITE PATHS: only those 4 under `review/`. BANNED: any write/rename/delete anywhere under the 009 phase folder outside `review/`. Reading is unrestricted repo-wide. Record any near-violation as `scope_violation`.

Target ~9-12 tool calls, 15-20 min. Every new/escalated/downgraded P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
