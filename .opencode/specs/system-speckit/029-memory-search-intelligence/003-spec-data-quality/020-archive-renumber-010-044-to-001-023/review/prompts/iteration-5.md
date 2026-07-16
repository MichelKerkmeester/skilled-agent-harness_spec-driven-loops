DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is the FINAL iteration (5 of 5, forced maxIterations stop). This prompt pack renders the per-iteration context for a CLI executor (openai/gpt-5.5-fast via opencode run). Write ALL outputs to the state files below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 5 (FINAL)
Dimension: maintainability
Prior Findings: P0=0 P1=1 P2=0 (P1-001 open, confirmed across inventory/correctness/traceability iterations; security PASS clean)
Dimension Coverage: inventory + correctness + security + traceability done (all 4 core dims covered)
Coverage Age: 4
Stuck count: 2
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 5 of 5 (FINAL — this is the last iteration before synthesis)
Mode: review
Dimension: maintainability — patterns, clarity, documentation quality, ease of safe follow-on changes
Review Target: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023
Prior Findings: P0=0 P1=1 P2=0

## READ PRIOR STATE FIRST

Read `review/deep-review-strategy.md` and all 4 prior iteration records in `review/deep-review-state.jsonl`. Summary of what's confirmed so far:
- **P1-001 (OPEN, confirmed 4x)**: 7 `description.json.parentChain` arrays under `z_archive/006-deep-skill-evolution/` still hold stale pre-rename ancestry segments, even though `specFolder`/`specId`/`packet_id`/`spec_folder` are all correct. `spec.md` REQ-004's literal acceptance criteria don't explicitly name `parentChain`, but the problem/purpose framing and `checklist.md:78`'s wording both imply full self-reference correctness, which parentChain violates.
- Security: PASS, no findings.
- Traceability: PASS this iteration, all core+overlay protocols resolved (overlay all `notApplicable` — no skill/agent files touched).
- Structural renumbering (23 top-level `001-023`, 8 DSE children `001-008`), `children_ids` correctness, `packet_id`/`spec_folder`/`specFolder` correctness, cross-reference fix completeness (minus P1-001), and `descriptions.json`/live-tree non-interference (with a noted attribution-limit caveat) all independently re-verified clean across 4 iterations.

## THIS ITERATION'S FOCUS (maintainability — FINAL dimension, also do wrap-up)

1. **Is P1-001 easy to fix safely?** Given the exact 7-file list from iteration 2, would regenerating `parentChain` for those 7 files (e.g., via the SAME `generate-description.js`/`backfill-graph-metadata.js` tools already used, since they derive fields fresh from disk path) be a low-risk, narrow, well-understood fix? Or does it require something riskier? State this clearly — it affects the remediation workstream in the final report.
2. **Documentation clarity**: is `implementation-summary.md`'s "Post-Completion Audit" section clear about EXACTLY which fields it verified (packet_id/spec_folder/specFolder/children_ids) vs. which it didn't check (parentChain)? Would a future reader be misled by the "0 remaining mismatches" framing into thinking the WHOLE identity-metadata surface was clean? This is a documentation/maintainability concern distinct from the P1 correctness bug itself — is it worth a P2 finding recommending the summary be more explicit about audit SCOPE (which fields), independent of whether the underlying bug gets fixed?
3. **Process pattern reusability**: does this packet document reusable patterns (the single-pass substitution script pattern, the TOP_MAP overlap bug class, the number+slug matching lesson) clearly enough that a FUTURE similar renumbering effort in this repo would avoid the same class of gap (checking some identity fields but not ALL of them, e.g. missing parentChain)? Is there a generic checklist/reference this repo could point future work at, or does this knowledge only live in this one packet's prose (harder to discover next time)?
4. **FINAL WRAP-UP**: since dimension coverage is now complete (all 4 core dimensions reviewed at least once) and this is the forced final iteration, set `"reviewDepthSchemaVersion"` fields normally, but ALSO make sure your iteration narrative's Verdict section states an overall PACKET verdict (not just this dimension's): given exactly 1 open P1 and 0 open P0, the correct overall verdict is **CONDITIONAL** (per the review system's rule: no P0, but active P1 findings remain = CONDITIONAL, not PASS, not FAIL). State this explicitly.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain. Given exactly 1 open P1 and 0 open P0 across the whole session, the packet-level verdict is CONDITIONAL.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS**:
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-005.md`
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-005.jsonl`
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md` (in-place)
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json` (in-place)
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `git add`, `git commit`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: STOP and emit a `## SCOPE VIOLATIONS` finding instead of any out-of-scope mutation.
- **Do not re-count P1-001 in this iteration's own findingsSummary** unless formally reclassifying it (explicit severity-change transition, not a duplicate id). If you add a NEW P2 finding about documentation-scope clarity (per focus item 2 above), that IS a genuinely new finding and belongs in findingsNew.

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-005.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, **Overall Packet Verdict** (explicit CONDITIONAL/PASS/FAIL call with 1-sentence why), Remediation Recommendation (for P1-001 specifically: is it safe/narrow to fix?), Next Dimension (write "None — final iteration").

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (single-line JSON, `"type":"iteration"` exactly):

```json
{"type":"iteration","iteration":5,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-005","status":"complete","focus":"maintainability","dimensions":["maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T14:06:02.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

3. **Per-iteration delta file** at `review/deltas/iter-005.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED.
