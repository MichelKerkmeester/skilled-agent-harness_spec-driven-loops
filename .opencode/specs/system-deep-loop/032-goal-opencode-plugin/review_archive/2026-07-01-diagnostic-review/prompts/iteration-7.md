DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 7 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- keep broadening). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL
  - Iterations 2 and 5 (D2 ownership traceability findings: UNVERIFIABLE-FROM-THIS-MACHINE, local-negative ~0.78, re-confirmed stable at iteration 5)

## Objective

Deepen D2 (ownership traceability) with two angles not yet fully exhausted:

1. **Exact-citation audit.** Iteration 2 found the ownership claim ("owned by a separate, concurrently in-flight OpenCode session") repeated across ~12 packet-032 docs with no cited verification method (D2-P2-002). This iteration, collect the EXACT wording of every one of those ~12 (or however many you find on a fresh repo-wide grep) citations, and check: does ANY single one of them cite a session ID, a timestamp, an operator statement, a handle, or ANY concrete verifiable detail -- as opposed to just repeating the bare claim? If even ONE citation has a concrete detail (e.g. "per operator message at HH:MM" or a session id string), that changes the traceability verdict materially. Quote each citation's exact surrounding sentence.
2. **Observability/dispatch-log sweep.** Explicitly grep `.opencode/skills/deep-loop-runtime/database/observability-events.jsonl` and any other dispatch-log/session-ledger JSONL files under `.opencode/skills/**/database/**` or `.opencode/skills/**/*dispatch*log*` for ANY entry referencing "009", "speckit-command-goal-prompt-offer", or "goal-prompt-offer". Confirm whether this specific file/class of file was already checked in iterations 1-6 (if the strategy.md's "Files Under Review" table or an iteration narrative already covers it, do not just repeat -- go deeper: read entries in a window around the phase-009 scaffold creation time, 2026-07-01T04:47-04:58Z, to see if ANY other session's activity is logged at all, from any packet).
3. **Base-rate check.** Find at least 2-3 OTHER examples in this repo (any packet) of a phase/spec folder that is genuinely, verifiably being handed off to or claimed by "a separate session" (if any exist) and see what evidence trail THOSE leave (commits, lock files, handover docs with session ids) -- establishing whether phase 009's total absence of a corroborating trail is unusual for this repo's actual practice, or normal.
4. Render an updated confidence number (not necessarily a different verdict) for D2 based on this deeper pass.

## Style

Evidence-cited, exact quotes for citation audit.

## Tone

Terse, adversarial -- you are actively trying to find the ONE piece of evidence that would flip the verdict, in either direction.

## Audience

A senior engineer who needs the traceability verdict to be maximally defensible before this diagnostic closes.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-7.md` (headings: Exact-Citation Audit, Observability/Dispatch-Log Sweep, Base-Rate Check, Updated D2 Confidence, Findings by Severity, Verdict, Next Focus for iteration 8).
2. Append one `"type":"iteration"` line (iteration:7, focus:"D2-deep-citation-and-observability-sweep", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-007.jsonl`.

Update `review/deep-review-strategy.md` and `review/deep-review-findings-registry.json` in place. ALLOWED WRITE PATHS: only those 4 under `review/`. BANNED: any write/rename/delete anywhere under the 009 phase folder outside `review/`. Reading is unrestricted repo-wide. Record any near-violation as `scope_violation`.

Target ~9-12 tool calls, 15-20 min. Every new/escalated P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
