# Deep Research Iteration 008 of 20 — Cross-model selection (inferReviewModels ranking + fallback chain)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 8 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 004 documented `inferReviewModels` with verbatim rank function, family detectors, exclusion filters, and rank table for our common models
- Iter 005 documented the fallback loop (`for (const reviewModel of reviewModels)` with break-on-first-success)

**Why this iter exists**: cross-AI reviewer selection is the central novelty of this plugin. Our own ecosystem uses TWO-EXECUTOR splits (cli-devin + cli-opencode in packet 015; cli-devin + cli-codex in packet 037), but those are MANUAL choices encoded in dispatch scripts. The upstream plugin AUTOMATICALLY selects a cross-family reviewer at runtime from whatever models OpenCode's SDK reports as available. That's a meaningfully different design point.

**Your iter's job**: produce a polished extraction of the algorithm + a comparison-ready summary that iter 016 (gap-vs-sk-code-review) and iter 018 (gap-vs-plugins) can consume.

## TASK

### Step 1 — Re-read iter 004 output

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-004.md
```

Pull: family detectors, exclusion filters, family preference logic, rank function verbatim, rank table.

### Step 2 — Re-read iter 005 output for the fallback loop

```bash
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-005.md
```

Pull: the `for (const reviewModel of reviewModels)` loop, the `await client.session.promptAsync(...)` call with `model: reviewModel` and optional `variant: REVIEW_REASONING`, the `break` on success, the fall-through handling.

### Step 3 — Document the algorithm end-to-end

Render a flowchart in ASCII:

```text
Entry: workModel = resolveWorkModel(lastAssistant)
       availableModels = list from client.config.providers()
       │
       ▼
   REVIEW_MODEL configured?
       │
       ├── Yes → reviewModels = [parseModelSpec(REVIEW_MODEL)]
       │
       └── No  → reviewModels = inferReviewModels(workModel, availableModels)
                                 │
                                 ▼
                       Filter same-spec   (drop workModel)
                                 │
                                 ▼
                       Filter weak models (drop haiku, flash)
                                 │
                                 ▼
                       Split by family    (differentFamily / sameFamily)
                                 │
                                 ▼
                       Sort each cohort   (opus=0, codex=1, sonnet=2, pro=3, else=4)
                                 │
                                 ▼
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

### Step 4 — Real-world walkthrough on our model fleet

Assume work was done by `anthropic/claude-opus-4-7` and available models include:

| Provider | Models |
|----------|--------|
| anthropic | claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5 |
| openai | gpt-5.5, gpt-5.5-codex |
| google | gemini-2.5-pro, gemini-2.5-flash |
| deepseek | deepseek-v4-pro |

Apply the algorithm step-by-step:

1. Same-spec filter removes `claude-opus-4-7`
2. Weak filter removes `claude-haiku-4-5` and `gemini-2.5-flash`
3. Work-family: `isClaude(claude-opus-4-7)` = true
4. `differentFamily`: every model that isn't claude → `[gpt-5.5, gpt-5.5-codex, gemini-2.5-pro, deepseek-v4-pro]`
5. `sameFamily`: `[claude-sonnet-4-6]`
6. Rank differentFamily: gpt-5.5(4), codex(1), gemini-2.5-pro(3), deepseek-v4-pro(3)
   → sorted: `[gpt-5.5-codex, gemini-2.5-pro, deepseek-v4-pro, gpt-5.5]`
7. Rank sameFamily: sonnet(2)
   → `[claude-sonnet-4-6]`
8. Final: `[gpt-5.5-codex, gemini-2.5-pro, deepseek-v4-pro, gpt-5.5, claude-sonnet-4-6]`
9. Fallback chain: tries gpt-5.5-codex first; if SDK rejects, tries gemini-2.5-pro; etc.

Repeat the walkthrough for work-model = `gpt-5.5-codex` and work-model = `deepseek-v4-pro` to expose edge cases.

### Step 5 — Compare to our manual cross-AI patterns

