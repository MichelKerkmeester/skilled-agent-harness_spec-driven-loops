DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 9 of a batch covering 8-10). Your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-009.md` and `review/deltas/iter-009.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`.

**FINDING ID NAMESPACE:** prefix every new finding ID you mint with `I9-`, e.g. `I9-P1-1`, `I9-P2-1`. Do NOT use bare `P1-00N`/`P2-00N` IDs (a prior batch had a collision from two concurrent iterations both minting `P2-001`).

## STATE (established findings as of iteration 7, read-only context)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `ENV_REFERENCE.md:646-660` omits the 3 new `MK_GOAL_STATE_*` env vars.
- P1-002: `references/hooks/goal_plugin.md:33-52` (already touched this session) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.
- P1-003: Root `README.md:1230-1233` delegates the `/goal` plugin contract to `.opencode/plugins/README.md`, which does not define that contract.
- P2-001: `system-skill-advisor/README.md:85` contradicts its own feature catalog on live OpenCode-tool verification status.
- P2-002: Manual testing playbooks can pass without checking `store_health=`/`mutation=` output.
- DR-006-P2-001: Packet-history docs contain current-and-wrong stale `goal.md` operational claims (phase 009/011); phase 003 changelog + archived review README are historical (lower priority).

Do NOT re-emit any of the above as new.

## YOUR ASSIGNED FOCUS FOR THIS ITERATION (adversarial cross-check + final missed-coverage hunt)

You are the session's adversarial self-check and final coverage-gap hunter. Two tasks:

**Task A -- Adversarial re-verification of all 6 open findings above.** For EACH of P1-001, P1-002, P1-003, P2-001, P2-002, DR-006-P2-001: spend a moment re-reading the cited file:line evidence yourself (fresh eyes, do not just trust the prior iteration's citation) and either (a) CONFIRM it still holds as stated, (b) note if evidence looks weaker/stronger than claimed, or (c) flag if you think severity should shift. Do not re-emit these as new findings -- record your adversarial confirmation/challenge as a note in the iteration narrative, and only escalate via a NEW `I9-`-prefixed finding if you find something the prior citation actually got wrong (e.g. a line number that no longer matches, or a claim that doesn't hold on rereading).

**Task B -- Final missed-coverage hunt.** The operator's brief said research's own reducer stalled on repeated ground for iterations 4-9 of ITS run, so its coverage should be treated as incomplete. Iteration 7 already re-verified research's negative-sweep claims for `feature_catalog/`, `manual_testing_playbook/`, `constitutional/`, and `assets/`. Your job is to check surfaces NOT yet covered by ANY iteration in this review (1-8):
- Does `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` have a "last updated" or version marker that is now stale given the env-var gap?
- Are there any OTHER central reference docs (not `ENV_REFERENCE.md`) that also enumerate plugin env vars and might independently need the same 3-var addition (e.g. a top-level `.env.example`, a `docs/environment-variables.md`, or a CI/deploy config doc)?
- Does `opencode.json` or any plugin-registration manifest document `mk-goal.js`'s env vars inline (as opposed to delegating to ENV_REFERENCE.md)?
- Is there a CHANGELOG entry (global or packet-local, from phases 010-014) that should have announced the new env vars/output fields to consumers but didn't, or that already does and could serve as a stopgap reference?

Report any NEW finding as `I9-P{severity}-N` with full evidence. If nothing new turns up, report the clean negative explicitly with the specific surfaces you checked.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-009.md`, `review/deltas/iter-009.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above.

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-009.md`. Structure: Dimension, Files Reviewed, Adversarial Re-Verification Table (6 findings: confirm/challenge notes), Final Missed-Coverage Hunt Results, Findings by Severity, Traceability Checks, Verdict, Next Dimension. ABSOLUTE FINAL LINE exactly one of: `Review verdict: PASS` / `CONDITIONAL` / `FAIL`.

2. **Delta file** at `review/deltas/iter-009.jsonl`. FIRST line is the canonical `{"type":"iteration",...}` record (do NOT append to state.jsonl). Include `findingsNew` and `findingDetails` (IDs prefixed `I9-`), both populated in parallel (or both `[]`). Then per-event structured records.

Required schema for the first line:
```json
{"type":"iteration","iteration":9,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-009","status":"complete","focus":"adversarial re-check + final missed-coverage hunt","dimensions":["correctness","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back: verdict, count/titles of new findings, confirmation both files written, plus a one-line summary of the adversarial re-verification outcome (all 6 held / N challenged).
