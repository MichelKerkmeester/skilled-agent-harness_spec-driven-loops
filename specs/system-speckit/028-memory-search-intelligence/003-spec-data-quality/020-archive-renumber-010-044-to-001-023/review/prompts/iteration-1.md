DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for a CLI executor (openai/gpt-5.5-fast via opencode run). Write ALL outputs to the state files below. Do not print findings only to stdout.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 5
Dimension: Iteration 1 inventory pass — build artifact map, identify file types (renamed directories, regenerated JSON, edited markdown/txt), estimate review complexity for the renamed z_archive tree
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 5
Mode: review
Dimension: Iteration 1 inventory pass (build artifact map / estimate complexity before the risk-ordered dimension passes: correctness in iteration 2, security in iteration 3, traceability in iteration 4, maintainability in iteration 5)
Review Target: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023
Review Scope Files:
- .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/{spec.md,plan.md,tasks.md,checklist.md,implementation-summary.md}
- .opencode/specs/system-deep-loop/z_archive/graph-metadata.json, description.json
- .opencode/specs/system-deep-loop/z_archive/{001-023}-* (23 top-level packets, 234 nested spec-folders total, each with its own description.json/graph-metadata.json)
- .opencode/specs/system-deep-loop/z_archive/006-deep-skill-evolution/{001-008}-* (nested child renumber 000-007 -> 001-008)
- .opencode/commands/deep/assets/deep_ai-council_presentation.txt, deep_research_presentation.txt, deep_review_presentation.txt
- .opencode/commands/deep/assets/compiled/deep_ai-council.contract.md, deep_research.contract.md, deep_review.contract.md
- .opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts
Prior Findings: P0=0 P1=0 P2=0

## REVIEW CHARTER (task-specific)

You are reviewing a COMPLETED spec-folder packet that renumbered `.opencode/specs/system-deep-loop/z_archive/`'s 23 top-level archived packets from `010, 012-014, 020-035, 042-044` to a contiguous `001-023` (eliminating 10 digit-collisions with the unrelated live tree as a side effect), shifted one nested phase-parent's children from `000-007` to `001-008`, regenerated `description.json`/`graph-metadata.json` identity metadata across 235 nested spec-folders, and fixed ~1165 markdown/JSON/txt files' cross-reference citations of the old numbers via a single-pass dictionary substitution script.

**Read the packet's own `spec.md`, `checklist.md`, and `implementation-summary.md` FIRST** — `implementation-summary.md` documents a real bug the AUTHOR already found and fixed after their own first completion claim: a `TOP_MAP` mapping-table key/value range overlap (old keys `010,012,013,014,020,021,022,023` numerically collide with new values `001-008`) that caused 8 of the 23 top-level subtrees to get corrupted `packet_id`/`spec_folder`/`specFolder` fields and dangling `children_ids` entries. The author claims this was root-caused, fixed by re-running the regeneration tools, and re-verified with a programmatic all-234-folder check showing 0 remaining mismatches.

**Your job is NOT to re-litigate whether renumbering was the right call.** Your job is to independently verify whether the EXECUTION is actually correct and complete, with special weight on:
1. Is the "0 remaining mismatches" claim actually true? Spot-check several `graph-metadata.json`/`description.json` files across DIFFERENT subtrees (including some of the 8 previously-corrupted ones: `010-deep-context-gathering`, `012-...`, `013-...`, `014-...`, `020-...`, `021-...`, `022-multi-ai-council-write-protocol`, `023-...` at their NEW paths `001,002,003,004,005,006,007,008`) — do their `packet_id`/`spec_folder`(graph-metadata.json)/`specFolder`/`specId`(description.json) fields actually match their current on-disk path? Are there any OTHER numeric collisions in the mapping table logic the author didn't catch?
2. Is `z_archive/graph-metadata.json`'s `children_ids` array exactly the 23 new paths, no stale/dangling/duplicate entries?
3. Are there any remaining cross-reference citations (`packet_pointer:` frontmatter or prose) of an OLD archive number (010, 012-014, 020-035, 042-044) anywhere in the repo, especially outside `z_archive/` itself (live navigational docs, commands, skills)? Use exact number+slug pairs, not bare 3-digit numbers (the old and new ranges overlap 010-023).
4. Did the live `system-deep-loop/` tree (folders 029-045, 051-053, i.e. everything NOT under `z_archive/`) get touched at all? It should not have.
5. Do the 3 edited command-asset `.txt` files and their 3 recompiled contract files actually agree (source digest match, no stale citations)?
6. Is `.opencode/specs/descriptions.json` genuinely untouched by this work (vs. touched and the author mistakenly attributed the diff to a concurrent process)?

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

- Config: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/iterations/iteration-001.md`, this iteration's narrative markdown
  - `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deltas/iter-001.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (the `review/` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration. Missing/malformed artifacts fail this iteration and trigger a redispatch.

1. **Iteration narrative markdown** at `review/iterations/iteration-001.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T14:06:02.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record (same as the state-log append) plus one line per finding/classification/traceability-check/ruled-out direction.

All three artifacts are REQUIRED and MUST land in the files, not just be described in your final response.
