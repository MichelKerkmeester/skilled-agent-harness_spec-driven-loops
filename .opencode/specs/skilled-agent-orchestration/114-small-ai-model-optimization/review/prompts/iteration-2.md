DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 2 of 20

## STATE

state_summary: Iter 1 spot-checked correctness across 6 files and found 0 P0/P1/P2 findings. Sampling was light — only 1-2 files verified per phase. Iter 2: exhaustive correctness pass with full enumeration of spec.md §3 file lists vs disk.

Review Iteration: 2 of 20
Mode: review
Dimension: **correctness** (1/4, exhaustive pass)
Review Target: skilled-agent-orchestration/114-small-ai-model-optimization
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

P0 = blocker (broken shipped state). P1 = required (correctness gap that must close before PASS). P2 = advisory (quality/hygiene).

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code (exhaustive — every file in every phase's §3 vs disk), checklist_evidence (deferred to traceability iters)
- **Overlay**: skill_agent (n/a iter 2)

## QUALITY GATES

evidence (every finding cites spec.md:line for the claim + ls/Read result for confirmation), scope (114-only), coverage (correctness expanded)

## VERDICTS

`FAIL | CONDITIONAL | PASS` — final verdict in synthesis.

## CLAIM ADJUDICATION

P0/P1 findings need: claim + evidenceRefs + counterevidenceSought + alternativeExplanation + finalSeverity + confidence + downgradeTrigger.

## STATE FILES

All paths relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/iterations/iteration-002.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deltas/iter-002.jsonl`

## CONSTRAINTS

- LEAF agent (SWE-1.6 deep-review iter worker). No sub-agent dispatch. Soft max 12, hard max 13 tool calls.
- Review target is READ-ONLY. Do not modify reviewed files.
- ALLOWED WRITE PATHS:
  - `review/iterations/iteration-002.md`
  - `review/deep-review-state.jsonl`
  - `review/deltas/iter-002.jsonl`

## ITERATION 2 FOCUS — EXHAUSTIVE CORRECTNESS

**Method**: For each of the 5 implementation phases (002, 003, 004, 005, 006):

1. Read `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/<phase>/spec.md` and extract §3 "Files to Change" (look for the section header `## 3. Files to Change` or similar; the bullet list of file paths is the spec authority).
2. For EVERY file path listed in §3, run a check that the file exists on disk. Use Bash `ls -la <path>` or Read.
3. For EVERY file path listed in §3, also check it's listed in the corresponding `implementation-summary.md` "## Built" section (or similar — codex's wording varies).
4. Flag P1 if a §3 file is missing on disk OR a §3 file is missing from impl-summary's Built list.
5. Flag P2 if impl-summary's Built list contains a file NOT in §3 (potential scope creep; might be legitimate codex deviation).

**Phase paths**:
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/002-sentinel-skill-foundation/`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/003-structured-permissions-matrix/`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/004-budget-and-output-verification/`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback/`
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/006-budget-pattern-propagation/`

**Expected output**: a clear table per phase listing each §3 file + disk status + impl-summary status. Findings emerge if rows disagree.

If you find 0 issues again, emit `clean_dimension` classification with stronger evidence (full enumeration, not spot-check).

## OUTPUT CONTRACT (all 3 required)

1. **iteration-002.md** — Structure: `## Dimension`, `## Files Reviewed`, `## Per-Phase Cross-Check Tables`, `## Findings by Severity`, `## Traceability Checks`, `## Verdict (per-iter)`, `## Next Dimension`. Each finding has full adjudication block.

2. **state.jsonl APPEND** — single line, `"type":"iteration"`. newInfoRatio: if 0 findings again, set 0.10 (low new info, near convergence). Read existing JSONL then Write back with appended line.

3. **deltas/iter-002.jsonl** — multi-line: iter record + per-finding records + classification.

## EXECUTION

1. sequential_thinking 5+ thoughts: plan the phase enumeration, the cross-check method, the table layout.
2. Per-phase Bash `ls` or Read of each §3 file.
3. Read each impl-summary.md and grep "Built" section.
4. Compose tables + findings.
5. Append JSONL + write delta. Stop.
