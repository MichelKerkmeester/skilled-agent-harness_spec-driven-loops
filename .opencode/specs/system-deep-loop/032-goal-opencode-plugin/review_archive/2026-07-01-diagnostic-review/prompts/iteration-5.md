DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 5 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- ALL 4 dimensions D1-D4 already have first-pass coverage per iterations 1-4; you MUST broaden, not converge, per the strategy's own stop policy). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL, especially the iteration-4 "Next Dimension" recommendation
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-4.md` in full (finding D4-P1-001: a live graph-metadata backfill would derive `status: complete` for phase 009 via a `deriveStatus` heuristic -- implementation-summary.md present + no checklist.md => complete -- even though the phase is `completion_pct: 0` and entirely unauthored)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` function `deriveStatus` (cited near lines 1201-1218 by iteration 4 -- confirm the exact lines yourself)

## Objective

Iteration 4 flagged that the `deriveStatus` heuristic could systemically mislabel ANY phase that (a) has an `implementation-summary.md` file present (even if it's an unfilled scaffold), (b) has no `checklist.md`, and (c) is actually incomplete, as falsely `complete`. This is a TOOLING-LEVEL correctness question, escalating beyond phase 009 alone.

1. Read the exact `deriveStatus` logic (or equivalent) yourself -- do not trust iteration 4's line numbers/paraphrase without checking. Confirm precisely what conditions produce `status: complete`.
2. Run a READ-ONLY repo-wide sweep: for a representative sample (at least 15-20, more if cheap) of spec folders across different packets/tracks that have an `implementation-summary.md` present, no `checklist.md`, cross-check whether their `implementation-summary.md` is itself a genuine unfilled scaffold (same placeholder markers as phase 009's: `template-author`, `sha256:0000...`, bracketed placeholder body) AND whether their frontmatter/spec.md claims `completion_pct: 0` or has open `[ ]` tasks. Determine: is phase 009 an ISOLATED instance of "scaffold implementation-summary.md + no checklist.md + actually incomplete", or does this pattern recur elsewhere (which would mean the false-complete deriveStatus heuristic is a systemic, repo-wide tooling defect, not a phase-009 one-off)?
3. Based on the sweep, render a severity verdict for D4-P1-001: does it stay P1 (isolated/rare, phase-009 specific impact) or escalate to P0 (systemic, affects the trustworthiness of `status` across many packets' graph-metadata/memory-index)?
4. Secondary (if time remains within budget): re-challenge D2's "UNVERIFIABLE-FROM-THIS-MACHINE" verdict -- re-run `git reflog`, `git stash list`, and a repo-wide lock/pid grep for phase 009 ONE more time to confirm nothing has changed since iteration 2 (~35-40 min ago). Also re-confirm D1's "1 of 2425 files fail JSON.parse" sweep count is still exactly 1 (no other process should have touched anything, but verify rather than assume).
5. Do NOT implement/fix/modify anything under the 009 phase folder outside `review/`. Do NOT actually run any live (non-dry-run, non-sandboxed) backfill against any real spec folder anywhere in the repo -- read-only derivation checks only.

## Style

Evidence-cited. State the sample size and exact criteria used for the sweep so the finding is reproducible.

## Tone

Terse, adversarial toward iteration 4's own claim -- it recommended this test precisely because it wasn't sure; settle it with data.

## Audience

A senior engineer deciding whether D4-P1-001 is a phase-009 footnote or a repo-wide tooling correctness P0.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-5.md` (headings: Dimension (cross-cutting: D1+D4 generality re-test, D2 re-challenge), Files/Folders Reviewed, Findings by Severity, Traceability Checks, Verdict on D4-P1-001 severity, Next Focus for iteration 6).
2. Append one `"type":"iteration"` line (iteration:5, focus:"generality-sweep-and-adversarial-recheck", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-005.jsonl`.

Update `review/deep-review-strategy.md` (RUNNING FINDINGS, escalate D4-P1-001 severity if warranted, NEXT FOCUS for iteration 6, WHAT WORKED/FAILED) and `review/deep-review-findings-registry.json` in place. ALLOWED WRITE PATHS: only those 4 under `review/`. BANNED: any write/rename/delete anywhere under the 009 phase folder outside `review/`, and any live write against ANY other spec folder repo-wide. Reading is unrestricted repo-wide. Record any near-violation as `scope_violation`.

Target ~9-12 tool calls, 15-20 min. Every new/escalated P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
