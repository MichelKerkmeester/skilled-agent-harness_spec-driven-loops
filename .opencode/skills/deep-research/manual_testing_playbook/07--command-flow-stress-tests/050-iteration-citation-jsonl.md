---
title: "CP-050 -- ITERATION_CITATION_JSONL leaf output contract **(SANDBOXED)**"
description: "Validate that the command-dispatched @deep-research body writes a cited iteration file and exactly one schema-rich JSONL iteration record."
---

# CP-050 -- ITERATION_CITATION_JSONL leaf output contract **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-050`.

> **SANDBOXED SCENARIO**: All command files live under `/tmp/cp-050-sandbox/`. Research artifacts live under `/tmp/cp-050-spec/`.

## 1. OVERVIEW

This scenario enters through `/deep:start-research-loop:auto` but grades body-level evidence produced by the leaf iteration: cited findings, required sections, exactly one JSONL iteration record, novelty justification and source/tool fields.

### Why This Matters

The command can dispatch correctly while the agent body still returns success-shaped prose without durable research. This CP tests the leaf-owned artifact contract under the command loop.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CP-050` and grade only concrete artifacts.

- Objective: Confirm iteration markdown exists with required sections and citations, JSONL contains one iteration record with required fields, and containment holds.
- Layer partition: body-level.
- Real user request: `Run one deep-research iteration and prove the leaf wrote cited findings plus schema-rich JSONL.`
- Prompt: `Run one deep-research iteration and prove cited findings plus schema-rich JSONL are written.`
- Expected process: seed a spec with a local source reference, run Call A, reset sandbox, run command-flow Call B, then inspect the leaf-written iteration and JSONL.
- Expected signals: section headings, `[SOURCE:` or `[INFERENCE:`, one `"type":"iteration"`, `noveltyJustification`, `toolsUsed`, `sourcesQueried`, clean diffs.
- Pass/fail: PASS if all leaf artifact counts are non-zero and exactly one iteration record exists. FAIL if findings stay only in transcript or JSONL is missing required fields.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Build the sandbox.
2. Seed a spec with a narrow local-source research topic.
3. Run Call A as the generic baseline.
4. Reset the sandbox.
5. Run Call B through `/deep:start-research-loop:auto`.
6. Validate iteration body, JSONL fields, clean canonical diff and tripwire.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-050-sandbox /tmp/cp-050-sandbox-baseline /tmp/cp-050-spec
mkdir -p /tmp/cp-050-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-050-sandbox
cp -a /tmp/cp-050-sandbox /tmp/cp-050-sandbox-baseline
cat > /tmp/cp-050-spec/spec.md <<'EOF'
---
title: "CP-050 Iteration Citation"
description: "Sandbox spec for leaf citation and JSONL discipline."
---
# CP-050 Iteration Citation
## Requirements
- Cite local source anchors from the sandboxed deep-research agent and skill.
## Scope
- Use local files in /tmp/cp-050-sandbox.
## Open Questions
- Which body-level rules require cited iteration output?
## Research Context
- The sandbox contains .opencode/agents/deep-research.md and .opencode/skills/deep-research/SKILL.md.
EOF
git status --porcelain > /tmp/cp-050-pre.txt
cat > /tmp/cp-050-task.txt <<'EOF'
Task ID: CP-050-TASK-001.
In /tmp/cp-050-sandbox/, run /deep:start-research-loop:auto for one iteration.
Stay strictly inside /tmp/cp-050-sandbox/ and /tmp/cp-050-spec/.
Acceptance: iteration-001.md contains Focus, Findings, Sources Consulted, Assessment, Reflection, Recommended Next Focus and SOURCE or INFERENCE markers. JSONL has exactly one iteration record with noveltyJustification, toolsUsed and sourcesQueried.
Return status, iteration_path, jsonl_append_count, citation_count, and notes.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-050-task.txt)" > /tmp/cp-050-prompt-A.txt
copilot -p "$(cat /tmp/cp-050-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-050-sandbox --add-dir /tmp/cp-050-spec 2>&1 | tee /tmp/cp-050-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-050-A-exit.txt
rm -rf /tmp/cp-050-sandbox && cp -a /tmp/cp-050-sandbox-baseline /tmp/cp-050-sandbox
cd /tmp/cp-050-sandbox
copilot -p "/deep:start-research-loop:auto \"CP-050 local source citation discipline\" --spec-folder=/tmp/cp-050-spec --max-iterations=1 --convergence=0.05" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-050-sandbox --add-dir /tmp/cp-050-spec 2>&1 | tee /tmp/cp-050-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-050-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-050-sandbox-baseline/.opencode/agents/deep-research.md /tmp/cp-050-sandbox/.opencode/agents/deep-research.md > /tmp/cp-050-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-050-B-canonical-exit.txt
find /tmp/cp-050-spec -type f -print0 2>/dev/null | xargs -0 cat > /tmp/cp-050-B-artifacts.txt 2>/dev/null || touch /tmp/cp-050-B-artifacts.txt
cat /tmp/cp-050-B-command.txt /tmp/cp-050-B-artifacts.txt > /tmp/cp-050-B-combined.txt
git status --porcelain > /tmp/cp-050-post.txt
diff /tmp/cp-050-pre.txt /tmp/cp-050-post.txt > /tmp/cp-050-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-050-tripwire-exit.txt
{ test -s /tmp/cp-050-spec/research/iterations/iteration-001.md && echo 1 || echo 0; grep -c '^## Focus\|^## Findings\|^## Sources Consulted\|^## Assessment\|^## Reflection\|^## Recommended Next Focus' /tmp/cp-050-spec/research/iterations/iteration-001.md 2>/dev/null || echo 0; grep -c '\[SOURCE:\|\[INFERENCE:' /tmp/cp-050-spec/research/iterations/iteration-001.md 2>/dev/null || echo 0; n=$(grep -c '"type"[[:space:]]*:[[:space:]]*"iteration"' /tmp/cp-050-spec/research/deep-research-state.jsonl 2>/dev/null || true); [[ "$n" -eq 1 ]] && echo 1 || echo 0; grep -c 'noveltyJustification' /tmp/cp-050-spec/research/deep-research-state.jsonl 2>/dev/null || echo 0; grep -c 'toolsUsed' /tmp/cp-050-spec/research/deep-research-state.jsonl 2>/dev/null || echo 0; grep -c 'sourcesQueried' /tmp/cp-050-spec/research/deep-research-state.jsonl 2>/dev/null || echo 0; grep -q 'POST_B_CANONICAL_DIFF=0' /tmp/cp-050-B-canonical-exit.txt && echo 1 || echo 0; grep -q 'TRIPWIRE_DIFF_EXIT=0' /tmp/cp-050-tripwire-exit.txt && echo 1 || echo 0; } | tee /tmp/cp-050-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-050 | ITERATION_CITATION_JSONL | Confirm leaf writes cited iteration plus JSONL | `Run one deep-research iteration and prove cited findings plus schema-rich JSONL are written.` | Run the §3 bash block | B field counts all >= 1 | iteration file, state log, diffs | PASS if cited sections and exactly one iteration record exist | 1. If iteration file is missing, inspect leaf dispatch. 2. If citations are absent, repair body citation rule. 3. If JSONL fields are missing, inspect append schema. |

## 4. SOURCE ANCHORS

| File | Anchor |
|---|---|
| `.opencode/commands/deep/start-research-loop.md:157-179` | command dispatches fresh leaf iterations and writes packet artifacts |
| `.opencode/agents/deep-research.md:63-75` | single iteration protocol |
| `.opencode/agents/deep-research.md:177-220` | required iteration file sections |
| `.opencode/agents/deep-research.md:231-260` | exactly one JSONL record and fields |
| `.opencode/agents/deep-research.md:275-287` | output verification |
| `.opencode/skills/deep-research/SKILL.md:450-459` | per-iteration quality gate criteria |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:794-817` | post-dispatch schema validation |

## 5. SOURCE METADATA

- Group: Command Flow Stress
- Playbook ID: CP-050
- Layer partition: body-level
- Preflight: 13/13 questions pass
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--command-flow-stress-tests/050-iteration-citation-jsonl.md`
- Sandbox: `/tmp/cp-050-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~5-8 min