| Pattern | Where | Selection mechanism | Adaptive? |
|---------|-------|---------------------|-----------|
| 015 security sweep | `/tmp/015-dispatch-loop-resume.sh` | hardcoded: 20 cli-devin + 5 cli-opencode | No |
| 037 deep-review | `037/research/prompts/iteration-*.md` | hardcoded: 20 cli-devin + 5 cli-codex | No |
| Upstream auto-review | `inferReviewModels` | dynamic, runtime-discovery + family bias | Yes |
| Our `spec_kit:deep-review` | iteration prompts | user-specified executor per packet | Mostly no |

The contrast: their pattern adapts at runtime based on what models the SDK reports; ours is locked at packet-scaffolding time. Discuss the tradeoffs (adaptability vs predictability vs reproducibility).

## SCOPE

- `research/iterations/iteration-004.md` (inferReviewModels details)
- `research/iterations/iteration-005.md` (fallback loop + child session creation)
- Local pattern references: `/tmp/015-dispatch-loop-resume.sh` (if still present) + 015 spec.md + 037 spec.md
- **No writes outside `research/iterations/iteration-008.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
# Pull prior iter content
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-004.md
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

# Local cross-AI pattern references
rg -l 'cli-devin|cli-opencode|cli-codex' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/spec.md 2>&1
rg -l 'cli-devin|cli-codex' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/037-system-code-graph-comprehensive-deep-review/ 2>&1 | head -5
```

## CONSTRAINTS

- READ-ONLY.
- Quote the `inferReviewModels` rank function VERBATIM (from iter-004 output).
- Render the algorithm as ASCII flowchart (no graphviz / external tools).
- Walkthrough must cover at least 3 starting work-model scenarios.
- Compare to AT LEAST 3 of our manual cross-AI patterns (015, 037, spec_kit:deep-review).

## COMMON FAILURE MODES

1. **Iter-004 not yet complete**: if iter-004 output is missing, the synthesis fails. Halt with `BLOCKED-ON-ITER-004` in your output.
2. **Stable-sort assumption**: V8's Array.sort is stable since 2019. Don't claim the rank function produces non-deterministic order within rank ties.
3. **Provider naming**: upstream uses `providerID/modelID` format. Don't confuse with `provider/model` (no slash in the inner half).

## OUTPUT FORMAT

Write to `research/iterations/iteration-008.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 008 — Cross-model selection (inferReviewModels + fallback chain)

## Summary
<2-4 sentences describing the algorithm + 1 sentence on the tradeoff vs our manual patterns>

## Files/Commands Reviewed
- `research/iterations/iteration-004.md` (rank function + filters)
- `research/iterations/iteration-005.md` (fallback loop + child session)
- Local: 015 spec.md, 037 spec.md (manual-pattern comparison)

## Findings

### Algorithm Flowchart (ASCII)
```text
<full ASCII flowchart from Step 3>
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
<similar table>

### Walkthrough 3: work-model = deepseek-v4-pro
<similar table — note that "pro" rank applies to MULTIPLE candidates, so the tie-break is by original list order from client.config.providers>

### Comparison Table — Upstream vs Our Manual Patterns
| Pattern | Where | Selection mechanism | Adaptive? | Pros | Cons |
|---------|-------|---------------------|-----------|------|------|
| Upstream auto-review | `inferReviewModels` | dynamic + family bias | YES | runtime-aware, robust to model unavailability | unpredictable ordering, harder to reproduce |
| 015 security sweep | `/tmp/015-*.sh` | hardcoded 20+5 split | NO | fully reproducible, controlled cost | rigid, can't adapt to model availability |
| 037 deep-review | iteration prompts | hardcoded 20+5 split | NO | same as 015 | same as 015 |
| spec_kit:deep-review skill | per-packet operator decision | manual | NO | operator stays in control | operator must research model fitness manually |

### Tradeoff Discussion
<paragraph: adaptability vs predictability vs reproducibility, and which fits our use cases>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate (0.4-0.6) since iter-004 had most of the algorithm; new info is the walkthroughs + comparison.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":8,"focus":"cross-model selection algorithm","mechanismsExtracted":1,"gapsIdentified":3,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] ASCII flowchart of full algorithm rendered
- [ ] Rank function quoted verbatim
- [ ] 3 walkthroughs (3 different starting work-models) with step-by-step tables
- [ ] Comparison table covers AT LEAST 3 manual patterns from our repo
- [ ] Tradeoff paragraph (adaptability/predictability/reproducibility)
- [ ] Output file ≥ 90 lines

Begin.
