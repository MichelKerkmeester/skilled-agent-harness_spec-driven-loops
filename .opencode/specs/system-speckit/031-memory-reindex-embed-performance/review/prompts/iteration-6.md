DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

Non-interactive worker, no human on the other end. Write authority is bound to STATE FILES below. Do NOT ask Gate-3. Proceed immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch)

Write a `<pre-plan>` block with 4-5 ordered steps (Input/Output/Acceptance/Verification each) before any tool call.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 6 of 10 | Cumulative: P0=0 P1=1 P2=0 (P1-001 REQ-010 lease-use generation atomicity; a P2 security-awareness note on socket-dir TOCTOU was also recorded in iter 5, non-blocking). Correctness (4/4 REQ items) and Security dimensions both PASS.
Dimension shift: TRACEABILITY (your own iteration-5 plan). Read strategy.md §12 for full detail.

## ITERATION 6 FOCUS — TRACEABILITY DIMENSION

1. **spec_code**: for each of REQ-006 through REQ-011 in `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md` §4, confirm the described behavior actually matches what's implemented (you've already verified REQ-006/007/008/009/010/011 behaviorally in iterations 1-5 — this pass is specifically about whether the SPEC TEXT accurately describes what you observed, not re-deriving the behavior itself).
2. **checklist_evidence**: for each CHK-070 through CHK-078 in `checklist.md`, confirm the cited evidence (test file, line numbers, command output) actually supports the claim — spot-check at least 3 of the 9 checklist items by re-running or re-reading the cited evidence directly.
3. **`_memory.continuity` frontmatter consistency**: read the YAML frontmatter blocks at the top of `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`. Are `last_updated_at`, `recent_action`, and `next_safe_action` internally consistent across all five docs (i.e., do they tell the same coherent story), or do any contradict each other?
4. **overlay protocols** (`feature_catalog_code` is the only applicable overlay here per iter-0 classification — `skill_agent`/`agent_cross_runtime`/`playbook_capability` remain notApplicable): is there a feature-catalog entry that should reference this hardening work, or is its absence correctly out of scope for an internal daemon-hardening fix?
5. Cross-check the plan.md FIX ADDENDUM: AFFECTED SURFACES table — does every row's "Verification" column cite a real, re-runnable command or test, not a vague claim?

Record findings, then set Next Focus for iteration 7 in strategy.md §12 (recommend: MAINTAINABILITY dimension — code clarity, comment hygiene compliance across ALL new comments in the 5 .cjs/2 .ts implementation files, and whether the leaseId-fencing code in mk-spec-memory-launcher.cjs is understandable/safe for a future maintainer to modify without reintroducing the race).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-006.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-006.jsonl

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13.
- Write ALL findings to files. Review target is READ-ONLY. Do not implement fixes.
- **ALLOWED WRITE PATHS**: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-006.md`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only), `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-006.jsonl`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only).
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate `>` against any path not in the allowed-write list, or any delete/rename/replace outside that list. Reading is unrestricted; writing/renaming/deleting are scoped.
- **SCOPE VIOLATION PROTOCOL**: if a needed mutation falls outside allowed-write paths, STOP and record a `scope_violation` under `## SCOPE VIOLATIONS` instead of executing it.
- Use `echo '<single-line-json>' >> <path>` for the JSONL append, not a patch/edit tool.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-006.md` (Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension).
2. JSONL record APPENDED to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":6,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-006","status":"complete","focus":"<focus>","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-006.jsonl` (iteration record + per-finding/classification/traceability records).

All three artifacts REQUIRED.
