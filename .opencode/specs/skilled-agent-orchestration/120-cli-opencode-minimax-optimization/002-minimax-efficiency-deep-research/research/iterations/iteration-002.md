# Iteration 2: Q2 - MiniMax Context Budget and Output Verification

## Focus

Derive the MiniMax 2.7 context-budget tuple and output-verification recipe from the confirmed 204,800-token window, while reusing the existing 114 budget engine and verification pipeline instead of creating MiniMax-specific copies.

## Actions Taken

- Read the current deep-research state, strategy, and iteration 1 narrative to confirm Q2 is the next focus and that Q1 already established the 204,800-token MiniMax window plus native tool/interleaved-thinking continuity requirement. [SOURCE: .opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl:2] [SOURCE: .opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-001.md:16]
- Read the canonical 114 context-budget reference and `per-model-budgets.json` to identify the fields MiniMax should reuse. [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:25] [SOURCE: .opencode/skills/cli-devin/assets/per-model-budgets.json:4]
- Read the cli-opencode context-budget mirror to verify it is intentionally link-only and should not duplicate the cli-devin engine. [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:10] [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:16]
- Read the output-verification reference to map MiniMax onto the existing compile, execute, smoke-test, and lint gates plus the research-output rubric. [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:31] [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:80]
- Checked the registry and pattern index to name concrete file-level deltas without moving pattern ownership into `sk-prompt-small-model`. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:187] [SOURCE: .opencode/skills/sk-prompt-small-model/references/pattern-index.md:25]

## Findings

### F1 - MiniMax should use the existing 114 tuple shape with a 143,360-token dynamic ceiling

