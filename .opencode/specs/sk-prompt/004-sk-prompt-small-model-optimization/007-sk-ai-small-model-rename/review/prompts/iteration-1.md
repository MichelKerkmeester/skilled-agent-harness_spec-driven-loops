# Deep-Review iter-1 — 007 rename packet — dimension: CORRECTNESS

## Role
You are a senior deep-reviewer. Read-only audit. Cite EVIDENCE for every finding.

## Context
Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`
Target packet (just-shipped 2026-05-21): `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/007-sk-prompt-small-model-rename/`
Mode: **READ-ONLY** — do NOT edit any file. Emit findings only.

Spec folder is pre-approved (Gate 3 satisfied — write only to `<target>/review/iterations/iteration-1.md` + `<target>/review/deltas/iter-001.jsonl` if you can, otherwise emit to stdout for the orchestrator to write).

## Scope: CORRECTNESS dimension (iter 1)
The 007 packet performed a sentinel-skill rename: `sk-small-model` → `sk-prompt-small-model`. 22 live surfaces edited via `sed -i ''` + 5 `git mv` operations + compiled skill-graph.json regenerated + 2 incidental compiler-blocker fixes (`system-rerank-sidecar` category + `mcp-coco-index` reverse-sibling).

### Pre-planning (REQUIRED — fill before producing findings)

1. **Read** the 007 spec docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `changelog-114-007-rename-sk-prompt-small-model.md` (parent's changelog).
   - Acceptance: cite the file:lines for the spec scope §3 In Scope + Out of Scope lists; understand the live-vs-historical classifier.

2. **Verify** live-vs-historical classification correctness across 5 sample surfaces:
   - sk-prompt-small-model/SKILL.md (live, must be renamed)
   - cli-devin/graph-metadata.json edges.enhances[].target (live, must point at sk-prompt-small-model)
   - sk-prompt-small-model/changelog/v0.1.0.0.md + v0.2.0.0.md (historical, must NOT be edited)
   - 114/001-research-smallcode/spec.md (historical, must NOT be edited)
   - feedback_skill_graph_compiler_rebuild.md (memory, tagged-narrative pattern)
   - For each: run `rg "sk-small-model"` on the file; confirm the count matches the expected post-edit state per the classification.
   - Acceptance: for each of the 5 files, cite the actual rg count + the spec-defined expected count + verdict (match / mismatch).

3. **Hunt for missed surfaces** (correctness depth):
   - Run repo-wide `rg "sk-small-model"` and `rg -i "sk[-_]small[-_]model"` (case-insensitive variant per [[feedback_rename_grep_case_insensitive]]).
   - For each post-edit hit that is NOT on the spec's historical-preserve allow-list, flag as a P0/P1/P2 finding.
   - Acceptance: enumerate every hit not on the allow-list; classify as P0 (must-fix), P1 (likely missed), P2 (acceptable narrative).

### Action
Run pre-planning 1-3 in order, then emit findings.

### Output
Emit a JSON block under `## FINDINGS` with this schema:
```json
{
  "iteration": 1,
  "dimension": "correctness",
  "findings": [
    {
      "id": "F-001",
      "severity": "P0|P1|P2",
      "title": "<short title>",
      "evidence": "<file:lines + rg output>",
      "recommendation": "<concrete fix or 'accept as-is with documented rationale'>"
    }
  ],
  "newFindingsRatio": <0..1 — proportion of findings that did not appear in prior iters; iter-1 = 1.0>,
  "stop_recommendation": "continue | converged | escalate"
}
```

Also emit a `## NARRATIVE` markdown block (200-400 words) summarizing the dimension's assessment + 1-3 concrete recommendations.

End of prompt.
