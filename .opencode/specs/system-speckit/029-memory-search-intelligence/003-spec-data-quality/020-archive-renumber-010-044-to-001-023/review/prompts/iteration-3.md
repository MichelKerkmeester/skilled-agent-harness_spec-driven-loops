DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for a CLI executor (openai/gpt-5.5-fast via opencode run). Write ALL outputs to the state files below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 5
Dimension: security
Prior Findings: P0=0 P1=1 P2=0 (P1-001, confirmed twice: iteration 1 discovery, iteration 2 exact-scope re-verification)
Dimension Coverage: inventory + correctness done (correctness=true)
Traceability: core=partial overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 2
Last 2 ratios: 1.0 -> 0.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 3 of 5
Mode: review
Dimension: security — injection, unsafe deserialization, unsafe file operations, secrets exposure, permission/scope issues introduced by the renumbering execution (scripts, git mv sequence, JSON regeneration, substitution scripts)
Review Target: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023
Prior Findings: P0=0 P1=1 P2=0

## READ PRIOR STATE FIRST

Read `review/deep-review-strategy.md` and the last 2 iteration records in `review/deep-review-state.jsonl`. P1-001 (stale `parentChain` in 7 `description.json` files under `z_archive/006-deep-skill-evolution/`) is CONFIRMED and OPEN — do not re-discover it as new, but you may reference it in traceability notes if relevant to security scope (it is not, since it's a data-integrity issue, not a security issue).

## THIS ITERATION'S FOCUS (security dimension)

This is mostly a spec-folder/metadata review, so the security surface is narrow — focus on:
1. **The actual mutation mechanism used**: `implementation-summary.md` describes a single-pass Python regex-callback substitution script and `generate-description.js`/`backfill-graph-metadata.js` regeneration. These scripts are NOT part of this packet's own files (they live in `.opencode/skills/system-spec-kit/scripts/dist/`), but check whether the packet's OWN documentation (spec.md, plan.md, implementation-summary.md) discloses or implies anything unsafe: shell injection risk in the described substitution approach, unsafe eval/exec patterns, path traversal risk in the renaming logic, or unsafe handling of untrusted input. Read `.opencode/specs/system-deep-loop/z_archive/graph-metadata.json` and a couple of the regenerated `description.json`/`graph-metadata.json` files for any embedded content that looks like it could be interpreted as code/commands downstream (e.g., in `children_ids`, `parentChain`, or other array/string fields) rather than pure data.
2. **Scope discipline**: did anything in this renumbering touch files OUTSIDE the declared scope (`z_archive/` + the 3 named command-asset `.txt` files + their compiled contracts)? Check `git log`/`git status` implications only via what's documented in the packet (do not run destructive git commands yourself) — cross-check `implementation-summary.md`'s "Files Changed" table against what you find on disk.
3. **Secrets/credentials exposure**: scan the packet's own docs and a sample of the regenerated JSON/markdown files for anything resembling an API key, token, password, or internal URL that shouldn't be there (should be none — this is process documentation, but confirm rather than assume).
4. **File-permission / write-boundary discipline**: the packet claims `.opencode/specs/descriptions.json` (the master index) was never touched. Independently confirm via `git status --porcelain -- .opencode/specs/descriptions.json` (read-only inspection, not a mutation) whether that file shows uncommitted changes, and whether the packet's own claim about "pre-existing, independently-sourced" is verifiable from what you can observe (you cannot fully verify WHO made a change, but you can verify whether descriptions.json currently differs from HEAD and whether that diff plausibly relates to z_archive renumbering content).

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

- Config: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files. Do NOT run `git mv`, `git add`, `git commit`, or any destructive/mutating git command.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-003.md`
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-003.jsonl`
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md` (in-place updates only)
  - `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json` (in-place updates only)
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `git add`, `git commit`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If P1-001 remains the only open finding and you find no new security issues, set findingsNew to `[]` AND leave findingsSummary reflecting ONLY genuinely NEW findings this iteration (P1:0,P2:0,P0:0 if nothing new) — do not re-count the already-registered P1-001 in this iteration's own findingsSummary, since it was already counted in iteration 1/2. Cumulative totals live in the findings registry, not in each iteration's findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-003.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (single-line JSON, `"type":"iteration"` exactly):

```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T14:06:02.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

3. **Per-iteration delta file** at `review/deltas/iter-003.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED.
