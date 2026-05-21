#!/usr/bin/env bash
# Sequential iter runner for the 016 deep-research dispatch.
# Each iter is one cli-codex call. No agent orchestration; agent stream
# watchdogs killed iters 2-10 in the prior two attempts.

set -euo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
RESEARCH="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research"
ITERS="$RESEARCH/iterations"
DELTAS="$RESEARCH/deltas"
PROMPTS="$RESEARCH/prompts"
STATE="$RESEARCH/deep-research-state.jsonl"
mkdir -p "$ITERS" "$DELTAS" "$PROMPTS"

cd "$REPO_ROOT"

# Each iter: (iter_number, focus_label, target_path)
declare -a FOCUSES=(
  "2|arc 001 local-embeddings-foundation|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation"
  "3|arc 002 spec-memory-stack|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack"
  "4|arc 003 skill-advisor-stack|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack"
  "5|arc 004 code-index-stack|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack"
  "6|arc 005 cross-cutting-quality|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality"
  "7|arc 006 mcp-launcher-concurrency|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc"
  "8|arc 007 ollama-and-bge-promotion|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc"
  "9|cross-arc consistency + global hygiene|.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture"
)

# Iter 10 is synthesis; handled separately.

# Per-iter prompt template
build_prompt() {
    local iter="$1" focus="$2" target="$3"
    local prompt_file="$PROMPTS/iter-$(printf '%03d' "$iter").md"
    cat > "$prompt_file" <<EOF
You are iteration $iter of a 10-iter deep-research dispatch on the 016 umbrella under \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/\`. Iter-1 audited arc 008 (already on disk). This iter's focus is **$focus**.

## Pre-bindings

- Working directory: \`$REPO_ROOT\`
- Target for this iter: \`$target\`
- Spec folder (pre-approved, skip Gate 3): \`$RESEARCH/..\`
- Read-only against source. Writes ONLY to \`$RESEARCH/iterations/iteration-$(printf '%03d' "$iter").md\` and the JSONL state.

## Research framing (4 categories, each finding classifies into one)

1. **UNSHIPPED**: spec docs/commits CLAIM work was done but code doesn't actually do it.
2. **DEAD**: code/env vars/config/doc references that are unreachable, unused, or superseded.
3. **BUGGED**: looks correct but has logic error or contract drift (template: env-default-mismatch fixed in da33c866d).
4. **MISSED**: open questions never answered, risks without mitigations, "fix in follow-on" promises with no follow-on.

## Avoid duplicating prior iters

Iter-1 already covered arc 008. Read \`$ITERS/iteration-001.md\` for context if needed but do NOT re-report its findings. Focus only on this iter's target.

## Output

Write \`$ITERS/iteration-$(printf '%03d' "$iter").md\` with the canonical structure:

\`\`\`markdown
## Focus

[1-2 sentences naming the iter's target]

## Actions Taken

[Numbered list of reads, greps, comparisons]

## Findings

| Finding ID | Category | File:line + grep evidence | Recommended action |
|---|---|---|---|
| f-iter$(printf '%03d' "$iter")-001 | <CAT> | <evidence> | <action> |
...
\`\`\`

Append one JSONL line to \`$RESEARCH/deep-research-state.jsonl\` with:

\`\`\`json
{"type":"iteration","iteration":$iter,"focus":"$focus","status":"complete","findingCount":<N>,"completedAt":"<ISO>"}
\`\`\`

## Process

1. Skim \`$target\`'s spec.md / plan.md / tasks.md / implementation-summary.md / graph-metadata.json.
2. Spot-check 2-3 source files referenced by those docs.
3. Run 2-3 grep probes for terms the docs mention (env vars, function names, file paths).
4. Compare commits in the arc's history (git log on the path) against the docs' claims.
5. Classify findings into the 4 categories with concrete file:line evidence.

Target 3-8 findings per iter. Quality > quantity. SUSPECTED is acceptable when uncommitted state diverges from docs.
EOF
    echo "$prompt_file"
}

# Run iter
run_iter() {
    local iter="$1" focus="$2" target="$3"
    local iter_padded
    iter_padded=$(printf '%03d' "$iter")
    local out_md="$ITERS/iteration-$iter_padded.md"
    local raw_log="$ITERS/iteration-$iter_padded.raw.log"

    if [[ -f "$out_md" && -s "$out_md" ]]; then
        echo "[iter $iter] already complete; skipping"
        return 0
    fi

    local prompt_file
    prompt_file=$(build_prompt "$iter" "$focus" "$target")
    echo "[iter $iter] dispatching cli-codex (focus: $focus)"

    local start
    start=$(date +%s)
    if codex exec --model gpt-5.5 \
        -c model_reasoning_effort=high \
        -c service_tier=fast \
        -c approval_policy=never \
        --sandbox workspace-write \
        -c sandbox_workspace_write.network_access=true \
        "$(cat "$prompt_file")" > "$raw_log" 2>&1; then
        local elapsed=$(($(date +%s) - start))
        echo "[iter $iter] cli-codex exited 0 in ${elapsed}s"
    else
        local exit_code=$?
        local elapsed=$(($(date +%s) - start))
        echo "[iter $iter] cli-codex exited $exit_code after ${elapsed}s (raw log preserved)"
    fi

    # cli-codex wrote the iteration file directly per the prompt's contract
    if [[ ! -f "$out_md" ]]; then
        echo "[iter $iter] WARNING: iteration file not present; cli-codex may have failed to follow the write contract"
    fi
}

# Synthesis iter
run_synthesis() {
    local iter_padded="010"
    local out_md="$ITERS/iteration-$iter_padded.md"
    local synth_md="$RESEARCH/research.md"
    local raw_log="$ITERS/iteration-$iter_padded.raw.log"

    if [[ -f "$synth_md" && -s "$synth_md" ]]; then
        echo "[synth] already complete; skipping"
        return 0
    fi

    local prompt_file="$PROMPTS/iter-010-synthesis.md"
    cat > "$prompt_file" <<EOF
You are iteration 10 (synthesis) of the 016 deep-research dispatch. All 9 prior iters are on disk at \`$ITERS/iteration-NNN.md\`. Read every iter file (001-009) and produce a single consolidated synthesis at \`$RESEARCH/research.md\`.

Also write \`$ITERS/iteration-010.md\` as a brief audit-trail noting which iters were synthesized.

## Pre-bindings

- Working directory: \`$REPO_ROOT\`
- Spec folder (pre-approved): \`$RESEARCH/..\`
- Read-only against source.

## research.md structure

\`\`\`markdown
---
title: "016 Deep-Research Synthesis"
description: "Coverage + hygiene audit across all 8 arcs of the 016 umbrella, 4 categories (UNSHIPPED / DEAD / BUGGED / MISSED), iters 1-9."
---

# 016 Deep-Research Synthesis

## 1. Overview
[Summary of methodology + iter count + total findings]

## 2. Findings by Category

### UNSHIPPED (N findings)
| ID | File:line | What | Recommended action |
| ... |

### DEAD (N findings)
...

### BUGGED (N findings)
...

### MISSED (N findings)
...

## 3. Cross-Arc Patterns
[Anything that recurs across multiple arcs]

## 4. Recommended Priority
[Top 5-10 findings ranked by impact × effort]

## 5. Out of Scope
[Things the research deliberately did not cover]

## 6. Convergence Notes
[Whether iters 8-9 produced fewer new findings than 2-7 — basic convergence signal]
\`\`\`

Read iter-1 through iter-9 markdown files in order; merge their findings into the categories. Preserve original finding IDs. Then rank by impact × effort in §4.
EOF

    echo "[synth] dispatching cli-codex (synthesis)"
    codex exec --model gpt-5.5 \
        -c model_reasoning_effort=high \
        -c service_tier=fast \
        -c approval_policy=never \
        --sandbox workspace-write \
        -c sandbox_workspace_write.network_access=true \
        "$(cat "$prompt_file")" > "$raw_log" 2>&1 || true
}

# Main loop
for entry in "${FOCUSES[@]}"; do
    IFS='|' read -r iter focus target <<< "$entry"
    run_iter "$iter" "$focus" "$target"
done

run_synthesis

echo "[done] $(ls "$ITERS"/iteration-*.md 2>/dev/null | wc -l | tr -d ' ') iter files; research.md $([[ -f "$RESEARCH/research.md" ]] && echo present || echo MISSING)"
