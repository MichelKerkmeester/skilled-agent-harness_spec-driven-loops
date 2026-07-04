DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 7 of a batch covering 4-7). Your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-007.md` and `review/deltas/iter-007.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings as of iteration 3, read-only context)

Prior Findings: P0=0 P1=2 P2=0
- P1-001: `ENV_REFERENCE.md:646-660` omits the 3 new `MK_GOAL_STATE_*` env vars.
- P1-002: `references/hooks/goal_plugin.md:33-52` (already touched this session) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.

Do NOT re-emit either as new.

## YOUR ASSIGNED FOCUS FOR THIS ITERATION (traceability -- independent verification of the companion research's own coverage claims)

The operator's brief states the companion research pass's reducer STALLED on repeated ground for iterations 4-9, so its coverage should be treated as INCOMPLETE, not exhaustive, even where it claims an exhaustive negative sweep. Your job this iteration is a genuinely independent repo-wide sweep to check whether research's negative-sweep claims actually hold, NOT to re-cite them as already-proven:

1. Research claims (§9 of `research/research.md`): a path-scoped sweep of EVERY `.opencode/skills/**/feature_catalog/**/*.md`, `.opencode/skills/**/manual_testing_playbook/**/*.md`, and `.opencode/skills/system-spec-kit/constitutional/**/*.md` found goal-plugin entries ONLY under `system-spec-kit` and `system-skill-advisor` -- no other skill anywhere in the repo has a stray/outdated goal-plugin catalog, playbook, or constitutional entry.
   - Independently re-run this sweep yourself: `grep -rl` (or equivalent) for `mk-goal`, `mk_goal`, `goal_opencode`, `usage_limited`, `store_health` across ALL `feature_catalog/`, `manual_testing_playbook/`, and `constitutional/` directories under `.opencode/skills/**`.
   - Also check `assets/` directories across ALL skills (research's brief mentions this class but the operator flagged it as an area research may not have swept as thoroughly given the reducer stall) -- this is a genuinely NEW check, not a re-verification.
   - Confirm or refute: is `system-spec-kit` + `system-skill-advisor` really the complete set, or does your independent sweep turn up a skill research missed?
2. Research claims (§9): exact goal-plugin-term sweeps across `cli-opencode`, `cli-claude-code`, `sk-code`, `sk-prompt-models`, and `deep-loop-workflows` own `SKILL.md`/`references/`/`assets/` returned NO goal-plugin mentions. Spot-check at least 2 of these 5 yourself directly (do not just trust the claim) -- pick the two you judge most likely to have plugin-adjacent content (e.g. `deep-loop-workflows` given it also uses externalized-state loop patterns similar to the goal plugin's state file).
3. Look for ANY doc surface not yet checked by iterations 1-6 and not in research's own scope: e.g. `.env.example` files, `docs/` folders outside `.opencode/skills/`, top-level `CHANGELOG.md` entries mentioning the goal plugin, or other skills' `README.md` files (not just `system-plugins/README.md` and `system-skill-advisor/README.md`) that might mention `/goal` or `mk-goal.js` in passing.

Report any NEW finding as a new P0/P1/P2 with full evidence. If your independent sweep CONFIRMS research's negative claims (nothing missed), report that explicitly as a validated negative result -- this is a legitimate and valuable iteration outcome per the operator's explicit ask to "actively look for anything the research pass missed."

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-007.md`, `review/deltas/iter-007.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (including the shared state files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-007.md`. Structure: Dimension, Files/Directories Swept, Independent Re-Verification of Research §9 Claims (confirmed/refuted with evidence), New Doc Surfaces Checked, Findings by Severity, Traceability Checks, Verdict, Next Dimension. ABSOLUTE FINAL LINE exactly one of: `Review verdict: PASS` / `CONDITIONAL` / `FAIL`.

2. **Delta file** at `review/deltas/iter-007.jsonl`. FIRST line is the canonical `{"type":"iteration",...}` record (do NOT append to state.jsonl). Include `findingsNew` and `findingDetails`, both populated in parallel (or both `[]`). Then per-event structured records.

Required schema for the first line:
```json
{"type":"iteration","iteration":7,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-007","status":"complete","focus":"traceability (independent verification of research coverage claims)","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back: verdict, count/titles of new findings, confirmation both files written.
