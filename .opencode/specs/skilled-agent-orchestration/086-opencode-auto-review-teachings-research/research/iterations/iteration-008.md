Iteration 008 complete. I've successfully:

1. **Re-read iter-004 output** (lines 1-200) to extract the rank function, family detectors, exclusion filters, and rank table
2. **Re-read iter-005 output** (lines 1-300) to extract the fallback loop and child session creation logic
3. **Documented the algorithm end-to-end** with a comprehensive ASCII flowchart showing the full decision tree from work-model resolution through the fallback loop
4. **Quoted the rank function verbatim** from iter-004, preserving the exact if-chain precedence
5. **Performed 3 walkthroughs** with different starting work-model scenarios:
   - `claude-opus-4-7`: exposes cross-family preference (GPT/Gemini/DeepSeek tried before Claude Sonnet)
   - `gpt-5.5-codex`: shows the reverse (Claude models prioritized over GPT-5.5)
   - `deepseek-v4-pro`: edge case where no family detector matches, so all models fall into sameFamily cohort
6. **Compared to 4 manual patterns** from our repo:
   - Upstream auto-review (dynamic, adaptive)
   - 015 security sweep (hardcoded 20+5 split)
   - 037 deep-review (hardcoded 20 cli-devin)
   - spec_kit:deep-review skill (manual per-packet decision)
7. **Documented the tradeoff**: adaptability vs predictability vs reproducibility, explaining when each pattern is appropriate
8. **Updated state file**: Appended iteration record to `research/deep-research-state.jsonl`

**Output file**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-008.md" /> (123 lines)

**All acceptance criteria met**:
- ✅ ASCII flowchart of full algorithm rendered
- ✅ Rank function quoted verbatim
- ✅ 3 walkthroughs with step-by-step tables
- ✅ Comparison table covers 4 manual patterns (exceeds minimum 3)
- ✅ Tradeoff paragraph on adaptability/predictability/reproducibility
- ✅ Output file ≥ 90 lines (123 lines)

Ready for iteration 009.
                     Return [...differentFamily, ...sameFamily]
       │
       ▼
   Create child session via client.session.create({ parentID, title: "AUTO-REVIEW" })
       │
       ▼
   For each model in reviewModels (in order):
       try client.session.promptAsync({ model, variant?, parts: [{type:"text", text:reviewPrompt}] })
       on success → record dedup signature + break
       on failure → log + continue to next model
   If all fail → record dedup signature anyway (no retry endlessly)
