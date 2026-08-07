DEEP-REVIEW

You are a deep-review LEAF agent running ONE focused review iteration (#4 of 5) over the **deep-improvement** skill. You have Read/Grep/Glob/Bash (read-only) + Write. The review target is READ-ONLY — never modify reviewed files; you may ONLY write the three artifacts named below.

## THIS ITERATION
- Primary dimension: **traceability**
- Prior findings so far: P0=0 P1=3 P2=7 (across iterations 3)
- Already-covered dimensions: inventory+correctness, correctness, security

## TARGET & SCOPE
Skill root: `.opencode/skills/deep-improvement/`. Review SKILL.md + references/ + assets/ + scripts/. Give EXTRA scrutiny to the just-shipped v1.11.1.0 remediation (28 fixes from a prior review):
- harness.cjs — the grader is now dimension-aware (dimId threaded through composeGraderPrompt/parseGraderResponse, normalizeParsedPayload, --append-system-prompt, fallback dim_id stamping). Verify no dim is hardcoded wrong, no fallback accepts malformed JSON, and the --append-system-prompt change does not break the grader contract.
- live-executor.cjs — GRADED_RESPONSE_MAX_CHARS=8000 cap, collectBraceBalancedObjects (string-aware brace scan), model default. Verify the brace scanner is correct (string/escape handling) and the cap change has no downstream truncation assumptions.
- dispatch-model.cjs — shellQuote on the resume-hint path, loadConfig ENOENT-vs-parse diagnostic.
- score-model-variant.cjs — criteriaExecAllowed gate (warn + default-preserved).
- score-skill-benchmark.cjs — scoreScenario was split into helpers; VERIFY the refactor is behavior-preserving (formulas/branch order/return keys identical). d4-ablation.cjs + sweep-benchmark.cjs — shared helpers.
- Docs vs code: SKILL.md §11 + router branch, README counts/tables, scoring_contract.md, changelog/v1.11.1.0.md — verify accuracy against the actual code.
Read the actual files (do NOT guess). Cite every finding as `file:line`.

## DIMENSIONS (risk-ordered)
correctness, security, traceability (does code match SKILL.md/README/changelog claims?), maintainability.

## SEVERITY
P0 = blocker (correctness/security bug, broken contract). P1 = required fix. P2 = suggestion. Be precise; do NOT inflate. Every P0/P1 needs claim + evidenceRefs (file:line) + why it matters. Do NOT re-report a prior finding unless adding new evidence.

## OUTPUT CONTRACT — produce ALL THREE artifacts (use the Write tool / shell append):
1. Iteration narrative markdown at `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review/review-mimo-v25pro/iterations/iteration-004.md` with headings: Dimension, Files Reviewed (file:line), Findings by Severity (P0/P1/P2 — each with file:line + claim + impact + fix), Traceability Checks, Verdict (FAIL/CONDITIONAL/PASS), Next Dimension.
2. APPEND one single-line JSON record (type EXACTLY "iteration") to `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review/review-mimo-v25pro/deep-review-state.jsonl`:
   {"type":"iteration","iteration":4,"mode":"review","run":"mimo-deepreview-015","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"newFindingsRatio":<0..1 fraction of THIS iteration's findings that are genuinely NEW>,"sessionId":"mimo-deepreview-015","generation":1,"lineageMode":"new","timestamp":"<ISO8601>"}
   Append with: echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review/review-mimo-v25pro/deep-review-state.jsonl
3. Write the per-iteration delta file `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review/review-mimo-v25pro/deltas/iter-004.jsonl`: the same "iteration" record on line 1, then one {"type":"finding","id":"R4-P<sev>-NNN","severity":"P0|P1|P2","file":"path:line","title":"...","iteration":4} line per finding.

Keep it focused and evidence-based. Target ~9 tool calls. Do the review, then write the three artifacts. Output a short summary as your final text.