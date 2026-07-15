DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for a CLI executor (openai/gpt-5.5-fast via opencode run). Write ALL outputs to the state files below. Do not print findings only to stdout.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 5
Dimension: correctness
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: inventory only (0/4 core dims)
Traceability: core=partial overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 5
Mode: review
Dimension: correctness — logic errors, wrong return types, broken invariants in the renumbering execution
Review Target: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023
Review Scope Files: same scope as iteration 1 (see review/deep-review-strategy.md §15 Files Under Review)
Prior Findings: P0=0 P1=1 P2=0

## IMPORTANT: READ PRIOR STATE FIRST

Read `review/deep-review-strategy.md` (especially §12 NEXT FOCUS and §7 RUNNING FINDINGS) and the last iteration record in `review/deep-review-state.jsonl` before starting. Iteration 1 (inventory) already found:
- **P1-001 (OPEN)**: 7 regenerated `description.json` records under `z_archive/006-deep-skill-evolution/` still carry a STALE `parentChain` array (old pre-rename path segments like `021-deep-skill-evolution`/`004-deep-research` instead of the current `006-deep-skill-evolution`/`005-deep-research`), even though `specFolder`/`specId` on the same files are correct. This was independently confirmed by direct read of `z_archive/006-deep-skill-evolution/005-deep-research/001-uplift-research-deep-review-changes/description.json`.
- Strategy's Next Focus for this iteration: validate the scope of this parentChain staleness (is it really exactly 7, or more/fewer?), and continue correctness review of the renumbering execution more broadly.

## THIS ITERATION'S FOCUS (correctness dimension)

1. **Scope the parentChain staleness precisely**: search all 234 nested `description.json` files under `z_archive/` for `parentChain` arrays that still contain an OLD top-level or old DSE-child number (per the exact mapping in `spec.md` REQ-001/REQ-002) instead of the current renamed segment. Report the exact count and file list (or confirm it really is exactly 7 as iteration 1 estimated).
2. **Check `graph-metadata.json`'s equivalent field(s)** (if any store ancestry/parent path, e.g. `parent_id`, `manual.parentId`) for the same class of staleness — the bug may not be confined to `description.json`.
3. **Re-verify a fresh, INDEPENDENT sample of `packet_id`/`spec_folder` (graph-metadata.json) and `specFolder` (description.json)** across at least 5 files spanning different subtrees (not just the ones iteration 1 already touched) — confirm the "0 mismatches" claim continues to hold, or find a counter-example.
4. **Check the git-mv correctness**: does `find z_archive -maxdepth 1 -type d | sort` still read exactly `001`-`023`? Does `z_archive/006-deep-skill-evolution -maxdepth 1 -type d | sort` read exactly `001`-`008`? (Should be unchanged since iteration 1, but confirm — this is cheap and catches any accidental mutation.)
5. **Logic-check the renumbering mapping itself** against `spec.md`'s stated table (010→001, 012→002, ..., 044→023) — are there any folders under `z_archive/` whose CURRENT number doesn't match what the mapping table would produce from a plausible old number? (I.e., does every folder's number make sense under SOME valid interpretation of the mapping, or is there an orphan/miscounted folder?)

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
- Write iteration narrative to: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-002.md`, this iteration's narrative markdown
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-002.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (the `review/` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes:
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}`
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}`

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration. Missing/malformed artifacts fail this iteration and trigger a redispatch.

1. **Iteration narrative markdown** at `review/iterations/iteration-002.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":2,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-002","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T14:06:02.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-002.jsonl`: one `{"type":"iteration",...}` record (same as the state-log append) plus one line per finding/classification/traceability-check/ruled-out direction.

All three artifacts are REQUIRED and MUST land in the files, not just be described in your final response.