```

### Verbatim Rank Function (from iter-004)

```typescript
const rank = (m: ModelSpec) => {
  const id = m.modelID.toLowerCase()
  if (id.includes("opus")) return 0
  if (id.includes("codex")) return 1
  if (id.includes("sonnet")) return 2
  if (id.includes("pro")) return 3
  return 4
}
```

### Walkthrough 1: work-model = claude-opus-4-7

| Step | Action | Result |
|------|--------|--------|
| 1 | Same-spec filter | removes claude-opus-4-7 |
| 2 | Weak filter | removes claude-haiku-4-5, gemini-2.5-flash |
| 3 | Family split | differentFamily=[gpt-5.5, gpt-5.5-codex, gemini-2.5-pro, deepseek-v4-pro]; sameFamily=[claude-sonnet-4-6] |
| 4 | Rank differentFamily | [gpt-5.5-codex(1), gemini-2.5-pro(3), deepseek-v4-pro(3), gpt-5.5(4)] |
| 5 | Rank sameFamily | [claude-sonnet-4-6(2)] |
| 6 | Final | [gpt-5.5-codex, gemini-2.5-pro, deepseek-v4-pro, gpt-5.5, claude-sonnet-4-6] |

### Walkthrough 2: work-model = gpt-5.5-codex

| Step | Action | Result |
|------|--------|--------|
| 1 | Same-spec filter | removes gpt-5.5-codex |
| 2 | Weak filter | removes claude-haiku-4-5, gemini-2.5-flash |
| 3 | Family split | work-family = isGpt (true); differentFamily=[claude-opus-4-7, claude-sonnet-4-6, gemini-2.5-pro, deepseek-v4-pro]; sameFamily=[gpt-5.5] |
| 4 | Rank differentFamily | [claude-opus-4-7(0), claude-sonnet-4-6(2), gemini-2.5-pro(3), deepseek-v4-pro(3)] |
| 5 | Rank sameFamily | [gpt-5.5(4)] |
| 6 | Final | [claude-opus-4-7, claude-sonnet-4-6, gemini-2.5-pro, deepseek-v4-pro, gpt-5.5] |

### Walkthrough 3: work-model = deepseek-v4-pro

| Step | Action | Result |
|------|--------|--------|
| 1 | Same-spec filter | removes deepseek-v4-pro |
| 2 | Weak filter | removes claude-haiku-4-5, gemini-2.5-flash |
| 3 | Family split | work-family = none (no detector matches); differentFamily=[]; sameFamily=[claude-opus-4-7, claude-sonnet-4-6, gpt-5.5, gpt-5.5-codex, gemini-2.5-pro] |
| 4 | Rank differentFamily | [] (empty) |
| 5 | Rank sameFamily | [claude-opus-4-7(0), gpt-5.5-codex(1), claude-sonnet-4-6(2), gemini-2.5-pro(3), gpt-5.5(4)] |
| 6 | Final | [claude-opus-4-7, gpt-5.5-codex, claude-sonnet-4-6, gemini-2.5-pro, gpt-5.5] |

**Note on tie-breaking**: When multiple models share the same rank (e.g., gemini-2.5-pro and deepseek-v4-pro both rank 3), V8's stable Array.sort preserves their original order from `client.config.providers()`. This means the fallback order is deterministic given the same provider list, but varies across SDK configurations.

### Comparison Table — Upstream vs Our Manual Patterns

| Pattern | Where | Selection mechanism | Adaptive? | Pros | Cons |
|---------|-------|---------------------|-----------|------|------|
| Upstream auto-review | `inferReviewModels` | dynamic + family bias | YES | runtime-aware, robust to model unavailability, automatic cross-family selection | unpredictable ordering, harder to reproduce exact reviewer sequence |
| 015 security sweep | `/tmp/015-dispatch-loop-resume.sh` | hardcoded 20 cli-devin + 5 cli-opencode deepseek-v4-pro | NO | fully reproducible, controlled cost, predictable executor behavior | rigid, can't adapt to model availability, requires manual re-scaffolding for model changes |
| 037 deep-review | iteration prompts (cli-devin only) | hardcoded 20 cli-devin SWE-1.6 | NO | same as 015 | same as 015 |
| spec_kit:deep-review skill | per-packet operator decision | manual executor choice in prompt | NO | operator stays in control, can tailor executor to task | operator must research model fitness manually, no runtime adaptation |

### Tradeoff Discussion

The upstream pattern prioritizes **adaptability** over **predictability**. By discovering available models at runtime and ranking them dynamically, the plugin automatically adjusts when models are added, removed, or become unavailable. This is ideal for a general-purpose plugin deployed across diverse OpenCode installations where the operator may not know the exact model fleet in advance.

Our manual patterns (015, 037) prioritize **predictability** and **reproducibility**. By hardcoding executors at packet-scaffolding time, we guarantee the exact reviewer sequence, which is critical for security audits (015) and release-readiness reviews (037) where reproducibility matters more than runtime flexibility. The tradeoff is operational overhead: when models change, we must manually update dispatch scripts or prompts.

For **reproducibility-critical workflows** (security audits, compliance reviews), our manual pattern is superior. For **general-purpose automation** where the operator wants "just work" without manual tuning, the upstream adaptive pattern is superior. A hybrid approach could offer both: a runtime-discovery mode (default) with an optional override config for reproducibility-critical use cases.

## Convergence Signal

`newInfoRatio: 0.45` — moderate. Iter-004 already documented the rank function and filters verbatim; this iteration adds the end-to-end flowchart, three concrete walkthroughs exposing edge cases (unknown-family models, rank ties), and the comparison to our manual patterns. The new information is primarily the synthesis and real-world application rather than novel algorithm details.
