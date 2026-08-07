# Iteration 005: Fan-Out Convergence Threading Verification (fanout-run.cjs)

## Focus
- Scope: Does fanout-run.cjs correctly thread the resolved --convergence value into each lineage prompt (config.convergenceThreshold)?
- Question: Verify convergence threading is correct or identify gaps

## Findings

### F-005: Convergence threading is correctly implemented in BOTH prompt and CLI paths — but the prompt path has a silent-fallback gap

**Severity: Medium (correctness gap with operator surprise)**

**Positive confirmation: Convergence IS threaded.**

Two dispatch paths exist in `fanout-run.cjs`:

**Path A — CLI executor prompt (`buildLineagePrompt`, line 726+):**
- Line 805-806: `if (options.convergenceThreshold !== null && options.convergenceThreshold !== undefined) { params.push('  config.convergenceThreshold: ' + options.convergenceThreshold); }`
- The threshold is threaded into the prompt text ONLY when explicitly provided
- If NOT provided, the prompt omits `config.convergenceThreshold` entirely — the lineage inherits whatever the YAML workflow default is (0.05 for research, 0.10 for review)
[SOURCE: `fanout-run.cjs:805-806`]

**Path B — Native command input (`buildNativeCommandInput`, line 844+):**
- Line 846: `const convergenceThreshold = options.convergenceThreshold ?? 0.1;` — defaults to 0.1 if not provided
- Line 853: `--convergence=${convergenceThreshold}` — always passed as CLI flag
- Line 873: `convergenceThreshold: ${convergenceThreshold}` — always in PRE-BOUND SETUP ANSWERS
[SOURCE: `fanout-run.cjs:846,853,873`]

**The gap: Path A (CLI executor) silently falls back to YAML default when operator omits --convergence.**

When an operator runs `/deep:research --executors glm --convergence 0.01`, the threshold is threaded correctly. But when they omit `--convergence`, Path A sends NO `config.convergenceThreshold` line in the prompt, and the lineage agent reads the YAML default (0.05 for research). Meanwhile, Path B would send `--convergence=0.1` (its hardcoded default).

This means:
- **CLI executor path** (Path A): No explicit threshold → agent uses YAML default (0.05 research)
- **Native command path** (Path B): Hardcoded default 0.1 → overrides YAML default

The two paths disagree on the default threshold (0.05 vs 0.10). An operator switching between executor types without specifying `--convergence` gets different convergence behavior with no warning.

**Secondary finding: The `convergenceThreshold` condition check uses `!== null && !== undefined` (line 805).**

If `options.convergenceThreshold` is explicitly set to `0` (numeric zero), the check passes correctly (`0 !== null && 0 !== undefined` is true). So a zero threshold (no convergence floor) would be correctly threaded. This is correct.

**Recommendation:**
1. Make Path A's default explicit: `const convergenceThreshold = options.convergenceThreshold ?? null;` and always emit the line (even if null), so the lineage agent knows the operator's intent
2. Align Path B's default with the research YAML default (0.05) instead of 0.1, OR make Path B also conditionally omit the flag
3. Add a log line in `fanout-run.cjs` that reports the effective convergence threshold per lineage at dispatch time

## Novelty Justification
Confirmed the convergence threading works when explicitly provided (resolving the open question from the research topic). New finding: the two dispatch paths disagree on the implicit default (0.05 YAML vs 0.1 native), creating an executor-type-dependent convergence surprise.

## What Was Tried and Failed
- Checked if the disagreement was documented in an ADR (it was not)

## Ruled-Out Directions
- The threading is NOT broken for explicit --convergence values (verified correct)
