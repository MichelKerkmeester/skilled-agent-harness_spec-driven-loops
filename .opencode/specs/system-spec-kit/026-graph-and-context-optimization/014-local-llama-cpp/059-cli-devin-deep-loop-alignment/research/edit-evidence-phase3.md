# Phase 3 Edit Evidence — SWE-1.6 Iter Contract Added to LEAF Agents

Date: 2026-05-15
Phase: 3 (LEAF agent contract additions)
Files touched: 2

## Summary

Added one new H3 subsection `### SWE-1.6 Iter Contract (cli-devin executor)` inside the existing `## 2. ROUTING SCAN` anchor of each LEAF iteration agent. The new subsection captures the 7 retrospective lessons from packets 056 + 058 (SWE-1.6 dispatch experience) and binds them to the cli-devin executor branch.

LEAF contract preserved. No changes to role, no-sub-dispatch, no-Task-tool, or scope-lock rules. No anchor-pair breakage.

## Per-file deltas

### File 1: `.opencode/agents/deep-research.md`

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Line count | 563 | 579 | +16 |
| H2 anchors | 11 | 11 | 0 |
| H3 anchors | 27 | 28 | +1 |
| Validator issues | 3 (2 errors + 1 warning) | 3 (2 errors + 1 warning) | 0 |

**Subsection placement**: inserted between the existing `### MCP Tools` subsection and the `---` divider that precedes `## 3. ITERATION PROTOCOL`. Verified at lines ~317-330 of the post-edit file.

**Subsection title**: `### SWE-1.6 Iter Contract (cli-devin executor)`

**Anchor host**: `## 2. ROUTING SCAN` (existing).

**Forward reference**: `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` (to be authored in Phase 4).

### File 2: `.opencode/agents/deep-review.md`

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Line count | 541 | 559 | +18 |
| H2 anchors | 11 | 11 | 0 |
| H3 anchors | 40 | 41 | +1 |
| Validator issues | 5 (4 errors + 1 warning) | 5 (4 errors + 1 warning) | 0 |

**Subsection placement**: inserted between the existing `### Runtime Mirror Awareness` subsection and the `---` divider that precedes `## 3. REVIEW CONTRACT`. Verified at lines ~272-289 of the post-edit file.

**Subsection title**: `### SWE-1.6 Iter Contract (cli-devin executor)`

**Anchor host**: `## 2. ROUTING SCAN` (existing).

**Forward reference**: `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` (to be authored in Phase 4).

## Iter contract bullets (7 lessons → agent guidance)

Both subsections cover the same nine-row contract table. Adaptations diverge between research and review along the lines noted.

| Dimension | Mapped lesson | deep-research wording | deep-review wording |
|-----------|---------------|------------------------|----------------------|
| Permission mode | n/a (executor binding) | `auto`, read-only | `auto`, read-only against review target |
| Model selection | Lesson 6 (model picking) | swe-1.6 for context-gathering, deepseek-v4 for synthesis/contradiction | swe-1.6 for evidence collection, deepseek-v4 for adjudication / Hunter/Skeptic/Referee / synthesis |
| Prompt quality | Lesson 6 (sk-prompt contract) | STAR/RCAF/BUILD + CLEAR 5-check + pre-planning, ONE sk-prompt pass upfront | identical contract |
| Output capture | Lesson 1 (drop ```markdown fences) | plain stdout, orchestrator prepends frontmatter | identical, target = `review/iterations/iteration-NNN.md` |
| Completion sentinel | Lesson 2 (`ITER_{N}_COMPLETE`) | `ITER_{N}_COMPLETE: <findings> findings, newInfoRatio={X.XX}` as LAST line | same shape, findingsCount aggregates P0+P1+P2, ratio matches `newFindingsRatio` |
| Numeric-count discipline | Lesson 3 (verify N of X) | orchestrator runs `find/grep \| wc -l` as 4th check | same 4-check gate |
| Structured format | Lesson 4 (counted tables) | RQs as counted tables forcing enumeration | findings as canonical numbered table under P0/P1/P2 sections, references sk-code-review review_core.md |
| Cross-iter awareness | Lesson 5 (no SWE-1.6 memory) | synthesis-style iters need prior findings injected | cross-reference iters (carried-forward P0/P1, regression checks) need prior findings + registry injected |
| Dispatch concurrency | Lesson 7 (3-at-a-time vs sequential) | 3-at-a-time for independent iter, sequential for cross-iter-aware | 3-at-a-time for independent-dimension review, sequential for P0 referee / synthesis / conditional re-review |

Review-specific tool-surface narrowing note added as preamble: Read + Grep cover bulk evidence collection, Write limited to artifact + strategy + JSONL, Bash for bounded numeric verification, WebFetch denied.

## Validator results

Pre-edit baseline (both files): INVALID with pre-existing structural issues (missing TOC, missing `## OVERVIEW` section; deep-review.md also has 2 H2-capitalization issues at sections 1 and 5).

Post-edit: SAME issue count. Zero NEW issues introduced.

```
$ python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/agents/deep-research.md
INVALID: 3 issues (unchanged from pre-edit baseline)

$ python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/agents/deep-review.md
INVALID: 5 issues (unchanged from pre-edit baseline)
```

**Note on validator state**: The validator classifies agent contracts as `readme` doctype, which requires `## TABLE OF CONTENTS` and `## OVERVIEW` sections plus ALL-CAPS H2 headers. The two agent files do not follow that template (they follow the agent contract pattern). Fixing the validator classification or adding TOC/overview blocks is OUT OF SCOPE for Phase 3 per the task scope contract ("Do NOT modify the LEAF contract").

## HVR voice compliance

Final scan of the new subsections produced ZERO hits for:
- em dashes (`—`)
- semicolons (`;`) in prose
- oxford commas (`, and ` / `, or ` in 3-item lists)
- banned HVR words

Two iteration passes were required. The first pass introduced 6 violations (2 em dashes, 4 semicolons, 3 oxford commas across both files). All were corrected before this evidence note was written.

## Scope contract verification

- WRITE TO: 2 agent files ONLY — confirmed.
- LEAF contract untouched — confirmed (no edits to role, sub-dispatch ban, Task tool ban, or scope lock rules).
- No edits to commands, YAMLs, cli-devin SKILL, or any other file — confirmed.
- Anchor pairs balance — confirmed (each file gained exactly one H3, no H2 added).
- HVR voice — confirmed clean in new subsections.

## Forward references for Phase 4

Both agents reference `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` which does not yet exist. Phase 4 must author this reference to close the forward link.