The canonical budget engine uses `total_budget = model_context_length * max_budget_pct / 100`, with `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, and `[... truncated %d tokens]` as the marker template. [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:40] [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:48] [SOURCE: .opencode/skills/cli-devin/assets/per-model-budgets.json:4]

For MiniMax 2.7, the confirmed context window is 204,800 tokens. The resulting tuple is:

```json
{
  "id": "minimax-2.7",
  "provider": "MiniMax",
  "context_length": 204800,
  "max_budget_pct": 70,
  "working_memory_tokens": 500,
  "summary_threshold_lines": 200,
  "truncation_marker_template": "[... truncated %d tokens]",
  "notes": "Direct MiniMax.io cli-opencode model. 70% dynamic budget yields 143360 tokens; reserve 61440 tokens for system/output/tool-call overhead. Preserve the most recent complete assistant/tool-result/thinking continuity block; evict older tool_results first, then older conversation, then working_memory."
}
```

The token split is therefore 143,360 tokens for bounded dynamic prompt content and 61,440 tokens reserved for system framing, output, active tool-call overhead, and safety margin. Within the dynamic budget, `working_memory` remains the fixed 500-token protected task-state slot, and the remaining 142,860 tokens are governed by the existing conversation/tool-result eviction ladder rather than a new per-category cap. [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:50] [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:59] [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:196]

### F2 - Interleaved tool continuity changes truncation policy, not the budget engine

Iteration 1 found that MiniMax tool-use runs require preserving the complete assistant response across tool rounds, including tool calls and reasoning fields. [SOURCE: .opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-001.md:34]

That requirement should become a MiniMax-specific note inside the existing budget guidance: do not summarize or truncate the active assistant/tool-result/thinking exchange as a raw `tool_results` blob. Treat the latest complete tool round as part of the protected recent conversation/working set, then apply the existing eviction order to older tool results first, older conversation second, working memory third, and never the system prompt. [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:84] [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:207]

Concrete truncation policy: use the same `[... truncated N tokens]` marker; place it after retained content; never infer hidden evidence; and when truncating MiniMax tool transcripts, cut only at complete message boundaries so reasoning/tool-call continuity is not broken mid-round. [SOURCE: .opencode/skills/cli-devin/references/context-budget.md:151] [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:46]

### F3 - cli-opencode should stay a mirror, with MiniMax added as a model-window row

The cli-opencode context-budget file explicitly says the canonical semantics live in `cli-devin/references/context-budget.md` and `cli-devin/assets/per-model-budgets.json`; the mirror only records cli-opencode routing and model-window differences. [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:10] [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:20]

The MiniMax delta should therefore be link-only in `cli-opencode/references/context-budget.md`: add a row for `minimax-2.7` with a 204,800-token window, note that it slightly exceeds Kimi's current 200,000-token row, and add the message-boundary continuity caveat. Do not copy the full budget calculator or eviction table into cli-opencode. [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:34] [SOURCE: .opencode/skills/sk-prompt-small-model/references/pattern-index.md:62]

### F4 - The output-verification recipe is the existing 4-stage pipeline plus a MiniMax continuity check

The existing pipeline is compile, execute, smoke-test, and lint, with research-output equivalents of cite-accuracy, structure-pass, recommendation-actionability, and anti-hallucination. [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:31] [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:90]

MiniMax should not get a separate verifier. The recipe should be:

- For pure research iterations, keep verification disabled or N/A when no supported fenced code is produced, matching the current rule. [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:84]
- For reusable code output, use the existing supported-language scorer and default 0.50 threshold; below-threshold output emits `verification_degraded`. [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:116] [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:161]
- For MiniMax agent/tool-use tests, add one output-specific assertion outside the core verifier: the transcript or event parser must preserve complete assistant messages, tool calls, tool results, and thinking/reasoning continuity for the active round. This is an integration invariant, not a fifth compile-like stage.

### F5 - Concrete file-level deltas for Q2

Recommended Q2 deltas:

1. `.opencode/skills/cli-devin/assets/per-model-budgets.json`: append the `minimax-2.7` entry above, preserving schema version 1 and the existing defaults. This gives both cli-devin-owned budget docs and cli-opencode mirrors one canonical data row. [SOURCE: .opencode/skills/cli-devin/assets/per-model-budgets.json:1]
2. `.opencode/skills/cli-opencode/references/context-budget.md`: add `minimax-2.7 | 204,800 | Direct MiniMax.io API; apply canonical 70% budget; preserve active interleaved tool/thinking message boundaries.` [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md:36]
3. `.opencode/skills/sk-prompt/assets/model-profiles.json`: set `context_length` for `minimax-2.7` to `204800`, and replace the unverified context wording with verified context plus remaining `--variant` uncertainty. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:187]
4. `.opencode/skills/cli-devin/references/output-verification.md` or the cli-opencode MiniMax provider reference: add a short MiniMax-specific continuity note that reuses the existing verification pipeline and treats message-boundary preservation as an integration assertion. The better ownership choice is cli-opencode provider docs unless future automation needs this in the shared verifier. [SOURCE: .opencode/skills/cli-devin/references/output-verification.md:201]
5. `.opencode/skills/sk-prompt-small-model/references/pattern-index.md`: no new pattern row is needed. At most update ownership text to mention MiniMax under cli-opencode's executor surface; the pattern bodies already cover new-provider adoption. [SOURCE: .opencode/skills/sk-prompt-small-model/references/pattern-index.md:66]

## Questions Answered

- Q2 is substantially answered: MiniMax should reuse the 114 budget tuple with `context_length: 204800`, `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, and the canonical truncation marker.
- The computed budget is 143,360 dynamic prompt tokens and 61,440 reserved tokens.
- The output-verification answer is reuse, not rebuild: existing 4-stage verification plus MiniMax-specific active tool-round continuity checks.

## Questions Remaining

- Q3: determine prompt-quality/RCAF patterns and safe `--variant`/reasoning-effort mapping, with ablation before any strong claim.
- Q4: decide whether `minimax-api` should gain a different-pool fallback target or stay fail-fast.
- Q5: synthesize routing heuristics versus DeepSeek, Qwen, Kimi, and GLM, then produce final patch-ready deltas.

## Next Focus

Q3: Define MiniMax prompt-quality/RCAF guidance and a safe `--variant` mapping policy. The next iteration should avoid asserting that `--variant high` changes MiniMax reasoning until a live ablation or provider documentation proves the mapping.
