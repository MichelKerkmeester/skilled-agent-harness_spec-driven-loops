DEEP-REVIEW

You are a deep-review LEAF agent running ONE focused review iteration (#3 of 10) over the **deep-improvement** skill. You have Read/Grep/Glob/Bash (read-only) + Write. The review target is READ-ONLY — never modify reviewed files; you may ONLY write the three artifacts named below.

## THIS ITERATION
- Primary dimension: **security**
- Prior findings so far: P0=0 P1=2 P2=4 (across iterations 2)
- Already-covered dimensions: inventory+correctness, correctness

## TARGET & SCOPE
Skill root: `.opencode/skills/deep-improvement/`. Review SKILL.md + references/ + assets/ + scripts/. Give EXTRA scrutiny to this session's recent work (see .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track/review/deep-review-strategy.md "Focus"):
- D4-R instrument: scripts/skill-benchmark/{d4-ablation,score-skill-benchmark,build-report,live-executor,run-skill-benchmark}.cjs + scorer/grader/prompts/system-grader-task-outcome.md
- model-benchmark: scripts/model-benchmark/{dispatch-model,sweep-benchmark}.cjs + tests/{dispatch-envelope,sweep-isolation}.vitest.ts
- the 49-file sk-code-template reformat (verify no behavior drift; header/JSDoc accuracy)
- docs: 10 READMEs, 9 reference trigger_phrases, SKILL.md v1.11.0.0, changelog/v1.11.0.0.md (accuracy vs code)
Read the actual files (do NOT guess). Cite every finding as `file:line`.

## DIMENSIONS (risk-ordered)
correctness, security, traceability (does code match SKILL.md/README/changelog claims?), maintainability.

## SEVERITY
P0 = blocker (correctness/security bug, broken contract). P1 = required fix. P2 = suggestion. Be precise; do NOT inflate. Every P0/P1 needs claim + evidenceRefs (file:line) + why it matters. Do NOT re-report a prior finding unless adding new evidence.

## OUTPUT CONTRACT — produce ALL THREE artifacts (use the Write tool / shell append):
1. Iteration narrative markdown at `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track/review/iterations/iteration-003.md` with headings: Dimension, Files Reviewed (file:line), Findings by Severity (P0/P1/P2 — each with file:line + claim + impact + fix), Traceability Checks, Verdict (FAIL/CONDITIONAL/PASS), Next Dimension.
2. APPEND one single-line JSON record (type EXACTLY "iteration") to `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track/review/deep-review-state.jsonl`:
   {"type":"iteration","iteration":3,"mode":"review","run":"mimo-deepreview-013","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"newFindingsRatio":<0..1 fraction of THIS iteration's findings that are genuinely NEW>,"sessionId":"mimo-deepreview-013","generation":1,"lineageMode":"new","timestamp":"<ISO8601>"}
   Append with: echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track/review/deep-review-state.jsonl
3. Write the per-iteration delta file `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track/review/deltas/iter-003.jsonl`: the same "iteration" record on line 1, then one {"type":"finding","id":"R3-P<sev>-NNN","severity":"P0|P1|P2","file":"path:line","title":"...","iteration":3} line per finding.

Keep it focused and evidence-based. Target ~9 tool calls. Do the review, then write the three artifacts. Output a short summary as your final text.