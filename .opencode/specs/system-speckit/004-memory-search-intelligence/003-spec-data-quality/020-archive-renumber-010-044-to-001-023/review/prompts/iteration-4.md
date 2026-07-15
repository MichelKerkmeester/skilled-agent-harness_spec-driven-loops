DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for a CLI executor (openai/gpt-5.5-fast via opencode run). Write ALL outputs to the state files below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 4 of 5
Dimension: traceability
Prior Findings: P0=0 P1=1 P2=0 (P1-001 open, confirmed 3x; security dimension PASS with no new findings)
Dimension Coverage: inventory + correctness + security done
Traceability: core=partial overlay=pending
Coverage Age: 3
Last 2 ratios: 0.0 -> 0.0
Stuck count: 1
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 4 of 5
Mode: review
Dimension: traceability — spec/code alignment, checklist evidence accuracy, cross-reference integrity (core: spec_code, checklist_evidence; overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability)
Review Target: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023
Prior Findings: P0=0 P1=1 P2=0

## READ PRIOR STATE FIRST

Read `review/deep-review-strategy.md` and the last 3 iteration records in `review/deep-review-state.jsonl`. P1-001 (stale `parentChain` in 7 `description.json` files) is CONFIRMED, OPEN, and precisely scoped (exact file list in iteration-002.md). Do not re-discover it as new. Security iteration (3) found no new issues.

## THIS ITERATION'S FOCUS (traceability dimension)

1. **`checklist.md` accuracy audit**: Go through EVERY checked box (`[x]`) in `checklist.md` and verify its claim against actual on-disk evidence. Pay special attention to CHK-P0-001 (identity metadata regenerated/self-references correct) — this is now KNOWN to be incomplete (P1-001), so does the checklist item's wording overclaim, or does it correctly scope to `packet_id`/`spec_folder`/`specFolder` only (in which case the checklist might be technically accurate but incomplete in what it verified, which is itself worth noting as a P2 process-improvement finding, not a P1 correctness bug)? Check CHK-P0-004 (children_ids dangling-reference check) similarly — does the same class of gap (checking some fields but not others) appear there too?
2. **`spec.md` REQ-004/REQ-005/REQ-006/REQ-007 acceptance-criteria audit**: for each, does current on-disk evidence actually satisfy the stated "Then" clause? REQ-004 says "specFolder/specId/packet_id/spec_folder all read the new path" — does it say anything about parentChain? If REQ-004's letter doesn't explicitly cover parentChain, is P1-001 actually a REQ-004 violation, or a gap the spec itself didn't anticipate (which would make it a spec-completeness finding, not a strict REQ-004 breach)? This distinction matters for how the finding should be characterized in the final verdict.
3. **`implementation-summary.md` "Post-Completion Audit" section accuracy**: it claims "zero remaining mismatches" for `packet_id`/`spec_folder`/`specFolder` and "0 dangling children_ids entries" — cross-check these specific claims (not parentChain, which they never claimed) against your own or prior iterations' independent findings. Are these NARROWER claims actually still true, or did iterations 1-2 find any counter-example to THESE specific claims (as opposed to the parentChain field, which was never part of this claim)?
4. **Cross-reference completeness**: `implementation-summary.md` claims 1162 files fixed via script + 3 live command-asset files + 3 recompiled contracts. Spot-check whether `check-contract-drift.vitest.ts` still logically covers these 3 contracts (read the test file, don't run it — you don't have a test runner in this dispatch). Also spot-check 2-3 of the "144 confirmed deliberate historical preservation" citations the packet claims are intentionally NOT fixed (pick from `implementation-summary.md`'s Key Decisions table) — do they look genuinely like closed historical records (transcripts, logs, completed summaries) rather than live navigational docs that should have been fixed?
5. **`overlay` traceability protocols** (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): these are mostly not applicable to a spec-folder-only packet with no skill/agent changes — mark `notApplicable` with a one-line justification rather than leaving `pending`.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-004.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS**:
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-004.md`
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-004.jsonl`
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md` (in-place)
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json` (in-place)
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `git add`, `git commit`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: STOP and emit a `## SCOPE VIOLATIONS` finding instead of any out-of-scope mutation.
- **Do not re-count P1-001 in this iteration's own findingsSummary** unless you are formally reclassifying its severity (e.g., downgrading based on REQ-004's actual letter) — in that case emit it as a `findingsNew` entry with an explicit severity-change transition, not a fresh duplicate id.

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-004.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (single-line JSON, `"type":"iteration"` exactly):

```json
{"type":"iteration","iteration":4,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-004","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T14:06:02.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

3. **Per-iteration delta file** at `review/deltas/iter-004.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED.
