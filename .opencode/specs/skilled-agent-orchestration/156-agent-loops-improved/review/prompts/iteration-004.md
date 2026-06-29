DEEP-REVIEW

# Deep-Review Iteration 4 of 20

You are a LEAF code-review agent performing ONE focused review pass. The review target is READ-ONLY — do NOT modify any reviewed file. Do NOT implement fixes. Report findings only.

## FOCUS THIS ITERATION
- Canonical dimension: **security**
- Sub-angle: **input validation, injection sanitization, hex(sessionID) keying, no path traversal in state-dir resolution**
- Scope slice (PLUGIN) — review these files as an integrated unit:
  - .opencode/plugins/mk-goal.js
  - .opencode/commands/goal.md

Read each file in full (and any directly-coupled file you need to judge a contract). These files were just implemented by separate agents and never cross-reviewed as a system. Hunt for REAL defects, not style nits: concurrency races, fail-open where fail-closed is required (and vice-versa), missing await, unhandled rejection, resource leaks, off-by-one, wrong default/null handling, env-precedence bugs, path traversal, injection, cross-file contract drift (a caller and callee disagreeing on shape/units/nullability), and tests that assert only the happy path.

## SEVERITY
- P0 = correctness/security defect that can corrupt state, leak, hang, crash, or silently lose data in normal use.
- P1 = real bug or contract violation with a plausible trigger, or a missing guard.
- P2 = maintainability/robustness/test-gap worth fixing.
For EVERY P0/P1 include claim, evidenceRefs (file:line), counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger. Be skeptical: if you cannot cite file:line and a concrete trigger, downgrade or drop it. No speculative findings.

## OUTPUT — write exactly these two files (do NOT touch the state log or any reviewed file):
1) Narrative markdown at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/review/iterations/iteration-004.md` with headings: Dimension, Files Reviewed, Findings by Severity (P0/P1/P2 — each with file:line + why + suggested fix direction), Verdict (FAIL|CONDITIONAL|PASS), Notes.
2) Delta JSONL at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/review/deltas/iter-004.jsonl` — first line EXACTLY this canonical iteration record (single line, no pretty-print):
{"type":"iteration","iteration":4,"mode":"review","run":"iter-004","status":"complete","focus":"security: input validation, injection sanitization, hex(sessionID) keying, no path traversal in state-dir resolution","dimensions":["security"],"filesReviewed":[<files with :line you actually inspected>],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"review-156-002-2026-06-29","generation":1,"lineageMode":"new","timestamp":"2026-06-29T00:00:00Z","durationMs":0}
   then ONE `{"type":"finding",...}` line per finding with: {"type":"finding","id":"R4-<P0|P1|P2>-NNN","severity":"<P0|P1|P2>","dimension":"security","file":"path:line","title":"...","detail":"...","claim":"...","evidenceRefs":["path:line"],"counterevidenceSought":"...","alternativeExplanation":"...","confidence":"<low|med|high>","downgradeTrigger":"...","suggestedFix":"...","iteration":4}

Use absolute repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Target ~9 tool calls (soft max 12). When done, stop — output nothing else.